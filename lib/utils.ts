import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * LARK STUDIO — CLASS MERGING
 *
 * `cn()` is the shadcn convention: conditional classes via `clsx`, then
 * conflict resolution via `tailwind-merge` so a prop-supplied class beats
 * a component's default instead of racing it in the stylesheet.
 *
 * WHY THIS IS NOT THE THREE-LINE VERSION FROM THE DOCS.
 *
 * `twMerge` resolves conflicts by classifying each utility into a group,
 * and it classifies from a table of STOCK Tailwind values. This project
 * deleted the stock theme — `app/globals.css` opens by setting
 * `--color-*`, `--text-*`, `--spacing`, `--breakpoint-*` and the rest to
 * `initial` — and rebuilt every scale with names of its own.
 *
 * Out of the box that misfires in the one way that matters. Given
 * `cn('text-hero', 'text-ink')`, stock `twMerge` recognises neither
 * value, falls back to reading both as text-COLOUR, decides they
 * conflict, and silently drops `text-hero`. The headline loses its size
 * and nothing anywhere reports an error. The site sets size and colour
 * together on the same element constantly — `font-display text-hero
 * text-ink` is the homepage headline — so this would not have been a
 * rare edge case.
 *
 * The override below hands `twMerge` the real scales. `font-size` and
 * `text-color` become separate, correctly-populated groups, and the two
 * classes stop being treated as rivals.
 */

/** Every `--text-*` step in `app/globals.css`, in scale order. */
const FONT_SIZE = [
  'micro',
  'label',
  'caption',
  'spec',
  'body',
  'body-lg',
  'lead',
  'title',
  'statement',
  'display',
  'hero',
  'mega',
] as const;

/** Every `--color-*` token. `transparent` and `current` are the only two
 *  that survive from stock Tailwind. */
const COLOR = [
  'paper',
  'sunk',
  'raised',
  'ink',
  'ink-2',
  'ink-3',
  'line',
  'line-strong',
  'brass',
  'brass-soft',
  'bone',
  'bone-ink',
  'bone-ink-2',
  'bone-line',
  'transparent',
  'current',
] as const;

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZE] }],
      'text-color': [{ text: [...COLOR] }],
      'bg-color': [{ bg: [...COLOR] }],
      'border-color': [{ border: [...COLOR] }],
      /* `font-display` and `font-text` are FAMILIES here, not weights or
         sizes — without this `font-display` reads as a stock utility. */
      'font-family': [{ font: ['display', 'text'] }],
      'font-weight': [{ font: ['regular', 'medium'] }],
      rounded: [{ rounded: ['none', 'full'] }],
      blur: [{ blur: ['sm', 'md', 'lg', 'xl'] }],
      'backdrop-blur': [{ 'backdrop-blur': ['sm', 'md', 'lg', 'xl'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
