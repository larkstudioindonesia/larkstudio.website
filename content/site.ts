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
  /**
   * THE CANONICAL ORIGIN, and it is load-bearing far beyond a link tag.
   *
   * This was `larkstudio.co.id`, which HAS NO DNS RECORD AT ALL. The site
   * is served from `larkstudio.id`. Every page therefore told crawlers
   * that its canonical version lived on a host that does not resolve —
   * 16 references per page, covering `rel=canonical`, all three hreflang
   * alternates, `og:url`, `og:image` and the sitemap line in robots.txt.
   *
   * That is the actual reason Google was showing a generic globe. A
   * favicon is associated with the INDEXED CANONICAL HOST, and Google
   * cannot fetch an icon from a domain that does not exist. The icon
   * files themselves were already correct and served cleanly; nothing
   * about them was ever going to fix it.
   *
   * `www.larkstudio.id` already 307s here, so this is the one origin.
   */
  origin: 'https://larkstudio.id',
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
    en: ['Turning Vision', 'into shape'],
    id: ['Mengubah Visi', 'menjadi ruang'],
  } as Localized<readonly [string, string]>,

  heroSubhead: {
    en: 'Architecture, interior and landscape design across Indonesia.',
    id: 'Desain arsitektur, interior, dan lanskap di seluruh Indonesia.',
  },
  /**
   * THE HERO PLATE — ITS OWN MASTER, NOT A PROJECT FRAME.
   *
   * `home-hero.jpg` is a dedicated 4000x2535 export, wider than the 3:2
   * the gallery ships and with more room around the subject, and it is
   * the largest single asset on the site. It does not go through `crop()`
   * because it has no 4:5 sibling — see the note in `Hero` on how the
   * phone layout answers that without a centre-crop.
   *
   * WHAT IT IS OF, because the whole hero composition is built on it:
   * an upper landing, shot square down its axis. The subject sits in a
   * band from roughly 33% to 78% of the width — sliding door, garden
   * beyond, the sewing desk, the wardrobe joinery — and everything left
   * of 30% is an unbroken pale wall. That wall is where the type goes.
   *
   * `bed` names the project this frame belongs to. It is a credit and a
   * link, not a source: the plate is the same room as `mr-yp-house-02`.
   * An earlier pass simply took the first project's lead frame and put
   * "Tropical architecture" directly across a two-metre banner reading
   * MAKAN ENAK CUMA 18RB-AN.
   */
  stage: {
    image: '/images-2/home-hero.jpg',
    /* Held slightly right of centre and low: on a viewport wider than
       the plate the crop is taken off the ceiling, which is a flat
       plane, rather than off the floor, which carries the reflections. */
    focal: [52, 56] as readonly [number, number],
    bed: 'mr-yp-house-02',
  },

  heroMeta: {
    en: ['Bogor, Indonesia', 'Est. 2025', 'Available for 2026'],
    id: ['Bogor, Indonesia', 'Sejak 2025', 'Tersedia untuk 2026'],
  },

  /* The manifesto. Read one word at a time as the reader scrolls, so
     it is written in short clauses that survive being lit up piecemeal. */
  manifesto: {
    en: 'Lark Studio focuses on functional tropical architecture and warm material driven interiors, combining wood, breeze block, and natural textures to create spaces that feel calm, efficient, and enduring.',
    id: 'Lark Studio berfokus pada arsitektur tropis yang fungsional dan desain interior yang mengedepankan material-material hangat, dengan memadukan kayu, breeze block, dan tekstur alami untuk menciptakan ruang yang terasa tenang, efisien, dan tahan lama.',
  },
  manifestoNote: {
    en: 'Our work focuses on residential and commercial projects, helping clients transform ideas into spaces that feel intentional and practical.',
    id: 'Pekerjaan kami berfokus pada proyek residensial dan komersial, membantu klien mewujudkan ide menjadi ruang yang dirancang secara matang, fungsional, dan praktis.',
  },

  closing: {
    en: 'Turning vision into shape',
    id: 'Mengubah visi menjadi ruang',
  },
  closingBody: {
    en: 'We would love to discuss your project and explore how thoughtful design can bring your ideas to life.',
    id: 'Kami akan dengan senang hati mendiskusikan proyek Anda dan mengeksplorasi bagaimana desain yang matang dapat mewujudkan ide-ide Anda.',
  },
  closingAction: { en: 'Start a project', id: 'Mulai proyek' },
} as const;

/* ------------------------------------------------------------------ *
 * Disciplines — the homepage services list
 * ------------------------------------------------------------------ */

/**
 * Each is illustrated by a real project frame.
 *
 * SLUG AND IMAGE ID ARE SEPARATE FIELDS, not one `slug/id` string. The
 * joined form forced the preview card to assemble its own path from a
 * literal, which made it the only photograph on the site that did not
 * resolve through `crop()` — and therefore the only one left pointing at
 * `/images` after the masters moved.
 *
 * All four were re-picked against `images-2`. The frames are re-renders,
 * not re-exports, and three of these ids are now a different photograph:
 * `mrs-d-house-01` was the street elevation and is now a dining room, so
 * architecture would have been illustrated by an interior.
 */
export const disciplines: readonly (Passage & {
  readonly slug: string;
  readonly image: string;
})[] = [
  {
    id: 'architecture',
    heading: { en: 'Architecture', id: 'Arsitektur' },
    body: {
      en: 'Building form, structure and spatial planning, from massing through construction drawings.',
      id: 'Bentuk bangunan, struktur, dan perencanaan ruang, dari massa bangunan hingga gambar kerja konstruksi.',
    },
    slug: 'mr-yp-house',
    image: 'mr-yp-house-03',
  },
  {
    id: 'interior-design',
    heading: { en: 'Interior Design', id: 'Desain Interior' },
    body: {
      en: 'Material, furniture and finishing decisions for how a space is used day to day.',
      id: 'Keputusan material, furnitur, dan finishing untuk bagaimana ruang digunakan sehari-hari.',
    },
    slug: 'amadya',
    image: 'amadya-02',
  },
  {
    id: 'landscape',
    heading: { en: 'Landscape', id: 'Lanskap' },
    body: {
      en: 'Outdoor space, planting and circulation, planned alongside the building rather than after it.',
      id: 'Ruang luar, penanaman, dan sirkulasi, direncanakan bersamaan dengan bangunan, bukan setelahnya.',
    },
    slug: 'kintaro-cafe',
    image: 'kintaro-cafe-02',
  },
  {
    id: '3d-visualization',
    heading: { en: '3D Visualization', id: 'Visualisasi 3D' },
    body: {
      en: 'Renders that show a design before it is built, used to test decisions and communicate with contractors.',
      id: 'Render yang menunjukkan desain sebelum dibangun, digunakan untuk menguji keputusan dan berkomunikasi dengan kontraktor.',
    },
    slug: 'mrs-d-house',
    image: 'mrs-d-house-02',
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
