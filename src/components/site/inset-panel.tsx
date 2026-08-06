import { Mark } from "@/components/site/mark";
import { cn } from "@/lib/utils";

/**
 * Editorial panel — even border + gold top rule (not a side accent stripe).
 * Shared across Who We Work With, What We Do, and home section bands.
 *
 * Hover (pointer devices): title shifts toward gold and a hairline draws under
 * the heading — same language as the homepage pillar rows, so teasers and
 * audience cards feel designed rather than static boxes.
 */
export function InsetPanel({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-inset-panel
      className={cn(
        "group/panel relative border border-border border-t-2 border-t-gold px-6 py-8 md:px-8 md:py-10",
        className,
      )}
      {...props}
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
        <Mark className="size-2.5 text-navy transition-colors duration-200 group-hover/panel:text-gold-deep" />
        <span className="h-px w-12 bg-gold" aria-hidden />
      </div>
      <Heading className="font-serif text-2xl text-navy transition-colors duration-200 group-hover/panel:text-gold-deep md:text-3xl">
        {title}
      </Heading>
      <span
        aria-hidden
        className="mt-3 block h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover/panel:scale-x-100"
      />
    </>
  );
}
