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
    /**
     * Widths derived from the actual grid zones, not guessed.
     *
     * 4096 is the top, and it is new with the `images-2` masters. A
     * full-bleed frame on a 1920px display at 2x asks for 3840; a 5K
     * panel asks for 5120 and takes the largest candidate offered, so
     * when the list stopped at 3840 every Studio Display was handed 3840
     * and upscaled it in the compositor. The old masters made that
     * unavoidable — the largest of them was 3840 wide, and a bigger
     * candidate would have been an upscale of an upscale. `images-2`
     * ships its full-bleed plates at 4200 and the hero at 4000, so 4096
     * is now a real candidate: the optimiser clamps to the master and
     * returns 4000–4096 actual pixels rather than a stretched 3840.
     */
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840, 4096],
    imageSizes: [256, 384, 512],
    /**
     * The encoder quality, allow-listed because Next rejects any value
     * not declared here. 88 rather than the default 75: these are
     * architectural renders whose subject IS material texture, and AVIF
     * at 75 takes a 1800x1200 plate down to 0.18 bits/pixel, which
     * smooths exactly the grain, fabric and concrete detail the frame
     * exists to show. 88 roughly doubles that and is where the
     * side-by-side stops being distinguishable from the source.
     */
    qualities: [88],
    /* A year. These are permanent assets under content-addressed paths. */
    minimumCacheTTL: 31536000,
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
