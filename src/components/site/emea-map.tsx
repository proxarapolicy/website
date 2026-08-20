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
 * Interactive behaviour (hover, focus, caption) lives in
 * `emea-map-interactive.tsx`. Paths are Natural Earth 110m, cropped to EMEA
 * and grouped into seven regions; Africa is never filled as a single category.
 */

export type EmeaMapSurface = "light" | "navy";

const SURFACE = {
  light: {
    land: "fill-[color-mix(in_oklch,var(--navy)_6%,transparent)] stroke-navy/25 stroke-[0.7]",
    active:
      "fill-[color-mix(in_oklch,var(--navy)_9%,transparent)] stroke-navy/35 stroke-[0.85] transition-[fill,stroke] duration-150 ease-out hover:fill-[color-mix(in_oklch,var(--gold)_14%,transparent)] hover:stroke-gold focus-visible:fill-[color-mix(in_oklch,var(--gold)_14%,transparent)] focus-visible:stroke-gold focus-visible:outline-none data-[active=true]:fill-[color-mix(in_oklch,var(--gold)_14%,transparent)] data-[active=true]:stroke-gold motion-reduce:transition-none",
    context:
      "fill-[color-mix(in_oklch,var(--navy)_4%,transparent)] stroke-navy/15 stroke-[0.6] pointer-events-none",
  },
  navy: {
    land: "fill-[oklch(1_0_0_/_0.1)] stroke-[oklch(1_0_0_/_0.28)] stroke-[1]",
    active:
      "fill-[oklch(1_0_0_/_0.14)] stroke-[oklch(0.86_0.08_84_/_0.65)] stroke-[1.15] transition-[fill,stroke] duration-150 ease-out hover:fill-[color-mix(in_oklch,var(--gold)_30%,transparent)] hover:stroke-[var(--gold)] focus-visible:fill-[color-mix(in_oklch,var(--gold)_30%,transparent)] focus-visible:stroke-[var(--gold)] focus-visible:outline-none data-[active=true]:fill-[color-mix(in_oklch,var(--gold)_30%,transparent)] data-[active=true]:stroke-[var(--gold)] motion-reduce:transition-none",
    context:
      "fill-[oklch(1_0_0_/_0.045)] stroke-[oklch(1_0_0_/_0.14)] stroke-[0.75] pointer-events-none",
  },
} as const;

export function EmeaMapSvg({
  activeId,
  interactiveIds,
  labels,
  onActivate,
  onClear,
  surface = "light",
  className,
}: {
  activeId: EmeaRegionId | null;
  /** Region IDs that have Sanity notes — only these are focusable. */
  interactiveIds: ReadonlySet<string>;
  labels: ReadonlyMap<EmeaRegionId, string>;
  onActivate: (id: EmeaRegionId) => void;
  onClear: () => void;
  surface?: EmeaMapSurface;
  className?: string;
}) {
  const tones = SURFACE[surface];

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

        if (!interactive) {
          return (
            <g key={id} aria-hidden="true">
              {paths.map((d, i) => (
                <path key={i} d={d} className={tones.land} />
              ))}
            </g>
          );
        }

        const label = labels.get(id) ?? id;

        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            data-active={activeId === id ? "true" : undefined}
            aria-label={label}
            className={cn(tones.active, "cursor-pointer")}
            onPointerEnter={() => onActivate(id)}
            onPointerLeave={(event) => {
              // Touch: keep the selection until another region is chosen.
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
