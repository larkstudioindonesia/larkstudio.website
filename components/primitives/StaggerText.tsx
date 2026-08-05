type Tag = 'span' | 'h1' | 'p';

/**
 * Behaviour 9 of the motion budget — hero word stagger, ≤500ms total.
 *
 * CSS-only `animation-delay` per word-span — deliberately not Framer's
 * `staggerChildren`/`delayChildren`, which stay banned by
 * `eslint.config.mjs`. Each word is its own `inline-block` (so it
 * never breaks mid-word), separated by an ordinary space rendered as
 * its OWN sibling text node — not appended inside the `inline-block`
 * span, where a trailing space sitting at the box's own edge gets
 * silently collapsed by the browser's whitespace handling and the
 * words end up glued together with no visible gap.
 *
 * `prefers-reduced-motion` is already handled globally — the base-
 * layer media query in `app/globals.css` zeroes every `animation-
 * duration` on the page, this included.
 *
 * The `lark-word-in` keyframe animates `transform` only, never
 * `opacity` — this component is used for the hero headline, which
 * Lighthouse identifies as the page's Largest Contentful Paint
 * element. An opacity-0 starting state makes an element unpaintable
 * (and therefore LCP-ineligible) until its animation resolves; on a
 * throttled mobile CPU that pushed LCP out by several hundred ms for
 * no visual benefit worth the cost. Words are fully opaque and
 * paintable immediately; only their vertical offset animates.
 */
export function StaggerText({
  text,
  as: As = 'span',
  className,
}: {
  text: string;
  as?: Tag;
  className?: string;
}) {
  const words = text.split(' ');

  return (
    <As className={className}>
      {words.map((word, index) => (
        <span key={`${String(index)}-${word}`}>
          <span
            className="inline-block animate-[lark-word-in_0.4s_var(--ease-standard)_both]"
            style={{ animationDelay: `${String(Math.min(index * 60, 400))}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </As>
  );
}
