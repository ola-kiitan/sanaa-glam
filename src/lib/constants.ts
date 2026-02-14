/**
 * Sanaa Glam — App-wide Constants
 * 
 * Central place for all configuration values, zone definitions,
 * and display mappings used across the application.
 */

// ---- Timezone ----
// All scheduling logic uses Europe/Berlin timezone
export const TIMEZONE = "Europe/Berlin";

// ---- Booking Rules ----
// Minimum hours in advance a client must book
export const BOOKING_CUTOFF_HOURS = 24;

// Default buffer time between appointments (in minutes)
export const DEFAULT_BUFFER_MINUTES = 15;

// ---- Zone Definitions ----
// Travel zones with their distance ranges and display labels
export const ZONES = {
  ZONE_1: { label: "Zone 1", distance: "0–10 km", description: "Within 10 km of studio" },
  ZONE_2: { label: "Zone 2", distance: "10–25 km", description: "10 to 25 km from studio" },
  ZONE_3: { label: "Zone 3", distance: "25–50 km", description: "25 to 50 km from studio" },
} as const;

// ---- Display Mappings ----
// Human-readable labels for enum values (used in UI dropdowns and displays)

export const SKIN_TYPE_LABELS = {
  DRY: "Dry",
  OILY: "Oily",
  COMBINATION: "Combination",
  NORMAL: "Normal",
} as const;

export const GLAM_LEVEL_LABELS = {
  NATURAL: "Natural",
  SOFT_GLAM: "Soft Glam",
  FULL_GLAM: "Full Glam",
  EDITORIAL: "Editorial",
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No Show",
} as const;

export const LOCATION_TYPE_LABELS = {
  STUDIO: "Studio",
  TRAVEL: "Travel",
} as const;

export const PORTFOLIO_CATEGORY_LABELS = {
  BRIDAL: "Bridal",
  GLAM: "Glam",
  NATURAL: "Natural",
  EDITORIAL: "Editorial",
} as const;

// ---- Navigation Links ----
// Main navigation items for the public website header
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Book Now" },
] as const;

// Legal links required for German compliance (shown in footer)
export const LEGAL_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Privacy Policy" },
  { href: "/agb", label: "Terms & Conditions" },
  { href: "/stornierung", label: "Cancellation Policy" },
] as const;

// ---- Business Info ----
// Replace these with actual business details
export const BUSINESS_INFO = {
  name: "Sanaa Glam",
  tagline: "Work of art",
  email: "hello@sanaaglam.com",
  phone: "+49 123 456 7890",
  studioAddress: "Musterstraße 1, 10115 Berlin, Germany",
  instagram: "https://instagram.com/sanaaglam",
} as const;
