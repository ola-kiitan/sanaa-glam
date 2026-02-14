import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Services</h1>
        <p className="text-muted-foreground">Create, edit, and deactivate service offerings.</p>
      </div>

      <ServiceForm
        initialServices={services.map((service) => ({
          ...service,
          studioPrice: Number(service.studioPrice),
          zone1Price: Number(service.zone1Price),
          zone2Price: Number(service.zone2Price),
          zone3Price: Number(service.zone3Price),
        }))}
      />
    </div>
  );
}
