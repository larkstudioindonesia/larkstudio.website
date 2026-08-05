import type { Localized } from '@/content/types';

/** Studio-level facts used by the application shell. */
export const site = {
  email: 'larkstudioindonesia@gmail.com',
  /** E.164, digits only, no plus. */
  whatsapp: '6285117314718',
  whatsappOpener: {
    en: 'Hello Lark Studio, I would like to discuss an architecture and interior design project.',
    id: 'Halo Lark Studio, Saya ingin berdiskusi mengenai proyek arsitektur dan interior.',
  } satisfies Localized<string>,
  address: ['Achmad Adnawijaya St B7 No.5', 'Bogor 16152', 'Indonesia'],
  logo: '/logo/larkstudio_logo-removebg-preview.png',
  instagram: {
    handle: '@larkstudio.id',
    href: 'https://instagram.com/larkstudio.id',
  },
} as const;
