import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { portfolioReorderSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const payload = await request.json();
  const parsed = portfolioReorderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      parsed.data.ids.map((id, index) =>
        prisma.portfolioItem.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          { error: "Portfolio table is missing. Run: npx prisma db push" },
          { status: 500 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json({ error: "One or more portfolio items were not found." }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Failed to reorder portfolio items." }, { status: 500 });
  }
}
