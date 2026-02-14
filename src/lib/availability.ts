import { addMinutes, eachDayOfInterval, endOfMonth, isBefore, parse, startOfMonth } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { type LocationType, Prisma, PrismaClient } from "@prisma/client";
import { BOOKING_CUTOFF_HOURS, TIMEZONE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import type { TimeSlot } from "@/types";

const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_FORMAT_REGEX = /^\d{4}-\d{2}$/;

type PrismaLike = PrismaClient | Prisma.TransactionClient;

function parseTimeToMinutes(time: string): number {
  const match = TIME_FORMAT_REGEX.exec(time);
  if (!match) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const [, hours, minutes] = match;
  return Number(hours) * 60 + Number(minutes);
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function dateWeekdayInBerlin(date: string): number {
  const noonUtc = new Date(`${date}T12:00:00.000Z`);
  const isoDay = Number(formatInTimeZone(noonUtc, TIMEZONE, "i")); // 1..7
  return isoDay % 7; // 0..6 (Sunday=0)
}

function getBerlinDayBoundsUtc(date: string): { dayStartUtc: Date; dayEndUtc: Date } {
  return {
    dayStartUtc: fromZonedTime(`${date}T00:00:00`, TIMEZONE),
    dayEndUtc: fromZonedTime(`${date}T23:59:59.999`, TIMEZONE),
  };
}

export async function isSlotAvailable(
  startAt: Date,
  endAt: Date,
  db: PrismaLike = prisma
): Promise<boolean> {
  const overlapCount = await db.appointment.count({
    where: {
      status: "CONFIRMED",
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });

  return overlapCount === 0;
}

export async function getAvailableSlots(
  date: string,
  serviceId: string,
  locationType: LocationType,
  db: PrismaLike = prisma
): Promise<TimeSlot[]> {
  if (!DATE_FORMAT_REGEX.test(date)) {
    throw new Error("date must be in YYYY-MM-DD format");
  }

  const weekday = dateWeekdayInBerlin(date);

  const [service, rule] = await Promise.all([
    db.service.findUnique({ where: { id: serviceId } }),
    db.availabilityRule.findUnique({ where: { weekday } }),
  ]);

  if (!service || !service.isActive || !rule) {
    return [];
  }

  if (locationType === "TRAVEL" && !rule.allowTravel) {
    return [];
  }

  const { dayStartUtc, dayEndUtc } = getBerlinDayBoundsUtc(date);

  const blackout = await db.blackoutDate.findFirst({
    where: {
      startAt: { lte: dayEndUtc },
      endAt: { gte: dayStartUtc },
    },
    select: { id: true },
  });

  if (blackout) {
    return [];
  }

  const appointments = await db.appointment.findMany({
    where: {
      status: "CONFIRMED",
      startAt: { lte: dayEndUtc },
      endAt: { gte: dayStartUtc },
    },
    select: {
      startAt: true,
      endAt: true,
    },
  });

  const duration = service.durationMinutes;
  const slotStep = duration + rule.bufferMinutes;
  const startMinutes = parseTimeToMinutes(rule.startTime);
  const endMinutes = parseTimeToMinutes(rule.endTime);
  const cutoffUtc = new Date(Date.now() + BOOKING_CUTOFF_HOURS * 60 * 60 * 1000);

  const slots: TimeSlot[] = [];

  for (let slotStart = startMinutes; slotStart + duration <= endMinutes; slotStart += slotStep) {
    const slotTime = minutesToTime(slotStart);
    const slotStartUtc = fromZonedTime(`${date}T${slotTime}:00`, TIMEZONE);
    const slotEndUtc = addMinutes(slotStartUtc, duration);

    const overlapsExisting = appointments.some(
      (appointment) => appointment.startAt < slotEndUtc && appointment.endAt > slotStartUtc
    );

    const insideCutoff = isBefore(slotStartUtc, cutoffUtc);

    slots.push({
      time: slotTime,
      available: !overlapsExisting && !insideCutoff,
    });
  }

  return slots;
}

export async function getAvailableDates(
  month: string,
  serviceId: string,
  locationType: LocationType,
  db: PrismaLike = prisma
): Promise<string[]> {
  if (!MONTH_FORMAT_REGEX.test(month)) {
    throw new Error("month must be in YYYY-MM format");
  }

  const monthStart = parse(`${month}-01`, "yyyy-MM-dd", new Date());
  const monthEnd = endOfMonth(monthStart);
  const monthStartUtc = fromZonedTime(`${formatInTimeZone(monthStart, TIMEZONE, "yyyy-MM-dd")}T00:00:00`, TIMEZONE);
  const monthEndUtc = fromZonedTime(`${formatInTimeZone(monthEnd, TIMEZONE, "yyyy-MM-dd")}T23:59:59.999`, TIMEZONE);

  const [service, rules, blackouts, appointments] = await Promise.all([
    db.service.findUnique({ where: { id: serviceId } }),
    db.availabilityRule.findMany(),
    db.blackoutDate.findMany({
      where: {
        startAt: { lte: monthEndUtc },
        endAt: { gte: monthStartUtc },
      },
      select: { startAt: true, endAt: true },
    }),
    db.appointment.findMany({
      where: {
        status: "CONFIRMED",
        startAt: { lte: monthEndUtc },
        endAt: { gte: monthStartUtc },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  if (!service || !service.isActive) {
    return [];
  }

  const rulesByWeekday = new Map(rules.map((rule) => [rule.weekday, rule]));
  const duration = service.durationMinutes;
  const cutoffUtc = new Date(Date.now() + BOOKING_CUTOFF_HOURS * 60 * 60 * 1000);

  const days = eachDayOfInterval({
    start: startOfMonth(monthStart),
    end: monthEnd,
  });

  const availableDates: string[] = [];

  for (const day of days) {
    const date = formatInTimeZone(day, TIMEZONE, "yyyy-MM-dd");
    const weekday = dateWeekdayInBerlin(date);
    const rule = rulesByWeekday.get(weekday);

    if (!rule) {
      continue;
    }

    if (locationType === "TRAVEL" && !rule.allowTravel) {
      continue;
    }

    const { dayStartUtc, dayEndUtc } = getBerlinDayBoundsUtc(date);
    const dayHasBlackout = blackouts.some(
      (blackout) => blackout.startAt <= dayEndUtc && blackout.endAt >= dayStartUtc
    );

    if (dayHasBlackout) {
      continue;
    }

    const dayAppointments = appointments.filter(
      (appointment) => appointment.startAt <= dayEndUtc && appointment.endAt >= dayStartUtc
    );

    const slotStep = duration + rule.bufferMinutes;
    const startMinutes = parseTimeToMinutes(rule.startTime);
    const endMinutes = parseTimeToMinutes(rule.endTime);
    let hasAnyAvailableSlot = false;

    for (let slotStart = startMinutes; slotStart + duration <= endMinutes; slotStart += slotStep) {
      const slotTime = minutesToTime(slotStart);
      const slotStartUtc = fromZonedTime(`${date}T${slotTime}:00`, TIMEZONE);
      const slotEndUtc = addMinutes(slotStartUtc, duration);
      if (isBefore(slotStartUtc, cutoffUtc)) {
        continue;
      }

      const overlapsExisting = dayAppointments.some(
        (appointment) => appointment.startAt < slotEndUtc && appointment.endAt > slotStartUtc
      );

      if (!overlapsExisting) {
        hasAnyAvailableSlot = true;
        break;
      }
    }

    if (hasAnyAvailableSlot) {
      availableDates.push(date);
    }
  }

  return availableDates;
}

export function validateLocationType(value: string | null): LocationType | null {
  if (value === "STUDIO" || value === "TRAVEL") {
    return value;
  }
  return null;
}
