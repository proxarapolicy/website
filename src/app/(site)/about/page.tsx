import type { Metadata } from "next";
import Image from "next/image";

import { PortableText } from "@/components/portable-text";
import { ClosingCta } from "@/components/site/closing-cta";
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

      {page?.intro ? (
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
            <p className="max-w-3xl font-serif text-xl leading-relaxed text-navy md:text-2xl">
              {page.intro}
            </p>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_20rem] md:gap-16 lg:grid-cols-[1fr_24rem]">
          <div>
            <h1 className="font-serif text-4xl text-navy md:text-5xl">
              {page?.name ?? page?.title ?? "About"}
            </h1>
            {page?.role ? (
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {page.role}
              </p>
            ) : null}

            {page?.story ? (
              <div className="mt-10 max-w-2xl text-[1.0625rem]">
                <PortableText
                  value={page.story as unknown as PortableTextBlock[]}
                />
              </div>
            ) : null}
          </div>

          <div>
            {page?.headshot?.asset ? (
              <Image
                src={urlFor(page.headshot).width(800).height(1000).fit("crop").url()}
                alt={page.headshot.alt ?? page?.name ?? "Founder headshot"}
                width={800}
                height={1000}
                priority
                className="w-full max-w-sm"
                sizes="(min-width: 768px) 24rem, 100vw"
              />
            ) : (
              <div
                aria-hidden
                className="flex aspect-4/5 w-full max-w-sm items-center justify-center bg-muted"
              >
                <p className="px-8 text-center text-sm text-muted-foreground">
                  Professional headshot to be supplied by the client
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {page?.highlights?.length ? (
        <section className="bg-navy-deep text-primary-foreground">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <h2 className="font-serif text-3xl">
              {page.highlightsHeading ?? "Career highlights"}
            </h2>
            <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {page.highlights.map((highlight, i) => (
                <li
                  key={i}
                  className="border-t border-primary-foreground/20 pt-5"
                >
                  <p className="text-sm text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 leading-relaxed text-primary-foreground/90">
                    {highlight}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {page?.civicBody ? (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl text-navy">
              {page.civicHeading ?? "Beyond the day job"}
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/90">
              {page.civicBody}
            </p>
          </div>
        </section>
      ) : null}

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}
