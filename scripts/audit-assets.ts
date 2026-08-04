#!/usr/bin/env tsx
/**
 * LARK STUDIO — ASSET AUDIT
 *
 * Runs before every build. Any failure fails the build.
 *
 * This is the most valuable file in the repository. The photography is
 * the load-bearing asset of the entire site: one image outside the
 * ratio system or the grade damages more than five inside it repair,
 * and human review will eventually miss one. This makes that
 * impossible.
 *
 * What it enforces, from the photography direction:
 *   - Both art-directed ratios present for every image (3:2 and 4:5),
 *     within a 0.5% tolerance. This is the shoot-day rule: composed
 *     separately at capture, never cropped afterwards.
 *   - Minimum delivery resolution, tiered by the role the image plays:
 *       hero       4000px  full viewport, opening frame
 *       project    2500px  the image sequence within a project page
 *       thumbnail  1600px  next-project preview in the closing block
 *   - sRGB colour space with an embedded profile.
 *   - Declared dimensions in content match the file on disk, because
 *     reserved space — and therefore a CLS of 0 — depends on them.
 *   - Alt text present and non-trivial in both languages. Alt text is
 *     editorial copy on this site, not metadata.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { projects } from '../content/projects/index.js';
import { home } from '../content/pages/home.js';
import { IMAGE_ROLE_MIN_LONG_EDGE, LOCALES } from '../content/types.js';
import type { ImageRole, ImageSource, Localized } from '../content/types.js';

const PUBLIC_DIR = join(process.cwd(), 'public');

const RATIO_TOLERANCE = 0.005;
const MIN_ALT_WORDS = 4;

const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

async function auditSource(
  label: string,
  source: ImageSource,
  /** null for ratio-agnostic assets — drawings, which are one
   *  deliverable rather than an art-directed crop pair. */
  expectedRatio: number | null,
  role: ImageRole,
): Promise<void> {
  const path = join(PUBLIC_DIR, source.src);

  if (!existsSync(path)) {
    fail(`${label}: file not found at ${source.src}`);
    return;
  }

  const metadata = await sharp(path).metadata();
  const { width, height, space, hasProfile } = metadata;

  if (width === undefined || height === undefined) {
    fail(`${label}: could not read dimensions`);
    return;
  }

  /* Reserved space depends on these matching exactly. */
  if (width !== source.width || height !== source.height) {
    fail(
      `${label}: declared ${source.width}x${source.height}, file is ${width}x${height}. Reserved space would be wrong and CLS would not be zero.`,
    );
  }

  if (expectedRatio !== null) {
    const ratio = width / height;
    if (Math.abs(ratio - expectedRatio) > RATIO_TOLERANCE) {
      fail(
        `${label}: aspect ratio ${ratio.toFixed(4)}, expected ${expectedRatio.toFixed(4)}. Compose both ratios on the day; do not crop.`,
      );
    }
  }

  const minLongEdge = IMAGE_ROLE_MIN_LONG_EDGE[role];
  const longEdge = Math.max(width, height);
  if (longEdge < minLongEdge) {
    fail(
      `${label}: long edge ${longEdge}px, minimum ${minLongEdge}px for role "${role}".`,
    );
  }

  if (space !== 'srgb') {
    fail(`${label}: colour space is "${space ?? 'unknown'}", expected sRGB.`);
  }

  if (hasProfile !== true) {
    fail(`${label}: no embedded colour profile.`);
  }
}

function auditAlt(label: string, alt: Localized<string>): void {
  for (const locale of LOCALES) {
    const text = alt[locale].trim();
    if (text.length === 0) {
      fail(`${label}: alt text missing for locale "${locale}".`);
      continue;
    }
    if (text.split(/\s+/).length < MIN_ALT_WORDS) {
      fail(
        `${label}: alt text for "${locale}" is too short to carry the argument. Alt text is editorial copy, not metadata.`,
      );
    }
  }
}

async function main(): Promise<void> {
  /* The homepage hero — displayed full-viewport, same as a project
     hero, so it's held to the same 'hero' resolution floor. This was
     previously unchecked: `home.heroImage` isn't a project image, so
     it wasn't touched by the loop below, and a declared-vs-actual
     dimension mismatch shipped silently as a result. */
  await auditSource('home.heroImage', home.heroImage, null, 'hero');

  if (projects.length === 0) {
    console.log('Asset audit: no published projects. Nothing to check.');
    return;
  }

  for (const project of projects) {
    for (const image of project.images) {
      const label = `${project.slug}/${image.id}`;
      await auditSource(`${label} [3:2]`, image.landscape, 3 / 2, image.role);
      await auditSource(`${label} [4:5]`, image.portrait, 4 / 5, image.role);
      auditAlt(label, image.alt);
    }

    for (const detail of project.details ?? []) {
      await auditSource(
        `${project.slug}/${detail.id} [1:1]`,
        detail.square,
        1,
        detail.role,
      );
      auditAlt(`${project.slug}/${detail.id}`, detail.alt);
    }

    for (const plan of project.plans ?? []) {
      /* Ratio-agnostic: a floor plan is one deliverable, not an
         art-directed crop pair — skip the 3:2/4:5 assertion. */
      await auditSource(`${project.slug}/${plan.id} [drawing]`, plan.image, null, plan.role);
      auditAlt(`${project.slug}/${plan.id}`, plan.alt);
    }

    const ogPath = join(PUBLIC_DIR, project.openGraphImage);
    if (!existsSync(ogPath)) {
      fail(
        `${project.slug}: Open Graph image missing at ${project.openGraphImage}. The WhatsApp unfurl is the true first impression.`,
      );
    }
  }

  if (failures.length > 0) {
    console.error('\nAsset audit failed:\n');
    for (const failure of failures) {
      console.error(`  · ${failure}`);
    }
    console.error(`\n${failures.length} problem(s). Build stopped.\n`);
    process.exit(1);
  }

  console.log(`Asset audit passed: ${projects.length} project(s).`);
}

void main();
