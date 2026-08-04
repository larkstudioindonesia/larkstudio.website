'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Motion, maskReveal } from '@/lib/motion';
import type { ImageSource } from '@/content/types';

/**
 * Discriminated so a video can replace the image later without
 * restructuring any call site — only `'image'` is implemented today.
 */
export type HeroMediaSource =
  | { readonly kind: 'image'; readonly image: ImageSource; readonly alt: string }
  | { readonly kind: 'video'; readonly src: string; readonly poster: ImageSource; readonly alt: string };

/**
 * LARK STUDIO — HERO MEDIA PRIMITIVE
 *
 * Deliberately separate from `RevealImage`, not a variant of it.
 * `RevealImage`'s CLS guarantee comes from reserving a fixed aspect-
 * ratio box before load; this component is sized by the hero section's
 * own `min-h-dvh`, a different sizing model — keeping them apart means
 * `RevealImage`'s 9 existing call sites are provably unaffected by
 * this addition.
 *
 * Behaviour 10 of the motion budget — mask reveal, 800ms, once. Unlike
 * `RevealImage`'s opacity-only fade, this animates `clip-path` (a
 * compositor property, not layout) from fully masked to fully
 * revealed on the image's own decode — still decode-triggered, not
 * scroll-triggered, same rule `RevealImage` follows.
 */
export function HeroMedia({
  media,
  priority = false,
}: {
  media: HeroMediaSource;
  priority?: boolean;
}) {
  const [decoded, setDecoded] = useState(false);

  if (media.kind === 'video') {
    /* Not implemented yet — the type exists so a future video asset
       swaps in without touching Hero.tsx or this component's shape. */
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-sunk">
      <Motion.div
        className="absolute inset-0"
        variants={maskReveal}
        initial="hidden"
        animate={decoded ? 'visible' : 'hidden'}
      >
        <Image
          src={media.image.src}
          alt={media.alt}
          width={media.image.width}
          height={media.image.height}
          sizes="100vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="empty"
          onLoad={() => {
            setDecoded(true);
          }}
          className="h-full w-full object-cover"
        />
      </Motion.div>

      {/* Flat wash, not a gradient — darkens the photograph uniformly
          so header/hero text stays legible over any image without a
          decorative device. `bg-paper` is the dark surface colour
          regardless of what sits beneath it. */}
      <div className="absolute inset-0 bg-paper/40" aria-hidden="true" />
    </div>
  );
}
