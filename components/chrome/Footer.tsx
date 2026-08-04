import type { Locale } from '@/content/types';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Navigation } from '@/components/chrome/Navigation';
import { LanguageToggle } from '@/components/chrome/LanguageToggle';
import { InlineLink } from '@/components/primitives/InlineLink';

/**
 * THE ONE INVERSE SURFACE ON THE SITE.
 *
 * Ink-on-paper is inverted here and nowhere else, as a closing
 * gesture. This was reserved in the design system precisely so that
 * it stays singular: if it appeared in three places it would become a
 * decorative device and the system would lose its single-surface
 * discipline. On the dark palette this inversion produces the site's
 * one bright surface — closing on a light band reads as deliberate
 * exactly the way closing on a dark one did before.
 *
 * Contrast on the inverse surface: paper 15.96:1, ink-3-inverse 4.68:1.
 * Both above AA at all sizes.
 *
 * "Large footer": bigger vertical rhythm and a display-scale wordmark,
 * not new columns. Structure (identity / nav / contact / copyright)
 * is unchanged — scale carries the weight, not added content.
 *
 * Note what is absent: no newsletter field, no social icons, no
 * sitemap column, no awards row. Contact is two channels, stated as
 * words rather than glyphs. Email is listed first for register;
 * WhatsApp carries equal weight because it is the actual domestic
 * channel.
 */
export function Footer({
  locale,
  email,
  whatsappHref,
  instagramHref,
  address,
}: {
  locale: Locale;
  email: string;
  whatsappHref: string;
  instagramHref: string;
  address: readonly string[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="lark-no-print mt-12 bg-inverse py-10 text-ink-inverse tablet:py-11">
      <Container>
        <Grid>
          <div className="col-span-4 flex flex-col gap-6 tablet:col-span-8 desktop:col-span-6">
            <span className="font-serif text-display font-medium tracking-none desktop:text-display-desktop">
              Lark Studio
            </span>
            <address className="font-grotesque text-spec not-italic text-ink-3-inverse">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="col-span-4 mt-9 tablet:col-span-4 tablet:mt-9 desktop:col-span-3 desktop:col-start-8 desktop:mt-0">
            <Navigation locale={locale} orientation="vertical" inverse />
          </div>

          <div className="col-span-4 mt-9 flex flex-col gap-3 font-grotesque text-spec tablet:col-span-4 tablet:mt-9 desktop:col-span-2 desktop:col-start-11 desktop:mt-0">
            <InlineLink href={`mailto:${email}`} external>
              <span className="text-ink-inverse">{email}</span>
            </InlineLink>
            <InlineLink href={whatsappHref} external>
              <span className="text-ink-inverse">WhatsApp</span>
            </InlineLink>
            <InlineLink href={instagramHref} external>
              <span className="text-ink-inverse">Instagram</span>
            </InlineLink>
            <div className="mt-4">
              <LanguageToggle locale={locale} inverse />
            </div>
          </div>

          <div className="col-span-4 mt-10 border-t border-hairline-inverse pt-5 tablet:col-span-8 tablet:mt-11 desktop:col-span-12">
            <p className="figures font-grotesque text-caption text-ink-3-inverse desktop:text-caption-desktop">
              © {year} Lark Studio
            </p>
          </div>
        </Grid>
      </Container>
    </footer>
  );
}
