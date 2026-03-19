/** @type {import('next').NextConfig} */
const nextConfig = {
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