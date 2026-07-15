import type { Metadata } from "next";

import { urlFor } from "@/sanity/lib/image";

type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: { asset?: unknown } | null;
} | null;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}
