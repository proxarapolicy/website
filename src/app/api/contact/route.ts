import { NextResponse } from "next/server";

import { sanityFetch } from "@/sanity/lib/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  CONTACT_PAGE_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: string;
  organisation?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
  website?: string; // honeypot
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → almost certainly a bot. Pretend success.
  if (body.website) {
    return NextResponse.json({ ok: true });
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
      from: "Proxara Policy Website <onboarding@resend.dev>",
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
