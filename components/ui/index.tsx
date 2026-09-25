'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  EASE,
  Motion,
  curtainUp,
  fadeUp,
  maskUp,
  setCursorLabel,
  stagger,
  useInView,
  useMagnetic,
  useProgress,
  useFocusTrap,
  useScrollHold,
  useTransform,
  wipeRight,
  type MotionValue,
  type Variants,
} from '@/lib/motion';
import {
  objectPosition,
  type Locale,
  type Photograph,
} from '@/content/types';
import { ui } from '@/content/site';

/**
 * LARK STUDIO — PRIMITIVES
 *
 * Layout, typography, actions, media and the animation wrappers. Five
 * files previously, and nobody ever read one of them alone: a section
 * reaches for a Container, an Eyebrow, a Frame and a Reveal in the same
 * twenty lines.
 *
 * Everything animated here is opt-in at the call site. There is no
 * implicit "every section reveals" behaviour, because the sections that
 * do NOT animate are what give the ones that do their effect.
 */

/* ================================================================== *
 * LAYOUT
 * ================================================================== */

/** Structural content caps at 1760px, centred. Images are exempt and
 *  run to the viewport — that tension is the editorial effect. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-structure px-5 tablet:px-7 desktop:px-8 wide:px-9 ${className}`}
    >
      {children}
    </div>
  );
}

/** 4 / 8 / 12 columns. Breakpoints are set by measure, not by device. */
export function Grid({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-4 gap-4 tablet:grid-cols-8 tablet:gap-5 desktop:grid-cols-12 wide:gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Vertical rhythm, named rather than repeated. Every section used to
 * carry its own six-class incantation, and the three that had drifted
 * out of sync were invisible until they sat in one place.
 */
const RHYTHM = {
  none: '',
  tight: 'py-8 tablet:py-9 desktop:py-9',
  default: 'py-9 tablet:py-10 desktop:py-11',
  loose: 'py-10 tablet:py-11 desktop:py-12',
} as const;

export function Section({
  children,
  rhythm = 'default',
  className = '',
  label,
  id,
}: {
  children: ReactNode;
  rhythm?: keyof typeof RHYTHM;
  className?: string;
  /** Sets `aria-label`; use when the section has no visible heading. */
  label?: string;
  id?: string;
}) {
  return (
    <section
      {...(id !== undefined && { id })}
      {...(label !== undefined && { 'aria-label': label })}
      className={`relative ${RHYTHM[rhythm]} ${className}`.trim()}
    >
      {children}
    </section>
  );
}

/**
 * The reading column: 62–72 characters, left of centre.
 *
 * LEFT OF CENTRE, NOT CENTRED. This asymmetry is the single decision
 * that produces the editorial register — it creates a wide, quiet right
 * field that carries captions, annotation and frequently nothing at
 * all. A centred measure inside a wide frame reads as a template.
 */
export function Measure({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-4 tablet:col-span-7 desktop:col-span-6 desktop:col-start-3">
      {children}
    </div>
  );
}

/* ================================================================== *
 * TYPOGRAPHY
 * ================================================================== */

/** Tabular lining figures, so stated facts align without intervention.
 *  FIGURES NEVER ANIMATE — facts do not count up. */
export function Figures({ children }: { children: ReactNode }) {
  return <span className="figures">{children}</span>;
}

/** Available to screen readers, removed from visual layout. */
export function Hidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}

/**
 * The section marker: an index, a label, and a rule that draws itself
 * out to the edge as the section arrives.
 *
 * Every section on the site opens with one, which is what makes the two
 * that open WITHOUT one — the hero and the closing block — read as
 * different in kind rather than merely different in content.
 */
export function Eyebrow({
  children,
  index,
  tone = 'default',
}: {
  children: ReactNode;
  /** Rendered as a brass ordinal to the left. Decorative, so hidden. */
  index?: string;
  tone?: 'default' | 'bone';
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const ink = tone === 'bone' ? 'text-bone-ink-2' : 'text-ink-2';
  const rule = tone === 'bone' ? 'bg-bone-line' : 'bg-line-strong';

  return (
    <div ref={ref} className="flex items-center gap-4">
      {index !== undefined && (
        <span aria-hidden="true" className="figures label text-brass">
          {index}
        </span>
      )}
      <span className="mask">
        <Motion.span
          className={`label block ${ink}`}
          variants={maskUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {children}
        </Motion.span>
      </span>
      <Motion.span
        aria-hidden="true"
        className={`h-px flex-1 origin-left ${rule}`}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: EASE.expo, delay: 0.12 }}
      />
    </div>
  );
}

/**
 * Split-text reveal: characters, words, or a whole line rising from
 * behind a mask.
 *
 * THE ACCESSIBILITY CONTRACT. Splitting a string into per-character
 * spans destroys it for a screen reader, which announces
 * "T—r—o—p—i—c—a—l" or fails to find a word boundary at all. So the
 * whole string is rendered once inside `Hidden`, and every generated
 * span is `aria-hidden`. The visible text is decoration over an intact,
 * readable sentence. This is not optional and it is the reason this
 * component exists rather than each heading splitting itself inline.
 *
 * Each piece carries its own delay rather than inheriting an
 * orchestrated `staggerChildren`. Both work; this is preferred because
 * the cascade would otherwise have to cross two non-motion wrappers to
 * reach a character, and orchestration through that depth depends on
 * Framer re-resolving the tree on every render. An explicit
 * `index * step` is arithmetic — no traversal, and the timing of any
 * given character is readable straight off the line.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  mode = 'words',
  delay = 0,
  immediate = false,
  play = true,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  /** `chars` for short display lines only — per-character DOM is ~6×
   *  the node count, and on a long headline that cost shows up on a
   *  mid-range phone before the effect does. */
  mode?: 'chars' | 'words' | 'line';
  delay?: number;
  /** Skip the observer and animate immediately — above the fold only. */
  immediate?: boolean;
  /**
   * HARD GATE. While false the line stays hidden no matter what the
   * observer says. `immediate` cannot do this job: setting it false
   * falls through to `inView`, and the hero headline IS in view the
   * whole time the overture is covering it — so it would play behind
   * the curtain. This is what holds Act II closed.
   */
  play?: boolean;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const active = play && (immediate || inView);
  const step = mode === 'chars' ? 0.024 : 0.06;
  let piece = 0;

  const rise = (key: string, content: string, index: number) => (
    <Motion.span
      key={key}
      /* No permanent `will-change`: Framer promotes the span while it
         animates, and a standing hint kept every split character of
         every heading on the site as its own layer for good. */
      className="inline-block"
      initial={{ y: '110%', opacity: 0 }}
      animate={active ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
      transition={{ duration: 0.95, ease: EASE.expo, delay: delay + index * step }}
    >
      {content}
    </Motion.span>
  );

  return (
    <Tag className={className}>
      <Hidden>{text}</Hidden>
      <span ref={ref} aria-hidden="true" className="block">
        {mode === 'line' ? (
          <span className="mask">
            <Motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={active ? { y: '0%' } : { y: '110%' }}
              transition={{ duration: 1, ease: EASE.expo, delay }}
            >
              {text}
            </Motion.span>
          </span>
        ) : (
          text.split(' ').map((word, wordIndex, words) => (
            /* The separating space is a SIBLING of the word box, not a
               child of it. A trailing space inside an `inline-block`
               sits at the box's own edge, where the browser's whitespace
               handling collapses it — and the words render glued
               together with no gap. This looks like a font problem
               rather than a markup problem and has been introduced twice
               in this component's history. */
            <Fragment key={`${String(wordIndex)}-${word}`}>
              <span className="inline-block whitespace-nowrap">
                <span className="mask inline-block">
                  {mode === 'chars'
                    ? [...word].map((char, charIndex) =>
                        rise(`${String(charIndex)}-${char}`, char, piece++),
                      )
                    : rise('word', word, piece++)}
                </span>
              </span>
              {wordIndex < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))
        )}
      </span>
    </Tag>
  );
}

function ScrollWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <Motion.span className="inline-block" style={{ opacity }}>
      {word}
    </Motion.span>
  );
}

/**
 * A paragraph that lights up one word at a time as it is scrolled past.
 *
 * The site's one piece of literal scroll storytelling, and it is used
 * exactly once — on the homepage manifesto — because the device is only
 * honest where the content genuinely wants to be read slowly. Applying
 * it to a services list, which is scanned rather than read, would be
 * decoration.
 *
 * Opacity only: no transform, no filter, nothing that could reflow a
 * paragraph mid-scroll.
 */
export function ScrollText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const progress = useProgress(ref, ['start 90%', 'end 60%']);
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      <Hidden>{text}</Hidden>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${String(index)}-${word}`}>
            <ScrollWord
              word={word}
              progress={progress}
              start={index / words.length}
              end={(index + 1.5) / words.length}
            />
            {index < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </p>
  );
}

/* ================================================================== *
 * ANIMATION WRAPPERS
 * ================================================================== */

const REVEAL = {
  fade: fadeUp,
  curtain: curtainUp,
  wipe: wipeRight,
} satisfies Record<string, Variants>;

/**
 * The workhorse. Wraps a block and animates it the first time it enters
 * the viewport.
 *
 *   fade      the house entrance
 *   curtain   a vertical clip, for full-bleed media
 *   wipe      a horizontal clip, for framed media
 *
 * There was a fourth, `blur`, and nothing ever asked for it — a defocus
 * that costs a full-element rasterise on every frame is not worth
 * keeping warm for a call site that does not exist.
 */
export function Reveal({
  children,
  variant = 'fade',
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof REVEAL;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Motion.div
      ref={ref}
      {...(className !== undefined && { className })}
      variants={REVEAL[variant]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      {...(delay > 0 && { transition: { delay } })}
    >
      {children}
    </Motion.div>
  );
}

/**
 * Staggered group. Children must be `<Item>` — or anything carrying a
 * `fadeUp`-shaped variant — for the cascade to reach them.
 *
 * `Item` is a separate named export rather than `Stagger.Item`, which is
 * the tidier API and does not work: a static property on a component
 * exported across the server/client boundary does not survive, and the
 * page fails at prerender with "Element type is invalid".
 */
export function Stagger({
  children,
  each = 0.09,
  delay = 0,
  className,
}: {
  children: ReactNode;
  each?: number;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Motion.div
      ref={ref}
      {...(className !== undefined && { className })}
      variants={stagger(each, delay)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </Motion.div>
  );
}

export function Item({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Component = as === 'li' ? Motion.li : Motion.div;
  return (
    <Component {...(className !== undefined && { className })} variants={fadeUp}>
      {children}
    </Component>
  );
}

/* ================================================================== *
 * ACTIONS
 * ================================================================== */

/**
 * The entire iconography of this site.
 *
 * There is no icon set — icons are interface vocabulary and documents do
 * not have them. This one glyph is drawn to the grotesque's stroke
 * weight and cap height so it reads as typography rather than as an
 * imported asset.
 */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 26 12"
      width="26"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M0 6h24" />
      <path d="M19 1l5 5-5 5" />
    </svg>
  );
}

/**
 * The only call-to-action object on the site. No fill, radius 0, no
 * shadow — a filled button is a commercial pressure device, and a studio
 * that asks is a studio that needs.
 *
 * What makes it feel alive, in order of contribution:
 *
 *   1. MAGNETIC PULL. The frame leans toward the pointer within a 28px
 *      catchment and springs back on leave. This is the single gesture
 *      that most reliably reads as expensive — the object feels like it
 *      has mass and is aware of you — and it costs one element-scoped
 *      listener.
 *   2. A SURFACE THAT FILLS. A brass panel wipes up from the bottom
 *      edge on hover and the label inverts against it. `clip-path`, so
 *      nothing reflows.
 *   3. THE GLYPH ADVANCES, 4px, on the compositor.
 *
 * All three are pointer-gated and all three degrade to a 1px frame that
 * changes colour under reduced motion.
 */
export function Action({
  href,
  children,
  external = false,
  tone = 'default',
  size = 'default',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: 'default' | 'bone';
  size?: 'default' | 'large';
}) {
  const { ref, x, y } = useMagnetic(0.26, 28);
  const bone = tone === 'bone';

  const className = [
    'group relative inline-flex min-h-[48px] items-center overflow-hidden border',
    size === 'large'
      ? 'px-5 py-3 text-spec tablet:px-7 tablet:py-4 tablet:text-body'
      : 'px-5 py-3 text-spec tablet:px-6',
    bone
      ? 'border-bone-line text-bone-ink hover:text-bone'
      : 'border-line-strong text-ink hover:text-paper',
    'font-text transition-colors duration-500 ease-expo',
  ].join(' ');

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom transition-transform duration-500 ease-expo [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] ${
          bone ? 'bg-bone-ink' : 'bg-brass'
        }`}
      />
      <span className="relative z-10">{children}</span>
      <Arrow className="relative z-10 ml-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
    </>
  );

  /* The magnetic transform lives on a wrapper rather than on the anchor
     itself: a transformed focusable element moves its own focus ring,
     and the ring must sit exactly on the frame the visitor sees. */
  return (
    <Motion.span ref={ref} className="inline-block" style={{ x, y }}>
      {external ? (
        <a href={href} className={className} rel="noreferrer noopener" target="_blank">
          {inner}
        </a>
      ) : (
        <Link href={href} className={className}>
          {inner}
        </Link>
      )}
    </Motion.span>
  );
}

/** A 1px rule that wipes under the label. Hover is information, never
 *  reward — mobile is the primary surface and mobile has no hover. */
export function TextLink({
  href,
  children,
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const base = `sweep inline-block text-current transition-colors duration-300 ease-expo ${className}`;
  return external ? (
    <a href={href} className={base} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  ) : (
    <Link href={href} className={base}>
      {children}
    </Link>
  );
}

/** First focusable element on every page. Invisible until focused, then
 *  rendered in the standard framed style. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="fixed left-5 top-5 z-100 -translate-y-[200%] border border-ink bg-paper px-5 py-3 font-text text-spec text-ink transition-transform duration-200 focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}

/* ================================================================== *
 * MEDIA
 * ================================================================== */

/**
 * The encoder quality every photograph on this site is served at.
 *
 * Next's default is 75, which is tuned for photography where the
 * subject is a face or a scene. Here the subject IS the texture —
 * board-formed concrete, rattan weave, brushed steel, the grain in a
 * plywood carcass — and AVIF at 75 spends its bit budget on the large
 * shapes and smooths precisely that detail away. Every value in this
 * constant must also appear in `images.qualities` in next.config.ts;
 * Next rejects a quality it has not been told about.
 */
export const RENDER_QUALITY = 88;

/**
 * Decode state for an image that may already be decoded.
 *
 * `onLoad` is the honest trigger — the image appears when it becomes
 * available — but it only fires for a load that happens AFTER React
 * attaches the handler. On a warm cache, a back-navigation, or any
 * second view of the same photograph, the browser has the bytes before
 * hydration and the event never comes. The reveal then never runs, and
 * because it starts from a hidden state the image stays invisible for
 * good. So the ref is checked on mount as well.
 */
function useDecoded() {
  const ref = useRef<HTMLImageElement>(null);
  const [decoded, setDecoded] = useState(false);
  const onLoad = useCallback(() => {
    setDecoded(true);
  }, []);
  useEffect(() => {
    if (ref.current?.complete === true) setDecoded(true);
  }, []);
  return { ref, decoded, onLoad } as const;
}


/**
 * A cover image filling its positioned parent. Used by the hero, the
 * portfolio panels, the project cover and the discipline preview — all
 * sized by their container rather than by a reserved ratio, which is a
 * different sizing model from `Frame` and the reason these are separate
 * components rather than one with a flag.
 *
 * ART DIRECTION APPLIES HERE TOO, and for a while it did not. `Frame`
 * has always shipped both crops, but `Frame` only ever renders the
 * gallery plates — the four places where a photograph is largest and
 * most exposed all use this component, and all four were serving the
 * 3:2 landscape crop into a tall phone viewport. The portrait masters
 * were being exported and deployed and never requested by anything.
 *
 * `portrait` is optional rather than required because one caller
 * genuinely wants a single source: the discipline preview is a 400px
 * card that only exists on a fine pointer, so it has no phone case.
 */
export function Fill({
  src,
  portrait,
  alt,
  sizes,
  focal,
  priority = false,
  eager = false,
  className = '',
}: {
  src: string;
  /** The 4:5 crop, shown below 640px. Omit for desktop-only surfaces. */
  portrait?: string;
  alt: string;
  sizes: string;
  /** Subject position, as [x%, y%]. Defaults to centre. */
  focal?: readonly [number, number];
  priority?: boolean;
  /** Load now, without being `priority`. See the note in `Frame` on why
   *  a clipped image can never lazy-load itself. */
  eager?: boolean;
  className?: string;
}) {
  const common = {
    fill: true as const,
    quality: RENDER_QUALITY,
    priority,
    loading: priority || eager ? ('eager' as const) : ('lazy' as const),
    ...(focal !== undefined && { style: { objectPosition: objectPosition(focal) } }),
    className: `object-cover ${className}`,
  };

  if (portrait === undefined) {
    return <Image src={src} alt={alt} sizes={sizes} {...common} />;
  }

  /* The `1px` hint is the same load-bearing oddity as in `Frame`: both
     crops are in the DOM with one hidden, and a `priority` image is
     preloaded whether or not its container is displayed. Declaring a
     1px display width at the breakpoints where a crop is hidden makes
     the browser satisfy that preload with the smallest candidate
     instead of downloading a second full-size photograph. */
  return (
    <>
      <div className="absolute inset-0 tablet:hidden">
        <Image
          src={portrait}
          alt={alt}
          sizes={`(min-width: 640px) 1px, ${sizes}`}
          {...common}
        />
      </div>
      {/* Both carry the real alt. `hidden` is `display: none`, which
          removes the element from the accessibility tree outright, so
          exactly one of these is ever announced. */}
      <div className="absolute inset-0 hidden tablet:block">
        <Image
          src={src}
          alt={alt}
          sizes={`(max-width: 639px) 1px, ${sizes}`}
          {...common}
        />
      </div>
    </>
  );
}

/**
 * Wraps anything that should change what the custom cursor reads while
 * it is hovered. The label is published to a module-level store, so
 * nothing between here and the cursor re-renders.
 */
export function CursorLabel({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onPointerEnter={() => {
        setCursorLabel(label);
      }}
      onPointerLeave={() => {
        setCursorLabel(null);
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================== *
 * PRINTS
 * ================================================================== */

/**
 * THE PRINT BORDER, as a fraction of the print's width on each side.
 * Equal all round — a fine-art mount, not an instant-camera border.
 */
const MOUNT = 0.032;

/**
 * The outer aspect of a print (border included) for a photograph of the
 * given ratio. Layouts that place prints need it to know how tall one
 * will be; the lightbox needs it to fit one to the screen.
 */
export function printAspect(photo: Photograph): number {
  const inner = 1 - 2 * MOUNT;
  return 1 / (inner * (photo.height / photo.width) + 2 * MOUNT);
}

/**
 * A PHOTOGRAPH AS A PHYSICAL PRINT. The core rule of the site's
 * photography, enforced in one place:
 *
 *   THE PHOTOGRAPH IS THE ARTWORK; THE FRAME ADAPTS TO IT.
 *
 * The image box takes the photograph's own ratio from its true pixel
 * size, so nothing is ever cropped to fill a rectangle — a print is as
 * tall as its photograph makes it, and a layout that needs a print to fit
 * a space scales the whole print DOWN. `object-contain` inside an
 * exact-ratio box is belt and braces.
 *
 * The caller sets only the width (and position); the border scales with
 * it, because the print is a size container and the mount is in `cqw`.
 *
 * With `onOpen` the print is a button — every print on the site can be
 * picked up and looked at properly. The lightbox reads the element it is
 * given, so the enlargement grows out of the print the reader touched.
 */
export function Print({
  photo,
  locale,
  sizes,
  eager = false,
  priority = false,
  rotate = 0,
  onOpen,
  className = '',
  style,
}: {
  photo: Photograph;
  locale: Locale;
  sizes: string;
  eager?: boolean;
  priority?: boolean;
  /** Degrees. Held to ±2 by convention — a print laid down, not tossed. */
  rotate?: number;
  onOpen?: (origin: HTMLElement) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const decode = useDecoded();
  const body = (
    <span
      className="block w-full bg-print p-[3.2cqw] shadow-[0_1px_1px_rgba(0,0,0,0.28),0_18px_36px_-22px_rgba(0,0,0,0.85)]"
    >
      <span
        className="relative block w-full overflow-hidden bg-print-well"
        style={{ aspectRatio: `${String(photo.width)} / ${String(photo.height)}` }}
      >
        <Image
          ref={decode.ref}
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          sizes={sizes}
          quality={RENDER_QUALITY}
          priority={priority}
          loading={priority || eager ? 'eager' : 'lazy'}
          onLoad={decode.onLoad}
          className={`object-contain transition-opacity duration-700 ease-expo ${
            decode.decoded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>
    </span>
  );

  const frame = { transform: `rotate(${String(rotate)}deg)` };

  return (
    <div className={`[container-type:inline-size] ${className}`} style={style}>
      {onOpen ? (
        <button
          type="button"
          data-print=""
          data-rotate={rotate}
          aria-label={`${ui.enlarge[locale]}: ${photo.alt[locale]}`}
          onClick={(event) => {
            onOpen(event.currentTarget);
          }}
          onPointerEnter={() => {
            setCursorLabel(ui.enlarge[locale]);
          }}
          onPointerLeave={() => {
            setCursorLabel(null);
          }}
          /* Picked up a little under the pointer: lifted 6px and turned
             halfway back to square. Transform only. */
          className="block w-full cursor-zoom-in transition-transform duration-500 ease-expo hover:![transform:translateY(-6px)_rotate(calc(var(--r)*0.4))] focus-visible:![transform:translateY(-6px)_rotate(calc(var(--r)*0.4))]"
          style={{ ...frame, ['--r' as string]: `${String(rotate)}deg` }}
        >
          {body}
        </button>
      ) : (
        <div data-print="" style={frame}>
          {body}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * THE LIGHTBOX
 * ------------------------------------------------------------------ */

type LightboxRequest = {
  photos: readonly Photograph[];
  index: number;
  origin: HTMLElement | null;
  locale: Locale;
};

/**
 * A module-level store, like the cursor label: any print anywhere can
 * open the one lightbox without a provider wrapping the tree.
 */
let lightbox: LightboxRequest | null = null;
const lightboxListeners = new Set<() => void>();

function setLightbox(next: LightboxRequest | null): void {
  lightbox = next;
  for (const listener of lightboxListeners) listener();
}

/** Opens the lightbox on `photos[index]`, growing out of `origin`. */
export function openLightbox(request: LightboxRequest): void {
  setCursorLabel(null);
  setLightbox(request);
}

function useLightbox(): LightboxRequest | null {
  return useSyncExternalStore(
    (listener) => {
      lightboxListeners.add(listener);
      return () => lightboxListeners.delete(listener);
    },
    () => lightbox,
    () => null,
  );
}

/** Screen space the enlarged print may take, and where its centre is. */
function stageBox(photo: Photograph) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw < 640;
  const side = narrow ? 16 : 96; // room for the arrows on wide screens
  const top = narrow ? 64 : 72; // the close button
  const bottom = narrow ? 112 : 88; // caption, and the arrows on a phone
  /* Never wider than the photograph has pixels: a 1,400px file is not
     blown up to fill a 1,900px screen. It is shown at its own size, or
     smaller where the screen is smaller. */
  const width = Math.min(vw - 2 * side, (vh - top - bottom) * printAspect(photo), photo.width, 2200);
  return { width, cx: vw / 2, cy: top + (vh - top - bottom) / 2 };
}

/** Where a print sits now, relative to where the stage wants it. */
function flipFrom(origin: HTMLElement | null, photo: Photograph) {
  if (!origin?.isConnected) return null;
  const rect = origin.getBoundingClientRect();
  /* A print scrolled or translated off screen is not a place to fly
     back to — the stage then simply fades. */
  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
    return null;
  }
  const stage = stageBox(photo);
  const rotate = Number(origin.dataset.rotate ?? 0);
  /* The bounding box of a rotated print is slightly larger than the
     print; at ±2° the difference is under 4%, and dividing it back out
     keeps the enlargement from starting a hair too big. */
  const angle = (Math.abs(rotate) * Math.PI) / 180;
  const aspect = printAspect(photo);
  const unrotated = rect.width / (Math.cos(angle) + Math.sin(angle) / aspect);
  return {
    x: rect.left + rect.width / 2 - stage.cx,
    y: rect.top + rect.height / 2 - stage.cy,
    scale: unrotated / stage.width,
    rotate,
  };
}

/**
 * THE LIGHTBOX — one print, picked up and brought close.
 *
 * The enlargement is a FLIP, done by hand: the print is measured where it
 * lies, the stage is laid out at full size, and the stage starts
 * transformed back onto the original — offset, scaled down, at the same
 * slight angle — then settles square in the centre. Closing runs the same
 * move in reverse to wherever the print is NOW. Framer's `layoutId` would
 * do this with layout projection, which is the one feature this site's
 * motion budget excludes (see lib/motion.tsx); four transform values do
 * the same job.
 *
 * The photograph is never cropped: the stage is sized from the print's
 * own aspect to the largest box the screen allows. While the full-size
 * file arrives, the print's already-loaded image stands in underneath it,
 * so the enlargement is never empty.
 *
 * Closes on Escape, the close button, or a click/tap outside the print.
 * Arrow keys, the arrow buttons and a sideways swipe move through the
 * set. Focus is trapped inside and returned to the print on close, and
 * the page is held still underneath — scroll position untouched.
 */
export function Lightbox() {
  const request = useLightbox();
  return (
    <AnimatePresence>
      {request && <LightboxStage key="lightbox" request={request} />}
    </AnimatePresence>
  );
}

function LightboxStage({ request }: { request: LightboxRequest }) {
  const { photos, locale } = request;
  const [index, setIndex] = useState(request.index);
  const [, setViewport] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const count = photos.length;
  const photo = photos[index] ?? photos[0];

  /* Measured at open. The origin is the print the reader touched, and
     only that print — after moving through the set, closing fades. */
  const [from] = useState(() => (photo ? flipFrom(request.origin, photo) : null));
  const [exitTo, setExitTo] = useState<ReturnType<typeof flipFrom>>(null);
  const [closing, setClosing] = useState(false);

  useScrollHold(true);
  useFocusTrap(container, true);

  const close = useCallback(() => {
    if (!photo) return;
    setExitTo(index === request.index ? flipFrom(request.origin, photo) : null);
    setClosing(true);
  }, [index, photo, request.index, request.origin]);

  /* Release the store only after the exit target is in this render, so
     AnimatePresence reads it. */
  useEffect(() => {
    if (!closing) return;
    const frame = requestAnimationFrame(() => {
      setLightbox(null);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [closing]);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight' && count > 1) step(1);
      else if (event.key === 'ArrowLeft' && count > 1) step(-1);
    };
    const onResize = () => {
      setViewport((value) => value + 1);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [close, count, step]);

  /* Return focus to the print that opened this, without scrolling to it. */
  useEffect(() => {
    const origin = request.origin;
    return () => {
      origin?.focus({ preventScroll: true });
    };
  }, [request.origin]);

  const swipe = useRef<{ x: number; y: number } | null>(null);

  if (!photo) return null;
  const stage = stageBox(photo);
  const aspect = printAspect(photo);
  const settled = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  const exit = exitTo
    ? { ...exitTo, opacity: 1 }
    : { x: 0, y: 12, scale: 0.97, rotate: 0, opacity: 0 };

  const arrow =
    'flex h-[44px] w-[44px] items-center justify-center border border-line-strong text-ink-2 transition-colors duration-300 ease-expo hover:border-ink-3 hover:text-ink';

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-label={photo.credit[locale]}
      className="fixed inset-0 z-95"
      onTouchStart={(event) => {
        const touch = event.touches[0];
        swipe.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const start = swipe.current;
        swipe.current = null;
        if (!start || !touch || count < 2) return;
        const dx = touch.clientX - start.x;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(touch.clientY - start.y) * 1.5) {
          step(dx < 0 ? 1 : -1);
        }
      }}
    >
      {/* The presentation layer. Clicking anywhere on it closes. */}
      <Motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(8,8,9,0.92)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE.expo }}
        onClick={close}
      />

      {/* THE PRINT. Positioned at its settled place; the FLIP transform
          carries it there from the original. */}
      <Motion.div
        key={`print-${String(index)}`}
        className="absolute [container-type:inline-size]"
        style={{
          width: stage.width,
          left: stage.cx - stage.width / 2,
          top: stage.cy - stage.width / aspect / 2,
        }}
        initial={index === request.index && from ? { ...from, opacity: 1 } : { x: 0, y: 12, scale: 0.97, rotate: 0, opacity: 0 }}
        animate={settled}
        exit={exit}
        transition={{ duration: 0.7, ease: EASE.expo }}
      >
        <LightboxPrint photo={photo} locale={locale} width={stage.width} origin={index === request.index ? request.origin : null} />
      </Motion.div>

      {/* Caption and count, beneath the print. */}
      <Motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <p className="font-text text-caption text-ink-2">{photo.credit[locale]}</p>
        {count > 1 && (
          <p className="figures label text-ink-3">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
        )}
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <button
          ref={closeButton}
          type="button"
          onClick={close}
          aria-label={ui.menuClose[locale]}
          className={`absolute right-4 top-[max(1rem,env(safe-area-inset-top))] tablet:right-6 tablet:top-6 ${arrow}`}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </button>
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-[max(3.75rem,calc(env(safe-area-inset-bottom)+3.25rem))] flex justify-center gap-3 tablet:bottom-auto tablet:top-1/2 tablet:-translate-y-1/2 tablet:justify-between tablet:px-6">
            <button type="button" onClick={() => { step(-1); }} aria-label={ui.previous[locale]} className={arrow}>
              <Arrow className="w-[20px] rotate-180" />
            </button>
            <button type="button" onClick={() => { step(1); }} aria-label={ui.next[locale]} className={arrow}>
              <Arrow className="w-[20px]" />
            </button>
          </div>
        )}
      </Motion.div>
    </div>
  );
}

/**
 * The enlarged print. The full-size file loads over the print's own
 * already-decoded image, which stands in at once, so the growing print is
 * never an empty frame.
 */
function LightboxPrint({
  photo,
  locale,
  width,
  origin,
}: {
  photo: Photograph;
  locale: Locale;
  width: number;
  origin: HTMLElement | null;
}) {
  const [placeholder] = useState(
    () => origin?.querySelector('img')?.currentSrc ?? null,
  );
  const decode = useDecoded();
  return (
    <div className="bg-print p-[3.2cqw] shadow-[0_2px_4px_rgba(0,0,0,0.3),0_40px_80px_-40px_rgba(0,0,0,0.9)]" style={{ width }}>
      <div
        className="relative w-full overflow-hidden bg-print-well"
        style={{ aspectRatio: `${String(photo.width)} / ${String(photo.height)}` }}
      >
        {placeholder && (
          /* The same URL the print already fetched — served from cache.
             A plain img, since it is not a new request to optimise. */
          // eslint-disable-next-line @next/next/no-img-element
          <img src={placeholder} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain" />
        )}
        <Image
          ref={decode.ref}
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          sizes={`${String(Math.ceil(width))}px`}
          quality={RENDER_QUALITY}
          loading="eager"
          onLoad={decode.onLoad}
          className={`object-contain transition-opacity duration-500 ${decode.decoded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
}
