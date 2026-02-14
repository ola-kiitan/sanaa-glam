import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { portfolioItemSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;
  const payload = await request.json();
  const parsed = portfolioItemSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const item = await prisma.portfolioItem.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
      }
      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          { error: "Portfolio table is missing. Run: npx prisma db push" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ error: "Failed to update portfolio item." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;
  try {
    await prisma.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
      }
      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          { error: "Portfolio table is missing. Run: npx prisma db push" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ error: "Failed to delete portfolio item." }, { status: 500 });
  }
}
