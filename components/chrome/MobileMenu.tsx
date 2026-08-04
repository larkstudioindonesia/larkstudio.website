'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, Motion, panelSurface } from '@/lib/motion';
import type { Locale } from '@/content/types';
import { ui } from '@/content/ui';
import { Navigation } from '@/components/chrome/Navigation';
import { LanguageToggle } from '@/components/chrome/LanguageToggle';
import { InlineLink } from '@/components/primitives/InlineLink';

/**
 * Behaviour 6 of the motion budget — 240ms in, 180ms out.
 *
 * A menu panel is justified on mobile because the constraint is real
 * rather than aesthetic. The trigger is the WORD `Menu`, not an icon:
 * an icon is a small act of ambiguity we can simply refuse.
 *
 * The panel translates from the top as a full paper surface — which is
 * why it is exempt from the 16px travel budget: it is not travelling
 * within the page, it is a surface arriving over it. Behind it,
 * nothing. No blur, no dim, no scale on the page beneath. Background
 * blur is expensive to render, unreliable on mid-range devices, and a
 * distinctly 2020s signature.
 *
 * Contents are present on arrival. Items do NOT stagger in.
 *
 * The trigger is always a normal, non-fixed flex child of whatever
 * contains it — on Home that container is Header's `absolute`
 * nav/toggle/Menu layer, which scrolls away with the page on its own;
 * this component does not need to know which route it is on.
 */
export function MobileMenu({
  locale,
  email,
  whatsappHref,
  instagramHref,
}: {
  locale: Locale;
  email: string;
  whatsappHref: string;
  instagramHref: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /* Close on navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Escape closes; focus is trapped while open and returned on close. */
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <div className="desktop:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex min-h-[44px] items-center font-grotesque text-nav text-ink"
      >
        {/* The label changes instantly at Tier 0. A label that fades
            between two words is briefly illegible. */}
        {open ? ui.menuClose[locale] : ui.menuOpen[locale]}
      </button>

      <AnimatePresence>
        {open && (
          <Motion.div
            id="mobile-menu"
            ref={panelRef}
            variants={panelSurface}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex flex-col justify-between bg-paper px-5 pb-9 pt-5"
          >
            <div className="flex items-start">
              <span className="font-grotesque text-nav font-medium">
                Lark Studio
              </span>
            </div>

            <div className="flex flex-col gap-7">
              <Navigation locale={locale} orientation="vertical" />

              {/* Contact is never more than two taps from anywhere. */}
              <div className="flex flex-col gap-3 font-grotesque text-spec">
                <InlineLink href={`mailto:${email}`} external>
                  {email}
                </InlineLink>
                <InlineLink href={whatsappHref} external>
                  WhatsApp
                </InlineLink>
                <InlineLink href={instagramHref} external>
                  Instagram
                </InlineLink>
              </div>

              <LanguageToggle locale={locale} />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
