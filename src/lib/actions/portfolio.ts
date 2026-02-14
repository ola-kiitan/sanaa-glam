import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PortfolioItemForDisplay } from "@/types";

function toDisplayItem(item: {
  id: string;
  title: string;
  alt: string;
  category: "BRIDAL" | "GLAM" | "NATURAL" | "EDITORIAL";
  imageUrl: string;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  sortOrder: number;
}): PortfolioItemForDisplay {
  return {
    id: item.id,
    title: item.title,
    alt: item.alt,
    category: item.category,
    imageUrl: item.imageUrl,
    width: item.width,
    height: item.height,
    blurDataUrl: item.blurDataUrl,
    sortOrder: item.sortOrder,
  };
}

export async function getPublishedPortfolioItems(): Promise<PortfolioItemForDisplay[]> {
  try {
    const items = await prisma.portfolioItem.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        alt: true,
        category: true,
        imageUrl: true,
        width: true,
        height: true,
        blurDataUrl: true,
        sortOrder: true,
      },
    });

    return items.map((item) =>
      toDisplayItem({
        ...item,
        category: item.category as "BRIDAL" | "GLAM" | "NATURAL" | "EDITORIAL",
      })
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return [];
    }
    throw error;
  }
}

export async function getAllPortfolioItemsForAdmin() {
  try {
    return await prisma.portfolioItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        alt: true,
        category: true,
        imageUrl: true,
        publicId: true,
        width: true,
        height: true,
        blurDataUrl: true,
        isPublished: true,
        sortOrder: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return [];
    }
    throw error;
  }
}
