/**
 * LARK STUDIO — CONTENT CONTRACT
 *
 * Rules the design depends on, expressed as types so a violation fails
 * the build instead of degrading the site quietly.
 *
 * This file is deliberately separate from `projects.ts`, and the reason
 * is `middleware.ts`: the locale constants below are imported by the
 * Edge middleware, and folding them into the project registry would drag
 * five hundred lines of copy into a bundle that runs on every request.
 */

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

/** English is primary; Bahasa is the layout constraint — it runs 15–20% longer. */
export const DEFAULT_LOCALE: Locale = 'en';

/** Both languages required. Bahasa is authored, never machine-translated. */
export type Localized<T> = { readonly [L in Locale]: T };

/**
 * EDITORIAL WEIGHT — the single most load-bearing field here.
 *
 * Every frame on this site is a render, and the renders are not equal:
 * measured across the set, real detail ranges from 1.58 bits/pixel down
 * to 0.42. Weight is assigned per frame by looking at it, and it decides
 * the largest PLACEMENT the layout is allowed to give it:
 *
 *   lead    opens a project, runs full bleed
 *   wide    the contained plate, up to the container width
 *   detail  a half-width plate, for the documentary frames
 *
 * WEIGHT CONTROLS PLACEMENT, NOT FILE SIZE — and the distinction is the
 * fix for a real bug. A previous pass also capped the exported width of
 * soft masters, some as low as 1200px, reasoning that a low-detail render
 * should not ship large. That made the frame blurrier, not sharper: a
 * 1200px file shown in a 1300px CSS box on a 2x display is upscaled 2.1x
 * by the browser. Softness in the master is a fact about the master; the
 * exported file should be as good as the master allows, and the layout
 * decides how big to draw it.
 *
 * These widths are therefore a ceiling on what the browser may request —
 * see the `sizes` note in `Frame` — and the export floor. Every frame now
 * ships at or above 1800px.
 */
export type Weight = 'lead' | 'wide' | 'detail';

export const WEIGHT_WIDTH: Record<Weight, number> = {
  lead: 2560,
  wide: 2160,
  detail: 1800,
};

/**
 * The two crops every photograph ships in, composed around the frame's
 * focal point rather than its centre. A landscape crop of interior
 * architecture becomes beheaded architecture on a phone.
 */
export const CROP = {
  landscape: { suffix: '3x2', ratio: '3 / 2', scale: 1 },
  portrait: { suffix: '4x5', ratio: '4 / 5', scale: 0.583 },
} as const;

export interface ProjectImage {
  /** Also the file stem: `amadya-01` → `/images/projects/amadya/amadya-01-3x2.jpg` */
  readonly id: string;
  readonly weight: Weight;
  /**
   * The subject, as [x%, y%]. Drives the export crop AND the rendered
   * `object-position`, so a frame placed into a container of any ratio
   * still holds its subject. Measured from edge energy, then corrected
   * by eye.
   */
  readonly focal: readonly [number, number];
  readonly alt: Localized<string>;
  readonly caption?: Localized<string>;
}

export interface Project {
  /** Permanent once published — these sit inside proposal emails for years. */
  readonly slug: string;
  readonly name: Localized<string>;
  readonly type: Localized<string>;
  readonly location: Localized<string>;
  readonly year: number;
  /** Square metres. Rendered with tabular figures. */
  readonly area: number;
  /** What the finished space does. The only prose a project carries. */
  readonly outcome: Localized<string>;
  /** Ordered. `images[0]` opens the project and must be a `lead`. */
  readonly images: readonly ProjectImage[];
  readonly published: boolean;
}

/** A named block of copy: a process stage, a studio value, a discipline. */
export interface Passage {
  readonly id: string;
  readonly heading: Localized<string>;
  readonly body: Localized<string>;
}

export function crop(slug: string, id: string, which: keyof typeof CROP): string {
  return `/images/projects/${slug}/${id}-${CROP[which].suffix}.jpg`;
}

/** `50% 46%` — ready for CSS `object-position`. */
export function objectPosition(focal: readonly [number, number]): string {
  return `${String(focal[0])}% ${String(focal[1])}%`;
}
