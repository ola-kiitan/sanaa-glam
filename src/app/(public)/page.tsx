import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Sparkles, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateIn } from "@/components/shared/animate-in";

/**
 * Home Page — The main landing page for Sanaa Glam.
 * 
 * Sections:
 * 1. Hero — Animated brand reveal with "You're a work of art"
 * 2. Services Preview — 3 service cards with hover-lift animation
 * 3. Why Choose Us — Scroll-triggered feature reveals
 * 4. Testimonial — Elegant quote with star animation
 * 5. CTA Banner — Animated gradient with booking CTA
 * 
 * Animations:
 * - Hero text: staggered fade-in on page load
 * - Decorative elements: continuous floating
 * - Sections: scroll-triggered reveal (AnimateIn component)
 * - Cards: hover-lift effect with shadow
 */
export default function HomePage() {
  return (
    <>
      {/* ============================================================
          SECTION 1: Hero
          
          Redesigned with:
          - Animated gradient background that shifts colors
          - Staggered text reveal: logo → brand name → tagline → CTAs
          - Floating decorative elements for visual interest
          - Cleaner hierarchy: brand name is the hero, tagline is the soul
          ============================================================ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-plum-dark via-plum to-plum-light">
        {/* Animated gradient overlay — slowly shifts colors for living feel */}
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-plum-dark via-plum/90 to-plum-light/80 opacity-95" />

        {/* Decorative floating circles — adds depth and modern feel */}
        <div className="animate-float absolute -top-20 -right-20 h-72 w-72 rounded-full bg-peach/5 blur-3xl" />
        <div className="animate-float absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-plum-light/20 blur-3xl [animation-delay:2s]" />
        <div className="animate-float absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-peach/5 blur-2xl [animation-delay:4s]" />

        {/* Hero content — staggered entrance animations */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* Logo with scale-in animation */}
          <div className="animate-scale-in">
            <Image
              src="/logo.png"
              alt="Sanaa Glam"
              width={120}
              height={120}
              className="mx-auto rounded-full"
              priority
            />
          </div>

          {/* Brand name — large, serif, elegant */}
          <h1 className="animate-slide-up stagger-2 mt-8 font-serif text-5xl font-bold tracking-tight text-peach sm:text-6xl lg:text-7xl">
            Sanaa Glam
          </h1>

          {/* Decorative line separator */}
          <div className="animate-fade-in stagger-3 mx-auto mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-peach/30" />
            <Heart className="h-4 w-4 text-peach/50" />
            <div className="h-px w-12 bg-peach/30" />
          </div>

          {/* Tagline — the soul of the brand, clean and minimal */}
          <p className="animate-slide-up stagger-4 mt-6 font-serif text-xl italic tracking-wide text-peach-light/90 sm:text-2xl lg:text-3xl">
            You&apos;re a work of art
          </p>

          {/* CTA Buttons — appear last in the stagger sequence */}
          <div className="animate-slide-up stagger-5 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="animate-pulse-glow rounded-full px-8 text-base"
            >
              <Link href="/booking">
                Book Your Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-peach/30 px-8 text-base text-peach hover:bg-peach/10"
            >
              <Link href="/services">View Services</Link>
            </Button>
          </div>

          {/* Scroll hint — subtle animated arrow */}
          <div className="animate-fade-in stagger-7 mt-16">
            <div className="mx-auto h-8 w-px animate-bounce bg-gradient-to-b from-peach/0 via-peach/40 to-peach/0" />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: Services Preview
          
          Three cards with:
          - Scroll-triggered reveal (AnimateIn) with staggered delays
          - Hover-lift effect (card rises + shadow deepens)
          - Gradient overlays for visual richness
          ============================================================ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                What We Offer
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-plum-dark sm:text-4xl">
                Our Services
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                From natural everyday looks to full editorial glam — every look
                is crafted with artistry and care.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Service Card 1 — Bridal */}
            <AnimateIn delay={100}>
              <Card className="hover-lift group overflow-hidden border-border/50">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-peach/20 to-peach-light/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                  <Sparkles className="absolute bottom-4 right-4 h-8 w-8 text-primary/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/60" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-plum-dark">
                    Bridal Makeup
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your perfect look for the most important day. Includes trial
                    session and long-lasting application.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 90 min
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Studio & Travel
                    </span>
                  </div>
                  <Link
                    href="/booking?service=bridal-makeup"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-plum-dark"
                  >
                    Book now <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </AnimateIn>

            {/* Service Card 2 — Glam */}
            <AnimateIn delay={250}>
              <Card className="hover-lift group overflow-hidden border-border/50">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-plum/10 to-plum-light/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                  <Star className="absolute bottom-4 right-4 h-8 w-8 text-plum-light/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-plum-light/60" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-plum-dark">
                    Glam Makeup
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Stunning looks for special events, parties, and photoshoots.
                    Choose your glam level.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 60 min
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Studio & Travel
                    </span>
                  </div>
                  <Link
                    href="/booking?service=glam-makeup"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-plum-dark"
                  >
                    Book now <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </AnimateIn>

            {/* Service Card 3 — Natural */}
            <AnimateIn delay={400}>
              <Card className="hover-lift group overflow-hidden border-border/50">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-peach-light/20 to-cream">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                  <Heart className="absolute bottom-4 right-4 h-8 w-8 text-peach/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-peach/60" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-plum-dark">
                    Natural Beauty
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enhance your natural features with a fresh, everyday-ready
                    look that feels like you.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 45 min
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Studio
                    </span>
                  </div>
                  <Link
                    href="/booking?service=natural-beauty"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-plum-dark"
                  >
                    Book now <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>

          <AnimateIn delay={500} className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/services">
                View All Services & Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimateIn>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: Why Choose Us
          
          Three feature highlights with:
          - Scroll-triggered staggered reveal
          - Animated icon containers with hover scale
          - Clean modern card layout
          ============================================================ */}
      <section className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Why Us
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-plum-dark sm:text-4xl">
                The Sanaa Glam Experience
              </h2>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Professional Artistry",
                description:
                  "Years of experience with premium products ensuring flawless, long-lasting results for every skin type.",
              },
              {
                icon: MapPin,
                title: "Studio & Travel",
                description:
                  "Visit our studio or let us come to you. Travel services available within 50 km with transparent zone pricing.",
              },
              {
                icon: Clock,
                title: "Easy Online Booking",
                description:
                  "Book your appointment in minutes with our simple online system. Real-time availability and instant confirmation.",
              },
            ].map((feature, index) => (
              <AnimateIn key={feature.title} delay={index * 150}>
                <div className="group rounded-2xl bg-card p-8 text-center transition-shadow hover:shadow-lg">
                  {/* Animated icon container — scales on hover */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-plum-dark">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: Testimonial
          
          Elegant client quote with:
          - Star rating animation
          - Large italic serif quote
          - Scroll-triggered reveal
          ============================================================ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateIn>
            {/* Animated star rating */}
            <div className="flex justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-primary text-primary"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            <blockquote className="mt-8 font-serif text-2xl leading-relaxed italic text-plum-dark sm:text-3xl">
              &ldquo;Sanaa made me feel absolutely beautiful on my wedding day.
              The makeup lasted through tears, dancing, and everything in
              between!&rdquo;
            </blockquote>

            {/* Reviewer attribution */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-primary/30" />
              <p className="text-sm font-medium text-muted-foreground">
                Happy Bride, Berlin
              </p>
              <div className="h-px w-8 bg-primary/30" />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Final CTA Banner
          
          Animated gradient background with:
          - Floating decorative elements
          - Strong booking call to action
          - Pulsing glow on the button
          ============================================================ */}
      <section className="relative overflow-hidden bg-plum py-20">
        {/* Decorative floating elements */}
        <div className="animate-float absolute -top-16 -left-16 h-48 w-48 rounded-full bg-peach/5 blur-2xl" />
        <div className="animate-float absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-plum-light/20 blur-3xl [animation-delay:3s]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="font-serif text-3xl font-bold text-peach sm:text-4xl lg:text-5xl">
              Ready to Look Your Best?
            </h2>
            <p className="mt-5 text-lg text-peach-light/80">
              Book your appointment today and let us create your perfect look.
            </p>
            <Button
              asChild
              size="lg"
              className="animate-pulse-glow mt-10 rounded-full px-10 text-base"
            >
              <Link href="/booking">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
