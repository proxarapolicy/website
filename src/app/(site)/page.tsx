import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CountUpFigure } from "@/components/motion/count-up-figure";
import { CredibilityMarquee } from "@/components/motion/credibility-marquee";
import { PageEnter, Reveal } from "@/components/motion/reveal";
import { PortableText } from "@/components/portable-text";
import { BridgeMotif } from "@/components/site/bridge-motif";
import { InsetPanel, PanelHead } from "@/components/site/inset-panel";
import { Mark } from "@/components/site/mark";
import { PullQuote } from "@/components/site/pull-quote";
import { EditorialGrid, SectionBand } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { THINKING_ENABLED } from "@/lib/feature-flags";
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
    THINKING_ENABLED
      ? sanityFetch<LATEST_THINKING_QUERY_RESULT>({
          query: LATEST_THINKING_QUERY,
          tags: ["sanity", "post", "externalArticle"],
        })
      : Promise.resolve([] as LATEST_THINKING_QUERY_RESULT),
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

export default async function HomePage() {
  const { page, pillars, latest } = await getData();
  const testimonials = page?.testimonials ?? [];
  const credibilityItems = page?.credibilityItems ?? [];
  // Never let the thinking band repeat the surface of the quote above it.
  const thinkingVariant =
    testimonials.length % 2 === 1 ? "navy-wash" : "gold-wash";

  return (
    <>
      {/* Credibility rail — the roster that used to sit in the hero's right
          rail, moved directly under the masthead. As a card it competed with
          the headline; as a rail it reads the way a letterhead lists chambers,
          and the whole width is available so the names need no truncation.
          navy-wash keeps it distinct from both the white header above and the
          navy hero below. */}
      {credibilityItems.length ? (
        <section className="surface-navy-wash px-5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 py-5 md:flex-row md:items-center md:gap-8">
            {page?.credibilityHeading ? (
              <h2 className="eyebrow shrink-0 text-gold-deep">
                {page.credibilityHeading}
              </h2>
            ) : null}
            <CredibilityMarquee items={credibilityItems} className="flex-1" />
          </div>
        </section>
      ) : null}

      {/* Hero — single-column institutional masthead. The credibility card that
          used to sit in the right rail was removed: it duplicated the header
          nav and split attention away from the one statement that matters. */}
      <SectionBand
        variant="navy"
        className="overflow-hidden py-20 md:py-28 lg:py-32"
      >
        <div className="grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          <PageEnter className="max-w-4xl lg:col-span-7">
            <div className="mb-7 flex items-center gap-3" data-reveal-item="up">
              <Mark className="size-3.5 text-primary-foreground" />
              {page?.heroKicker ? (
                <p className="eyebrow text-gold-on-navy">{page.heroKicker}</p>
              ) : (
                <p className="eyebrow text-gold-on-navy">Proxara Policy</p>
              )}
            </div>

            <h1
              className="font-serif text-display leading-[1.08] tracking-display text-primary-foreground"
              data-reveal-item="up"
            >
              {page?.heroHeading}
            </h1>

            <span
              className="mt-8 block h-0.5 w-16 bg-gold"
              aria-hidden
              data-reveal-item="rule"
            />

            {page?.heroSubline ? (
              <p
                className="mt-8 max-w-2xl text-lg leading-relaxed text-on-navy-muted"
                data-reveal-item="up"
              >
                {page.heroSubline}
              </p>
            ) : null}

            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
              data-reveal-item="up"
            >
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
          </PageEnter>

          {/* Visual anchor — compact under the CTAs on small screens, right
              rail from lg. Own timeline (not PageEnter): the span needs a
              longer draw than the entrance step allows. `replay` re-runs when
              the reader scrolls back to the top — the one site-wide re-fire,
              and only because this is drawn ornament rather than copy. */}
          <Reveal
            stagger
            replay
            className="mx-auto w-full max-w-[14rem] sm:max-w-xs lg:col-span-5 lg:col-start-8 lg:mx-0 lg:ml-auto lg:max-w-md"
          >
            <BridgeMotif
              origin={page?.heroMotifOrigin ?? "Nairobi"}
              destination={page?.heroMotifDestination ?? "Brussels"}
              className="w-full"
            />
          </Reveal>
        </div>
      </SectionBand>

      {/* Positioning — navy-wash so it does not blend into the white pillars band */}
      {page?.positioningBody?.length ? (
        <SectionBand variant="navy-wash" className="py-20 md:py-24">
          <Reveal>
            <InsetPanel className="mx-auto max-w-3xl bg-background md:max-w-4xl">
              <PanelHead title={page.positioningHeading ?? "Our position"} />
              <div className="mt-6 text-lg">
                <PortableText
                  value={page.positioningBody as unknown as PortableTextBlock[]}
                />
              </div>
            </InsetPanel>
          </Reveal>
        </SectionBand>
      ) : null}

      {/* Service pillars — white band after navy-wash positioning */}
      <SectionBand variant="default" className="py-20 md:py-28">
        <Reveal stagger>
          <EditorialGrid className="mb-12">
            <div className="md:col-span-5">
              <Mark className="mb-5 size-3 text-navy" data-reveal-item="up" />
              <h2
                className="font-serif text-h2 text-navy"
                data-reveal-item="up"
              >
                {page?.pillarsHeading ?? "What we do"}
              </h2>
              <span
                className="mt-5 block h-0.5 w-14 bg-gold"
                aria-hidden
                data-reveal-item="rule"
              />
            </div>
            {page?.pillarsIntro ? (
              <div
                className="md:col-span-6 md:col-start-7 md:self-end"
                data-reveal-item="up"
              >
                <p className="text-muted-foreground">{page.pillarsIntro}</p>
              </div>
            ) : null}
          </EditorialGrid>
        </Reveal>

        <Reveal stagger>
          <ol className={pillars.length ? "border-t-2 border-navy" : undefined}>
            {pillars.map((pillar, i) => (
              <li
                key={pillar._id}
                className="rule-hairline first:border-t-0"
                data-reveal-item="up"
              >
                <Link
                  href="/what-we-do"
                  data-pillar-row
                  className="group relative grid gap-x-10 gap-y-3 py-10 md:grid-cols-12 md:items-baseline md:py-12"
                >
                  {/* Gold rule laid over the hairline on hover — the cue that
                      separates this from the nav and footer lists. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                  <CountUpFigure
                    value={i + 1}
                    className="figures-oldstyle font-serif text-2xl leading-none text-muted-foreground transition-colors group-hover:text-gold-deep md:col-span-2 md:text-3xl"
                  />
                  <h3 className="font-serif text-xl leading-snug text-navy underline-offset-4 group-hover:underline group-hover:decoration-gold md:col-span-4">
                    {pillar.title}
                  </h3>
                  <div className="md:col-span-6">
                    <p className="leading-relaxed text-muted-foreground">
                      {pillar.oneLiner}
                    </p>
                    {pillar.description ? (
                      <div data-pillar-detail className="grid">
                        <div className="overflow-hidden">
                          {/* Clamped: this is a glance, not the section page.
                              The full description is on /what-we-do, which is
                              where the row links. */}
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-12">
          <SectionLink href="/what-we-do">
            {page?.pillarsCtaLabel ?? "See all services"}
          </SectionLink>
        </Reveal>
      </SectionBand>

      {/* Who we work with */}
      {page?.audienceBody ? (
        <SectionBand variant="navy-wash" className="py-20 md:py-24">
          <Reveal>
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
          </Reveal>
        </SectionBand>
      ) : null}

      {/* About teaser */}
      {page?.aboutTeaserBody ? (
        <SectionBand variant="default" className="py-20 md:py-24">
          <Reveal>
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
          </Reveal>
        </SectionBand>
      ) : null}

      {/* Social proof — one treatment, shared with the section pages. Surfaces
          alternate so two quotes never run as one undifferentiated band. */}
      {testimonials.map((t, i) => (
        <PullQuote
          key={t._id}
          quote={t.quote}
          attribution={t.attribution}
          source={t.source}
          variant={i % 2 === 0 ? "gold-wash" : "navy-wash"}
          className="py-20 md:py-24"
        />
      ))}

      {/* Latest thinking — hidden while THINKING_ENABLED is false */}
      {THINKING_ENABLED ? (
      <SectionBand variant={thinkingVariant} className="py-20 md:py-28">
        <Reveal stagger>
          <EditorialGrid className="mb-10">
            <div className="md:col-span-5">
              <Mark className="mb-5 size-3 text-navy" data-reveal-item="up" />
              <h2
                className="font-serif text-h2 text-navy"
                data-reveal-item="up"
              >
                {page?.thinkingHeading ?? "Latest thinking"}
              </h2>
              <span
                className="mt-5 block h-0.5 w-14 bg-gold"
                aria-hidden
                data-reveal-item="rule"
              />
            </div>
            <div
              className="md:col-span-6 md:col-start-7 md:self-end"
              data-reveal-item="up"
            >
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
        </Reveal>
        <Reveal stagger>
        <ul className={latest.length ? "border-t-2 border-navy" : undefined}>
          {latest.map((item) => {
            const isPost = item._type === "post";
            const href = isPost ? `/thinking/${item.slug}` : (item.url ?? "#");
            return (
              <li
                key={item._id}
                className="rule-hairline first:border-t-0"
                data-reveal-item="up"
              >
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
        </Reveal>
      </SectionBand>
      ) : null}
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
      <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
    </Link>
  );
}
