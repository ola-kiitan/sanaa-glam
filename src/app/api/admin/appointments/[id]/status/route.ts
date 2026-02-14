import { NextResponse } from "next/server";
import { sendCancellationEmail } from "@/lib/email-triggers";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { appointmentStatusSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { id } = await params;
  const payload = await request.json();
  const parsed = appointmentStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      status: parsed.data.status,
      cancellationReason: parsed.data.status === "CANCELLED" ? parsed.data.cancellationReason : null,
    },
  });

  if (parsed.data.status === "CANCELLED") {
    void sendCancellationEmail(id).catch((error) => {
      console.error("Failed to send cancellation email", error);
    });
  }

  return NextResponse.json({ appointment: { ...appointment, price: Number(appointment.price) } });
}
