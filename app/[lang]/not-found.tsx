import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { FramedAction } from '@/components/primitives/FramedAction';
import { ui } from '@/content/ui';
import { paths } from '@/lib/paths';
import { DEFAULT_LOCALE } from '@/content/types';

/**
 * Part of the shell rather than a page: a 404 is chrome.
 *
 * Errors do not apologise and are never vague. This states what
 * happened and offers the one route back. The locale is not available
 * to a not-found boundary, so it falls back to the default.
 */
export default function NotFound() {
  const locale = DEFAULT_LOCALE;

  return (
    <Container>
      <div className="py-11">
        <Grid>
          <Measure>
            <h1 className="font-serif text-title text-ink desktop:text-title-desktop">
              {ui.notFoundTitle[locale]}
            </h1>
            <p className="mt-5 text-ink-2">{ui.notFoundBody[locale]}</p>
            <div className="mt-7">
              <FramedAction href={paths.home(locale)}>
                {ui.allWork[locale]}
              </FramedAction>
            </div>
          </Measure>
        </Grid>
      </div>
    </Container>
  );
}
