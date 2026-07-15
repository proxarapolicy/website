import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    title: "Proxara Policy — Technology & AI Policy Advisory across EMEA",
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
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-gold">
              {page.heroKicker}
            </p>
          ) : null}
          <h1 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl md:leading-[1.1]">
            {page?.heroHeading}
          </h1>
          <div className="mt-10">
            <Button
              size="lg"
              className="bg-gold text-navy-deep hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {page?.heroCtaLabel ?? "Let’s Talk"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      {page?.credibilityItems?.length ? (
        <section className="border-b border-border bg-muted">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:gap-12 md:px-8">
            {page.credibilityHeading ? (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
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

      {/* Service pillars */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-serif text-3xl text-navy md:text-4xl">
            {page?.pillarsHeading ?? "What we do"}
          </h2>
          {page?.pillarsIntro ? (
            <p className="mt-4 text-muted-foreground">{page.pillarsIntro}</p>
          ) : null}
        </div>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Link
              key={pillar._id}
              href="/what-we-do"
              className="group block border-t-2 border-navy pt-5 transition-colors hover:border-gold"
            >
              <p className="text-xs tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-serif text-xl leading-snug text-navy">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pillar.oneLiner}
              </p>
            </Link>
          ))}
        </div>
      </section>

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
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-3xl text-navy md:text-4xl">
            {page?.thinkingHeading ?? "Latest thinking"}
          </h2>
          <Link
            href="/thinking"
            className="text-sm text-muted-foreground transition-colors hover:text-navy"
          >
            All thinking →
          </Link>
        </div>
        <Separator className="mb-2" />
        <ul>
          {latest.map((item) => {
            const isPost = item._type === "post";
            const href = isPost ? `/thinking/${item.slug}` : item.url ?? "#";
            return (
              <li key={item._id} className="border-b border-border">
                <Link
                  href={href}
                  target={isPost ? undefined : "_blank"}
                  rel={isPost ? undefined : "noopener noreferrer"}
                  className="group flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <span className="font-serif text-xl leading-snug text-navy group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4 md:max-w-3xl">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {isPost ? "Essay" : item.publication} ·{" "}
                    {formatDate(item.publishedAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
