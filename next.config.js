/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://45.207.211.184:34567/:path*',
      },
    ]
  },
}

module.exports = nextConfig 