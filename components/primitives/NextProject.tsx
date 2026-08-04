import Link from 'next/link';
import type { Locale, Project } from '@/content/types';
import { paths } from '@/lib/paths';
import { ui } from '@/content/ui';
import { RevealImage } from '@/components/primitives/RevealImage';
import { ArrowGlyph } from '@/components/primitives/ArrowGlyph';
import { Label } from '@/components/primitives/Figures';

/**
 * The second — and last — composite form: a next-project preview at
 * thumbnail scale, for the closing block of a project page.
 *
 * This is the only place a `thumbnail` role image appears, and the
 * reason the asset audit has a 1600px tier at all.
 *
 * The arrow is the entire iconography of the site, drawn to the
 * grotesque's stroke weight so it reads as typography.
 */
export function NextProject({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const preview = project.images[0];

  return (
    <Link href={paths.project(locale, project.slug)} className="group block">
      <div className="mb-4 flex items-center gap-3">
        <Label>{ui.nextProject[locale]}</Label>
        <ArrowGlyph className="text-ink-3" />
      </div>
      <RevealImage
        image={preview}
        locale={locale}
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <p className="mt-4 font-grotesque text-spec text-ink-2 transition-colors duration-120 ease-response group-hover:text-ink desktop:text-spec-desktop">
        {project.identification.name[locale]}
      </p>
    </Link>
  );
}
