/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Enable server logs for Next.js API routes
    INTERNAL_API_LOGS: true,
  },

  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/workshops/attendance',
        destination: '/html/workshops/index.html'
      },
      {
        source: '/workshops/survey',
        destination: '/html/workshops/survey.html'
      },
      {
        source: '/workshops/departments',
        destination: '/html/workshops/departments.html'
      },
      {
        source: '/workshops/:path*',
        destination: '/html/workshops/:path*'
      }
    ]
  }
}


module.exports = nextConfig
