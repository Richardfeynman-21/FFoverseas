import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Server-only packages — prevent bundler from tracing into these
  serverExternalPackages: ['googleapis', 'nodemailer'],
  experimental: {
    // Tree-shake barrel exports for faster compilation
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};

export default nextConfig;
