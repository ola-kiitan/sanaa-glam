import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const [rules, blackoutDates] = await Promise.all([
    prisma.availabilityRule.findMany({ orderBy: { weekday: "asc" } }),
    prisma.blackoutDate.findMany({ orderBy: { startAt: "asc" } }),
  ]);

  return NextResponse.json({ rules, blackoutDates });
}
