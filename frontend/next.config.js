/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://ai-multi-model-production-ef6f.up.railway.app/auth/:path*',
      },
      {
        source: '/api/chat/:path*',
        destination: 'https://ai-multi-model-production-ef6f.up.railway.app/chat/:path*',
      },
    ];
  },
};

module.exports = nextConfig;