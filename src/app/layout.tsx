import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Sanaa Glam - Professional Makeup Artist",
    template: "%s | Sanaa Glam",
  },
  description:
    "Professional makeup services in Germany. Studio and travel appointments available. Book your appointment today!",
  keywords: ["makeup artist", "Germany", "bridal makeup", "glam", "booking"],
  openGraph: {
    title: "Sanaa Glam - Professional Makeup Artist",
    description:
      "Professional makeup services in Germany. Studio and travel appointments available. Book your appointment today!",
    type: "website",
    images: [{ url: "/logo.png", alt: "Sanaa Glam" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
