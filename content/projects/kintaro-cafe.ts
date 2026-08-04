import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, seats, handover/opening dates, the
 * constraint, decisions and credits are not in the source material —
 * they are placeholder values that satisfy the content contract but are
 * not surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const kintaroCafe: Project = {
  slug: 'kintaro-cafe',

  identification: {
    name: { en: 'Kintaro Cafe', id: 'Kintaro Cafe' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Jakarta', id: 'Jakarta' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'hospitality',
    area: { value: 200, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    seats: 40, // placeholder
    daysHandoverToOpening: 12, // placeholder
    openedOn: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'kintaro-cafe-01',
      role: 'hero',
      landscape: { src: '/images/projects/kintaro-cafe/kintaro-cafe-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/kintaro-cafe/kintaro-cafe-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Kintaro storefront with a minimalist black and white facade and illuminated signage above the counter.',
        id: 'Tampak muka Kintaro dengan fasad hitam putih minimalis dan signage menyala di atas meja kasir.',
      },
    },
    {
      id: 'kintaro-cafe-02',
      role: 'project',
      landscape: { src: '/images/projects/kintaro-cafe/kintaro-cafe-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/kintaro-cafe/kintaro-cafe-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Counter area in dark tones with potted plants softening the concrete-toned finish.',
        id: 'Area meja kasir bernuansa gelap dengan tanaman pot yang melunakkan kesan beton.',
      },
    },
    {
      id: 'kintaro-cafe-03',
      role: 'project',
      landscape: { src: '/images/projects/kintaro-cafe/kintaro-cafe-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/kintaro-cafe/kintaro-cafe-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Seating area with black chairs and timber tables arranged between structural columns.',
        id: 'Area duduk dengan kursi hitam dan meja kayu yang tersusun di antara kolom struktur.',
      },
    },
    {
      id: 'kintaro-cafe-04',
      role: 'project',
      landscape: { src: '/images/projects/kintaro-cafe/kintaro-cafe-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/kintaro-cafe/kintaro-cafe-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Storefront viewed from across the street, with the Kintaro wordmark lit behind the window glazing.',
        id: 'Tampak muka toko dari seberang jalan, dengan wordmark Kintaro menyala di balik kaca jendela.',
      },
    },
    {
      id: 'kintaro-cafe-05',
      role: 'project',
      landscape: { src: '/images/projects/kintaro-cafe/kintaro-cafe-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/kintaro-cafe/kintaro-cafe-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Dining area set against an exposed brick wall, with timber tables and mixed seating.',
        id: 'Area makan dengan latar dinding bata ekspos, meja kayu, dan kursi campuran.',
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
    en: 'This cafe project was designed as a vibrant gathering space in the heart of Jakarta, embracing an industrial aesthetic with a strong focus on sustainability. By maximizing the use of recycled materials and working within a limited budget, the design creates a distinctive and iconic destination with character, warmth, and lasting appeal.',
    id: 'Proyek kafe ini dirancang sebagai ruang berkumpul yang hidup di tengah kota Jakarta, mengusung estetika industrial dengan perhatian besar pada keberlanjutan. Dengan memaksimalkan penggunaan material daur ulang dan bekerja dalam anggaran terbatas, desain ini menciptakan destinasi yang khas dan mudah dikenali, penuh karakter, kehangatan, dan daya tarik yang bertahan lama.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/kintaro-cafe.jpg',

  published: true,
};
