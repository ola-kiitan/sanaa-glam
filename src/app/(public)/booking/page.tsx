import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getActiveServices } from "@/lib/actions/services";

type BookingPageProps = {
  searchParams?: Promise<{ service?: string }>;
};

export const metadata: Metadata = {
  title: "Book Now",
  description: "Book your makeup appointment with Sanaa Glam. Studio and travel appointments available.",
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const services = await getActiveServices();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
            Book Your Appointment
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Complete the 6-step booking flow to reserve your makeup session.
            Real-time availability is shown before confirmation.
          </p>
        </div>

        <BookingWizard services={services} initialServiceSlug={params?.service} />
      </div>
    </div>
  );
}
