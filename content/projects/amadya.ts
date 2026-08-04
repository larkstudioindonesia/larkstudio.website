import type { Project } from '@/content/types';

/**
 * Identification, area and the outcome paragraph are drawn directly from
 * the company profile. Programme, seats, handover/opening dates, the
 * constraint, decisions and credits are not in the source material —
 * they are placeholder values that satisfy the content contract but are
 * not surfaced on the project page yet. Replace once the real figures,
 * contractor and photographer credit are available.
 */
export const amadya: Project = {
  slug: 'amadya',

  identification: {
    name: { en: 'Amadya', id: 'Amadya' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Denpasar, Bali', id: 'Denpasar, Bali' },
    year: 2025, // placeholder — not stated in the source
  },

  // placeholder — not stated in the source; not rendered yet
  constraint: {
    en: 'Constraint details pending — to be added once full project documentation is available.',
    id: 'Detail kendala menyusul — akan dilengkapi setelah dokumentasi proyek tersedia sepenuhnya.',
  },

  specification: {
    kind: 'hospitality',
    area: { value: 156, unit: 'sqm' },
    programme: { value: 12, unit: 'weeks' }, // placeholder
    seats: 40, // placeholder
    daysHandoverToOpening: 12, // placeholder
    openedOn: '2025-01-01', // placeholder
  },

  images: [
    {
      id: 'amadya-01',
      role: 'hero',
      landscape: { src: '/images/projects/amadya/amadya-01-3x2.jpg', width: 4200, height: 2800 },
      portrait: { src: '/images/projects/amadya/amadya-01-4x5.jpg', width: 3220, height: 4025 },
      alt: {
        en: 'Amadya storefront with a dark corrugated roof, hanging greenery along the fascia and an open terrace below.',
        id: 'Tampak muka Amadya dengan atap gelombang gelap, tanaman rambat di sepanjang fasia, dan teras terbuka di bawahnya.',
      },
    },
    {
      id: 'amadya-02',
      role: 'project',
      landscape: { src: '/images/projects/amadya/amadya-02-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/amadya/amadya-02-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Espresso bar with timber panelling and a glass display case facing the seating area.',
        id: 'Bar espreso dengan panel kayu dan etalase kaca yang menghadap area duduk.',
      },
    },
    {
      id: 'amadya-03',
      role: 'project',
      landscape: { src: '/images/projects/amadya/amadya-03-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/amadya/amadya-03-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Pastry counter with open timber shelving, ceramic cups and a round mirror on the wall behind.',
        id: 'Meja pastry dengan rak kayu terbuka, cangkir keramik, dan cermin bundar di dinding belakangnya.',
      },
    },
    {
      id: 'amadya-04',
      role: 'project',
      landscape: { src: '/images/projects/amadya/amadya-04-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/amadya/amadya-04-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation of the stairwell mid-construction, bare plaster walls awaiting finish.',
        id: 'Dokumentasi lapangan tangga saat masih dalam konstruksi, dinding plester polos menunggu finishing.',
      },
    },
    {
      id: 'amadya-05',
      role: 'project',
      landscape: { src: '/images/projects/amadya/amadya-05-3x2.jpg', width: 2700, height: 1800 },
      portrait: { src: '/images/projects/amadya/amadya-05-4x5.jpg', width: 2448, height: 3060 },
      alt: {
        en: 'Site documentation photograph inside the glass-walled shopfront during a construction visit.',
        id: 'Foto dokumentasi lapangan di dalam ruang berdinding kaca saat kunjungan konstruksi berlangsung.',
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
    en: 'A 24 hour coffee shop set within a shophouse, designed to balance openness and refinement. Natural materials and unfinished wall textures create a warm, honest atmosphere that feels welcoming and comfortable for everyone, at any hour.',
    id: 'Kedai kopi yang buka 24 jam ini berada dalam sebuah ruko, dirancang untuk menyeimbangkan keterbukaan dan kesan yang lebih halus. Material alami dan tekstur dinding yang dibiarkan apa adanya menciptakan suasana hangat dan jujur yang terasa nyaman bagi siapa pun, kapan pun.',
  },

  credits: {
    photographer: 'Studio Documentation', // placeholder
    contractor: 'Main Contractor', // placeholder
  },

  openGraphImage: '/og/amadya.jpg',

  published: true,
};
