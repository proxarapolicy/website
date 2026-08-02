import type { PortableTextBlock } from "@portabletext/types";

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Year only — used to group the /thinking archive. */
export function yearOf(date: string | null | undefined): string {
  if (!date) return "";
  return String(new Date(date).getFullYear());
}

const WORDS_PER_MINUTE = 220;

/**
 * Estimated reading time in whole minutes for a Portable Text body.
 * Walks only span children of block nodes, so images and custom types are
 * ignored rather than counted as prose. Returns 0 when there is nothing to
 * measure, which callers use to omit the line entirely.
 */
export function readingTime(
  body: PortableTextBlock[] | null | undefined,
): number {
  if (!body?.length) return 0;

  let words = 0;
  for (const block of body) {
    if (block?._type !== "block" || !Array.isArray(block.children)) continue;
    for (const child of block.children) {
      const text = (child as { text?: unknown })?.text;
      if (typeof text === "string" && text.trim()) {
        words += text.trim().split(/\s+/).length;
      }
    }
  }

  return words ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : 0;
}
