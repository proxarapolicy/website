import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";
import { InsetPanel, PanelHead } from "@/components/site/inset-panel";
import { PageBanner } from "@/components/site/page-banner";
import { SectionBand } from "@/components/site/section";
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

/** Shared content column so banner, cards, and stages share one center axis. */
const CONTENT = "mx-auto w-full max-w-5xl";

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

      <SectionBand variant="navy-wash" className="py-16 md:py-20">
        <div className={CONTENT}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {audiences.map((audience) => (
              <InsetPanel
                key={audience._id}
                className="flex h-full flex-col bg-background"
              >
                <PanelHead title={audience.name ?? ""} />
                {audience.body ? (
                  <p className="mt-6 flex-1 leading-relaxed text-foreground/90">
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
        </div>
      </SectionBand>

      {page?.stagesBody ? (
        <SectionBand variant="default" className="py-16 md:py-20">
          <div className={CONTENT}>
            <InsetPanel className="surface-navy-wash">
              <PanelHead
                title={
                  page.stagesHeading ??
                  "Working with companies at different stages"
                }
              />
              <p className="mt-6 max-w-3xl leading-relaxed text-foreground/90">
                {page.stagesBody}
              </p>
            </InsetPanel>
          </div>
        </SectionBand>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
