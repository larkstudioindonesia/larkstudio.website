import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, occupied-since date, the constraint,
 * decisions and credits are not in the source material — they are
 * placeholder values that satisfy the content contract but are not
 * surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const msRaHouse: Project = {
  slug: 'ms-ra-house',

  identification: {
    name: { en: 'Ms. RA House', id: 'Rumah Ms. RA' },
    type: { en: 'House', id: 'Rumah' },
    location: { en: 'Bogor', id: 'Bogor' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'residential',
    area: { value: 40, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    occupiedSince: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'ms-ra-house-01',
      role: 'hero',
      landscape: { src: '/images/projects/ms-ra-house/ms-ra-house-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/ms-ra-house/ms-ra-house-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'House exterior with an arched window, brick detailing and a second-floor balcony.',
        id: 'Tampak luar rumah dengan jendela melengkung, detail bata, dan balkon lantai dua.',
      },
    },
    {
      id: 'ms-ra-house-02',
      role: 'project',
      landscape: { src: '/images/projects/ms-ra-house/ms-ra-house-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/ms-ra-house/ms-ra-house-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Kitchen with timber cabinetry and a glass sliding door opening onto a small patio.',
        id: 'Dapur dengan kabinet kayu dan pintu geser kaca yang membuka ke teras kecil.',
      },
    },
    {
      id: 'ms-ra-house-03',
      role: 'project',
      landscape: { src: '/images/projects/ms-ra-house/ms-ra-house-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/ms-ra-house/ms-ra-house-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Timber staircase detail seen from below, set against a bench and cushions.',
        id: 'Detail tangga kayu dilihat dari bawah, berdampingan dengan bangku dan bantal duduk.',
      },
    },
    {
      id: 'ms-ra-house-04',
      role: 'project',
      landscape: { src: '/images/projects/ms-ra-house/ms-ra-house-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/ms-ra-house/ms-ra-house-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation of a built kitchen cabinet with under-shelf lighting and a tiled backsplash.',
        id: 'Dokumentasi lapangan kabinet dapur terpasang dengan lampu bawah rak dan dinding berkeramik.',
      },
    },
    {
      id: 'ms-ra-house-05',
      role: 'project',
      landscape: { src: '/images/projects/ms-ra-house/ms-ra-house-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/ms-ra-house/ms-ra-house-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation of an open overhead cabinet with a built-in plate rack and warm under-cabinet lighting.',
        id: 'Dokumentasi lapangan kabinet atas terbuka dengan rak piring bawaan dan lampu hangat di bawah kabinet.',
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
    en: 'This renovation transforms a compact kitchen into a functional, storage-efficient space inspired by Japandi design. Warm materials, soft tones, and clean lines create an inviting kitchen and dining area, while the family room, living room, and multipurpose space are well integrated to provide a more open and welcoming environment for everyday living and entertaining.',
    id: 'Renovasi ini mengubah dapur yang sempit menjadi ruang yang fungsional dan efisien dalam penyimpanan, terinspirasi desain Japandi. Material hangat, warna-warna lembut, dan garis yang bersih menciptakan area dapur dan makan yang mengundang, sementara ruang keluarga, ruang tamu, dan ruang serbaguna terintegrasi dengan baik untuk menghadirkan suasana yang lebih terbuka dan ramah bagi keseharian maupun saat menerima tamu.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/ms-ra-house.jpg',

  published: true,
};
