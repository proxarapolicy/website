import { NextResponse } from "next/server";

import { sanityFetch } from "@/sanity/lib/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  CONTACT_PAGE_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Global for counting; `.test()` on a /g regex is stateful, so keep them apart. */
const URL_COUNT_RE = /https?:\/\/|www\./gi;
const URL_TEST_RE = /https?:\/\/|www\./i;

/** A human needs a few seconds to fill the form; scripted posts do not. */
const MIN_FILL_MS = 3_000;
/** Guards against a stale tab replaying an ancient token. */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;
/** Per-IP budget. Module scope, so it lives as long as the warm instance. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const recentByIp = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs
  );
  hits.push(now);
  recentByIp.set(ip, hits);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (recentByIp.size > 5_000) {
    for (const [key, times] of recentByIp) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) {
        recentByIp.delete(key);
      }
    }
  }
  return hits.length > RATE_LIMIT.max;
}

type Payload = {
  name?: string;
  organisation?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
  website?: string; // honeypot
  startedAt?: number; // set by the browser when the form mounts
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bot signals below all return a plausible success, so a scripted client
  // learns nothing about which check caught it and does not retry differently.
  const botOk = () => NextResponse.json({ ok: true, delivered: false });

  // 1. Honeypot — a field no human ever sees, let alone fills.
  if (body.website) return botOk();

  // 2. Time trap — submitted implausibly fast, or from a very stale page.
  const elapsed = body.startedAt ? Date.now() - Number(body.startedAt) : null;
  if (elapsed === null || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return botOk();
  }

  // 3. Rate limit per IP. x-forwarded-for is set by Vercel's proxy; the first
  //    entry is the client. Unknown IPs share one bucket, which is acceptable
  //    here — the form is low-traffic by design.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again later." },
      { status: 429 }
    );
  }

  const name = body.name?.trim();
  const organisation = body.organisation?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const enquiryType = body.enquiryType?.trim();

  if (!name || !organisation || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email) || name.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  // 4. Link spam. A genuine first enquiry rarely carries more than one link;
  //    SEO and crypto spam is mostly links.
  if ((message.match(URL_COUNT_RE) ?? []).length > 2) return botOk();
  // Nobody legitimately puts a URL in their name or organisation.
  if (URL_TEST_RE.test(name) || URL_TEST_RE.test(organisation)) return botOk();

  const [settings, contactPage] = await Promise.all([
    sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      tags: ["sanity", "siteSettings"],
    }),
    sanityFetch<CONTACT_PAGE_QUERY_RESULT>({
      query: CONTACT_PAGE_QUERY,
      tags: ["sanity", "contactPage"],
    }),
  ]);

  // Only accept an enquiry type the Studio actually offers.
  const allowedTypes = contactPage?.enquiryTypes ?? [];
  if (allowedTypes.length && (!enquiryType || !allowedTypes.includes(enquiryType))) {
    return NextResponse.json(
      { error: "Please choose what we can help with." },
      { status: 400 }
    );
  }

  const to = settings?.contactEmail;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    // No email service configured — log so the enquiry is visible in server logs
    // and still return success (the site must work before Resend is set up).
    console.warn("[contact] RESEND_API_KEY not configured. Enquiry:", {
      name,
      organisation,
      email,
      enquiryType,
      message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Must be an address on a domain verified in Resend. The resend.dev
      // fallback only delivers to the Resend account owner's own address, so
      // real enquiries need RESEND_FROM set in the hosting environment.
      from:
        process.env.RESEND_FROM ??
        "Proxara Policy Website <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: enquiryType
        ? `New enquiry from ${name} (${organisation}) — ${enquiryType}`
        : `New enquiry from ${name} (${organisation})`,
      text: [
        `Name: ${name}`,
        `Organisation: ${organisation}`,
        `Email: ${email}`,
        ...(enquiryType ? [`Enquiry type: ${enquiryType}`] : []),
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error:", res.status, await res.text());
    return NextResponse.json(
      { error: "Could not send your enquiry. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
