import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { blackoutDateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const payload = await request.json();
  const parsed = blackoutDateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const startAt = parsed.data.startAt.includes("T")
    ? new Date(parsed.data.startAt)
    : new Date(`${parsed.data.startAt}T00:00:00`);
  const endAt = parsed.data.endAt.includes("T")
    ? new Date(parsed.data.endAt)
    : new Date(`${parsed.data.endAt}T23:59:59`);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return NextResponse.json({ error: "Invalid start or end date" }, { status: 400 });
  }

  if (endAt < startAt) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  const blackout = await prisma.blackoutDate.create({
    data: {
      startAt,
      endAt,
      reason: parsed.data.reason,
    },
  });

  return NextResponse.json({ blackout });
}
