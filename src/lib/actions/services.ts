/**
 * Sanaa Glam — Service Data Fetching Functions
 *
 * These async functions fetch service data from the database.
 * They are designed to be called from Server Components (pages)
 * which run on the server and can directly query the database.
 *
 * Key concepts:
 * - `prisma.service.findMany()` returns all matching records
 * - `prisma.service.findUnique()` returns one record or null
 * - Prisma `Decimal` fields are converted to `number` for the UI
 * - `isActive: true` filter ensures only bookable services appear publicly
 * - Results are ordered by `createdAt` so newest services appear last
 */

import { prisma } from "@/lib/prisma";

/**
 * The shape of a service returned to the UI.
 * Prices are plain numbers (converted from Prisma Decimal type).
 */
export type ServiceForDisplay = {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  studioPrice: number;
  zone1Price: number;
  zone2Price: number;
  zone3Price: number;
};

/**
 * Fetch all active services for public display.
 *
 * Used on:
 * - /services page (full listing)
 * - / home page (preview cards)
 * - /booking wizard (service selection step)
 *
 * @returns Array of active services with prices as numbers
 */
export async function getActiveServices(): Promise<ServiceForDisplay[]> {
  // Query only active services, ordered by creation date
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  // Convert Prisma Decimal fields to plain numbers for the UI.
  // Prisma returns Decimal as a special object, but our UI needs simple numbers.
  return services.map((service) => ({
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    durationMinutes: service.durationMinutes,
    studioPrice: Number(service.studioPrice),
    zone1Price: Number(service.zone1Price),
    zone2Price: Number(service.zone2Price),
    zone3Price: Number(service.zone3Price),
  }));
}

/**
 * Fetch a single service by its URL-friendly slug.
 *
 * Used on:
 * - /services/[slug] detail page
 *
 * @param slug - The URL slug (e.g. "bridal-makeup")
 * @returns The service data or null if not found / inactive
 */
export async function getServiceBySlug(slug: string): Promise<ServiceForDisplay | null> {
  // Find a unique service by its slug (slug has a unique constraint in the schema)
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  // Return null if service doesn't exist or is deactivated by the admin
  if (!service || !service.isActive) {
    return null;
  }

  // Convert Decimal prices to numbers, same as getActiveServices
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    durationMinutes: service.durationMinutes,
    studioPrice: Number(service.studioPrice),
    zone1Price: Number(service.zone1Price),
    zone2Price: Number(service.zone2Price),
    zone3Price: Number(service.zone3Price),
  };
}

/**
 * Fetch all service slugs for static page generation.
 *
 * Used in `generateStaticParams()` on the service detail page
 * to pre-build pages for all known services at build time.
 *
 * @returns Array of { slug: string } objects
 */
export async function getServiceSlugs(): Promise<{ slug: string }[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true }, // Only fetch the slug field (efficient query)
  });

  return services;
}
