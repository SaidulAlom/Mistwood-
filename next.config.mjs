/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Images are pre-optimised WebP + JPEG and served from /public via <picture>,
  // so the built-in image optimiser is not needed.
  images: { unoptimized: true },

  poweredByHeader: false,

  // Allow the sandboxed live-preview host (and localhost) to reach the dev server.
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],

  // Conservative headers. Deliberately no X-Frame-Options / frame-ancestors:
  // the site is designed to be embeddable in previews and menus.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // fingerprinted build assets never change under the same name
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
