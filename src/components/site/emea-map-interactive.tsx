"use client";

import { useMemo, useState } from "react";

import { EmeaMapSvg, type EmeaMapSurface } from "@/components/site/emea-map";
import {
  isEmeaRegionId,
  type EmeaRegionId,
} from "@/components/site/emea-map-paths";
import { cn } from "@/lib/utils";

export type EmeaMapRegion = {
  regionId: string | null;
  label: string | null;
  note: string | null;
};

function useRegionLookup(regions: EmeaMapRegion[]) {
  const byId = useMemo(() => {
    const map = new Map<EmeaRegionId, { label: string; note: string }>();
    for (const region of regions) {
      if (!region.regionId || !isEmeaRegionId(region.regionId)) continue;
      if (!region.label || !region.note) continue;
      map.set(region.regionId, { label: region.label, note: region.note });
    }
    return map;
  }, [regions]);

  const interactiveIds = useMemo(() => new Set<string>(byId.keys()), [byId]);

  const labels = useMemo(() => {
    const map = new Map<EmeaRegionId, string>();
    for (const [id, value] of byId) map.set(id, value.label);
    return map;
  }, [byId]);

  return { byId, interactiveIds, labels };
}

const DEFAULT_HERO_REGION: EmeaRegionId = "east-africa";

/**
 * Hero visual: interactive EMEA map + live caption under it.
 * East Africa is the default highlight; other regions match base land until hover.
 */
export function EmeaMapHero({
  regions,
  hoverHint,
  className,
}: {
  regions: EmeaMapRegion[];
  /** Sanity line inviting exploration of other regions. */
  hoverHint?: string | null;
  className?: string;
}) {
  const { byId, interactiveIds, labels } = useRegionLookup(regions);

  const defaultId = useMemo((): EmeaRegionId | null => {
    if (byId.has(DEFAULT_HERO_REGION)) return DEFAULT_HERO_REGION;
    const first = byId.keys().next();
    return first.done ? null : first.value;
  }, [byId]);

  const [activeId, setActiveId] = useState<EmeaRegionId | null>(defaultId);
  const resolvedId = activeId && byId.has(activeId) ? activeId : defaultId;
  const active = resolvedId ? (byId.get(resolvedId) ?? null) : null;

  if (interactiveIds.size === 0) return null;

  return (
    <div className={cn("flex w-full flex-col gap-4 sm:gap-5", className)}>
      <EmeaMapSvg
        surface="navy"
        activeId={resolvedId}
        interactiveIds={interactiveIds}
        labels={labels}
        onActivate={setActiveId}
        onClear={() => setActiveId(defaultId)}
        className="mx-auto w-full max-w-[17.5rem] sm:max-w-sm md:max-w-md lg:max-w-none"
      />

      {/* Fixed-height caption: text swaps on hover without growing the hero.
          Height includes bottom padding so descenders are not clipped on mobile. */}
      <div
        className="h-[8rem] overflow-hidden border-t border-[color:var(--on-navy-line)] pt-4 pb-5 sm:h-[8.25rem] sm:pb-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {active ? (
          <>
            <p className="truncate font-serif text-base leading-snug text-gold-on-navy sm:text-lg">
              {active.label}
            </p>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-on-navy-muted sm:text-[0.9375rem]">
              {active.note}
            </p>
            {hoverHint ? (
              <p className="mt-2 text-xs leading-snug text-on-navy-faint">
                {hoverHint}
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Standalone coverage band (copy + map). Kept for reuse off the hero.
 */
export function EmeaMapSection({
  kicker,
  heading,
  intro,
  regions,
  surface = "light",
  className,
}: {
  kicker?: string | null;
  heading: string;
  intro?: string | null;
  regions: EmeaMapRegion[];
  surface?: EmeaMapSurface;
  className?: string;
}) {
  const { byId, interactiveIds, labels } = useRegionLookup(regions);
  const [activeId, setActiveId] = useState<EmeaRegionId | null>(null);
  const active = activeId ? (byId.get(activeId) ?? null) : null;

  const onNavy = surface === "navy";

  const caption = (
    <div
      className={cn(
        "h-[7.5rem] overflow-hidden border-t pt-5 pb-4 md:h-[8rem]",
        onNavy ? "border-[color:var(--on-navy-line)]" : "border-border",
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {active ? (
        <>
          <p
            className={cn(
              "truncate font-serif text-lg leading-snug md:text-xl",
              onNavy ? "text-gold-on-navy" : "text-navy",
            )}
          >
            {active.label}
          </p>
          <p
            className={cn(
              "mt-2 line-clamp-3 text-sm leading-relaxed md:text-base",
              onNavy ? "text-on-navy-muted" : "text-muted-foreground",
            )}
          >
            {active.note}
          </p>
        </>
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        "grid items-start gap-10 md:grid-cols-12 md:gap-x-12",
        className,
      )}
    >
      <div className="flex flex-col gap-6 md:col-span-5" data-reveal-item="up">
        {kicker ? (
          <p
            className={cn(
              "text-xs font-medium tracking-[0.14em] uppercase",
              onNavy ? "text-on-navy-faint" : "text-muted-foreground",
            )}
          >
            {kicker}
          </p>
        ) : null}
        <div>
          <h2
            className={cn(
              "font-serif text-h2",
              onNavy ? "text-primary-foreground" : "text-navy",
            )}
          >
            {heading}
          </h2>
          <span
            className="mt-5 block h-0.5 w-14 bg-gold"
            aria-hidden
            data-reveal-item="rule"
          />
        </div>
        {intro ? (
          <p
            className={cn(
              "text-lg leading-relaxed",
              onNavy ? "text-on-navy-muted" : "text-muted-foreground",
            )}
          >
            {intro}
          </p>
        ) : null}
        <div className="hidden md:block">{caption}</div>
      </div>

      <div className="md:col-span-7" data-reveal-item="up">
        <EmeaMapSvg
          surface={surface}
          activeId={activeId}
          interactiveIds={interactiveIds}
          labels={labels}
          onActivate={setActiveId}
          onClear={() => setActiveId(null)}
        />
        <div className="mt-6 md:hidden">{caption}</div>
      </div>
    </div>
  );
}
