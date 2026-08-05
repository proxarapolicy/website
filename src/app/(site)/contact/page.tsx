import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { Mark } from "@/components/site/mark";
import { PageBanner } from "@/components/site/page-banner";
import { SectionBand } from "@/components/site/section";
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

function ContactDetail({
  label,
  children,
  note,
}: {
  label: string;
  children: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <p className="eyebrow text-gold-deep">{label}</p>
      <div className="mt-2.5">{children}</div>
      {note ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
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
    <>
      <PageBanner title={page?.title ?? "Contact"} intro={page?.intro} />

      <SectionBand variant="navy-wash" className="py-16 md:py-24">
        {/* `stagger`, not a wrapping Reveal — the details rail is `lg:sticky`. */}
        <Reveal
          stagger
          className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-20"
        >
          <div
            className="border border-border border-t-2 border-t-gold bg-background px-6 py-8 md:px-10 md:py-12"
            data-reveal-item="up"
          >
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2.5">
                <Mark className="size-2.5 text-navy" />
                <span className="h-px w-12 bg-gold" aria-hidden />
              </div>
              <h2 className="font-serif text-2xl tracking-display text-navy md:text-3xl">
                {page?.formHeading ?? "Send an enquiry"}
              </h2>
            </div>

            <ContactForm
              successMessage={page?.successMessage}
              enquiryTypeLabel={page?.enquiryTypeLabel}
              enquiryTypes={page?.enquiryTypes}
              messageLabel={page?.messageLabel}
              submitLabel={page?.submitLabel}
              responseNote={page?.responseNote}
            />
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24" data-reveal-item="up">
            <div className="mb-2 flex items-center gap-2.5 lg:mb-4">
              <Mark className="size-2.5 text-navy" />
              <span className="h-px w-12 bg-gold" aria-hidden />
            </div>

            {settings?.linkedinUrl ? (
              <ContactDetail
                label="LinkedIn"
                note="Verify the profile before reaching out — we would."
              >
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-serif text-lg text-navy underline decoration-gold underline-offset-4 transition-colors hover:decoration-gold-deep"
                >
                  {settings.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </ContactDetail>
            ) : null}

            {settings?.contactEmail ? (
              <ContactDetail label="Email">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block font-serif text-lg text-navy underline decoration-gold underline-offset-4 transition-colors hover:decoration-gold-deep"
                >
                  {settings.contactEmail}
                </a>
              </ContactDetail>
            ) : null}

            {settings?.location ? (
              <ContactDetail label="Location">
                <p className="font-serif text-lg text-navy">
                  {settings.location}
                </p>
              </ContactDetail>
            ) : null}
          </aside>
        </Reveal>
      </SectionBand>
    </>
  );
}
