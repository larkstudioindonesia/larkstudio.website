import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/**
 * The web app manifest.
 *
 * It exists for one reason: the home-screen icon. Without it, iOS and
 * Android fall back to a screenshot of the page or to a downscaled
 * favicon, and the studio's mark is not what appears on the device.
 *
 * `theme_color` and `background_color` are the paper token, so the
 * splash and the browser chrome match the site rather than defaulting
 * to white and flashing on launch.
 *
 * Deliberately minimal — no `display: standalone`, no shortcuts, no
 * screenshots. This is a website, not an installable app, and claiming
 * otherwise would put an "Install" prompt in front of visitors who came
 * to look at buildings.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: 'Architecture, interior and landscape design across Indonesia.',
    start_url: '/',
    display: 'browser',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
