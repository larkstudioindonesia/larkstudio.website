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
  useReducedMotion,
  useScroll,
  useScrollDirection,
  useScrollLock,
  useScrolled,
  useSpring,
  useActTwo,
  useIntro,
  useToggle,
  useTransform,
} from '@/lib/motion';
import { crop, LOCALES, type Locale } from '@/content/types';
import { site, ui } from '@/content/site';
import { LOCALE_LABEL, paths, translatePath, whatsappLink } from '@/lib/site';
import { Container, Figures, Fill, Grid, TextLink } from '@/components/ui';

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
            animate={act2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.15 }}
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
  const reduced = useReducedMotion();

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
            {...(reduced === true
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
                  initial={reduced === true ? false : { y: '118%' }}
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
          initial={reduced === true ? false : { scaleX: 0 }}
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

/**
 * THE OVERTURE — a 5.6-second arrival, shown once per browsing session.
 *
 * WHAT IT IS NOT: a loading screen. It does not wait on the network, it
 * does not gate hydration, and it measures nothing. The page is fully
 * rendered behind it the whole time. The previous revision ran 1.6s and
 * put a 000–100 counter in the corner, which is the one device that
 * makes a framing sequence read as a progress bar lying about what it
 * measures — the counter is gone and nothing replaced it.
 *
 * THE SEQUENCE IS BUILT FROM THE VOCABULARY OF A DRAWING, not from the
 * vocabulary of a loader. There are no spinners, bars, percentages or
 * particles. There is a datum line, a set of column gridlines, a mark,
 * a name, and then the drawing opens:
 *
 *   0.00  black. The datum — a single hairline — draws out from the
 *         centre to the full width. An architect's first mark.
 *   0.90  five vertical gridlines drop from the datum on a stagger,
 *         the way a column grid is set out from a datum.
 *   1.50  the monogram fades up on the datum's left.
 *   2.10  LARK STUDIO rises, letter by letter, from behind the datum.
 *   3.10  the locality line and the year fade in beneath.
 *   3.70  the tracking on the wordmark relaxes from wide to normal as
 *         the gridlines retract — the drawing resolving into a title.
 *   4.60  APERTURE. A `clip-path` inset opens from the datum outward,
 *         top and bottom together, and the landing page is simply
 *         THERE behind it. Not a fade to the site — an opening onto it.
 *   5.60  the overlay unmounts. The hero's own 2.4s entrance is already
 *         running underneath by then, so the handover is continuous.
 *
 * WHY IT IS SAFE: `position: fixed` over an already-complete document,
 * so it cannot delay paint of the content beneath; skipped on every
 * subsequent navigation, on reduced motion, and if storage is
 * unavailable. The failure mode in every direction is "no overture",
 * which is the correct one. Scroll is locked for its duration and
 * released by the same state that unmounts it.
 *
 * ESCAPE HATCH: any key, click or touch skips to the aperture. A
 * visitor who has seen it once and cleared their storage should never
 * feel held, and 5.6 seconds is long enough that not offering the exit
 * would be arrogant.
 */
/* ------------------------------------------------------------------ *
 * THE OVERTURE — a title sequence cut from the studio's own work
 * ------------------------------------------------------------------ */

/**
 * EIGHT SHOTS, FULL BLEED, EACH CUT DIFFERENTLY.
 *
 * The previous version put six small rectangles on a black field, all
 * entering with the same clip and the same scale on the same metronome.
 * That is a slide deck. Three things make this a film instead:
 *
 * 1. THE SHOTS FILL THE FRAME. Every shot is `inset-0`, so the warm
 *    timber, the green of a garden, the sky over a facade and the light
 *    off a tiled floor are what the screen actually IS for that beat.
 *    The colour comes from the architecture — that is the whole answer
 *    to "too monochromatic", and it is why the shots had to get big.
 * 2. NO TWO CUTS ARE THE SAME. Six clip geometries — a letterbox slit
 *    opening, a vertical iris, wipes from each edge, a corner band —
 *    paired with a different scale/drift per shot. The eye cannot
 *    predict the next transition, which is the difference between
 *    rhythm and a metronome.
 * 3. IT ACCELERATES. Shots 1–2 hold ~1.1s (discovery), 3–5 tighten to
 *    ~0.62s (build), 6–8 land at ~0.42s (climax). The cuts get faster
 *    and the moves get bigger, so the sequence arrives somewhere
 *    instead of merely continuing.
 *
 * DEPTH comes from two layers per shot moving at different rates: the
 * clip is on the outer element, the scale and drift on the inner one,
 * so the frame and its contents never travel together. No perspective,
 * no translateZ, no tilt — the architecture is never distorted.
 */
type Shot = {
  slug: string;
  id: string;
  /** Opening clip geometry. Every shot ends at `inset(0 0 0 0)`. */
  from: string;
  /** Inner scale, start → rest. Kept under 1.14 so nothing softens. */
  scale: [number, number];
  /** Inner drift, start → rest. */
  drift: [string, string];
  at: number;
  hold: number;
};

const SHOTS: readonly Shot[] = [
  /* PHASE 1 — DISCOVERY. A letterbox slit opens. Slow, curious. */
  { slug: 'mr-yp-house', id: 'mr-yp-house-05', from: 'inset(47% 0% 47% 0%)', scale: [1.16, 1.02], drift: ['0%', '-2.2%'], at: 0.2, hold: 1.5 },
  { slug: 'the-prasetyos', id: 'the-prasetyos-03', from: 'inset(0% 46% 0% 46%)', scale: [1.14, 1.02], drift: ['1.8%', '0%'], at: 1.25, hold: 1.35 },
  /* PHASE 2 — BUILD. Wipes from alternating edges, tightening. */
  { slug: 'waroeng-andalan', id: 'waroeng-andalan-01', from: 'inset(0% 0% 100% 0%)', scale: [1.12, 1.02], drift: ['0%', '1.8%'], at: 2.2, hold: 1.0 },
  { slug: 'kintaro-cafe', id: 'kintaro-cafe-02', from: 'inset(0% 100% 0% 0%)', scale: [1.13, 1.02], drift: ['-2%', '0%'], at: 2.85, hold: 0.9 },
  { slug: 'amadya', id: 'amadya-03', from: 'inset(100% 0% 0% 0%)', scale: [1.11, 1.02], drift: ['0%', '-1.6%'], at: 3.4, hold: 0.85 },
  /* PHASE 3 — CLIMAX. Fast, confident, bigger moves. */
  { slug: 'mrs-d-house', id: 'mrs-d-house-02', from: 'inset(0% 0% 0% 100%)', scale: [1.15, 1.02], drift: ['2.2%', '0%'], at: 3.95, hold: 0.72 },
  { slug: 'atomic-cafe', id: 'atomic-cafe-01', from: 'inset(42% 42% 42% 42%)', scale: [1.18, 1.02], drift: ['0%', '0%'], at: 4.4, hold: 0.68 },
  { slug: 'ms-ra-house', id: 'ms-ra-house-02', from: 'inset(0% 0% 100% 0%)', scale: [1.13, 1.02], drift: ['0%', '1.4%'], at: 4.8, hold: 0.9 },
] as const;

/**
 * THE FOREGROUND PLATE — the depth layer.
 *
 * During the build and the climax a second, smaller frame rides over the
 * full-bleed shot, carrying a different project and moving on its own
 * clock. Two images at two rates in one composition is what gives the
 * sequence a midground and a foreground; without it every beat is one
 * flat plane and the montage reads as a slideshow no matter how the
 * cuts are timed.
 */
const PLATES = [
  { slug: 'kintaro-cafe', id: 'kintaro-cafe-03', box: 'left-[6vw] top-[14vh] w-[26vw] aspect-[4/5]', at: 2.35, hold: 1.5, y: ['5%', '-5%'] },
  { slug: 'the-prasetyos', id: 'the-prasetyos-02', box: 'right-[7vw] bottom-[12vh] w-[30vw] aspect-[3/2]', at: 3.5, hold: 1.4, y: ['-4%', '4%'] },
  { slug: 'waroeng-andalan', id: 'waroeng-andalan-03', box: 'left-[30vw] bottom-[16vh] w-[24vw] aspect-[3/2]', at: 4.5, hold: 1.15, y: ['6%', '-3%'] },
] as const;

/** The whole sequence. Act II is gated on the exit, not on this. */
const OVERTURE_MS = 6900;

const WORDMARK_A = 'LARK'.split('');
const WORDMARK_B = 'STUDIO'.split('');

export function Preloader() {
  const first = useFirstVisit();
  const reduced = useReducedMotion();
  const { phase, setPhase } = useIntro();
  const [done, setDone] = useState(false);

  const running = first && !done && reduced !== true;

  useScrollLock(running);

  useEffect(() => {
    if (running && phase === 'complete') setPhase('opening');
  }, [running, phase, setPhase]);

  useEffect(() => {
    if (!running) return;
    const finish = () => {
      setPhase('transitioning');
      setDone(true);
    };
    const timer = window.setTimeout(finish, OVERTURE_MS);
    window.addEventListener('keydown', finish, { once: true });
    window.addEventListener('pointerdown', finish, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [running, setPhase]);

  return (
    <AnimatePresence
      /* Act II is released by the exit's own completion callback, not by
         a timer running beside it. No second clock, so no overlap. */
      onExitComplete={() => {
        setPhase('complete');
      }}
    >
      {running && (
        <Motion.div
          aria-hidden="true"
          className="no-print fixed inset-0 z-90 overflow-hidden bg-paper"
          exit={{ clipPath: 'inset(50% 0% 50% 0%)', opacity: 0 }}
          transition={{ duration: 1.05, ease: EASE.quart }}
          style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        >
          {/*
            THE CAMERA.

            Every shot lives inside this one layer, and this layer never
            stops moving for the whole sequence: it pushes from 1.06 to
            1.0 while drifting left and lifting. That is the single most
            important change from the previous revision. Before, each
            shot animated in isolation and the frame itself was static,
            so the eye read "picture, pause, picture, pause". With a
            continuous camera under them the cuts happen INSIDE a move,
            which is what a title sequence actually feels like.
          */}
          <Motion.div
            className="absolute inset-0 hidden tablet:block"
            initial={{ scale: 1.06, x: '1.5%', y: '1%' }}
            animate={{ scale: 1.0, x: '-1.5%', y: '-1%' }}
            transition={{ duration: 6.4, ease: 'linear' }}
          >
            {/*
              THE MONTAGE — full bleed, so the architecture IS the colour.

              SHOTS DO NOT FADE OUT. Each one opens its clip and then
              STAYS, and the next shot's clip opens over the top of it.
              The previous revision closed every clip and dropped opacity
              back to 0, which put a beat of black between every pair —
              the exact "one thing at a time" rhythm that reads as a
              slide deck. Now the screen is never empty after 0.5s and
              each cut is a genuine transition rather than an appearance.
            */}
            {SHOTS.map((shot, i) => (
              <Motion.div
                key={shot.id}
                className="absolute inset-0"
                style={{ zIndex: i + 1 }}
                initial={{ clipPath: shot.from, opacity: 0 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                transition={{
                  clipPath: { duration: shot.hold, ease: EASE.quart, delay: shot.at },
                  opacity: { duration: 0.01, delay: shot.at },
                }}
              >
                {/* The plate travels inside its own frame — frame and
                    contents at different rates is the parallax. */}
                <Motion.div
                  className="absolute inset-0"
                  initial={{ scale: shot.scale[0], y: shot.drift[0] }}
                  animate={{ scale: shot.scale[1], y: shot.drift[1] }}
                  transition={{ duration: shot.hold + 2.2, ease: EASE.expo, delay: shot.at }}
                >
                  <Fill
                    src={crop(shot.slug, shot.id, 'landscape')}
                    alt=""
                    sizes="100vw"
                    priority={i < 2}
                    eager={i < 5}
                  />
                </Motion.div>
                {/* Exposure lifts as the cut lands, so consecutive shots
                    differ in light as well as in geometry. */}
                <Motion.div
                  className="absolute inset-0 bg-paper"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 0.06 }}
                  transition={{ duration: shot.hold * 0.9, ease: EASE.quart, delay: shot.at }}
                />
              </Motion.div>
            ))}

            {/* THE FOREGROUND PLATES — the depth layer. */}
            {PLATES.map((plate, i) => (
              <Motion.div
                key={plate.id}
                className={`absolute overflow-hidden ${plate.box}`}
                style={{ zIndex: 40 + i }}
                initial={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
                animate={{
                  clipPath: [
                    'inset(0% 0% 100% 0%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(0% 0% 0% 0%)',
                    'inset(100% 0% 0% 0%)',
                  ],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: plate.hold + 0.9,
                  times: [0, 0.3, 0.7, 1],
                  ease: EASE.quart,
                  delay: plate.at,
                }}
              >
                <Motion.div
                  className="absolute inset-0"
                  initial={{ y: plate.y[0], scale: 1.08 }}
                  animate={{ y: plate.y[1], scale: 1 }}
                  transition={{ duration: plate.hold + 1.6, ease: EASE.expo, delay: plate.at }}
                >
                  <Fill src={crop(plate.slug, plate.id, 'landscape')} alt="" sizes="32vw" eager />
                </Motion.div>
              </Motion.div>
            ))}

            {/*
              THE COLOUR PROGRESSION.

              A warm grade that is absent through Discovery, arrives with
              the Build and deepens into the Climax, drawn from the brass
              accent that is already the studio's one chromatic token. It
              is multiplied over the architecture rather than added, so it
              warms the timber and the daylight already in the renders
              instead of tinting them.
            */}
            <Motion.div
              aria-hidden="true"
              className="absolute inset-0 z-50 mix-blend-overlay bg-[radial-gradient(130%_100%_at_25%_35%,rgba(200,160,106,0.55),rgba(200,160,106,0)_60%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.5, 0.85, 0.35] }}
              transition={{ duration: 5.6, times: [0, 0.34, 0.6, 0.84, 1], ease: 'linear' }}
            />
            {/* A permanent vignette so the full-bleed shots read as
                framed cinematography rather than as wallpaper. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-50 bg-[radial-gradient(120%_85%_at_50%_50%,transparent_45%,rgba(11,11,12,0.72))]"
            />
          </Motion.div>

          {/* THE DATUM. Drawn once at the start, and it is the line the
              wordmark later sits on — the only element that survives the
              whole sequence. */}
          <Motion.span
            className="absolute left-5 right-5 top-1/2 z-10 h-px origin-center bg-line-strong tablet:left-7 tablet:right-7"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.8, 0.25, 0.9] }}
            transition={{ duration: 5.4, times: [0, 0.12, 0.6, 1], ease: EASE.quart, delay: 0.1 }}
          />

          {/* THE CONVERGENCE. A paper field closes over the last shot so
              the montage resolves rather than simply stopping. */}
          <Motion.div
            className="absolute inset-0 z-10 bg-[radial-gradient(120%_90%_at_20%_60%,rgba(200,160,106,0.16),rgba(11,11,12,1)_62%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE.quart, delay: 4.95 }}
          />

          {/* PHASE 4 — THE TITLE. Two lines, cut in from opposite sides,
              tracking closing as they land. */}
          <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-5 tablet:px-7">
            <Motion.span
              className="absolute left-5 top-0 -translate-y-[calc(100%+1.6rem)] tablet:left-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.expo, delay: 5.3 }}
            >
              <Image src="/logo.png" alt="" width={200} height={200} unoptimized priority className="h-7 w-7 object-contain" />
            </Motion.span>

            <Motion.h1
              className="mask mt-6 block whitespace-nowrap font-display text-hero leading-none text-ink"
              initial={{ letterSpacing: '0.4em' }}
              animate={{ letterSpacing: '-0.02em' }}
              transition={{ duration: 1.5, ease: EASE.quart, delay: 5.55 }}
            >
              {WORDMARK_A.map((c, i) => (
                <Motion.span
                  key={`a${String(i)}`}
                  className="inline-block will-change-transform"
                  initial={{ y: '120%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE.expo, delay: 5.45 + i * 0.05 }}
                >
                  {c}
                </Motion.span>
              ))}
              <span>&nbsp;</span>
              {WORDMARK_B.map((c, i) => (
                <Motion.span
                  key={`b${String(i)}`}
                  className="inline-block will-change-transform"
                  initial={{ y: '-120%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE.expo, delay: 5.6 + i * 0.05 }}
                >
                  {c}
                </Motion.span>
              ))}
            </Motion.h1>

            <Motion.p
              className="label mt-6 text-ink-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: 6.1 }}
            >
              {site.address[1]} — <Figures>{site.founded}</Figures>
            </Motion.p>
          </div>
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
