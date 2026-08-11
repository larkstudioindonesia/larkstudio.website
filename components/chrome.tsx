'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  EASE,
  Motion,
  SPRING,
  fadeUp,
  maskUp,
  panel,
  scrollToId,
  stagger,
  useCursorLabel,
  useEscape,
  useFirstVisit,
  useFocusTrap,
  useInView,
  usePointer,
  useProgress,
  useScroll,
  useScrollDirection,
  useScrollLock,
  useScrolled,
  useSpring,
  useToggle,
  useTransform,
} from '@/lib/motion';
import { LOCALES, type Locale } from '@/content/types';
import { site, ui } from '@/content/site';
import { LOCALE_LABEL, paths, translatePath, whatsappLink } from '@/lib/site';
import { Container, Figures, Grid, TextLink } from '@/components/ui';

/**
 * LARK STUDIO — THE SHELL
 *
 * Header, navigation, menu, footer, and the four pieces of
 * document-level chrome that render no content at all: the opening
 * sequence, the cursor, the scroll rail and the page transition.
 *
 * They share one rule: EVERY ONE OF THEM MUST BE ABLE TO NOT EXIST. A
 * preloader that blocks content, a cursor that hides the real one, a
 * transition that delays a deep link — each is a way to make a site
 * worse while making it look more considered. Every one is off under
 * reduced motion and every one fails to "nothing".
 */

/* ================================================================== *
 * NAVIGATION
 * ================================================================== */

/**
 * Four items. Global priority: Work → Approach → Studio → Contact.
 *
 * Work first because evidence outranks assertion. Approach second
 * because it carries the differentiating claim and is the page most
 * likely to be sent during fee negotiation. Contact last, because it
 * should be found when wanted, not pushed.
 *
 * There is no /work route: home is the index. With eight projects at
 * full scale, a separate index page exists only to hold eight links.
 *
 * WORK THEREFORE POINTS AT A SECTION, NOT A PAGE. It used to point at
 * `/en` — which, read from the homepage, is a link to the page you are
 * already on, and clicking it did nothing at all. It now targets the
 * portfolio: a real destination from every route, and a scroll rather
 * than a navigation when the reader is already there.
 */
function items(locale: Locale) {
  return [
    { key: 'work', href: `${paths.home(locale)}#work`, target: 'work', label: ui.navWork[locale] },
    { key: 'approach', href: paths.approach(locale), target: null, label: ui.navApproach[locale] },
    { key: 'studio', href: paths.studio(locale), target: null, label: ui.navStudio[locale] },
    { key: 'contact', href: paths.contact(locale), target: null, label: ui.navContact[locale] },
  ] as const;
}

/**
 * Follows a nav item, scrolling instead of navigating when the target
 * section is already in this document.
 *
 * A bare `href="#work"` would work in a plain page and does not here:
 * the browser's own hash jump sets `scrollTop` directly, which Lenis is
 * mid-animation on, and the two fight into a visible snap-back.
 */
function navClick(target: string | null) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === null) return;
    /* Let the browser have modified clicks — open in new tab still works. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (!scrollToId(target)) return;
    event.preventDefault();
    history.replaceState(null, '', `#${target}`);
  };
}

/**
 * EN / ID, mapping to the EQUIVALENT page: switching language on a
 * project page lands on that project in the other language, never on
 * the homepage. This sounds obvious and is broken on most bilingual
 * sites. The choice persists via a cookie that middleware.ts reads when
 * someone arrives at the bare origin.
 */
export function LanguageToggle({
  locale,
  tone = 'default',
}: {
  locale: Locale;
  tone?: 'default' | 'bone';
}) {
  const pathname = usePathname();
  const bone = tone === 'bone';

  /* Read once on mount rather than at render: `location` does not exist
     during prerender, and the hash is not part of the router state, so
     there is nothing to read on the server and nothing to mismatch. */
  const [hash, setHash] = useState('');
  useEffect(() => {
    setHash(window.location.hash);
  }, [pathname]);

  return (
    <div className="flex items-center gap-2 font-text text-label" role="group" aria-label="Language">
      {LOCALES.map((candidate, index) => {
        const current = candidate === locale;
        return (
          <span key={candidate} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className={bone ? 'text-bone-ink-2' : 'text-ink-3'}>
                /
              </span>
            )}
            <Link
              /* The hash comes along: switching language while reading
                 the portfolio should land on the portfolio, not at the
                 top of the other language's homepage. */
              href={`${translatePath(pathname, candidate)}${hash}`}
              hrefLang={candidate}
              lang={candidate}
              aria-current={current ? 'true' : undefined}
              onClick={() => {
                document.cookie = `lark-locale=${candidate}; path=/; max-age=31536000; samesite=lax`;
              }}
              className={`inline-flex min-h-[44px] items-center transition-colors duration-300 ease-expo desktop:min-h-0 ${
                current
                  ? bone
                    ? 'text-bone-ink'
                    : 'text-ink'
                  : bone
                    ? 'text-bone-ink-2 hover:text-bone-ink'
                    : 'text-ink-3 hover:text-ink'
              }`}
            >
              {LOCALE_LABEL[candidate]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Desktop navigation: fully exposed, text only, no hamburger. Hiding
 * four links behind an icon on a 1440px screen is decoration pretending
 * to be minimalism — it costs a click and signals that the site is more
 * interested in itself than in the visitor.
 *
 * The label swaps to a brass dot marker on the current page rather than
 * a sliding indicator: a sliding pill draws the eye to the least
 * important content on any page.
 */
function Navigation({ locale, tone = 'default' }: { locale: Locale; tone?: 'default' | 'bone' }) {
  const pathname = usePathname();
  const bone = tone === 'bone';

  return (
    <nav aria-label="Primary">
      <ul className={bone ? 'flex flex-col gap-3' : 'flex items-center gap-7'}>
        {items(locale).map((item) => {
          /* Compare paths, not hrefs: `/en#work` and `/en` are the same
             document, and the Work item must still read as current on
             the homepage. */
          const current = pathname === item.href.split('#')[0];
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={navClick(item.target)}
                aria-current={current ? 'page' : undefined}
                className={`sweep label inline-flex items-center gap-2 transition-colors duration-300 ease-expo ${
                  bone
                    ? current
                      ? 'text-bone-ink'
                      : 'text-bone-ink-2 hover:text-bone-ink'
                    : current
                      ? 'text-ink'
                      : 'text-ink-2 hover:text-ink'
                }`}
              >
                {current && (
                  <span
                    aria-hidden="true"
                    className="h-[5px] w-[5px] rounded-full bg-brass"
                  />
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ================================================================== *
 * HEADER
 * ================================================================== */

/**
 * A single fixed bar on every route: transparent over the hero,
 * resolving to paper once the page has moved, and retracting entirely
 * while the visitor is scrolling down.
 *
 * One positioning model, one set of rules. The previous revision ran
 * three — a static header off the homepage, two fixed corner badges on
 * it, and a desktop nav in a third layer — which produced navigation
 * that behaved differently depending on where you were, the one thing
 * navigation must never do.
 */
export function Header({ locale }: { locale: Locale }) {
  const scrolled = useScrolled(80);
  const direction = useScrollDirection();
  const menu = useToggle(false);
  const hidden = direction === 'down' && !menu.on;

  return (
    <>
      <Motion.header
        className="no-print fixed inset-x-0 top-0 z-60"
        initial={false}
        animate={{
          y: hidden ? '-105%' : '0%',
          backgroundColor: scrolled && !menu.on ? 'rgba(11,11,12,0.72)' : 'rgba(11,11,12,0)',
        }}
        transition={{ duration: 0.55, ease: EASE.expo }}
        style={{ backdropFilter: scrolled && !menu.on ? 'blur(14px)' : 'none' }}
      >
        {/* The hairline arrives with the surface rather than snapping on
            — a border that appears at full strength is the most common
            tell of a scroll-aware header. */}
        <Motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-line"
          initial={false}
          animate={{ opacity: scrolled && !menu.on ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE.expo }}
        />

        {/*
          THE HEADER'S PART IN THE ENTRANCE.

          The mark at 0.20s, then the navigation staggered from 0.35s, so
          the studio's name arrives before its menu. This is a MOUNT
          animation, which means it plays on a full page load and never on
          a client navigation — the header lives in the layout, outside
          the template that remounts. That is exactly the behaviour we
          want, and it is a property of where the component sits rather
          than of a flag it has to carry.
        */}
        <div className="mx-auto flex w-full max-w-structure items-center justify-between px-5 py-4 tablet:px-7 tablet:py-5 desktop:px-8">
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.2 }}
          >
            <Link
              href={paths.home(locale)}
              className="group inline-flex items-center gap-3"
              aria-label={site.name}
            >
              {/*
                REAL PIXELS, NOT SCALE STEPS. `h-10 w-10` is 128px in
                this project — the spacing scale here is an editorial
                rhythm (`10` = 8rem), not Tailwind's default. The mark
                was being drawn at 128px from a source declared to
                `next/image` as 40px wide, so the header opened on a 3x
                upscale of a 40px thumbnail. Control sizes are written in
                pixels throughout for exactly this reason.

                `unoptimized` because the file is a 1.2kB PNG: running it
                through the image pipeline costs a request and returns
                something no smaller, and the 200px master covers this
                box at 4x.
              */}
              <Image
                src="/logo.png"
                alt=""
                width={200}
                height={200}
                priority
                unoptimized
                className="h-[44px] w-[44px] object-contain transition-transform duration-500 ease-expo group-hover:rotate-[8deg]"
              />
              <span className="hidden font-display text-title leading-none text-ink tablet:block">
                Lark Studio
              </span>
            </Link>
          </Motion.div>

          <Motion.div
            className="hidden items-center gap-8 desktop:flex"
            variants={stagger(0.06, 0.35)}
            initial="hidden"
            animate="visible"
          >
            <Motion.div variants={fadeUp}>
              <Navigation locale={locale} />
            </Motion.div>
            <Motion.span aria-hidden="true" variants={fadeUp} className="h-4 w-px bg-line-strong" />
            <Motion.div variants={fadeUp}>
              <LanguageToggle locale={locale} />
            </Motion.div>
          </Motion.div>

          <Motion.div
            className="desktop:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE.expo, delay: 0.35 }}
          >
            <MenuTrigger open={menu.on} onToggle={menu.toggle} locale={locale} />
          </Motion.div>
        </div>
      </Motion.header>

      <Menu open={menu.on} onClose={menu.off} locale={locale} />
    </>
  );
}

/**
 * The word `Menu`, not an icon — an icon is a small act of ambiguity we
 * can simply refuse. The two labels cross-fade through a mask so the
 * control never shows a word that is half of another word.
 *
 * `initial` is not optional: both labels are absolutely positioned on
 * top of each other, and with `animate` alone neither carries a
 * transform until Framer's first frame, so the server HTML shows "Menu"
 * and "Close" stacked on each other.
 */
function MenuTrigger({
  open,
  onToggle,
  locale,
}: {
  open: boolean;
  onToggle: () => void;
  locale: Locale;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="site-menu"
      className="label relative inline-flex min-h-[44px] items-center overflow-hidden text-ink"
    >
      <span className="invisible" aria-hidden="true">
        {ui.menuClose[locale]}
      </span>
      <Motion.span
        className="absolute inset-0 flex items-center"
        initial={{ y: '0%', opacity: 1 }}
        animate={{ y: open ? '-120%' : '0%', opacity: open ? 0 : 1 }}
        transition={{ duration: 0.45, ease: EASE.expo }}
      >
        {ui.menuOpen[locale]}
      </Motion.span>
      <Motion.span
        className="absolute inset-0 flex items-center"
        initial={{ y: '120%', opacity: 0 }}
        animate={{ y: open ? '0%' : '120%', opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE.expo }}
      >
        {ui.menuClose[locale]}
      </Motion.span>
    </button>
  );
}

/**
 * A full paper surface drawn down over the page by `clip-path`, which
 * reads as deliberate rather than as a drawer and costs one composited
 * property.
 *
 * WHAT IS BEHIND IT: nothing. No blur, no dim, no scale on the page
 * beneath. Background blur is expensive to rasterise, unreliable on
 * mid-range devices, and a distinctly 2020s signature that will date
 * this site faster than any typeface choice.
 *
 * Accessibility, non-negotiable: focus is trapped while open, Escape
 * closes, focus returns to the trigger, body scroll is locked including
 * Lenis, and navigating dismisses it.
 */
function Menu({
  open,
  onClose,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const surface = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useScrollLock(open);
  useFocusTrap(surface, open);
  useEscape(open, onClose);

  /* Close on navigation, keyed on pathname so a link to the current page
     still dismisses. `onClose` is deliberately not a dependency: it is
     stable, and listing it would make this effect re-run on every parent
     render — which, on the render that opens the panel, closes it again
     in the same tick. */
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    close.current();
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          id="site-menu"
          ref={surface}
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="no-print fixed inset-0 z-50 flex flex-col justify-between bg-paper px-5 pb-9 pt-[6.5rem] tablet:px-7"
        >
          <Motion.nav
            aria-label="Primary"
            className="flex flex-1 flex-col justify-center"
            variants={stagger(0.08, 0.14)}
            initial="hidden"
            animate="visible"
          >
            <ul className="flex flex-col gap-1">
              {items(locale).map((item, index) => (
                <li key={item.key} className="mask">
                  <Motion.div variants={maskUp}>
                    <Link
                      href={item.href}
                      /* Close first, scroll after. The panel holds a
                         scroll lock while it is open, so scrolling in
                         the same tick would be swallowed — two frames
                         is the unlock effect's cleanup plus a paint. */
                      onClick={(event) => {
                        const target = item.target;
                        if (target !== null && document.getElementById(target)) {
                          event.preventDefault();
                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              scrollToId(target);
                            });
                          });
                        }
                        onClose();
                      }}
                      aria-current={pathname === item.href.split('#')[0] ? 'page' : undefined}
                      className="group flex items-baseline gap-4 py-1 font-display text-display text-ink transition-opacity duration-300 ease-expo hover:opacity-60"
                    >
                      <span aria-hidden="true" className="figures label text-brass">
                        0{index + 1}
                      </span>
                      {item.label}
                    </Link>
                  </Motion.div>
                </li>
              ))}
            </ul>
          </Motion.nav>

          <Motion.div
            className="flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: EASE.expo, delay: 0.34 }}
          >
            {/* Contact is never more than two taps from anywhere. */}
            <div className="flex flex-col gap-2 font-text text-spec text-ink-2">
              <TextLink href={`mailto:${site.email}`} external>
                {site.email}
              </TextLink>
              <TextLink href={whatsappLink(site.whatsappOpener[locale])} external>
                WhatsApp
              </TextLink>
              <TextLink href={site.instagram.href} external>
                {site.instagram.handle}
              </TextLink>
            </div>
            <LanguageToggle locale={locale} />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== *
 * FOOTER
 * ================================================================== */

/** A live clock in the studio's own timezone. The one element on the
 *  site that proves the page is not a screenshot. */
function StudioClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: site.timeZone,
      }).format(new Date());
    setTime(format());
    const timer = window.setInterval(() => {
      setTime(format());
    }, 30_000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* Renders nothing server-side: a clock in the markup is a hydration
     mismatch waiting to happen, and an empty span is the honest
     placeholder for a value that does not exist yet. */
  return (
    <span className="figures tabular-nums">
      {time ?? '—'}
      <span aria-hidden="true" className="ml-2 inline-block h-[5px] w-[5px] rounded-full bg-brass align-middle" />
    </span>
  );
}

/**
 * THE ONE INVERSE SURFACE ON THE SITE.
 *
 * Ink on paper is inverted here and nowhere else, as a closing gesture.
 * If it appeared in three places it would become a decorative device and
 * the system would lose its single-surface discipline.
 *
 * The wordmark is set at `--text-mega`, runs to the container edge at
 * every width, and drifts horizontally against the scroll as the footer
 * enters. It is the largest single element on the site and the last
 * thing seen — a studio's name at closing scale does the work a
 * paragraph about the studio's ambitions would otherwise be asked to do,
 * and does not have to be translated.
 *
 * Note what is still absent: no newsletter field, no social icons, no
 * sitemap column, no awards row.
 */
export function Footer({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const { ref: markRef, inView } = useInView<HTMLDivElement>();
  const progress = useProgress(ref, ['start end', 'end end']);
  const x = useTransform(progress, [0, 1], ['-4%', '2%']);

  return (
    <footer
      ref={ref}
      className="no-print relative mt-10 overflow-hidden bg-bone pt-9 text-bone-ink tablet:pt-10"
    >
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-4 desktop:col-span-4">
            <p className="label text-bone-ink-2">{ui.localTime[locale]}</p>
            <p className="mt-3 font-display text-title text-bone-ink">
              <StudioClock />
            </p>
            <address className="mt-5 font-text text-spec not-italic text-bone-ink-2">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="col-span-4 mt-9 tablet:col-span-2 tablet:mt-0 desktop:col-span-3 desktop:col-start-6">
            <Navigation locale={locale} tone="bone" />
          </div>

          <div className="col-span-4 mt-7 flex flex-col gap-2 break-words font-text text-spec text-bone-ink-2 tablet:col-span-2 tablet:mt-0 desktop:col-span-3 desktop:col-start-10">
            <TextLink href={`mailto:${site.email}`} external>
              {site.email}
            </TextLink>
            <TextLink href={whatsappLink(site.whatsappOpener[locale])} external>
              WhatsApp
            </TextLink>
            <TextLink href={site.instagram.href} external>
              {site.instagram.handle}
            </TextLink>
            <div className="mt-4">
              <LanguageToggle locale={locale} tone="bone" />
            </div>
          </div>
        </Grid>
      </Container>

      {/* The mega token carries its own tight line-height and negative
          tracking; nothing here overrides them, because the mask's slack
          is calibrated against those values and a local `leading-*`
          clips the caps. */}
      <div ref={markRef} className="mt-11 px-5 tablet:px-7 desktop:px-8">
        <Motion.div style={{ x }}>
          <span className="mask block">
            <Motion.span
              className="block font-display text-mega text-bone-ink"
              variants={maskUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              Lark Studio
            </Motion.span>
          </span>
        </Motion.div>
      </div>

      <Container>
        <div className="mt-6 flex items-baseline justify-between gap-5 border-t border-bone-line py-5 font-text text-caption text-bone-ink-2">
          <p className="figures">
            © <Figures>{new Date().getFullYear()}</Figures> {site.name}
          </p>
          <p className="figures">
            {site.address[1]} · <Figures>{site.founded}</Figures>
          </p>
        </div>
      </Container>
    </footer>
  );
}

/* ================================================================== *
 * DOCUMENT CHROME
 * ================================================================== */

/**
 * The curtain. Shown once per browsing session, on first arrival only.
 *
 * WHAT IT IS NOT: a loading screen. It does not wait on the network, it
 * does not gate hydration, and it does not measure anything. The page is
 * fully rendered behind it the entire time, and the counter is honest
 * about being a timer — it is a framing device that lifts after 1.6s.
 *
 * WHY IT IS SAFE: it is `position: fixed` over an already-complete
 * document, so it cannot delay paint of the content beneath, and it is
 * skipped on every subsequent navigation, on reduced motion, and if
 * storage is unavailable. The failure mode in every direction is "no
 * preloader", which is the correct one.
 */
export function Preloader() {
  const first = useFirstVisit();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useScrollLock(first && !done);

  useEffect(() => {
    if (!first) return;
    const start = performance.now();
    const span = 1400;
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / span);
      /* Eased, so the count decelerates into 100 rather than arriving
         at a constant rate — a linear counter reads as a progress bar
         lying about what it measures. */
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    const timer = window.setTimeout(() => {
      setDone(true);
    }, 1600);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [first]);

  return (
    <AnimatePresence>
      {first && !done && (
        <Motion.div
          aria-hidden="true"
          className="no-print fixed inset-0 z-90 flex flex-col justify-between bg-paper px-5 pb-8 pt-8 tablet:px-7"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE.expo }}
        >
          {/* Two panels lifting in sequence, so the reveal reads as a
              curtain opening rather than as a fade. */}
          <Motion.span
            className="absolute inset-x-0 top-0 z-10 h-1/2 origin-top bg-paper"
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: EASE.quart }}
          />
          <Motion.span
            className="absolute inset-x-0 bottom-0 z-10 h-1/2 origin-bottom bg-paper"
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: EASE.quart, delay: 0.06 }}
          />

          <Motion.p
            className="label relative z-20 text-ink-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.expo }}
          >
            {site.name} — {site.address[1]}
          </Motion.p>

          <div className="relative z-20 flex items-end justify-between gap-5">
            <span className="mask">
              <Motion.span
                className="block font-display text-display text-ink"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: EASE.expo, delay: 0.1 }}
              >
                Turning vision into shape
              </Motion.span>
            </span>
            <span className="figures shrink-0 font-text text-label text-ink-2">
              {String(count).padStart(3, '0')}
            </span>
          </div>

          <Motion.span
            className="relative z-20 mt-5 h-px w-full origin-left bg-line-strong"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: EASE.quart }}
          />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * A ring that follows the pointer, swells over interactive targets and
 * carries a word when a component asks it to.
 *
 * THE NATIVE CURSOR IS NEVER HIDDEN. Almost every implementation of this
 * effect sets `cursor: none`, and every one of them is an accessibility
 * regression: the visitor loses the one piece of interface guaranteed to
 * be legible to them and gains a div that lags by a frame. This ring is
 * additive, and if it fails to render nothing is lost.
 *
 * It listens to nothing itself: position comes from the single document
 * `pointermove` listener, hover state from one delegated `pointerover`,
 * and the label from a module-level store.
 */
export function Cursor() {
  const { x, y, active } = usePointer();
  const label = useCursorLabel();
  const [hovering, setHovering] = useState(false);

  const springX = useSpring(x, SPRING.pointer);
  const springY = useSpring(y, SPRING.pointer);

  useEffect(() => {
    const interactive = 'a[href], button, [role="button"], input, textarea, select';
    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      setHovering(target !== null && target.closest(interactive) !== null);
    };
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      document.removeEventListener('pointerover', onOver);
    };
  }, []);

  const size = label !== null ? 92 : hovering ? 48 : 16;

  return (
    <Motion.div
      aria-hidden="true"
      className="cursor no-print pointer-events-none fixed left-0 top-0 z-80 hidden desktop:block"
      style={{ x: springX, y: springY }}
    >
      <Motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/60"
        animate={{
          width: size,
          height: size,
          opacity: active ? 1 : 0,
          backgroundColor:
            label !== null ? 'rgba(200,160,106,0.92)' : 'rgba(244,242,237,0)',
          borderColor:
            label !== null ? 'rgba(200,160,106,0)' : 'rgba(244,242,237,0.5)',
        }}
        transition={{ duration: 0.4, ease: EASE.expo }}
      >
        <AnimatePresence>
          {label !== null && (
            <Motion.span
              className="label text-paper"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: EASE.expo }}
            >
              {label}
            </Motion.span>
          )}
        </AnimatePresence>
      </Motion.div>
    </Motion.div>
  );
}

/**
 * A hairline at the top of the viewport tracking document progress. One
 * pixel tall, and it does not appear until the page has actually been
 * scrolled — so it reads as a response to the visitor rather than as an
 * ornament waiting for them.
 */
export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING.rail);
  const opacity = useTransform(scrollYProgress, [0, 0.01, 0.99, 1], [0, 1, 1, 0]);

  return (
    <Motion.div
      aria-hidden="true"
      className="no-print fixed inset-x-0 top-0 z-70 h-px origin-left bg-brass"
      style={{ scaleX, opacity }}
    />
  );
}

/**
 * Page transition, entry only, keyed on the pathname by the template
 * that remounts it.
 *
 * App Router does not reliably keep the outgoing page mounted long
 * enough for an exit animation, and every workaround costs a frozen
 * frame of the old page — worse than no exit at all. So the arrival
 * carries the whole gesture: a paper panel already covering the viewport
 * lifts away while the content rises under it.
 *
 * Deliberately NOT a shared-element transition, despite that being the
 * obvious choice for a portfolio: most arrivals are deep links with no
 * origin element, the art-directed portrait crops share no continuous
 * geometry with the landscape frames, and a transition that stutters on
 * a mid-range Android destroys more precision than a perfect one
 * creates.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="no-print animate-curtain pointer-events-none fixed inset-0 z-90 origin-top bg-paper"
      />
      <div className="animate-arrive">{children}</div>
    </>
  );
}
