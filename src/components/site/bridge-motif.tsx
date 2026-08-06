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
 * Motion (absolute `data-reveal-delay` slots — see Reveal):
 *   1. Horizon arcs fade in from near to far
 *   2. Origin pier lands, then its label
 *   3. Gold span draws origin → destination
 *   4. Destination pier and label land as the span arrives
 *
 * Sized compact under the CTAs on small screens; full width in the desktop
 * right rail.
 */

const HORIZON = [
  "M0 149.2A530 530 0 0 1 400 149.2",
  "M0 203.6A480 480 0 0 1 400 203.6",
  "M0 259.3A430 430 0 0 1 400 259.3",
  "M0 316.9A380 380 0 0 1 400 316.9",
  "M0 377.5A330 330 0 0 1 400 377.5",
] as const;

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
          the curvature is what stops this looking like a growth graph.
          Each arc is its own reveal so the field builds rather than popping. */}
      {HORIZON.map((d, i) => (
        <path
          key={d}
          d={d}
          stroke="var(--on-navy-line)"
          strokeWidth="1"
          data-reveal-item="fade"
          data-reveal-delay={String(i * 0.08)}
        />
      ))}

      {/* Origin pier — lands once the near horizon is in. */}
      <g data-reveal-item="fade" data-reveal-delay="0.45">
        <path
          d="M70 218.5 81.5 230 70 241.5 58.5 230Z"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path d="M70 224 76 230 70 236 64 230Z" fill="var(--gold)" />
      </g>

      {origin ? (
        <text
          x="70"
          y="264"
          textAnchor="middle"
          className="eyebrow"
          fill="var(--gold-on-navy)"
          data-reveal-item="fade"
          data-reveal-delay="0.58"
        >
          {origin}
        </text>
      ) : null}

      {/* The span. Gold appears once, and only here. pathLength normalises the
          dash maths so the draw preset needs no per-path measurement. Starts
          after the origin is named so the eye has a pier to leave from. */}
      <path
        d="M70 230Q185 120 300 222"
        stroke="var(--gold)"
        strokeWidth="1.75"
        pathLength="1"
        data-reveal-item="draw"
        data-reveal-delay="0.72"
      />

      {/* Destination pier — held until the span has almost arrived (~0.72+1.45). */}
      <g data-reveal-item="fade" data-reveal-delay="1.95">
        <path
          d="M300 210.5 311.5 222 300 233.5 288.5 222Z"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path d="M300 216 306 222 300 228 294 222Z" fill="var(--gold)" />
      </g>

      {destination ? (
        <text
          x="300"
          y="256"
          textAnchor="middle"
          className="eyebrow"
          fill="var(--gold-on-navy)"
          data-reveal-item="fade"
          data-reveal-delay="2.1"
        >
          {destination}
        </text>
      ) : null}
    </svg>
  );
}
