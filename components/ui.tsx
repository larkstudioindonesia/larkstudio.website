'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  EASE,
  Motion,
  SETTLE,
  curtainUp,
  fadeUp,
  maskUp,
  setCursorLabel,
  stagger,
  useInView,
  useMagnetic,
  useParallax,
  useProgress,
  useTransform,
  wipeRight,
  type MotionValue,
  type Variants,
} from '@/lib/motion';
import {
  CROP,
  crop,
  objectPosition,
  WEIGHT_WIDTH,
  type Locale,
  type ProjectImage,
} from '@/content/types';

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
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const active = immediate || inView;
  const step = mode === 'chars' ? 0.024 : 0.06;
  let piece = 0;

  const rise = (key: string, content: string, index: number) => (
    <Motion.span
      key={key}
      className="inline-block will-change-transform"
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
 * A project photograph, in the two crops it was composed in.
 *
 * THREE RULES ARE ENFORCED HERE, and this is the component most likely
 * to be violated during build.
 *
 * 1. RESERVED SPACE, ALWAYS. The wrapper carries an explicit aspect
 *    ratio before anything loads. Parallax and hover zoom both run on
 *    the compositor INSIDE that box, so neither can move the page.
 *
 * 2. THE REVEAL IS TRIGGERED BY DECODE, NOT BY SCROLL.
 *      Permitted  — the image appears when it becomes available.
 *      Prohibited — the image is available, held hidden, and released
 *                   when scroll crosses a threshold. One real state,
 *                   performing as two.
 *
 * 3. TWO ART-DIRECTED RATIOS, NOT ONE CROPPED FILE. 4:5 below 640px,
 *    3:2 above. A centre-crop of the landscape frame produces beheaded
 *    architecture on phones.
 *
 * THE DOUBLE-DOWNLOAD, AND WHY `sizes` LOOKS ODD. Rule 3 means both
 * crops are in the DOM with one hidden by CSS. A lazy image inside
 * `display: none` is never fetched, so ordinary frames cost nothing
 * extra — but a `priority` image is preloaded regardless of whether its
 * container is visible, so the hero was preloading BOTH crops on every
 * device. Each crop therefore declares a display width of `1px` at the
 * breakpoints where it is hidden, and the browser satisfies the preload
 * with the smallest candidate in the srcset. It reads strangely and it
 * is load-bearing.
 */
export function Frame({
  slug,
  image,
  locale,
  sizes,
  priority = false,
  parallax = 0,
  zoom = false,
  reveal = 'fade',
  cap,
  className = '',
}: {
  slug: string;
  image: ProjectImage;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  parallax?: number;
  /** Opt-in hover zoom. Scoped to entries and galleries, where
   *  inspecting the photograph IS the intent. */
  zoom?: boolean;
  reveal?: 'fade' | 'curtain' | 'wipe';
  /**
   * A ceiling on the landscape frame's height, e.g. `'82vh'`.
   *
   * A full-bleed 3:2 photograph is 960px tall on a 1440px screen —
   * taller than the laptop viewport it is meant to impress, so the
   * visitor scrolls past a composition they never see whole. Capping the
   * frame crops it instead, and because the cap is a viewport unit the
   * reserved space is still deterministic: no CLS.
   *
   * FULL-BLEED FRAMES ONLY. It is applied as an explicit `height`, not
   * as `max-height` on the aspect box: Chrome resolves an over-
   * constrained `aspect-ratio` box by shrinking the WIDTH, so the
   * viewport-wide entry silently became a 999px column with black beside
   * it. The height therefore has to be computed from the viewport, which
   * is only correct when the frame spans it.
   */
  cap?: string;
  className?: string;
}) {
  const portrait = useDecoded();
  const landscape = useDecoded();

  /**
   * THE CLIP / LAZY-LOAD DEADLOCK, and why this hook is here.
   *
   * The reveal clips the layer the photograph sits in. Chrome's native
   * lazy loading decides when to fetch from the image's INTERSECTION
   * with the viewport, and an intersection rect is clipped by every
   * ancestor — including `clip-path`. A fully-closed curtain therefore
   * reports an empty rect, the browser never starts the fetch, `onLoad`
   * never fires, and the curtain that is waiting on the decode never
   * opens. The frame stays a grey rectangle forever, on a portfolio
   * whose entire content is photographs.
   *
   * The fix is to hand the loading decision to an observer on the
   * UNCLIPPED frame instead: 500px before the frame reaches the
   * viewport, the image is switched to eager and fetches normally. The
   * reveal still triggers on decode, which keeps the rule that an image
   * appears when it becomes available rather than when scroll crosses a
   * line.
   */
  const { ref: frame, inView } = useInView<HTMLDivElement>({
    rootMargin: '500px 0px 500px 0px',
  });
  const y = useParallax(frame, parallax);

  /* The slack the parallax travels through. Without it the moving layer
     is exactly frame-sized, and translating it exposes the placeholder
     as a band along one edge for most of the element's pass. */
  const slack = Math.ceil(parallax / 2);

  const variants =
    reveal === 'curtain' ? curtainUp : reveal === 'wipe' ? wipeRight : undefined;

  const face = (
    which: keyof typeof CROP,
    visibility: string,
    hint: string,
    decode: ReturnType<typeof useDecoded>,
  ) => {
    const source = crop(slug, image.id, which);
    return (
      <div
        className={`relative overflow-hidden bg-sunk ${visibility}`}
        style={
          cap !== undefined && which === 'landscape'
            ? { height: `min(66.667vw, ${cap})` }
            : { aspectRatio: CROP[which].ratio }
        }
      >
        <Motion.div
          className="absolute inset-x-0"
          {...(variants
            ? {
                variants,
                initial: 'hidden',
                animate: decode.decoded ? 'visible' : 'hidden',
              }
            : {
                initial: { opacity: 0 },
                animate: { opacity: decode.decoded ? 1 : 0 },
                transition: { duration: 0.7, ease: EASE.expo },
              })}
          style={parallax > 0 ? { y, top: -slack, bottom: -slack } : { top: 0, bottom: 0 }}
        >
          {/* THE SETTLE. The photograph arrives 6% over-size and comes to
              rest over 1.6s, behind the clip that is opening at the same
              time. It is the whole reason a still frame feels alive on
              arrival, and it is the only scale this site applies to a
              photograph that is not a pointer response. */}
          <Motion.div
            className="absolute inset-0"
            initial={{ scale: SETTLE }}
            animate={{ scale: decode.decoded ? 1 : SETTLE }}
            transition={{ duration: 1.6, ease: EASE.expo }}
          >
          <Image
            ref={decode.ref}
            src={source}
            alt={image.alt[locale]}
            fill
            sizes={hint}
            priority={priority}
            loading={priority || inView ? 'eager' : 'lazy'}
            onLoad={decode.onLoad}
            /* The subject, not the centre. A frame dropped into a
               container of any ratio still holds what the photograph is
               actually of — the single change that fixed "badly cropped"
               across the whole site. */
            style={{ objectPosition: objectPosition(image.focal) }}
            className={`h-full w-full object-cover ${
              zoom
                ? 'transition-transform duration-[900ms] ease-expo group-hover:scale-[1.04]'
                : ''
            }`}
          />
          </Motion.div>
        </Motion.div>
      </div>
    );
  };

  /**
   * NEVER ASK FOR MORE PIXELS THAN THE MASTER HAS.
   *
   * `sizes` tells the browser how wide the frame will be, and the
   * browser multiplies by device pixel ratio. On a 2× laptop a
   * two-thirds-width frame asks for ~1900px — fine for a `lead`, a
   * 73% upscale for a `detail` whose master is 1100px wide, and an
   * upscaled render is exactly what "blurry" looks like. Capping the
   * hint at the real width makes the browser pick the largest honest
   * candidate instead.
   */
  const capped = `${sizes}, ${String(WEIGHT_WIDTH[image.weight])}px`;

  return (
    <div ref={frame} className={className}>
      {face('portrait', 'tablet:hidden', `(min-width: 640px) 1px, ${capped}`, portrait)}
      {face('landscape', 'hidden tablet:block', `(max-width: 639px) 1px, ${capped}`, landscape)}
    </div>
  );
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
