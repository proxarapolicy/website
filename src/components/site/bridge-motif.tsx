/**
 * Hero anchor for the home page — the "bridge" in the positioning copy, drawn
 * rather than illustrated.
 *
 * A curved horizon of hairline arcs, two Proxara diamonds set on it as piers,
 * and a gold span between them carrying the origin and destination names. No
 * photography, no gradient, no icon set: inline SVG built from the brand's own
 * mark, so it costs nothing to load and inherits the navy band's tokens.
 *
 * Geometrically abstract on purpose — it is a route, not a map, so it never
 * reduces the work to a region. The names come from Sanity and are optional;
 * with both cleared the motif renders unlabelled.
 *
 * Motion: the horizon fades, the span draws left to right, and each pier lands
 * with its label as the span reaches it — `data-reveal-delay` holds the far
 * pier back until then. Hidden below `lg`; on a phone the masthead is the
 * anchor on its own.
 */
export function BridgeMotif({
  origin,
  destination,
  className,
}: {
  origin?: string | null;
  destination?: string | null;
  className?: string;
}) {
  const labelled = Boolean(origin && destination);

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      // Labelled, the motif states a fact the sub-line already carries, so it
      // is announced once and its inner text is skipped. Unlabelled it is pure
      // ornament and drops out of the tree entirely.
      role={labelled ? "img" : undefined}
      aria-label={labelled ? `${origin} to ${destination}` : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      className={className}
    >
      {/* Curved horizon — concentric arcs sharing one centre far below the
          frame. Straight rules were tried first and read as chart gridlines;
          the curvature is what stops this looking like a growth graph. */}
      <g
        stroke="var(--on-navy-line)"
        strokeWidth="1"
        data-reveal-item="fade"
      >
        <path d="M0 149.2A530 530 0 0 1 400 149.2" />
        <path d="M0 203.6A480 480 0 0 1 400 203.6" />
        <path d="M0 259.3A430 430 0 0 1 400 259.3" />
        <path d="M0 316.9A380 380 0 0 1 400 316.9" />
        <path d="M0 377.5A330 330 0 0 1 400 377.5" />
      </g>

      {/* Origin pier — lands first, before the span leaves it. */}
      <g data-reveal-item="fade" data-reveal-delay="0.12">
        <path
          d="M70 218.5 81.5 230 70 241.5 58.5 230Z"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path d="M70 224 76 230 70 236 64 230Z" fill="var(--gold)" />
        {origin ? (
          <text
            x="70"
            y="264"
            textAnchor="middle"
            className="eyebrow"
            fill="var(--gold-on-navy)"
          >
            {origin}
          </text>
        ) : null}
      </g>

      {/* The span. Gold appears once, and only here. pathLength normalises the
          dash maths so the draw preset needs no per-path measurement. */}
      <path
        d="M70 230Q185 120 300 222"
        stroke="var(--gold)"
        strokeWidth="1.5"
        pathLength="1"
        data-reveal-item="draw"
        data-reveal-delay="0.3"
      />

      {/* Destination pier — held until the span has almost arrived. */}
      <g data-reveal-item="fade" data-reveal-delay="1.15">
        <path
          d="M300 210.5 311.5 222 300 233.5 288.5 222Z"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path d="M300 216 306 222 300 228 294 222Z" fill="var(--gold)" />
        {destination ? (
          <text
            x="300"
            y="256"
            textAnchor="middle"
            className="eyebrow"
            fill="var(--gold-on-navy)"
          >
            {destination}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
