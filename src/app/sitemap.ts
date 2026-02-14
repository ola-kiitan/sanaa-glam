import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/actions/services";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/portfolio",
    "/reviews",
    "/faq",
    "/booking",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/stornierung",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceSlugs = await getServiceSlugs();
  const serviceRoutes = serviceSlugs.map(({ slug }) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
