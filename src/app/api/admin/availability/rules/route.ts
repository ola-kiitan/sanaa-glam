import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { availabilityRuleSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const payload = (await request.json()) as unknown;
  if (!Array.isArray(payload)) {
    return NextResponse.json({ error: "Expected an array of rules" }, { status: 400 });
  }

  const parsedRules = payload.map((rule) => availabilityRuleSchema.safeParse(rule));

  const invalid = parsedRules.find((result) => !result.success);
  if (invalid && !invalid.success) {
    return NextResponse.json({ error: "Validation failed", issues: invalid.error.flatten() }, { status: 400 });
  }

  const validRules = parsedRules
    .filter((result): result is Extract<typeof result, { success: true }> => result.success)
    .map((result) => result.data);

  const weekdays = validRules.map((rule) => rule.weekday);
  const uniqueWeekdays = new Set(weekdays);
  if (uniqueWeekdays.size !== weekdays.length) {
    return NextResponse.json(
      { error: "Duplicate weekday entries are not allowed" },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.availabilityRule.deleteMany({
      where: {
        weekday: {
          notIn: weekdays,
        },
      },
    });

    for (const rule of validRules) {
      await tx.availabilityRule.upsert({
        where: { weekday: rule.weekday },
        create: rule,
        update: {
          startTime: rule.startTime,
          endTime: rule.endTime,
          bufferMinutes: rule.bufferMinutes,
          allowTravel: rule.allowTravel,
        },
      });
    }
  });

  const rules = await prisma.availabilityRule.findMany({ orderBy: { weekday: "asc" } });
  return NextResponse.json({ rules });
}
