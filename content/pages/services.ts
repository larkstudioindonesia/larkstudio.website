import type { Passage } from '@/content/types';

/**
 * Homepage Services list — the four industries named in the brand
 * brief. Reuses the existing `Passage` shape rather than a new type.
 * Distinct from `studio.ts`'s one-sentence services passage: this is a
 * dedicated, per-industry treatment for the homepage's Services
 * section. Draft copy — usable as-is, flagged for studio sign-off.
 */
export const services: readonly Passage[] = [
  {
    id: 'architecture',
    heading: { en: 'Architecture', id: 'Arsitektur' },
    body: {
      en: 'Building form, structure and spatial planning, from massing through construction drawings.',
      id: 'Bentuk bangunan, struktur, dan perencanaan ruang, dari massa bangunan hingga gambar kerja konstruksi.',
    },
  },
  {
    id: 'interior-design',
    heading: { en: 'Interior Design', id: 'Desain Interior' },
    body: {
      en: 'Material, furniture and finishing decisions for how a space is used day to day.',
      id: 'Keputusan material, furnitur, dan finishing untuk bagaimana ruang digunakan sehari-hari.',
    },
  },
  {
    id: 'landscape',
    heading: { en: 'Landscape', id: 'Lanskap' },
    body: {
      en: 'Outdoor space, planting and circulation, planned alongside the building rather than after it.',
      id: 'Ruang luar, penanaman, dan sirkulasi, direncanakan bersamaan dengan bangunan, bukan setelahnya.',
    },
  },
  {
    id: '3d-visualization',
    heading: { en: '3D Visualization', id: 'Visualisasi 3D' },
    body: {
      en: 'Renders that show a design before it is built, used to test decisions and communicate with contractors.',
      id: 'Render yang menunjukkan desain sebelum dibangun, digunakan untuk menguji keputusan dan berkomunikasi dengan kontraktor.',
    },
  },
];
