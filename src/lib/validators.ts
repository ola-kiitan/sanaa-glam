import { z } from "zod";

/**
 * Sanaa Glam — Zod Validation Schemas
 * 
 * These schemas validate data on both client and server side.
 * They ensure all user input is clean and correctly formatted
 * before it reaches the database.
 */

// ---- Booking Form Schemas ----

/**
 * Validates client contact details during booking.
 * Full name, email, phone are always required.
 * Address is required only for travel appointments.
 */
export const clientDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  address: z
    .string()
    .optional(), // Made optional here; enforced conditionally for travel bookings
});

/**
 * Validates the intake form filled during booking.
 * All fields are optional — clients fill what they can.
 */
export const intakeFormSchema = z.object({
  skinType: z.enum(["DRY", "OILY", "COMBINATION", "NORMAL"]).optional(),
  allergies: z.string().max(500, "Too long").optional(),
  occasion: z.string().max(100, "Too long").optional(),
  glamLevel: z.enum(["NATURAL", "SOFT_GLAM", "FULL_GLAM", "EDITORIAL"]).optional(),
  inspirationUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  clientNotes: z.string().max(1000, "Too long").optional(),
});

/**
 * The complete booking request schema.
 * Combines service selection, location, time, client details, and intake form.
 */
export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  locationType: z.enum(["STUDIO", "TRAVEL"]),
  zone: z.enum(["ZONE_1", "ZONE_2", "ZONE_3"]).optional(),
  date: z.string().min(1, "Please select a date"), // ISO date string
  timeSlot: z.string().min(1, "Please select a time"), // "HH:mm" format
  clientDetails: clientDetailsSchema,
  intakeForm: intakeFormSchema,
  policyAccepted: z.literal(true, {
    message: "You must accept the policies to continue",
  }),
}).refine(
  // If travel is selected, a zone must be chosen
  (data) => data.locationType !== "TRAVEL" || data.zone !== undefined,
  { message: "Please select a travel zone", path: ["zone"] }
).refine(
  // If travel is selected, an address must be provided
  (data) => data.locationType !== "TRAVEL" || (data.clientDetails.address && data.clientDetails.address.length > 5),
  { message: "Please enter your address for travel appointments", path: ["clientDetails", "address"] }
);

// ---- Admin Schemas ----

/**
 * Validates service creation/editing in the admin dashboard.
 */
export const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required").max(100),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  durationMinutes: z.number().int().min(15, "Minimum 15 minutes").max(480, "Maximum 8 hours"),
  studioPrice: z.number().min(0, "Price cannot be negative"),
  zone1Price: z.number().min(0, "Price cannot be negative"),
  zone2Price: z.number().min(0, "Price cannot be negative"),
  zone3Price: z.number().min(0, "Price cannot be negative"),
  isActive: z.boolean(),
});

/**
 * Validates availability rule creation/editing.
 * Defines working hours for a specific weekday.
 */
export const availabilityRuleSchema = z.object({
  weekday: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format"),
  bufferMinutes: z.number().int().min(0).max(120),
  allowTravel: z.boolean(),
});

/**
 * Validates blackout date creation.
 */
export const blackoutDateSchema = z.object({
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().min(1, "End date is required"),
  reason: z.string().max(200).optional(),
});

/**
 * Validates appointment status updates from admin.
 */
export const appointmentStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  cancellationReason: z.string().max(500).optional(),
}).refine(
  // Cancellation reason is required when cancelling
  (data) => data.status !== "CANCELLED" || (data.cancellationReason && data.cancellationReason.length > 0),
  { message: "Please provide a reason for cancellation", path: ["cancellationReason"] }
);

// ---- Type Exports ----
// These types can be used in components for form state

export type BookingFormData = z.infer<typeof bookingSchema>;
export type ClientDetails = z.infer<typeof clientDetailsSchema>;
export type IntakeFormData = z.infer<typeof intakeFormSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type AvailabilityRuleFormData = z.infer<typeof availabilityRuleSchema>;
export type AppointmentStatusUpdate = z.infer<typeof appointmentStatusSchema>;
