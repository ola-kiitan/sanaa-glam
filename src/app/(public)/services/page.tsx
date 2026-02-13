import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/shared/animate-in";
import { ZONES } from "@/lib/constants";

/**
 * Services Page — Lists all available makeup services with pricing.
 * 
 * Features scroll-triggered animations on each card and hover-lift effects
 * on the pricing tiles for a modern interactive feel.
 * 
 * TODO: Replace placeholder data with real services from database (Phase 2).
 */
export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse our makeup services including bridal, glam, and natural looks. Studio and travel appointments available.",
};

// Placeholder services data — will be replaced with database query
const PLACEHOLDER_SERVICES = [
  {
    id: "1",
    name: "Bridal Makeup",
    slug: "bridal-makeup",
    description:
      "Your perfect look for the most important day. Includes a consultation to match your vision, a long-lasting application with premium products, and touch-up kit.",
    durationMinutes: 90,
    studioPrice: 180,
    zone1Price: 200,
    zone2Price: 220,
    zone3Price: 250,
  },
  {
    id: "2",
    name: "Glam Makeup",
    slug: "glam-makeup",
    description:
      "Stunning looks for special events, parties, and photoshoots. Choose from soft glam to full editorial intensity. Customized to your style and occasion.",
    durationMinutes: 60,
    studioPrice: 120,
    zone1Price: 140,
    zone2Price: 160,
    zone3Price: 180,
  },
  {
    id: "3",
    name: "Natural Beauty",
    slug: "natural-beauty",
    description:
      "Enhance your natural features with a fresh, radiant look. Perfect for everyday wear, business meetings, or casual events. Lightweight and breathable.",
    durationMinutes: 45,
    studioPrice: 80,
    zone1Price: 100,
    zone2Price: 120,
    zone3Price: 140,
  },
];

export default function ServicesPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Page Header with entrance animation ---- */}
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Pricing & Packages
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
              Our Services
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Professional makeup artistry tailored to your occasion. All services
              available at our studio or as travel appointments with transparent
              zone-based pricing.
            </p>
          </div>
        </AnimateIn>

        {/* ---- Zone Pricing Legend ---- */}
        <AnimateIn delay={150}>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-center text-sm font-semibold text-plum-dark">
              Travel Zone Pricing
            </h3>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {Object.entries(ZONES).map(([key, zone]) => (
                <Badge key={key} variant="secondary" className="rounded-full text-xs">
                  {zone.label}: {zone.distance}
                </Badge>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* ---- Service Cards with staggered scroll reveal ---- */}
        <div className="mt-14 grid gap-8 lg:grid-cols-1">
          {PLACEHOLDER_SERVICES.map((service, index) => (
            <AnimateIn key={service.id} delay={index * 150}>
              <Card className="hover-lift overflow-hidden border-border/50">
                <CardHeader className="bg-gradient-to-r from-peach/5 to-transparent">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="font-serif text-2xl text-plum-dark">
                        {service.name}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {service.durationMinutes} minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Studio & Travel
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        From
                      </p>
                      <p className="font-serif text-3xl font-bold text-primary">
                        €{service.studioPrice}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{service.description}</p>

                  {/* Price tiles with hover scale effect */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Studio", price: service.studioPrice },
                      { label: "Zone 1", price: service.zone1Price },
                      { label: "Zone 2", price: service.zone2Price },
                      { label: "Zone 3", price: service.zone3Price },
                    ].map((tier) => (
                      <div
                        key={tier.label}
                        className="rounded-xl bg-secondary/50 p-3 text-center transition-all duration-200 hover:scale-105 hover:bg-secondary"
                      >
                        <p className="text-xs text-muted-foreground">{tier.label}</p>
                        <p className="mt-1 text-lg font-semibold text-plum-dark">
                          €{tier.price}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button asChild className="rounded-full px-6">
                      <Link href={`/booking?service=${service.slug}`}>
                        Book This Service
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          ))}
        </div>
      </div>
    </div>
  );
}
