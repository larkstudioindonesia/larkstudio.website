import type { Project, ProjectImage } from '@/content/types';

/**
 * THE WORK. Eight projects, in display order.
 *
 * Every frame in this file was reviewed individually — resolution,
 * real detail per pixel, subject position — and carries the result as
 * `weight` and `focal`. Alt text was rewritten from the photographs
 * rather than inherited; four entries had been describing a different
 * picture.
 *
 * FOUR MASTERS ARE DELIBERATELY UNPUBLISHED, out of the forty that exist:
 * `amadya-05`, `mrs-d-house-05` and `the-prasetyos-05` are macroblocked
 * phone snapshots — a bare room, a part-built kitchen, a ceiling — and
 * `ms-ra-house-03` is a clean render cropped through the middle of a
 * television. Every other master is here. (`atomic-cafe-02` was cut in an
 * earlier pass as a near-duplicate of the frame that opens the project;
 * it is not — it is the same counter seen whole, and it is back.)
 *
 * The order is editorial: `images[0]` opens the project and is always
 * the strongest frame, which was NOT true before — Ms. RA House used to
 * open on the weakest render in its own set.
 */
const REGISTRY: readonly Project[] = [
  {
    slug: 'waroeng-andalan',
    name: { en: 'Waroeng Andalan', id: 'Waroeng Andalan' },
    type: { en: 'Restaurant', id: 'Restoran' },
    location: { en: 'Tangerang', id: 'Tangerang' },
    year: 2025,
    area: 182,
    outcome: {
      en: 'The second branch of Waroeng Andalan builds upon the brand’s established identity while offering a significantly larger dining experience. Designed to enhance the everyday dining experience, the space blends warmth, nostalgia, and contemporary comfort, transforming a casual eatery into a memorable culinary destination.',
      id: 'Cabang kedua Waroeng Andalan melanjutkan identitas yang telah dibangun oleh brand ini, kini hadir dengan pengalaman bersantap yang jauh lebih luas. Dirancang untuk meningkatkan pengalaman makan sehari-hari, ruang ini memadukan kehangatan, nostalgia, dan kenyamanan kontemporer, mengubah sebuah warung makan sederhana menjadi destinasi kuliner yang berkesan.',
    },
    images: [
      {
        id: 'waroeng-andalan-01',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'Waroeng Andalan at street level: green and white signage above a full-height glazed frontage, with the dining room visible inside.',
          id: 'Waroeng Andalan dilihat dari jalan: signage hijau putih di atas fasad kaca setinggi penuh, dengan ruang makan terlihat di dalamnya.',
        },
      },
      {
        id: 'waroeng-andalan-04',
        weight: 'lead',
        focal: [50, 50],
        alt: {
          en: 'Order counter under a curved rattan canopy, with printed menu boards above and a patterned tile floor.',
          id: 'Meja pemesanan di bawah kanopi rotan melengkung, dengan papan menu di atasnya dan lantai keramik bermotif.',
        },
        caption: {
          en: 'Order counter, rattan canopy.',
          id: 'Meja pemesanan, kanopi rotan.',
        },
      },
      {
        id: 'waroeng-andalan-03',
        weight: 'wide',
        focal: [47, 55],
        alt: {
          en: 'Dining hall with green structural columns, a woven ceiling grid and bar seating along the window.',
          id: 'Ruang makan dengan kolom struktur hijau, plafon anyaman berpetak, dan kursi bar di sepanjang jendela.',
        },
      },
      {
        id: 'waroeng-andalan-02',
        weight: 'wide',
        focal: [53, 50],
        alt: {
          en: 'Bar counter along the window wall, with rattan-backed chairs and timber tables beyond.',
          id: 'Meja bar di sepanjang dinding jendela, dengan kursi sandaran rotan dan meja kayu di baliknya.',
        },
        caption: {
          en: 'Bar counter along the glazing.',
          id: 'Meja bar di sepanjang kaca.',
        },
      },
      {
        id: 'waroeng-andalan-05',
        weight: 'wide',
        focal: [45, 55],
        alt: {
          en: 'Long communal table with green banquette seating over a patterned green and white tile floor.',
          id: 'Meja komunal panjang dengan bangku hijau di atas lantai keramik bermotif hijau putih.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'amadya',
    name: { en: 'Amadya', id: 'Amadya' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Denpasar, Bali', id: 'Denpasar, Bali' },
    year: 2025,
    area: 156,
    outcome: {
      en: 'A 24 hour coffee shop set within a shophouse, designed to balance openness and refinement. Natural materials and unfinished wall textures create a warm, honest atmosphere that feels welcoming and comfortable for everyone, at any hour.',
      id: 'Kedai kopi yang buka 24 jam ini berada dalam sebuah ruko, dirancang untuk menyeimbangkan keterbukaan dan kesan yang lebih halus. Material alami dan tekstur dinding yang dibiarkan apa adanya menciptakan suasana hangat dan jujur yang terasa nyaman bagi siapa pun, kapan pun.',
    },
    images: [
      {
        id: 'amadya-01',
        weight: 'lead',
        focal: [50, 46],
        alt: {
          en: 'Amadya storefront: a dark corrugated canopy, hanging greenery along the fascia and an open terrace below.',
          id: 'Tampak muka Amadya: kanopi gelombang gelap, tanaman rambat di sepanjang fasia, dan teras terbuka di bawahnya.',
        },
      },
      {
        id: 'amadya-02',
        weight: 'wide',
        focal: [55, 48],
        alt: {
          en: 'Espresso bar in timber and stainless steel beneath the illuminated Amadya menu board.',
          id: 'Bar espreso berbahan kayu dan baja tahan karat di bawah papan menu Amadya yang menyala.',
        },
        caption: {
          en: 'Espresso bar, timber and steel.',
          id: 'Bar espreso, kayu dan baja.',
        },
      },
      {
        id: 'amadya-03',
        weight: 'wide',
        focal: [45, 52],
        alt: {
          en: 'Pastry counter with open timber shelving, ceramic ware and a round mirror on the concrete wall behind.',
          id: 'Meja pastry dengan rak kayu terbuka, keramik, dan cermin bundar di dinding beton di belakangnya.',
        },
      },
      {
        id: 'amadya-04',
        weight: 'detail',
        focal: [56, 53],
        alt: {
          en: 'Site documentation: the stairwell mid-construction, bare plaster awaiting finish.',
          id: 'Dokumentasi lapangan: tangga saat konstruksi, plester polos menunggu finishing.',
        },
        caption: {
          en: 'During construction.',
          id: 'Saat konstruksi.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'the-prasetyos',
    name: { en: 'The Prasetyo’s', id: 'The Prasetyo’s' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Wonosobo', id: 'Wonosobo' },
    year: 2025,
    area: 182,
    outcome: {
      en: 'An old house transformed into a communal café, breakfast spot, and mini museum for the local community to gather, share ideas, and showcase local products.',
      id: 'Sebuah rumah lama diubah menjadi kafe komunal, tempat sarapan, sekaligus museum mini bagi warga sekitar untuk berkumpul, bertukar ide, dan menampilkan produk lokal.',
    },
    images: [
      {
        id: 'the-prasetyos-03',
        weight: 'lead',
        focal: [50, 50],
        alt: {
          en: 'Interior under exposed timber roof beams, with framed pictures, a wall clock and a green painted dado.',
          id: 'Interior di bawah balok atap kayu ekspos, dengan foto berbingkai, jam dinding, dan dinding berlapis cat hijau setinggi pinggang.',
        },
      },
      {
        id: 'the-prasetyos-01',
        weight: 'lead',
        focal: [52, 52],
        alt: {
          en: 'Shopfront of the converted house, with a timber door and hand-painted signage above.',
          id: 'Tampak muka rumah yang dialihfungsikan, dengan pintu kayu dan signage bertuliskan tangan di atasnya.',
        },
        caption: {
          en: 'The house, from the street.',
          id: 'Rumah itu, dari jalan.',
        },
      },
      {
        id: 'the-prasetyos-02',
        weight: 'wide',
        focal: [50, 55],
        alt: {
          en: 'Communal room with white walls, timber shutters, a green painted dado and a woven pendant lamp.',
          id: 'Ruang komunal dengan dinding putih, jendela kayu, dinding hijau setinggi pinggang, dan lampu gantung anyaman.',
        },
      },
      {
        id: 'the-prasetyos-04',
        weight: 'detail',
        focal: [48, 50],
        alt: {
          en: 'Site documentation: the room as found, with teal armchairs, a vintage television and framed photographs.',
          id: 'Dokumentasi lapangan: ruang apa adanya, dengan kursi hijau toska, televisi tua, dan foto berbingkai.',
        },
        caption: {
          en: 'The room as found.',
          id: 'Ruang sebelum dikerjakan.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'kintaro-cafe',
    name: { en: 'Kintaro Cafe', id: 'Kintaro Cafe' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Jakarta', id: 'Jakarta' },
    year: 2025,
    area: 200,
    outcome: {
      en: 'This cafe project was designed as a vibrant gathering space in the heart of Jakarta, embracing an industrial aesthetic with a strong focus on sustainability. By maximizing the use of recycled materials and working within a limited budget, the design creates a distinctive and iconic destination with character, warmth, and lasting appeal.',
      id: 'Proyek kafe ini dirancang sebagai ruang berkumpul yang hidup di tengah kota Jakarta, mengusung estetika industrial dengan perhatian besar pada keberlanjutan. Dengan memaksimalkan penggunaan material daur ulang dan bekerja dalam anggaran terbatas, desain ini menciptakan destinasi yang khas dan mudah dikenali, penuh karakter, kehangatan, dan daya tarik yang bertahan lama.',
    },
    images: [
      {
        id: 'kintaro-cafe-01',
        weight: 'lead',
        focal: [50, 50],
        alt: {
          en: 'Service counter in stainless steel and glass block under the illuminated Kintaro sign.',
          id: 'Meja layanan berbahan baja tahan karat dan glass block di bawah signage Kintaro yang menyala.',
        },
      },
      {
        id: 'kintaro-cafe-03',
        weight: 'lead',
        focal: [48, 52],
        alt: {
          en: 'Glazed shopfront seen from the covered forecourt, pergola shadows falling across the wall.',
          id: 'Fasad kaca dilihat dari halaman beratap, bayangan pergola jatuh di sepanjang dinding.',
        },
        caption: {
          en: 'Forecourt, under the pergola.',
          id: 'Halaman muka, di bawah pergola.',
        },
      },
      {
        id: 'kintaro-cafe-02',
        weight: 'wide',
        focal: [50, 48],
        alt: {
          en: 'Dining area with steel-framed tables, black chairs and a planted concrete bench.',
          id: 'Area makan dengan meja berangka baja, kursi hitam, dan bangku beton bertanaman.',
        },
      },
      {
        id: 'kintaro-cafe-05',
        weight: 'wide',
        focal: [52, 48],
        alt: {
          en: 'Dining area against exposed brick, with a perforated metal screen and a timber servery.',
          id: 'Area makan dengan latar bata ekspos, sekat logam berlubang, dan meja saji kayu.',
        },
      },
      {
        id: 'kintaro-cafe-04',
        weight: 'wide',
        focal: [50, 55],
        alt: {
          en: 'Street elevation in board-marked concrete with a deep overhanging eave and a breeze-block screen.',
          id: 'Tampak jalan dengan beton ekspos bertekstur bekisting, atap menjorok dalam, dan sekat roster.',
        },
        caption: {
          en: 'Street elevation, deep eave.',
          id: 'Tampak jalan, atap menjorok.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'atomic-cafe',
    name: { en: 'Atomic Cafe', id: 'Atomic Cafe' },
    type: { en: 'Coffee Shop', id: 'Kedai Kopi' },
    location: { en: 'Bogor', id: 'Bogor' },
    year: 2025,
    area: 115.5,
    outcome: {
      en: 'Inspired by Mid-Century design with bold red accents, Atomic Cafe brings a vibrant and nostalgic atmosphere to the heart of Bogor. Designed as a social hub for young people, the cafe offers a warm, distinctive space that encourages gathering, conversation, and connection.',
      id: 'Terinspirasi desain Mid-Century dengan aksen merah yang berani, Atomic Cafe menghadirkan suasana yang hidup dan nostalgik di jantung kota Bogor. Dirancang sebagai ruang sosial bagi anak muda, kafe ini menawarkan ruang yang hangat dan khas, mengundang orang untuk berkumpul, mengobrol, dan terhubung satu sama lain.',
    },
    images: [
      {
        id: 'atomic-cafe-01',
        weight: 'lead',
        focal: [50, 50],
        alt: {
          en: 'Atomic Cafe counter against a deep red wall, with illuminated signage, a pastry case and merchandise on rails.',
          id: 'Meja Atomic Cafe dengan latar dinding merah tua, signage menyala, etalase pastry, dan merchandise yang digantung.',
        },
      },
      {
        id: 'atomic-cafe-05',
        weight: 'wide',
        focal: [53, 52],
        alt: {
          en: 'Dining area with banquette seating, wall sconces and timber chairs under a soft ceiling wash.',
          id: 'Area makan dengan bangku panjang, lampu dinding, dan kursi kayu di bawah cahaya plafon yang lembut.',
        },
      },
      {
        id: 'atomic-cafe-02',
        weight: 'wide',
        focal: [46, 52],
        alt: {
          en: 'The full counter run: espresso machine and grinders at one end, pastry case and menu board at the other, under a curved brass pendant.',
          id: 'Bentang meja selengkapnya: mesin espreso dan penggiling di satu ujung, etalase pastry dan papan menu di ujung lain, di bawah lampu gantung kuningan melengkung.',
        },
        caption: {
          en: 'The counter, end to end.',
          id: 'Meja, dari ujung ke ujung.',
        },
      },
      {
        id: 'atomic-cafe-03',
        weight: 'wide',
        focal: [50, 55],
        alt: {
          en: 'Seating nook with a round red table, wall sconces and a framed painting above a banquette.',
          id: 'Sudut duduk dengan meja bundar merah, lampu dinding, dan lukisan berbingkai di atas bangku panjang.',
        },
        caption: {
          en: 'Seating nook, red and timber.',
          id: 'Sudut duduk, merah dan kayu.',
        },
      },
      {
        id: 'atomic-cafe-04',
        weight: 'detail',
        focal: [48, 55],
        alt: {
          en: 'Stair detail finished in dark green tile with a timber handrail.',
          id: 'Detail tangga dengan finishing keramik hijau tua dan pegangan tangan kayu.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'mrs-d-house',
    name: { en: 'Mrs. D House', id: 'Rumah Mrs. D' },
    type: { en: 'House', id: 'Rumah' },
    location: { en: 'Bogor', id: 'Bogor' },
    year: 2025,
    area: 110,
    outcome: {
      en: 'This residential renovation project aims to enhance the quality of living through thoughtful spatial reconfiguration, functional optimization, and a comprehensive architectural and interior transformation. By redefining the existing layout and introducing a cohesive design language, the project creates a home that is more efficient, comfortable, and better aligned with the evolving needs and lifestyle of its occupants.',
      id: 'Proyek renovasi hunian ini bertujuan meningkatkan kualitas tinggal melalui penataan ulang ruang, optimalisasi fungsi, serta transformasi arsitektur dan interior secara menyeluruh. Dengan menata ulang denah yang ada dan menghadirkan bahasa desain yang menyatu, proyek ini menciptakan rumah yang lebih efisien, nyaman, dan selaras dengan kebutuhan serta gaya hidup penghuninya yang terus berkembang.',
    },
    images: [
      {
        id: 'mrs-d-house-01',
        weight: 'lead',
        focal: [50, 48],
        alt: {
          en: 'Street elevation with red brick arches, a first-floor balcony and planting along the parapet.',
          id: 'Tampak jalan dengan lengkungan bata merah, balkon lantai dua, dan tanaman di sepanjang parapet.',
        },
      },
      {
        id: 'mrs-d-house-02',
        weight: 'wide',
        focal: [52, 55],
        alt: {
          en: 'Kitchen in pale timber with a glazed sliding door opening onto a small patio.',
          id: 'Dapur berbahan kayu terang dengan pintu geser kaca yang membuka ke teras kecil.',
        },
        caption: {
          en: 'Kitchen, opening to the patio.',
          id: 'Dapur, membuka ke teras.',
        },
      },
      {
        id: 'mrs-d-house-03',
        weight: 'detail',
        focal: [50, 45],
        alt: {
          en: 'Stair with a slatted timber balustrade against a panelled wall.',
          id: 'Tangga dengan railing kayu berbilah di depan dinding berpanel.',
        },
      },
      {
        id: 'mrs-d-house-04',
        weight: 'detail',
        focal: [45, 50],
        alt: {
          en: 'Site documentation: the living room as found, before renovation.',
          id: 'Dokumentasi lapangan: ruang keluarga apa adanya, sebelum renovasi.',
        },
        caption: {
          en: 'Before renovation.',
          id: 'Sebelum renovasi.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'ms-ra-house',
    name: { en: 'Ms. RA House', id: 'Rumah Ms. RA' },
    type: { en: 'House', id: 'Rumah' },
    location: { en: 'Bogor', id: 'Bogor' },
    year: 2025,
    area: 40,
    outcome: {
      en: 'This renovation transforms a compact kitchen into a functional, storage-efficient space inspired by Japandi design. Warm materials, soft tones, and clean lines create an inviting kitchen and dining area, while the family room, living room, and multipurpose space are well integrated to provide a more open and welcoming environment for everyday living and entertaining.',
      id: 'Renovasi ini mengubah dapur yang sempit menjadi ruang yang fungsional dan efisien dalam penyimpanan, terinspirasi desain Japandi. Material hangat, warna-warna lembut, dan garis yang bersih menciptakan area dapur dan makan yang mengundang, sementara ruang keluarga, ruang tamu, dan ruang serbaguna terintegrasi dengan baik untuk menghadirkan suasana yang lebih terbuka dan ramah bagi keseharian maupun saat menerima tamu.',
    },
    images: [
      {
        id: 'ms-ra-house-02',
        weight: 'lead',
        focal: [48, 55],
        alt: {
          en: 'Kitchen tucked beneath the stair, with pale timber cabinetry, under-shelf lighting and a square-tiled splashback.',
          id: 'Dapur yang menyelip di bawah tangga, dengan kabinet kayu terang, lampu bawah rak, dan dinding keramik kotak.',
        },
      },
      {
        id: 'ms-ra-house-04',
        weight: 'wide',
        focal: [45, 55],
        alt: {
          en: 'Kitchen cabinetry with warm under-cabinet lighting and a mosaic-tiled splashback.',
          id: 'Kabinet dapur dengan lampu hangat di bawah kabinet dan dinding keramik mozaik.',
        },
        caption: {
          en: 'Cabinetry as built.',
          id: 'Kabinet terpasang.',
        },
      },
      {
        id: 'ms-ra-house-01',
        weight: 'wide',
        focal: [60, 45],
        alt: {
          en: 'Living room wall with a wall-mounted screen, rattan-fronted cabinets and open shelving.',
          id: 'Dinding ruang keluarga dengan televisi dinding, kabinet berpintu rotan, dan rak terbuka.',
        },
      },
      {
        id: 'ms-ra-house-05',
        weight: 'detail',
        focal: [52, 55],
        alt: {
          en: 'Site documentation: an overhead cabinet with a built-in plate rack.',
          id: 'Dokumentasi lapangan: kabinet atas dengan rak piring bawaan.',
        },
        caption: {
          en: 'Plate rack, as built.',
          id: 'Rak piring, terpasang.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'mr-yp-house',
    name: { en: 'Mr. YP House', id: 'Rumah Mr. YP' },
    type: { en: 'House', id: 'Rumah' },
    location: { en: 'Tangerang', id: 'Tangerang' },
    year: 2025,
    area: 205,
    outcome: {
      en: 'This interior visualization project explores a residential design approach centered on warmth, functionality, and the authentic expression of materials. Thoughtfully selected textures, natural finishes, and balanced spatial compositions create inviting living spaces that are both enduring and practical.',
      id: 'Proyek visualisasi interior ini mengeksplorasi pendekatan desain hunian yang berpusat pada kehangatan, fungsi, dan ekspresi material yang jujur. Tekstur yang dipilih dengan cermat, finishing alami, serta komposisi ruang yang seimbang menciptakan ruang tinggal yang mengundang, sekaligus tahan lama dan praktis.',
    },
    images: [
      {
        id: 'mr-yp-house-01',
        weight: 'lead',
        focal: [50, 55],
        alt: {
          en: 'Two-storey street elevation with a timber-clad upper volume, a car in the driveway and planting along the wall.',
          id: 'Tampak jalan dua lantai dengan massa atas berlapis kayu, mobil di carport, dan tanaman di sepanjang dinding.',
        },
      },
      {
        id: 'mr-yp-house-02',
        weight: 'lead',
        focal: [52, 52],
        alt: {
          en: 'Living room with a full-height timber bookshelf, low media console and a dining table in the foreground.',
          id: 'Ruang keluarga dengan rak buku kayu setinggi dinding, konsol media rendah, dan meja makan di latar depan.',
        },
        caption: {
          en: 'Living room, full-height shelving.',
          id: 'Ruang keluarga, rak setinggi dinding.',
        },
      },
      {
        id: 'mr-yp-house-03',
        weight: 'wide',
        focal: [54, 50],
        alt: {
          en: 'Upper terrace with a pergola walkway and climbing greenery spilling over the balustrade.',
          id: 'Teras atas dengan jalan setapak berpergola dan tanaman rambat yang menjuntai di atas railing.',
        },
      },
      {
        id: 'mr-yp-house-04',
        weight: 'wide',
        focal: [50, 58],
        alt: {
          en: 'Landing with a stainless balustrade, looking through to the garden beyond.',
          id: 'Bordes dengan railing baja, memandang tembus ke taman di baliknya.',
        },
      },
      {
        id: 'mr-yp-house-05',
        weight: 'detail',
        focal: [50, 50],
        alt: {
          en: 'Detail of vertical timber battens beside a window reveal.',
          id: 'Detail bilah kayu vertikal di samping bidang jendela.',
        },
        caption: {
          en: 'Timber battens, window reveal.',
          id: 'Bilah kayu, bidang jendela.',
        },
      },
    ],
    published: true,
  },
];

export const projects: readonly Project[] = REGISTRY.filter((p) => p.published);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Resolve an image id to the project that owns it. Lets the homepage
 * name its hero cast by frame rather than by position, so reordering the
 * registry cannot silently re-cast the hero.
 */
export function findImage(id: string): { project: Project; image: ProjectImage } | undefined {
  for (const project of projects) {
    const image = project.images.find((candidate) => candidate.id === id);
    if (image) return { project, image };
  }
  return undefined;
}

/** Wraps at the end of the list — every project page offers a next one. */
export function nextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  return index === -1 ? undefined : projects[(index + 1) % projects.length];
}
