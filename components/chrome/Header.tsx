'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/content/types';
import { paths } from '@/lib/paths';
import { Wordmark } from '@/components/chrome/Wordmark';
import { Navigation } from '@/components/chrome/Navigation';
import { LanguageToggle } from '@/components/chrome/LanguageToggle';
import { MobileMenu } from '@/components/chrome/MobileMenu';

/** Shared corner-badge sizing so the logo box and the Menu box on Home
 *  are visibly the same size, regardless of their different content. */
const CORNER_BADGE =
  'flex min-h-[76px] min-w-[76px] items-center justify-center bg-paper p-3';

/**
 * THE HEADER SCROLLS AWAY AND DOES NOT RETURN — EXCEPT TWO CORNER
 * BADGES ON HOME.
 *
 * Every route other than the homepage keeps the original behaviour
 * byte-for-byte: `static`, stateless, no fixed positioning.
 *
 * On Home, only two things persist while scrolling — the logo
 * (top-left) and the Menu trigger (top-right, mobile/tablet only) —
 * each pinned `fixed` on its own solid `bg-paper` badge, the same
 * size as each other. Everything else (desktop nav, the language
 * toggle) is NOT chrome that should follow you: it sits in a
 * `position: absolute` layer anchored to the page's own top rather
 * than the viewport, so it scrolls away naturally with the document,
 * the same as any other in-flow content.
 *
 * The logo badge (always visible) and the desktop nav layer occupy
 * opposite ends of the bar (left vs. right) and the Menu badge only
 * renders below desktop, exactly where the nav layer is hidden — so
 * in practice none of the three ever overlap and z-index ordering
 * between them doesn't matter. None of these wrappers sets an explicit
 * z-index for that reason, which also keeps MobileMenu's full-screen
 * panel (`z-50`, nested inside the Menu badge) free to compete against
 * the whole page rather than being capped inside a badge-level
 * stacking context.
 */
export function Header({
  locale,
  currentPath,
  email,
  whatsappHref,
  instagramHref,
}: {
  locale: Locale;
  currentPath?: string;
  email: string;
  whatsappHref: string;
  instagramHref: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === paths.home(locale);

  if (!isHome) {
    return (
      <header className="lark-no-print py-5 tablet:py-6">
        <div className="flex items-center justify-between px-5 tablet:px-6 desktop:px-6">
          <Wordmark locale={locale} />

          <div className="hidden items-center gap-6 desktop:flex">
            <Navigation locale={locale} {...(currentPath !== undefined && { currentPath })} />
            <LanguageToggle locale={locale} />
          </div>

          <MobileMenu
            locale={locale}
            email={email}
            whatsappHref={whatsappHref}
            instagramHref={instagramHref}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="lark-no-print relative">
      {/* Fixed, top-left — logo badge. No explicit z-index: `fixed`
          alone (z-index: auto) does not open a new stacking context,
          which matters below. */}
      <div className={`fixed left-5 top-5 tablet:left-6 tablet:top-6 z-50 ${CORNER_BADGE}`}>
        <Wordmark locale={locale} />
      </div>

      {/* Fixed, top-right — Menu badge, same size as the logo badge.
          `desktop:hidden` here (not just inside MobileMenu) so the
          badge itself disappears at desktop rather than sitting empty.
          Also no explicit z-index here, for the same reason: this
          wrapper contains MobileMenu's full-screen panel, which sets
          its own z-50 when open. Giving THIS div a z-index would
          create a stacking context that caps the panel at this div's
          level instead of letting z-50 compete globally. */}
      <div className={`fixed right-5 top-5 desktop:hidden tablet:right-6 tablet:top-6 z-50 ${CORNER_BADGE}`}>
        <MobileMenu
          locale={locale}
          email={email}
          whatsappHref={whatsappHref}
          instagramHref={instagramHref}
        />
      </div>

      {/* Fixed, scrolls with the viewport — desktop nav + language
          toggle only. No background: the fixed logo badge shows
          through around it at the top of the page. */}
      <div className="fixed inset-x-0 top-0 hidden py-5 desktop:block tablet:py-6 z-50">
        <div className="flex items-center justify-end gap-6 px-5 tablet:px-6 desktop:px-6">
          <Navigation locale={locale} {...(currentPath !== undefined && { currentPath })} />
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
