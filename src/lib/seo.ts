import type { Metadata } from "next";

import { urlFor } from "@/sanity/lib/image";

type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: { asset?: unknown } | null;
} | null;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Social card used when a page has no ogImage of its own — the Proxara logo on
 * a plain white 1200x630 card. Absolute URL: Slack, LinkedIn and X will not
 * resolve a relative one.
 */
export const defaultOgImage = {
  url: `${siteUrl}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Proxara Policy",
};

/** Build page Metadata from a Sanity seo object with sensible fallbacks. */
export function seoMetadata(
  seo: SeoFields,
  fallback: { title: string; description?: string; path?: string }
): Metadata {
  const title = seo?.metaTitle || fallback.title;
  const description = seo?.metaDescription || fallback.description;
  const ogImage =
    seo?.ogImage && seo.ogImage.asset
      ? urlFor(seo.ogImage as Parameters<typeof urlFor>[0])
          .width(1200)
          .height(630)
          .fit("crop")
          .url()
      : undefined;
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
    : [defaultOgImage];

  return {
    title,
    description,
    alternates: fallback.path ? { canonical: fallback.path } : undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
      siteName: "Proxara Policy",
      url: fallback.path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images,
    },
  };
}
