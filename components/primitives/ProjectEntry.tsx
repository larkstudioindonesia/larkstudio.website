import Link from 'next/link';
import type { Locale, Project } from '@/content/types';
import { paths } from '@/lib/paths';
import { RevealImage } from '@/components/primitives/RevealImage';
import { Figures } from '@/components/primitives/Figures';

/**
 * THE ONE REPEATING COMPOSITE OBJECT ON THIS SITE.
 *
 * This is what the design system has instead of a card. Cards are
 * dashboard vocabulary — containers whose purpose is to make
 * heterogeneous content look uniform inside a grid. With four to six
 * projects at full-viewport scale there is no grid, no heterogeneity,
 * and nothing to contain. A card would also reintroduce the border,
 * radius, shadow and background the system removed.
 *
 * So: a full-width image, then a single grotesque line of
 * identification beneath it, set in the measure column. No border, no
 * background, no hover overlay, no `View project` label. The entire
 * entry is the target.
 *
 * Hover moves the identification line from ink-2 to ink over 120ms.
 * THE IMAGE DOES NOTHING — no zoom, no fade, no overlay. Scale is
 * prohibited on all content: it is the defining gesture of decorative
 * web motion and it dates fastest.
 */
export function ProjectEntry({
  project,
  locale,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  priority?: boolean;
}) {
  const { identification } = project;
  const opening = project.images[0];

  return (
    <article>
      <Link href={paths.project(locale, project.slug)} className="group block">
        <RevealImage
          image={opening}
          locale={locale}
          priority={priority}
          fullBleed
          sizes="100vw"
        />
        <h2 className="mt-4 px-5 font-grotesque text-spec text-ink-2 transition-colors duration-120 ease-response group-hover:text-ink tablet:px-7 desktop:px-8 desktop:text-spec-desktop wide:px-9">
          {identification.name[locale]}
          <span aria-hidden="true"> · </span>
          {identification.type[locale]}
          <span aria-hidden="true"> · </span>
          {identification.location[locale]}
          <span aria-hidden="true"> · </span>
          <Figures>{identification.year}</Figures>
        </h2>
      </Link>
    </article>
  );
}
