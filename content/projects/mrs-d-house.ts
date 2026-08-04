import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, occupied-since date, the constraint,
 * decisions and credits are not in the source material — they are
 * placeholder values that satisfy the content contract but are not
 * surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const mrsDHouse: Project = {
  slug: 'mrs-d-house',

  identification: {
    name: { en: 'Mrs. D House', id: 'Rumah Mrs. D' },
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
    area: { value: 110, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    occupiedSince: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'mrs-d-house-01',
      role: 'hero',
      landscape: { src: '/images/projects/mrs-d-house/mrs-d-house-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/mrs-d-house/mrs-d-house-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'House exterior with red brick arches, a first-floor balcony and greenery along the facade.',
        id: 'Tampak luar rumah dengan lengkungan bata merah, balkon lantai dua, dan tanaman di sepanjang fasad.',
      },
    },
    {
      id: 'mrs-d-house-02',
      role: 'project',
      landscape: { src: '/images/projects/mrs-d-house/mrs-d-house-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mrs-d-house/mrs-d-house-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Kitchen with timber cabinetry and full-height glass doors opening onto an outdoor patio.',
        id: 'Dapur dengan kabinet kayu dan pintu kaca setinggi penuh yang membuka ke teras luar.',
      },
    },
    {
      id: 'mrs-d-house-03',
      role: 'project',
      landscape: { src: '/images/projects/mrs-d-house/mrs-d-house-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mrs-d-house/mrs-d-house-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Staircase detail with a slatted timber balustrade against a plain wall.',
        id: 'Detail tangga dengan railing kayu berbilah di depan dinding polos.',
      },
    },
    {
      id: 'mrs-d-house-04',
      role: 'project',
      landscape: { src: '/images/projects/mrs-d-house/mrs-d-house-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mrs-d-house/mrs-d-house-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation of the existing living room before renovation, with a sectional sofa and display cabinet.',
        id: 'Dokumentasi lapangan ruang keluarga eksisting sebelum renovasi, dengan sofa sudut dan lemari pajang.',
      },
    },
    {
      id: 'mrs-d-house-05',
      role: 'project',
      landscape: { src: '/images/projects/mrs-d-house/mrs-d-house-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mrs-d-house/mrs-d-house-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation photograph taken during a site visit inside the existing house.',
        id: 'Foto dokumentasi lapangan yang diambil saat kunjungan lokasi di dalam rumah eksisting.',
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
    en: 'This residential renovation project aims to enhance the quality of living through thoughtful spatial reconfiguration, functional optimization, and a comprehensive architectural and interior transformation. By redefining the existing layout and introducing a cohesive design language, the project creates a home that is more efficient, comfortable, and better aligned with the evolving needs and lifestyle of its occupants.',
    id: 'Proyek renovasi hunian ini bertujuan meningkatkan kualitas tinggal melalui penataan ulang ruang, optimalisasi fungsi, serta transformasi arsitektur dan interior secara menyeluruh. Dengan menata ulang denah yang ada dan menghadirkan bahasa desain yang menyatu, proyek ini menciptakan rumah yang lebih efisien, nyaman, dan selaras dengan kebutuhan serta gaya hidup penghuninya yang terus berkembang.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/mrs-d-house.jpg',

  published: true,
};
