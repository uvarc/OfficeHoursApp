/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Enable server logs for Next.js API routes
    INTERNAL_API_LOGS: true,
  },
  
  reactStrictMode: true,
}


module.exports = nextConfig
