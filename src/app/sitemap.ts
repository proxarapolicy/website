import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { POST_SLUGS_QUERY_RESULT } from "@/sanity/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await sanityFetch<POST_SLUGS_QUERY_RESULT>({
    query: POST_SLUGS_QUERY,
    tags: ["sanity", "post"],
  });

  const staticPages = [
    "",
    "/what-we-do",
    "/who-we-work-with",
    "/about",
    "/thinking",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/thinking" ? 0.9 : 0.7,
  }));

  const essays = posts.map(({ slug }) => ({
    url: `${siteUrl}/thinking/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...essays];
}
