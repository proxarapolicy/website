import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ViewTransition } from "react";

import { ClosingCta } from "@/components/site/closing-cta";
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

export default async function ThinkingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
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

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <h1 className="font-serif text-h1 tracking-display text-navy">
            {page?.title ?? "Thinking"}
          </h1>
          {page?.intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </p>
          ) : null}

          {/* Topic filter — plain links, server-rendered, zero client JS.
              Hidden until there is something to filter. */}
          {items.length || tag ? (
            <nav
              aria-label="Filter by topic"
              className="mt-10 flex flex-wrap gap-2"
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {items.length === 0 ? (
          <p className="py-16 text-muted-foreground">
            {page?.emptyState ?? "No pieces under this topic yet."}
          </p>
        ) : (
          groupByYear(items).map(([year, group]) => (
            <section key={year} aria-label={year}>
              {/* Year rule — a 2px navy division opening each volume of the
                  archive, the way a bound collection separates years. */}
              <h2 className="figures-oldstyle sticky top-16 z-10 border-t-2 border-navy bg-background pb-2 pt-6 font-serif text-sm text-muted-foreground">
                {year}
              </h2>
              <ul>
                {group.map((item) => {
                  const isPost = item._type === "post";
                  const href = isPost
                    ? `/thinking/${item.slug}`
                    : (item.url ?? "#");
                  return (
                    <li key={item._id} className="rule-hairline">
                      <Link
                        href={href}
                        target={isPost ? undefined : "_blank"}
                        rel={isPost ? undefined : "noopener noreferrer"}
                        className="group grid gap-2 py-10 md:grid-cols-[11rem_1fr] md:gap-10"
                      >
                        <div className="text-sm text-muted-foreground">
                          <p className="figures-oldstyle">
                            {formatDate(item.publishedAt)}
                          </p>
                          <p className="eyebrow mt-1 text-gold-deep">
                            {isPost ? "Essay" : item.publication}
                          </p>
                        </div>
                        <div>
                          <ViewTransition
                            name={
                              isPost ? `essay-${item.slug}` : `link-${item._id}`
                            }
                            share="morph"
                          >
                            <h2 className="max-w-3xl font-serif text-2xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold">
                              {item.title}
                              {!isPost ? (
                                <ArrowUpRight className="ml-1 inline size-4 text-muted-foreground" />
                              ) : null}
                            </h2>
                          </ViewTransition>
                          {isPost && item.excerpt ? (
                            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                              {item.excerpt}
                            </p>
                          ) : null}
                          {item.tags?.length ? (
                            <p className="mt-3 eyebrow text-muted-foreground">
                              {item.tags.map((t) => t.title).join(" · ")}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </section>

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
          ? "border-navy bg-navy text-primary-foreground"
          : "border-border text-muted-foreground hover:border-navy hover:text-navy",
      )}
    >
      {children}
    </Link>
  );
}
