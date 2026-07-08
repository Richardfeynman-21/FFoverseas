import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ffoverseas/admin-panel', '@ffoverseas/student-dashboard'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Server-only packages — prevent bundler from tracing into these
  serverExternalPackages: ['googleapis', 'nodemailer'],
  experimental: {
    // Tree-shake barrel exports for faster compilation
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};

export default nextConfig;
