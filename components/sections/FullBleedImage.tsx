import type { Locale, ProjectImage } from '@/content/types';
import { RevealImage } from '@/components/primitives/RevealImage';

/**
 * Section type 2 of the permitted eight.
 *
 * A single image running to the viewport edge — the opening frame of a
 * project page. Structural content stops at the container; images are
 * exempt, per the design system.
 */
export function FullBleedImage({
  image,
  locale,
  priority = false,
}: {
  image: ProjectImage;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <section className="pb-9 tablet:pb-10 desktop:pb-11">
      <RevealImage image={image} locale={locale} priority={priority} fullBleed sizes="100vw" />
    </section>
  );
}
