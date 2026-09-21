import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" }],
      },
      {
        source: "/packages/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" }],
      },
      {
        source: "/jobs/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
