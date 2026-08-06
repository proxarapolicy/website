import type { Metadata } from "next";
import Image from "next/image";

import { CountUpFigure } from "@/components/motion/count-up-figure";
import { Reveal } from "@/components/motion/reveal";
import { LinkedProse, PortableText } from "@/components/portable-text";
import { ClosingCta } from "@/components/site/closing-cta";
import { Mark } from "@/components/site/mark";
import { PageBanner } from "@/components/site/page-banner";
import { SectionBand } from "@/components/site/section";
import { seoMetadata, siteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const getPage = () =>
  sanityFetch<ABOUT_PAGE_QUERY_RESULT>({
    query: ABOUT_PAGE_QUERY,
    tags: ["sanity", "aboutPage"],
  });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return seoMetadata(page?.seo ?? null, {
    title: "About — Proxara Policy",
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await getPage();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: page?.name ?? "Mwenda Kilemi",
    jobTitle: page?.role ?? "Founder & Principal",
    worksFor: {
      "@type": "Organization",
      name: "Proxara Policy Limited",
      url: siteUrl,
    },
    url: `${siteUrl}/about`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <PageBanner
        title={page?.title ?? "About"}
        intro={page?.intro}
      />

      <SectionBand variant="default" className="py-16 md:py-24">
        {/* `stagger` rather than a wrapping Reveal: the portrait column is
            `md:sticky`, and an animated transform on an ancestor would make it
            a containing block and silently kill the stickiness. */}
        <Reveal
          stagger
          className="grid gap-12 md:grid-cols-[1fr_20rem] md:gap-16 lg:grid-cols-[1fr_24rem]"
        >
          <div data-reveal-item="up">
            <div className="mb-4 flex items-center gap-2.5">
              <Mark className="size-2.5 text-navy" />
              <span className="h-px w-12 bg-gold" aria-hidden />
            </div>
            <h2 className="font-serif text-h1 tracking-display text-navy">
              {page?.name ?? "Mwenda Kilemi"}
            </h2>
            {page?.role ? (
              <p className="mt-4 eyebrow text-gold-deep">
                {page.role}
              </p>
            ) : null}

            {page?.story ? (
              <div className="mt-10">
                <PortableText
                  value={page.story as unknown as PortableTextBlock[]}
                />
              </div>
            ) : null}
          </div>

          <div className="md:sticky md:top-24 md:self-start">
            {page?.headshot?.asset ? (
              <Image
                src={urlFor(page.headshot).width(800).height(1000).fit("crop").url()}
                alt={page.headshot.alt ?? page?.name ?? "Founder headshot"}
                width={800}
                height={1000}
                priority
                className="w-full max-w-sm"
                sizes="(min-width: 768px) 24rem, 100vw"
                data-reveal-item="up"
              />
            ) : (
              <div
                aria-hidden
                className="flex aspect-4/5 w-full max-w-sm items-center justify-center bg-muted"
                data-reveal-item="up"
              >
                <p className="px-8 text-center text-sm text-muted-foreground">
                  Professional headshot to be supplied by the client
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </SectionBand>

      {page?.highlights?.length ? (
        <SectionBand variant="navy" className="py-16 md:py-24">
          <Reveal stagger>
          <h2 className="font-serif text-3xl" data-reveal-item="up">
            {page.highlightsHeading ?? "Career highlights"}
          </h2>
          <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {page.highlights.map((highlight, i) => (
              <li
                key={i}
                className="border-t border-on-navy-line pt-5"
                data-reveal-item="up"
              >
                <CountUpFigure
                  value={i + 1}
                  className="eyebrow text-gold-on-navy"
                />
                <p className="mt-2 leading-relaxed text-on-navy-muted">
                  {highlight}
                </p>
              </li>
            ))}
          </ul>
          </Reveal>
        </SectionBand>
      ) : null}

      {page?.civicBody ? (
        <SectionBand variant="navy-wash" className="py-16 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2.5">
              <Mark className="size-2.5 text-navy" />
              <span className="h-px w-12 bg-gold" aria-hidden />
            </div>
            <h2 className="font-serif text-2xl tracking-display text-navy md:text-3xl">
              {page.civicHeading ?? "Beyond the day job"}
            </h2>
            <LinkedProse className="mt-6 text-[1.0625rem] leading-[1.75] text-foreground/90">
              {page.civicBody}
            </LinkedProse>
          </Reveal>
        </SectionBand>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
