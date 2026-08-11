import type { Localized, Passage } from '@/content/types';

/**
 * EVERY WORD ON THE SITE THAT IS NOT A PROJECT.
 *
 * Studio facts, interface strings and page copy in one file, because
 * they are edited together: renaming a section means touching its label
 * and its heading in the same sitting, and they used to live three
 * directories apart.
 *
 * Both languages are authored, never machine-translated. Marketing
 * English run literally into Bahasa goes stiff and bureaucratic. Nothing
 * here uses the words bespoke, curated, passionate, elevate, seamless,
 * journey or timeless.
 */

/* ------------------------------------------------------------------ *
 * The studio
 * ------------------------------------------------------------------ */

export const site = {
  name: 'Lark Studio',
  origin: 'https://larkstudio.co.id',
  email: 'larkstudioindonesia@gmail.com',
  /** E.164, digits only, no plus. */
  whatsapp: '6285117314718',
  whatsappOpener: {
    en: 'Hello Lark Studio, I would like to discuss an architecture and interior design project.',
    id: 'Halo Lark Studio, Saya ingin berdiskusi mengenai proyek arsitektur dan interior.',
  } satisfies Localized<string>,
  address: ['Achmad Adnawijaya St B7 No.5', 'Bogor 16152', 'Indonesia'],
  /** For the footer clock. Bogor is UTC+7 year round. */
  timeZone: 'Asia/Jakarta',
  instagram: {
    handle: '@larkstudio.id',
    href: 'https://instagram.com/larkstudio.id',
  },
  founded: 2025,
} as const;

/* ------------------------------------------------------------------ *
 * Interface
 * ------------------------------------------------------------------ */

export const ui = {
  skipToContent: { en: 'Skip to content', id: 'Lewati ke konten' },
  menuOpen: { en: 'Menu', id: 'Menu' },
  menuClose: { en: 'Close', id: 'Tutup' },
  scroll: { en: 'Scroll', id: 'Gulir' },
  viewProject: { en: 'View', id: 'Lihat' },

  navWork: { en: 'Work', id: 'Karya' },
  navApproach: { en: 'Approach', id: 'Cara Kerja' },
  navStudio: { en: 'Studio', id: 'Studio' },
  navContact: { en: 'Contact', id: 'Kontak' },

  selectedWork: { en: 'Selected work', id: 'Karya pilihan' },
  disciplines: { en: 'Disciplines', id: 'Disiplin' },
  howWeWork: { en: 'How we work', id: 'Cara kami bekerja' },
  nextProject: { en: 'Next project', id: 'Proyek berikutnya' },
  allWork: { en: 'All work', id: 'Semua karya' },
  gallery: { en: 'Gallery', id: 'Galeri' },
  result: { en: 'Result', id: 'Hasil' },
  details: { en: 'Details', id: 'Detail' },
  writtenIn: { en: 'Studio', id: 'Studio' },

  type: { en: 'Type', id: 'Jenis' },
  location: { en: 'Location', id: 'Lokasi' },
  year: { en: 'Year', id: 'Tahun' },
  area: { en: 'Area', id: 'Luas' },
  localTime: { en: 'Bogor', id: 'Bogor' },

  notFoundTitle: { en: 'Page not found', id: 'Halaman tidak ditemukan' },
  notFoundBody: {
    en: 'This page has moved or no longer exists.',
    id: 'Halaman ini telah dipindahkan atau tidak lagi tersedia.',
  },
} as const satisfies Record<string, Localized<string>>;

/* ------------------------------------------------------------------ *
 * Home
 * ------------------------------------------------------------------ */

export const home = {
  metaTitle: {
    en: 'Lark Studio | Architecture & Interior Design',
    id: 'Lark Studio | Arsitektur & Interior',
  },
  metaDescription: {
    en: 'Architecture and interior design studio creating aesthetically pleasing functional spaces for residential and commercial projects across Indonesia.',
    id: 'Studio arsitektur dan interior yang merancang ruang estetik dan fungsional untuk proyek hunian dan komersial di Indonesia.',
  },

  /**
   * TWO LINES, NOT ONE STRING.
   *
   * The break is composition, not typography luck: line one is set
   * upright and splits per character, line two is indented and italic
   * and splits per word. A single string reflowing at whatever width the
   * viewport happens to be is why the old hero read as a paragraph in a
   * large font rather than as a headline.
   */
  heroLines: {
    en: ['Tropical architecture', 'built to last'],
    id: ['Arsitektur tropis', 'dibangun untuk bertahan'],
  } as Localized<readonly [string, string]>,

  heroSubhead: {
    en: 'Architecture, interior and landscape design across Indonesia.',
    id: 'Desain arsitektur, interior, dan lanskap di seluruh Indonesia.',
  },
  /**
   * THE HERO FRAME, CHOSEN RATHER THAN TAKEN.
   *
   * Picked for what it does UNDER TYPE, not for how good it is on its
   * own: dark through the lower two thirds, with its own signage high
   * and right where the headline is not. An earlier pass simply took the
   * first project's lead frame and put "Tropical architecture" directly
   * across a two-metre banner reading MAKAN ENAK CUMA 18RB-AN.
   */
  stage: { bed: 'amadya-01' },

  heroMeta: {
    en: ['Bogor, Indonesia', 'Est. 2025', 'Available for 2026'],
    id: ['Bogor, Indonesia', 'Sejak 2025', 'Tersedia untuk 2026'],
  },

  /* The manifesto. Read one word at a time as the reader scrolls, so
     it is written in short clauses that survive being lit up piecemeal. */
  manifesto: {
    en: 'We build in the tropics, for the tropics. Wood, breeze block and natural texture, worked until a room feels calm, efficient and unmistakably its own.',
    id: 'Kami membangun di iklim tropis, untuk iklim tropis. Kayu, roster, dan tekstur alami, diolah hingga sebuah ruang terasa tenang, efisien, dan benar-benar miliknya sendiri.',
  },
  manifestoNote: {
    en: 'Residential and commercial work across Indonesia, from first sketch to handover.',
    id: 'Proyek hunian dan komersial di seluruh Indonesia, dari sketsa pertama hingga serah terima.',
  },

  closing: {
    en: 'Turning vision into shape',
    id: 'Mengubah visi menjadi ruang',
  },
  closingBody: {
    en: 'Tell us about the site, the budget and the deadline. We will tell you honestly whether we are the right studio for it.',
    id: 'Ceritakan lokasi, anggaran, dan tenggat waktu Anda. Kami akan menjawab dengan jujur apakah kami studio yang tepat untuk proyek itu.',
  },
  closingAction: { en: 'Start a project', id: 'Mulai proyek' },
} as const;

/* ------------------------------------------------------------------ *
 * Disciplines — the homepage services list
 * ------------------------------------------------------------------ */

/** Each is illustrated by a real project frame, referenced by image id. */
export const disciplines: readonly (Passage & { readonly image: string })[] = [
  {
    id: 'architecture',
    heading: { en: 'Architecture', id: 'Arsitektur' },
    body: {
      en: 'Building form, structure and spatial planning, from massing through construction drawings.',
      id: 'Bentuk bangunan, struktur, dan perencanaan ruang, dari massa bangunan hingga gambar kerja konstruksi.',
    },
    image: 'mrs-d-house/mrs-d-house-01',
  },
  {
    id: 'interior-design',
    heading: { en: 'Interior Design', id: 'Desain Interior' },
    body: {
      en: 'Material, furniture and finishing decisions for how a space is used day to day.',
      id: 'Keputusan material, furnitur, dan finishing untuk bagaimana ruang digunakan sehari-hari.',
    },
    image: 'amadya/amadya-02',
  },
  {
    id: 'landscape',
    heading: { en: 'Landscape', id: 'Lanskap' },
    body: {
      en: 'Outdoor space, planting and circulation, planned alongside the building rather than after it.',
      id: 'Ruang luar, penanaman, dan sirkulasi, direncanakan bersamaan dengan bangunan, bukan setelahnya.',
    },
    image: 'mr-yp-house/mr-yp-house-03',
  },
  {
    id: '3d-visualization',
    heading: { en: '3D Visualization', id: 'Visualisasi 3D' },
    body: {
      en: 'Renders that show a design before it is built, used to test decisions and communicate with contractors.',
      id: 'Render yang menunjukkan desain sebelum dibangun, digunakan untuk menguji keputusan dan berkomunikasi dengan kontraktor.',
    },
    image: 'kintaro-cafe/kintaro-cafe-04',
  },
];

/* ------------------------------------------------------------------ *
 * Approach
 * ------------------------------------------------------------------ */

export const approach = {
  statement: {
    en: 'Today, Lark Studio works closely with clients to translate ideas into clear, thoughtful spaces. Through open communication, careful decision making, and an eye on both current trends and long term use, we guide each project from vision to reality.',
    id: 'Kini, Lark Studio bekerja sama erat dengan klien untuk menerjemahkan ide menjadi ruang yang jelas dan matang. Melalui komunikasi yang terbuka, pengambilan keputusan yang cermat, serta memperhatikan tren terkini dan penggunaan jangka panjang, kami memandu setiap proyek dari konsep hingga terwujud.',
  },

  stages: [
    {
      id: 'discovery',
      heading: { en: 'Discovery & Site Review', id: 'Peninjauan Lokasi & Kebutuhan' },
      body: {
        en: 'Understanding the site, user needs, and project goals.',
        id: 'Memahami lokasi, kebutuhan pengguna, dan tujuan proyek.',
      },
    },
    {
      id: 'concept',
      heading: { en: 'Concept Development', id: 'Pengembangan Konsep' },
      body: {
        en: 'Exploring spatial ideas, materials, and design direction.',
        id: 'Mengeksplorasi ide ruang, material, dan arah desain.',
      },
    },
    {
      id: 'visualization',
      heading: { en: 'Visualization', id: 'Visualisasi' },
      body: {
        en: 'Creating 3D images to help clients clearly understand the design.',
        id: 'Membuat gambar 3D agar klien dapat memahami desain dengan jelas.',
      },
    },
    {
      id: 'technical-drawings',
      heading: { en: 'Technical Drawings', id: 'Gambar Teknis' },
      body: {
        en: 'Preparing detailed drawings for construction.',
        id: 'Menyiapkan gambar kerja terperinci untuk konstruksi.',
      },
    },
    {
      id: 'construction-coordination',
      heading: { en: 'Construction Coordination', id: 'Koordinasi Konstruksi' },
      body: {
        en: 'Ensuring the design is executed properly during construction.',
        id: 'Memastikan desain dijalankan dengan tepat selama masa konstruksi.',
      },
    },
    {
      id: 'handover',
      heading: { en: 'Handover', id: 'Serah Terima' },
      body: {
        en: 'Final review and completion of the space.',
        id: 'Peninjauan akhir dan penyelesaian ruang.',
      },
    },
  ] satisfies readonly Passage[],
} as const;

/* ------------------------------------------------------------------ *
 * Studio
 * ------------------------------------------------------------------ */

export const studio = {
  statement: {
    en: 'Founded in 2025, Lark Studio began with a small group of young designers brought together by shared conversations about space, design, and how people actually live. We believed that great spaces shouldn’t just look good, but feel considered, personal, and built to last.',
    id: 'Didirikan pada tahun 2025, Lark Studio berawal dari sekelompok kecil desainer muda yang dipertemukan oleh percakapan bersama tentang ruang, desain, dan cara orang benar-benar menjalani kesehariannya. Kami percaya bahwa ruang yang baik tidak hanya harus terlihat indah, tetapi juga terasa dipikirkan dengan matang, personal, dan dibangun untuk bertahan lama.',
  },

  passages: [
    {
      id: 'function-before-form',
      heading: { en: 'Function Before Form', id: 'Fungsi Sebelum Bentuk' },
      body: {
        en: 'Spaces must work well in everyday life.',
        id: 'Ruang harus berfungsi baik dalam keseharian.',
      },
    },
    {
      id: 'thoughtful-decisions',
      heading: { en: 'Thoughtful Decisions', id: 'Keputusan yang Matang' },
      body: {
        en: 'Every design choice is carefully considered to avoid unnecessary costs or changes.',
        id: 'Setiap pilihan desain dipertimbangkan dengan cermat untuk menghindari biaya atau perubahan yang tidak perlu.',
      },
    },
    {
      id: 'clear-communication',
      heading: { en: 'Clear Communication', id: 'Komunikasi yang Jelas' },
      body: {
        en: 'We guide clients through each step of the process with clarity.',
        id: 'Kami memandu klien di setiap tahap proses dengan jelas.',
      },
    },
    {
      id: 'collaborative-process',
      heading: { en: 'Collaborative Process', id: 'Proses yang Kolaboratif' },
      body: {
        en: 'Great spaces are created through collaboration between designers and clients.',
        id: 'Ruang yang baik tercipta melalui kolaborasi antara desainer dan klien.',
      },
    },
  ] satisfies readonly Passage[],
} as const;

/* ------------------------------------------------------------------ *
 * Contact
 * ------------------------------------------------------------------ */

export const contact = {
  statement: {
    en: 'Contact us to schedule a consultation.',
    id: 'Hubungi kami untuk menjadwalkan konsultasi.',
  },
  prompts: {
    en: [
      'Project type and location',
      'Approximate size and timeline',
      'Any references or materials in mind',
    ],
    id: [
      'Jenis dan lokasi proyek',
      'Perkiraan luas dan waktu pengerjaan',
      'Referensi atau material yang diinginkan',
    ],
  },
} as const;
