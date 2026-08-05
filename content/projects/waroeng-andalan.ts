import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, seats, handover/opening dates, the
 * constraint, decisions and credits are not in the source material —
 * they are placeholder values that satisfy the content contract but are
 * not surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const waroengAndalan: Project = {
  slug: 'waroeng-andalan',

  identification: {
    name: { en: 'Waroeng Andalan', id: 'Waroeng Andalan' },
    type: { en: 'Restaurant', id: 'Restoran' },
    location: { en: 'Tangerang', id: 'Tangerang' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'hospitality',
    area: { value: 182, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    seats: 40, // placeholder
    daysHandoverToOpening: 12, // placeholder
    openedOn: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'waroeng-andalan-01',
      role: 'hero',
      landscape: { src: '/images/projects/waroeng-andalan/waroeng-andalan-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/waroeng-andalan/waroeng-andalan-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Waroeng Andalan storefront at street level, with green signage and a covered dining terrace behind full-height glazing.',
        id: 'Tampak muka Waroeng Andalan dari jalan, dengan signage hijau dan teras makan beratap di balik kaca setinggi penuh.',
      },
    },
    {
      id: 'waroeng-andalan-02',
      role: 'project',
      landscape: { src: '/images/projects/waroeng-andalan/waroeng-andalan-02-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/waroeng-andalan/waroeng-andalan-02-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Dining room with a timber service counter, exposed brick wall and woven rattan stools along the bar.',
        id: 'Ruang makan dengan meja layanan kayu, dinding bata ekspos, dan kursi rotan anyam di sepanjang bar.',
      },
    },
    {
      id: 'waroeng-andalan-03',
      role: 'project',
      landscape: { src: '/images/projects/waroeng-andalan/waroeng-andalan-03-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/waroeng-andalan/waroeng-andalan-03-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Wide view of the dining hall with green structural columns, bar seating and potted plants along the aisle.',
        id: 'Pandangan luas ruang makan dengan kolom struktur hijau, kursi bar, dan tanaman pot di sepanjang lorong.',
      },
    },
    {
      id: 'waroeng-andalan-04',
      role: 'project',
      landscape: { src: '/images/projects/waroeng-andalan/waroeng-andalan-04-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/waroeng-andalan/waroeng-andalan-04-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Order counter with overhead menu boards, green tile accents and a black-and-white checkered floor.',
        id: 'Meja pemesanan dengan papan menu di atasnya, aksen keramik hijau, dan lantai catur hitam putih.',
      },
    },
    {
      id: 'waroeng-andalan-05',
      role: 'project',
      landscape: { src: '/images/projects/waroeng-andalan/waroeng-andalan-05-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/waroeng-andalan/waroeng-andalan-05-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Booth seating upholstered in green, set against a patterned tile floor along the dining room wall.',
        id: 'Kursi booth berlapis kain hijau, berdiri di atas lantai keramik bermotif di sepanjang dinding ruang makan.',
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
    en: 'The second branch of Waroeng Andalan builds upon the brand’s established identity while offering a significantly larger dining experience. Designed to enhance the everyday dining experience, the space blends warmth, nostalgia, and contemporary comfort, transforming a casual eatery into a memorable culinary destination.',
    id: 'Cabang kedua Waroeng Andalan melanjutkan identitas yang telah dibangun oleh brand ini, kini hadir dengan pengalaman bersantap yang jauh lebih luas. Dirancang untuk meningkatkan pengalaman makan sehari-hari, ruang ini memadukan kehangatan, nostalgia, dan kenyamanan kontemporer, mengubah sebuah warung makan sederhana menjadi destinasi kuliner yang berkesan.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/waroeng-andalan.jpg',

  published: true,
};
