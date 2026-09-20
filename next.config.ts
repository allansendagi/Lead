import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Standard SSG via generateStaticParams — no output: 'export' so API routes work
  async redirects() {
    return [
      // The workshop page moved from /workshop to the homepage ("/").
      { source: '/workshop', destination: '/', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
