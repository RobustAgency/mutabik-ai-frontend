import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

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
