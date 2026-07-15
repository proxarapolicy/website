import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Cached, tag-based fetch. Pages are fully static; the Sanity webhook at
 * /api/revalidate busts the "sanity" tag so edits go live in seconds.
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
  return client.fetch<QueryResponse>(query, params as QueryParams, {
    cache: "force-cache",
    next: { tags },
  });
}
