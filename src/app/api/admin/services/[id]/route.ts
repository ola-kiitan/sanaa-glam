import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;
  const payload = await request.json();
  const parsed = serviceSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const service = await prisma.service.update({
    where: { id },
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

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;

  const service = await prisma.service.update({
    where: { id },
    data: { isActive: false },
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
