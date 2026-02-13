import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

/**
 * Root Layout — wraps the entire application.
 * 
 * Fonts:
 * - Playfair Display: Elegant serif font used for headings (matches the luxury brand feel)
 * - Inter: Clean sans-serif font used for body text (excellent readability)
 * 
 * The fonts are loaded via next/font/google which automatically optimizes
 * them (self-hosted, no layout shift, subset only what's needed).
 */

// Elegant serif font for headings — matches the Sanaa Glam logo aesthetic
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap", // Show fallback font immediately, swap when loaded
});

// Clean sans-serif font for body text — great readability
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// SEO metadata — shown in browser tabs and search results
export const metadata: Metadata = {
  title: {
    default: "Sanaa Glam — Professional Makeup Artist",
    template: "%s | Sanaa Glam",
  },
  description:
    "Professional makeup services in Germany. Studio and travel appointments available. Book your appointment today!",
  keywords: ["makeup artist", "Germany", "bridal makeup", "glam", "booking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
