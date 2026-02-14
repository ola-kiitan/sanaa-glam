import { AvailabilityEditor } from "@/components/admin/availability-editor";
import { prisma } from "@/lib/prisma";

export default async function AdminAvailabilityPage() {
  const [rules, blackouts] = await Promise.all([
    prisma.availabilityRule.findMany({ orderBy: { weekday: "asc" } }),
    prisma.blackoutDate.findMany({ orderBy: { startAt: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Availability</h1>
        <p className="text-muted-foreground">Manage weekly hours and blackout dates.</p>
      </div>

      <AvailabilityEditor
        initialRules={rules}
        initialBlackouts={blackouts.map((item) => ({
          ...item,
          startAt: item.startAt.toISOString(),
          endAt: item.endAt.toISOString(),
        }))}
      />
    </div>
  );
}
