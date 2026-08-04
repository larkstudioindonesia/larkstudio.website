import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, seats, handover/opening dates, the
 * constraint, decisions and credits are not in the source material —
 * they are placeholder values that satisfy the content contract but are
 * not surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const thePrasetyos: Project = {
  slug: 'the-prasetyos',

  identification: {
    name: { en: 'The Prasetyo’s', id: 'The Prasetyo’s' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Wonosobo', id: 'Wonosobo' },
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
      id: 'the-prasetyos-01',
      role: 'hero',
      landscape: { src: '/images/projects/the-prasetyos/the-prasetyos-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/the-prasetyos/the-prasetyos-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Weathered shophouse facade with a small entrance and hand-painted signage above the door.',
        id: 'Fasad ruko lawas dengan pintu masuk kecil dan signage bertuliskan tangan di atas pintu.',
      },
    },
    {
      id: 'the-prasetyos-02',
      role: 'project',
      landscape: { src: '/images/projects/the-prasetyos/the-prasetyos-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/the-prasetyos/the-prasetyos-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Communal interior with white walls, timber shutters and a pendant lamp over a green wainscoted wall.',
        id: 'Interior komunal dengan dinding putih, jendela kayu, dan lampu gantung di atas dinding berlapis hijau.',
      },
    },
    {
      id: 'the-prasetyos-03',
      role: 'project',
      landscape: { src: '/images/projects/the-prasetyos/the-prasetyos-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/the-prasetyos/the-prasetyos-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Wide interior view with exposed timber roof beams, framed pictures on the wall and potted plants.',
        id: 'Pandangan interior luas dengan balok atap kayu ekspos, foto berbingkai di dinding, dan tanaman pot.',
      },
    },
    {
      id: 'the-prasetyos-04',
      role: 'project',
      landscape: { src: '/images/projects/the-prasetyos/the-prasetyos-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/the-prasetyos/the-prasetyos-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation of the existing room with teal armchairs, a vintage television and framed photographs.',
        id: 'Dokumentasi lapangan ruang eksisting dengan kursi berlengan hijau toska, televisi tua, dan foto berbingkai.',
      },
    },
    {
      id: 'the-prasetyos-05',
      role: 'project',
      landscape: { src: '/images/projects/the-prasetyos/the-prasetyos-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/the-prasetyos/the-prasetyos-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Close site documentation of the roof structure and skylight during renovation.',
        id: 'Dokumentasi lapangan jarak dekat pada struktur atap dan skylight saat renovasi berlangsung.',
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
    en: 'An old house transformed into a communal café, breakfast spot, and mini museum for the local community to gather, share ideas, and showcase local products.',
    id: 'Sebuah rumah lama diubah menjadi kafe komunal, tempat sarapan, sekaligus museum mini bagi warga sekitar untuk berkumpul, bertukar ide, dan menampilkan produk lokal.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/the-prasetyos.jpg',

  published: true,
};
