/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**', // For development with local images
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Faster in dev
  },
}

module.exports = nextConfig