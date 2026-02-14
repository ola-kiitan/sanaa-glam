"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Client = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tags: string[];
  internalNotes: string | null;
  appointments: Array<{
    id: string;
    startAt: string;
    status: string;
    service: { name: string };
    price: number;
  }>;
};

export function ClientDetail({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [selectedId, setSelectedId] = useState(initialClients[0]?.id ?? "");
  const selected = clients.find((client) => client.id === selectedId);

  async function saveClient() {
    if (!selected) return;

    const response = await fetch(`/api/admin/clients/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: selected.tags,
        internalNotes: selected.internalNotes,
      }),
    });

    if (!response.ok) return;
  }

  async function deleteClient() {
    if (!selected) return;

    const response = await fetch(`/api/admin/clients/${selected.id}`, { method: "DELETE" });
    if (!response.ok) return;

    setClients((prev) => prev.filter((client) => client.id !== selected.id));
    setSelectedId("");
  }

  if (!selected) {
    return <p className="text-muted-foreground">No client selected.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-xl border p-3">
        <p className="mb-2 text-sm font-semibold text-plum-dark">Clients</p>
        <div className="space-y-2">
          {clients.map((client) => (
            <button
              key={client.id}
              className={`w-full rounded border p-2 text-left text-sm ${client.id === selectedId ? "border-primary bg-primary/5" : "border-border"}`}
              onClick={() => setSelectedId(client.id)}
              type="button"
            >
              <p className="font-medium">{client.fullName}</p>
              <p className="text-xs text-muted-foreground">{client.email}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">{selected.fullName}</h3>
        <p className="text-sm text-muted-foreground">{selected.email} • {selected.phone}</p>

        <div className="mt-4 grid gap-3">
          <div>
            <p className="mb-1 text-sm font-medium">Tags (comma separated)</p>
            <Input
              value={selected.tags.join(", ")}
              onChange={(e) =>
                setClients((prev) => prev.map((client) =>
                  client.id === selected.id
                    ? { ...client, tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) }
                    : client
                ))
              }
            />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Internal Notes</p>
            <Textarea
              value={selected.internalNotes ?? ""}
              onChange={(e) =>
                setClients((prev) => prev.map((client) =>
                  client.id === selected.id ? { ...client, internalNotes: e.target.value } : client
                ))
              }
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => void saveClient()}>Save</Button>
          <Button size="sm" variant="outline" onClick={() => window.open(`/api/admin/clients/${selected.id}/export`, "_blank")}>Export Data</Button>
          <Button size="sm" variant="destructive" onClick={() => void deleteClient()}>Delete Client</Button>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">Booking History</p>
          <div className="space-y-2">
            {selected.appointments.map((appointment) => (
              <div key={appointment.id} className="rounded border p-2 text-sm">
                <p>{new Date(appointment.startAt).toLocaleString()} • {appointment.service.name}</p>
                <p className="text-xs text-muted-foreground">{appointment.status} • EUR {appointment.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
