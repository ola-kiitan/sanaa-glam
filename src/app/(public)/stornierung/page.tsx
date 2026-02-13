import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * Stornierungsbedingungen (Cancellation Policy) — Required for German businesses.
 * 
 * Clearly outlines the cancellation rules, timeframes, and any fees.
 * Must be visible and acknowledged by clients during the booking process.
 * 
 * TODO: Adjust cancellation timeframes and fees based on actual business policy.
 */
export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Cancellation policy for Sanaa Glam makeup appointments.",
};

export default function StornierungPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-plum-dark">
          Cancellation Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          (Stornierungsbedingungen)
        </p>

        <div className="mt-8 space-y-8 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Cancellation Timeframes
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border/50 p-4">
                <p className="font-semibold text-plum-dark">
                  More than 48 hours before appointment
                </p>
                <p className="mt-1 text-sm">
                  Free cancellation. Full refund if any payment was made.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-4">
                <p className="font-semibold text-plum-dark">
                  24–48 hours before appointment
                </p>
                <p className="mt-1 text-sm">
                  Cancellation is possible but a fee of 50% of the service price
                  may apply.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-4">
                <p className="font-semibold text-plum-dark">
                  Less than 24 hours before appointment
                </p>
                <p className="mt-1 text-sm">
                  The full service price may be charged. We understand
                  emergencies — please contact us directly.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              How to Cancel
            </h2>
            <p className="mt-3">
              To cancel your appointment, please contact us as soon as possible:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Email: {BUSINESS_INFO.email}</li>
              <li>Phone: {BUSINESS_INFO.phone}</li>
            </ul>
            <p className="mt-2">
              Please include your name, appointment date, and the reason for
              cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Rescheduling
            </h2>
            <p className="mt-3">
              If you need to reschedule rather than cancel, please contact us at
              least 48 hours before your appointment. We will do our best to
              accommodate an alternative date and time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              No-Shows
            </h2>
            <p className="mt-3">
              If you do not show up for your appointment without prior notice,
              the full service price may be charged. Please let us know as early
              as possible if you cannot make it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Cancellations by {BUSINESS_INFO.name}
            </h2>
            <p className="mt-3">
              In rare cases, we may need to cancel or reschedule your
              appointment due to illness or unforeseen circumstances. In such
              cases, we will contact you as soon as possible and offer an
              alternative appointment or a full refund.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
