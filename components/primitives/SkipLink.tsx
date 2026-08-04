/**
 * First focusable element on every page. Invisible until focused,
 * then rendered in the standard framed style — no separate visual
 * vocabulary for accessibility affordances.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="absolute left-5 top-5 z-skip -translate-y-[200%] border border-emphasis bg-paper px-5 py-3 font-grotesque text-spec text-ink focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}
