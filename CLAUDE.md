# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sanaa Glam is a makeup booking web application for a Germany-based business. Built with Next.js 14 (App Router), TypeScript, and deployed on Vercel. The app handles multi-step booking with zone-based travel pricing, automated email reminders, and an admin dashboard.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, PostgreSQL (Supabase), Prisma ORM, NextAuth.js, Resend + React Email, Zod validation

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Production server
npm start

# Lint code
npm run lint

# Generate Prisma client (run after schema changes)
npx prisma generate

# Push schema changes to database (development)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed the database
npx prisma db seed
```

## Architecture

### Route Organization

The app uses Next.js route groups:
- `app/(public)/` — Customer-facing pages (home, services, booking wizard, legal pages)
- `app/(admin)/admin/` — Protected admin dashboard (requires authentication)
- `app/api/` — API routes split into public (`/api/booking`, `/api/availability`) and admin (`/api/admin/*`) endpoints

Each route group has its own `layout.tsx` for group-specific layouts.

### Authentication

- **Provider:** NextAuth.js with Credentials provider
- **Strategy:** JWT-based sessions (no database sessions)
- **Login:** Single admin account via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- **Protected routes:** Use `src/lib/admin-auth.ts` `requireAuth()` helper to protect admin routes
- **Login page:** `/admin/login`
- **Auth configuration:** `src/lib/auth.ts`

### Timezone Handling

**Critical:** All date/time logic uses `Europe/Berlin` timezone (defined in `src/lib/constants.ts` as `TIMEZONE`).
- Database stores all dates in UTC
- Use `date-fns-tz` functions `fromZonedTime()` to convert Berlin time to UTC before saving
- Use `formatInTimeZone()` to display UTC dates in Berlin time
- The availability engine (`src/lib/availability.ts`) handles all slot calculations in Berlin time

### Database Schema (Prisma)

Key models:
- **Service** — Makeup services with zone-based pricing (studio, zone1-3)
- **Client** — Customer contact info (email is indexed but not unique)
- **Appointment** — Links service + client, stores location type, zone, and status
- **IntakeForm** — One-to-one with Appointment, stores client preferences (skin type, allergies, glam level)
- **AvailabilityRule** — Defines working hours per weekday (0=Sunday...6=Saturday)
- **BlackoutDate** — Date ranges when studio is closed
- **MessageLog** — Tracks automated emails sent (prevents duplicates via unique constraint)
- **PortfolioItem** — Gallery images with categories

**Vercel-specific Prisma setup:**
- Uses two connection strings: `DATABASE_URL` (pooled) for queries, `DIRECT_URL` (direct) for migrations
- Always run `npx prisma generate` as part of the build process (already in `package.json` build script)

### Availability Engine

Located in `src/lib/availability.ts`. Core functions:
- `getAvailableDates(month, serviceId, locationType)` — Returns array of available dates for a month
- `getAvailableSlots(date, serviceId, locationType)` — Returns time slots for a specific date
- `isSlotAvailable(startAt, endAt)` — Checks if a time range is free

Logic flow:
1. Checks if service is active
2. Gets weekday availability rule (travel allowed?)
3. Excludes blackout dates
4. Generates slots based on service duration + buffer time
5. Filters out booked slots and slots within 24h cutoff
6. All calculations respect `BOOKING_CUTOFF_HOURS` (24h minimum advance booking)

### Pricing System

Zone-based travel pricing defined in Prisma schema:
- Each Service has 4 prices: `studioPrice`, `zone1Price`, `zone2Price`, `zone3Price`
- Zones: Zone 1 (0-10km), Zone 2 (10-25km), Zone 3 (25-50km)
- Price calculation helper: `src/lib/pricing.ts`
- Display labels: `src/lib/constants.ts` `ZONES` object

### Email Automation

**Provider:** Resend + React Email templates
**Templates location:** `src/emails/` (React components)

Email triggers (`src/lib/email-triggers.ts`):
- `sendBookingConfirmation()` — Sent immediately after booking
- `sendReminder48h()` — 48h before appointment
- `sendReminder24h()` — 24h before appointment
- `sendCancellationEmail()` — When admin cancels
- `sendFollowUpEmail()` — 48-72h after completed appointment

**Cron job:** Vercel Cron runs `/api/cron/reminders` daily at 7 AM (configured in `vercel.json`)
- Uses `getReminderCandidates()` to find appointments needing reminders
- MessageLog prevents duplicate sends (unique constraint on appointmentId + messageType)

### Validation

All validation schemas in `src/lib/validators.ts` using Zod:
- `bookingSchema` — Full booking form validation
- `clientDetailsSchema` — Contact info validation
- `intakeFormSchema` — Intake form validation
- `serviceSchema` — Admin service creation/editing
- `availabilityRuleSchema`, `blackoutDateSchema`, etc.

Schemas used on both client (React Hook Form) and server (API routes).

### Key Files

- `src/lib/constants.ts` — All app constants (timezone, zones, display labels, nav links)
- `src/lib/prisma.ts` — Singleton Prisma client (prevents multiple instances in dev)
- `src/lib/utils.ts` — Shared utilities (cn() for Tailwind classes, etc.)
- `prisma/schema.prisma` — Database schema (source of truth)
- `prisma/seed.ts` — Database seeding script

## Environment Variables Required

```bash
# Database
DATABASE_URL=          # Supabase pooled connection
DIRECT_URL=            # Supabase direct connection

# Auth
AUTH_SECRET=           # NextAuth secret (generate with openssl rand -base64 32)
ADMIN_EMAIL=           # Admin login email
ADMIN_PASSWORD=        # Admin login password

# Email
RESEND_API_KEY=        # Resend API key
EMAIL_FROM=            # Sender email (e.g., "Sanaa Glam <hello@sanaaglam.com>")

# Site
NEXT_PUBLIC_SITE_URL=  # Full site URL (e.g., https://sanaaglam.com)
```

## Important Conventions

- Use server components by default; only add `"use client"` when needed (forms, interactivity)
- All API routes return JSON with `{ success: boolean, error?: string, data?: any }` structure
- Prisma transactions: Pass `PrismaClient | TransactionClient` as parameter (see `availability.ts` pattern)
- When modifying Prisma schema, always run `npx prisma generate` then `npx prisma db push`
- Use `TIMEZONE` constant from `src/lib/constants.ts` for all date operations
- Price fields are stored as `Decimal` in database, convert to `number` with `Number()` for calculations
