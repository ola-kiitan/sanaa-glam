import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateIn } from "@/components/shared/animate-in";

/**
 * Reviews Page — Client testimonials and feedback.
 * 
 * Each review card fades in with a staggered delay as the user
 * scrolls down, creating a cascading reveal effect.
 * 
 * TODO: Phase 6 — Integrate with admin-managed reviews or
 * Google Business reviews API for automatic sync.
 */
export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what our clients say about their makeup experience with Sanaa Glam.",
};

// Placeholder reviews — will be replaced with admin-managed content
const PLACEHOLDER_REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    occasion: "Bridal",
    rating: 5,
    text: "Sanaa made me feel absolutely beautiful on my wedding day. The makeup lasted through tears, dancing, and everything in between! Truly an artist.",
  },
  {
    id: 2,
    name: "Lisa K.",
    occasion: "Birthday Party",
    rating: 5,
    text: "I felt like a celebrity! The soft glam look was exactly what I wanted. Professional, punctual, and incredibly talented.",
  },
  {
    id: 3,
    name: "Anna W.",
    occasion: "Photoshoot",
    rating: 5,
    text: "The editorial look was stunning in photos. Sanaa understood my vision immediately and brought it to life better than I imagined.",
  },
  {
    id: 4,
    name: "Marie B.",
    occasion: "Gala Event",
    rating: 5,
    text: "Everyone asked who did my makeup! The full glam look was flawless and lasted the entire evening. I'll definitely be coming back.",
  },
  {
    id: 5,
    name: "Julia F.",
    occasion: "Engagement Party",
    rating: 5,
    text: "Natural, radiant, and exactly what I envisioned. Sanaa has a real gift for enhancing your features without it feeling heavy.",
  },
  {
    id: 6,
    name: "Carla T.",
    occasion: "Corporate Event",
    rating: 5,
    text: "Booked Sanaa for a corporate headshot session. She made me look polished and professional while still looking like myself. Highly recommend!",
  },
];

export default function ReviewsPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Testimonials
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
              Client Reviews
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Hear from clients who trusted us with their special moments.
            </p>
          </div>
        </AnimateIn>

        {/* Review cards with staggered reveal */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_REVIEWS.map((review, index) => (
            <AnimateIn key={review.id} delay={index * 100}>
              <Card className="hover-lift h-full border-border/50">
                <CardContent className="flex h-full flex-col p-6">
                  {/* Animated star rating */}
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="mt-4 flex-1 text-sm leading-relaxed italic text-muted-foreground">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Reviewer info with decorative line */}
                  <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                    {/* Avatar placeholder — initials circle */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-plum-dark">
                        {review.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.occasion}
                      </p>
                    </div>
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
