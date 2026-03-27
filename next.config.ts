import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oesrwgcawummhdmwzbvs.supabase.co',
      },
    ],
  },
};

export default nextConfig;
