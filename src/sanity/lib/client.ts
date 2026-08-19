import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Public-page GROQ reads. Callers still pass `tags` (webhook / layout
 * contract) but they are not used for Next's data cache: `unstable_cache` +
 * `revalidateTag` did not expire after Sanity publishes (live HTML stayed on
 * the seed payload even with `force-dynamic` and a 200 webhook).
 *
 * The (site) layout is `force-dynamic`, so each request hits the Content Lake
 * API (`useCdn: false`) and Studio publishes show up on refresh.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params as QueryParams, {
    useCdn: false,
  });
}
