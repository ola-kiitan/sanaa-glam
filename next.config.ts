import type { NextConfig } from "next";

/**
 * Next.js configuration for Sanaa Glam
 * 
 * - Allows images from Cloudinary (portfolio)
 * - Allows images from Supabase storage (if used)
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
