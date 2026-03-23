import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceBySlug, getServiceSlugs } from "@/lib/actions/services";
import { absoluteUrl } from "@/lib/seo";

const INCLUDED_ITEMS = [
  "Skin prep tailored to your skin type",
  "High-performance professional products",
  "Face, eye, and lip customization",
  "Setting and longevity finishing",
  "Personalized look consultation",
] as const;

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    return await getServiceSlugs();
  } catch {
    // If the database is unreachable at build time (e.g. Supabase pooler not ready),
    // return empty array so the build succeeds. Pages are generated on-demand at runtime
    // because dynamicParams defaults to true.
    return [];
  }
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.name,
    description: service.description,
    openGraph: {
      title: `${service.name} | Sanaa Glam`,
      description: service.description,
      url: absoluteUrl(`/services/${service.slug}`),
      type: "website",
      images: [{ url: absoluteUrl("/logo.png"), alt: "Sanaa Glam" }],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Sanaa Glam",
      url: absoluteUrl("/"),
    },
    areaServed: "Berlin, Germany",
    offers: [
      { "@type": "Offer", name: `${service.name} (Studio)`, priceCurrency: "EUR", price: service.studioPrice },
      { "@type": "Offer", name: `${service.name} (Zone 1)`, priceCurrency: "EUR", price: service.zone1Price },
      { "@type": "Offer", name: `${service.name} (Zone 2)`, priceCurrency: "EUR", price: service.zone2Price },
      { "@type": "Offer", name: `${service.name} (Zone 3)`, priceCurrency: "EUR", price: service.zone3Price },
    ],
  };

  return (
    <div className="py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6 px-0 text-muted-foreground hover:text-foreground">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border/60">
            <CardContent className="p-8">
              <Badge className="mb-4">Popular Service</Badge>
              <h1 className="font-serif text-4xl font-bold text-plum-dark">{service.name}</h1>
              <p className="mt-4 text-muted-foreground">{service.description}</p>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {service.durationMinutes} minutes
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Studio and Travel
                </span>
              </div>

              <div className="mt-8">
                <h2 className="font-serif text-2xl font-semibold text-plum-dark">What&apos;s Included</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {INCLUDED_ITEMS.map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit border-border/60">
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-semibold text-plum-dark">Pricing</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span>Studio</span>
                  <strong>EUR {service.studioPrice}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span>Zone 1</span>
                  <strong>EUR {service.zone1Price}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span>Zone 2</span>
                  <strong>EUR {service.zone2Price}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span>Zone 3</span>
                  <strong>EUR {service.zone3Price}</strong>
                </div>
              </div>

              <Button asChild className="mt-6 w-full rounded-full">
                <Link href={`/booking?service=${service.slug}`}>Book This Service</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
