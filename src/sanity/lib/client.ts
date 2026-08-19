import { unstable_cache } from "next/cache";
import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Cached, tag-based fetch. Pages stay static; the Sanity webhook at
 * /api/revalidate busts these tags so edits go live on the next request.
 *
 * Tags are registered with `unstable_cache`, not `client.fetch({ next: { tags } })`.
 * Next 16 does not attach fetch cache tags from the Sanity client, so the old
 * `cache: "force-cache"` path kept serving the first payload forever even after
 * a successful webhook. The inner request uses the Content Lake API (`useCdn:
 * false`) so a bust cannot revive a stale Sanity CDN response.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = ["sanity"],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<QueryResponse> {
  const cacheTags = tags.includes("sanity") ? tags : ["sanity", ...tags];

  return unstable_cache(
    async () =>
      client.fetch<QueryResponse>(query, params as QueryParams, {
        useCdn: false,
      }),
    ["sanity-fetch", query, JSON.stringify(params)],
    { tags: cacheTags },
  )();
}
