import { AppointmentsTable } from "@/components/admin/appointments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      service: { select: { name: true } },
      client: { select: { fullName: true, email: true } },
    },
    orderBy: { startAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Appointments</h1>
        <p className="text-muted-foreground">View and manage upcoming and past bookings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTable
            initialAppointments={appointments.map((appointment) => ({
              id: appointment.id,
              startAt: appointment.startAt.toISOString(),
              status: appointment.status,
              service: appointment.service,
              client: appointment.client,
              price: Number(appointment.price),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
