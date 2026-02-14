import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      service: true,
      client: true,
      intakeForm: true,
      messages: true,
    },
  });

  if (!appointment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Appointment Detail</h1>
        <p className="text-muted-foreground">ID: {appointment.id}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Booking</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Service:</strong> {appointment.service.name}</p>
          <p><strong>Client:</strong> {appointment.client.fullName} ({appointment.client.email})</p>
          <p><strong>Date:</strong> {new Date(appointment.startAt).toLocaleString()}</p>
          <p><strong>Price:</strong> EUR {Number(appointment.price).toFixed(2)}</p>
          <p><strong>Status:</strong> <StatusBadge status={appointment.status} /></p>
          <p><strong>Location:</strong> {appointment.locationType} {appointment.zone ? `(${appointment.zone})` : ""}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Intake Form</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {appointment.intakeForm ? (
            <>
              <p><strong>Skin Type:</strong> {appointment.intakeForm.skinType ?? "-"}</p>
              <p><strong>Allergies:</strong> {appointment.intakeForm.allergies ?? "-"}</p>
              <p><strong>Occasion:</strong> {appointment.intakeForm.occasion ?? "-"}</p>
              <p><strong>Glam Level:</strong> {appointment.intakeForm.glamLevel ?? "-"}</p>
              <p><strong>Inspiration:</strong> {appointment.intakeForm.inspirationUrl ?? "-"}</p>
              <p><strong>Notes:</strong> {appointment.intakeForm.clientNotes ?? "-"}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No intake form submitted.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Message Logs</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {appointment.messages.length === 0 ? (
            <p className="text-muted-foreground">No messages sent yet.</p>
          ) : (
            appointment.messages.map((message) => (
              <p key={message.id}>{message.messageType} — {new Date(message.sentAt).toLocaleString()}</p>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
