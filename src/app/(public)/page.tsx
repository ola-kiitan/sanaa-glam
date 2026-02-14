import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";
import { getActiveServices } from "@/lib/actions/services";
import { getPublishedPortfolioItems } from "@/lib/actions/portfolio";
import { ReviewPlayer } from "@/components/reviews/review-player";
import { absoluteUrl } from "@/lib/seo";

const SERVICE_GRADIENTS = {
  BRIDAL: "from-peach/20 to-peach-light/30",
  GLAM: "from-plum/10 to-plum-light/20",
  NATURAL: "from-peach-light/20 to-cream",
  EDITORIAL: "from-plum-light/15 to-peach/15",
} as const;

type PortfolioCategory = "BRIDAL" | "GLAM" | "NATURAL" | "EDITORIAL";

function inferServiceCategory(service: { slug: string; name: string; description: string }): PortfolioCategory {
  const haystack = `${service.slug} ${service.name} ${service.description}`.toLowerCase();
  if (haystack.includes("bridal") || haystack.includes("wedding")) return "BRIDAL";
  if (haystack.includes("natural")) return "NATURAL";
  if (haystack.includes("editorial")) return "EDITORIAL";
  return "GLAM";
}

export const metadata: Metadata = {
  title: "Sanaa Glam - Professional Makeup Artist",
  description: "Professional makeup services in Berlin. Studio and travel appointments for bridal, glam, and natural looks.",
  openGraph: {
    title: "Sanaa Glam - Professional Makeup Artist",
    description: "Professional makeup services in Berlin. Studio and travel appointments for bridal, glam, and natural looks.",
    url: absoluteUrl("/"),
    images: [{ url: absoluteUrl("/logo.png"), alt: "Sanaa Glam" }],
  },
};

export default async function HomePage() {
  const allServices = await getActiveServices();
  const previewServices = allServices.slice(0, 3);
  const portfolioItems = await getPublishedPortfolioItems();
  const portfolioByCategory = new Map<PortfolioCategory, (typeof portfolioItems)[number]>();

  for (const item of portfolioItems) {
    if (!portfolioByCategory.has(item.category)) {
      portfolioByCategory.set(item.category, item);
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sanaa Glam",
    image: absoluteUrl("/logo.png"),
    url: absoluteUrl("/"),
    telephone: "+49 123 456 7890",
    email: "hello@sanaaglam.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Musterstraße 1",
      addressLocality: "Berlin",
      postalCode: "10115",
      addressCountry: "DE",
    },
    areaServed: "Berlin, Germany",
    priceRange: "€€",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-plum-dark via-plum to-plum-light">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-plum-dark via-plum/90 to-plum-light/80 opacity-95" />
        <div className="animate-float absolute -top-20 -right-20 h-72 w-72 rounded-full bg-peach/5 blur-3xl" />
        <div className="animate-float absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-plum-light/20 blur-3xl [animation-delay:2s]" />
        <div className="animate-float absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-peach/5 blur-2xl [animation-delay:4s]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-scale-in">
            <Image src="/logo.png" alt="Sanaa Glam" width={120} height={120} className="mx-auto rounded-full" priority />
          </div>

          <h1 className="animate-slide-up stagger-2 mt-8 font-serif text-5xl font-bold tracking-tight text-peach sm:text-6xl lg:text-7xl">Sanaa Glam</h1>
          <div className="animate-fade-in stagger-3 mx-auto mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-peach/30" />
            <Heart className="h-4 w-4 text-peach/50" />
            <div className="h-px w-12 bg-peach/30" />
          </div>
          <p className="animate-slide-up stagger-4 mt-6 font-serif text-xl italic tracking-wide text-peach-light/90 sm:text-2xl lg:text-3xl">You&apos;re a work of art</p>

          <div className="animate-slide-up stagger-5 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="animate-pulse-glow rounded-full px-8 text-base">
              <Link href="/booking">Book Your Appointment<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-peach/30 px-8 text-base text-peach hover:bg-peach/10">
              <Link href="/services">View Services</Link>
            </Button>
          </div>

          <div className="animate-fade-in stagger-7 mt-16"><div className="mx-auto h-8 w-px animate-bounce bg-gradient-to-b from-peach/0 via-peach/40 to-peach/0" /></div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">What We Offer</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-plum-dark sm:text-4xl">Our Services</h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">From natural everyday looks to full editorial glam - every look is crafted with artistry and care.</p>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {previewServices.map((service, index) => {
              const category = inferServiceCategory(service);
              const previewImage = portfolioByCategory.get(category);
              const gradient = SERVICE_GRADIENTS[category];

              return (
                <AnimateIn key={service.id} delay={100 + index * 150}>
                  {/* Modern card: full-bleed image with overlay text at bottom */}
                  <Link
                    href={`/booking?service=${service.slug}`}
                    className="group block"
                  >
                    <div className="hover-lift relative overflow-hidden rounded-2xl">
                      {/* Image area — tall, full-bleed, zooms on hover */}
                      <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${gradient}`}>
                        {previewImage ? (
                          <Image
                            src={previewImage.imageUrl}
                            alt={previewImage.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <Sparkles className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary/20" />
                        )}

                        {/* Dark gradient overlay — stronger at the bottom for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-plum-dark/20 to-transparent" />

                        {/* Price badge — top right corner */}
                        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum-dark shadow-sm backdrop-blur-sm">
                          From €{service.studioPrice}
                        </div>

                        {/* Text overlay — sits at the bottom of the image */}
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h3 className="font-serif text-2xl font-bold text-white drop-shadow-sm">
                            {service.name}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/80">
                            {service.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-white/70">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {service.durationMinutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Studio & Travel
                              </span>
                            </div>
                            {/* Animated arrow — slides right on hover */}
                            <span className="flex items-center gap-1 text-xs font-medium text-peach">
                              Book
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>

          <AnimateIn delay={500} className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/services">View All Services & Pricing<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </AnimateIn>
        </div>
      </section>

      <section className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Why Us</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-plum-dark sm:text-4xl">The Sanaa Glam Experience</h2>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Professional Artistry", description: "Years of experience with premium products ensuring flawless, long-lasting results for every skin type." },
              { icon: MapPin, title: "Studio & Travel", description: "Visit our studio or let us come to you. Travel services available within 50 km with transparent zone pricing." },
              { icon: Clock, title: "Easy Online Booking", description: "Book your appointment in minutes with our simple online system. Real-time availability and instant confirmation." },
            ].map((feature, index) => (
              <AnimateIn key={feature.title} delay={index * 150}>
                <div className="group rounded-2xl bg-card p-8 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20"><feature.icon className="h-7 w-7 text-primary" /></div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-plum-dark">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mb-10 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Testimonials</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-plum-dark sm:text-4xl">What Our Clients Say</h2>
            </div>
          </AnimateIn>

          <AnimateIn delay={200}><ReviewPlayer mode="cinematic" /></AnimateIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-plum py-20">
        <div className="animate-float absolute -top-16 -left-16 h-48 w-48 rounded-full bg-peach/5 blur-2xl" />
        <div className="animate-float absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-plum-light/20 blur-3xl [animation-delay:3s]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="font-serif text-3xl font-bold text-peach sm:text-4xl lg:text-5xl">Ready to Look Your Best?</h2>
            <p className="mt-5 text-lg text-peach-light/80">Book your appointment today and let us create your perfect look.</p>
            <Button asChild size="lg" className="animate-pulse-glow mt-10 rounded-full px-10 text-base"><Link href="/booking">Book Now<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
