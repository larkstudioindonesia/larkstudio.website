import type { ApproachContent } from '@/content/types';

/**
 * Describes what happens, in sequence. Never what Lark promises.
 * Statement and stages are drawn directly from the company profile's
 * About and Our Process sections.
 */
export const approach: ApproachContent = {
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
  ],

  openGraphImage: '/og/home.jpg',
};
