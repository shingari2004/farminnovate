import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your other config options here
  images: {
    domains: ['obmuyrvrnjoycuxedeep.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },
    ],
  },
};

export default nextConfig;

