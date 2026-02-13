import type { Metadata } from "next";
import { AnimateIn } from "@/components/shared/animate-in";

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
  description: "Browse our portfolio of makeup looks including bridal, glam, and natural styles.",
};

export default function PortfolioPage() {
  // Placeholder items — each will become a real portfolio image
  const placeholderGradients = [
    "from-peach/20 to-peach-light/40",
    "from-plum/10 to-plum-light/20",
    "from-peach-light/30 to-cream",
    "from-plum-light/15 to-peach/15",
    "from-peach/15 to-plum/10",
    "from-cream to-peach-light/25",
  ];

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Our Work
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
              Portfolio
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A collection of our recent work. From bridal glam to natural beauty,
              every look is crafted with care.
            </p>
          </div>
        </AnimateIn>

        {/* Portfolio grid with staggered scroll reveal + hover zoom */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderGradients.map((gradient, i) => (
            <AnimateIn key={i} delay={i * 100}>
              <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl">
                {/* Gradient placeholder — will be replaced with real images */}
                <div
                  className={`h-full w-full bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-plum-dark/0 transition-colors duration-300 group-hover:bg-plum-dark/20" />
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={600}>
          <p className="mt-14 text-center text-sm text-muted-foreground">
            Portfolio images coming soon. Follow us on Instagram for our latest work!
          </p>
        </AnimateIn>
      </div>
    </div>
  );
}
