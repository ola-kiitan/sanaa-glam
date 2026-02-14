import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { portfolioItemSchema } from "@/lib/validators";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return NextResponse.json(
        { error: "Portfolio table is missing. Run: npx prisma db push" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to load portfolio items." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const payload = await request.json();
  const parsed = portfolioItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const sortOrder = parsed.data.sortOrder ?? (await prisma.portfolioItem.count());

    const item = await prisma.portfolioItem.create({
      data: {
        ...parsed.data,
        sortOrder,
        isPublished: parsed.data.isPublished ?? true,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "This image already exists in portfolio (duplicate publicId)." },
          { status: 409 }
        );
      }
      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          { error: "Portfolio table is missing. Run: npx prisma db push" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ error: "Failed to save portfolio item." }, { status: 500 });
  }
}
