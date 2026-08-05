import Image from 'next/image';
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
 * A plain server component, not a client one — no state, no effects.
 * It used to hold behaviour 10 of the motion budget (a decode-gated
 * `clip-path` "mask reveal"), which was removed: Lighthouse identified
 * the hero image as the homepage's Largest Contentful Paint candidate,
 * and a `clip-path` starting at `inset(0 0 100% 0)` gives the browser
 * zero visible pixels to measure until the animation resolves — LCP
 * timing simply excludes an element that isn't painted yet. Holding
 * that curtain for even part of an 800ms animation was directly
 * costing LCP time with no way to keep both the effect and the score.
 * The image now paints as soon as the browser can show it — which,
 * with `priority` set below, is as fast as this page can make it
 * arrive — and that IS the reveal.
 */
export function HeroMedia({
  media,
  priority = false,
}: {
  media: HeroMediaSource;
  priority?: boolean;
}) {
  if (media.kind === 'video') {
    /* Not implemented yet — the type exists so a future video asset
       swaps in without touching Hero.tsx or this component's shape. */
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-sunk">
      <Image
        src={media.image.src}
        alt={media.alt}
        width={media.image.width}
        height={media.image.height}
        sizes="100vw"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="empty"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Flat wash, not a gradient — darkens the photograph uniformly
          so header/hero text stays legible over any image without a
          decorative device. `bg-paper` is the dark surface colour
          regardless of what sits beneath it. */}
      <div className="absolute inset-0 bg-paper/40" aria-hidden="true" />
    </div>
  );
}
