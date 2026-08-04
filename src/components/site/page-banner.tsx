import { Mark } from "@/components/site/mark";
import { SectionBand } from "@/components/site/section";
import { cn } from "@/lib/utils";

/**
 * Inner-page banner. Navy field + brand mark + gold rule — the same institutional
 * signal as the home hero, scaled for section pages. Flat (no gradient, no image).
 *
 * Title is always the page <h1>; intro is supporting copy beneath the gold rule.
 */
export function PageBanner({
  title,
  intro,
  children,
  className,
}: {
  title: string;
  intro?: string | null;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionBand variant="navy" className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <Mark className="size-3 text-primary-foreground" />
        </div>

        <h1 className="font-serif text-h1 tracking-display text-primary-foreground">
          {title}
        </h1>

        <div className="mt-6 h-0.5 w-14 bg-gold" aria-hidden />

        {intro ? (
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-on-navy-muted">
            {intro}
          </p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </SectionBand>
  );
}
