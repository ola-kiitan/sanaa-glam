import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * 
 * In development, Next.js hot-reloads modules which would create
 * multiple PrismaClient instances. This singleton pattern ensures
 * only one client exists across all hot reloads.
 * 
 * In production, this simply creates one client instance.
 */

// Extend the global object to hold our Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse existing client or create a new one
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, save the client to the global object so it persists across hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
