import type { NextConfig } from 'next';

/**
 * Fully static. Every route is prerendered at build; no SSR, no ISR, no
 * runtime data fetching — content lives in the repository as typed
 * modules. The site builds and deploys in ten years with nothing but
 * Node and the source.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    /* AVIF first, WebP fallback. */
    formats: ['image/avif', 'image/webp'],
    /* Widths derived from the actual grid zones, not guessed. 2560 is
       the top because that is what a full-bleed frame asks for on a
       retina laptop, and it is what the `lead` masters are exported at. */
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [256, 384, 512],
  },

  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
