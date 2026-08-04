import type { UiStrings } from '@/content/types';

/**
 * Interface strings, authored in parallel rather than translated.
 * Marketing English run literally into Bahasa Indonesia goes stiff and
 * bureaucratic — both versions are written by someone who writes well
 * in each. Same facts, same restraint, native rhythm.
 *
 * Note the trigger word is `Menu`, not an icon. An icon is a small act
 * of ambiguity we can simply refuse.
 */
export const ui: UiStrings = {
  skipToContent: { en: 'Skip to content', id: 'Lewati ke konten' },
  menuOpen: { en: 'Menu', id: 'Menu' },
  menuClose: { en: 'Close', id: 'Tutup' },

  navWork: { en: 'Work', id: 'Karya' },
  navApproach: { en: 'Approach', id: 'Cara Kerja' },
  navStudio: { en: 'Studio', id: 'Studio' },
  navContact: { en: 'Contact', id: 'Kontak' },

  nextProject: { en: 'Next project', id: 'Proyek berikutnya' },
  allWork: { en: 'All work', id: 'Semua karya' },

  specificationHeading: { en: 'Specification', id: 'Spesifikasi' },
  creditsHeading: { en: 'Credits', id: 'Kredit' },
  photographer: { en: 'Photography', id: 'Fotografi' },
  contractor: { en: 'Contractor', id: 'Kontraktor' },

  area: { en: 'Area', id: 'Luas' },
  programme: { en: 'Programme', id: 'Durasi' },
  seats: { en: 'Seats', id: 'Kursi' },
  coversPerService: { en: 'Covers per service', id: 'Tamu per layanan' },
  handoverToOpening: { en: 'Handover to opening', id: 'Serah terima ke pembukaan' },
  opened: { en: 'Opened', id: 'Dibuka' },
  occupiedSince: { en: 'Occupied since', id: 'Dihuni sejak' },
  units: { en: 'Units', id: 'Unit' },
  buildings: { en: 'Buildings', id: 'Bangunan' },
  handedOver: { en: 'Handed over', id: 'Serah terima' },
  bedrooms: { en: 'Bedrooms', id: 'Kamar tidur' },
  storeys: { en: 'Storeys', id: 'Lantai' },
  phase: { en: 'Phase', id: 'Tahap' },

  servicesHeading: { en: 'Services', id: 'Layanan' },
  processHeading: { en: 'Process', id: 'Proses' },
  testimonialsHeading: { en: 'What clients say', id: 'Kata klien' },
  challengeHeading: { en: 'Challenge', id: 'Tantangan' },
  conceptHeading: { en: 'Concept', id: 'Konsep' },
  materialsHeading: { en: 'Materials', id: 'Material' },
  plansHeading: { en: 'Plans', id: 'Denah' },
  resultHeading: { en: 'Result', id: 'Hasil' },
  galleryHeading: { en: 'Gallery', id: 'Galeri' },

  notFoundTitle: { en: 'Page not found', id: 'Halaman tidak ditemukan' },
  notFoundBody: {
    en: 'This page has moved or no longer exists.',
    id: 'Halaman ini telah dipindahkan atau tidak lagi tersedia.',
  },
};
