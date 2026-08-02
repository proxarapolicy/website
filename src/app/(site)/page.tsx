import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PortableText } from "@/components/portable-text";
import { Mark } from "@/components/site/mark";
import { EditorialGrid, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { seoMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import {
  HOME_PAGE_QUERY,
  LATEST_THINKING_QUERY,
  PILLARS_QUERY,
} from "@/sanity/lib/queries";
import type {
  HOME_PAGE_QUERY_RESULT,
  LATEST_THINKING_QUERY_RESULT,
  PILLARS_QUERY_RESULT,
} from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

async function getData() {
  const [page, pillars, latest] = await Promise.all([
    sanityFetch<HOME_PAGE_QUERY_RESULT>({
      query: HOME_PAGE_QUERY,
      tags: ["sanity", "homePage"],
    }),
    sanityFetch<PILLARS_QUERY_RESULT>({
      query: PILLARS_QUERY,
      tags: ["sanity", "pillar"],
    }),
    sanityFetch<LATEST_THINKING_QUERY_RESULT>({
      query: LATEST_THINKING_QUERY,
      tags: ["sanity", "post", "externalArticle"],
    }),
  ]);
  return { page, pillars, latest };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<HOME_PAGE_QUERY_RESULT>({
    query: HOME_PAGE_QUERY,
    tags: ["sanity", "homePage"],
  });
  return seoMetadata(page?.seo ?? null, {
    title: "Proxara Policy — Technology & AI Policy Advisory",
    path: "/",
  });
}

export default async function HomePage() {
  const { page, pillars, latest } = await getData();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-deep text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
          {page?.heroKicker ? (
            <p className="eyebrow mb-6 text-gold-on-navy">{page.heroKicker}</p>
          ) : null}
          <h1 className="max-w-4xl font-serif text-display leading-[1.08] tracking-display">
            {page?.heroHeading}
          </h1>
          {page?.heroSubline ? (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-on-navy-muted">
              {page.heroSubline}
            </p>
          ) : null}
          <div className="mt-10">
            <Button
              size="lg"
              className="bg-gold-cta text-navy-deep hover:bg-gold-cta/90"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {page?.heroCtaLabel ?? "Let’s Talk"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Positioning statement */}
      {page?.positioningBody?.length ? (
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-5 py-20 text-lg md:px-8 md:py-24">
            <PortableText
              value={page.positioningBody as unknown as PortableTextBlock[]}
            />
          </div>
        </section>
      ) : null}

      {/* Credibility strip */}
      {page?.credibilityItems?.length ? (
        <section className="border-b border-border bg-muted">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:gap-12 md:px-8">
            {page.credibilityHeading ? (
              <p className="eyebrow shrink-0 text-muted-foreground">
                {page.credibilityHeading}
              </p>
            ) : null}
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
              {page.credibilityItems.map((item) => (
                <li
                  key={item}
                  className="font-serif text-lg text-navy md:text-xl"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Service pillars — set as a report contents list, not a card grid.
          Numbers hang in the left margin; hairline rules separate rows. */}
      <Section className="py-20 md:py-28">
        {/* Heading left, intro right — the asymmetry is the split between the
            two columns, so the heading still aligns with the list edge below.
            Indenting the heading away from its own list reads as a mistake. */}
        <EditorialGrid className="mb-12">
          <div className="md:col-span-5">
            {/* Structural marker, not copy — the brand diamond stands in for a
                running head, so nothing here needs authoring in Sanity. */}
            <Mark className="mb-5 size-3 text-navy" />
            <h2 className="font-serif text-h2 text-navy">
              {page?.pillarsHeading ?? "What we do"}
            </h2>
          </div>
          {page?.pillarsIntro ? (
            <div className="md:col-span-6 md:col-start-7 md:self-end">
              <p className="text-muted-foreground">{page.pillarsIntro}</p>
            </div>
          ) : null}
        </EditorialGrid>

        {/* 2px navy = major division; hairlines below = row separators */}
        <ol className={pillars.length ? "border-t-2 border-navy" : undefined}>
          {pillars.map((pillar, i) => (
            <li key={pillar._id} className="rule-hairline first:border-t-0">
              <Link
                href="/what-we-do"
                className="group grid items-baseline gap-x-10 gap-y-2 py-7 md:grid-cols-12"
              >
                <span className="figures-tabular text-sm text-muted-foreground md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold md:col-span-5">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-6">
                  {pillar.oneLiner}
                </p>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <SectionLink href="/what-we-do">
            {page?.pillarsCtaLabel ?? "See all services"}
          </SectionLink>
        </div>
      </Section>

      {/* Who we work with */}
      {page?.audienceBody ? (
        <section className="border-y border-border bg-muted">
          <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-24">
            <h2 className="font-serif text-h2 text-navy">
              {page.audienceHeading ?? "Who we work with"}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">
              {page.audienceBody}
            </p>
            <div className="mt-8">
              <SectionLink href="/who-we-work-with">
                {page.audienceCtaLabel ?? "Learn more"}
              </SectionLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* About teaser */}
      {page?.aboutTeaserBody ? (
        <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-24">
          <p className="text-lg leading-relaxed text-foreground/90">
            {page.aboutTeaserBody}
          </p>
          <div className="mt-8">
            <SectionLink href="/about">
              {page.aboutCtaLabel ?? "About Mwenda"}
            </SectionLink>
          </div>
        </section>
      ) : null}

      {/* Social proof */}
      {page?.testimonials?.length ? (
        <section className="bg-muted">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-24">
            {page.testimonials.map((t) => (
              <figure key={t._id}>
                <blockquote className="font-serif text-2xl leading-snug text-navy md:text-3xl">
                  “{t.quote}”
                </blockquote>
                {t.attribution ? (
                  <figcaption className="mt-6 text-sm text-muted-foreground">
                    — {t.attribution}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Latest thinking */}
      <Section className="py-20 md:py-28">
        <EditorialGrid className="mb-10">
          <div className="md:col-span-5">
            <Mark className="mb-5 size-3 text-navy" />
            <h2 className="font-serif text-h2 text-navy">
              {page?.thinkingHeading ?? "Latest thinking"}
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end">
            {page?.thinkingIntro ? (
              <p className="leading-relaxed text-muted-foreground">
                {page.thinkingIntro}
              </p>
            ) : null}
            <div className="mt-8">
              <SectionLink href="/thinking">
                {page?.thinkingCtaLabel ?? "Read our latest thinking"}
              </SectionLink>
            </div>
          </div>
        </EditorialGrid>
        {/* Guard the rule: with no items the bare 2px division reads as a
            broken element rather than as the top of a list. */}
        <ul className={latest.length ? "border-t-2 border-navy" : undefined}>
          {latest.map((item) => {
            const isPost = item._type === "post";
            const href = isPost ? `/thinking/${item.slug}` : (item.url ?? "#");
            return (
              <li key={item._id} className="rule-hairline first:border-t-0">
                <Link
                  href={href}
                  target={isPost ? undefined : "_blank"}
                  rel={isPost ? undefined : "noopener noreferrer"}
                  className="group flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <span className="font-serif text-xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold md:max-w-3xl">
                    {item.title}
                  </span>
                  <span className="figures-tabular shrink-0 text-sm text-muted-foreground">
                    {isPost ? "Essay" : item.publication} ·{" "}
                    {formatDate(item.publishedAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

/** Gold text link used to bridge the home page into each section page. */
function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-medium text-gold-deep transition-colors hover:text-navy"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
