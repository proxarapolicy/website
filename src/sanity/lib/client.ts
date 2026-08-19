import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Public-page GROQ reads. The (site) layout is `force-dynamic`, so HTML is
 * not CDN-cached. Next still caches `fetch()` as `force-cache` unless we pass
 * `cache: "no-store"` — without it, every request reused the first Sanity
 * payload. `useCdn: false` hits the Content Lake API, not the Sanity CDN.
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
    // Next intercepts `fetch` and caches it as `force-cache` even on
    // `force-dynamic` pages unless this is set. That is why Studio publishes
    // still rendered the seed email/location after the CDN HTML cache was gone.
    cache: "no-store",
  });
}
