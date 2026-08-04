import type { Credits as CreditsData, Locale } from '@/content/types';
import { ui } from '@/content/ui';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Label } from '@/components/primitives/Figures';

/**
 * Section type 17 — Credits. Also completes an already-budgeted,
 * previously unimplemented section — `ui.creditsHeading`/`photographer`/
 * `contractor` were authored from the start and unused until now.
 * Naming the contractor is required at the data layer (a required
 * field on `Credits` in `content/types.ts`) because the relationship
 * surviving the project is disproportionately persuasive; this
 * section is where that fact becomes visible.
 */
export function Credits({ credits, locale }: { credits: CreditsData; locale: Locale }) {
  return (
    <section className="pb-9 tablet:pb-10 desktop:pb-11">
      <Container>
        <Grid>
          <Measure>
            <Label>{ui.creditsHeading[locale]}</Label>
            <dl className="mt-5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {ui.photographer[locale]}
                </dt>
                <dd className="font-grotesque text-spec text-ink desktop:text-spec-desktop">
                  {credits.photographer}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {ui.contractor[locale]}
                </dt>
                <dd className="font-grotesque text-spec text-ink desktop:text-spec-desktop">
                  {credits.contractor}
                </dd>
              </div>
              {credits.consultants?.map((consultant) => (
                <div key={consultant.name} className="flex items-baseline justify-between gap-4">
                  <dt className="font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                    {consultant.discipline[locale]}
                  </dt>
                  <dd className="font-grotesque text-spec text-ink desktop:text-spec-desktop">
                    {consultant.name}
                  </dd>
                </div>
              ))}
            </dl>
          </Measure>
        </Grid>
      </Container>
    </section>
  );
}
