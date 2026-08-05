import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { EssayAdjacentNav } from "@/components/site/essay-adjacent-nav";
import { EssayRelated } from "@/components/site/essay-related";
import { EssayShare } from "@/components/site/essay-share";
import { EssaySidebar } from "@/components/site/essay-sidebar";
import { EndMark, Mark } from "@/components/site/mark";
import { Section, SectionBand } from "@/components/site/section";
import {
  adjacentEssays,
  relatedEssays,
  toEssayIndex,
} from "@/lib/essay-index";
import { THINKING_ENABLED } from "@/lib/feature-flags";
import { formatDate, readingTime } from "@/lib/format";
import { seoMetadata, siteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  THINKING_FEED_QUERY,
} from "@/sanity/lib/queries";
import type {
  POST_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
  THINKING_FEED_QUERY_RESULT,
} from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const getPost = (slug: string) =>
  sanityFetch<POST_QUERY_RESULT>({
    query: POST_QUERY,
    params: { slug },
    tags: ["sanity", "post"],
  });

export async function generateStaticParams() {
  if (!THINKING_ENABLED) return [];

  const slugs = await sanityFetch<POST_SLUGS_QUERY_RESULT>({
    query: POST_SLUGS_QUERY,
    tags: ["sanity", "post"],
  });
  return slugs
    .map(({ slug }) => slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return seoMetadata(post.seo ?? null, {
    title: `${post.title} — Proxara Policy`,
    description: post.excerpt ?? undefined,
    path: `/thinking/${post.slug}`,
  });
}

// Temporarily disabled — flip THINKING_ENABLED in src/lib/feature-flags.ts to restore.
export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!THINKING_ENABLED) notFound();

  const { slug } = await params;

  const [post, feed] = await Promise.all([
    getPost(slug),
    sanityFetch<THINKING_FEED_QUERY_RESULT>({
      query: THINKING_FEED_QUERY,
      params: { tag: "" },
      tags: ["sanity", "post", "externalArticle"],
    }),
  ]);

  if (!post) notFound();

  const essayIndex = toEssayIndex(feed);

  const { newer, older } = adjacentEssays(essayIndex, slug);
  const related = relatedEssays(essayIndex, post, 3);

  const readingMinutes = readingTime(
    post.body as unknown as PortableTextBlock[] | null,
  );

  const pageUrl = `${siteUrl}/thinking/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: "Mwenda Kilemi",
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Proxara Policy Limited",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <SectionBand variant="default" className="pb-4 pt-8 md:pt-10">
        <Link
          href="/thinking"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-gold-deep"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to all thinking
        </Link>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-16">
          <article>
            <header className="surface-navy border-t-2 border-t-gold px-5 py-8 md:px-8 md:py-10">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-on-navy-muted">
                <span className="figures-oldstyle">
                  {formatDate(post.publishedAt)}
                </span>
                {readingMinutes ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="figures-oldstyle">
                      {readingMinutes} min read
                    </span>
                  </>
                ) : null}
              </p>

              <ViewTransition name={`essay-${post.slug}`} share="morph">
                <h1 className="mt-5 max-w-3xl font-serif text-h1 leading-[1.12] tracking-display text-primary-foreground">
                  {post.title}
                </h1>
              </ViewTransition>

              <span
                className="mt-6 block h-0.5 w-14 bg-gold"
                aria-hidden
              />

              {post.excerpt ? (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-navy-muted md:text-xl">
                  {post.excerpt}
                </p>
              ) : null}

              {post.tags?.length ? (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {post.tags.map((t) =>
                    t.slug && t.title ? (
                      <li key={t.slug}>
                        <Link
                          href={`/thinking?tag=${t.slug}`}
                          className="border border-on-navy-line px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.06em] text-on-navy-muted uppercase transition-colors hover:border-gold hover:text-gold-on-navy"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : null}
            </header>

            <div className="prose-measure mt-10 max-w-none text-[1.0625rem] lg:mt-12 lg:max-w-[40rem]">
              <PortableText
                value={post.body as unknown as PortableTextBlock[]}
              />
            </div>

            <EndMark className="mt-12" />

            <div className="mt-12 flex flex-col gap-8 border-t border-border pt-8">
              <EssayShare
                title={post.title ?? "Proxara Policy"}
                url={pageUrl}
              />
              <EssayAdjacentNav newer={newer} older={older} />
            </div>
          </article>

          <EssaySidebar essays={essayIndex} currentSlug={post.slug} />
        </div>
      </SectionBand>

      <EssayRelated essays={related} />

      <Section className="py-10 md:py-12">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Mark className="size-2 text-navy" />
          <Link href="/thinking" className="hover:text-navy">
            ← Back to all thinking
          </Link>
        </div>
      </Section>
    </>
  );
}
