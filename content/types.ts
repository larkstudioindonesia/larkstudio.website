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
 * WEIGHT CONTROLS PLACEMENT AND NOTHING ELSE. It used to control the
 * export width too, through a `WEIGHT_WIDTH` map that shipped `lead` at
 * 2560, `wide` at 2160 and `detail` at 1800 — and that map is why this
 * site looked soft. A `detail` plate drawn 1300px wide on a 2x display
 * needs 2600 real pixels and was handed 1800; the same plate on a phone
 * got the portrait crop, which a further 0.583 factor had taken down to
 * 1049px. Both were then re-encoded by the optimiser, so the visitor saw
 * a downscale of a downscale.
 *
 * The map is gone. Softness in a master is a fact about that master, and
 * throwing away pixels the master does have cannot improve it. THE
 * EXPORT CONTRACT IS NOW A PROPERTY OF THE CROP, NOT THE WEIGHT, and
 * `images-2` clears it on every axis:
 *
 *   3x2  4200x2800 on the full-bleed plates, 2700x1800 elsewhere
 *   4x5  3220x4025 on the full-bleed plates, 2448x3060 elsewhere
 *
 * Both crops grew. The 4:5 masters were 2048x2560 and are now 2448x3060,
 * which covers a 639 CSS px viewport at 3 DPR (1917px) outright instead
 * of meeting it exactly; the 3:2 leads were 3840x2560 and are now
 * 4200x2800, which is why `deviceSizes` gained a 4096 candidate.
 *
 * Nothing caps what the browser may ask for. The optimiser clamps to the
 * master on its own: request 4096 from a 2700px file and it returns
 * 2700, never an upscale.
 */
export type Weight = 'lead' | 'wide' | 'detail';

/**
 * The two crops every photograph ships in, composed around the frame's
 * focal point rather than its centre. A landscape crop of interior
 * architecture becomes beheaded architecture on a phone.
 */
export const CROP = {
  landscape: { suffix: '3x2', ratio: '3 / 2' },
  portrait: { suffix: '4x5', ratio: '4 / 5' },
} as const;

export interface ProjectImage {
  /** Also the file stem: `amadya-01` → `/images-2/projects/amadya/amadya-01-3x2.jpg` */
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
  /**
   * A photograph delivered OUTSIDE the `<id>-3x2.jpg` export convention —
   * a file as supplied, at whatever ratio it was made. Name as it sits in
   * the project's folder, and its true pixel size, which is what lets a
   * print take the photograph's own shape. Absent, the frame resolves by
   * convention through `crop()`.
   */
  readonly file?: { readonly name: string; readonly width: number; readonly height: number };
}

export interface Project {
  /** Permanent once published — these sit inside proposal emails for years. */
  readonly slug: string;
  readonly name: Localized<string>;
  readonly type: Localized<string>;
  readonly location: Localized<string>;
  readonly year: number;
  /** Square metres. Rendered with tabular figures. Omitted when the
   *  studio has not stated it — the facts row simply leaves it out. */
  readonly area?: number;
  /** What the finished space does. The only prose a project carries.
   *  Optional: a project published before its write-up exists shows its
   *  photographs and facts, and nothing is invented in the gap. */
  readonly outcome?: Localized<string>;
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

/**
 * THE ONE PLACE A PROJECT PHOTOGRAPH'S PATH IS BUILT.
 *
 * Every plate on the site — portfolio panel, project cover, gallery
 * frame, related-project card, discipline preview — resolves through
 * here, which is what made the move from `/images` to `/images-2` a
 * one-line migration rather than a sweep. `/public/images` is still on
 * disk and is no longer referenced by anything.
 */
export function crop(slug: string, id: string, which: keyof typeof CROP): string {
  return `/images-2/projects/${slug}/${id}-${CROP[which].suffix}.jpg`;
}

/**
 * A PHOTOGRAPH, AS A PRINT: the file, its TRUE pixel size and what it
 * shows. Everything that presents a photograph as a physical print — the
 * portfolio spreads, the album overture, the lightbox, the project
 * plates — works from this, never from a crop.
 *
 * WHY THE 3:2 FILE AND NEVER THE 4:5. The `-3x2` export is the render's
 * own composition (2700×1800, the leads 4200×2800). The `-4x5` export is
 * a centre crop of it scaled UP roughly 1.7× — 2448×3060 cut from 1800px
 * of height — so a phone was being shown 53% of the building, enlarged.
 * A print shows the whole photograph at its own ratio, scaled down to fit.
 */
export interface Photograph {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized<string>;
  /** Whose work this is — the lightbox caption. */
  readonly credit: Localized<string>;
}

/** The whole photograph behind a published frame. */
export function photograph(project: Project, image: ProjectImage): Photograph {
  if (image.file) {
    return {
      src: encodeURI(`/images-2/projects/${project.slug}/${image.file.name}`),
      width: image.file.width,
      height: image.file.height,
      alt: image.alt,
      credit: project.name,
    };
  }
  const lead = image.weight === 'lead';
  return {
    src: crop(project.slug, image.id, 'landscape'),
    width: lead ? 4200 : 2700,
    height: lead ? 2800 : 1800,
    alt: image.alt,
    credit: project.name,
  };
}

/** `50% 46%` — ready for CSS `object-position`. */
export function objectPosition(focal: readonly [number, number]): string {
  return `${String(focal[0])}% ${String(focal[1])}%`;
}
