import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";
import { ReviewPlayer } from "@/components/reviews/review-player";
import { REVIEWS } from "@/components/reviews/review-data";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what our clients say about their makeup experience with Sanaa Glam.",
  openGraph: {
    title: "Reviews | Sanaa Glam",
    description: "Read what our clients say about their makeup experience with Sanaa Glam.",
    url: absoluteUrl("/reviews"),
    images: [{ url: absoluteUrl("/logo.png"), alt: "Sanaa Glam" }],
  },
};

export default function ReviewsPage() {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: REVIEWS.map((review, index) => ({
      "@type": "Review",
      position: index + 1,
      author: { "@type": "Person", name: review.name },
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
      reviewBody: review.text,
      itemReviewed: { "@type": "LocalBusiness", name: "Sanaa Glam" },
    })),
  };

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Testimonials</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">Client Reviews</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Hear from clients who trusted us with their special moments.</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={150}>
          <div className="mx-auto mt-12 max-w-4xl">
            <ReviewPlayer />
            <p className="mt-3 text-center text-xs text-muted-foreground">Use the controls to pause, play, or scrub through reviews</p>
          </div>
        </AnimateIn>

        <div className="mt-20">
          <AnimateIn>
            <h2 className="text-center font-serif text-2xl font-semibold text-plum-dark">All Reviews</h2>
          </AnimateIn>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <AnimateIn key={review.id} delay={index * 100}>
                <Card className="hover-lift h-full border-border/50">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed italic text-muted-foreground">&ldquo;{review.text}&rdquo;</p>

                    <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{review.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-plum-dark">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.occasion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>

        <AnimateIn delay={300}>
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">Ready to have your own amazing experience?</p>
            <Button asChild className="mt-4 rounded-full px-8"><Link href="/booking">Book Your Appointment<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
