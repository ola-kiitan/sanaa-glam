import type { Metadata } from "next";

/**
 * Booking Page — Multi-step appointment booking wizard.
 * 
 * TODO: Phase 3 — Implement the full 6-step booking wizard:
 *   Step 1: Select Service
 *   Step 2: Select Location (Studio / Travel)
 *   Step 3: Select Zone (only if Travel)
 *   Step 4: Select Date & Time
 *   Step 5: Enter Client Details + Intake Form
 *   Step 6: Confirm Booking + Accept Policies
 * 
 * This will be a client component with form state management.
 * The availability calculation will use a server API route.
 */
export const metadata: Metadata = {
  title: "Book Now",
  description: "Book your makeup appointment with Sanaa Glam. Studio and travel appointments available.",
};

export default function BookingPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-plum-dark sm:text-5xl">
            Book Your Appointment
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Follow the steps below to schedule your makeup session.
            Available appointments are shown in real time.
          </p>
        </div>

        {/* Booking wizard placeholder */}
        <div className="mt-12 rounded-lg border border-border/50 bg-card p-8">
          {/* Step indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div className="h-px w-6 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium text-plum-dark">
              Booking wizard coming soon
            </p>
            <p className="mt-2 text-sm">
              The full multi-step booking form will be built in Phase 3.
              It will include service selection, location choice, date/time
              picker, client details, intake form, and policy acceptance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
