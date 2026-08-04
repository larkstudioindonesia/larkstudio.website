/**
 * The entire iconography of this site.
 *
 * There is no icon set — icons are interface vocabulary and documents
 * do not have them. This single glyph exists for `next project`, and
 * it is drawn to the grotesque's stroke weight and cap height so it
 * reads as typography rather than as an imported asset.
 *
 * Decorative by default: the adjacent text carries the meaning.
 */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      width="24"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M0 6h22" />
      <path d="M17 1l5 5-5 5" />
    </svg>
  );
}
