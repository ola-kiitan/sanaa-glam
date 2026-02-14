import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { AppointmentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { TIMEZONE } from "@/lib/constants";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const serviceId = searchParams.get("serviceId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const statusFilter = status && Object.values(AppointmentStatus).includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : undefined;

  const appointments = await prisma.appointment.findMany({
    where: {
      status: statusFilter,
      serviceId: serviceId || undefined,
      ...(from || to
        ? {
            startAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: {
      service: { select: { id: true, name: true } },
      client: { select: { id: true, fullName: true, email: true, phone: true } },
      intakeForm: true,
      messages: true,
    },
    orderBy: { startAt: "desc" },
  });

  return NextResponse.json({
    appointments: appointments.map((appointment) => ({
      ...appointment,
      price: Number(appointment.price),
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json()) as {
    serviceId: string;
    fullName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    locationType: "STUDIO" | "TRAVEL";
    zone?: "ZONE_1" | "ZONE_2" | "ZONE_3";
    address?: string;
    price?: number;
  };

  if (!body.serviceId || !body.fullName || !body.email || !body.phone || !body.date || !body.time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const startAt = fromZonedTime(`${body.date}T${body.time}:00`, TIMEZONE);
  const endAt = addMinutes(startAt, service.durationMinutes);

  const overlap = await prisma.appointment.count({
    where: {
      status: "CONFIRMED",
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });

  if (overlap > 0) {
    return NextResponse.json({ error: "Time slot already occupied" }, { status: 409 });
  }

  const client = await prisma.client.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.locationType === "TRAVEL" ? body.address ?? null : null,
      tags: [],
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      serviceId: body.serviceId,
      clientId: client.id,
      locationType: body.locationType,
      zone: body.locationType === "TRAVEL" ? body.zone : null,
      startAt,
      endAt,
      price: body.price ?? Number(service.studioPrice),
      status: "CONFIRMED",
    },
  });

  return NextResponse.json({
    appointment: {
      ...appointment,
      price: Number(appointment.price),
    },
  });
}
