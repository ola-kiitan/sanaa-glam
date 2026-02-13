import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone } from "lucide-react";
import { LEGAL_LINKS, NAV_LINKS, BUSINESS_INFO } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

/**
 * Footer — Shown at the bottom of all public pages.
 * 
 * Includes:
 * - Brand logo and tagline
 * - Quick navigation links with hover translate effect
 * - Legal links (Impressum, Privacy Policy, etc.) — required for German law
 * - Contact information with icon hover animations
 * - Social media link
 * - Copyright notice
 * 
 * German law REQUIRES Impressum and Datenschutz links to be accessible
 * from every page, so they are always visible in the footer.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-plum-dark text-peach-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ---- Top Section: 3-column grid ---- */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <Image
                src="/logo.png"
                alt="Sanaa Glam Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-serif text-xl font-bold text-peach">
                Sanaa Glam
              </span>
            </Link>
            <p className="mt-3 font-serif text-sm italic text-peach-light/60">
              You&apos;re a work of art
            </p>
            <p className="mt-4 text-sm text-peach-light/50">
              {BUSINESS_INFO.studioAddress}
            </p>
          </div>

          {/* Column 2: Quick Links — arrow slides in on hover */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-peach">
              Quick Links
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-peach-light/60 transition-colors hover:text-peach"
                >
                  {/* Arrow that slides in from left on hover */}
                  <span className="inline-block w-0 overflow-hidden transition-all duration-200 group-hover:w-4">
                    →
                  </span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact — icons scale on hover */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-peach">
              Contact
            </h3>
            <div className="mt-4 flex flex-col gap-3.5">
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="group flex items-center gap-2.5 text-sm text-peach-light/60 transition-colors hover:text-peach"
              >
                <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {BUSINESS_INFO.email}
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="group flex items-center gap-2.5 text-sm text-peach-light/60 transition-colors hover:text-peach"
              >
                <Phone className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {BUSINESS_INFO.phone}
              </a>
              <a
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-sm text-peach-light/60 transition-colors hover:text-peach"
              >
                <Instagram className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                @sanaaglam
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-plum-light/20" />

        {/* ---- Bottom Section: Legal links + Copyright ---- */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Legal links — REQUIRED for German law compliance */}
          <nav className="flex flex-wrap justify-center gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-peach-light/40 transition-colors duration-200 hover:text-peach/70"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-peach-light/40">
            &copy; {currentYear} {BUSINESS_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
