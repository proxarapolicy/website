/**
 * Hero visual anchor — an abstract map, not a picture of a place.
 *
 * The client brief asked for a restrained cartographic cue that echoes
 * "From Nairobi to Brussels." This is an orthographic globe: limb, a few
 * meridians and parallels, two Proxara diamonds as plot points, and a gold
 * great-circle span between them. No continent outlines (Africa is never a
 * visual category on this site), no photography, no gradient.
 *
 * Names come from Sanity (`heroMotifOrigin` / `heroMotifDestination`).
 *
 * Motion (absolute `data-reveal-delay` slots — see Reveal):
 *   1. Globe field (limb + grid) builds
 *   2. Origin node + label
 *   3. Gold route draws origin → destination
 *   4. Destination node + label land as the span arrives
 */

/** Parallels — horizontal ellipses inside the limb (abstract latitudes). */
const PARALLELS = [
  "M68 155 A132 38 0 0 0 332 155",
  "M55 200 A145 52 0 0 0 345 200",
  "M68 245 A132 38 0 0 0 332 245",
] as const;

/** Meridians — vertical arcs suggesting longitude, not a real projection. */
const MERIDIANS = [
  "M200 48 A90 152 0 0 0 200 352",
  "M200 48 A90 152 0 0 1 200 352",
  "M128 62 Q95 200 128 338",
  "M272 62 Q305 200 272 338",
] as const;

const ORIGIN = { x: 128, y: 248 };
const DEST = { x: 278, y: 142 };

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
      role={labelled ? "img" : undefined}
      aria-label={labelled ? `${origin} to ${destination}` : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      className={className}
    >
      {/* Soft field — a large Mark watermark so the logo mark reads abstractly
          at scale, as the brief suggested, without competing with the route. */}
      <g
        opacity="0.07"
        stroke="var(--gold)"
        strokeWidth="1.25"
        data-reveal-item="fade"
        data-reveal-delay="0"
      >
        <path d="M200 78 302 180 200 282 98 180Z" />
        <path d="M200 128 252 180 200 232 148 180Z" fill="var(--gold)" stroke="none" />
      </g>

      {/* Globe limb */}
      <circle
        cx="200"
        cy="200"
        r="152"
        stroke="var(--on-navy-line)"
        strokeWidth="1"
        data-reveal-item="fade"
        data-reveal-delay="0.06"
      />

      {/* Latitude / longitude hairlines */}
      {PARALLELS.map((d, i) => (
        <path
          key={`p-${d}`}
          d={d}
          stroke="var(--on-navy-line)"
          strokeWidth="0.75"
          data-reveal-item="fade"
          data-reveal-delay={String(0.12 + i * 0.05)}
        />
      ))}
      {MERIDIANS.map((d, i) => (
        <path
          key={`m-${d}`}
          d={d}
          stroke="var(--on-navy-line)"
          strokeWidth="0.75"
          data-reveal-item="fade"
          data-reveal-delay={String(0.28 + i * 0.05)}
        />
      ))}

      {/* Origin plot */}
      <g data-reveal-item="fade" data-reveal-delay="0.55">
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="14"
          stroke="var(--on-navy-line)"
          strokeWidth="0.75"
        />
        <path
          d={`M${ORIGIN.x} ${ORIGIN.y - 11.5} ${ORIGIN.x + 11.5} ${ORIGIN.y} ${ORIGIN.x} ${ORIGIN.y + 11.5} ${ORIGIN.x - 11.5} ${ORIGIN.y}Z`}
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path
          d={`M${ORIGIN.x} ${ORIGIN.y - 5.5} ${ORIGIN.x + 5.5} ${ORIGIN.y} ${ORIGIN.x} ${ORIGIN.y + 5.5} ${ORIGIN.x - 5.5} ${ORIGIN.y}Z`}
          fill="var(--gold)"
        />
      </g>

      {origin ? (
        <text
          x={ORIGIN.x}
          y={ORIGIN.y + 32}
          textAnchor="middle"
          className="eyebrow"
          fill="var(--gold-on-navy)"
          data-reveal-item="fade"
          data-reveal-delay="0.68"
        >
          {origin}
        </text>
      ) : null}

      {/* Great-circle route — the only gold stroke in the field */}
      <path
        d={`M${ORIGIN.x} ${ORIGIN.y}Q200 95 ${DEST.x} ${DEST.y}`}
        stroke="var(--gold)"
        strokeWidth="1.75"
        pathLength="1"
        data-reveal-item="draw"
        data-reveal-delay="0.82"
      />

      {/* Destination plot — lands as the span arrives */}
      <g data-reveal-item="fade" data-reveal-delay="2.05">
        <circle
          cx={DEST.x}
          cy={DEST.y}
          r="14"
          stroke="var(--on-navy-line)"
          strokeWidth="0.75"
        />
        <path
          d={`M${DEST.x} ${DEST.y - 11.5} ${DEST.x + 11.5} ${DEST.y} ${DEST.x} ${DEST.y + 11.5} ${DEST.x - 11.5} ${DEST.y}Z`}
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <path
          d={`M${DEST.x} ${DEST.y - 5.5} ${DEST.x + 5.5} ${DEST.y} ${DEST.x} ${DEST.y + 5.5} ${DEST.x - 5.5} ${DEST.y}Z`}
          fill="var(--gold)"
        />
      </g>

      {destination ? (
        <text
          x={DEST.x}
          y={DEST.y - 24}
          textAnchor="middle"
          className="eyebrow"
          fill="var(--gold-on-navy)"
          data-reveal-item="fade"
          data-reveal-delay="2.2"
        >
          {destination}
        </text>
      ) : null}
    </svg>
  );
}
