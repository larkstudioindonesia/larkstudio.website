import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, seats, handover/opening dates, the
 * constraint, decisions and credits are not in the source material —
 * they are placeholder values that satisfy the content contract but are
 * not surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const atomicCafe: Project = {
  slug: 'atomic-cafe',

  identification: {
    name: { en: 'Atomic Cafe', id: 'Atomic Cafe' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Bogor', id: 'Bogor' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'hospitality',
    area: { value: 115.5, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    seats: 40, // placeholder
    daysHandoverToOpening: 12, // placeholder
    openedOn: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'atomic-cafe-01',
      role: 'hero',
      landscape: { src: '/images/projects/atomic-cafe/atomic-cafe-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/atomic-cafe/atomic-cafe-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Atomic Cafe counter with a bold red accent wall, illuminated signage and a pastry display.',
        id: 'Meja kasir Atomic Cafe dengan dinding aksen merah berani, signage menyala, dan etalase pastry.',
      },
    },
    {
      id: 'atomic-cafe-02',
      role: 'project',
      landscape: { src: '/images/projects/atomic-cafe/atomic-cafe-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/atomic-cafe/atomic-cafe-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Closer view of the red counter wall with the Atomic wordmark and merchandise on display.',
        id: 'Tampak dekat dinding kasir merah dengan wordmark Atomic dan merchandise yang dipajang.',
      },
    },
    {
      id: 'atomic-cafe-03',
      role: 'project',
      landscape: { src: '/images/projects/atomic-cafe/atomic-cafe-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/atomic-cafe/atomic-cafe-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Seating nook with a round red table, wall sconces and framed artwork above a banquette.',
        id: 'Sudut duduk dengan meja bundar merah, lampu dinding, dan karya seni berbingkai di atas bangku panjang.',
      },
    },
    {
      id: 'atomic-cafe-04',
      role: 'project',
      landscape: { src: '/images/projects/atomic-cafe/atomic-cafe-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/atomic-cafe/atomic-cafe-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Staircase detail finished in dark green tile with a timber handrail and treads.',
        id: 'Detail tangga dengan finishing keramik hijau tua, pegangan tangan kayu, dan anak tangga kayu.',
      },
    },
    {
      id: 'atomic-cafe-05',
      role: 'project',
      landscape: { src: '/images/projects/atomic-cafe/atomic-cafe-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/atomic-cafe/atomic-cafe-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Wide interior view with bench seating, red accents and the counter visible in the background.',
        id: 'Pandangan interior luas dengan kursi bangku, aksen merah, dan meja kasir terlihat di latar belakang.',
      },
    },
  ],

  decisions: [
    {
      id: 'materials',
      heading: { en: 'Material selection', id: 'Pemilihan material' },
      body: {
        en: 'Placeholder — to be replaced with the real material decision and its rationale.',
        id: 'Placeholder — akan diganti dengan keputusan material sesungguhnya beserta alasannya.',
      },
    },
    {
      id: 'layout',
      heading: { en: 'Spatial planning', id: 'Perencanaan ruang' },
      body: {
        en: 'Placeholder — to be replaced with the real circulation or layout decision and its rationale.',
        id: 'Placeholder — akan diganti dengan keputusan sirkulasi atau tata ruang sesungguhnya beserta alasannya.',
      },
    },
  ],

  outcome: {
    en: 'Inspired by Mid-Century design with bold red accents, Atomic Cafe brings a vibrant and nostalgic atmosphere to the heart of Bogor. Designed as a social hub for young people, the cafe offers a warm, distinctive space that encourages gathering, conversation, and connection.',
    id: 'Terinspirasi desain Mid-Century dengan aksen merah yang berani, Atomic Cafe menghadirkan suasana yang hidup dan nostalgik di jantung kota Bogor. Dirancang sebagai ruang sosial bagi anak muda, kafe ini menawarkan ruang yang hangat dan khas, mengundang orang untuk berkumpul, mengobrol, dan terhubung satu sama lain.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/atomic-cafe.jpg',

  published: true,
};
