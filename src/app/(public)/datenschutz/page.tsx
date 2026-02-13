import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * Datenschutz (Privacy Policy) — GDPR-compliant privacy page REQUIRED by German/EU law.
 * 
 * Must explain: what data is collected, why, how it's stored, third-party services,
 * data subject rights, and contact information for the data controller.
 * 
 * TODO: Have this reviewed by a legal professional before going live.
 * This is a template and may need adjustments for your specific situation.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy (Datenschutzerklärung) for Sanaa Glam — GDPR compliant.",
};

export default function DatenschutzPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-plum-dark">
          Privacy Policy (Datenschutzerklärung)
        </h1>

        <div className="mt-8 space-y-8 text-muted-foreground">
          {/* Introduction */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              1. Data Controller
            </h2>
            <p className="mt-3">
              The data controller responsible for this website is:
            </p>
            <div className="mt-2 space-y-1">
              <p>{BUSINESS_INFO.name}</p>
              <p>{BUSINESS_INFO.studioAddress}</p>
              <p>Email: {BUSINESS_INFO.email}</p>
              <p>Phone: {BUSINESS_INFO.phone}</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              2. Data We Collect
            </h2>
            <p className="mt-3">
              When you book an appointment through our website, we collect the
              following information:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Full name, email address, and phone number</li>
              <li>Address (only for travel appointments)</li>
              <li>Skin type, allergies, and makeup preferences (intake form)</li>
              <li>Appointment date, time, and service selection</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              3. Purpose of Data Processing
            </h2>
            <p className="mt-3">
              We process your personal data for the following purposes:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>To process and manage your appointment booking</li>
              <li>To send confirmation emails and appointment reminders</li>
              <li>To prepare for your makeup session (intake form data)</li>
              <li>To contact you regarding your appointment if needed</li>
            </ul>
            <p className="mt-2">
              Legal basis: Art. 6(1)(b) GDPR — performance of a contract.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              4. Data Storage & Retention
            </h2>
            <p className="mt-3">
              Your data is stored securely in our database hosted by Supabase
              (cloud infrastructure in the EU). We retain your data only for as
              long as necessary to fulfill the purposes described above, or as
              required by law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              5. Third-Party Services
            </h2>
            <p className="mt-3">We use the following third-party services:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Supabase</strong> — Database hosting (EU servers)
              </li>
              <li>
                <strong>Resend</strong> — Email delivery service
              </li>
              <li>
                <strong>Vercel</strong> — Website hosting
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              6. Your Rights (GDPR)
            </h2>
            <p className="mt-3">
              Under the GDPR, you have the following rights regarding your
              personal data:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to data portability (export your data)</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at{" "}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="text-primary hover:underline"
              >
                {BUSINESS_INFO.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              7. Cookies
            </h2>
            <p className="mt-3">
              This website uses only technically necessary cookies required for
              the website to function. No tracking or analytics cookies are used.
              No consent banner is required for technically necessary cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
