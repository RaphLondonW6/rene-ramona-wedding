/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cf.bstatic.com' },
      { protocol: 'https', hostname: 'photos.hotelbeds.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // required for Cloudflare Pages
  },
}

module.exports = nextConfig
