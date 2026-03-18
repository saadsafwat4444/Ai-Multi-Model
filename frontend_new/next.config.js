/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:9999/auth/:path*',
      },
      {
        source: '/api/chat/:path*',
        destination: 'http://localhost:9999/chat/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
