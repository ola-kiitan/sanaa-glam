import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * AGB (Allgemeine Geschäftsbedingungen) — Terms & Conditions page.
 * 
 * Required for German businesses. Outlines the terms of service,
 * booking conditions, payment terms, and liability.
 * 
 * TODO: Have this reviewed by a legal professional before going live.
 */
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "General Terms and Conditions (AGB) for Sanaa Glam makeup services.",
};

export default function AGBPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-plum-dark">
          Terms & Conditions (AGB)
        </h1>

        <div className="mt-8 space-y-8 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              1. Scope
            </h2>
            <p className="mt-3">
              These General Terms and Conditions apply to all bookings and
              services provided by {BUSINESS_INFO.name}, located at{" "}
              {BUSINESS_INFO.studioAddress}. By booking an appointment, you
              agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              2. Booking & Confirmation
            </h2>
            <p className="mt-3">
              Appointments are booked through our website. A booking is
              considered confirmed once you receive a confirmation email. All
              bookings must be made at least 24 hours in advance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              3. Services & Pricing
            </h2>
            <p className="mt-3">
              All prices are listed on our website and include VAT where
              applicable. Travel appointments include a zone-based surcharge
              depending on the distance from our studio. The final price shown
              during booking is the price you pay.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              4. Payment
            </h2>
            <p className="mt-3">
              Payment is due at the time of the appointment. We accept cash and
              common payment methods. No advance payment is required during
              online booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              5. Cancellation
            </h2>
            <p className="mt-3">
              Please refer to our{" "}
              <a href="/stornierung" className="text-primary hover:underline">
                Cancellation Policy
              </a>{" "}
              for details on cancelling or rescheduling appointments.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              6. Liability
            </h2>
            <p className="mt-3">
              We use professional, high-quality products for all services.
              Clients are responsible for informing us of any allergies or skin
              sensitivities prior to the appointment via the intake form. We are
              not liable for reactions caused by undisclosed allergies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              7. Data Protection
            </h2>
            <p className="mt-3">
              Your personal data is processed in accordance with our{" "}
              <a href="/datenschutz" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              8. Applicable Law
            </h2>
            <p className="mt-3">
              These terms are governed by the laws of the Federal Republic of
              Germany. The place of jurisdiction is the registered office of
              {" "}{BUSINESS_INFO.name}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
