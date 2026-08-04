import type { Metadata } from "next";

import { PortableText } from "@/components/portable-text";
import { ClosingCta } from "@/components/site/closing-cta";
import { InsetPanel, PanelHead } from "@/components/site/inset-panel";
import { Mark } from "@/components/site/mark";
import { PageBanner } from "@/components/site/page-banner";
import { SectionBand } from "@/components/site/section";
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

  return (
    <>
      <PageBanner
        title={page?.title ?? "What We Do"}
        intro={page?.intro}
      />

      {page?.viewpointBody?.length ? (
        <SectionBand variant="navy-wash" className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 flex items-center gap-2.5">
                <Mark className="size-2.5 text-navy" />
                <span className="h-px w-12 bg-gold" aria-hidden />
              </div>
              <h2 className="font-serif text-2xl tracking-display text-navy md:text-3xl">
                {page.viewpointHeading ??
                  "Our view on government and technology"}
              </h2>
              <span className="mt-6 block h-0.5 w-14 bg-gold" aria-hidden />
              <div className="mt-8">
                <PortableText
                  value={page.viewpointBody as unknown as PortableTextBlock[]}
                />
              </div>
            </div>
          </div>
        </SectionBand>
      ) : null}

      {/* Services — report contents list with numbered rows */}
      <SectionBand variant="default" className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-10 flex items-center gap-2.5">
            <Mark className="size-2.5 text-navy" />
            <span className="h-px w-12 bg-gold" aria-hidden />
          </div>
          <ol className={pillars.length ? "border-t-2 border-navy" : undefined}>
            {pillars.map((pillar, i) => (
              <li key={pillar._id} className="rule-hairline first:border-t-0">
                <div className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
                  <p className="figures-oldstyle font-serif text-2xl text-gold-deep md:col-span-2 md:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="md:col-span-10">
                    <h3 className="font-serif text-xl text-navy md:text-2xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">
                      {pillar.description ?? pillar.oneLiner}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionBand>

      {/* How we work — bordered panel (distinct from essay + list above) */}
      {page?.howWeWorkBody ? (
        <SectionBand variant="navy-wash" className="py-16 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <InsetPanel className="bg-background">
              <PanelHead title={page.howWeWorkHeading ?? "How we work"} />
              <div className="mt-6 max-w-3xl">
                <PortableText
                  value={page.howWeWorkBody as unknown as PortableTextBlock[]}
                />
              </div>
            </InsetPanel>
          </div>
        </SectionBand>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
