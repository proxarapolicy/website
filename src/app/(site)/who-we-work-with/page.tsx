import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";
import { seoMetadata } from "@/lib/seo";
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <h1 className="font-serif text-4xl text-navy md:text-5xl">
            {page?.title ?? "Who We Work With"}
          </h1>
          {page?.intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-x-12 md:grid-cols-2">
          {audiences.map((audience) => (
            <article
              key={audience._id}
              className="border-b border-border py-12 md:py-14"
            >
              <h2 className="font-serif text-2xl text-navy md:text-3xl">
                {audience.name}
              </h2>
              {audience.body ? (
                <p className="mt-6 leading-relaxed text-foreground/90">
                  {audience.body}
                </p>
              ) : (
                <dl className="mt-6 space-y-6">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      The challenge
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/90">
                      {audience.challenge}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
                      Proxara’s offer
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/90">
                      {audience.offer}
                    </dd>
                  </div>
                </dl>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Company stages — full-width band so it reads as an aside, not a fourth client type */}
      {page?.stagesBody ? (
        <section className="border-y border-border bg-muted">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
            <h2 className="font-serif text-2xl text-navy md:text-3xl">
              {page.stagesHeading ?? "Working with companies at different stages"}
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/90">
              {page.stagesBody}
            </p>
          </div>
        </section>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
