import type { Locale, ProjectImage } from '@/content/types';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { MarginColumn } from '@/components/primitives/MarginColumn';
import { RevealImage } from '@/components/primitives/RevealImage';

/**
 * Section type 3 of the permitted eight.
 *
 * An image within the structural grid — columns 1–8, not full bleed —
 * with its caption set in the quiet margin column beside it. Used for
 * the project page's Gallery — the image sequence within a project
 * page. `hoverZoom` (behaviour 11 of the motion budget) is opt-in and
 * forwarded to `RevealImage`; default `false` keeps every other use
 * of this component unchanged.
 */
export function CaptionedImage({
  image,
  locale,
  hoverZoom = false,
}: {
  image: ProjectImage;
  locale: Locale;
  hoverZoom?: boolean;
}) {
  return (
    <section className="pb-9 tablet:pb-10 desktop:pb-11">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-8">
            <RevealImage
              image={image}
              locale={locale}
              sizes="(min-width: 1024px) 66vw, 100vw"
              hoverZoom={hoverZoom}
            />
          </div>
          {image.caption !== undefined && (
            <MarginColumn>
              <p className="mt-3 font-grotesque text-caption text-ink-3 desktop:mt-0 desktop:text-caption-desktop">
                {image.caption[locale]}
              </p>
            </MarginColumn>
          )}
        </Grid>
      </Container>
    </section>
  );
}
