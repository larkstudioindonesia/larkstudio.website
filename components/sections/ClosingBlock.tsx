import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { FramedAction } from '@/components/primitives/FramedAction';

/**
 * Section type 8 of the permitted eight. Every page ends with this —
 * it is the mitigation for a header that does not persist. A chapter
 * ends by offering the next chapter.
 *
 * ONE call to action, ONE placement, at the end of the reading unit.
 * No sticky element, no mid-page interruption, no repetition within a
 * page: a studio that asks is a studio that needs.
 *
 * The message does the qualification work that a form would otherwise
 * do — it names what is useful in a first enquiry without adding a
 * single field.
 *
 * `variant="large"` is the homepage-specific "CTA — large, memorable"
 * treatment: the message sets at display scale instead of body scale
 * and the block gets more vertical room. Every other call site keeps
 * calling this unchanged and gets the original, smaller treatment.
 */
export function ClosingBlock({
  message,
  actionLabel,
  actionHref,
  external = false,
  variant = 'default',
}: {
  message: string;
  actionLabel: string;
  actionHref: string;
  external?: boolean;
  variant?: 'default' | 'large';
}) {
  const isLarge = variant === 'large';

  return (
    <section
      className={
        isLarge
          ? 'pb-11 pt-11 tablet:pb-12 tablet:pt-12'
          : 'pb-10 pt-10 tablet:pb-11 tablet:pt-11'
      }
    >
      <Container>
        <Grid>
          <Measure>
            <p
              className={
                isLarge
                  ? 'font-serif text-display font-medium text-ink desktop:text-display-desktop'
                  : 'text-body text-ink desktop:text-body-desktop'
              }
            >
              {message}
            </p>
            <div className={isLarge ? 'mt-9' : 'mt-7'}>
              <FramedAction href={actionHref} external={external}>
                {actionLabel}
              </FramedAction>
            </div>
          </Measure>
        </Grid>
      </Container>
    </section>
  );
}
