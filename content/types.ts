/**
 * LARK STUDIO — CONTENT CONTRACT
 *
 * This file is the enforcement layer for the design system. Rules that were
 * written as prose in the design direction are expressed here as types, so
 * that violating them fails the build rather than degrading the site quietly.
 *
 * Encoded rules:
 *   - Bilingual parity: a missing translation is a compile error.
 *   - Two aspect ratios per image: the shoot-day rule, enforced at author time.
 *   - Contractor credited: required field, not optional.
 *   - Two or three decisions per project: exactly, per the page template.
 *   - Specification varies by project kind: a discriminated union, so each
 *     buyer type is guaranteed the evidence they actually read.
 *
 * Content is composed, not rendered from a block array. There is deliberately
 * no `Section` union here — pages compose section components explicitly.
 */

/* ------------------------------------------------------------------ *
 * Locale
 * ------------------------------------------------------------------ */

export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

/** English is primary; Bahasa is the layout constraint. */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Both languages required. Bahasa is authored, never machine-translated,
 * and a missing `id` value will not compile.
 */
export type Localized<T> = { readonly [L in Locale]: T };

/* ------------------------------------------------------------------ *
 * Scalars
 * ------------------------------------------------------------------ */

/** ISO 8601 calendar date, e.g. '2024-11-06'. */
export type IsoDate = `${number}-${number}-${number}`;

/** Four-digit year. */
export type Year = number;

/**
 * URL slug. Permanent once published — these are pasted into WhatsApp and
 * sit inside proposal emails for years. Validated at runtime in
 * `content/projects/index.ts`.
 */
export type ProjectSlug = string;

/** Square metres. Rendered with tabular figures. */
export interface AreaSqm {
  readonly value: number;
  readonly unit: 'sqm';
}

/** Programme duration in weeks. */
export interface DurationWeeks {
  readonly value: number;
  readonly unit: 'weeks';
}

/* ------------------------------------------------------------------ *
 * Images
 * ------------------------------------------------------------------ */

export const ASPECT_RATIOS = {
  landscape: 3 / 2,
  portrait: 4 / 5,
  square: 1,
} as const;

export interface ImageSource {
  /** Path under /public, e.g. '/images/projects/slug/slug-01-3x2.jpg' */
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

/**
 * Delivery resolution is tiered by the role the image plays, because a
 * hero frame is displayed at a fundamentally different scale from a
 * next-project preview. Minimums are enforced by scripts/audit-assets.ts.
 *
 *   hero      4000px  full viewport, the opening frame of a project
 *   project   2500px  the image sequence within a project page
 *   thumbnail 1600px  next-project preview in the closing block
 */
export const IMAGE_ROLE_MIN_LONG_EDGE = {
  hero: 4000,
  project: 2500,
  thumbnail: 1600,
  /** Floor plans and drawings — legible at scan resolution, not
   *  photographic detail resolution. */
  drawing: 2000,
} as const;

export type ImageRole = keyof typeof IMAGE_ROLE_MIN_LONG_EDGE;

/**
 * Every project image exists in two art-directed compositions, captured
 * separately on the day — not cropped from one frame. Both are required
 * because reserved space on mobile depends on the portrait dimensions.
 */
export interface ProjectImage {
  readonly id: string;
  /** Determines the minimum delivery resolution. */
  readonly role: ImageRole;
  /** 3:2 — tablet and above. */
  readonly landscape: ImageSource;
  /** 4:5 — below 600px. */
  readonly portrait: ImageSource;
  /**
   * Editorial copy, not metadata. Written by whoever wrote the project text,
   * in the same voice. Carries the argument for a screen-reader user.
   */
  readonly alt: Localized<string>;
  readonly caption?: Localized<string>;
}

/** 1:1, permitted for material details only. */
export interface DetailImage {
  readonly id: string;
  readonly role: ImageRole;
  readonly square: ImageSource;
  readonly alt: Localized<string>;
  readonly caption?: Localized<string>;
}

/**
 * A single floor plan or drawing. Ratio-agnostic — unlike
 * `ProjectImage`'s art-directed 3:2/4:5 pair, a plan is one
 * deliverable and cropping it to a fixed ratio would be destructive.
 */
export interface PlanImage {
  readonly id: string;
  readonly role: 'drawing';
  readonly image: ImageSource;
  readonly alt: Localized<string>;
  readonly caption?: Localized<string>;
}

/* ------------------------------------------------------------------ *
 * Specification — discriminated by buyer type
 * ------------------------------------------------------------------ */

interface SpecificationBase {
  readonly area: AreaSqm;
  /** Design start to handover. */
  readonly programme: DurationWeeks;
}

/** F&B. The operator reads programme and cost certainty before anything else. */
export interface HospitalitySpecification extends SpecificationBase {
  readonly kind: 'hospitality';
  readonly seats: number;
  readonly coversPerService?: number;
  /** The single most persuasive figure on the page for this buyer. */
  readonly daysHandoverToOpening: number;
  readonly openedOn: IsoDate;
}

/** Private residential. Trust is built on process, not throughput. */
export interface ResidentialSpecification extends SpecificationBase {
  readonly kind: 'residential';
  readonly bedrooms?: number;
  readonly storeys?: number;
  readonly occupiedSince: IsoDate;
}

/** Developer. Capacity and delivery evidence, scanned in ninety seconds. */
export interface DevelopmentSpecification extends SpecificationBase {
  readonly kind: 'development';
  readonly units: number;
  readonly buildings?: number;
  readonly phase?: Localized<string>;
  readonly handedOverOn: IsoDate;
}

export type Specification =
  | HospitalitySpecification
  | ResidentialSpecification
  | DevelopmentSpecification;

export type ProjectKind = Specification['kind'];

/* ------------------------------------------------------------------ *
 * Project
 * ------------------------------------------------------------------ */

/** Four facts, no adjectives. Opens every project page. */
export interface Identification {
  readonly name: Localized<string>;
  /** e.g. 'Restaurant', 'House', 'Apartments' — a noun, never a description. */
  readonly type: Localized<string>;
  readonly location: Localized<string>;
  readonly year: Year;
}

/** Named judgement: what was decided, and why. */
export interface Decision {
  readonly id: string;
  readonly heading: Localized<string>;
  readonly body: Localized<string>;
}

/** Exactly two or three. The page template does not accommodate more. */
export type Decisions =
  | readonly [Decision, Decision]
  | readonly [Decision, Decision, Decision];

export interface Consultant {
  readonly discipline: Localized<string>;
  readonly name: string;
}

/**
 * Naming the contractor is rare and disproportionately persuasive: it says
 * the relationship survived the project and that construction is treated as
 * part of the work. Required, deliberately.
 */
export interface Credits {
  readonly photographer: string;
  readonly contractor: string;
  readonly consultants?: readonly Consultant[];
}

/** At least the opening image. */
export type ProjectImages = readonly [ProjectImage, ...ProjectImage[]];

export interface Project {
  readonly slug: ProjectSlug;
  readonly identification: Identification;

  /**
   * Two or three sentences naming what made this difficult. Stated before
   * anything is claimed. Admitting difficulty is the highest-trust move
   * available in the writing.
   */
  readonly constraint: Localized<string>;

  readonly specification: Specification;
  readonly images: ProjectImages;
  readonly details?: readonly DetailImage[];
  /** Floor plans / drawings. Optional — most projects do not have
   *  these digitised yet; the Plans section renders nothing until
   *  they do. No backfill is required to add this field. */
  readonly plans?: readonly PlanImage[];
  readonly decisions: Decisions;

  /** What happened after. Opened on this date. Operating since. Occupied. */
  readonly outcome: Localized<string>;

  readonly credits: Credits;

  /** Designed, static. The WhatsApp unfurl is the true first impression. */
  readonly openGraphImage: string;

  /** Unpublished projects are excluded from routes, sitemap and index. */
  readonly published: boolean;
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

export interface Passage {
  readonly id: string;
  readonly heading?: Localized<string>;
  readonly body: Localized<string>;
}

export interface HomeContent {
  readonly metaTitle: Localized<string>;
  readonly metaDescription: Localized<string>;
  /** The cinematic opening — large type, minimal copy. */
  readonly heroHeadline: Localized<string>;
  readonly heroSubhead: Localized<string>;
  /** Decorative — the headline already carries the message, so the
   *  background image needs no redundant screen-reader announcement. */
  readonly heroImage: ImageSource;
  /** Paragraphs, set in the measure column. */
  readonly statement: Localized<readonly string[]>;
  readonly closing: Localized<string>;
  readonly closingAction: Localized<string>;
  readonly openGraphImage: string;
}

/**
 * A client quote. Lives in its own `content/testimonials.ts` module,
 * not nested in `HomeContent`, since it is the one content type this
 * studio has chosen to ship with placeholder entries rather than
 * withhold the section entirely — `placeholder: true` is a visible
 * flag, not the primary safeguard; the safeguard is that the quote
 * text itself says so.
 */
export interface Testimonial {
  readonly id: string;
  readonly quote: Localized<string>;
  readonly attribution: Localized<string>;
  readonly placeholder: boolean;
}

/** Describes what happens, in sequence. Never what Lark promises. */
export interface ApproachContent {
  readonly statement: Localized<string>;
  readonly stages: readonly Passage[];
  readonly openGraphImage: string;
}

/**
 * Named individuals with roles, and no headcount sentence. The construction
 * reads as precise at two people and at twelve.
 */
export interface Person {
  readonly id: string;
  readonly name: string;
  readonly role: Localized<string>;
}

export interface StudioContent {
  readonly statement: Localized<string>;
  readonly people: readonly Person[];
  readonly passages: readonly Passage[];
  readonly openGraphImage: string;
}

export interface ContactContent {
  readonly statement: Localized<string>;
  /** What is useful in a first message. Qualification without a form. */
  readonly prompts: Localized<readonly string[]>;
  readonly email: string;
  /** E.164, digits only, no plus — for the wa.me link. */
  readonly whatsapp: string;
  readonly whatsappOpener: Localized<string>;
  readonly openGraphImage: string;
}

/* ------------------------------------------------------------------ *
 * Interface strings
 * ------------------------------------------------------------------ */

export interface UiStrings {
  readonly skipToContent: Localized<string>;
  readonly menuOpen: Localized<string>;
  readonly menuClose: Localized<string>;
  readonly navWork: Localized<string>;
  readonly navApproach: Localized<string>;
  readonly navStudio: Localized<string>;
  readonly navContact: Localized<string>;
  readonly nextProject: Localized<string>;
  readonly allWork: Localized<string>;
  readonly specificationHeading: Localized<string>;
  readonly creditsHeading: Localized<string>;
  readonly photographer: Localized<string>;
  readonly contractor: Localized<string>;
  readonly area: Localized<string>;
  readonly programme: Localized<string>;
  readonly seats: Localized<string>;
  readonly coversPerService: Localized<string>;
  readonly handoverToOpening: Localized<string>;
  readonly opened: Localized<string>;
  readonly occupiedSince: Localized<string>;
  readonly units: Localized<string>;
  readonly buildings: Localized<string>;
  readonly handedOver: Localized<string>;
  readonly bedrooms: Localized<string>;
  readonly storeys: Localized<string>;
  readonly phase: Localized<string>;

  /** Eyebrows for the new/restyled sections. */
  readonly servicesHeading: Localized<string>;
  readonly processHeading: Localized<string>;
  readonly testimonialsHeading: Localized<string>;
  readonly challengeHeading: Localized<string>;
  readonly conceptHeading: Localized<string>;
  readonly materialsHeading: Localized<string>;
  readonly plansHeading: Localized<string>;
  readonly resultHeading: Localized<string>;
  readonly galleryHeading: Localized<string>;

  readonly notFoundTitle: Localized<string>;
  readonly notFoundBody: Localized<string>;
}
