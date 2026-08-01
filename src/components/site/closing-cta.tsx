import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * The closing paragraph + "Get in touch" button that ends every section page.
 * Renders nothing when the page has no closing copy, so an unfilled field
 * never leaves an empty band behind.
 */
export function ClosingCta({
  body,
  ctaLabel,
}: {
  body?: string | null;
  ctaLabel?: string | null;
}) {
  if (!body) return null;

  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
        <p className="max-w-2xl font-serif text-xl leading-snug text-navy md:text-2xl">
          {body}
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/contact" />}
          className="shrink-0"
        >
          {ctaLabel ?? "Get in touch"}
        </Button>
      </div>
    </section>
  );
}
