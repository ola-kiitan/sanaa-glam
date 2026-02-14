"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminNewAppointmentPage() {
  const [payload, setPayload] = useState({
    serviceId: "",
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    locationType: "STUDIO",
    zone: "ZONE_1",
    address: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  async function createAppointment() {
    setMessage(null);
    const response = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { error?: string; appointment?: { id: string } };
    if (!response.ok) {
      setMessage(data.error ?? "Failed to create appointment");
      return;
    }

    setMessage(`Appointment created: ${data.appointment?.id}`);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Create Manual Appointment</h1>
        <p className="text-muted-foreground">Use this form to add a booking on behalf of a client.</p>
      </div>

      <div className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
        <div><Label>Service ID</Label><Input value={payload.serviceId} onChange={(e) => setPayload({ ...payload, serviceId: e.target.value })} /></div>
        <div><Label>Date (YYYY-MM-DD)</Label><Input value={payload.date} onChange={(e) => setPayload({ ...payload, date: e.target.value })} /></div>
        <div><Label>Time (HH:mm)</Label><Input value={payload.time} onChange={(e) => setPayload({ ...payload, time: e.target.value })} /></div>
        <div><Label>Location Type</Label><Input value={payload.locationType} onChange={(e) => setPayload({ ...payload, locationType: e.target.value })} /></div>
        <div><Label>Zone</Label><Input value={payload.zone} onChange={(e) => setPayload({ ...payload, zone: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={payload.address} onChange={(e) => setPayload({ ...payload, address: e.target.value })} /></div>
        <div><Label>Client Name</Label><Input value={payload.fullName} onChange={(e) => setPayload({ ...payload, fullName: e.target.value })} /></div>
        <div><Label>Email</Label><Input value={payload.email} onChange={(e) => setPayload({ ...payload, email: e.target.value })} /></div>
        <div><Label>Phone</Label><Input value={payload.phone} onChange={(e) => setPayload({ ...payload, phone: e.target.value })} /></div>
      </div>

      <Button onClick={() => void createAppointment()}>Create Appointment</Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
