"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";

type AppointmentRow = {
  id: string;
  startAt: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  service: { name: string };
  client: { fullName: string; email: string };
  price: number;
};

export function AppointmentsTable({ initialAppointments }: { initialAppointments: AppointmentRow[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: AppointmentRow["status"]) {
    setUpdatingId(id);

    const response = await fetch(`/api/admin/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, cancellationReason: status === "CANCELLED" ? "Cancelled by admin" : undefined }),
    });

    if (!response.ok) {
      setUpdatingId(null);
      return;
    }

    setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setUpdatingId(null);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left text-muted-foreground">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Client</th>
            <th className="p-3">Service</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b">
              <td className="p-3">{new Date(appointment.startAt).toLocaleString()}</td>
              <td className="p-3">
                <p className="font-medium text-plum-dark">{appointment.client.fullName}</p>
                <p className="text-xs text-muted-foreground">{appointment.client.email}</p>
              </td>
              <td className="p-3">{appointment.service.name}</td>
              <td className="p-3">EUR {appointment.price.toFixed(2)}</td>
              <td className="p-3"><StatusBadge status={appointment.status} /></td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline"><Link href={`/admin/appointments/${appointment.id}`}>View</Link></Button>
                  <select
                    value={appointment.status}
                    onChange={(event) => void updateStatus(appointment.id, event.target.value as AppointmentRow["status"])}
                    disabled={updatingId === appointment.id}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
