import type { HomeContent } from '@/content/types';

/**
 * Home is the index: a short statement, then the work. There is no
 * separate Work page, because with four to six projects an index page
 * exists only to hold six links.
 *
 * The statement states scope and points at the evidence. It does not
 * claim rigour, longevity or care — those are demonstrated by the
 * named contractor, the handover-to-opening figures and the outcome
 * dates on each project page. Nothing here uses the words bespoke,
 * curated, passionate, elevate, seamless, journey or timeless.
 */
export const home: HomeContent = {
  metaTitle: {
    en: 'Lark Studio | Architecture & Interior Design',
    id: 'Lark Studio | Arsitektur & Interior',
  },

  metaDescription: {
    en: 'Architecture and interior design studio creating aesthetically pleasing functional spaces for residential and commercial projects across Indonesia.',
    id: 'Studio arsitektur dan interior yang merancang ruang estetik dan fungsional untuk proyek hunian dan komersial di Indonesia.',
  },

  /* Draft copy — usable as-is, but flagged for studio sign-off before
     launch, same as any other on-page copy. */
  heroHeadline: {
    en: 'Turning Vision Into Shape',
    id: 'Mengubah Visi Menjadi Ruang',
  },
  heroSubhead: {
    en: 'Architecture and Interior Design.',
    id: 'Desain Arsitektur dan Interior..',
  },
  /* Declared dimensions must match the file exactly — checked by
     scripts/audit-assets.ts, same as every project image. */
  heroImage: {
    src: '/images/home-hero.jpg',
    width: 4000,
    height: 2535,
  },

  statement: {
    en: [
      'Lark Studio focuses on functional tropical architecture and warm material driven interiors, combining wood, breeze block, and natural textures to create spaces that feel calm, efficient, and enduring.',
      'Our work focuses on residential and commercial projects, helping clients transform ideas into spaces that feel intentional and practical.',
    ],
    id: [
      'Lark Studio berfokus pada arsitektur tropis yang fungsional serta interior yang hangat dan mengutamakan material, memadukan kayu, roster, dan tekstur alami untuk menciptakan ruang yang terasa tenang, efisien, dan tahan lama.',
      'Karya kami berfokus pada proyek hunian dan komersial, membantu klien mewujudkan ide menjadi ruang yang terasa tepat guna dan praktis.',
    ],
  },

  closing: {
    en: 'We would love to discuss your project and explore how thoughtful design can bring your ideas to life.',
    id: 'Kami siap berdiskusi mengenai proyek Anda dan mengeksplorasi bagaimana desain yang matang dapat mewujudkan setiap ide menjadi kenyataan.',
  },

  closingAction: {
    en: 'Contact Us',
    id: 'Hubungi Kami',
  },

  openGraphImage: '/og/home.jpg',
};
