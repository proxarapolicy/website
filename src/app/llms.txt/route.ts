import { siteUrl } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import { LATEST_THINKING_QUERY } from "@/sanity/lib/queries";
import type { LATEST_THINKING_QUERY_RESULT } from "@/sanity/types";

/**
 * llms.txt — a machine-readable site guide for AI agents and LLM crawlers.
 * Convention: https://llmstxt.org
 */
export async function GET() {
  let latest: LATEST_THINKING_QUERY_RESULT = [];
  try {
    latest = await sanityFetch<LATEST_THINKING_QUERY_RESULT>({
      query: LATEST_THINKING_QUERY,
      tags: ["sanity", "post", "externalArticle"],
    });
  } catch {
    // CMS unreachable — serve the static guide without the latest-writing list
  }

  const latestSection = latest.length
    ? [
        "",
        "## Latest writing",
        "",
        ...latest.map((item) => {
          const url =
            item._type === "post"
              ? `${siteUrl}/thinking/${item.slug}`
              : item.url;
          const source =
            item._type === "post" ? "essay" : item.publication ?? "external";
          return `- [${item.title}](${url}): ${source}`;
        }),
      ]
    : [];

  const body = [
    "# Proxara Policy",
    "",
    "> Proxara Policy Limited is a senior technology and AI policy consultancy based in Nairobi, Kenya, with a UK presence. Founded by Mwenda Kilemi, it helps governments, technology companies, and multilateral institutions navigate the politics of emerging technology — AI governance, platform policy, and technology regulation — across Africa, Europe, and beyond.",
    "",
    "Key facts:",
    "",
    "- Founder: Mwenda Kilemi — former Head of EMEA Product Policy at TikTok, former Senior Policy Advisor for Responsible AI and Language Policy at Google in Dublin, adviser to Kenya's Office of the President, lecturer at the University of Nairobi.",
    "- Reach: from Nairobi to Brussels — Africa, Europe, and beyond.",
    "- Services: AI and tech policy advisory, government relations and lobbying, multilateral and IGO engagement, government and public sector capacity building, platform and content policy.",
    "- Clients: governments and regulators, technology companies, and multilateral and international organisations (UN, AU, World Bank).",
    "",
    "## Pages",
    "",
    `- [Home](${siteUrl}/): positioning and overview of the practice`,
    `- [What We Do](${siteUrl}/what-we-do): the five service pillars and the firm's view on government and technology`,
    `- [Who We Work With](${siteUrl}/who-we-work-with): the three client types and how Proxara works with each`,
    `- [About](${siteUrl}/about): founder biography and how engagements are run`,
    `- [Thinking](${siteUrl}/thinking): essays and published articles — the best source for Proxara's positions on AI governance and platform policy`,
    `- [Contact](${siteUrl}/contact): enquiry form, LinkedIn, and location`,
    "",
    "## Machine-readable resources",
    "",
    `- [Sitemap](${siteUrl}/sitemap.xml): all indexable URLs, including every essay`,
    ...latestSection,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
