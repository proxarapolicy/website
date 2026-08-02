import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { EndMark } from "@/components/site/mark";
import { formatDate, readingTime } from "@/lib/format";
import { seoMetadata, siteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type {
  POST_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
} from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const getPost = (slug: string) =>
  sanityFetch<POST_QUERY_RESULT>({
    query: POST_QUERY,
    params: { slug },
    tags: ["sanity", "post"],
  });

export async function generateStaticParams() {
  const slugs = await sanityFetch<POST_SLUGS_QUERY_RESULT>({
    query: POST_SLUGS_QUERY,
    tags: ["sanity", "post"],
  });
  return slugs.map(({ slug }) => ({ slug }));
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

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const readingMinutes = readingTime(
    post.body as unknown as PortableTextBlock[] | null,
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `${siteUrl}/thinking/${post.slug}`,
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
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header>
        <p className="text-sm text-muted-foreground">
          <Link href="/thinking" className="hover:text-navy">
            Thinking
          </Link>{" "}
          ·{" "}
          <span className="figures-oldstyle">
            {formatDate(post.publishedAt)}
          </span>
          {readingMinutes ? (
            <>
              {" · "}
              <span className="figures-oldstyle">{readingMinutes}</span> min
              read
            </>
          ) : null}
        </p>
        {/* Carries position and size from the matching title on /thinking.
            The only motion on the site. */}
        <ViewTransition name={`essay-${post.slug}`} share="morph">
          <h1 className="mt-4 font-serif text-h1 leading-[1.12] tracking-display text-navy">
            {post.title}
          </h1>
        </ViewTransition>
        {post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
        {post.tags?.length ? (
          <p className="mt-6 eyebrow text-muted-foreground">
            {post.tags.map((t) => t.title).join(" · ")}
          </p>
        ) : null}
      </header>

      <hr className="my-10 border-border" />

      <div className="prose-measure text-[1.0625rem]">
        <PortableText value={post.body as unknown as PortableTextBlock[]} />
      </div>

      {/* Closes the essay the way a printed journal does */}
      <EndMark className="mt-10" />

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/thinking"
          className="text-sm text-muted-foreground hover:text-navy"
        >
          ← All thinking
        </Link>
      </footer>
    </article>
  );
}
