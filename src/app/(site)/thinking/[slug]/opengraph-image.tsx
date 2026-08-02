import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { formatDate } from "@/lib/format";
import { sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY } from "@/sanity/lib/queries";
import type { POST_QUERY_RESULT } from "@/sanity/types";

/**
 * Per-essay social card.
 *
 * When an adviser forwards a piece into Slack or WhatsApp, this card is often
 * the first thing anyone sees of the firm — previously a single static logo
 * image for every URL on the site. Rendered at build time alongside the page.
 *
 * Colours are the literal sRGB of the brand tokens; Satori has no support for
 * oklch() or CSS custom properties, so they cannot be referenced from
 * globals.css and must be kept in sync by hand.
 */
export const alt = "Proxara Policy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY_DEEP = "#0D1934";
const GOLD = "#9C7A2E";
const GOLD_ON_NAVY = "#D3B36E";
const PAPER = "#FAF8F5";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, serif] = await Promise.all([
    sanityFetch<POST_QUERY_RESULT>({
      query: POST_QUERY,
      params: { slug },
      tags: ["sanity", "post"],
    }),
    readFile(path.join(process.cwd(), "src/fonts/og/source-serif-600.ttf")),
  ]);

  const title = post?.title ?? "Proxara Policy";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY_DEEP,
          color: PAPER,
          padding: "72px 80px",
          fontFamily: "Source Serif",
        }}
      >
        {/* Rule + dateline, echoing the running head of the essay itself */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", width: 96, height: 3, background: GOLD }} />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: GOLD_ON_NAVY,
            }}
          >
            Essay
            {post?.publishedAt ? `  ·  ${formatDate(post.publishedAt)}` : ""}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 90 ? 58 : 72,
            lineHeight: 1.14,
            letterSpacing: "-0.018em",
            maxWidth: 960,
          }}
        >
          {title}
        </div>

        {/* Wordmark with the brand diamond, bottom-left as on a report cover */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path
              d="M12 1.5 22.5 12 12 22.5 1.5 12Z"
              fill="none"
              stroke={PAPER}
              strokeWidth="1.75"
            />
            <path d="M12 7.6 16.4 12 12 16.4 7.6 12Z" fill={GOLD} />
          </svg>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: "0.02em" }}>
            Proxara Policy
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Source Serif", data: serif, style: "normal", weight: 600 }],
    }
  );
}
