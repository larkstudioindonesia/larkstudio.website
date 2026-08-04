import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { paths, whatsappLink } from '@/lib/paths';
import { contact } from '@/content/pages/contact';
import { ui } from '@/content/ui';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Statement } from '@/components/sections/Statement';
import { FramedAction } from '@/components/primitives/FramedAction';

/**
 * Contact is two channels, stated as words. No form, no fields to
 * qualify a lead — the prompts do that work by naming what is useful
 * in a first message. This is the one page that ends without a
 * ClosingBlock: it is already the destination the CTA elsewhere points to.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    title: ui.navContact[locale],
    description: contact.statement[locale],
    path: paths.contact(locale),
    locale,
    openGraphImage: contact.openGraphImage,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const whatsappHref = whatsappLink(contact.whatsapp, contact.whatsappOpener[locale]);

  return (
    <>
      <Statement paragraphs={[contact.statement[locale]]} />

      <section className="pb-10 tablet:pb-11">
        <Container>
          <Grid>
            <Measure>
              <ul className="flex flex-col gap-2">
                {contact.prompts[locale].map((prompt) => (
                  <li
                    key={prompt}
                    className="font-grotesque text-spec text-ink-2 desktop:text-spec-desktop"
                  >
                    {prompt}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-4">
                <FramedAction href={`mailto:${contact.email}`} external>
                  {contact.email}
                </FramedAction>
                <FramedAction href={whatsappHref} external>
                  WhatsApp
                </FramedAction>
              </div>
            </Measure>
          </Grid>
        </Container>
      </section>
    </>
  );
}
