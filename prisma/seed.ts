/**
 * Sanaa Glam — Database Seed Script
 *
 * Populates the database with initial data:
 * 1. Three makeup services with zone-based pricing
 * 2. Weekly availability rules (Mon–Sat, Sun closed)
 * 3. Sample blackout dates (Christmas + New Year)
 *
 * Uses upsert so the script is idempotent — safe to run multiple times
 * without creating duplicate records.
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ---- 1. Services ----
  // Three core makeup services with pricing for studio + all travel zones
  const services = [
    {
      slug: "bridal-makeup",
      name: "Bridal Makeup",
      description:
        "Your perfect look for the most important day. Includes a consultation to match your vision, a long-lasting application with premium products, and a touch-up kit for the day. We use only the finest products to ensure your makeup stays flawless from the ceremony through the last dance.",
      durationMinutes: 90,
      studioPrice: 180,
      zone1Price: 200,
      zone2Price: 220,
      zone3Price: 250,
    },
    {
      slug: "glam-makeup",
      name: "Glam Makeup",
      description:
        "Stunning looks for special events, parties, and photoshoots. Choose from soft glam to full editorial intensity. Customized to your style, outfit, and occasion. Perfect for birthdays, galas, date nights, and any event where you want to turn heads.",
      durationMinutes: 60,
      studioPrice: 120,
      zone1Price: 140,
      zone2Price: 160,
      zone3Price: 180,
    },
    {
      slug: "natural-beauty",
      name: "Natural Beauty",
      description:
        "Enhance your natural features with a fresh, radiant look. Perfect for everyday wear, business meetings, or casual events. Lightweight and breathable application that lets your skin shine through. Ideal for those who want to look polished without looking 'done up'.",
      durationMinutes: 45,
      studioPrice: 80,
      zone1Price: 100,
      zone2Price: 120,
      zone3Price: 140,
    },
  ];

  for (const service of services) {
    // upsert = create if doesn't exist, update if it does (matched by slug)
    const result = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        studioPrice: service.studioPrice,
        zone1Price: service.zone1Price,
        zone2Price: service.zone2Price,
        zone3Price: service.zone3Price,
      },
      create: service,
    });
    console.log(`  ✅ Service: ${result.name} (${result.slug})`);
  }

  // ---- 2. Availability Rules ----
  // Define working hours for each day of the week.
  // No rule for Sunday (weekday 0) means the studio is closed.
  const availabilityRules = [
    // Monday (1) through Friday (5): 09:00–18:00
    { weekday: 1, startTime: "09:00", endTime: "18:00", bufferMinutes: 15, allowTravel: true },
    { weekday: 2, startTime: "09:00", endTime: "18:00", bufferMinutes: 15, allowTravel: true },
    { weekday: 3, startTime: "09:00", endTime: "18:00", bufferMinutes: 15, allowTravel: true },
    { weekday: 4, startTime: "09:00", endTime: "18:00", bufferMinutes: 15, allowTravel: true },
    { weekday: 5, startTime: "09:00", endTime: "18:00", bufferMinutes: 15, allowTravel: true },
    // Saturday (6): 10:00–16:00 (shorter hours)
    { weekday: 6, startTime: "10:00", endTime: "16:00", bufferMinutes: 15, allowTravel: true },
  ];

  for (const rule of availabilityRules) {
    // upsert by weekday — each weekday has at most one rule
    const result = await prisma.availabilityRule.upsert({
      where: { weekday: rule.weekday },
      update: {
        startTime: rule.startTime,
        endTime: rule.endTime,
        bufferMinutes: rule.bufferMinutes,
        allowTravel: rule.allowTravel,
      },
      create: rule,
    });

    // Map weekday number to name for readable console output
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    console.log(`  ✅ Availability: ${dayNames[result.weekday]} ${result.startTime}–${result.endTime}`);
  }

  // ---- 3. Blackout Dates ----
  // Sample holidays — admin can add/remove these later from the dashboard.
  // We use the current year's Christmas and New Year as examples.
  const currentYear = new Date().getFullYear();

  const blackoutDates = [
    {
      reason: "Christmas Holiday",
      startAt: new Date(`${currentYear}-12-24T00:00:00Z`),
      endAt: new Date(`${currentYear}-12-26T23:59:59Z`),
    },
    {
      reason: "New Year",
      startAt: new Date(`${currentYear}-12-31T00:00:00Z`),
      endAt: new Date(`${currentYear + 1}-01-01T23:59:59Z`),
    },
  ];

  // Delete existing blackout dates and re-create to avoid duplicates
  // (blackout dates don't have a natural unique key like slug or weekday)
  await prisma.blackoutDate.deleteMany();

  for (const blackout of blackoutDates) {
    const result = await prisma.blackoutDate.create({ data: blackout });
    console.log(`  ✅ Blackout: ${result.reason} (${result.startAt.toISOString().split("T")[0]} → ${result.endAt.toISOString().split("T")[0]})`);
  }

  console.log("\n🎉 Seed complete!");
}

// Execute the seed function and handle errors gracefully
main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from the database when done
    await prisma.$disconnect();
  });
