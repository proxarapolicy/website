import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatDate } from "@/lib/format";
import { sanityFetch } from "@/sanity/lib/client";
import { TAGS_QUERY, THINKING_FEED_QUERY } from "@/sanity/lib/queries";
import type {
  TAGS_QUERY_RESULT,
  THINKING_FEED_QUERY_RESULT,
} from "@/sanity/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thinking — Proxara Policy",
  description:
    "Essays and published articles on AI governance, platform policy, and technology regulation across EMEA — from Proxara Policy.",
  alternates: { canonical: "/thinking" },
  openGraph: {
    title: "Thinking — Proxara Policy",
    description:
      "Essays and published articles on AI governance, platform policy, and technology regulation across EMEA.",
    type: "website",
    siteName: "Proxara Policy",
  },
};

export default async function ThinkingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag = "" } = await searchParams;

  const [items, tags] = await Promise.all([
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
          <h1 className="font-serif text-4xl text-navy md:text-5xl">Thinking</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Essays and published articles on the politics of emerging
            technology — AI governance, platform policy, and regulation across
            EMEA.
          </p>

          {/* Topic filter — plain links, server-rendered, zero client JS */}
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
              ) : null
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {items.length === 0 ? (
          <p className="py-16 text-muted-foreground">
            No pieces under this topic yet.
          </p>
        ) : (
          <ul>
            {items.map((item) => {
              const isPost = item._type === "post";
              const href = isPost
                ? `/thinking/${item.slug}`
                : item.url ?? "#";
              return (
                <li key={item._id} className="border-b border-border">
                  <Link
                    href={href}
                    target={isPost ? undefined : "_blank"}
                    rel={isPost ? undefined : "noopener noreferrer"}
                    className="group grid gap-2 py-10 md:grid-cols-[11rem_1fr] md:gap-10"
                  >
                    <div className="text-sm text-muted-foreground">
                      <p>{formatDate(item.publishedAt)}</p>
                      <p className="mt-1 font-medium text-gold-deep">
                        {isPost ? "Essay" : item.publication}
                      </p>
                    </div>
                    <div>
                      <h2 className="max-w-3xl font-serif text-2xl leading-snug text-navy group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
                        {item.title}
                        {!isPost ? (
                          <ArrowUpRight className="ml-1 inline size-4 text-muted-foreground" />
                        ) : null}
                      </h2>
                      {isPost && item.excerpt ? (
                        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                          {item.excerpt}
                        </p>
                      ) : null}
                      {item.tags?.length ? (
                        <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {item.tags.map((t) => t.title).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
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
          : "border-border text-muted-foreground hover:border-navy hover:text-navy"
      )}
    >
      {children}
    </Link>
  );
}
