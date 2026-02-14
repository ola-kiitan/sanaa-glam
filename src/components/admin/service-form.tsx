"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  studioPrice: number;
  zone1Price: number;
  zone2Price: number;
  zone3Price: number;
  isActive: boolean;
};

export function ServiceForm({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    durationMinutes: 60,
    studioPrice: 120,
    zone1Price: 140,
    zone2Price: 160,
    zone3Price: 180,
    isActive: true,
  });

  async function createService() {
    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) return;
    const data = (await response.json()) as { service: Service };
    setServices((prev) => [...prev, data.service]);
  }

  async function deactivateService(id: string) {
    const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, isActive: false } : service)));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">Create Service</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Duration (minutes)</Label><Input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></div>
          <div><Label>Studio Price</Label><Input type="number" value={form.studioPrice} onChange={(e) => setForm({ ...form, studioPrice: Number(e.target.value) })} /></div>
          <div><Label>Zone 1</Label><Input type="number" value={form.zone1Price} onChange={(e) => setForm({ ...form, zone1Price: Number(e.target.value) })} /></div>
          <div><Label>Zone 2</Label><Input type="number" value={form.zone2Price} onChange={(e) => setForm({ ...form, zone2Price: Number(e.target.value) })} /></div>
          <div><Label>Zone 3</Label><Input type="number" value={form.zone3Price} onChange={(e) => setForm({ ...form, zone3Price: Number(e.target.value) })} /></div>
        </div>
        <Button className="mt-4" onClick={() => void createService()}>Create Service</Button>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">All Services</h3>
        <div className="mt-3 space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.slug} • {service.isActive ? "Active" : "Inactive"}</p>
              </div>
              {service.isActive ? (
                <Button variant="outline" size="sm" onClick={() => void deactivateService(service.id)}>Deactivate</Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
