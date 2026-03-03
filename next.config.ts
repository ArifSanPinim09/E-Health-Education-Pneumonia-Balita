import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-intersection-observer'],
  },
};

export default nextConfig;
