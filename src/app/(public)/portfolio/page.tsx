import type { Metadata } from "next";
import { AnimateIn } from "@/components/shared/animate-in";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { getPublishedPortfolioItems } from "@/lib/actions/portfolio";
import { absoluteUrl } from "@/lib/seo";

/**
 * Portfolio Page — Showcase of previous makeup work.
 * 
 * Placeholder grid with gradient tiles and hover effects.
 * Each tile fades in with a staggered delay on scroll.
 * 
 * TODO: Phase 6 — Implement lazy-loaded image gallery with lightbox.
 * Images will be served from Cloudinary with Next.js Image optimization.
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore bridal, glam, natural, and editorial looks by Sanaa Glam.",
  openGraph: {
    title: "Portfolio | Sanaa Glam",
    description: "Explore bridal, glam, natural, and editorial looks by Sanaa Glam.",
    url: absoluteUrl("/portfolio"),
    images: [{ url: absoluteUrl("/logo.png"), alt: "Sanaa Glam" }],
  },
};

export default async function PortfolioPage() {
  const items = await getPublishedPortfolioItems();

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Our Work</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">Portfolio</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Browse a curated gallery of recent bridal, glam, natural, and editorial looks.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={120}>
          <PortfolioGallery items={items} />
        </AnimateIn>
      </div>
    </div>
  );
}
