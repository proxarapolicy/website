import type { THINKING_FEED_QUERY_RESULT } from "@/sanity/types";

export type EssayIndexItem = Extract<
  THINKING_FEED_QUERY_RESULT[number],
  { _type: "post" }
>;

export function toEssayIndex(
  feed: THINKING_FEED_QUERY_RESULT,
): EssayIndexItem[] {
  return feed.filter(
    (item): item is EssayIndexItem =>
      item._type === "post" && Boolean(item.slug),
  );
}

/** Index is newest-first: `newer` is previous in the list, `older` is next. */
export function adjacentEssays(
  index: EssayIndexItem[],
  slug: string,
): { newer: EssayIndexItem | null; older: EssayIndexItem | null } {
  const i = index.findIndex((item) => item.slug === slug);
  if (i < 0) return { newer: null, older: null };
  return {
    newer: index[i - 1] ?? null,
    older: index[i + 1] ?? null,
  };
}

export function relatedEssays(
  index: EssayIndexItem[],
  current: {
    slug: string | null;
    tags?: Array<{ slug: string | null }> | null;
  },
  limit = 3,
): EssayIndexItem[] {
  const tagSlugs = new Set(
    (current.tags ?? [])
      .map((t) => t.slug)
      .filter((s): s is string => Boolean(s)),
  );

  const others = index.filter((item) => item.slug !== current.slug);

  const scored = others
    .map((item) => ({
      item,
      score:
        item.tags?.filter((t) => t.slug && tagSlugs.has(t.slug)).length ?? 0,
    }))
    .sort((a, b) => b.score - a.score || 0);

  const byTag = scored.filter((s) => s.score > 0).map((s) => s.item);
  if (byTag.length >= limit) return byTag.slice(0, limit);

  const fallback = others.filter(
    (item) => !byTag.some((r) => r._id === item._id),
  );
  return [...byTag, ...fallback].slice(0, limit);
}
