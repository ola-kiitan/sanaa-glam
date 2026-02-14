import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validators";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    services: services.map((service) => ({
      ...service,
      studioPrice: Number(service.studioPrice),
      zone1Price: Number(service.zone1Price),
      zone2Price: Number(service.zone2Price),
      zone3Price: Number(service.zone3Price),
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const payload = await request.json();
  const parsed = serviceSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: parsed.data,
  });

  return NextResponse.json({
    service: {
      ...service,
      studioPrice: Number(service.studioPrice),
      zone1Price: Number(service.zone1Price),
      zone2Price: Number(service.zone2Price),
      zone3Price: Number(service.zone3Price),
    },
  });
}
