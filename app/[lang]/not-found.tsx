import { DEFAULT_LOCALE } from '@/content/types';
import { NotFoundBlock } from '@/components/sections';

/** Part of the shell rather than a page: a 404 is chrome. The locale is
 *  not available to a not-found boundary, so it falls back to the
 *  default. */
export default function NotFound() {
  return <NotFoundBlock locale={DEFAULT_LOCALE} />;
}
