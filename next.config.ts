import type { NextConfig } from "next";

// Only initialize Cloudflare dev mode in development
if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = await import(
    "@opennextjs/cloudflare"
  );
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Optimized package imports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@supabase/supabase-js",
      "@tanstack/react-table",
      "date-fns",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bnaoagrgcucuesuchppb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "mutabiq.robustapps.net",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
