#!/usr/bin/env tsx
/**
 * LARK STUDIO — IMAGE METADATA SYNC
 *
 * Renders get replaced; the widths/heights typed into content files
 * don't update themselves. This script is the mechanical half of that
 * problem: it reads every image actually on disk, compares it against
 * the `width`/`height` declared in `content/pages/home.ts` and
 * `content/projects/*.ts`, and rewrites ONLY those two numbers where
 * they've drifted from reality.
 *
 * What it will NOT do, on purpose:
 *   - Invent a filename for a reference that no longer resolves. That
 *     is reported, not guessed at.
 *   - "Fix" an aspect-ratio mismatch by touching declared dimensions.
 *     A 3:2 slot holding a file that isn't 3:2 is a photography
 *     problem, not a metadata problem — silently updating the numbers
 *     would hide a bad crop instead of surfacing it.
 *   - Upscale or otherwise regenerate an under-resolution hero image.
 *   - Touch scripts/audit-assets.ts. That file's rules are the
 *     specification; this script exists to help content conform to
 *     it, not the other way round.
 *
 * Run directly (`tsx scripts/sync-image-metadata.ts`), then run
 * `npm run audit:assets` to confirm the remaining, genuine problems
 * this script deliberately left alone.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

import { home } from '../content/pages/home.js';
import { waroengAndalan } from '../content/projects/waroeng-andalan.js';
import { amadya } from '../content/projects/amadya.js';
import { thePrasetyos } from '../content/projects/the-prasetyos.js';
import { kintaroCafe } from '../content/projects/kintaro-cafe.js';
import { atomicCafe } from '../content/projects/atomic-cafe.js';
import { mrsDHouse } from '../content/projects/mrs-d-house.js';
import { msRaHouse } from '../content/projects/ms-ra-house.js';
import { mrYpHouse } from '../content/projects/mr-yp-house.js';
import { IMAGE_ROLE_MIN_LONG_EDGE } from '../content/types.js';
import type { ImageSource, Project } from '../content/types.js';

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, 'public');
const RATIO_TOLERANCE = 0.005;

/* Every project file, imported directly — not the published-only
   registry from content/projects/index.ts — so an unpublished draft
   still gets its metadata synced. */
const ALL_PROJECTS: readonly Project[] = [
  waroengAndalan,
  amadya,
  thePrasetyos,
  kintaroCafe,
  atomicCafe,
  mrsDHouse,
  msRaHouse,
  mrYpHouse,
];

interface ImageRef {
  readonly contentFile: string;
  readonly contentFileLabel: string;
  readonly label: string;
  readonly source: ImageSource;
  /** null = ratio-agnostic (hero, plans) — not checked. */
  readonly expectedRatio: number | null;
  readonly isHeroRole: boolean;
}

function collectRefs(): readonly ImageRef[] {
  const refs: ImageRef[] = [];

  const homeFile = join(ROOT, 'content/pages/home.ts');
  refs.push({
    contentFile: homeFile,
    contentFileLabel: 'content/pages/home.ts',
    label: 'home.heroImage',
    source: home.heroImage,
    expectedRatio: null,
    isHeroRole: true,
  });

  for (const project of ALL_PROJECTS) {
    const file = join(ROOT, `content/projects/${project.slug}.ts`);
    const fileLabel = `content/projects/${project.slug}.ts`;

    for (const image of project.images) {
      refs.push({
        contentFile: file,
        contentFileLabel: fileLabel,
        label: `${project.slug}/${image.id} [landscape 3:2]`,
        source: image.landscape,
        expectedRatio: 3 / 2,
        isHeroRole: image.role === 'hero',
      });
      refs.push({
        contentFile: file,
        contentFileLabel: fileLabel,
        label: `${project.slug}/${image.id} [portrait 4:5]`,
        source: image.portrait,
        expectedRatio: 4 / 5,
        isHeroRole: image.role === 'hero',
      });
    }

    for (const detail of project.details ?? []) {
      refs.push({
        contentFile: file,
        contentFileLabel: fileLabel,
        label: `${project.slug}/${detail.id} [square 1:1]`,
        source: detail.square,
        expectedRatio: 1,
        isHeroRole: false,
      });
    }

    for (const plan of project.plans ?? []) {
      refs.push({
        contentFile: file,
        contentFileLabel: fileLabel,
        label: `${project.slug}/${plan.id} [drawing]`,
        source: plan.image,
        expectedRatio: null,
        isHeroRole: false,
      });
    }
  }

  return refs;
}

function walkImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkImages(full));
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Rewrites ONLY the width/height numbers immediately following the
 *  given `src` string. Each src is a unique literal, so this cannot
 *  cross-match a different image's declaration. */
function updateDimensions(filePath: string, src: string, width: number, height: number): boolean {
  const text = readFileSync(filePath, 'utf8');
  const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(src:\\s*'${escapedSrc}',\\s*width:\\s*)\\d+(,\\s*height:\\s*)\\d+`);
  if (!pattern.test(text)) return false;
  writeFileSync(filePath, text.replace(pattern, `$1${String(width)}$2${String(height)}`), 'utf8');
  return true;
}

export interface SyncReport {
  readonly checked: number;
  readonly updated: readonly { label: string; src: string; from: string; to: string }[];
  readonly inSync: readonly string[];
  readonly missing: readonly string[];
  readonly ratioMismatches: readonly { label: string; src: string; actual: string; expected: string }[];
  readonly heroBelowMinimum: readonly { label: string; src: string; longEdge: number; minimum: number }[];
  readonly updateFailed: readonly string[];
  readonly orphaned: readonly string[];
}

/**
 * The reusable half of this script — everything except the CLI report
 * printing. `scripts/generate-assets.ts` calls this directly after
 * writing new production images, rather than shelling out to
 * `npm run sync:images`, so the two stay in one process and one
 * source of truth for "what does synced mean".
 */
export async function syncImageMetadata(): Promise<SyncReport> {
  const refs = collectRefs();

  const missing: string[] = [];
  const updated: { label: string; src: string; from: string; to: string }[] = [];
  const ratioMismatches: { label: string; src: string; actual: string; expected: string }[] = [];
  const heroBelowMinimum: { label: string; src: string; longEdge: number; minimum: number }[] = [];
  const inSync: string[] = [];
  const updateFailed: string[] = [];

  for (const ref of refs) {
    const diskPath = join(PUBLIC_DIR, ref.source.src);

    if (!existsSync(diskPath)) {
      missing.push(`${ref.label}: ${ref.source.src} (declared in ${ref.contentFileLabel})`);
      continue;
    }

    const metadata = await sharp(diskPath).metadata();
    const { width, height } = metadata;

    if (width === undefined || height === undefined) {
      missing.push(`${ref.label}: ${ref.source.src} — file exists but dimensions could not be read`);
      continue;
    }

    if (ref.isHeroRole) {
      const longEdge = Math.max(width, height);
      if (longEdge < IMAGE_ROLE_MIN_LONG_EDGE.hero) {
        heroBelowMinimum.push({
          label: ref.label,
          src: ref.source.src,
          longEdge,
          minimum: IMAGE_ROLE_MIN_LONG_EDGE.hero,
        });
      }
    }

    let ratioOk = true;
    if (ref.expectedRatio !== null) {
      const actualRatio = width / height;
      if (Math.abs(actualRatio - ref.expectedRatio) > RATIO_TOLERANCE) {
        ratioOk = false;
        ratioMismatches.push({
          label: ref.label,
          src: ref.source.src,
          actual: actualRatio.toFixed(4),
          expected: ref.expectedRatio.toFixed(4),
        });
      }
    }

    const dimsMatch = width === ref.source.width && height === ref.source.height;
    if (dimsMatch) {
      inSync.push(ref.label);
      continue;
    }

    if (!ratioOk) {
      /* Ratio-mismatched images are left completely untouched — no
         metadata write — so the audit's ratio check still catches
         them on the next run instead of being quietly reconciled
         away. */
      continue;
    }

    const from = `${String(ref.source.width)}x${String(ref.source.height)}`;
    const to = `${String(width)}x${String(height)}`;
    const ok = updateDimensions(ref.contentFile, ref.source.src, width, height);
    if (ok) {
      updated.push({ label: ref.label, src: ref.source.src, from, to });
    } else {
      updateFailed.push(
        `${ref.label}: found on disk (${to}) but could not locate its declaration pattern in ${ref.contentFileLabel} to rewrite`,
      );
    }
  }

  const allDiskImages = walkImages(join(PUBLIC_DIR, 'images'));
  const referenced = new Set(refs.map((r) => join(PUBLIC_DIR, r.source.src)));
  const orphaned = allDiskImages.filter((p) => !referenced.has(p)).map((p) => relative(PUBLIC_DIR, p));

  return {
    checked: refs.length,
    updated,
    inSync,
    missing,
    ratioMismatches,
    heroBelowMinimum,
    updateFailed,
    orphaned,
  };
}

export function printSyncReport(report: SyncReport): void {
  console.log('\n=== Lark Studio — image metadata sync ===\n');

  console.log(`Checked ${String(report.checked)} declared image(s) against public/images/.\n`);

  if (report.updated.length > 0) {
    console.log(`Updated (${String(report.updated.length)}) — declared width/height rewritten to match the file:`);
    for (const u of report.updated) {
      console.log(`  · ${u.label}: ${u.from} → ${u.to}`);
    }
    console.log('');
  }

  if (report.inSync.length > 0) {
    console.log(`Already in sync (${String(report.inSync.length)}).\n`);
  }

  if (report.missing.length > 0) {
    console.log(`MISSING FILES (${String(report.missing.length)}) — declared in content but not found on disk. Not invented, not touched:`);
    for (const m of report.missing) {
      console.log(`  · ${m}`);
    }
    console.log('');
  }

  if (report.ratioMismatches.length > 0) {
    console.log(`ASPECT RATIO MISMATCHES (${String(report.ratioMismatches.length)}) — metadata left unchanged, needs a human decision:`);
    for (const r of report.ratioMismatches) {
      console.log(`  · ${r.label}: ${r.src}`);
      console.log(`      actual ratio ${r.actual}, expected ${r.expected}`);
    }
    console.log('');
  }

  if (report.heroBelowMinimum.length > 0) {
    console.log(`HERO IMAGES BELOW MINIMUM RESOLUTION (${String(report.heroBelowMinimum.length)}) — not upscaled:`);
    for (const h of report.heroBelowMinimum) {
      console.log(`  · ${h.label}: ${h.src} — long edge ${String(h.longEdge)}px, minimum ${String(h.minimum)}px`);
    }
    console.log('');
  }

  if (report.updateFailed.length > 0) {
    console.log(`COULD NOT UPDATE (${String(report.updateFailed.length)}) — needs manual attention:`);
    for (const f of report.updateFailed) {
      console.log(`  · ${f}`);
    }
    console.log('');
  }

  if (report.orphaned.length > 0) {
    console.log(`Files on disk under public/images/ not referenced by any content (${String(report.orphaned.length)}):`);
    for (const o of report.orphaned) {
      console.log(`  · ${o}`);
    }
    console.log('');
  }

  console.log('Sync complete. Run `npm run audit:assets` for the authoritative pass/fail.\n');
}

async function main(): Promise<void> {
  const report = await syncImageMetadata();
  printSyncReport(report);
}

/* Only auto-run when this file is executed directly (`tsx
   scripts/sync-image-metadata.ts` / `npm run sync:images`) — not when
   `scripts/generate-assets.ts` imports `syncImageMetadata` as a
   function. */
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
