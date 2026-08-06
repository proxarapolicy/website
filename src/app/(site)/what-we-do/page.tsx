import type { Metadata } from "next";

import { CountUpFigure } from "@/components/motion/count-up-figure";
import { Reveal } from "@/components/motion/reveal";
import { PortableText } from "@/components/portable-text";
import { ClosingCta } from "@/components/site/closing-cta";
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
import { sanityFetch } from "@/sanity/lib/client";
import { PILLARS_QUERY, WHAT_WE_DO_QUERY } from "@/sanity/lib/queries";
import type {
  PILLARS_QUERY_RESULT,
  WHAT_WE_DO_QUERY_RESULT,
} from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const getPage = () =>
  sanityFetch<WHAT_WE_DO_QUERY_RESULT>({
    query: WHAT_WE_DO_QUERY,
    tags: ["sanity", "whatWeDoPage"],
  });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return seoMetadata(page?.seo ?? null, {
    title: "What We Do — Proxara Policy",
    path: "/what-we-do",
  });
}

export default async function WhatWeDoPage() {
  const [page, pillars] = await Promise.all([
    getPage(),
    sanityFetch<PILLARS_QUERY_RESULT>({
      query: PILLARS_QUERY,
      tags: ["sanity", "pillar"],
    }),
  ]);

  const howWeWorkBody = page?.howWeWorkBody?.length ? page.howWeWorkBody : null;

  return (
    <>
      <PageBanner
        title={page?.title ?? "What We Do"}
        intro={page?.intro}
      />

      {/* Viewpoint — set on the editorial grid with the heading hung in the
          left margin, the way a printed report sets a running head. The page
          previously centred every band in the same measure, which is what made
          it read as a formatted document rather than as a designed page. */}
      {page?.viewpointBody?.length ? (
        <SectionBand variant="navy-wash" className="py-16 md:py-24">
          <Reveal stagger>
            <EditorialGrid className="gap-y-8">
              <Margin>
                <Mark
                  className="mb-4 size-2.5 text-navy"
                  data-reveal-item="up"
                />
                <h2
                  className="font-serif text-xl leading-snug tracking-display text-navy"
                  data-reveal-item="up"
                >
                  {page.viewpointHeading ??
                    "Our view on government and technology"}
                </h2>
                <span
                  className="mt-4 block h-0.5 w-14 bg-gold"
                  aria-hidden
                  data-reveal-item="rule"
                />
              </Margin>
              <Column data-reveal-item="up">
                <div className="prose-measure">
                  <PortableText
                    value={page.viewpointBody as unknown as PortableTextBlock[]}
                  />
                </div>
              </Column>
            </EditorialGrid>
          </Reveal>
        </SectionBand>
      ) : null}

      {/* Services — report contents list with numbered rows */}
      <SectionBand variant="default" className="py-16 md:py-24">
        <Reveal stagger>
          <div className="mb-10" data-reveal-item="up">
            <Mark className="size-2.5 text-navy" />
          </div>
          <span
            className="mb-10 block h-0.5 w-14 bg-gold"
            aria-hidden
            data-reveal-item="rule"
          />
          <ol className={pillars.length ? "border-t-2 border-navy" : undefined}>
            {pillars.map((pillar, i) => (
              <li
                key={pillar._id}
                className="rule-hairline first:border-t-0"
                data-reveal-item="up"
              >
                {/* Numbers sit in the same margin column as the section running
                    heads above and below, so the whole page shares one axis. */}
                <div className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-x-10 md:py-12">
                  <CountUpFigure
                    value={i + 1}
                    className="figures-oldstyle font-serif text-2xl text-gold-deep md:col-span-3 md:text-3xl"
                  />
                  <div className="md:col-span-8 md:col-start-4">
                    <h3 className="font-serif text-xl text-navy md:text-2xl">
                      {pillar.title}
                    </h3>
                    <p className="prose-measure mt-3 leading-relaxed text-foreground/90">
                      {pillar.description ?? pillar.oneLiner}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </SectionBand>

      <PullQuote
        quote={page?.pullQuote?.quote}
        attribution={page?.pullQuote?.attribution}
        source={page?.pullQuote?.source}
        variant={howWeWorkBody ? "gold-wash" : "navy-wash"}
      />

      {/* How we work — mirrored against Viewpoint: the running head hangs on
          the right, so the two prose sections do not read as the same block
          set twice. */}
      {howWeWorkBody ? (
        <SectionBand variant="navy-wash" className="py-16 md:py-24">
          <Reveal stagger>
            <EditorialGrid className="gap-y-8">
              <div className="md:col-span-3 md:col-start-10 md:row-start-1">
                <Mark
                  className="mb-4 size-2.5 text-navy"
                  data-reveal-item="up"
                />
                <h2
                  className="font-serif text-xl leading-snug tracking-display text-navy"
                  data-reveal-item="up"
                >
                  {page?.howWeWorkHeading ?? "How we work"}
                </h2>
                <span
                  className="mt-4 block h-0.5 w-14 bg-gold"
                  aria-hidden
                  data-reveal-item="rule"
                />
              </div>
              <div
                className="md:col-span-8 md:row-start-1"
                data-reveal-item="up"
              >
                <div className="prose-measure">
                  <PortableText
                    value={howWeWorkBody as unknown as PortableTextBlock[]}
                  />
                </div>
              </div>
            </EditorialGrid>
          </Reveal>
        </SectionBand>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
