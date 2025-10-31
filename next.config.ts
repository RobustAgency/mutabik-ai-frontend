import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Aggressive bundle optimization for Cloudflare Workers
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@supabase/supabase-js",
      "@tanstack/react-table",
      "date-fns",
    ],
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Aggressive code splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 200000, // Keep chunks under 200KB
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              maxSize: 200000,
            },
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              maxSize: 200000,
            },
          },
        },
      };

      // Tree shaking optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use smaller lodash imports
        lodash: "lodash-es",
      };

      // Exclude heavy dependencies from server-side bundles
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          apexcharts: "apexcharts",
        });
      }
    }

    return config;
  },

  images: {
    domains: [
      "bnaoagrgcucuesuchppb.supabase.co",
      "mutabiq.robustapps.net",
      "ui-avatars.com",
    ],
  },
};

export default nextConfig;
