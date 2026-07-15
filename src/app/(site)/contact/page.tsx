import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { seoMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  CONTACT_PAGE_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity/types";

const getPage = () =>
  sanityFetch<CONTACT_PAGE_QUERY_RESULT>({
    query: CONTACT_PAGE_QUERY,
    tags: ["sanity", "contactPage"],
  });

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return seoMetadata(page?.seo ?? null, {
    title: "Contact — Proxara Policy",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPage(),
    sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
      query: SITE_SETTINGS_QUERY,
      tags: ["sanity", "siteSettings"],
    }),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-14 md:grid-cols-[1fr_20rem] md:gap-20">
        <div>
          <h1 className="font-serif text-4xl text-navy md:text-5xl">
            {page?.title ?? "Contact"}
          </h1>
          {page?.intro ? (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </p>
          ) : null}

          <div className="mt-12 max-w-xl">
            {page?.formHeading ? (
              <h2 className="mb-6 font-serif text-2xl text-navy">
                {page.formHeading}
              </h2>
            ) : null}
            <ContactForm successMessage={page?.successMessage} />
          </div>
        </div>

        <aside className="space-y-10 border-t border-border pt-10 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          {settings?.linkedinUrl ? (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                LinkedIn
              </h2>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-serif text-lg text-navy underline decoration-gold underline-offset-4"
              >
                {settings.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                Verify the profile before reaching out — we would.
              </p>
            </div>
          ) : null}

          {settings?.contactEmail ? (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </h2>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="mt-2 block font-serif text-lg text-navy underline decoration-gold underline-offset-4"
              >
                {settings.contactEmail}
              </a>
            </div>
          ) : null}

          {settings?.location ? (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Location
              </h2>
              <p className="mt-2 font-serif text-lg text-navy">
                {settings.location}
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
