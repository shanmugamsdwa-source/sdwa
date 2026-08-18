import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization rules
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },


  // Increase body size limit for image uploads (10MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  async redirects() {
    return [
      {
        source: '/institutions',
        destination: '/affiliated-centres',
        permanent: true,
      },
      {
        source: '/institutions/:slug',
        destination: '/affiliated-centres/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
