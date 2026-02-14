import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { service: true, intakeForm: true, messages: true },
        orderBy: { startAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const serialized = {
    ...client,
    appointments: client.appointments.map((appointment) => ({
      ...appointment,
      price: Number(appointment.price),
      service: {
        ...appointment.service,
        studioPrice: Number(appointment.service.studioPrice),
        zone1Price: Number(appointment.service.zone1Price),
        zone2Price: Number(appointment.service.zone2Price),
        zone3Price: Number(appointment.service.zone3Price),
      },
    })),
  };

  return NextResponse.json(serialized, {
    headers: {
      "Content-Disposition": `attachment; filename=client-${id}-export.json`,
    },
  });
}
