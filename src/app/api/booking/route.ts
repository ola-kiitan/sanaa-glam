import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { Prisma, type Zone } from "@prisma/client";
import { NextResponse } from "next/server";
import { BOOKING_CUTOFF_HOURS, TIMEZONE } from "@/lib/constants";
import { sendBookingConfirmation } from "@/lib/email-triggers";
import { prisma } from "@/lib/prisma";
import { resolvePrice } from "@/lib/pricing";
import { bookingSchema } from "@/lib/validators";

const TIME_SLOT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

class SlotConflictError extends Error {
  constructor() {
    super("Selected slot is no longer available");
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (!TIME_SLOT_REGEX.test(data.timeSlot)) {
    return NextResponse.json({ error: "Invalid time slot format" }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const startAt = fromZonedTime(`${data.date}T${data.timeSlot}:00`, TIMEZONE);
    const endAt = addMinutes(startAt, service.durationMinutes);
    const cutoffUtc = new Date(Date.now() + BOOKING_CUTOFF_HOURS * 60 * 60 * 1000);

    if (startAt < cutoffUtc) {
      return NextResponse.json(
        { error: `Appointments must be booked at least ${BOOKING_CUTOFF_HOURS} hours in advance` },
        { status: 400 }
      );
    }

    const zone = data.locationType === "TRAVEL" ? (data.zone as Zone) : null;
    const resolvedPrice = resolvePrice(service, data.locationType, zone);

    const appointment = await prisma.$transaction(
      async (tx) => {
        const overlapCount = await tx.appointment.count({
          where: {
            status: "CONFIRMED",
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
        });

        if (overlapCount > 0) {
          throw new SlotConflictError();
        }

        const existingClient = await tx.client.findFirst({
          where: {
            email: data.clientDetails.email,
            phone: data.clientDetails.phone,
          },
          orderBy: { createdAt: "desc" },
        });

        const client = existingClient
          ? await tx.client.update({
              where: { id: existingClient.id },
              data: {
                fullName: data.clientDetails.fullName,
                address: data.locationType === "TRAVEL" ? (data.clientDetails.address ?? null) : null,
              },
            })
          : await tx.client.create({
              data: {
                fullName: data.clientDetails.fullName,
                email: data.clientDetails.email,
                phone: data.clientDetails.phone,
                address: data.locationType === "TRAVEL" ? (data.clientDetails.address ?? null) : null,
                tags: [],
              },
            });

        const createdAppointment = await tx.appointment.create({
          data: {
            serviceId: service.id,
            clientId: client.id,
            locationType: data.locationType,
            zone,
            startAt,
            endAt,
            price: resolvedPrice,
            status: "CONFIRMED",
          },
          include: {
            service: { select: { name: true } },
          },
        });

        await tx.intakeForm.create({
          data: {
            appointmentId: createdAppointment.id,
            skinType: data.intakeForm.skinType || null,
            allergies: data.intakeForm.allergies || null,
            occasion: data.intakeForm.occasion || null,
            glamLevel: data.intakeForm.glamLevel || null,
            inspirationUrl: data.intakeForm.inspirationUrl || null,
            clientNotes: data.intakeForm.clientNotes || null,
          },
        });

        return createdAppointment;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    void sendBookingConfirmation(appointment.id).catch((triggerError) => {
      console.error("Failed to trigger booking confirmation email:", triggerError);
    });

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      summary: {
        serviceName: appointment.service.name,
        date: data.date,
        time: data.timeSlot,
        locationType: data.locationType,
        zone,
        price: Number(appointment.price),
      },
    });
  } catch (error) {
    if (error instanceof SlotConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
