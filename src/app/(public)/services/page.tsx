import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/shared/animate-in";
import { ZONES } from "@/lib/constants";
import { getActiveServices } from "@/lib/actions/services";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse our makeup services including bridal, glam, and natural looks. Studio and travel appointments available.",
  openGraph: {
    title: "Services | Sanaa Glam",
    description:
      "Browse our makeup services including bridal, glam, and natural looks. Studio and travel appointments available.",
    url: absoluteUrl("/services"),
    images: [{ url: absoluteUrl("/logo.png"), alt: "Sanaa Glam" }],
  },
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/services/${service.slug}`),
      name: service.name,
    })),
  };

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Pricing & Packages</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">Our Services</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Professional makeup artistry tailored to your occasion. All services
              available at our studio or as travel appointments with transparent
              zone-based pricing.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={150}>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-center text-sm font-semibold text-plum-dark">Travel Zone Pricing</h3>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {Object.entries(ZONES).map(([key, zone]) => (
                <Badge key={key} variant="secondary" className="rounded-full text-xs">
                  {zone.label}: {zone.distance}
                </Badge>
              ))}
            </div>
          </div>
        </AnimateIn>

        <div className="mt-14 grid gap-8 lg:grid-cols-1">
          {services.map((service, index) => (
            <AnimateIn key={service.id} delay={index * 150}>
              <Card className="hover-lift overflow-hidden border-border/50">
                <CardHeader className="bg-gradient-to-r from-peach/5 to-transparent">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="font-serif text-2xl text-plum-dark">{service.name}</CardTitle>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{service.durationMinutes} minutes</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />Studio & Travel</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From</p>
                      <p className="font-serif text-3xl font-bold text-primary">€{service.studioPrice}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{service.description}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Studio", price: service.studioPrice },
                      { label: "Zone 1", price: service.zone1Price },
                      { label: "Zone 2", price: service.zone2Price },
                      { label: "Zone 3", price: service.zone3Price },
                    ].map((tier) => (
                      <div key={tier.label} className="rounded-xl bg-secondary/50 p-3 text-center transition-all duration-200 hover:scale-105 hover:bg-secondary">
                        <p className="text-xs text-muted-foreground">{tier.label}</p>
                        <p className="mt-1 text-lg font-semibold text-plum-dark">€{tier.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full px-6">
                      <Link href={`/booking?service=${service.slug}`}>Book This Service<ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full px-6">
                      <Link href={`/services/${service.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          ))}
        </div>

        {services.length === 0 && (
          <AnimateIn>
            <div className="mt-14 text-center">
              <p className="text-lg text-muted-foreground">No services available at the moment. Please check back soon!</p>
            </div>
          </AnimateIn>
        )}
      </div>
    </div>
  );
}
