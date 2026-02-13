import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/constants";

/**
 * Impressum — Legal page REQUIRED by German law (TMG § 5).
 * 
 * Must include: business name, address, contact info, responsible person,
 * and tax/registration numbers. Every German website must have this page
 * accessible from every other page (linked in footer).
 * 
 * TODO: Replace placeholder information with actual business details.
 */
export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal disclosure (Impressum) for Sanaa Glam as required by German law.",
};

export default function ImpressumPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-plum-dark">
          Impressum
        </h1>

        <div className="mt-8 space-y-8 text-muted-foreground">
          {/* Business Information */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Angaben gemäß § 5 TMG
            </h2>
            <div className="mt-3 space-y-1">
              <p>{BUSINESS_INFO.name}</p>
              <p>{BUSINESS_INFO.studioAddress}</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Kontakt
            </h2>
            <div className="mt-3 space-y-1">
              <p>Telefon: {BUSINESS_INFO.phone}</p>
              <p>E-Mail: {BUSINESS_INFO.email}</p>
            </div>
          </section>

          {/* Tax Info */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Umsatzsteuer-ID
            </h2>
            <p className="mt-3">
              {/* TODO: Add actual tax ID number */}
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              DE XXX XXX XXX
            </p>
          </section>

          {/* Responsible Person */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <div className="mt-3 space-y-1">
              {/* TODO: Add actual responsible person's name */}
              <p>[Full Name]</p>
              <p>{BUSINESS_INFO.studioAddress}</p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-plum-dark">
              Streitschlichtung
            </h2>
            <p className="mt-3">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
