"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_CATEGORY_LABELS } from "@/lib/constants";
import type { PortfolioItemForDisplay } from "@/types";

type Category = "ALL" | "BRIDAL" | "GLAM" | "NATURAL" | "EDITORIAL";

const CATEGORIES: Category[] = ["ALL", "BRIDAL", "GLAM", "NATURAL", "EDITORIAL"];

type GalleryItem = PortfolioItemForDisplay & {
  category: Exclude<Category, "ALL">;
};

export function PortfolioGallery({ items }: { items: PortfolioItemForDisplay[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(
    () =>
      (activeCategory === "ALL"
        ? items
        : items.filter((item) => item.category === activeCategory)) as GalleryItem[],
    [activeCategory, items]
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory(category)}
          >
            {category === "ALL" ? "All" : PORTFOLIO_CATEGORY_LABELS[category]}
          </Button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border/70 bg-background/60 p-10 text-center">
          <p className="text-base font-medium text-plum-dark">No portfolio images yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">New uploads from the admin dashboard will appear here automatically.</p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="group relative overflow-hidden rounded-2xl border border-border/50"
            onClick={() => setActiveItem(item)}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={item.imageUrl}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-plum-dark/70 via-plum-dark/0 to-transparent p-3">
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-peach-light/80">{PORTFOLIO_CATEGORY_LABELS[item.category]}</p>
                <p className="text-sm font-medium text-white">{item.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-3xl border-border/60 bg-background p-3 sm:p-4">
          <DialogTitle className="sr-only">Portfolio Image</DialogTitle>
          {activeItem ? (
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={activeItem.imageUrl} alt={activeItem.alt} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{PORTFOLIO_CATEGORY_LABELS[activeItem.category]}</p>
                <p className="font-serif text-xl font-semibold text-plum-dark">{activeItem.title}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
