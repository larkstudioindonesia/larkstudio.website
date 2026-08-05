'use client';

import { useEffect } from 'react';

/**
 * The `@microsoft/clarity` SDK used to be imported eagerly at the top
 * of this file, which meant its code shipped inside the page's main
 * JS bundle and had to be parsed/compiled before the page could
 * hydrate — Lighthouse measured this specific script contributing a
 * 182ms and a 54ms long task on the main thread. Analytics has no
 * business competing with initial render for CPU time.
 *
 * Two changes fix that, without changing what Clarity actually does:
 *
 *   1. `import('@microsoft/clarity')` inside the effect, not a static
 *      top-level import — this puts the SDK in its own chunk, fetched
 *      only when this code actually runs, not bundled into the page.
 *   2. `requestIdleCallback` (falling back to a short `setTimeout` on
 *      Safari, which doesn't implement it) delays that fetch+init
 *      until the browser has spare time, i.e. after the page has
 *      already painted and hydrated — tracking still starts within
 *      the same session, just after the parts a visitor can see.
 */
export default function ClarityProvider() {
  useEffect(() => {
    const load = () => {
      void import('@microsoft/clarity').then(({ default: Clarity }) => {
        Clarity.init('xx1xr88w8n');
      });
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => {
        window.cancelIdleCallback(id);
      };
    }

    const timer = setTimeout(load, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}
