import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudinary image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/jamyxdzq/**',
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
