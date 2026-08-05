import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/content/types';
import { paths } from '@/lib/paths';
import { site } from '@/content/site';

/**
 * The studio's supplied mark, replacing the earlier set-not-drawn text
 * treatment. White on transparency, sized to sit at roughly the
 * header's own line-height.
 *
 * Neither `priority` nor a `sizes` prop was set here. On the homepage
 * that meant this 44px header logo carried the same `fetchPriority:
 * high` signal as the hero photo and, with no `sizes` hint, generated
 * a srcset sized to its 619px-declared width rather than its actual
 * 44px display size — a second high-priority, oversized image fetch
 * competing with the real Largest Contentful Paint candidate for
 * mobile bandwidth. It renders above the fold on every page regardless
 * (the header is always visible), so it doesn't need eager/priority
 * loading to appear on time; `sizes="44px"` lets next/image request a
 * correctly small file instead of a ~14x-too-large one.
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
        src={site.logo}
        alt="Lark Studio"
        width={619}
        height={823}
        sizes="44px"
        className="h-full w-full object-contain"
      />
    </Link>
  );
}
