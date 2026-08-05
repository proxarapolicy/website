import { Reveal } from "@/components/motion/reveal";
import { Mark } from "@/components/site/mark";
import { SectionBand, type SectionVariant } from "@/components/site/section";

/**
 * Pull-quote band — the one place on the site where a single sentence gets a
 * whole band to itself. It exists to break the heading/paragraph/list rhythm
 * that otherwise runs the length of every page, so it is deliberately set
 * larger and looser than any body copy and carries no link or button.
 *
 * The quote hangs off the left edge of its measure via `hanging-punctuation`,
 * matching the blockquote serializer in `portable-text.tsx`.
 *
 * Renders nothing without a quote, so an unset Sanity reference removes the
 * band rather than leaving an empty one.
 */
export function PullQuote({
  quote,
  attribution,
  source,
  variant = "gold-wash",
  className,
}: {
  quote?: string | null;
  attribution?: string | null;
  source?: string | null;
  variant?: SectionVariant;
  className?: string;
}) {
  if (!quote) return null;

  return (
    <SectionBand variant={variant} className={className ?? "py-16 md:py-24"}>
      <Reveal stagger className="mx-auto w-full max-w-4xl">
        <Mark className="mb-8 size-3 text-navy" data-reveal-item="up" />
        <figure>
          <blockquote
            className="font-serif text-2xl leading-snug tracking-display text-navy [hanging-punctuation:first_last] md:text-[2rem]"
            data-reveal-item="up"
          >
            “{quote}”
          </blockquote>
          {attribution ? (
            <figcaption
              className="mt-8 flex flex-wrap items-baseline gap-x-3 text-sm text-muted-foreground"
              data-reveal-item="up"
            >
              <span className="eyebrow text-gold-deep">{attribution}</span>
              {source ? <span>{source}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      </Reveal>
    </SectionBand>
  );
}
