import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/shared/animate-in";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * FAQ Page — Frequently asked questions about booking, services, and policies.
 * 
 * Uses shadcn/ui Accordion with smooth open/close transitions.
 * Each FAQ item reveals on scroll with AnimateIn for a polished feel.
 */
export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Sanaa Glam makeup services, booking, and policies.",
};

const FAQ_ITEMS = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can book directly through our website by visiting the booking page. Simply select your desired service, choose studio or travel, pick a date and time, and fill in your details. You'll receive a confirmation email immediately.",
  },
  {
    question: "How far in advance do I need to book?",
    answer:
      "We require bookings to be made at least 24 hours in advance. For bridal appointments, we recommend booking 2-3 months ahead to secure your preferred date.",
  },
  {
    question: "What are the travel zones?",
    answer:
      "We offer travel services within 50 km of our studio. Zone 1 covers 0-10 km, Zone 2 covers 10-25 km, and Zone 3 covers 25-50 km. Each zone has a transparent travel surcharge added to the base studio price.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Please refer to our cancellation policy page for full details. Generally, cancellations must be made at least 48 hours before the appointment time.",
  },
  {
    question: "Do you offer bridal trials?",
    answer:
      "Yes! A bridal trial is included with our bridal makeup package. This allows us to perfect your look before the big day. Trials should be booked 4-8 weeks before the wedding.",
  },
  {
    question: "What products do you use?",
    answer:
      "We use a curated selection of premium, high-quality brands suitable for all skin types. If you have specific product preferences or allergies, please mention them in the booking intake form.",
  },
  {
    question: "How should I prepare for my appointment?",
    answer:
      "Please arrive with clean, moisturized skin and no makeup. Avoid using new skincare products 48 hours before your appointment. For travel appointments, ensure good lighting is available at your location.",
  },
  {
    question: "Do I need to pay online?",
    answer:
      "Currently, payment is handled in person at the time of the appointment. We accept cash and common payment methods. No online payment is required during booking.",
  },
];

export default function FAQPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Help Center
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about our services and booking process.
            </p>
          </div>
        </AnimateIn>

        {/* FAQ Accordion with staggered reveal */}
        <AnimateIn delay={150}>
          <Accordion type="single" collapsible className="mt-14">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-plum-dark transition-colors hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateIn>

        {/* Contact CTA */}
        <AnimateIn delay={300}>
          <div className="mt-14 rounded-2xl bg-secondary/50 p-8 text-center">
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Still have questions?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re happy to help! Reach out to us directly.
            </p>
            <Button asChild className="mt-5 rounded-full px-8">
              <Link href={`mailto:${BUSINESS_INFO.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
