import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { formatDate } from "@/lib/format";
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
          · {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-navy md:text-5xl md:leading-[1.15]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
        {post.tags?.length ? (
          <p className="mt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {post.tags.map((t) => t.title).join(" · ")}
          </p>
        ) : null}
      </header>

      <hr className="my-10 border-border" />

      <div className="text-[1.0625rem]">
        <PortableText value={post.body as unknown as PortableTextBlock[]} />
      </div>

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
