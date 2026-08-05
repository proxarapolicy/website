import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { ViewTransition } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ClosingCta } from "@/components/site/closing-cta";
import { Mark } from "@/components/site/mark";
import { PageBanner } from "@/components/site/page-banner";
import { SectionBand } from "@/components/site/section";
import { formatDate, yearOf } from "@/lib/format";
import { seoMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import {
  TAGS_QUERY,
  THINKING_FEED_QUERY,
  THINKING_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type {
  TAGS_QUERY_RESULT,
  THINKING_FEED_QUERY_RESULT,
  THINKING_PAGE_QUERY_RESULT,
} from "@/sanity/types";
import { THINKING_ENABLED } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";

const getPage = () =>
  sanityFetch<THINKING_PAGE_QUERY_RESULT>({
    query: THINKING_PAGE_QUERY,
    tags: ["sanity", "thinkingPage"],
  });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return seoMetadata(page?.seo ?? null, {
    title: "Thinking — Proxara Policy",
    path: "/thinking",
  });
}

// Temporarily disabled — flip THINKING_ENABLED in src/lib/feature-flags.ts to restore.
export default async function ThinkingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  if (!THINKING_ENABLED) notFound();

  const { tag = "" } = await searchParams;

  const [page, items, tags] = await Promise.all([
    getPage(),
    sanityFetch<THINKING_FEED_QUERY_RESULT>({
      query: THINKING_FEED_QUERY,
      params: { tag },
      tags: ["sanity", "post", "externalArticle"],
    }),
    sanityFetch<TAGS_QUERY_RESULT>({
      query: TAGS_QUERY,
      tags: ["sanity", "tag"],
    }),
  ]);

  const feed = items;

  return (
    <>
      <PageBanner title={page?.title ?? "Thinking"} intro={page?.intro}>
        {/* Topic filter — plain links, server-rendered, zero client JS.
            Hidden until there is something to filter. */}
        {feed.length || tag ? (
          <nav
            aria-label="Filter by topic"
            className="flex flex-wrap gap-2"
          >
            <FilterLink href="/thinking" active={tag === ""}>
              All topics
            </FilterLink>
            {tags.map((t) =>
              t.slug ? (
                <FilterLink
                  key={t._id}
                  href={`/thinking?tag=${t.slug}`}
                  active={tag === t.slug}
                >
                  {t.title}
                </FilterLink>
              ) : null,
            )}
          </nav>
        ) : null}
      </PageBanner>

      <SectionBand variant="default" className="pb-24 pt-4 md:pb-28">
        {feed.length === 0 ? (
          <Reveal className="mx-auto max-w-xl border border-border border-t-2 border-t-gold bg-surface-navy-wash px-8 py-16 text-center md:px-12 md:py-20">
            <Mark className="mx-auto mb-6 size-3 text-navy" />
            <p className="font-serif text-xl leading-snug text-navy md:text-2xl">
              {page?.emptyState ??
                (tag
                  ? "No pieces under this topic yet."
                  : "Pieces will appear here as they are published.")}
            </p>
            <span
              className="mx-auto mt-6 block h-0.5 w-12 bg-gold"
              aria-hidden
            />
            {tag ? (
              <p className="mt-8">
                <Link
                  href="/thinking"
                  className="inline-flex items-center gap-2 font-medium text-gold-deep underline decoration-gold underline-offset-[0.18em] transition-colors hover:text-navy hover:decoration-gold-deep"
                >
                  View all topics
                </Link>
              </p>
            ) : null}
          </Reveal>
        ) : (
          groupByYear(feed).map(([year, group]) => (
            <section key={year} aria-label={year} className="mt-4 first:mt-0">
              {/* Year volume head — sticky so the archive reads as a bound journal */}
              <h2 className="figures-oldstyle sticky top-16 z-10 flex items-center gap-3 border-t-2 border-navy bg-background py-4 font-serif text-base text-navy">
                <Mark className="size-2.5 shrink-0 text-navy" />
                <span>{year}</span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </h2>
              {/* The stagger wrapper sits on the list, not the <section>: the
                  year head above is `sticky`, and an animated transform on a
                  shared ancestor would break it. */}
              <Reveal stagger>
              <ul className="mt-2 space-y-3">
                {group.map((item) => {
                  const isPost = item._type === "post";
                  const href = isPost
                    ? `/thinking/${item.slug}`
                    : (item.url ?? "#");
                  return (
                    <li key={item._id} data-reveal-item="up">
                      <Link
                        href={href}
                        target={isPost ? undefined : "_blank"}
                        rel={isPost ? undefined : "noopener noreferrer"}
                        className="group grid gap-5 border border-border border-t-2 border-t-transparent bg-background px-5 py-7 transition-colors hover:border-t-gold hover:bg-surface-navy-wash md:grid-cols-[10.5rem_1fr] md:gap-10 md:px-7 md:py-8"
                      >
                        <div className="md:border-r md:border-border md:pr-8">
                          <p className="figures-oldstyle text-sm text-muted-foreground">
                            {formatDate(item.publishedAt)}
                          </p>
                          <p className="eyebrow mt-3 text-gold-deep">
                            {isPost ? "Essay" : item.publication}
                          </p>
                          <span
                            className="mt-4 hidden h-0.5 w-8 bg-gold transition-all group-hover:w-12 md:block"
                            aria-hidden
                          />
                        </div>

                        <div className="min-w-0">
                          <ViewTransition
                            name={
                              isPost ? `essay-${item.slug}` : `link-${item._id}`
                            }
                            share="morph"
                          >
                            <h3 className="max-w-3xl font-serif text-xl leading-snug tracking-display text-navy md:text-2xl">
                              {item.title}
                              {!isPost ? (
                                <ArrowUpRight
                                  className="ml-1.5 inline size-4 translate-y-[-0.1em] text-gold-deep"
                                  aria-hidden
                                />
                              ) : null}
                            </h3>
                          </ViewTransition>

                          {isPost && item.excerpt ? (
                            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
                              {item.excerpt}
                            </p>
                          ) : null}

                          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {item.tags?.length ? (
                              <ul className="flex flex-wrap gap-2">
                                {item.tags.map((t) =>
                                  t.title ? (
                                    <li
                                      key={t.slug ?? t.title}
                                      className="border border-border bg-background px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.06em] text-muted-foreground uppercase"
                                    >
                                      {t.title}
                                    </li>
                                  ) : null,
                                )}
                              </ul>
                            ) : null}
                            <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                              {isPost ? "Read essay" : "Read article"}
                              <ArrowUpRight className="size-3.5" aria-hidden />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              </Reveal>
            </section>
          ))
        )}
      </SectionBand>

      <ClosingCta body={page?.closingBody} ctaLabel={page?.closingCtaLabel} />
    </>
  );
}

/**
 * Groups the feed into volumes by publication year, preserving the query's
 * existing newest-first order both between and within years. Undated items
 * fall into a trailing bucket rather than being dropped.
 */
function groupByYear(items: THINKING_FEED_QUERY_RESULT) {
  const groups = new Map<string, THINKING_FEED_QUERY_RESULT>();
  for (const item of items) {
    const year = yearOf(item.publishedAt) || "—";
    const bucket = groups.get(year);
    if (bucket) bucket.push(item);
    else groups.set(year, [item]);
  }
  return [...groups.entries()];
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-gold-on-navy bg-gold-cta text-navy-deep"
          : "border-on-navy-line text-on-navy-muted hover:border-gold-on-navy hover:text-primary-foreground",
      )}
    >
      {children}
    </Link>
  );
}
