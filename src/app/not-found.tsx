import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Page not found — Proxara Policy",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  // The 404 page must render even if the CMS is unreachable.
  let settings: SITE_SETTINGS_QUERY_RESULT = null;
  try {
    settings = await sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      tags: ["sanity", "siteSettings"],
    });
  } catch {
    // fall through — render without CMS-driven chrome
  }

  return (
    <>
      {settings ? <SiteHeader settings={settings} /> : null}
      <main className="flex flex-1 items-center">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold-deep">
            404
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-navy md:text-5xl">
            This page doesn’t exist.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The page you’re looking for may have moved or never existed. The
            links below will get you back on track.
          </p>
          <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/"
              className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
            >
              Home
            </Link>
            <Link
              href="/thinking"
              className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
            >
              Thinking
            </Link>
            <Link
              href="/what-we-do"
              className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
            >
              What We Do
            </Link>
            <Link
              href="/contact"
              className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
            >
              Contact
            </Link>
          </nav>
        </div>
      </main>
      {settings ? <SiteFooter settings={settings} /> : null}
    </>
  );
}
