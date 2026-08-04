import { Mark } from "@/components/site/mark";
import { cn } from "@/lib/utils";

/**
 * Editorial panel — even border + gold top rule (not a side accent stripe).
 * Shared across Who We Work With, What We Do, and home section bands.
 */
export function InsetPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border border-t-2 border-t-gold px-6 py-8 md:px-8 md:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  as = "h2",
}: {
  title: string;
  as?: "h2" | "h3";
}) {
  const Heading = as;
  return (
    <>
      <div className="mb-4 flex items-center gap-2.5">
        <Mark className="size-2.5 text-navy" />
        <span className="h-px w-12 bg-gold" aria-hidden />
      </div>
      <Heading className="font-serif text-2xl text-navy md:text-3xl">
        {title}
      </Heading>
    </>
  );
}
