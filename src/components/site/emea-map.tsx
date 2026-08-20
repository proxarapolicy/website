import {
  EMEA_CONTEXT_PATHS,
  EMEA_REGION_IDS,
  EMEA_REGION_PATHS,
  EMEA_VIEWBOX,
  type EmeaRegionId,
} from "@/components/site/emea-map-paths";
import { cn } from "@/lib/utils";

/**
 * Static EMEA land drawing — geometry only.
 *
 * Interactive behaviour lives in `emea-map-interactive.tsx`. Paths are Natural
 * Earth 110m, cropped to EMEA and grouped into sub-regions (Africa stays
 * multiple regions, not one filled continent).
 */

export type EmeaMapSurface = "light" | "navy";

const SURFACE = {
  light: {
    land: "fill-[color-mix(in_oklch,var(--navy)_6%,transparent)] stroke-navy/25 stroke-[0.7]",
    covered:
      "fill-[color-mix(in_oklch,var(--gold)_12%,transparent)] stroke-navy/30 stroke-[0.85] transition-[fill,stroke] duration-150 ease-out hover:fill-[color-mix(in_oklch,var(--gold)_20%,transparent)] hover:stroke-gold focus-visible:fill-[color-mix(in_oklch,var(--gold)_20%,transparent)] focus-visible:stroke-gold focus-visible:outline-none motion-reduce:transition-none",
    active:
      "fill-[color-mix(in_oklch,var(--gold)_22%,transparent)] stroke-gold stroke-[0.95] transition-[fill,stroke] duration-150 ease-out focus-visible:outline-none motion-reduce:transition-none",
    context:
      "fill-[color-mix(in_oklch,var(--navy)_4%,transparent)] stroke-navy/15 stroke-[0.6] pointer-events-none",
  },
  navy: {
    land: "fill-[oklch(1_0_0_/_0.1)] stroke-[oklch(1_0_0_/_0.28)] stroke-[1] transition-[fill,stroke] duration-150 ease-out hover:fill-[color-mix(in_oklch,var(--gold)_28%,transparent)] hover:stroke-[var(--gold)] focus-visible:fill-[color-mix(in_oklch,var(--gold)_28%,transparent)] focus-visible:stroke-[var(--gold)] focus-visible:outline-none motion-reduce:transition-none",
    covered:
      "fill-[color-mix(in_oklch,var(--gold)_20%,transparent)] stroke-[oklch(0.86_0.08_84_/_0.5)] stroke-[1] transition-[fill,stroke] duration-150 ease-out hover:fill-[color-mix(in_oklch,var(--gold)_30%,transparent)] hover:stroke-[var(--gold)] focus-visible:fill-[color-mix(in_oklch,var(--gold)_30%,transparent)] focus-visible:stroke-[var(--gold)] focus-visible:outline-none motion-reduce:transition-none",
    active:
      "fill-[color-mix(in_oklch,var(--gold)_34%,transparent)] stroke-[var(--gold)] stroke-[1.2] transition-[fill,stroke] duration-150 ease-out focus-visible:outline-none motion-reduce:transition-none",
    context:
      "fill-[oklch(1_0_0_/_0.045)] stroke-[oklch(1_0_0_/_0.14)] stroke-[0.75] pointer-events-none",
  },
} as const;

export function EmeaMapSvg({
  activeId,
  coveredIds,
  interactiveIds,
  labels,
  onActivate,
  onClear,
  surface = "light",
  className,
}: {
  activeId: EmeaRegionId | null;
  /** Regions shown as coverage (e.g. all of Africa) when not focused. */
  coveredIds?: ReadonlySet<string>;
  /** Region IDs that have Sanity notes — only these are focusable. */
  interactiveIds: ReadonlySet<string>;
  labels: ReadonlyMap<EmeaRegionId, string>;
  onActivate: (id: EmeaRegionId) => void;
  onClear: () => void;
  surface?: EmeaMapSurface;
  className?: string;
}) {
  const tones = SURFACE[surface];
  const covered = coveredIds ?? new Set<string>();

  return (
    <svg
      viewBox={EMEA_VIEWBOX}
      role="group"
      aria-label="Map of Europe, the Middle East, and Africa"
      focusable="false"
      className={cn("h-auto w-full touch-manipulation", className)}
    >
      <g aria-hidden="true">
        {EMEA_CONTEXT_PATHS.map((d, i) => (
          <path key={`ctx-${i}`} d={d} className={tones.context} />
        ))}
      </g>

      {EMEA_REGION_IDS.map((id) => {
        const paths = EMEA_REGION_PATHS[id];
        const interactive = interactiveIds.has(id);
        const isActive = activeId === id;
        const isCovered = covered.has(id);

        if (!interactive) {
          return (
            <g key={id} aria-hidden="true">
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className={isCovered ? tones.covered : tones.land}
                />
              ))}
            </g>
          );
        }

        const label = labels.get(id) ?? id;
        const toneClass = isActive
          ? tones.active
          : isCovered
            ? tones.covered
            : tones.land;

        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            data-active={isActive ? "true" : undefined}
            data-covered={isCovered && !isActive ? "true" : undefined}
            aria-label={label}
            className={cn(toneClass, "cursor-pointer")}
            onPointerEnter={() => onActivate(id)}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse" || event.pointerType === "pen") {
                onClear();
              }
            }}
            onFocus={() => onActivate(id)}
            onBlur={onClear}
            onClick={() => onActivate(id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onActivate(id);
              }
            }}
          >
            {paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
