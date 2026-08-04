'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/content/types';
import { LOCALES } from '@/content/types';
import { LOCALE_LABEL } from '@/lib/i18n';
import { translatePath } from '@/lib/paths';

/**
 * EN / ID. The only switch on this site.
 *
 * It maps to the EQUIVALENT page: switching language on a project page
 * lands on that project in the other language, never on the homepage.
 * This sounds obvious and is broken on most bilingual sites.
 *
 * The choice persists across the session via a cookie, which
 * middleware.ts reads when someone arrives at the bare origin.
 */
export function LanguageToggle({
  locale,
  inverse = false,
}: {
  locale: Locale;
  inverse?: boolean;
}) {
  const pathname = usePathname();

  function remember(next: Locale) {
    document.cookie = `lark-locale=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div
      className="flex items-center gap-2 font-grotesque text-nav desktop:text-nav-desktop"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((candidate, index) => {
        const isCurrent = candidate === locale;
        const tone = inverse
          ? isCurrent
            ? 'text-ink-inverse'
            : 'text-ink-3-inverse hover:text-ink-inverse'
          : isCurrent
            ? 'text-ink'
            : 'text-ink-2 hover:text-ink';

        return (
          <span key={candidate} className="flex items-center gap-2">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={inverse ? 'text-ink-3-inverse' : 'text-ink-3'}
              >
                /
              </span>
            )}
            <Link
              href={translatePath(pathname, candidate)}
              hrefLang={candidate}
              lang={candidate}
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => {
                remember(candidate);
              }}
              className={`inline-flex min-h-[44px] items-center transition-colors duration-120 ease-response desktop:min-h-0 ${tone}`}
            >
              {LOCALE_LABEL[candidate]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
