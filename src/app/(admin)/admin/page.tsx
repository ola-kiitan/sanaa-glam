import Link from "next/link";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

  const [todayCount, weekCount, totalClients, completedCount, totalAppointments, recentAppointments] = await Promise.all([
    prisma.appointment.count({ where: { startAt: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.appointment.count({ where: { startAt: { gte: now, lt: weekEnd } } }),
    prisma.client.count(),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count(),
    prisma.appointment.findMany({
      include: { service: { select: { name: true } }, client: { select: { fullName: true } } },
      orderBy: { startAt: "desc" },
      take: 10,
    }),
  ]);

  const completionRate = totalAppointments > 0 ? Math.round((completedCount / totalAppointments) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-dark">Dashboard</h1>
          <p className="text-muted-foreground">Overview of bookings and operations.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/admin/appointments/new">New Appointment</Link></Button>
          <Button asChild><Link href="/admin/services">Manage Services</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Appointments" value={todayCount} icon={Calendar} />
        <StatsCard title="This Week" value={weekCount} icon={Clock} />
        <StatsCard title="Total Clients" value={totalClients} icon={Users} />
        <StatsCard title="Completion Rate" value={`${completionRate}%`} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl text-plum-dark">Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Client</th>
                  <th className="p-2">Service</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b">
                    <td className="p-2">{new Date(appointment.startAt).toLocaleString()}</td>
                    <td className="p-2">{appointment.client.fullName}</td>
                    <td className="p-2">{appointment.service.name}</td>
                    <td className="p-2"><StatusBadge status={appointment.status} /></td>
                    <td className="p-2">EUR {Number(appointment.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
