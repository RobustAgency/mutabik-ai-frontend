import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';


const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'bnaoagrgcucuesuchppb.supabase.co',
    ],
  },
};


if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
