import type { Locale, Specification as SpecificationData } from '@/content/types';
import { ui } from '@/content/ui';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Figures, Label } from '@/components/primitives/Figures';

/** Not part of UiStrings — a single unit word, not an interface label. */
const WEEKS: Record<Locale, string> = { en: 'weeks', id: 'minggu' };
const DAYS: Record<Locale, string> = { en: 'days', id: 'hari' };

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface Row {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

function buildRows(spec: SpecificationData, locale: Locale): readonly Row[] {
  const rows: Row[] = [
    { key: 'area', label: ui.area[locale], value: `${String(spec.area.value)} m²` },
    {
      key: 'programme',
      label: ui.programme[locale],
      value: `${String(spec.programme.value)} ${WEEKS[locale]}`,
    },
  ];

  if (spec.kind === 'hospitality') {
    rows.push({ key: 'seats', label: ui.seats[locale], value: String(spec.seats) });
    if (spec.coversPerService !== undefined) {
      rows.push({
        key: 'covers',
        label: ui.coversPerService[locale],
        value: String(spec.coversPerService),
      });
    }
    rows.push({
      key: 'handover',
      label: ui.handoverToOpening[locale],
      value: `${String(spec.daysHandoverToOpening)} ${DAYS[locale]}`,
    });
    rows.push({
      key: 'opened',
      label: ui.opened[locale],
      value: formatDate(spec.openedOn, locale),
    });
  }

  if (spec.kind === 'residential') {
    if (spec.bedrooms !== undefined) {
      rows.push({ key: 'bedrooms', label: ui.bedrooms[locale], value: String(spec.bedrooms) });
    }
    if (spec.storeys !== undefined) {
      rows.push({ key: 'storeys', label: ui.storeys[locale], value: String(spec.storeys) });
    }
    rows.push({
      key: 'occupied',
      label: ui.occupiedSince[locale],
      value: formatDate(spec.occupiedSince, locale),
    });
  }

  if (spec.kind === 'development') {
    rows.push({ key: 'units', label: ui.units[locale], value: String(spec.units) });
    if (spec.buildings !== undefined) {
      rows.push({ key: 'buildings', label: ui.buildings[locale], value: String(spec.buildings) });
    }
    if (spec.phase !== undefined) {
      rows.push({ key: 'phase', label: ui.phase[locale], value: spec.phase[locale] });
    }
    rows.push({
      key: 'handedOver',
      label: ui.handedOver[locale],
      value: formatDate(spec.handedOverOn, locale),
    });
  }

  return rows;
}

/**
 * Section type 16 — Specification. Completes a section named in the
 * original "eight-type" budget but never implemented: the labels
 * below (`ui.area`, `ui.programme`, etc.) were authored in
 * `content/ui.ts` from the start and unused until now. Renders the
 * buyer-appropriate figures from a project's discriminated
 * `Specification` — hospitality, residential and development each see
 * only the evidence that reads as relevant to them.
 */
export function Specification({
  specification,
  locale,
}: {
  specification: SpecificationData;
  locale: Locale;
}) {
  const rows = buildRows(specification, locale);

  return (
    <section className="pb-9 tablet:pb-10 desktop:pb-11">
      <Container>
        <Grid>
          <Measure>
            <Label>{ui.specificationHeading[locale]}</Label>
            <dl className="mt-5 flex flex-col">
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-baseline justify-between gap-4 border-t border-hairline py-3 first:border-t-0"
                >
                  <dt className="font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                    {row.label}
                  </dt>
                  <dd className="font-grotesque text-spec text-ink desktop:text-spec-desktop">
                    <Figures>{row.value}</Figures>
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
