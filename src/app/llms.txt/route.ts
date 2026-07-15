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
    "> Proxara Policy Limited is a senior technology and AI policy consultancy based in Nairobi, Kenya, with a UK presence. Founded by Mwenda Kilemi, it helps governments, corporations, and multilateral institutions navigate the politics of emerging technology — AI governance, platform policy, and technology regulation — across EMEA and beyond.",
    "",
    "Key facts:",
    "",
    "- Founder: Mwenda Kilemi — former Head of EMEA Product Policy at TikTok, former Senior Policy Advisor (Responsible AI) at Google, former Content Development Head in the Office of the President of Kenya.",
    "- Markets: EMEA, with particular depth in Sub-Saharan Africa, MENA, and Turkey.",
    "- Services: AI & tech policy advisory, government relations & lobbying, multilateral & IGO engagement, public sector capacity building, platform & content policy.",
    "- Clients: governments and ministries, corporations and Big Tech, IGOs and multilaterals (UN, AU, World Bank), NGOs and civil society.",
    "",
    "## Pages",
    "",
    `- [Home](${siteUrl}/): positioning and overview of the practice`,
    `- [What We Do](${siteUrl}/what-we-do): the five service pillars and engagement model`,
    `- [Who We Work With](${siteUrl}/who-we-work-with): client types, their challenges, and Proxara's offer`,
    `- [About](${siteUrl}/about): founder biography and career highlights`,
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
