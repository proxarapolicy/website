/**
 * The Proxara diamond — an outlined square rotated 45° with a solid gold
 * diamond at its centre, taken from the logo mark in public/proxara-logo.png.
 *
 * Used as section marker, list bullet, and end-of-article mark (the printed
 * publication "■"). Derived from the brand's own mark, so it reads as
 * proprietary rather than as a stock icon — which is why the site uses this
 * instead of an icon set for structural ornament.
 *
 * Inline SVG: no network request, inherits colour via currentColor.
 */
export function Mark({
  className,
  filled = true,
  ...props
}: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {/* Outer square, rotated to a diamond. Stroke only. */}
      <path
        d="M12 1.5 22.5 12 12 22.5 1.5 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      {/* Inner diamond — the gold centre of the logo */}
      {filled ? (
        <path d="M12 7.6 16.4 12 12 16.4 7.6 12Z" fill="var(--gold)" />
      ) : null}
    </svg>
  );
}

/**
 * End-of-article mark. Sits at the close of long-form pieces the way a
 * printed journal closes an essay.
 */
export function EndMark({ className }: { className?: string }) {
  return (
    <div className={className} role="presentation">
      <Mark className="size-3 text-navy" />
    </div>
  );
}
