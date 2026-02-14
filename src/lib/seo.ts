export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  const siteUrl = getSiteUrl();
  return new URL(path, siteUrl).toString();
}
