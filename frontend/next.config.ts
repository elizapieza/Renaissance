import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/swipe', destination: '/pages/swipe' },
      { source: '/matches', destination: '/pages/match' },
      { source: '/landing', destination: '/pages/landing' },
    ];
  },
};

export default nextConfig;
