import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/content/types';
import { paths } from '@/lib/paths';

/**
 * The studio's supplied mark, replacing the earlier set-not-drawn text
 * treatment. White on transparency, sized to sit at roughly the
 * header's own line-height.
 */
export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link
      href={paths.home(locale)}
      className="inline-flex h-[44px] w-[44px] items-center justify-center"
      aria-label="Lark Studio"
      title="Lark Studio"
    >
      <Image
        src="/logo/larkstudio_logo-removebg-preview.png"
        alt="Lark Studio"
        width={619}
        height={823}
        priority
        className="h-full w-full object-contain"
      />
    </Link>
  );
}
