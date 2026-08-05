import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { ClosingCta } from "@/components/site/closing-cta";
import { InsetPanel, PanelHead } from "@/components/site/inset-panel";
import { Mark } from "@/components/site/mark";
import { PageBanner } from "@/components/site/page-banner";
import { PullQuote } from "@/components/site/pull-quote";
import {
  Column,
  EditorialGrid,
  Margin,
  SectionBand,
} from "@/components/site/section";
import { seoMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { AUDIENCES_QUERY, WHO_WE_WORK_WITH_QUERY } from "@/sanity/lib/queries";
import type {
  AUDIENCES_QUERY_RESULT,
  WHO_WE_WORK_WITH_QUERY_RESULT,
} from "@/sanity/types";

const getPage = () =>
  sanityFetch<WHO_WE_WORK_WITH_QUERY_RESULT>({
    query: WHO_WE_WORK_WITH_QUERY,
    tags: ["sanity", "whoWeWorkWithPage"],
  });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return seoMetadata(page?.seo ?? null, {
    title: "Who We Work With — Proxara Policy",
    path: "/who-we-work-with",
  });
}

export default async function WhoWeWorkWithPage() {
  const [page, audiences] = await Promise.all([
    getPage(),
    sanityFetch<AUDIENCES_QUERY_RESULT>({
      query: AUDIENCES_QUERY,
      tags: ["sanity", "audience"],
    }),
  ]);

  return (
    <>
      <PageBanner
        title={page?.title ?? "Who We Work With"}
        intro={page?.intro}
      />

      {/* Audience grid — the first card runs two columns wide and is set
          larger, so the grid has a lead item instead of reading as three
          interchangeable boxes. */}
      <SectionBand variant="navy-wash" className="py-16 md:py-20">
        <Reveal stagger>
          {/* Two columns, not three: the lead card runs the full width and the
              rest pair up beneath it. A 3-col grid with a 2-col lead leaves
              empty cells, which reads as a layout bug rather than a hierarchy. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {audiences.map((audience, i) => (
              <InsetPanel
                key={audience._id}
                className={cn(
                  "flex h-full flex-col bg-background",
                  i === 0 && "sm:col-span-2",
                )}
                data-reveal-item="up"
              >
                <PanelHead title={audience.name ?? ""} />
                {audience.body ? (
                  <p
                    className={cn(
                      "mt-6 flex-1 leading-relaxed text-foreground/90",
                      i === 0 && "text-lg md:max-w-3xl",
                    )}
                  >
                    {audience.body}
                  </p>
                ) : (
                  <dl className="mt-6 flex-1 space-y-6">
                    <div>
                      <dt className="eyebrow text-muted-foreground">
                        The challenge
                      </dt>
                      <dd className="mt-2 leading-relaxed text-foreground/90">
                        {audience.challenge}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-gold-deep">Proxara’s offer</dt>
                      <dd className="mt-2 leading-relaxed text-foreground/90">
                        {audience.offer}
                      </dd>
                    </div>
                  </dl>
                )}
              </InsetPanel>
            ))}
          </div>
        </Reveal>
      </SectionBand>

      {/* Stages — set on the editorial grid rather than in a third panel, so
          the page stops being a stack of identical boxes. */}
      {page?.stagesBody ? (
        <SectionBand variant="default" className="py-16 md:py-24">
          <Reveal stagger>
            <EditorialGrid className="gap-y-8">
              <Margin data-reveal-item="up">
                <div className="mb-4 flex items-center gap-2.5">
                  <Mark className="size-2.5 text-navy" />
                  <span className="h-px w-12 bg-gold" aria-hidden />
                </div>
                <h2 className="font-serif text-xl leading-snug tracking-display text-navy">
                  {page.stagesHeading ??
                    "Working with companies at different stages"}
                </h2>
              </Margin>
              <Column data-reveal-item="up">
                <p className="prose-measure text-lg leading-relaxed text-foreground/90">
                  {page.stagesBody}
                </p>
              </Column>
            </EditorialGrid>
          </Reveal>
        </SectionBand>
      ) : null}

      <PullQuote
        quote={page?.pullQuote?.quote}
        attribution={page?.pullQuote?.attribution}
        source={page?.pullQuote?.source}
        variant="navy-wash"
      />

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
