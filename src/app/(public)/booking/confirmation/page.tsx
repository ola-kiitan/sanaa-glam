import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ConfirmationPageProps = {
  searchParams?: Promise<{
    appointmentId?: string;
    service?: string;
    date?: string;
    time?: string;
    location?: string;
    zone?: string;
    price?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your Sanaa Glam appointment has been confirmed.",
};

export default async function BookingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <div className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-10">
          <Badge className="mb-4 rounded-full px-4 py-1.5">Confirmed</Badge>
          <h1 className="font-serif text-3xl font-bold text-plum-dark sm:text-4xl">
            Your appointment is booked
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Thank you for booking with Sanaa Glam. You will receive a confirmation email shortly.
          </p>

          <div className="mt-8 rounded-xl bg-secondary/40 p-5 text-left text-sm">
            <p><span className="font-semibold">Appointment ID:</span> {params?.appointmentId ?? "-"}</p>
            <p><span className="font-semibold">Service:</span> {params?.service ?? "-"}</p>
            <p><span className="font-semibold">Date:</span> {params?.date ?? "-"}</p>
            <p><span className="font-semibold">Time:</span> {params?.time ?? "-"}</p>
            <p><span className="font-semibold">Location:</span> {params?.location ?? "-"}</p>
            {params?.zone ? <p><span className="font-semibold">Zone:</span> {params.zone}</p> : null}
            <p><span className="font-semibold">Price:</span> {params?.price ? `EUR ${params.price}` : "-"}</p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/booking">Book Another Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
