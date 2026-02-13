"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

/**
 * Header — Main navigation bar shown on all public pages.
 * 
 * Features:
 * - Scroll-aware design: starts transparent, fills with backdrop blur on scroll
 * - Logo on the left linking to home page
 * - Desktop navigation links with animated underline hover effect
 * - "Book Now" CTA button with rounded pill shape
 * - Mobile: hamburger menu that opens a slide-out sheet
 * 
 * HOW THE SCROLL EFFECT WORKS:
 * - A scroll event listener tracks the window.scrollY position
 * - When scrolled past 50px, the "scrolled" state becomes true
 * - This toggles CSS classes: adds a background fill, border, and shadow
 * - The transition is smooth (0.3s ease) for a polished feel
 */
export function Header() {
  // Controls the mobile menu open/close state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tracks whether the user has scrolled past the hero area
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Update "scrolled" state when user scrolls past 50px
    const handleScroll = () => setScrolled(window.scrollY > 50);

    // Check initial position (in case page loads already scrolled)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/90 shadow-sm backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Logo with hover scale ---- */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Sanaa Glam Logo"
            width={36}
            height={36}
            className="rounded-full"
            priority
          />
          <span className="font-serif text-lg font-bold text-plum-dark">
            Sanaa Glam
          </span>
        </Link>

        {/* ---- Desktop Navigation (hidden on mobile) ---- */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            // "Book Now" link gets a special pill button style
            link.href === "/booking" ? (
              <Button key={link.href} asChild size="sm" className="rounded-full px-6">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : (
              // Regular nav links use the animated underline effect
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* ---- Mobile Menu (hamburger icon → slide-out sheet) ---- */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="font-serif text-lg text-plum-dark">
              Menu
            </SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    link.href === "/booking"
                      ? "mt-4 rounded-full bg-primary px-4 py-2.5 text-center font-medium text-primary-foreground transition-transform active:scale-95"
                      : "rounded-lg px-4 py-2.5 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
