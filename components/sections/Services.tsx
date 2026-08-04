import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Figures } from '@/components/primitives/Figures';

export interface ServiceItem {
  readonly id: string;
  /** Pre-formatted ('01', '02'…) — never locale-dependent numeral formatting. */
  readonly number: string;
  readonly heading: string;
  readonly body: string;
}

/**
 * Section type 10 — Services. "Minimal icons" delivered as large
 * tabular numerals rather than a new icon set — keeps the README's
 * "no icon library, one glyph reserved for next-project" rule intact.
 */
export function Services({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: readonly ServiceItem[];
}) {
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
              <div key={item.id} className="col-span-4 tablet:col-span-4 desktop:col-span-3">
                <Figures>
                  <span className="font-serif text-display text-ink-3 desktop:text-display-desktop">
                    {item.number}
                  </span>
                </Figures>
                <h3 className="mt-4 font-serif text-title font-medium text-ink desktop:text-title-desktop">
                  {item.heading}
                </h3>
                <p className="mt-3 font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {item.body}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
