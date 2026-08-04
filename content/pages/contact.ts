import type { ContactContent } from '@/content/types';
import { site } from '@/content/site';

/**
 * Prompts are process guidance (what is useful in a first message),
 * not company facts — the profile does not specify these, so they are
 * written as neutral, generic qualification copy rather than invented
 * claims about the studio.
 */
export const contact: ContactContent = {
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

  email: site.email,
  whatsapp: site.whatsapp,
  whatsappOpener: site.whatsappOpener,

  openGraphImage: '/og/home.jpg',
};
