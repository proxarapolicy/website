import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Mark } from "@/components/site/mark";
import { SectionBand } from "@/components/site/section";
import { Button } from "@/components/ui/button";

/**
 * The closing paragraph + "Get in touch" button that ends every section page.
 * Gold-wash (not navy-wash) so it never blends into a preceding content band.
 * Content sits in the same centered max-w-5xl column as inner-page sections.
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
    <SectionBand variant="gold-wash" className="py-16 md:py-20">
      <Reveal className="mx-auto flex w-full max-w-5xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-2.5">
            <Mark className="size-2.5 text-navy" />
            <span className="h-px w-12 bg-gold" aria-hidden />
          </div>
          <p className="font-serif text-xl leading-snug text-navy md:text-2xl">
            {body}
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/contact" />}
          className="shrink-0"
        >
          {ctaLabel ?? "Get in touch"}
        </Button>
      </Reveal>
    </SectionBand>
  );
}
