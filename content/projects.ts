import { photograph, type Photograph, type Project, type ProjectImage } from '@/content/types';
import { larkscape } from '@/content/site';

/**
 * THE WORK. Eleven projects, in display order — array order IS the
 * running order everywhere (portfolio, next-project, sitemap).
 *
 * REBUILT AGAINST `images-2`, AND THIS WAS NOT A RE-EXPORT.
 *
 * The ids and the folder structure are identical, so the migration
 * itself was one line in `crop()`. The photographs are not. Most of the
 * forty masters are a NEW RENDER of their subject — a different camera,
 * a different time of day, sometimes a different room — and roughly half
 * of the alt text in the previous revision would have gone on describing
 * a picture that is no longer there. `amadya-02` was an espresso bar and
 * is now a pastry counter. `waroeng-andalan-01` was a shopfront and is
 * now the order counter. `mrs-d-house-01` and `mr-yp-house-01` were
 * street elevations and are both interiors; the elevations moved to
 * `-02` and `-03` respectively. `ms-ra-house-02` was a kitchen and is
 * now a sitting room, and the kitchen is at `-03`.
 *
 * So every frame here was opened and looked at, and `alt`, `caption`,
 * `focal`, `weight` and the running order were all re-derived from what
 * is actually in the file. Where the old copy still fits the new picture
 * it is kept verbatim — that is the minority.
 *
 * ALL FORTY MASTERS ARE NOW PUBLISHED. The four that were held back —
 * `amadya-05`, `mrs-d-house-05`, `the-prasetyos-05`, `ms-ra-house-03` —
 * were held back because they were macroblocked phone snapshots or, in
 * Ms. RA's case, a render cropped through the middle of a television.
 * All four have been re-shot at the same standard as the rest of the
 * set, and there is no longer a reason to hide them.
 *
 * The order is editorial: `images[0]` opens the project and is always
 * the strongest frame.
 */
const REGISTRY: readonly Project[] = [
  {
    slug: 'waroeng-andalan',
    name: { en: 'Waroeng Andalan', id: 'Waroeng Andalan' },
    type: { en: 'Restaurant', id: 'Restoran' },
    location: { en: 'Gading Serpong', id: 'Gading Serpong' },
    year: 2026,
    area: 182,
    outcome: {
      en: 'The second branch of Waroeng Andalan builds upon the brand’s established identity while offering a significantly larger dining experience. Designed to enhance the everyday dining experience, the space blends warmth, nostalgia, and contemporary comfort, transforming a casual eatery into a memorable culinary destination.',
      id: 'Cabang kedua Waroeng Andalan melanjutkan identitas yang telah dibangun oleh brand ini, kini hadir dengan pengalaman bersantap yang jauh lebih luas. Dirancang untuk meningkatkan pengalaman makan sehari-hari, ruang ini memadukan kehangatan, nostalgia, dan kenyamanan kontemporer, mengubah sebuah warung makan sederhana menjadi destinasi kuliner yang berkesan.',
    },
    /*
     * THE SIGNATURE OUTLET, GADING SERPONG. Re-shot as a new set in
     * September 2026 — the heritage shophouse fit-out: green tile, rattan,
     * terracotta and brick, with "Waroeng Andalan Signature" on the
     * facade. The five earlier renders (`waroeng-andalan-01…05`, a
     * different, modern rattan-clad counter) show another fit-out and are
     * no longer referenced; their files remain in the folder.
     *
     * Eight of the twelve new images, in reading order: the hall, the
     * building, the way in, the rooms, then the counter and the children's
     * corner as a pair. Four were left out as near-repeats of the dining
     * views kept (04_26_23, 04_28_15, 04_29_32, 04_30_53).
     *
     * Supplied as ~1300–1650px files at their own ratios, so no frame here
     * is allowed a placement above `wide` beyond the opening print.
     */
    images: [
      {
        id: 'waroeng-andalan-s01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_19_38 PM.png', width: 1641, height: 923 },
        alt: {
          en: 'Dining hall with rattan chairs, a green-tiled dado and patterned floor, timber screens and shutters along the back wall.',
          id: 'Ruang makan dengan kursi rotan, lambris keramik hijau dan lantai bermotif, serta sekat kayu dan jendela krepyak di dinding belakang.',
        },
      },
      {
        id: 'waroeng-andalan-s02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'WhatsApp_Image_2026-08-26_at_5.02.40_PM-removebg-preview.png', width: 1170, height: 936 },
        alt: {
          en: 'Shophouse facade with green shutters, a terracotta tile canopy over the shopfront and the Waroeng Andalan Signature sign.',
          id: 'Fasad ruko dengan jendela krepyak hijau, kanopi genteng terakota di atas etalase, dan papan nama Waroeng Andalan Signature.',
        },
      },
      {
        id: 'waroeng-andalan-s03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_19_11 PM.png', width: 1392, height: 928 },
        alt: {
          en: 'Shopfront entrance: timber double doors and a bay window framed in green tile and patterned panels.',
          id: 'Pintu masuk etalase: pintu ganda kayu dan jendela menjorok berbingkai keramik hijau serta panel bermotif.',
        },
      },
      {
        id: 'waroeng-andalan-s04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_25_17 PM.png', width: 1466, height: 977 },
        alt: {
          en: 'Dining room looking toward the street windows, with booth seating, rattan chairs and timber screens.',
          id: 'Ruang makan menghadap jendela ke jalan, dengan kursi booth, kursi rotan, dan sekat kayu.',
        },
      },
      {
        id: 'waroeng-andalan-s05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_30_38 PM.png', width: 1388, height: 925 },
        alt: {
          en: 'Dining area against an exposed-brick wall beneath a terracotta tile canopy, with pendant and wall lights.',
          id: 'Area makan berlatar dinding bata ekspos di bawah kanopi genteng terakota, dengan lampu gantung dan lampu dinding.',
        },
      },
      {
        id: 'waroeng-andalan-s06',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_23_50 PM.png', width: 1386, height: 924 },
        alt: {
          en: 'Service counter and a row of tables beneath a timber-framed ceiling, framed food prints on the wall.',
          id: 'Meja layanan dan deretan meja di bawah plafon berbingkai kayu, dengan cetakan foto makanan berbingkai di dinding.',
        },
      },
      {
        id: 'waroeng-andalan-s07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_19_22 PM.png', width: 1298, height: 865 },
        alt: {
          en: 'Timber counter against green wall tiles, with rattan pendants, wall lamps and a timber lattice partition.',
          id: 'Meja kayu berlatar keramik dinding hijau, dengan lampu gantung rotan, lampu dinding, dan sekat kisi kayu.',
        },
      },
      {
        id: 'waroeng-andalan-s08',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_26_30 PM.png', width: 1518, height: 1012 },
        alt: {
          en: 'Children’s play corner with small tables, a rocking horse and colourful shapes on the wall.',
          id: 'Sudut bermain anak dengan meja kecil, kuda goyang, dan bentuk-bentuk berwarna di dinding.',
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
        focal: [45, 52],
        alt: {
          en: 'Pastry counter with open timber shelving, ceramic ware and a round mirror on the concrete wall behind.',
          id: 'Meja pastry dengan rak kayu terbuka, keramik, dan cermin bundar di dinding beton di belakangnya.',
        },
        caption: {
          en: 'Pastry counter, concrete and timber.',
          id: 'Meja pastry, beton dan kayu.',
        },
      },
      {
        id: 'amadya-04',
        weight: 'wide',
        focal: [52, 52],
        alt: {
          en: 'Dining area behind sliding timber screens, with a paper lantern pendant and a perforated block wall.',
          id: 'Area makan di balik sekat kayu geser, dengan lampu gantung kertas dan dinding roster.',
        },
      },
      {
        id: 'amadya-03',
        weight: 'wide',
        focal: [48, 55],
        alt: {
          en: 'Banquette seating along a sage green wall, with timber chairs and brass pendants above.',
          id: 'Bangku panjang di sepanjang dinding hijau sage, dengan kursi kayu dan lampu gantung kuningan di atasnya.',
        },
        caption: {
          en: 'Banquette, sage and brass.',
          id: 'Bangku panjang, sage dan kuningan.',
        },
      },
      /*
       * Published for the first time. The old `amadya-05` was a
       * macroblocked phone snapshot of a bare room; this is a clean,
       * evenly lit frame of the same shell, and it is the only
       * before-state Amadya has left — the previous set carried a
       * mid-construction stairwell at `-04`, and `-04` is now a finished
       * dining area.
       */
      {
        id: 'amadya-05',
        weight: 'detail',
        focal: [50, 52],
        alt: {
          en: 'Site documentation: the bare shell before fit-out, patched plaster around a new stair.',
          id: 'Dokumentasi lapangan: ruang kosong sebelum pengerjaan, plester bertambal di sekitar tangga baru.',
        },
        caption: {
          en: 'The shell, before fit-out.',
          id: 'Ruang kosong, sebelum pengerjaan.',
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
    /*
     * Every frame in this set is now a finished interior. The old set
     * led on a shopfront and closed on an as-found documentary frame,
     * and `images-2` has neither — so the before/after reading is gone
     * and the captions that carried it have gone with it. What is left
     * is one room, shot five ways, which suits a project whose whole
     * subject is a single converted house.
     */
    images: [
      {
        id: 'the-prasetyos-01',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'Service counter in stainless steel and slatted timber, under exposed roof beams and black pendant lamps.',
          id: 'Meja layanan berbahan baja tahan karat dan bilah kayu, di bawah balok atap ekspos dan lampu gantung hitam.',
        },
      },
      {
        id: 'the-prasetyos-02',
        weight: 'lead',
        focal: [48, 52],
        alt: {
          en: 'The counter seen along its length, with a chalkboard menu, a pastry case and a banquette beyond.',
          id: 'Meja layanan dilihat memanjang, dengan papan menu kapur, etalase pastry, dan bangku panjang di baliknya.',
        },
        caption: {
          en: 'The counter, end to end.',
          id: 'Meja layanan, dari ujung ke ujung.',
        },
      },
      {
        id: 'the-prasetyos-03',
        weight: 'wide',
        focal: [52, 55],
        alt: {
          en: 'Timber armchairs at a marble table, against a green painted dado and a shuttered window onto the garden.',
          id: 'Kursi berlengan kayu di meja marmer, dengan latar dinding hijau setinggi pinggang dan jendela krepyak ke taman.',
        },
      },
      {
        id: 'the-prasetyos-05',
        weight: 'wide',
        focal: [45, 55],
        alt: {
          en: 'The room seen whole under exposed timber roof beams, tables to one side and the counter to the other.',
          id: 'Ruang dilihat menyeluruh di bawah balok atap kayu ekspos, meja di satu sisi dan meja layanan di sisi lain.',
        },
        caption: {
          en: 'Under the roof beams.',
          id: 'Di bawah balok atap.',
        },
      },
      {
        id: 'the-prasetyos-04',
        weight: 'wide',
        focal: [48, 52],
        alt: {
          en: 'Steel-framed tables and a rattan armchair against a green dado, with a framed vintage matchbox print above.',
          id: 'Meja berangka baja dan kursi rotan dengan latar dinding hijau, serta cetakan korek api antik berbingkai di atasnya.',
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
          en: 'Service counter in stainless steel and white tile under the illuminated Kintaro sign.',
          id: 'Meja layanan berbahan baja tahan karat dan keramik putih di bawah signage Kintaro yang menyala.',
        },
      },
      {
        id: 'kintaro-cafe-05',
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
        id: 'kintaro-cafe-03',
        weight: 'wide',
        focal: [52, 50],
        alt: {
          en: 'Dining area against an oriented-strand board wall hung with merchandise and shelving, under black track lighting.',
          id: 'Area makan dengan dinding OSB berisi merchandise dan rak, di bawah lampu rel hitam.',
        },
      },
      {
        id: 'kintaro-cafe-04',
        weight: 'wide',
        focal: [45, 52],
        alt: {
          en: 'Long communal timber table under exposed services, against precast concrete panels.',
          id: 'Meja komunal kayu panjang di bawah utilitas ekspos, dengan latar panel beton pracetak.',
        },
        caption: {
          en: 'The communal table.',
          id: 'Meja komunal.',
        },
      },
      {
        id: 'kintaro-cafe-02',
        weight: 'wide',
        focal: [50, 52],
        alt: {
          en: 'Street elevation under a deep hipped roof, with a timber-framed picture window and a red brick screen.',
          id: 'Tampak jalan di bawah atap limas yang dalam, dengan jendela berbingkai kayu dan sekat bata merah.',
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
        id: 'atomic-cafe-02',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'The room down its length: a black banquette under a long mirror on one side, the counter at the far end.',
          id: 'Ruang dilihat memanjang: bangku hitam di bawah cermin panjang di satu sisi, meja layanan di ujung ruang.',
        },
        caption: {
          en: 'The room, end to end.',
          id: 'Ruang, dari ujung ke ujung.',
        },
      },
      {
        id: 'atomic-cafe-05',
        weight: 'wide',
        focal: [46, 50],
        alt: {
          en: 'The counter seen at an angle, brass rail and signage above, black tiled plinth below.',
          id: 'Meja layanan dilihat menyudut, rel kuningan dan signage di atasnya, plint keramik hitam di bawahnya.',
        },
      },
      {
        id: 'atomic-cafe-03',
        weight: 'wide',
        focal: [52, 50],
        alt: {
          en: 'Seating nook with round red tables, two wall lights and a framed painting on a timber panel.',
          id: 'Sudut duduk dengan meja bundar merah, dua lampu dinding, dan lukisan berbingkai di panel kayu.',
        },
        caption: {
          en: 'Seating nook, red and timber.',
          id: 'Sudut duduk, merah dan kayu.',
        },
      },
      {
        id: 'atomic-cafe-04',
        weight: 'wide',
        focal: [45, 55],
        alt: {
          en: 'Tables tucked under the stair, against a black tiled wall and a white stringer.',
          id: 'Meja yang menyelip di bawah tangga, dengan latar dinding keramik hitam dan ibu tangga putih.',
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
        id: 'mrs-d-house-02',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'Street elevation with red brick arches, a first-floor balcony and planting along the parapet.',
          id: 'Tampak jalan dengan lengkungan bata merah, balkon lantai dua, dan tanaman di sepanjang parapet.',
        },
      },
      {
        id: 'mrs-d-house-01',
        weight: 'lead',
        focal: [52, 52],
        alt: {
          en: 'Dining table under an arched opening, between a slatted timber wall and full-height pale cabinetry.',
          id: 'Meja makan di bawah bukaan melengkung, di antara dinding bilah kayu dan kabinet terang setinggi dinding.',
        },
        caption: {
          en: 'Dining, through the arch.',
          id: 'Ruang makan, lewat lengkungan.',
        },
      },
      {
        id: 'mrs-d-house-03',
        weight: 'wide',
        focal: [48, 52],
        alt: {
          en: 'Living room beneath the stair, with a deep sectional sofa, a gallery wall and the dining room beyond.',
          id: 'Ruang keluarga di bawah tangga, dengan sofa sudut, dinding galeri, dan ruang makan di baliknya.',
        },
      },
      {
        id: 'mrs-d-house-04',
        weight: 'wide',
        focal: [55, 55],
        alt: {
          en: 'Pantry run in pale timber against a sage wall, with open shelving, jars and built-in ovens.',
          id: 'Deretan pantri kayu terang dengan latar dinding sage, rak terbuka, toples, dan oven tanam.',
        },
        caption: {
          en: 'Pantry, sage and timber.',
          id: 'Pantri, sage dan kayu.',
        },
      },
      /* Published for the first time; the old `-05` was a part-built
         kitchen shot on a phone. */
      {
        id: 'mrs-d-house-05',
        weight: 'wide',
        focal: [48, 52],
        alt: {
          en: 'Multipurpose room with built-in shelving, a panelled dado and an arched window over the treadmill.',
          id: 'Ruang serbaguna dengan rak tanam, dinding berpanel setinggi pinggang, dan jendela melengkung di atas treadmill.',
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
      /* `-03` opens the project, and it is the frame that was held back
         in the previous revision as "a render cropped through the middle
         of a television". It is now the kitchen this renovation is
         actually about, shot square, and nothing else in the set has a
         better claim on the lead. */
      {
        id: 'ms-ra-house-03',
        weight: 'lead',
        focal: [52, 52],
        alt: {
          en: 'Kitchen tucked beneath the stair, with pale timber cabinetry, under-shelf lighting and a white tiled splashback.',
          id: 'Dapur yang menyelip di bawah tangga, dengan kabinet kayu terang, lampu bawah rak, dan dinding keramik putih.',
        },
      },
      {
        id: 'ms-ra-house-02',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'Sitting area against a slatted timber and woven panel wall, with two moulded chairs and a round timber table.',
          id: 'Area duduk dengan dinding bilah kayu dan panel anyaman, dua kursi cetak, dan meja bundar kayu.',
        },
        caption: {
          en: 'Sitting area, timber and weave.',
          id: 'Area duduk, kayu dan anyaman.',
        },
      },
      {
        id: 'ms-ra-house-05',
        weight: 'wide',
        focal: [48, 52],
        alt: {
          en: 'Living room with a wall-mounted screen on a timber panel, a floating console and open white shelving.',
          id: 'Ruang keluarga dengan televisi di panel kayu, konsol melayang, dan rak putih terbuka.',
        },
      },
      {
        id: 'ms-ra-house-01',
        weight: 'wide',
        focal: [55, 48],
        alt: {
          en: 'Living room wall with a wall-mounted screen, a low cabinet run and open shelving through to the hall.',
          id: 'Dinding ruang keluarga dengan televisi dinding, deretan kabinet rendah, dan rak terbuka menembus ke lorong.',
        },
      },
      {
        id: 'ms-ra-house-04',
        weight: 'detail',
        focal: [50, 55],
        alt: {
          en: 'Utility nook with overhead cabinets, a hanging rail and an ironing bench built into the run.',
          id: 'Sudut utilitas dengan kabinet atas, gantungan baju, dan meja setrika yang menyatu dengan kabinet.',
        },
        caption: {
          en: 'Utility nook, as built.',
          id: 'Sudut utilitas, terpasang.',
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
        id: 'mr-yp-house-03',
        weight: 'lead',
        focal: [50, 52],
        alt: {
          en: 'Two-storey street elevation with a timber-clad upper volume, a car in the carport and planting along the wall.',
          id: 'Tampak jalan dua lantai dengan massa atas berlapis kayu, mobil di carport, dan tanaman di sepanjang dinding.',
        },
      },
      {
        id: 'mr-yp-house-01',
        weight: 'lead',
        focal: [52, 52],
        alt: {
          en: 'Living room against a vertical timber batten wall, with a wall-mounted screen, a long low console and sheer curtains.',
          id: 'Ruang keluarga dengan dinding bilah kayu vertikal, televisi dinding, konsol rendah memanjang, dan tirai tipis.',
        },
        caption: {
          en: 'Living room, timber battens.',
          id: 'Ruang keluarga, bilah kayu.',
        },
      },
      /* The same room as the homepage hero plate — see `home.stage` in
         content/site.ts. The hero ships as its own wider master; this is
         the 3:2 and 4:5 pair the gallery uses. */
      {
        id: 'mr-yp-house-02',
        weight: 'wide',
        focal: [52, 55],
        alt: {
          en: 'Upper landing with a stainless balustrade, looking through a sliding door to the garden beyond.',
          id: 'Bordes atas dengan railing baja, memandang tembus lewat pintu geser ke taman di baliknya.',
        },
      },
      {
        id: 'mr-yp-house-04',
        weight: 'wide',
        focal: [50, 52],
        alt: {
          en: 'Kitchen and dining under a globe chandelier, with an exposed brick wall and dark timber shelving.',
          id: 'Dapur dan ruang makan di bawah lampu gantung bola, dengan dinding bata ekspos dan rak kayu gelap.',
        },
        caption: {
          en: 'Kitchen, under the chandelier.',
          id: 'Dapur, di bawah lampu gantung.',
        },
      },
      {
        id: 'mr-yp-house-05',
        weight: 'detail',
        focal: [50, 55],
        alt: {
          en: 'Galley kitchen in dark timber, with a range under an extractor and lighting beneath the wall units.',
          id: 'Dapur memanjang berbahan kayu gelap, dengan kompor di bawah penyedot asap dan lampu di bawah kabinet.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'capt-bubbles-laundry',
    name: { en: 'Capt Bubbles Laundry', id: 'Capt Bubbles Laundry' },
    type: { en: 'Laundry', id: 'Laundry' },
    location: { en: 'Bogor Utara', id: 'Bogor Utara' },
    year: 2026,
    outcome: {
      en: 'Capt Bubbles Laundry gives a round-the-clock service a clear architectural identity. On the street, a tall blue volume carries the brand above a fully glazed ground floor, so the working interior stays visible by day and becomes a lit shopfront after dark. Inside, stacked washers and dryers line both long walls of a single hall, leaving a central run of tables and stools for folding and waiting. High louvred openings, ceiling fans and continuous linear lighting keep the room bright and airy, while a restrained grey-and-white palette lets the brand’s blue and yellow carry the space.',
      id: 'Capt Bubbles Laundry memberi layanan 24 jam sebuah identitas arsitektural yang tegas. Dari jalan, massa biru yang menjulang membawa identitas merek di atas lantai dasar berdinding kaca penuh, sehingga aktivitas di dalamnya tetap terlihat di siang hari dan menjadi etalase yang menyala saat malam. Di dalam, mesin cuci dan pengering bertumpuk berjajar di kedua dinding panjang sebuah ruang utama, menyisakan deretan meja dan bangku di tengah untuk melipat dan menunggu. Bukaan krepyak di bagian atas, kipas plafon, dan lampu linear yang menerus menjaga ruang tetap terang dan lapang, sementara palet abu-abu dan putih yang tenang memberi panggung bagi biru dan kuning khas mereknya.',
    },
    /*
     * Four supplied images: the facade by day, the machine hall from
     * both ends as a pair, and the facade again at dusk. No floor area
     * was provided, so none is shown.
     */
    images: [
      {
        id: 'capt-bubbles-laundry-01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 04_02_24 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Capt Bubbles Laundry by day: a three-storey facade in blue with the mascot sign, 24-hour signage and a pylon sign at the street.',
          id: 'Capt Bubbles Laundry di siang hari: fasad tiga lantai berwarna biru dengan papan maskot, tanda buka 24 jam, dan papan tiang di tepi jalan.',
        },
      },
      {
        id: 'capt-bubbles-laundry-02',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'Scene 17.png', width: 1309, height: 830 },
        alt: {
          en: 'Self-service hall lined with stacked washers and dryers, folding tables and blue baskets down the middle.',
          id: 'Ruang swalayan berjajar mesin cuci dan pengering bertumpuk, dengan meja lipat dan keranjang biru di tengah.',
        },
      },
      {
        id: 'capt-bubbles-laundry-03',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'Scene 20.png', width: 1309, height: 830 },
        alt: {
          en: 'The machine hall from the other side, the Captain Bubbles sign on the far wall above shelving.',
          id: 'Ruang mesin dari sisi lain, papan Captain Bubbles di dinding ujung di atas rak.',
        },
      },
      {
        id: 'capt-bubbles-laundry-04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 04_06_54 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'The same facade at dusk, the shopfront lit.',
          id: 'Fasad yang sama saat senja, dengan etalase menyala.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'peeps-cafe',
    name: { en: 'Peeps Cafe', id: 'Peeps Cafe' },
    type: { en: 'Cafe', id: 'Kafe' },
    location: { en: 'Depok', id: 'Depok' },
    year: 2026,
    area: 228.9,
    outcome: {
      en: 'Peeps Cafe pairs a calm palette of grey concrete, pale timber and upholstered banquettes with a quiet nod to the markets. A ticker of world-city clocks runs above the counter, and live charts sit on the walls of the dining rooms. Full-height glazing brings daylight to the window seats, while track and linear lighting give the deeper rooms an even, gallery-like clarity. From the street, a perforated screen wall and planting soften the dark storefront, and at the rear a covered terrace under a slatted roof carries the cafe outdoors.',
      id: 'Peeps Cafe memadukan palet yang tenang — beton abu-abu, kayu berwarna terang, dan bangku berlapis jok — dengan sentuhan halus dari dunia pasar modal. Deretan jam kota-kota dunia membentang di atas meja pemesanan, dan grafik pasar tampil di dinding ruang makan. Kaca setinggi plafon mengalirkan cahaya alami ke tempat duduk di sisi jendela, sementara lampu rel dan lampu linear memberi ruang-ruang di bagian dalam pencahayaan yang merata dan jernih, layaknya sebuah galeri. Dari jalan, dinding roster dan tanaman melunakkan etalase yang gelap, dan di bagian belakang, teras beratap kisi membawa suasana kafe ke luar ruang.',
    },
    /*
     * All seven supplied images, each a distinct space: the street
     * front, the hall, the counter, the window seats, the rear room, then
     * the merchandise corner and the terrace as a pair.
     */
    images: [
      {
        id: 'peeps-cafe-01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_01_43 PM.png', width: 1672, height: 941 },
        alt: {
          en: 'Peeps Cafe from the street: a dark storefront under the Peeps Cafe sign, a perforated screen wall and planters along the pavement, mesh-clad floors above.',
          id: 'Peeps Cafe dari jalan: etalase gelap di bawah papan nama Peeps Cafe, dinding roster dan tanaman di sepanjang trotoar, lantai atas berbalut jaring.',
        },
      },
      {
        id: 'peeps-cafe-02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_04_37 PM.png', width: 1358, height: 1086 },
        alt: {
          en: 'Main dining hall with timber chairs, grey banquettes and track lighting, a merchandise wall and a market-chart screen beyond.',
          id: 'Ruang makan utama dengan kursi kayu, bangku abu-abu, dan lampu rel, dinding merchandise serta layar grafik pasar di baliknya.',
        },
      },
      {
        id: 'peeps-cafe-03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_06_32 PM.png', width: 1176, height: 941 },
        alt: {
          en: 'Order counter beneath a ticker of world clocks, with backlit shelving, an espresso machine and the Peeps Cafe sign.',
          id: 'Meja pemesanan di bawah papan jam dunia, dengan rak berlampu, mesin espreso, dan papan nama Peeps Cafe.',
        },
      },
      {
        id: 'peeps-cafe-04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_08_15 PM.png', width: 1255, height: 941 },
        alt: {
          en: 'Seating along the glazed frontage: timber chairs and banquettes under linear lights.',
          id: 'Tempat duduk di sepanjang muka kaca: kursi kayu dan bangku di bawah lampu linear.',
        },
      },
      {
        id: 'peeps-cafe-05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_11_54 PM.png', width: 1176, height: 941 },
        alt: {
          en: 'Rear dining room with rows of tables facing a wall screen that shows a market chart.',
          id: 'Ruang makan belakang dengan deretan meja menghadap layar dinding yang menampilkan grafik pasar.',
        },
      },
      {
        id: 'peeps-cafe-06',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_10_09 PM.png', width: 1176, height: 941 },
        alt: {
          en: 'Merchandise corner with partner-brand displays, shelving and banquette seating.',
          id: 'Sudut merchandise dengan display mitra, rak, dan bangku.',
        },
      },
      {
        id: 'peeps-cafe-07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_14_45 PM.png', width: 1176, height: 941 },
        alt: {
          en: 'Covered terrace with a slatted roof, wall lights, planting and metal chairs.',
          id: 'Teras beratap kisi dengan lampu dinding, tanaman, dan kursi logam.',
        },
      },
    ],
    published: true,
  },

  {
    slug: 'stoma-museum',
    name: { en: 'Stoma Museum', id: 'Stoma Museum' },
    type: { en: 'Museum', id: 'Museum' },
    location: { en: 'Bogor Barat', id: 'Bogor Barat' },
    year: 2026,
    area: 456,
    outcome: {
      en: 'Stoma Museum turns a house-scale building into a clear, approachable place to learn. Behind a white columned portico, the interior is kept quiet — white walls, pale timber floors and arched openings — so the exhibition can lead. A continuous green band curves along walls and ceilings, carrying integrated light and drawing visitors from the entrance gallery past the history and data walls to a circular central installation. Orange feature walls and large-scale typography mark key moments in the story, while a recording studio and a glazed meeting room make the building a working space as well.',
      id: 'Stoma Museum mengubah bangunan berskala rumah menjadi ruang belajar yang jelas dan mudah didekati. Di balik serambi berkolom putih, interiornya sengaja dibuat tenang — dinding putih, lantai kayu terang, dan bukaan lengkung — agar pameran menjadi pusat perhatian. Pita hijau yang menerus melengkung di sepanjang dinding dan plafon, membawa pencahayaan terintegrasi sekaligus menuntun pengunjung dari galeri pintu masuk, melewati dinding sejarah dan data, menuju instalasi melingkar di tengah ruang. Dinding aksen oranye dan tipografi berskala besar menandai momen-momen penting dalam alur cerita, sementara studio rekaman dan ruang rapat berdinding kaca menjadikan bangunan ini juga sebuah ruang kerja.',
    },
    /*
     * All seven supplied images: the building, the central installation,
     * the history and data walls and the entrance gallery, then the
     * recording studio and meeting room as a pair.
     */
    images: [
      {
        id: 'stoma-museum-01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_55_09 PM.png', width: 1554, height: 1012 },
        alt: {
          en: 'The museum building: a pitched-roof house with a white columned portico, the Ostomy Museum of Indonesia sign on its facade.',
          id: 'Bangunan museum: rumah beratap pelana dengan serambi berkolom putih, papan Ostomy Museum of Indonesia di fasadnya.',
        },
      },
      {
        id: 'stoma-museum-02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_48_22 PM.png', width: 1446, height: 964 },
        alt: {
          en: 'The central installation: a circular suspended display of ostomy pouches around a pedestal, orange feature walls beyond.',
          id: 'Instalasi utama: display melingkar kantong stoma yang digantung mengelilingi sebuah podium, dengan dinding aksen oranye di baliknya.',
        },
      },
      {
        id: 'stoma-museum-03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_47_25 PM.png', width: 1402, height: 935 },
        alt: {
          en: 'The history wall, “Sejarah Perkembangan Stoma”: a timeline of framed panels beneath a curved green canopy.',
          id: 'Dinding sejarah, “Sejarah Perkembangan Stoma”: lini masa panel berbingkai di bawah kanopi hijau melengkung.',
        },
      },
      {
        id: 'stoma-museum-04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_46_55 PM.png', width: 1460, height: 973 },
        alt: {
          en: 'Entrance gallery: an arched opening onto an orange wall with a line drawing of the body, a mannequin and an information kiosk.',
          id: 'Galeri pintu masuk: bukaan lengkung menuju dinding oranye berilustrasi garis tubuh manusia, manekin, dan kios informasi.',
        },
      },
      {
        id: 'stoma-museum-05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_47_51 PM.png', width: 1535, height: 1023 },
        alt: {
          en: 'The data and procedure wall, with a circular infographic and a sequence of illustrated stages.',
          id: 'Dinding data dan tahapan, dengan infografik melingkar dan rangkaian tahapan berilustrasi.',
        },
      },
      {
        id: 'stoma-museum-06',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_49_23 PM.png', width: 1496, height: 997 },
        alt: {
          en: 'Recording studio with a round table, microphones, lighting umbrellas and an illuminated museum sign.',
          id: 'Studio rekaman dengan meja bundar, mikrofon, payung lampu, dan papan nama museum yang menyala.',
        },
      },
      {
        id: 'stoma-museum-07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 05_49_02 PM.png', width: 1476, height: 984 },
        alt: {
          en: 'Meeting room with a timber table, black chairs, a projection screen and glazed partitions.',
          id: 'Ruang rapat dengan meja kayu, kursi hitam, layar proyeksi, dan partisi kaca.',
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

/* ------------------------------------------------------------------ *
 * THE ARCHIVE — the album overture's wider cut
 * ------------------------------------------------------------------ */

/**
 * The album overture's Larkscapes prints. The renders themselves are
 * defined once, in `larkscapesLibrary` (content/site.ts), which the New
 * Directions section and announcement also read — these are named picks
 * from it, not second definitions.
 */
export const ARCHIVE = {
  sanza24: larkscape('Sanza Villa - Bali/24.png'),
  th19: larkscape('TH Villa - Bali/19.png'),
} as const satisfies Record<string, Photograph>;

/** A published frame as a whole photograph, by id. */
export function framePhotograph(id: string): Photograph {
  const found = findImage(id);
  if (!found) throw new Error(`Unknown frame ${id}`);
  return photograph(found.project, found.image);
}

/** Every photograph of a project, in its running order. */
export function projectPhotographs(project: Project): readonly Photograph[] {
  return project.images.map((image) => photograph(project, image));
}
