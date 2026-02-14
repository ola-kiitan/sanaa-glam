import { ClientDetail } from "@/components/admin/client-detail";
import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      appointments: {
        include: { service: { select: { name: true } } },
        orderBy: { startAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Clients</h1>
        <p className="text-muted-foreground">Manage client records, notes, and GDPR actions.</p>
      </div>

      <ClientDetail
        initialClients={clients.map((client) => ({
          ...client,
          appointments: client.appointments.map((appointment) => ({
            ...appointment,
            startAt: appointment.startAt.toISOString(),
            price: Number(appointment.price),
          })),
        }))}
      />
    </div>
  );
}
