/**
 * Sanaa Glam — Shared TypeScript Types
 * 
 * These types extend the Prisma-generated types with additional
 * shapes needed by the frontend (e.g. API responses, UI state).
 */

// Re-export Prisma types for convenience
export type {
  Service,
  Client,
  Appointment,
  IntakeForm,
  AvailabilityRule,
  BlackoutDate,
  MessageLog,
  PortfolioItem,
  PortfolioCategory,
} from "@prisma/client";

/**
 * A time slot available for booking.
 * Displayed in the date/time picker during the booking flow.
 */
export type TimeSlot = {
  time: string;    // "09:00" format (local Europe/Berlin time)
  available: boolean; // Whether this slot can be booked
};

/**
 * Available slots for a specific date.
 * Returned by the availability API endpoint.
 */
export type DayAvailability = {
  date: string;       // "2026-03-15" ISO date string
  slots: TimeSlot[];  // All time slots for this date
};

/**
 * Service with pricing for a specific location/zone.
 * Used in the booking wizard to show the final price.
 */
export type ServiceWithPrice = {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number; // The resolved price based on location + zone selection
};

/**
 * Appointment with all related data (service, client, intake form).
 * Used in admin views for full appointment details.
 */
export type AppointmentWithDetails = {
  id: string;
  locationType: "STUDIO" | "TRAVEL";
  zone: "ZONE_1" | "ZONE_2" | "ZONE_3" | null;
  startAt: Date;
  endAt: Date;
  price: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  cancellationReason: string | null;
  createdAt: Date;
  service: {
    id: string;
    name: string;
    slug: string;
  };
  client: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string | null;
  };
  intakeForm: {
    skinType: string | null;
    allergies: string | null;
    occasion: string | null;
    glamLevel: string | null;
    inspirationUrl: string | null;
    clientNotes: string | null;
  } | null;
};

/**
 * Shape of the multi-step booking wizard state.
 * Tracks which step the user is on and their selections.
 */
export type BookingWizardState = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  serviceId: string | null;
  locationType: "STUDIO" | "TRAVEL" | null;
  zone: "ZONE_1" | "ZONE_2" | "ZONE_3" | null;
  date: string | null;
  timeSlot: string | null;
};

export type PortfolioItemForDisplay = {
  id: string;
  title: string;
  alt: string;
  category: "BRIDAL" | "GLAM" | "NATURAL" | "EDITORIAL";
  imageUrl: string;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  sortOrder: number;
};
