import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';

export interface TestimonialItem {
  readonly id: string;
  readonly quote: string;
  readonly attribution: string;
}

/**
 * Section type 12 — Testimonials. Flat `--color-card` panels: a tonal
 * shift only, no border/radius/shadow, so this stays outside the "no
 * cards" prohibition in spirit — it reads as a recessed panel, not a
 * dashboard card.
 *
 * Renders nothing if `items` is empty, so an unpublished testimonials
 * list simply omits the section rather than showing an empty shell.
 */
export function Testimonials({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: readonly TestimonialItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="pb-9 pt-9 tablet:pb-10 tablet:pt-10 desktop:pb-11 desktop:pt-11">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-12">
            <span className="label-case font-grotesque text-caption font-semibold text-ink-3 desktop:text-caption-desktop">
              {eyebrow}
            </span>
          </div>
        </Grid>

        <div className="mt-7 tablet:mt-8">
          <Grid>
            {items.map((item) => (
              <div
                key={item.id}
                className="col-span-4 bg-card p-6 tablet:col-span-4 desktop:col-span-4 desktop:p-7"
              >
                <p className="text-lead text-ink desktop:text-lead-desktop">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-5 font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {item.attribution}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
