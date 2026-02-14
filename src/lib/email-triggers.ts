import { subHours, addHours } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { MessageType, Prisma } from "@prisma/client";
import type { ReactElement } from "react";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";
import { CancellationEmail } from "@/emails/cancellation";
import { FollowUpEmail } from "@/emails/follow-up";
import { Reminder24hEmail } from "@/emails/reminder-24h";
import { Reminder48hEmail } from "@/emails/reminder-48h";
import { TIMEZONE } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type AppointmentEmailData = {
  id: string;
  startAt: Date;
  locationType: "STUDIO" | "TRAVEL";
  zone: "ZONE_1" | "ZONE_2" | "ZONE_3" | null;
  serviceName: string;
  price: number;
  clientName: string;
  clientEmail: string;
};

function buildSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function formatDateLabel(date: Date) {
  return formatInTimeZone(date, TIMEZONE, "EEEE, dd MMM yyyy");
}

function formatTimeLabel(date: Date) {
  return `${formatInTimeZone(date, TIMEZONE, "HH:mm")} (${TIMEZONE})`;
}

function locationLabel(locationType: AppointmentEmailData["locationType"], zone: AppointmentEmailData["zone"]) {
  if (locationType === "STUDIO") {
    return "Studio";
  }

  if (!zone) {
    return "Travel";
  }

  return `Travel (${zone.replace("_", " ")})`;
}

async function getAppointmentEmailData(appointmentId: string): Promise<AppointmentEmailData | null> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: { select: { name: true } },
      client: { select: { fullName: true, email: true } },
    },
  });

  if (!appointment) {
    return null;
  }

  return {
    id: appointment.id,
    startAt: appointment.startAt,
    locationType: appointment.locationType,
    zone: appointment.zone,
    serviceName: appointment.service.name,
    price: Number(appointment.price),
    clientName: appointment.client.fullName,
    clientEmail: appointment.client.email,
  };
}

async function hasMessageLog(appointmentId: string, messageType: MessageType): Promise<boolean> {
  const count = await prisma.messageLog.count({
    where: {
      appointmentId,
      messageType,
    },
  });

  return count > 0;
}

async function recordMessageLog(appointmentId: string, messageType: MessageType): Promise<boolean> {
  try {
    await prisma.messageLog.create({
      data: {
        appointmentId,
        messageType,
      },
    });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return false;
    }

    throw error;
  }
}

async function sendAndLogMessage({
  appointmentId,
  messageType,
  subject,
  react,
  recipient,
}: {
  appointmentId: string;
  messageType: MessageType;
  subject: string;
  react: ReactElement;
  recipient: string;
}): Promise<boolean> {
  const alreadyLogged = await hasMessageLog(appointmentId, messageType);
  if (alreadyLogged) {
    return false;
  }

  const sent = await sendEmail(recipient, subject, react);
  if (!sent) {
    return false;
  }

  await recordMessageLog(appointmentId, messageType);
  return true;
}

export async function sendBookingConfirmation(appointmentId: string): Promise<boolean> {
  const appointment = await getAppointmentEmailData(appointmentId);
  if (!appointment) {
    return false;
  }

  return sendAndLogMessage({
    appointmentId,
    messageType: MessageType.CONFIRMATION,
    subject: "Your Sanaa Glam Appointment is Confirmed",
    recipient: appointment.clientEmail,
    react: BookingConfirmationEmail({
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      dateLabel: formatDateLabel(appointment.startAt),
      timeLabel: formatTimeLabel(appointment.startAt),
      locationLabel: locationLabel(appointment.locationType, appointment.zone),
      priceLabel: `EUR ${appointment.price.toFixed(2)}`,
    }),
  });
}

export async function sendReminder48h(appointmentId: string): Promise<boolean> {
  const appointment = await getAppointmentEmailData(appointmentId);
  if (!appointment) {
    return false;
  }

  return sendAndLogMessage({
    appointmentId,
    messageType: MessageType.REMINDER_48H,
    subject: "Reminder: Your Appointment in 2 Days",
    recipient: appointment.clientEmail,
    react: Reminder48hEmail({
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      dateLabel: formatDateLabel(appointment.startAt),
      timeLabel: formatTimeLabel(appointment.startAt),
      locationLabel: locationLabel(appointment.locationType, appointment.zone),
    }),
  });
}

export async function sendReminder24h(appointmentId: string): Promise<boolean> {
  const appointment = await getAppointmentEmailData(appointmentId);
  if (!appointment) {
    return false;
  }

  return sendAndLogMessage({
    appointmentId,
    messageType: MessageType.REMINDER_24H,
    subject: "Tomorrow: Your Sanaa Glam Appointment",
    recipient: appointment.clientEmail,
    react: Reminder24hEmail({
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      dateLabel: formatDateLabel(appointment.startAt),
      timeLabel: formatTimeLabel(appointment.startAt),
      locationLabel: locationLabel(appointment.locationType, appointment.zone),
    }),
  });
}

export async function sendCancellationEmail(appointmentId: string): Promise<boolean> {
  const appointment = await getAppointmentEmailData(appointmentId);
  if (!appointment) {
    return false;
  }

  return sendAndLogMessage({
    appointmentId,
    messageType: MessageType.CANCELLATION,
    subject: "Appointment Cancelled - Sanaa Glam",
    recipient: appointment.clientEmail,
    react: CancellationEmail({
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      dateLabel: formatDateLabel(appointment.startAt),
      timeLabel: formatTimeLabel(appointment.startAt),
      bookingUrl: `${buildSiteUrl()}/booking`,
    }),
  });
}

export async function sendFollowUpEmail(appointmentId: string): Promise<boolean> {
  const appointment = await getAppointmentEmailData(appointmentId);
  if (!appointment) {
    return false;
  }

  return sendAndLogMessage({
    appointmentId,
    messageType: MessageType.FOLLOW_UP,
    subject: "Thank You! How Was Your Experience?",
    recipient: appointment.clientEmail,
    react: FollowUpEmail({
      clientName: appointment.clientName,
      serviceName: appointment.serviceName,
      reviewUrl: "https://g.page/r/your-google-review-link",
      bookingUrl: `${buildSiteUrl()}/booking`,
    }),
  });
}

export async function getReminderCandidates() {
  const now = new Date();

  const [reminder48h, reminder24h, followUp] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        startAt: {
          gte: now,
          lte: addHours(now, 48),
        },
        messages: {
          none: {
            messageType: MessageType.REMINDER_48H,
          },
        },
      },
      select: { id: true },
    }),
    prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        startAt: {
          gte: now,
          lte: addHours(now, 24),
        },
        messages: {
          none: {
            messageType: MessageType.REMINDER_24H,
          },
        },
      },
      select: { id: true },
    }),
    prisma.appointment.findMany({
      where: {
        status: "COMPLETED",
        startAt: {
          gte: subHours(now, 72),
          lte: subHours(now, 48),
        },
        messages: {
          none: {
            messageType: MessageType.FOLLOW_UP,
          },
        },
      },
      select: { id: true },
    }),
  ]);

  return {
    reminder48hIds: reminder48h.map((appointment) => appointment.id),
    reminder24hIds: reminder24h.map((appointment) => appointment.id),
    followUpIds: followUp.map((appointment) => appointment.id),
  };
}
