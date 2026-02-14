import type { LocationType, Service, Zone } from "@prisma/client";

/**
 * Resolve the final appointment price based on location and selected zone.
 */
export function resolvePrice(service: Service, locationType: LocationType, zone?: Zone | null): number {
  if (locationType === "STUDIO") {
    return Number(service.studioPrice);
  }

  switch (zone) {
    case "ZONE_1":
      return Number(service.zone1Price);
    case "ZONE_2":
      return Number(service.zone2Price);
    case "ZONE_3":
      return Number(service.zone3Price);
    default:
      throw new Error("Zone is required for travel appointments");
  }
}
