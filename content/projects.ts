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
    /*
     * PHOTOGRAPHY UPDATED SEPTEMBER 2026 from the studio's current renders,
     * most at their own 5:4 — the earlier 3:2 set had been cropped from
     * compositions like these (`amadya-02` was pixel-for-pixel a crop of
     * the new counter render, which now takes its id; the Disciplines
     * preview names it). The earlier `amadya-05`, a phone photograph of
     * the shophouse before the fit-out, is no longer shown. Earlier files
     * remain on disk, unreferenced.
     */
    images: [
      {
        id: 'amadya-r01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: '2caf03ee-35ff-43a1-a464-a120cf03a7ac.png', width: 1356, height: 1085 },
        alt: {
          en: 'The shophouse front: a steep black roof over glazing and timber screens, a planted ledge and the AMADYA Coffee & Eatery sign.',
          id: 'Muka ruko: atap hitam curam di atas kaca dan sekat kayu, ambang bertanaman, dan papan nama AMADYA Coffee & Eatery.',
        },
      },
      {
        id: 'amadya-r02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'indoor 6_.png', width: 1920, height: 1536 },
        alt: {
          en: 'A curved timber-clad espresso bar under a timber ceiling, the menu board above.',
          id: 'Bar espreso melengkung berlapis kayu di bawah plafon kayu, dengan papan menu di atasnya.',
        },
      },
      {
        id: 'amadya-02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'watermark-removed-indoor 4_.png', width: 2240, height: 1792 },
        alt: {
          en: 'Pastry counter in timber and concrete, with shelving and a round mirror on the wall.',
          id: 'Meja pastry dari kayu dan beton, dengan rak dan cermin bundar di dinding.',
        },
      },
      {
        id: 'amadya-r04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Feb 18, 2026, 11_05_411 PM.png', width: 1280, height: 1024 },
        alt: {
          en: 'A sage-green wall with a long upholstered banquette, timber tables and brass pendants.',
          id: 'Dinding hijau sage dengan bangku berjok memanjang, meja kayu, dan lampu gantung kuningan.',
        },
      },
      {
        id: 'amadya-r05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'f54125ed-5a23-4865-9d86-62212c9d3542.png', width: 1163, height: 930 },
        alt: {
          en: 'The banquette seen past a timber lattice screen, daylight from the glazed end wall.',
          id: 'Bangku berjok terlihat dari balik sekat kisi kayu, dengan cahaya dari dinding kaca di ujung ruang.',
        },
      },
      {
        id: 'amadya-r06',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Feb 18, 2026, 11_43_36 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Bar seating and dining along timber-panelled walls under a paper lantern.',
          id: 'Kursi bar dan area makan di sepanjang dinding berpanel kayu, di bawah lampion kertas.',
        },
      },
      {
        id: 'amadya-r07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'watermark-removed-Gemini_Generated_Image_55w8zn55w8zn55w8.png', width: 1768, height: 1414 },
        alt: {
          en: 'Dining room with a paper lantern, tall timber doors and open shelving.',
          id: 'Ruang makan dengan lampion kertas, pintu kayu tinggi, dan rak terbuka.',
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
     * PHOTOGRAPHY UPDATED SEPTEMBER 2026 from the studio's current renders
     * of "The Prasetyo Coffee & Space 1971" — a new rendering of the house
     * rather than a re-export, so the earlier five (a different fit-out)
     * are no longer shown and remain on disk, unreferenced. Seven of the
     * eight new images; `03_46_56` repeats the street view of `03_45_09`
     * from closer in and is left out.
     */
    images: [
      {
        id: 'the-prasetyos-r01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_53_16 PM.png', width: 1402, height: 1122 },
        alt: {
          en: 'The counter and dining room under an exposed timber roof, the menu board above the slatted bar.',
          id: 'Meja bar dan ruang makan di bawah atap kayu ekspos, papan menu di atas bar berkisi.',
        },
      },
      {
        id: 'the-prasetyos-r02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_45_09 PM.png', width: 1672, height: 941 },
        alt: {
          en: 'The house from the garden: white walls over a green base, louvred shutters, and red stools on the terrace.',
          id: 'Rumah dari halaman: dinding putih di atas alas hijau, jendela krepyak, dan bangku merah di teras.',
        },
      },
      {
        id: 'the-prasetyos-r03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_48_13 PM.png', width: 1402, height: 1122 },
        alt: {
          en: 'Dining room with timber posts and rafters, a counter along one side.',
          id: 'Ruang makan dengan tiang dan kasau kayu, meja bar di satu sisi.',
        },
      },
      {
        id: 'the-prasetyos-r04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_49_41 PM.png', width: 1402, height: 1122 },
        alt: {
          en: 'The coffee counter head-on: slatted timber, an espresso machine and a pastry case.',
          id: 'Meja kopi dari depan: kisi kayu, mesin espreso, dan etalase pastry.',
        },
      },
      {
        id: 'the-prasetyos-r05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_51_25 PM.png', width: 1122, height: 898 },
        alt: {
          en: 'A lounge corner with a leather sofa, a clothing rail and framed prints on white walls.',
          id: 'Sudut santai dengan sofa kulit, gantungan pakaian, dan cetakan berbingkai di dinding putih.',
        },
      },
      {
        id: 'the-prasetyos-r06',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_55_05 PM.png', width: 1402, height: 1122 },
        alt: {
          en: 'Looking through the room to a doorway onto the courtyard.',
          id: 'Pandangan menembus ruang ke pintu menuju halaman.',
        },
      },
      {
        id: 'the-prasetyos-r07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 03_56_25 PM.png', width: 1115, height: 1393 },
        alt: {
          en: 'A corner with a vintage cabinet, a mirror and a woven rug beneath the rafters.',
          id: 'Sudut dengan lemari antik, cermin, dan karpet anyam di bawah kasau.',
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
    /*
     * PHOTOGRAPHY UPDATED SEPTEMBER 2026 from the studio's current renders
     * (supplied at 1373–1536px, 3:2). They re-render every view the
     * earlier set had — the earlier `kintaro-cafe-0x-3x2.jpg` files remain
     * on disk, unreferenced — and add the counter, the planter dining bay
     * and the courtyard. `kintaro-cafe-02` keeps its id (the exterior) so
     * the Disciplines preview that names it still resolves.
     */
    images: [
      {
        id: 'kintaro-cafe-r01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_38_36 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Order counter under a KINTARO sign, dining tables and a black track-light frame beyond.',
          id: 'Meja pemesanan di bawah papan KINTARO, meja makan dan rangka lampu rel hitam di baliknya.',
        },
      },
      {
        id: 'kintaro-cafe-02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_35_58 PM.png', width: 1477, height: 985 },
        alt: {
          en: 'The pavilion from the street: a hipped roof over concrete and dark tile, a timber-framed window and a breeze-block screen.',
          id: 'Paviliun dari jalan: atap perisai di atas beton dan keramik gelap, jendela berbingkai kayu, dan dinding roster.',
        },
      },
      {
        id: 'kintaro-cafe-r03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_37_04 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'The counter up close, beneath the black KINTARO fascia and a tiled back wall.',
          id: 'Meja pemesanan dari dekat, di bawah fasia hitam KINTARO dan dinding belakang berkeramik.',
        },
      },
      {
        id: 'kintaro-cafe-r04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_40_05 PM.png', width: 1373, height: 915 },
        alt: {
          en: 'Dining bay around a concrete planter, under an exposed concrete frame and track lighting.',
          id: 'Area makan di sekitar pot beton, di bawah rangka beton ekspos dan lampu rel.',
        },
      },
      {
        id: 'kintaro-cafe-r05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_41_56 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Merchandise wall of timber panels and black grid shelving above communal tables.',
          id: 'Dinding merchandise dari panel kayu dan rak kisi hitam di atas meja bersama.',
        },
      },
      {
        id: 'kintaro-cafe-r06',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_48_35 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'A long timber table and rows of black chairs under the track-light frame.',
          id: 'Meja kayu panjang dan deretan kursi hitam di bawah rangka lampu rel.',
        },
      },
      {
        id: 'kintaro-cafe-r07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_45_09 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Courtyard seating on pebbles, facing the timber-framed window into the bar.',
          id: 'Tempat duduk halaman di atas kerikil, menghadap jendela berbingkai kayu ke arah bar.',
        },
      },
      {
        id: 'kintaro-cafe-r08',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 21, 2026, 04_46_28 PM.png', width: 1536, height: 1024 },
        alt: {
          en: 'Covered courtyard with a brick wall, a stepped concrete bench and planting.',
          id: 'Halaman beratap dengan dinding bata, bangku beton berundak, dan tanaman.',
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
    /*
     * PHOTOGRAPHY UPDATED SEPTEMBER 2026 from the studio's current renders,
     * which re-render the facade, living room, pantry and study and add
     * the bedroom, kitchen, hallway and garden terrace. The dining room
     * (`mrs-d-house-01`) is the one earlier view the new set does not
     * cover, and is kept. `mrs-d-house-02` keeps its id (the facade) so
     * the Disciplines preview that names it still resolves. Other earlier
     * files remain on disk, unreferenced.
     */
    images: [
      {
        id: 'mrs-d-house-02',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jun 28, 2026, 10_29_011 PM.png', width: 1440, height: 960 },
        alt: {
          en: 'The renovated facade: a white rounded volume, a brick-faced balcony under a black pergola, and a circular brick motif by the door.',
          id: 'Fasad hasil renovasi: massa putih melengkung, balkon berlapis bata di bawah pergola hitam, dan motif bata melingkar di dekat pintu.',
        },
      },
      {
        id: 'mrs-d-house-r02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_08_16 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'Living room beneath the timber stair, looking through to the dining room and garden doors.',
          id: 'Ruang keluarga di bawah tangga kayu, memandang ke ruang makan dan pintu ke taman.',
        },
      },
      {
        id: 'mrs-d-house-01',
        weight: 'wide',
        focal: [52, 52],
        file: { name: 'mrs-d-house-01-3x2.jpg', width: 4200, height: 2800 },
        alt: {
          en: 'Dining table under an arched opening, between a slatted timber wall and full-height pale cabinetry.',
          id: 'Meja makan di bawah bukaan melengkung, di antara dinding bilah kayu dan kabinet terang setinggi dinding.',
        },
      },
      {
        id: 'mrs-d-house-r03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_06_57 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'Pantry wall of timber cabinetry with lit open shelving beside a sage-green wall.',
          id: 'Dinding pantry berkabinet kayu dengan rak terbuka berlampu di samping dinding hijau sage.',
        },
      },
      {
        id: 'mrs-d-house-r04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_15_55 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'Kitchen with pale timber cabinets, a tiled splashback and a sliding door to the garden.',
          id: 'Dapur dengan kabinet kayu terang, backsplash keramik, dan pintu geser ke taman.',
        },
      },
      {
        id: 'mrs-d-house-r05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_11_51 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'Bedroom with an upholstered headboard wall, a crib and a built-in vanity.',
          id: 'Kamar tidur dengan dinding sandaran berjok, boks bayi, dan meja rias terpasang.',
        },
      },
      {
        id: 'mrs-d-house-r06',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_31_27 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'Arched doorways and wainscoted walls, with open shelving in a niche.',
          id: 'Pintu-pintu lengkung dan dinding berlambris, dengan rak terbuka di dalam ceruk.',
        },
      },
      {
        id: 'mrs-d-house-r07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_22_56 PM.png', width: 1437, height: 958 },
        alt: {
          en: 'A study and exercise room with built-in shelving and an arched window.',
          id: 'Ruang kerja dan olahraga dengan rak tanam dan jendela lengkung.',
        },
      },
      {
        id: 'mrs-d-house-r08',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Sep 22, 2026, 03_24_26 PM.png', width: 1436, height: 957 },
        alt: {
          en: 'Covered garden terrace with raised planters, hanging plants and a timber potting table.',
          id: 'Teras taman beratap dengan bak tanam, tanaman gantung, dan meja tanam kayu.',
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
    /*
     * PHOTOGRAPHY UPDATED SEPTEMBER 2026 from the studio's current renders.
     * The new images are the originals the earlier set came from (the
     * kitchen and utility views were pixel-for-pixel crops of them) plus
     * the rooms it did not show. Earlier files remain on disk,
     * unreferenced.
     */
    images: [
      {
        id: 'ms-ra-house-r01',
        weight: 'lead',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jul 29, 2026, 01_41_091 PM.png', width: 1386, height: 924 },
        alt: {
          en: 'Family room with a folding rattan screen beneath timber slats, white chairs and a round table.',
          id: 'Ruang keluarga dengan sekat lipat rotan di bawah kisi kayu, kursi putih, dan meja bundar.',
        },
      },
      {
        id: 'ms-ra-house-r02',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'Gemini_Generated_Image_hm0mzyhm0mzyhm0m.png', width: 2227, height: 1792 },
        alt: {
          en: 'Kitchen fitted beneath the stair: timber cabinetry with lit niches, a white tiled splashback and a steel refrigerator.',
          id: 'Dapur yang dipasang di bawah tangga: kabinet kayu dengan ceruk berlampu, backsplash keramik putih, dan kulkas baja.',
        },
      },
      {
        id: 'ms-ra-house-r03',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jul 29, 2026, 01_39_03 PM.png', width: 1388, height: 925 },
        alt: {
          en: 'A TV wall between timber panels, a floating cabinet and white shelving with books.',
          id: 'Dinding TV di antara panel kayu, kabinet gantung, dan rak putih berisi buku.',
        },
      },
      {
        id: 'ms-ra-house-r04',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jul 29, 2026, 01_42_461 PM.png', width: 1386, height: 924 },
        alt: {
          en: 'The rattan screen folded back, opening onto a study.',
          id: 'Sekat rotan yang dilipat, membuka ke ruang kerja.',
        },
      },
      {
        id: 'ms-ra-house-r05',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jul 29, 2026, 01_46_481 PM.png', width: 1388, height: 925 },
        alt: {
          en: 'A sitting corner with an upholstered bench, framed leaf prints and an arched doorway.',
          id: 'Sudut duduk dengan bangku berjok, cetakan daun berbingkai, dan pintu lengkung.',
        },
      },
      {
        id: 'ms-ra-house-r06',
        weight: 'wide',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Jul 29, 2026, 02_01_001 PM.png', width: 1410, height: 940 },
        alt: {
          en: 'Entry with white chairs, a curtain and shelving along the wall.',
          id: 'Area masuk dengan kursi putih, tirai, dan rak di sepanjang dinding.',
        },
      },
      {
        id: 'ms-ra-house-r07',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Aug 4, 2026, 11_20_241 AM.png', width: 1454, height: 969 },
        alt: {
          en: 'Full-height wardrobes in timber and white, a stair beyond the glass.',
          id: 'Lemari setinggi plafon dari kayu dan putih, tangga di balik kaca.',
        },
      },
      {
        id: 'ms-ra-house-r08',
        weight: 'detail',
        focal: [50, 50],
        file: { name: 'ChatGPT Image Aug 4, 2026, 11_21_32 AM.png', width: 1551, height: 1014 },
        alt: {
          en: 'Utility wall with a fitted ironing counter and wall cabinets.',
          id: 'Dinding utilitas dengan meja setrika terpasang dan kabinet atas.',
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
