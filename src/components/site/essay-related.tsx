import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Mark } from "@/components/site/mark";
import { SectionBand } from "@/components/site/section";
import { formatDate } from "@/lib/format";
import type { EssayIndexItem } from "@/lib/essay-index";

type EssayRelatedProps = {
  essays: EssayIndexItem[];
};

export function EssayRelated({ essays }: EssayRelatedProps) {
  if (essays.length === 0) return null;

  return (
    <SectionBand variant="navy-wash" className="py-16 md:py-20">
      <Reveal stagger>
      <div className="flex items-center gap-3" data-reveal-item="up">
        <Mark className="size-2.5 text-navy" />
        <h2 className="font-serif text-2xl tracking-display text-navy md:text-3xl">
          Related thinking
        </h2>
      </div>
      <span
        className="mt-4 block h-0.5 w-12 bg-gold"
        aria-hidden
        data-reveal-item="rule"
      />

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {essays.map((essay) =>
          essay.slug ? (
            <li key={essay._id} data-reveal-item="up">
              <Link
                href={`/thinking/${essay.slug}`}
                className="group flex h-full flex-col border border-border border-t-2 border-t-transparent bg-background p-5 transition-colors hover:border-t-gold hover:bg-background md:p-6"
              >
                <p className="figures-oldstyle text-xs text-muted-foreground">
                  {formatDate(essay.publishedAt)}
                </p>
                <h3 className="mt-3 flex-1 font-serif text-lg leading-snug text-navy">
                  {essay.title}
                </h3>
                {essay.tags?.length ? (
                  <p className="eyebrow mt-4 text-muted-foreground">
                    {essay.tags
                      .map((t) => t.title)
                      .filter(Boolean)
                      .slice(0, 2)
                      .join(" · ")}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep">
                  Read essay
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ) : null,
        )}
      </ul>
      </Reveal>
    </SectionBand>
  );
}
