import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PortableText } from "@/components/portable-text";
import { InsetPanel, PanelHead } from "@/components/site/inset-panel";
import { Mark } from "@/components/site/mark";
import { EditorialGrid, SectionBand } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { seoMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/client";
import {
  HOME_PAGE_QUERY,
  LATEST_THINKING_QUERY,
  PILLARS_QUERY,
} from "@/sanity/lib/queries";
import type {
  HOME_PAGE_QUERY_RESULT,
  LATEST_THINKING_QUERY_RESULT,
  PILLARS_QUERY_RESULT,
} from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

async function getData() {
  const [page, pillars, latest] = await Promise.all([
    sanityFetch<HOME_PAGE_QUERY_RESULT>({
      query: HOME_PAGE_QUERY,
      tags: ["sanity", "homePage"],
    }),
    sanityFetch<PILLARS_QUERY_RESULT>({
      query: PILLARS_QUERY,
      tags: ["sanity", "pillar"],
    }),
    sanityFetch<LATEST_THINKING_QUERY_RESULT>({
      query: LATEST_THINKING_QUERY,
      tags: ["sanity", "post", "externalArticle"],
    }),
  ]);
  return { page, pillars, latest };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<HOME_PAGE_QUERY_RESULT>({
    query: HOME_PAGE_QUERY,
    tags: ["sanity", "homePage"],
  });
  return seoMetadata(page?.seo ?? null, {
    title: "Proxara Policy — Technology & AI Policy Advisory",
    path: "/",
  });
}

const HERO_LINKS = [
  { href: "/what-we-do", label: "What We Do" },
  { href: "/who-we-work-with", label: "Who We Work With" },
  { href: "/thinking", label: "Thinking" },
] as const;

export default async function HomePage() {
  const { page, pillars, latest } = await getData();
  const hasTestimonials = Boolean(page?.testimonials?.length);
  const credibilityItems = page?.credibilityItems ?? [];

  return (
    <>
      {/* Hero — two-column institutional masthead; brand left, substance right */}
      <SectionBand variant="navy" className="py-20 md:py-28 lg:py-32">
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-7 flex items-center gap-3">
              <Mark className="size-3.5 text-primary-foreground" />
              {page?.heroKicker ? (
                <p className="eyebrow text-gold-on-navy">{page.heroKicker}</p>
              ) : (
                <p className="eyebrow text-gold-on-navy">Proxara Policy</p>
              )}
            </div>

            <h1 className="font-serif text-display leading-[1.08] tracking-display text-primary-foreground">
              {page?.heroHeading}
            </h1>

            <span className="mt-8 block h-0.5 w-16 bg-gold" aria-hidden />

            {page?.heroSubline ? (
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-on-navy-muted">
                {page.heroSubline}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button
                size="lg"
                className="bg-gold-cta text-navy-deep hover:bg-gold-cta/90"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                {page?.heroCtaLabel ?? "Get in touch"}
                <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/about"
                className="text-sm font-medium text-gold-on-navy underline decoration-gold/40 underline-offset-[0.18em] transition-colors hover:decoration-gold"
              >
                {page?.aboutCtaLabel ?? "About Mwenda"}
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-on-navy-line border-t-2 border-t-gold bg-navy-deep/40 p-6 md:p-8">
              {credibilityItems.length ? (
                <>
                  {page?.credibilityHeading ? (
                    <p className="eyebrow text-gold-on-navy">
                      {page.credibilityHeading}
                    </p>
                  ) : null}
                  <ul className="mt-5 space-y-4">
                    {credibilityItems.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 border-b border-on-navy-line pb-4 last:border-b-0 last:pb-0"
                      >
                        <Mark className="mt-1 size-2.5 shrink-0 text-primary-foreground" />
                        <span className="font-serif text-base leading-snug text-primary-foreground md:text-lg">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="flex justify-center py-8">
                  <Mark className="size-16 text-on-navy-line" />
                </div>
              )}

              <nav
                aria-label="Explore"
                className="mt-8 border-t border-on-navy-line pt-6"
              >
                <p className="eyebrow text-on-navy-faint">Explore</p>
                <ul className="mt-4 space-y-3">
                  {HERO_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-on-navy-muted transition-colors hover:text-primary-foreground"
                      >
                        <span className="h-px w-4 bg-gold transition-all group-hover:w-6" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </SectionBand>

      {/* Positioning — navy-wash so it does not blend into the white pillars band */}
      {page?.positioningBody?.length ? (
        <SectionBand variant="navy-wash" className="py-20 md:py-24">
          <InsetPanel className="mx-auto max-w-3xl bg-background md:max-w-4xl">
            <PanelHead title={page.positioningHeading ?? "Our position"} />
            <div className="mt-6 text-lg">
              <PortableText
                value={page.positioningBody as unknown as PortableTextBlock[]}
              />
            </div>
          </InsetPanel>
        </SectionBand>
      ) : null}

      {/* Service pillars — white band after navy-wash positioning */}
      <SectionBand variant="default" className="py-20 md:py-28">
        <EditorialGrid className="mb-12">
          <div className="md:col-span-5">
            <Mark className="mb-5 size-3 text-navy" />
            <h2 className="font-serif text-h2 text-navy">
              {page?.pillarsHeading ?? "What we do"}
            </h2>
          </div>
          {page?.pillarsIntro ? (
            <div className="md:col-span-6 md:col-start-7 md:self-end">
              <p className="text-muted-foreground">{page.pillarsIntro}</p>
            </div>
          ) : null}
        </EditorialGrid>

        <ol className={pillars.length ? "border-t-2 border-navy" : undefined}>
          {pillars.map((pillar, i) => (
            <li key={pillar._id} className="rule-hairline first:border-t-0">
              <Link
                href="/what-we-do"
                className="group grid items-baseline gap-x-10 gap-y-2 py-7 md:grid-cols-12"
              >
                <span className="figures-tabular text-sm text-muted-foreground md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold md:col-span-5">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-6">
                  {pillar.oneLiner}
                </p>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <SectionLink href="/what-we-do">
            {page?.pillarsCtaLabel ?? "See all services"}
          </SectionLink>
        </div>
      </SectionBand>

      {/* Who we work with */}
      {page?.audienceBody ? (
        <SectionBand variant="navy-wash" className="py-20 md:py-24">
          <InsetPanel className="mx-auto max-w-3xl bg-background">
            <PanelHead title={page.audienceHeading ?? "Who we work with"} />
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">
              {page.audienceBody}
            </p>
            <div className="mt-8">
              <SectionLink href="/who-we-work-with">
                {page.audienceCtaLabel ?? "Learn more"}
              </SectionLink>
            </div>
          </InsetPanel>
        </SectionBand>
      ) : null}

      {/* About teaser */}
      {page?.aboutTeaserBody ? (
        <SectionBand variant="default" className="py-20 md:py-24">
          <InsetPanel className="mx-auto max-w-3xl surface-navy-wash">
            <PanelHead title={page.aboutHeading ?? "About"} />
            <p className="mt-6 text-lg leading-relaxed text-foreground/90 md:text-xl">
              {page.aboutTeaserBody}
            </p>
            <div className="mt-8">
              <SectionLink href="/about">
                {page.aboutCtaLabel ?? "About Mwenda"}
              </SectionLink>
            </div>
          </InsetPanel>
        </SectionBand>
      ) : null}

      {/* Social proof */}
      {page?.testimonials?.length ? (
        <SectionBand variant="gold-wash" className="py-20 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {page.testimonials.map((t) => (
              <figure key={t._id}>
                <Mark className="mx-auto mb-6 size-3 text-navy" />
                <blockquote className="font-serif text-2xl leading-snug text-navy md:text-3xl">
                  “{t.quote}”
                </blockquote>
                {t.attribution ? (
                  <figcaption className="mt-6 text-sm text-muted-foreground">
                    — {t.attribution}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </SectionBand>
      ) : null}

      {/* Latest thinking */}
      <SectionBand
        variant={hasTestimonials ? "navy-wash" : "gold-wash"}
        className="py-20 md:py-28"
      >
        <EditorialGrid className="mb-10">
          <div className="md:col-span-5">
            <Mark className="mb-5 size-3 text-navy" />
            <h2 className="font-serif text-h2 text-navy">
              {page?.thinkingHeading ?? "Latest thinking"}
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end">
            {page?.thinkingIntro ? (
              <p className="leading-relaxed text-muted-foreground">
                {page.thinkingIntro}
              </p>
            ) : null}
            <div className="mt-8">
              <SectionLink href="/thinking">
                {page?.thinkingCtaLabel ?? "Read our latest thinking"}
              </SectionLink>
            </div>
          </div>
        </EditorialGrid>
        <ul className={latest.length ? "border-t-2 border-navy" : undefined}>
          {latest.map((item) => {
            const isPost = item._type === "post";
            const href = isPost ? `/thinking/${item.slug}` : (item.url ?? "#");
            return (
              <li key={item._id} className="rule-hairline first:border-t-0">
                <Link
                  href={href}
                  target={isPost ? undefined : "_blank"}
                  rel={isPost ? undefined : "noopener noreferrer"}
                  className="group flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <span className="font-serif text-xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold md:max-w-3xl">
                    {item.title}
                  </span>
                  <span className="figures-tabular shrink-0 text-sm text-muted-foreground">
                    {isPost ? "Essay" : item.publication} ·{" "}
                    {formatDate(item.publishedAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </SectionBand>
    </>
  );
}

/** Gold text link used to bridge the home page into each section page. */
function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-medium text-gold-deep transition-colors hover:text-navy"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
