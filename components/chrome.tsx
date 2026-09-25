'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
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
  useFocusTrap,
  useHeaderHeld,
  useInView,
  usePointer,
  useProgress,
  useReducedMotion,
  useScroll,
  useScrollDirection,
  useScrollHold,
  useScrollLock,
  useScrolled,
  useSpring,
  useActTwo,
  useIntro,
  useToggle,
  useTransform,
  turn,
} from '@/lib/motion';
import { LOCALES, type Locale, type Photograph } from '@/content/types';
import { ARCHIVE, framePhotograph } from '@/content/projects';
import { directions, site, ui } from '@/content/site';
import { LOCALE_LABEL, paths, translatePath, whatsappLink } from '@/lib/site';
import { Arrow, Container, Figures, Grid, Print, TextLink, printAspect } from '@/components/ui';

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
  /* ACT II GATE. The header does not animate late — it does not animate
     at all until the overture has fully left the stage. */
  const act2 = useActTwo();
  const scrolled = useScrolled(80);
  const direction = useScrollDirection();
  const menu = useToggle(false);
  const held = useHeaderHeld();
  const hidden = (direction === 'down' || held) && !menu.on;

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
            animate={act2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.15 }}
          >
            <Link
              href={paths.home(locale)}
              /* No `gap` any more: the wordmark that sat beside the mark
                 is gone, and a gap on a single-child flex row leaves the
                 logo sitting off its own left edge — the "empty text gap"
                 the brief warns about. The accessible name moves entirely
                 onto `aria-label`, because the mark's `alt` is empty. */
              className="group -m-1 inline-flex items-center p-1"
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
                className="h-[42px] w-[42px] object-contain transition-transform duration-500 ease-expo group-hover:rotate-[8deg] tablet:h-[46px] tablet:w-[46px]"
              />
            </Link>
          </Motion.div>

          {/* `stage` parks the nav stagger until the overture's aperture
              is open — otherwise it plays out behind the overlay and the
              visitor arrives on a header that has already finished. */}
          <Motion.div
            className="hidden items-center gap-8 desktop:flex"
            variants={stagger(0.08, 0.3)}
            initial="hidden"
            animate={act2 ? 'visible' : 'hidden'}
          >
            <Motion.div variants={fadeUp}>
              <AnnouncementEntry locale={locale} />
            </Motion.div>
            <Motion.div variants={fadeUp}>
              <Navigation locale={locale} />
            </Motion.div>
            <Motion.span aria-hidden="true" variants={fadeUp} className="h-4 w-px bg-line-strong" />
            <Motion.div variants={fadeUp}>
              <LanguageToggle locale={locale} />
            </Motion.div>
          </Motion.div>

          {/* Gated like the rest of the bar. It used to run on its own
              clock and finish behind the overture on every phone. */}
          <Motion.div
            className="desktop:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: act2 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE.expo, delay: 0.35 }}
          >
            <div className="flex items-center gap-5">
              <AnnouncementEntry locale={locale} />
              <MenuTrigger open={menu.on} onToggle={menu.toggle} locale={locale} />
            </div>
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
/** Split once at module scope — the closing wordmark is a constant, and
 *  re-splitting it on every footer render allocates for nothing. */
const CLOSING_MARK = 'Lark Studio'.split('');

export function Footer({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const { ref: markRef, inView } = useInView<HTMLDivElement>();
  const progress = useProgress(ref, ['start end', 'end end']);
  /**
   * THE CLOSING FRAME IS BOUND TO SCROLL, not fired once on entry.
   *
   * Three values, all driven by the footer's own pass through the
   * viewport, all resolving together at progress 1 — which is the moment
   * the page bottoms out. The wordmark is therefore still composing for
   * as long as the reader is still arriving, and reaches its final
   * state exactly when they stop. That is the difference between a
   * closing frame and an animation that happened to finish early.
   */
  const markX = useTransform(progress, [0, 1], ['-7%', '0%']);
  const markTrack = useTransform(progress, [0.1, 0.95], ['0.14em', '-0.03em']);
  const markScale = useTransform(progress, [0.1, 0.95], [1.05, 1]);
  /* THE MASK IS SCRUBBED BY SCROLL. The wordmark is not revealed by a
     trigger firing once — it is uncovered from the bottom up in direct
     proportion to how far the reader has come, so the last letters clear
     their mask exactly as the page bottoms out. */
  const markClip = useTransform(
    progress,
    [0.05, 0.8],
    ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  );
  /* Read AFTER mount. The server cannot know the preference and renders
     the scroll-linked styles; a first client render that already knew
     would drop them, and hydration would not match. One effect later the
     reduced-motion branch applies. */
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const reduced = mounted && prefersReduced === true;

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

      {/*
        THE CLOSING FRAME.

        The whole bottom of the site is composed around this wordmark
        now, rather than the wordmark being dropped under the footer
        columns. Three things changed and all three are visible:

        1. IT HAS ROOM. The block sits in its own full-width band with
           deep air above and below (mt-12 / pb-10), so the name is not
           competing with the address and the nav list for the same
           screen. Whitespace is the art direction here — §19.
        2. IT IS SCROLL-DRIVEN, NOT ONE-SHOT. Tracking, scale and the
           horizontal drift are all bound to the footer's own scroll
           progress, so the wordmark keeps resolving for as long as the
           reader keeps coming. It reaches its final composition exactly
           as the footer bottoms out — the last frame of the film,
           arrived at rather than triggered.
        3. THE LETTERS ARE CUT IN INDIVIDUALLY, each from behind its own
           mask on a 55ms stagger, with a rule that draws itself across
           the full measure underneath once the last letter has landed.

        The mega token carries its own tight line-height; nothing here
        overrides it, because the mask's slack is calibrated against it
        and a local `leading-*` clips the caps. `whitespace-nowrap` is
        load-bearing: per-letter `inline-block` spans give the line a
        break opportunity between EVERY letter, and without it the
        statement renders as "Lark Stu / dio".

        REDUCED MOTION gets the finished composition — final tracking,
        final scale, letters up, rule drawn. It lands; it does not
        perform.
      */}
      <div ref={markRef} className="mt-12 overflow-hidden px-5 pb-4 tablet:px-7 desktop:px-8">
        <Motion.div style={{ x: markX }}>
          <Motion.span
            className="mask block whitespace-nowrap font-display text-mega leading-none text-bone-ink"
            /* Spread rather than a conditional `style` prop:
               `exactOptionalPropertyTypes` rejects an explicit
               `undefined` where the prop is merely optional. */
            {...(reduced
              ? {}
              : {
                  style: {
                    letterSpacing: markTrack,
                    scale: markScale,
                    clipPath: markClip,
                    transformOrigin: 'left bottom',
                  },
                })}
          >
            {CLOSING_MARK.map((char, i) =>
              char === ' ' ? (
                <span key={i}>&nbsp;</span>
              ) : (
                <Motion.span
                  key={i}
                  className="inline-block will-change-transform"
                  initial={reduced ? false : { y: '118%' }}
                  animate={inView ? { y: '0%' } : { y: '118%' }}
                  transition={{ duration: 1.25, ease: EASE.expo, delay: i * 0.055 }}
                >
                  {char}
                </Motion.span>
              ),
            )}
          </Motion.span>
        </Motion.div>

        {/* The rule closes the frame, drawn left to right after the last
            letter is up. */}
        <Motion.span
          aria-hidden="true"
          className="mt-7 block h-px w-full origin-left bg-bone-line"
          initial={reduced ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.6, ease: EASE.quart, delay: 0.85 }}
        />
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

/* ------------------------------------------------------------------ *
 * THE OVERTURE — the studio's album, opened
 * ------------------------------------------------------------------ */

/**
 * A PHYSICAL ALBUM, OPENED IN FRONT OF THE VISITOR.
 *
 * The previous revision laid prints on a dark field, which read as
 * "photos on a canvas". This one is an OBJECT: a cloth-bound portfolio
 * lying on a dark studio table, lit from the upper left, that opens.
 *
 *   0.2  the closed album comes to rest on the table — charcoal cloth,
 *        a blind-embossed rule, the monogram and the name foil-stamped
 *        in the studio's brass. Page edges show at the fore-edge and
 *        foot, so it has thickness.
 *   1.5  the cover swings open on its spine: `rotateY` about the left
 *        edge, under a modest perspective, while the album slides left
 *        so the opened spread ends up centred. As the board turns, its
 *        outside falls into shadow and its inside comes up into the
 *        light; the shadow the board casts across the first page lifts
 *        away. Front and back are two faces of one board, so the inside
 *        of the cover BECOMES the left page — the viewer sees one object
 *        open, not a card flip.
 *   3.4  prints are laid onto the warm paper one at a time — the lead
 *        first — each arriving a few pixels high and a degree turned,
 *        then settling with its shadow.
 *   4.9  only once the spread is composed does the name appear, set on
 *        the title page like a book's half-title: left-aligned, a rule,
 *        the disciplines, the place. Folios and a caption finish it.
 *   7.6  the album is set down and the site is there.
 *
 * A PHONE GETS A PAGE, NOT A SHRUNK SPREAD. The album is a single
 * portrait page; the cover swings open toward the viewer and away, and
 * the page beneath holds a lead print, two smaller prints and the name.
 * Portrait tablets take the same composition, larger.
 *
 * EVERY PHOTOGRAPH IS WHOLE — `Print`, at its own ratio. The album is
 * sized to the small viewport (`svh`) and the safe areas, and every
 * position inside it is a percentage of the album, so the whole object
 * scales as one: when a screen is small, the album is smaller; nothing
 * is ever cropped to fit.
 *
 * 3D IS HELD TO ONE HINGE. A single board rotates about a single edge
 * under a 2600px perspective — no camera move, no page curl, no spin.
 *
 * ESCAPE HATCH: any key, click, touch or wheel skips to the end.
 */
type Placement = {
  /** Left, top, width — % of the PAGE the print is on. */
  at: readonly [number, number, number];
  rotate: number;
  cue: number;
};

type AlbumPrint = { photo: Photograph; place: Placement; page: 'left' | 'right' };

/** The spread: three prints on the first page, two on the inside of the
 *  cover above the name. Heights follow each photograph's own ratio (a
 *  3:2 print is 0.52w tall on a 3:4 page, a 16:9 one 0.44w). */
function spreadPrints(): readonly AlbumPrint[] {
  const f = framePhotograph;
  return [
    { page: 'right', photo: f('mr-yp-house-01'), place: { at: [13, 9, 74], rotate: -0.4, cue: 3.4 } },
    { page: 'right', photo: f('waroeng-andalan-s01'), place: { at: [9, 59, 40], rotate: 1.1, cue: 3.75 } },
    { page: 'right', photo: ARCHIVE.sanza24, place: { at: [51, 62, 41], rotate: -0.9, cue: 4.05 } },
    { page: 'left', photo: ARCHIVE.th19, place: { at: [11, 9, 56], rotate: 0.7, cue: 4.35 } },
    { page: 'left', photo: f('amadya-02'), place: { at: [55, 27, 31], rotate: -1.4, cue: 4.6 } },
  ];
}

/** The page: a lead print across the top, two beneath it, the name at
 *  the foot. Heights on a 0.68 page: 3:2 is 0.47w, 16:9 is 0.40w — so
 *  the lower pair ends by 68% and the title block, from about 72%, has
 *  the foot of the page to itself. */
function pagePrints(): readonly AlbumPrint[] {
  const f = framePhotograph;
  return [
    { page: 'right', photo: f('mr-yp-house-01'), place: { at: [8, 7, 84], rotate: -0.5, cue: 2.8 } },
    { page: 'right', photo: ARCHIVE.sanza24, place: { at: [45, 50, 46], rotate: 1.2, cue: 3.15 } },
    { page: 'right', photo: f('waroeng-andalan-s01'), place: { at: [8, 52.5, 34], rotate: -1.3, cue: 3.45 } },
  ];
}

const OVERTURE = {
  /** The longest a print waits for its image before landing anyway. */
  patience: 1.2,
  /** The album is set down (spread / page). */
  end: 7.6,
  endPage: 7.0,
} as const;

/** The name and its furniture, per composition. */
const TITLE_CUES = {
  spread: { letters: 4.95, rule: 5.5, lines: 5.7, folio: 5.9 },
  page: { letters: 3.9, rule: 4.45, lines: 4.65, folio: 4.85 },
} as const;

/** The album's paper and cloth. A static SVG grain, blended multiply so
 *  it darkens the fibres of the paper rather than greying it. */
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E\")";

/**
 * True once `at` seconds have passed since `start`. The sequence runs on
 * timers against ONE start time, so cues cannot compound; each costs one
 * timer and one render, never a render per frame.
 */
function useCue(start: number | null, at: number): boolean {
  const [due, setDue] = useState(false);
  useEffect(() => {
    if (start === null) return;
    const timer = window.setTimeout(
      () => {
        setDue(true);
      },
      Math.max(0, start + at * 1000 - performance.now()),
    );
    return () => {
      window.clearTimeout(timer);
    };
  }, [start, at]);
  return due;
}

/** True once this layer's photograph is decoded — `decode()`, so a print
 *  is never painted mid-decode on the frame it lands. */
function useDecodedLayer(scope: RefObject<HTMLElement | null>): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => {
      if (live) setReady(true);
    };
    const img = scope.current?.querySelector('img');
    if (img) img.decode().then(done, done);
    else done();
    return () => {
      live = false;
    };
  }, [scope]);
  return ready;
}

/**
 * A print laid onto the page with weight: it arrives a few pixels high,
 * a degree further turned and a touch large, then settles — and its
 * shadow comes up as it lands. Never a fade alone.
 */
function LaidPrint({
  item,
  start,
  locale,
  share,
}: {
  item: AlbumPrint;
  start: number | null;
  locale: Locale;
  /** The page's width as a share of the viewport, for `sizes`. */
  share: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const decoded = useDecodedLayer(ref);
  const cue = useCue(start, item.place.cue);
  const late = useCue(start, item.place.cue + OVERTURE.patience);
  const play = cue && (decoded || late);
  const [x, y, w] = item.place.at;
  const turn = item.place.rotate < 0 ? -1.6 : 1.6;
  const from = { opacity: 0, y: -14, rotate: turn, scale: 1.03 };

  return (
    <Motion.div
      ref={ref}
      className="absolute"
      style={{ left: `${String(x)}%`, top: `${String(y)}%`, width: `${String(w)}%` }}
      initial={from}
      animate={play ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : from}
      transition={{
        opacity: { duration: 0.45, ease: EASE.expo },
        default: { duration: 1.05, ease: EASE.expo },
      }}
    >
      <Print
        photo={item.photo}
        locale={locale}
        sizes={`${String(Math.ceil((w / 100) * share))}vw`}
        eager
        rotate={item.place.rotate}
      />
    </Motion.div>
  );
}

/** Warm album paper: tone, grain, and the fall-off into the gutter. */
function Paper({ gutter }: { gutter: 'left' | 'right' | 'none' }) {
  return (
    <>
      <div className="absolute inset-0 bg-album" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />
      {/* Light from the upper left, falling off across the page. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_10%,rgba(255,252,245,0.35),rgba(255,252,245,0)_55%,rgba(40,34,26,0.10))]"
      />
      {gutter !== 'none' && (
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 w-[9%] ${
            gutter === 'left'
              ? 'left-0 bg-[linear-gradient(to_right,rgba(30,26,20,0.30),rgba(30,26,20,0.08)_40%,rgba(30,26,20,0))]'
              : 'right-0 bg-[linear-gradient(to_left,rgba(30,26,20,0.30),rgba(30,26,20,0.08)_40%,rgba(30,26,20,0))]'
          }`}
        />
      )}
    </>
  );
}

/** Page thickness: the edges of the leaves beneath, stepped out at the
 *  fore-edge and the foot. Three hairlines of warm grey — no more. */
function PageBlock({ side }: { side: 'left' | 'right' }) {
  return (
    <>
      {[3, 2, 1].map((n) => (
        <div
          key={n}
          aria-hidden="true"
          className="absolute inset-0 bg-album-edge"
          style={{
            transform: `translate(${String(side === 'right' ? n * 1.5 : -n * 1.5)}px, ${String(n * 1.5)}px)`,
            filter: `brightness(${String(1 - n * 0.07)})`,
          }}
        />
      ))}
    </>
  );
}

/** The outside of the cover: charcoal cloth, a blind-embossed frame, the
 *  monogram and the name stamped in brass. */
function CoverFront({ spread }: { spread: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-cloth">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 mix-blend-soft-light"
        style={{ backgroundImage: PAPER_GRAIN }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(110%_80%_at_22%_12%,rgba(255,244,225,0.07),rgba(0,0,0,0)_55%,rgba(0,0,0,0.25))]"
      />
      {/* The spine hinge: a soft crease a few percent in from the edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[4%] w-[2.5%] bg-[linear-gradient(to_right,rgba(0,0,0,0.35),rgba(255,255,255,0.04),rgba(0,0,0,0.18))]"
      />
      {/* Blind emboss: a frame pressed into the board — a dark line with a
          light one a pixel below it. */}
      <div
        aria-hidden="true"
        className="absolute inset-[7%] left-[11%] border border-black/40 shadow-[0_1px_0_rgba(255,244,225,0.06)]"
      />
      <div className="absolute inset-x-[11%] top-[36%] flex flex-col items-center">
        <Image
          src="/logo.png"
          alt=""
          width={200}
          height={200}
          unoptimized
          className={`object-contain opacity-80 ${spread ? 'h-[5.5cqw] w-[5.5cqw]' : 'h-[11cqw] w-[11cqw]'}`}
        />
      </div>
      <p
        className={`absolute inset-x-[11%] bottom-[14%] text-center font-display font-medium uppercase tracking-[0.3em] text-brass [text-shadow:0_1px_0_rgba(0,0,0,0.5)] ${
          spread ? 'text-[1.5cqw]' : 'text-[4cqw]'
        }`}
      >
        Lark Studio
      </p>
    </div>
  );
}

/**
 * The name, set on the title page like a book's half-title: left-aligned
 * on the page's margin, a rule, the disciplines, the place. The letters
 * come up in reading order, a few at a time — type being set, not a
 * logo sting.
 */
function TitlePage({ spread, locale }: { spread: boolean; locale: Locale }) {
  const cue = spread ? TITLE_CUES.spread : TITLE_CUES.page;
  const letters = 'LARK STUDIO'.split('');
  return (
    <div className={`absolute left-[11%] ${spread ? 'bottom-[11%] right-[11%]' : 'bottom-[7%] right-[8%]'}`}>
      <p
        className={`whitespace-nowrap font-display font-medium leading-[0.95] tracking-[0.04em] text-album-ink ${
          spread ? 'text-[5.4cqw]' : 'text-[11cqw]'
        }`}
      >
        {letters.map((c, i) => (
          <Motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: '0.35em' }}
            animate={{ opacity: 1, y: '0em' }}
            transition={{ duration: 1.1, ease: EASE.expo, delay: cue.letters + i * 0.055 }}
          >
            {c === ' ' ? ' ' : c}
          </Motion.span>
        ))}
      </p>
      <Motion.span
        aria-hidden="true"
        className={`block h-px origin-left bg-album-ink/40 ${spread ? 'mt-[1.6cqw] w-[46%]' : 'mt-[4cqw] w-[40%]'}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE.quart, delay: cue.rule }}
      />
      <Motion.div
        /* Line height as a ratio, not the body's fixed 1.75rem: every
           size on the title page scales with the album, so a small phone
           gets a small title block rather than one pushed up the page. */
        className={`font-text uppercase leading-[1.5] tracking-[0.2em] text-album-ink-2 ${
          spread ? 'mt-[1.4cqw] space-y-[0.5cqw] text-[0.95cqw]' : 'mt-[3.4cqw] space-y-[1.2cqw] text-[2.6cqw]'
        }`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE.expo, delay: cue.lines }}
      >
        <p>{locale === 'id' ? 'Arsitektur · Interior · Lanskap' : 'Architecture · Interiors · Landscape'}</p>
        <p className="figures">
          {site.address[1].split(' ')[0]} — <Figures>{site.founded}</Figures>
        </p>
      </Motion.div>
    </div>
  );
}

/** A folio or caption in the album's small type. */
function Small({
  className,
  cue,
  children,
}: {
  className: string;
  cue: number;
  children: ReactNode;
}) {
  return (
    <Motion.p
      className={`absolute font-text uppercase leading-[1.5] tracking-[0.18em] text-album-ink-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE.expo, delay: cue }}
    >
      {children}
    </Motion.p>
  );
}

function Overture({ onFinish }: { onFinish: () => void }) {
  const finish = useRef(onFinish);
  finish.current = onFinish;
  const [locale, setLocale] = useState<Locale>('en');

  /** Performance-clock time the sequence started, once it has. */
  const [start, setStart] = useState<number | null>(null);
  /** Spread (landscape) or page (portrait) — chosen ONCE, at the start. */
  const [spread, setSpread] = useState(true);

  useEffect(() => {
    if (document.documentElement.getAttribute('data-intro') !== 'play') return;
    window.scrollTo(0, 0);
    setLocale(document.documentElement.lang === 'id' ? 'id' : 'en');
    setSpread(window.innerWidth >= 640 && window.innerWidth / window.innerHeight >= 1);
    setStart(performance.now());
  }, []);

  /* END: on the clock, or the moment the visitor asks to be let in. */
  useEffect(() => {
    if (document.documentElement.getAttribute('data-intro') !== 'play') return;
    const skip = () => {
      finish.current();
    };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, []);

  useEffect(() => {
    if (start === null) return;
    const timer = window.setTimeout(
      () => {
        finish.current();
      },
      Math.max(0, start + (spread ? OVERTURE.end : OVERTURE.endPage) * 1000 - performance.now()),
    );
    return () => {
      window.clearTimeout(timer);
    };
  }, [start, spread]);

  const prints = start === null ? [] : spread ? spreadPrints() : pagePrints();
  /* One page's width as a share of the viewport, for image `sizes`. */
  const share = spread ? 44 : 86;
  const hinge = { duration: spread ? 1.8 : 1.6, ease: EASE.page, delay: spread ? 1.5 : 1.35 };
  const tone = spread ? TITLE_CUES.spread : TITLE_CUES.page;

  return (
    <Motion.div
      data-overture=""
      aria-hidden="true"
      className="no-print fixed inset-0 z-90 overflow-hidden bg-paper"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE.quart }}
    >
      {/* THE TABLE: the site's near-black, with one soft pool of light from
          the upper left for the album to sit in. */}
      <Motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_42%_40%,rgba(64,56,44,0.55),rgba(11,11,12,0)_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE.expo }}
      />

      {start !== null && (
        <div className="absolute inset-0 flex items-center justify-center px-[max(1rem,env(safe-area-inset-left))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
          {/*
            THE ALBUM — one box everything is placed in, and the size
            container its type is set in.

              spread  3:2 open (two 3:4 boards), up to 80vw, as tall as the
                      small viewport less 10rem allows, capped at 1400px —
                      enough table left around it to read as an object
              page    0.68:1, up to 84vw, as tall as the small viewport
                      less 5rem allows, capped at 620px

            Closed, the spread's cover sits over the RIGHT page, so the
            album starts shifted a quarter left — centred as a closed book
            — and slides to centre as it opens.
          */}
          <Motion.div
            className={`relative [container-type:inline-size] ${
              spread
                ? 'aspect-[3/2] w-[min(80vw,calc((100svh-10rem)*1.5),1400px)]'
                : 'aspect-[0.68] w-[min(84vw,calc((100svh-5rem)*0.68),620px)]'
            }`}
            style={{ perspective: 2600 }}
            initial={{ opacity: 0, y: 26, x: spread ? '-25%' : '0%' }}
            animate={{ opacity: 1, y: 0, x: '0%' }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{
              opacity: { duration: 1.0, ease: EASE.expo, delay: 0.2 },
              y: { duration: 1.2, ease: EASE.expo, delay: 0.2 },
              x: hinge,
              default: { duration: 0.9, ease: EASE.quart },
            }}
          >
            {/* The album's shadow on the table — static, soft, beneath
                the half that is always there. */}
            <div
              aria-hidden="true"
              className={`absolute inset-y-0 right-0 shadow-[0_40px_70px_-30px_rgba(0,0,0,0.9),0_8px_20px_-8px_rgba(0,0,0,0.6)] ${
                spread ? 'w-1/2' : 'w-full'
              }`}
            />

            {/* THE BACK BOARD, and on it the first page. A hardcover's
                boards are a little larger than its leaves, so a rim of
                cloth frames the paper at head, foot and fore-edge — the
                detail that makes it a bound book rather than a printout. */}
            <div className={`absolute inset-y-0 right-0 ${spread ? 'w-1/2' : 'w-full'}`}>
              <div aria-hidden="true" className="absolute inset-0 bg-cloth" />
              <div className="absolute inset-y-[1.8%] left-0 right-[2.4%]">
              <PageBlock side="right" />
              <div className="absolute inset-0 overflow-hidden">
                <Paper gutter={spread ? 'left' : 'none'} />
                {prints
                  .filter((item) => item.page === 'right')
                  .map((item) => (
                    <LaidPrint key={item.photo.src} item={item} start={start} locale={locale} share={share} />
                  ))}
                {spread ? (
                  <>
                    <Small className="left-[13%] top-[48.5%] text-[0.62cqw]" cue={tone.folio}>
                      Mr. YP House — Tangerang
                    </Small>
                    <Small className="bottom-[4.5%] right-[9%] text-[0.62cqw]" cue={tone.folio}>
                      02
                    </Small>
                  </>
                ) : (
                  <>
                    <Small className="left-[8%] top-[47.5%] text-[1.8cqw]" cue={tone.folio}>
                      Mr. YP House — Tangerang
                    </Small>
                    <TitlePage spread={false} locale={locale} />
                  </>
                )}
              </div>
              {/* The shadow the closed cover casts across the first page,
                  lifting away as the board rises. */}
              <Motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,16,12,0.55),rgba(20,16,12,0.15)_45%,rgba(20,16,12,0))]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ ...hinge, duration: hinge.duration * 0.75 }}
              />
              </div>
            </div>

            {/*
              THE COVER — one board, two faces, one hinge. It turns about
              its spine edge; on the spread its inside lands as the left
              page, on a phone it swings open past the viewer and away.
            */}
            <Motion.div
              className={`absolute inset-y-0 right-0 origin-left [transform-style:preserve-3d] ${
                spread ? 'w-1/2' : 'w-full'
              }`}
              initial={{ rotateY: 0 }}
              /* On a phone there is no inside face: once the board is past
                 edge-on its outside is turned away (`backface-visibility`)
                 and it is simply gone — as a real cover leaves the frame
                 when you open a book held close. */
              animate={{ rotateY: -180 }}
              transition={hinge}
            >
              {/* Outside. It falls into shadow as it turns away from the
                  light. */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <PageBlock side="right" />
                <CoverFront spread={spread} />
                <Motion.div
                  aria-hidden="true"
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ ...hinge, duration: hinge.duration / 2, ease: EASE.quart }}
                />
              </div>

              {/* Inside — the spread's left page, including its prints and
                  the name. It comes up out of shadow as it lands. */}
              {spread && (
                <div className="absolute inset-0 overflow-hidden bg-cloth [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {/* The inside of the board: cloth turned over at the
                      edges, the endpaper pasted down within them. */}
                  <div className="absolute inset-y-[1.8%] left-[2.4%] right-0 overflow-hidden">
                  <Paper gutter="right" />
                  {prints
                    .filter((item) => item.page === 'left')
                    .map((item) => (
                      <LaidPrint key={item.photo.src} item={item} start={start} locale={locale} share={share} />
                    ))}
                  <TitlePage spread locale={locale} />
                  <Small className="bottom-[4.5%] left-[11%] text-[0.62cqw]" cue={tone.folio}>
                    01
                  </Small>
                  </div>
                  <Motion.div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 0 }}
                    transition={{ ...hinge, delay: hinge.delay + hinge.duration / 2, duration: hinge.duration / 2, ease: EASE.quart }}
                  />
                </div>
              )}
            </Motion.div>
          </Motion.div>
        </div>
      )}
    </Motion.div>
  );
}

/**
 * The overture's mount point. Renders the overlay while the intro is
 * `opening`; when the sequence finishes, the exit plays and Act II is
 * released by that exit's own completion callback — no second clock, so
 * nothing can overlap.
 */
export function Preloader() {
  const { phase, setPhase } = useIntro();
  return (
    <AnimatePresence
      onExitComplete={() => {
        setPhase('complete');
      }}
    >
      {phase === 'opening' && (
        <Overture
          key="overture"
          onFinish={() => {
            setPhase('transitioning');
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ================================================================== *
 * THE ANNOUNCEMENT — New Directions
 * ================================================================== */

/**
 * THE STUDIO'S NEXT CHAPTER, told as a two-page insert: Larkscapes.id,
 * then Larkworks.id. One component, one store, two ways in:
 *
 *   AUTOMATICALLY, once a browsing session, TWO SECONDS AFTER THE INTRO
 *   HAS FULLY LEFT. The clock starts on the intro phase reaching
 *   `complete` — which only happens in the overture's own exit callback —
 *   never on page load, so it cannot land over the overture on a slow
 *   device. Where there is no overture (a repeat view, a deep link,
 *   reduced motion) `complete` is reached at hydration and the same two
 *   seconds apply. If another dialog or the menu is open at that moment,
 *   it waits until it is not.
 *
 *   BY HAND, from the header's "New" entry, at any time. Closing never
 *   hides the announcement for good: the session flag only stops it
 *   opening BY ITSELF again.
 *
 * It is a sheet of the album's paper rather than a dark modal — the same
 * stock the overture opened on, so the news reads as another page of the
 * studio's book, not as an interruption bolted onto the site. Every
 * photograph is a whole print.
 *
 * A proper dialog: `aria-modal`, labelled by the initiative's name, focus
 * moved in on open, trapped while open and returned on close; Escape
 * closes, arrow keys turn, a sideways swipe turns, the page underneath is
 * held exactly where it was.
 */
const ANNOUNCE_DELAY = 2000;
const ANNOUNCE_SEEN = 'lark-announcement';

let announcementOpen = false;
const announcementListeners = new Set<() => void>();

function setAnnouncement(open: boolean): void {
  if (announcementOpen === open) return;
  announcementOpen = open;
  for (const listener of announcementListeners) listener();
}

/** Opens the announcement — the header entry and the auto-open both. */
export function openAnnouncement(): void {
  setAnnouncement(true);
}

function useAnnouncementOpen(): boolean {
  return useSyncExternalStore(
    (listener) => {
      announcementListeners.add(listener);
      return () => announcementListeners.delete(listener);
    },
    () => announcementOpen,
    () => false,
  );
}

export function Announcement({ locale }: { locale: Locale }) {
  const open = useAnnouncementOpen();
  const { phase } = useIntro();

  useEffect(() => {
    if (phase !== 'complete') return;
    let seen = true;
    try {
      seen = window.sessionStorage.getItem(ANNOUNCE_SEEN) === '1';
    } catch {
      /* Storage blocked: never auto-open rather than open every page. */
    }
    if (seen) return;
    let timer = 0;
    const attempt = () => {
      const busy =
        document.querySelector('[role="dialog"]') !== null ||
        document.querySelector('[aria-controls="site-menu"][aria-expanded="true"]') !== null;
      if (busy) {
        timer = window.setTimeout(attempt, 1500);
        return;
      }
      try {
        window.sessionStorage.setItem(ANNOUNCE_SEEN, '1');
      } catch {
        /* nothing to remember it in */
      }
      setAnnouncement(true);
    };
    timer = window.setTimeout(attempt, ANNOUNCE_DELAY);
    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {open && <AnnouncementDialog key="announcement" locale={locale} />}
    </AnimatePresence>
  );
}

type Initiative = (typeof directions.initiatives)[number];

/** Two prints on the page: the lead fitted into the upper-left of the
 *  stage, the second into the lower-right, overlapping it. Each is sized
 *  to its own box by its own ratio — portraits and landscapes alike are
 *  shown whole. */
function AnnouncementPrints({ item, locale }: { item: Initiative; locale: Locale }) {
  const [lead, second] = item.announce;
  const fit = (photo: Photograph) => ({
    width: `min(100cqw, calc(100cqh * ${String(printAspect(photo))}), ${String(photo.width)}px)`,
  });
  return (
    <>
      <div className="absolute left-0 top-0 flex h-[88%] w-[80%] items-start justify-start [container-type:size]">
        <div style={fit(lead)}>
          <Print photo={lead} locale={locale} sizes="(min-width: 1024px) 40vw, 80vw" eager rotate={-0.8} />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 z-10 flex h-[52%] w-[46%] items-end justify-end [container-type:size]">
        <div style={fit(second)}>
          <Print photo={second} locale={locale} sizes="(min-width: 1024px) 24vw, 46vw" eager rotate={1.4} />
        </div>
      </div>
    </>
  );
}

/** One story: prints, then field, name, body and the way in. `live`
 *  is false for the invisible copies that size the sheet. */
function AnnouncementPage({
  item,
  locale,
  live,
  onClose,
  onMore,
}: {
  item: Initiative;
  locale: Locale;
  live: boolean;
  onClose: () => void;
  onMore: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 tablet:gap-5 desktop:grid-cols-12 desktop:items-center desktop:gap-x-8">
      <div className="relative h-[min(26svh,14rem)] short:h-[22svh] tablet:h-[min(30svh,20rem)] desktop:col-span-7 desktop:h-[min(50svh,27rem)] [@media(min-width:1024px)_and_(max-height:800px)]:h-[44svh]">
        {live && <AnnouncementPrints item={item} locale={locale} />}
      </div>
      <div className="desktop:col-span-5">
        <p className="flex items-center gap-2 font-text text-label uppercase tracking-[0.18em] text-album-ink-2">
          <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-brass" />
          {item.field[locale]}
        </p>
        <h2
          {...(live && { id: 'announcement-title' })}
          className="mt-2 font-display text-[clamp(2rem,1.3rem+3vw,3.75rem)] font-medium leading-[1.02] text-album-ink tablet:mt-3"
        >
          {item.name}
        </h2>
        <p
          {...(live && { id: 'announcement-body' })}
          className="mt-3 max-w-[40ch] font-text text-spec text-album-ink-2 short:text-caption tablet:mt-4 tablet:text-body"
        >
          {item.body[locale]}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-0 tablet:mt-6 tablet:gap-y-3">
          <Link
            href={paths.contact(locale)}
            onClick={onClose}
            tabIndex={live ? 0 : -1}
            className="group inline-flex min-h-[44px] items-center gap-3 border-b border-album-ink/40 font-text text-spec text-album-ink transition-colors duration-300 ease-expo hover:border-album-ink"
          >
            {item.action[locale]}
            <Arrow className="transition-transform duration-500 ease-expo group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            onClick={onMore}
            tabIndex={live ? 0 : -1}
            className="inline-flex min-h-[44px] items-center font-text text-spec text-album-ink-2 underline decoration-album-ink/25 underline-offset-4 transition-colors duration-300 ease-expo hover:text-album-ink"
          >
            {directions.more[locale]}
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementDialog({ locale }: { locale: Locale }) {
  const pages = directions.initiatives;
  const count = pages.length;
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const container = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const router = useRouter();

  useScrollHold(true);
  useFocusTrap(container, true);

  const close = useCallback(() => {
    setAnnouncement(false);
  }, []);
  const go = useCallback(
    (delta: number) => {
      setState(([current]) => [(current + delta + count) % count, delta]);
    },
    [count],
  );

  /* "More on the homepage": the New Directions section, scrolled to if it
     is on this page, navigated to if it is not. */
  const more = useCallback(() => {
    setAnnouncement(false);
    if (document.getElementById('directions')) {
      window.setTimeout(() => {
        scrollToId('directions');
      }, 450);
    } else {
      router.push(`${paths.home(locale)}#directions`);
    }
  }, [locale, router]);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [close, go]);

  const item = pages[index] ?? pages[0];
  const small =
    'flex h-[40px] w-[40px] items-center justify-center text-album-ink-2 transition-colors duration-300 ease-expo hover:text-album-ink';

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      aria-describedby="announcement-body"
      className="fixed inset-0 z-[96] flex items-center justify-center px-[max(0.75rem,env(safe-area-inset-left))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      {/* The page beneath, dimmed. A click on it closes. */}
      <Motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(8,8,9,0.78)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE.expo }}
        onClick={close}
      />

      {/* THE SHEET. Album paper, grain, the light from the upper left —
          scrolls inside itself only if a very short screen demands it. */}
      <Motion.div
        className="relative max-h-full w-full max-w-[1120px] overflow-y-auto overscroll-contain bg-album text-album-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.7, ease: EASE.expo }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          swipe.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const touch = event.changedTouches[0];
          const start = swipe.current;
          swipe.current = null;
          if (!start || !touch) return;
          const dx = touch.clientX - start.x;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(touch.clientY - start.y) * 1.5) go(dx < 0 ? 1 : -1);
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply"
          style={{ backgroundImage: PAPER_GRAIN }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_15%_0%,rgba(255,252,245,0.35),rgba(255,252,245,0)_60%)]"
        />

        {/* The masthead: which publication this is, where in it you are,
            and the way out — kept in reach even if the sheet scrolls. */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-album/95 px-5 pb-2 pt-2 tablet:px-8 tablet:pb-3 tablet:pt-6 desktop:px-10">
          <p className="font-text text-label uppercase tracking-[0.18em] text-album-ink-2">
            {directions.title[locale]}
            <span aria-hidden="true" className="mx-2 text-album-ink/30">
              —
            </span>
            <span className="text-album-ink">{directions.kicker[locale]}</span>
          </p>
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label={directions.close[locale]}
            className="-mr-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center text-album-ink-2 transition-colors duration-300 ease-expo hover:text-album-ink"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        <div className="relative px-5 pb-4 tablet:px-8 tablet:pb-6 desktop:px-10 desktop:pb-7">
          {/* The chapter, in one sentence — the same over both pages. */}
          <p className="max-w-[46ch] font-display text-[1.05rem] leading-[1.35] text-album-ink/80 short:hidden tablet:text-[1.35rem] [@media(min-width:640px)_and_(max-height:800px)]:hidden">
            {directions.story[locale]}
          </p>
          <span aria-hidden="true" className="mt-4 block h-px bg-album-ink/15 short:mt-0 tablet:mt-6 [@media(min-width:640px)_and_(max-height:800px)]:mt-0" />

          {/* THE PAGES. Every page is laid out invisibly in one grid
              cell, so the sheet is as tall as the longer story and turning
              never resizes it; the live page turns over the top. */}
          <div className="relative mt-4 grid tablet:mt-5">
            {pages.map((page) => (
              <div key={page.key} aria-hidden="true" className="invisible col-start-1 row-start-1">
                <AnnouncementPage item={page} locale={locale} live={false} onClose={close} onMore={more} />
              </div>
            ))}
            <AnimatePresence initial={false} custom={direction}>
              <Motion.div
                key={item.key}
                custom={direction}
                variants={turn}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <AnnouncementPage item={item} locale={locale} live onClose={close} onMore={more} />
              </Motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Where you are in the insert, and the turn — pinned to the foot
            of the sheet, so on a phone that has to scroll the sheet the
            way on is never below the fold. */}
        <div className="sticky bottom-0 z-20 bg-album/95 px-5 pb-3 tablet:px-8 tablet:pb-4 desktop:px-10 desktop:pb-6">
          <div className="flex items-center justify-between gap-4 border-t border-album-ink/15 pt-2 tablet:pt-3">
            <div className="flex items-center gap-4">
              <p className="figures font-text text-label tracking-[0.18em] text-album-ink-2" aria-live="polite">
                <span className="text-album-ink">{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true"> / </span>
                {String(count).padStart(2, '0')}
              </p>
              <div aria-hidden="true" className="flex gap-[6px]">
                {pages.map((page, position) => (
                  <span
                    key={page.key}
                    className={`block h-px w-[22px] transition-colors duration-500 ${
                      position === index ? 'bg-album-ink' : 'bg-album-ink/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="-mr-2 flex items-center">
              <button type="button" onClick={() => { go(-1); }} aria-label={directions.previous[locale]} className={small}>
                <Arrow className="w-[18px] rotate-180" />
              </button>
              <button type="button" onClick={() => { go(1); }} aria-label={directions.next[locale]} className={small}>
                <Arrow className="w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

/**
 * The header's way back in: a brass dot and one word. Integrated with the
 * navigation rather than floating over the page — it is news from the
 * studio, not a sales prompt.
 */
function AnnouncementEntry({ locale, tone = 'default' }: { locale: Locale; tone?: 'default' | 'bone' }) {
  return (
    <button
      type="button"
      onClick={openAnnouncement}
      aria-label={directions.entryLabel[locale]}
      className={`label inline-flex min-h-[44px] items-center gap-2 transition-colors duration-300 ease-expo desktop:min-h-0 ${
        tone === 'bone' ? 'text-bone-ink hover:text-bone-ink-2' : 'text-ink hover:text-ink-2'
      }`}
    >
      <span aria-hidden="true" className="relative flex h-[6px] w-[6px]">
        <span className="absolute inset-0 animate-ping rounded-full bg-brass opacity-40 [animation-duration:2.4s]" />
        <span className="relative h-[6px] w-[6px] rounded-full bg-brass" />
      </span>
      {directions.entry[locale]}
    </button>
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
