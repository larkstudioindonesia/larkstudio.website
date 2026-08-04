import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, occupied-since date, the constraint,
 * decisions and credits are not in the source material — they are
 * placeholder values that satisfy the content contract but are not
 * surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const mrYpHouse: Project = {
  slug: 'mr-yp-house',

  identification: {
    name: { en: 'Mr. YP House', id: 'Rumah Mr. YP' },
    type: { en: 'House', id: 'Rumah' },
    location: { en: 'Tangerang', id: 'Tangerang' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'residential',
    area: { value: 205, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    occupiedSince: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'mr-yp-house-01',
      role: 'hero',
      landscape: { src: '/images/projects/mr-yp-house/mr-yp-house-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/mr-yp-house/mr-yp-house-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Two-storey house exterior with timber accents, a parked car in the driveway and planting along the wall.',
        id: 'Tampak luar rumah dua lantai dengan aksen kayu, mobil terparkir di garasi, dan tanaman di sepanjang dinding.',
      },
    },
    {
      id: 'mr-yp-house-02',
      role: 'project',
      landscape: { src: '/images/projects/mr-yp-house/mr-yp-house-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mr-yp-house/mr-yp-house-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Living room with a built-in timber bookshelf and cabinetry along the wall behind a low console.',
        id: 'Ruang keluarga dengan rak buku dan kabinet kayu tertanam di dinding belakang konsol rendah.',
      },
    },
    {
      id: 'mr-yp-house-03',
      role: 'project',
      landscape: { src: '/images/projects/mr-yp-house/mr-yp-house-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mr-yp-house/mr-yp-house-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Wide exterior view showing a covered pergola walkway and climbing greenery along the second floor.',
        id: 'Pandangan luar luas menampilkan jalan setapak berpergola beratap dan tanaman rambat di lantai dua.',
      },
    },
    {
      id: 'mr-yp-house-04',
      role: 'project',
      landscape: { src: '/images/projects/mr-yp-house/mr-yp-house-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mr-yp-house/mr-yp-house-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Entry hallway finished in timber panelling with a glazed doorway visible at the far end.',
        id: 'Lorong pintu masuk dengan finishing panel kayu dan pintu berkaca terlihat di ujung lorong.',
      },
    },
    {
      id: 'mr-yp-house-05',
      role: 'project',
      landscape: { src: '/images/projects/mr-yp-house/mr-yp-house-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/mr-yp-house/mr-yp-house-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Detail of a timber wall panel beside a window, showing the grain and joinery up close.',
        id: 'Detail panel dinding kayu di samping jendela, memperlihatkan serat dan sambungan dari jarak dekat.',
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
    en: 'This interior visualization project explores a residential design approach centered on warmth, functionality, and the authentic expression of materials. Thoughtfully selected textures, natural finishes, and balanced spatial compositions create inviting living spaces that are both enduring and practical.',
    id: 'Proyek visualisasi interior ini mengeksplorasi pendekatan desain hunian yang berpusat pada kehangatan, fungsi, dan ekspresi material yang jujur. Tekstur yang dipilih dengan cermat, finishing alami, serta komposisi ruang yang seimbang menciptakan ruang tinggal yang mengundang, sekaligus tahan lama dan praktis.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/mr-yp-house.jpg',

  published: true,
};
