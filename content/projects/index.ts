import type { Project, ProjectSlug } from '@/content/types';

/* Projects are listed in display order, matching the company profile. */
import { waroengAndalan } from '@/content/projects/waroeng-andalan';
import { amadya } from '@/content/projects/amadya';
import { thePrasetyos } from '@/content/projects/the-prasetyos';
import { kintaroCafe } from '@/content/projects/kintaro-cafe';
import { atomicCafe } from '@/content/projects/atomic-cafe';
import { mrsDHouse } from '@/content/projects/mrs-d-house';
import { msRaHouse } from '@/content/projects/ms-ra-house';
import { mrYpHouse } from '@/content/projects/mr-yp-house';

const REGISTRY = [
  waroengAndalan,
  amadya,
  thePrasetyos,
  kintaroCafe,
  atomicCafe,
  mrsDHouse,
  msRaHouse,
  mrYpHouse,
] as const satisfies readonly Project[];

/** Slugs are permanent: lowercase Latin, hyphen separated, no diacritics. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const project of REGISTRY) {
  if (!SLUG_PATTERN.test(project.slug)) {
    throw new Error(
      `Invalid project slug: "${project.slug}". Slugs are permanent and must be lowercase Latin, hyphen separated.`,
    );
  }
}

export const projects: readonly Project[] = REGISTRY.filter((p) => p.published);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function projectSlugs(): readonly ProjectSlug[] {
  return projects.map((project) => project.slug);
}

/** Every page ends with complete navigation — the mitigation for a
 *  header that does not persist. Wraps at the end of the list. */
export function nextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}
