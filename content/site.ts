import type { Localized, Passage, Photograph } from '@/content/types';

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
  enlarge: { en: 'Enlarge', id: 'Perbesar' },
  previous: { en: 'Previous photograph', id: 'Foto sebelumnya' },
  next: { en: 'Next photograph', id: 'Foto berikutnya' },

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
    en: 'LARK turns vision into shape through architecture, interiors, and creative design, translating ideas into spaces that are thoughtful, functional, and full of character. Every project begins with a vision and evolves through a process of exploration, collaboration, and making.',
    id: 'LARK mewujudkan visi menjadi bentuk melalui arsitektur, interior, dan desain kreatif, menerjemahkan gagasan menjadi ruang yang dirancang dengan cermat, fungsional, dan penuh karakter. Setiap proyek berawal dari sebuah visi, lalu berkembang melalui proses eksplorasi, kolaborasi, dan pengerjaan.',
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

/* ------------------------------------------------------------------ *
 * Home — In Practice
 * ------------------------------------------------------------------ */

/**
 * THE STUDIO AT WORK, from the photographs in `images-2/projects/kegiatan`.
 *
 * Audited September 2026. The set is fieldwork and process — existing
 * buildings as found, empty floors being walked, an opening measured, a
 * stair recorded, a model reviewed on site and at the table — so the
 * section is called what the pictures show: the practice, in practice.
 * Every caption describes only what is visible in its photograph; where
 * the context is not visible (whose project, what occasion), it is not
 * named.
 *
 * All eight photographs are used; none repeat. Three are WhatsApp copies
 * (1280–1600px, heavily compressed), so the slideshow never draws a
 * photograph wider than it has pixels. Dimensions are as DISPLAYED:
 * `20260616_102702.jpg` is stored landscape and turned upright by its
 * EXIF orientation.
 *
 * The running order is a rhythm, not the folder's: a building as found,
 * a floor walked, an opening measured, a stair recorded, an interior
 * stripped back, a model reviewed on site, a garden read, and back at the
 * table.
 */
const kegiatan = (file: string, width: number, height: number, caption: Localized<string>): Photograph => ({
  src: encodeURI(`/images-2/projects/kegiatan/${file}`),
  width,
  height,
  alt: caption,
  credit: caption,
});

export const practice = {
  title: { en: 'In Practice', id: 'Dalam Praktik' },
  intro: {
    en: 'Before a drawing becomes a room: site visits, measurements, and working sessions around the model.',
    id: 'Sebelum gambar menjadi ruang: kunjungan lapangan, pengukuran, dan sesi kerja di depan model.',
  },
  photographs: [
    kegiatan('IMG_2018.jpg', 4032, 3024, {
      en: 'An existing house, photographed as it stands.',
      id: 'Sebuah rumah, didokumentasikan apa adanya.',
    }),
    kegiatan('WhatsApp Image 2026-09-22 at 3.51.24 PM.jpeg', 1280, 960, {
      en: 'Walking an empty floor, column by column.',
      id: 'Menyusuri lantai kosong, dari kolom ke kolom.',
    }),
    kegiatan('WhatsApp Image 2026-08-04 at 11.24.14 AM.jpeg', 1600, 1200, {
      en: 'Measuring an existing opening, by hand.',
      id: 'Mengukur bukaan yang ada, secara manual.',
    }),
    kegiatan('WhatsApp Image 2026-09-22 at 3.51.25 PM.jpeg', 900, 1600, {
      en: 'Recording the stair, step by step.',
      id: 'Merekam kondisi tangga, anak tangga demi anak tangga.',
    }),
    kegiatan('20251220_131643.jpg.jpeg', 4000, 3000, {
      en: 'An interior mid-renovation, walls patched and stripped back.',
      id: 'Interior di tengah renovasi, dinding ditambal dan dikupas.',
    }),
    kegiatan('20251110_201051.jpg', 4000, 2252, {
      en: 'Reviewing drawings on site, the model open on a laptop.',
      id: 'Meninjau gambar di lokasi, model terbuka di laptop.',
    }),
    kegiatan('20260616_102702.jpg', 3000, 4000, {
      en: 'Out in the garden, reading the site.',
      id: 'Di halaman, membaca kondisi tapak.',
    }),
    kegiatan('WhatsApp Image 2026-09-22 at 3.51.23 PM.jpeg', 1280, 960, {
      en: 'Back at the table, working through the model on screen.',
      id: 'Kembali ke meja, membahas model di layar.',
    }),
  ],
  previous: { en: 'Previous photograph', id: 'Foto sebelumnya' },
  next: { en: 'Next photograph', id: 'Foto berikutnya' },
} as const;

/* ------------------------------------------------------------------ *
 * New Directions — Larkscapes.id and Larkworks.id
 * ------------------------------------------------------------------ */

/**
 * THE STUDIO'S NEXT CHAPTER, and the ONE source for it: the announcement
 * dialog (shown once a session after the overture, reopened from the
 * header's "New" entry) and the homepage's New Directions section both
 * read from here.
 *
 * What is ESTABLISHED, and therefore said: the studio is opening its
 * landscape work (Larkscapes.id) and its workshop's craft furniture
 * (Larkworks.id) to more projects, and existing work for both is in
 * `images-2/projects/larkscapesid` and `/larkworksid`. Everything else in
 * the copy is what those photographs show — audited September 2026:
 *
 *   larkscapesid  23 landscape design renders, 2000×1125, across four
 *                 named projects: pools set into planted courtyards,
 *                 stepping stones through lawn and tropical planting,
 *                 hanging and vertical greenery, a treed office court.
 *   larkworksid   7 phone photographs, 1200×1600 portrait, of two built
 *                 joinery installations: a light timber-grain kitchen
 *                 fitted beneath a staircase, and a dark timber-grain
 *                 cabinetry wall with lit open shelving and a coffee
 *                 counter.
 *
 * No URL exists for either yet, so nothing links to one: the way in is
 * the studio's own contact page.
 */
const folderPhoto = (
  path: string,
  width: number,
  height: number,
  alt: Localized<string>,
  credit: Localized<string>,
): Photograph => ({ src: encodeURI(`/images-2/projects/${path}`), width, height, alt, credit });

const scape = (project: string, place: string, file: string, view: number, of: number): Photograph =>
  folderPhoto(
    `larkscapesid/${project}/${file}`,
    2000,
    1125,
    {
      en: `${place} — landscape design, view ${String(view)} of ${String(of)}`,
      id: `${place} — desain lanskap, tampak ${String(view)} dari ${String(of)}`,
    },
    { en: `Larkscapes.id — ${place}`, id: `Larkscapes.id — ${place}` },
  );

/** Every Larkscapes render, by project — the full library the lightbox
 *  opens on. */
export const larkscapesLibrary: readonly Photograph[] = [
  ...['22', '23', '24', '25', '26', '27', '28', '29'].map((n, i) =>
    scape('Sanza Villa - Bali', 'Sanza Villa, Bali', `${n}.png`, i + 1, 8),
  ),
  ...['30', '31', '32', '33', '34', '35'].map((n, i) =>
    scape('LM Villa - Bali', 'LM Villa, Bali', `${n}.png`, i + 1, 6),
  ),
  ...['17', '18', '19', '20', '21'].map((n, i) =>
    scape('TH Villa - Bali', 'TH Villa, Bali', `${n}.png`, i + 1, 5),
  ),
  ...['13', '14', '15', '16'].map((n, i) =>
    scape('SYL Office - Yogyakarta', 'SYL Office, Yogyakarta', `${n}.png`, i + 1, 4),
  ),
];

/** One Larkscapes render by its file, e.g. `TH Villa - Bali/17.png`. */
export function larkscape(path: string): Photograph {
  const found = larkscapesLibrary.find((photo) => photo.src === encodeURI(`/images-2/projects/larkscapesid/${path}`));
  if (!found) throw new Error(`Unknown Larkscapes render ${path}`);
  return found;
}

const WORKS = { en: 'Larkworks.id', id: 'Larkworks.id' };
const works = (file: string, width: number, en: string, id: string): Photograph =>
  folderPhoto(`larkworksid/WhatsApp Image 2026-09-23 at ${file}.jpeg`, width, width === 1079 ? 1440 : 1600, { en, id }, WORKS);

/* The Larkworks photographs, named, in reading order: the dark cabinetry
   wall, then the kitchen beneath the stair. */
const worksWall = works('6.41.10 PM (1)', 1200, 'Dark timber-grain cabinetry with warm-lit open shelving and a stone-look counter.', 'Kabinet berserat kayu gelap dengan rak terbuka berlampu hangat dan meja bermotif batu.');
const worksShelves = works('6.41.10 PM (2)', 1200, 'Open shelves lit from within, set between dark cabinet fronts.', 'Rak terbuka yang diterangi dari dalam, diapit muka kabinet gelap.');
const worksCoffee = works('6.41.10 PM', 1200, 'A coffee station on a stone-look counter, beneath the lit shelving.', 'Sudut kopi di atas meja bermotif batu, di bawah rak berlampu.');
const worksStair = works('6.41.08 PM', 1079, 'A light timber-grain kitchen fitted beneath a staircase, with lit open niches.', 'Kitchen set berserat kayu terang yang dipasang di bawah tangga, dengan ceruk terbuka berlampu.');
const worksCorner = works('6.41.09 PM (1)', 1200, 'The kitchen corner: stepped wall cabinets with integrated lighting over a tiled splashback.', 'Sudut dapur: kabinet atas bertingkat dengan lampu terintegrasi di atas backsplash keramik.');
const worksTall = works('6.41.09 PM (2)', 1200, 'Tall units housing the refrigerator and microwave beside the lit wall cabinets.', 'Lemari tinggi untuk kulkas dan microwave di samping kabinet atas berlampu.');
const worksRack = works('6.41.09 PM', 1200, 'A wall cabinet opened on its fitted dish rack.', 'Kabinet atas yang terbuka, memperlihatkan rak piring terpasang.');

/** Every Larkworks photograph — the full library the lightbox opens on. */
export const larkworksLibrary: readonly Photograph[] = [
  worksWall,
  worksShelves,
  worksCoffee,
  worksStair,
  worksCorner,
  worksTall,
  worksRack,
];

export const directions = {
  title: { en: 'New Directions', id: 'Arah Baru' },
  /** The announcement's kicker — the one line that says this is news. */
  kicker: { en: 'A new chapter', id: 'Babak baru' },
  story: {
    en: 'After a first year spent building the studio through architecture and interiors, we are opening two adjacent fields of our practice to more work.',
    id: 'Setelah tahun pertama membangun studio melalui arsitektur dan interior, kami membuka dua bidang yang bersisian dengan praktik kami untuk lebih banyak proyek.',
  },
  /** The header entry that reopens the announcement. */
  entry: { en: 'New', id: 'Baru' },
  entryLabel: {
    en: 'New directions — open the studio announcement',
    id: 'Arah baru — buka pengumuman studio',
  },
  close: { en: 'Close announcement', id: 'Tutup pengumuman' },
  previous: { en: 'Previous', id: 'Sebelumnya' },
  next: { en: 'Next', id: 'Berikutnya' },
  more: { en: 'More on the homepage', id: 'Selengkapnya di beranda' },
  viewAll: { en: 'View all photographs', id: 'Lihat semua foto' },
  initiatives: [
    {
      key: 'larkscapes',
      name: 'Larkscapes.id',
      field: { en: 'Landscape', id: 'Lanskap' },
      body: {
        en: 'Pools set into planted courtyards, stepping stones through tropical gardens, water, shade and green brought close to the house. The landscape work the studio has already been designing is now open to more projects.',
        id: 'Kolam di tengah halaman yang rimbun, batu pijakan menembus taman tropis, air, keteduhan, dan hijau yang dihadirkan dekat dengan rumah. Karya lanskap yang telah dirancang studio kini terbuka untuk lebih banyak proyek.',
      },
      action: { en: 'Discuss a landscape project', id: 'Diskusikan proyek lanskap' },
      library: larkscapesLibrary,
      /** Two for the announcement, four for the homepage — the rest is
       *  the lightbox's. */
      announce: [larkscape('Sanza Villa - Bali/24.png'), larkscape('TH Villa - Bali/17.png')],
      feature: [
        larkscape('Sanza Villa - Bali/24.png'),
        larkscape('TH Villa - Bali/17.png'),
        larkscape('LM Villa - Bali/30.png'),
        larkscape('SYL Office - Yogyakarta/13.png'),
      ],
    },
    {
      key: 'larkworks',
      name: 'Larkworks.id',
      field: { en: 'Craft furniture', id: 'Furnitur kriya' },
      body: {
        en: 'Kitchens and cabinetry built to the room: timber-grain fronts, lit open shelving, joinery shaped around a staircase. Made in the studio’s own workshop, which is now open to more furniture projects.',
        id: 'Kitchen set dan kabinet yang dibuat mengikuti ruangnya: muka berserat kayu, rak terbuka berlampu, hingga joinery yang dibentuk mengikuti tangga. Dikerjakan di workshop studio sendiri, yang kini terbuka untuk lebih banyak proyek furnitur.',
      },
      action: { en: 'Discuss a furniture project', id: 'Diskusikan proyek furnitur' },
      library: larkworksLibrary,
      announce: [worksWall, worksStair],
      feature: [worksWall, worksStair, worksCoffee],
    },
  ],
} as const;
