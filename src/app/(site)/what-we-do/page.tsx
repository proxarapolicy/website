import type { Metadata } from "next";

import { PortableText } from "@/components/portable-text";
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <h1 className="font-serif text-4xl text-navy md:text-5xl">
            {page?.title ?? "What We Do"}
          </h1>
          {page?.intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <ol>
          {pillars.map((pillar, i) => (
            <li
              key={pillar._id}
              className="grid gap-4 border-b border-border py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-16"
            >
              <p className="font-serif text-3xl text-gold-deep md:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="font-serif text-2xl text-navy md:text-3xl">
                  {pillar.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-foreground/90">
                  {pillar.description ?? pillar.oneLiner}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {page?.howWeWorkBody ? (
        <section className="bg-muted">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="grid gap-8 md:grid-cols-[8rem_1fr] md:gap-10">
              <div />
              <div className="max-w-2xl">
                <h2 className="mb-6 font-serif text-3xl text-navy">
                  {page.howWeWorkHeading ?? "How we work"}
                </h2>
                <PortableText
                  value={page.howWeWorkBody as unknown as PortableTextBlock[]}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
