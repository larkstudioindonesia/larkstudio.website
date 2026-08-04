'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Motion, imageReveal } from '@/lib/motion';
import type { ProjectImage } from '@/content/types';
import type { Locale } from '@/content/types';

/**
 * LARK STUDIO — IMAGE PRIMITIVE
 *
 * Three rules are enforced here, and this is the component most likely
 * to be violated during build.
 *
 * 1. RESERVED SPACE, ALWAYS.
 *    The wrapper carries an explicit aspect ratio before anything
 *    loads. CLS budget is 0, not 0.1. Layout shift destroys the
 *    impression of precision faster than any aesthetic error, and on
 *    the mobile networks our primary visitor uses it would happen
 *    constantly.
 *
 * 2. THE REVEAL IS TRIGGERED BY DECODE, NOT BY SCROLL.
 *    Permitted:  the image appears when it becomes available.
 *    Prohibited: the image is available, held hidden, and released
 *                when scroll crosses a threshold.
 *    A developer reaching for an intersection observer here has broken
 *    the system, regardless of how tasteful the result looks.
 *
 * 3. TWO ART-DIRECTED RATIOS, NOT ONE CROPPED FILE.
 *    4:5 below 600px, 3:2 above — composed separately on the day. A
 *    centre-crop of the landscape frame produces beheaded architecture
 *    on phones.
 *
 * Also: opacity only by default. No blur-up placeholder — a blur-up is
 * a small theatrical device that performs the image's arrival and
 * carries a visible generational signature; a flat tone is honest and
 * undated.
 *
 * `hoverZoom` (behaviour 11 of the motion budget) is the one opt-in
 * exception to "no scale on content" — CSS-only `transform: scale`,
 * default `false`, so every existing call site is unaffected. It is
 * deliberately NOT enabled on `ProjectEntry`: that component's own
 * docblock states the image does nothing, and that stays true for the
 * homepage's repeating composite. It is scoped to the project-detail
 * Gallery (`CaptionedImage`), where inspecting a detail — not scanning
 * and navigating — is the visitor's intent.
 */

interface RevealImageProps {
  readonly image: ProjectImage;
  readonly locale: Locale;
  /** Only the first viewport image on a page. Everything else lazy. */
  readonly priority?: boolean;
  /** Computed from the actual grid zone, never guessed. */
  readonly sizes: string;
  /** Full bleed runs to the viewport; structural content does not. */
  readonly fullBleed?: boolean;
  /** Opt-in hover zoom. Default false — see docblock above. */
  readonly hoverZoom?: boolean;
}

export function RevealImage({
  image,
  locale,
  priority = false,
  sizes,
  fullBleed = false,
  hoverZoom = false,
}: RevealImageProps) {
  const [decoded, setDecoded] = useState(false);

  const imageClassName = `h-full w-full object-cover ${
    hoverZoom ? 'transition-transform duration-700 ease-standard hover:scale-105' : ''
  }`;

  return (
    <>
      {/* Below 600px — 4:5 portrait, separately composed. */}
      <div
        className={`relative bg-sunk tablet:hidden ${fullBleed ? 'w-full' : ''} ${
          hoverZoom ? 'overflow-hidden' : ''
        }`}
        style={{ aspectRatio: '4 / 5' }}
      >
        <Motion.div
          className="absolute inset-0"
          variants={imageReveal}
          initial="hidden"
          animate={decoded ? 'visible' : 'hidden'}
        >
          <Image
            src={image.portrait.src}
            alt={image.alt[locale]}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="empty"
            onLoadingComplete={() => {
              setDecoded(true);
            }}
            className={imageClassName}
          />
        </Motion.div>
      </div>

      {/* 600px and above — 3:2 landscape. */}
      <div
        className={`relative hidden bg-sunk tablet:block ${fullBleed ? 'w-full' : ''} ${
          hoverZoom ? 'overflow-hidden' : ''
        }`}
        style={{ aspectRatio: '3 / 2' }}
      >
        <Motion.div
          className="absolute inset-0"
          variants={imageReveal}
          initial="hidden"
          animate={decoded ? 'visible' : 'hidden'}
        >
          <Image
            src={image.landscape.src}
            alt={image.alt[locale]}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="empty"
            onLoadingComplete={() => {
              setDecoded(true);
            }}
            className={imageClassName}
          />
        </Motion.div>
      </div>
    </>
  );
}
