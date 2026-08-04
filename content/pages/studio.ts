import type { StudioContent } from '@/content/types';

/**
 * Statement and values are drawn directly from the company profile's
 * About and Our Value sections. No individuals are named — the profile
 * lists none, and this site does not invent people, roles or biographies.
 */
export const studio: StudioContent = {
  statement: {
    en: 'Founded in 2025, Lark Studio began with a small group of young designers brought together by shared conversations about space, design, and how people actually live. We believed that great spaces shouldn’t just look good, but feel considered, personal, and built to last.',
    id: 'Didirikan pada tahun 2025, Lark Studio berawal dari sekelompok kecil desainer muda yang dipertemukan oleh percakapan bersama tentang ruang, desain, dan cara orang benar-benar menjalani kesehariannya. Kami percaya bahwa ruang yang baik tidak hanya harus terlihat indah, tetapi juga terasa dipikirkan dengan matang, personal, dan dibangun untuk bertahan lama.',
  },

  people: [],

  passages: [
    {
      id: 'services',
      heading: { en: 'Services', id: 'Layanan' },
      body: {
        en: 'Architecture Design, Interior Design, Technical Documentation, Consultation & Advisory.',
        id: 'Desain Arsitektur, Desain Interior, Dokumentasi Teknis, dan Konsultasi & Advisory.',
      },
    },
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
  ],

  openGraphImage: '/og/home.jpg',
};
