import type { Testimonial } from '@/content/types';

/**
 * Placeholder entries — shipped wired rather than withheld, per the
 * studio's direction. The bracketed text in the quote itself is the
 * primary safeguard against these reading as real client words;
 * `placeholder: true` exists for tooling, not as the only signal.
 * Replace both entries with real quotes before launch.
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: 'placeholder-1',
    quote: {
      en: '[Placeholder — replace with a real client quote before launch.]',
      id: '[Placeholder — ganti dengan kutipan klien sesungguhnya sebelum diluncurkan.]',
    },
    attribution: {
      en: 'Client name, Project name',
      id: 'Nama klien, Nama proyek',
    },
    placeholder: true,
  },
  {
    id: 'placeholder-2',
    quote: {
      en: '[Placeholder — replace with a real client quote before launch.]',
      id: '[Placeholder — ganti dengan kutipan klien sesungguhnya sebelum diluncurkan.]',
    },
    attribution: {
      en: 'Client name, Project name',
      id: 'Nama klien, Nama proyek',
    },
    placeholder: true,
  },
];
