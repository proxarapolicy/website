import { cn } from "@/lib/utils";

/**
 * Page shell. Every section shares one container width so the outer margin is
 * consistent; asymmetry is created *inside* it by `EditorialHead` and the
 * 12-column grid, not by varying container widths.
 */
export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("px-5 md:px-8", className)} {...props}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export type SectionVariant =
  | "default"
  | "navy-wash"
  | "gold-wash"
  | "navy"
  | "inset";

const sectionVariantClass: Record<SectionVariant, string> = {
  default: "bg-background",
  "navy-wash": "surface-navy-wash",
  "gold-wash": "surface-gold-wash border-t-2 border-gold",
  navy: "surface-navy",
  inset: "bg-background border-y border-border",
};

/**
 * Full-bleed section band with a typed surface variant.
 *
 * Alternating surfaces (white / navy-wash / gold-wash / navy-deep) make
 * editorial sections read as deliberate bands without images or gradients.
 * Never place two consecutive bands of the same variant.
 */
export function SectionBand({
  variant = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { variant?: SectionVariant }) {
  return (
    <section
      className={cn(sectionVariantClass[variant], "px-5 md:px-8", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Twelve-column editorial grid.
 *
 * The site previously centred every section in the same container, which reads
 * as a generated stack. Here content sits in columns 4–11 while the eyebrow
 * hangs in the left margin — the way a printed report sets a running head
 * beside its body. Collapses to a single column below `md`.
 */
export function EditorialGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid gap-x-10 gap-y-4 md:grid-cols-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Running head, hung in the left margin against the section heading. */
export function Margin({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("md:col-span-3", className)} {...props}>
      {children}
    </div>
  );
}

/** Main column — offset from the margin, stopping short of the right edge. */
export function Column({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("md:col-span-8 md:col-start-4", className)} {...props}>
      {children}
    </div>
  );
}
