#!/usr/bin/env tsx
/**
 * LARK STUDIO — PRODUCTION ASSET PIPELINE
 *
 * The designer-facing half of the photography workflow. A designer
 * drops exactly five renders per project into `assets/projects/<slug>/`
 * — `01.jpg` (hero) through `05.jpg` (gallery) — and this script does
 * everything from there: crops both art-directed ratios out of each
 * source, writes them to `public/images/projects/<slug>/` under the
 * filenames the site already expects, syncs the width/height declared
 * in `content/projects/*.ts` to match, and re-runs the asset audit
 * until it either passes or surfaces a genuine problem.
 *
 * What this script will never do, on purpose — these mirror the rules
 * in scripts/audit-assets.ts and scripts/sync-image-metadata.ts, not
 * by accident:
 *
 *   - Upscale SILENTLY. By default, every crop is computed against the
 *     source's real dimensions first; if the source can't yield the
 *     required resolution at the required ratio without enlargement,
 *     the specific output is skipped and reported. Nothing is invented
 *     without it being visible.
 *   - Stretch or distort. Both the 3:2 and 4:5 outputs are true crops
 *     (via sharp's `fit: 'cover'`), never a squashed resize — this
 *     holds even when upscaling is explicitly enabled below.
 *   - Touch scripts/audit-assets.ts. That file is read-only from here;
 *     it is the specification this pipeline is trying to satisfy.
 *   - Modify any content field other than an image's `width`/`height`
 *     — delegated entirely to `syncImageMetadata()` in
 *     scripts/sync-image-metadata.ts, which already enforces that.
 *
 * Run: `npm run generate-assets`.
 *
 * Pass `--allow-upscale` to explicitly permit enlarging sources that
 * are too small for their target crop, rather than skipping them. This
 * is NOT the default — a designer running the plain command still gets
 * the safe behaviour — and every upscaled output is called out by name
 * with its scale factor, both per-project and in the final summary, so
 * it can never end up in production silently. Use it only when you've
 * decided the quality tradeoff is acceptable; the report tells you
 * exactly what was enlarged and by how much so that decision is
 * informed, not accidental.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

import { syncImageMetadata, type SyncReport } from './sync-image-metadata.js';

const ROOT = process.cwd();
const SOURCE_ROOT = join(ROOT, 'assets', 'projects');
const OUTPUT_ROOT = join(ROOT, 'public', 'images', 'projects');

const NUMBERS = ['01', '02', '03', '04', '05'] as const;
type ImageNumber = (typeof NUMBERS)[number];

const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.JPG', '.JPEG'];

/* Fixed target dimensions — identical to the numbers already used
   throughout content/projects/*.ts, so a freshly generated image's
   ratio and role-minimum checks in audit-assets.ts pass by
   construction, not by luck. */
const TARGETS = {
  hero: {
    landscape: { width: 4200, height: 2800, suffix: '3x2' as const },
    portrait: { width: 3220, height: 4025, suffix: '4x5' as const },
  },
  gallery: {
    landscape: { width: 2700, height: 1800, suffix: '3x2' as const },
    portrait: { width: 2448, height: 3060, suffix: '4x5' as const },
  },
};

const JPEG_QUALITY = 82;

/* ------------------------------------------------------------------ *
 * Discovery
 * ------------------------------------------------------------------ */

function listProjectSlugs(): string[] {
  if (!existsSync(SOURCE_ROOT)) return [];
  return readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function resolveSourceImage(projectDir: string, number: ImageNumber): string | undefined {
  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = join(projectDir, `${number}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

/* ------------------------------------------------------------------ *
 * Crop planning — the no-upscale guarantee
 * ------------------------------------------------------------------ */

interface CropPlan {
  readonly ok: boolean;
  readonly reason?: string;
}

/**
 * Given a source's TRUE (post-EXIF-orientation) pixel dimensions,
 * determines whether a crop to `targetW`x`targetH` can be produced
 * without enlarging the source in either dimension. This is computed
 * independently of sharp's own `withoutEnlargement` flag — that flag
 * is kept on the actual `resize()` call too, as a second, redundant
 * guard, but the reasoning here is what produces a reportable, human
 * -readable reason rather than a silently smaller-than-requested file.
 */
export function planCrop(sourceW: number, sourceH: number, targetW: number, targetH: number): CropPlan {
  const targetRatio = targetW / targetH;
  const sourceRatio = sourceW / sourceH;

  const maxCrop =
    sourceRatio > targetRatio
      ? { w: sourceH * targetRatio, h: sourceH }
      : { w: sourceW, h: sourceW / targetRatio };

  if (maxCrop.w < targetW - 0.5 || maxCrop.h < targetH - 0.5) {
    return {
      ok: false,
      reason: `source is ${String(sourceW)}x${String(sourceH)}; the largest ${targetRatio.toFixed(3)}-ratio crop it can yield is ${String(Math.round(maxCrop.w))}x${String(Math.round(maxCrop.h))}, short of the required ${String(targetW)}x${String(targetH)}`,
    };
  }
  return { ok: true };
}

/** True EXIF-orientation-corrected dimensions, without relying on
 *  whether metadata() reflects a chained .rotate() call. */
function effectiveDimensions(meta: sharp.Metadata): { width: number; height: number } | undefined {
  if (meta.width === undefined || meta.height === undefined) return undefined;
  const swapped = meta.orientation !== undefined && meta.orientation >= 5 && meta.orientation <= 8;
  return swapped ? { width: meta.height, height: meta.width } : { width: meta.width, height: meta.height };
}

/* ------------------------------------------------------------------ *
 * Per-variant generation
 * ------------------------------------------------------------------ */

export type VariantResult =
  | { readonly ok: true; readonly bytes: number; readonly upscaled: false }
  | { readonly ok: true; readonly bytes: number; readonly upscaled: true; readonly scaleFactor: number }
  | { readonly ok: false; readonly reason: string };

export async function generateVariant(
  sourcePath: string,
  outputPath: string,
  targetWidth: number,
  targetHeight: number,
  allowUpscale = false,
): Promise<VariantResult> {
  try {
    const rawMeta = await sharp(sourcePath).metadata();
    const dims = effectiveDimensions(rawMeta);
    if (!dims) {
      return { ok: false, reason: 'could not read source dimensions' };
    }

    const plan = planCrop(dims.width, dims.height, targetWidth, targetHeight);
    const needsUpscale = !plan.ok;

    if (needsUpscale && !allowUpscale) {
      return { ok: false, reason: plan.reason ?? 'source is too small for this crop' };
    }

    /* The enlargement factor is reported against whatever dimension is
       actually the limiting one for this ratio, matching the shortfall
       `planCrop` already computed — not just width/width, which would
       understate the true scale-up on the constrained axis. */
    let scaleFactor = 1;
    if (needsUpscale) {
      const targetRatio = targetWidth / targetHeight;
      const sourceRatio = dims.width / dims.height;
      const maxCrop =
        sourceRatio > targetRatio
          ? { w: dims.height * targetRatio, h: dims.height }
          : { w: dims.width, h: dims.width / targetRatio };
      scaleFactor = Math.max(targetWidth / maxCrop.w, targetHeight / maxCrop.h);
    }

    const buffer = await sharp(sourcePath)
      .rotate() // bake in EXIF orientation, then the tag is dropped — not relied on downstream
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: sharp.strategy.attention,
        // Only skip the enlargement guard when explicitly told to —
        // this is the one line that differs between the safe default
        // and an authorised upscale.
        withoutEnlargement: !allowUpscale,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .withMetadata({ icc: 'srgb' }) // embeds sRGB, strips everything else (EXIF/XMP/IPTC)
      .toBuffer();

    const outMeta = await sharp(buffer).metadata();
    if (outMeta.width !== targetWidth || outMeta.height !== targetHeight) {
      return {
        ok: false,
        reason: `produced ${String(outMeta.width)}x${String(outMeta.height)} instead of ${String(targetWidth)}x${String(targetHeight)} — refused rather than upscale`,
      };
    }

    await writeFile(outputPath, buffer);
    return needsUpscale
      ? { ok: true, bytes: buffer.length, upscaled: true, scaleFactor }
      : { ok: true, bytes: buffer.length, upscaled: false };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

/* ------------------------------------------------------------------ *
 * Per-project orchestration
 * ------------------------------------------------------------------ */

interface ImageOutcome {
  readonly file: string;
  readonly ok: boolean;
  readonly bytes?: number;
  readonly reason?: string;
  readonly upscaled?: boolean;
  readonly scaleFactor?: number;
}

interface ProjectResult {
  readonly slug: string;
  readonly status: 'success' | 'partial' | 'failed-missing-source' | 'failed-no-outputs';
  readonly missingSource: readonly string[];
  readonly outcomes: readonly ImageOutcome[];
  readonly sourceBytesUsed: number;
}

async function processProject(slug: string, allowUpscale: boolean): Promise<ProjectResult> {
  const dir = join(SOURCE_ROOT, slug);

  const missingSource: string[] = [];
  const sourceFiles = new Map<ImageNumber, string>();
  for (const n of NUMBERS) {
    const found = resolveSourceImage(dir, n);
    if (found === undefined) {
      missingSource.push(`${n} (expected ${n}.jpg)`);
    } else {
      sourceFiles.set(n, found);
    }
  }

  if (missingSource.length > 0) {
    return { slug, status: 'failed-missing-source', missingSource, outcomes: [], sourceBytesUsed: 0 };
  }

  const outDir = join(OUTPUT_ROOT, slug);
  mkdirSync(outDir, { recursive: true });

  const outcomes: ImageOutcome[] = [];
  let sourceBytesUsed = 0;

  for (const n of NUMBERS) {
    const sourcePath = sourceFiles.get(n);
    if (sourcePath === undefined) continue; // unreachable — n was validated above
    sourceBytesUsed += statSync(sourcePath).size;

    const targets = n === '01' ? TARGETS.hero : TARGETS.gallery;

    for (const target of [targets.landscape, targets.portrait]) {
      const outFile = `${slug}-${n}-${target.suffix}.jpg`;
      const outPath = join(outDir, outFile);
      const result = await generateVariant(sourcePath, outPath, target.width, target.height, allowUpscale);
      outcomes.push(
        result.ok
          ? {
              file: outFile,
              ok: true,
              bytes: result.bytes,
              upscaled: result.upscaled,
              ...(result.upscaled && { scaleFactor: result.scaleFactor }),
            }
          : { file: outFile, ok: false, reason: result.reason },
      );
    }
  }

  const successCount = outcomes.filter((o) => o.ok).length;
  const status: ProjectResult['status'] =
    successCount === outcomes.length ? 'success' : successCount > 0 ? 'partial' : 'failed-no-outputs';

  return { slug, status, missingSource: [], outcomes, sourceBytesUsed };
}

/* ------------------------------------------------------------------ *
 * Validation loop and build
 * ------------------------------------------------------------------ */

interface CommandResult {
  readonly passed: boolean;
  readonly output: string;
}

function runNpmScript(script: string): CommandResult {
  /* A single command string with shell:true, not an args array — Node
     warns about unescaped arg concatenation when the two are combined.
     Nothing here is dynamic/user-supplied, so there's no injection
     risk either way, but the single-string form avoids the warning. */
  const result = spawnSync(`npm run ${script}`, { encoding: 'utf8', shell: true, cwd: ROOT });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return { passed: result.status === 0, output };
}

/** Only the "declared WxH, file is WxH" failure shape is something a
 *  re-sync can fix. Anything else (missing file, bad ratio, under
 *  minimum resolution, missing colour profile) is a real problem this
 *  pipeline already tried to prevent at generation time — looping
 *  sync against it would just spin without changing the outcome. */
function looksFixableBySync(auditOutput: string): boolean {
  const failureLines = auditOutput.split('\n').filter((line) => line.trim().startsWith('·'));
  if (failureLines.length === 0) return false;
  return failureLines.every((line) => line.includes('declared') && line.includes('file is'));
}

async function validateWithRetry(): Promise<{ audit: CommandResult; syncAttempts: number }> {
  let audit = runNpmScript('audit:assets');
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  while (!audit.passed && attempts < MAX_ATTEMPTS && looksFixableBySync(audit.output)) {
    await syncImageMetadata();
    audit = runNpmScript('audit:assets');
    attempts += 1;
  }

  return { audit, syncAttempts: attempts };
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function printProjectReport(result: ProjectResult): void {
  console.log('----------------------------------------');

  if (result.status === 'failed-missing-source') {
    console.log(`✗ ${result.slug}`);
    console.log(`  MISSING SOURCE IMAGE(S): ${result.missingSource.join(', ')}`);
    console.log('  Skipped — no assets generated for this project.');
    return;
  }

  const succeeded = result.outcomes.filter((o) => o.ok);
  const failed = result.outcomes.filter((o) => !o.ok);
  const upscaled = result.outcomes.filter((o) => o.upscaled === true);
  const outputBytes = succeeded.reduce((sum, o) => sum + (o.bytes ?? 0), 0);
  const marker = result.status === 'success' ? '✓' : result.status === 'partial' ? '△' : '✗';

  console.log(`${marker} ${result.slug}`);
  console.log(`  ${String(succeeded.length)}/${String(result.outcomes.length)} production images generated`);

  if (succeeded.length > 0) {
    const ratio = result.sourceBytesUsed > 0 ? result.sourceBytesUsed / outputBytes : 0;
    console.log(`  Compression ratio: ${ratio.toFixed(2)}:1 (source → output)`);
    console.log(`  Average output size: ${formatBytes(outputBytes / succeeded.length)}`);
  }

  if (upscaled.length > 0) {
    console.log(`  ⚠ UPSCALED (${String(upscaled.length)}) — enlarged beyond native source resolution:`);
    for (const u of upscaled) {
      console.log(`    ⚠ ${u.file}: ${(u.scaleFactor ?? 1).toFixed(2)}x enlargement`);
    }
  }

  if (failed.length > 0) {
    console.log(`  Warnings (${String(failed.length)}):`);
    for (const f of failed) {
      console.log(`    · ${f.file}: ${f.reason ?? 'unknown error'}`);
    }
  } else if (upscaled.length === 0) {
    console.log('  Warnings: none');
  }
}

function printSyncSummary(report: SyncReport): void {
  console.log('----------------------------------------');
  console.log('Metadata sync (content/projects/*.ts, content/pages/home.ts)');
  console.log(`  ${String(report.updated.length)} updated, ${String(report.inSync.length)} already correct`);
  if (report.missing.length > 0) {
    console.log(`  ${String(report.missing.length)} declared file(s) still missing on disk (unrelated to this run's projects, or a skipped crop above)`);
  }
  if (report.ratioMismatches.length > 0) {
    console.log(`  ${String(report.ratioMismatches.length)} aspect-ratio mismatch(es) left untouched — needs a human decision`);
  }
  if (report.heroBelowMinimum.length > 0) {
    console.log(`  ${String(report.heroBelowMinimum.length)} hero image(s) below the minimum resolution — not upscaled`);
  }
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const allowUpscale = process.argv.includes('--allow-upscale');

  console.log('\n=== Lark Studio — production asset pipeline ===\n');
  if (allowUpscale) {
    console.log('⚠ --allow-upscale is set: sources too small for their target crop will be');
    console.log('  enlarged rather than skipped. Every enlarged file is flagged below and in');
    console.log('  the summary — this is not the default behaviour.\n');
  }

  const slugs = listProjectSlugs();
  if (slugs.length === 0) {
    console.log(`No project folders found under ${relative(ROOT, SOURCE_ROOT)}/. Nothing to generate.`);
    console.log('Designer workflow: assets/projects/<slug>/01.jpg … 05.jpg, then `npm run generate-assets`.\n');
    return;
  }

  console.log(`Found ${String(slugs.length)} project folder(s): ${slugs.join(', ')}\n`);

  const results: ProjectResult[] = [];
  for (const slug of slugs) {
    results.push(await processProject(slug, allowUpscale));
  }

  for (const result of results) {
    printProjectReport(result);
  }

  console.log('----------------------------------------\n');

  const allUpscaled = results.flatMap((r) =>
    r.outcomes.filter((o) => o.upscaled === true).map((o) => ({ slug: r.slug, ...o })),
  );
  if (allUpscaled.length > 0) {
    console.log(`⚠ ${String(allUpscaled.length)} image(s) were upscaled beyond native source resolution:`);
    for (const u of allUpscaled) {
      console.log(`  ⚠ ${u.slug}/${u.file}: ${(u.scaleFactor ?? 1).toFixed(2)}x`);
    }
    console.log('');
  }

  const anyGenerated = results.some((r) => r.outcomes.some((o) => o.ok));
  let syncReport: SyncReport | undefined;
  let audit: CommandResult = { passed: true, output: '' };
  let build: CommandResult = { passed: true, output: '(skipped — nothing was generated)' };

  if (anyGenerated) {
    syncReport = await syncImageMetadata();
    printSyncSummary(syncReport);

    console.log('\nRunning asset audit…');
    const { audit: auditResult, syncAttempts } = await validateWithRetry();
    audit = auditResult;
    if (syncAttempts > 0) {
      console.log(`(metadata re-synced ${String(syncAttempts)} time(s) during validation)`);
    }
    console.log(audit.passed ? 'Audit: PASSED' : 'Audit: FAILED');
    if (!audit.passed) {
      console.log(audit.output.trim());
    }

    if (audit.passed) {
      console.log('\nRunning production build…');
      build = runNpmScript('build');
      console.log(build.passed ? 'Build: PASSED' : 'Build: FAILED');
      if (!build.passed) {
        console.log(build.output.trim().split('\n').slice(-40).join('\n'));
      }
    } else {
      build = { passed: false, output: 'skipped — audit did not pass' };
      console.log('Build: SKIPPED (audit did not pass)');
    }
  } else {
    console.log('No images were generated this run — skipping metadata sync, audit and build.');
  }

  console.log('\n=== Summary ===\n');
  const failedProjects = results.filter((r) => r.status !== 'success');
  const successfulProjects = results.filter((r) => r.status === 'success');

  console.log(`Projects processed: ${String(results.length)}`);
  console.log(`  Fully generated: ${String(successfulProjects.length)}`);
  if (failedProjects.length > 0) {
    console.log(`  Failed or partial: ${String(failedProjects.length)} — ${failedProjects.map((p) => p.slug).join(', ')}`);
  }
  if (allUpscaled.length > 0) {
    console.log(`  Upscaled: ${String(allUpscaled.length)} image(s) — see ⚠ list above, --allow-upscale was set`);
  }
  console.log(`Audit: ${audit.passed ? 'passed' : 'FAILED'}`);
  console.log(`Build: ${build.passed ? 'passed' : 'FAILED'}`);
  console.log('');

  const ok = failedProjects.length === 0 && audit.passed && build.passed;
  process.exitCode = ok ? 0 : 1;
}

/* Only auto-run when executed directly (`npm run generate-assets`) —
   not when another script imports generateVariant/planCrop for
   testing, the way scripts/tmp-validate-happy-path.ts does. */
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
