import { defineQuery } from "next-sanity";

const SEO_FIELDS = /* groq */ `
  seo { metaTitle, metaDescription, ogImage }
`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    wordmark,
    contactEmail,
    linkedinUrl,
    location,
    navItems[]{ label, href },
    ctaLabel,
    footerCta,
    footerLegal,
    ga4MeasurementId,
    cookieBannerMessage,
    cookieAcceptLabel,
    cookieRejectLabel,
    defaultSeo { metaTitle, metaDescription, ogImage }
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    heroKicker,
    heroHeading,
    heroSubline,
    heroCtaLabel,
    heroMotifOrigin,
    heroMotifDestination,
    positioningHeading,
    positioningBody,
    credibilityHeading,
    credibilityItems,
    aboutHeading,
    aboutTeaserBody,
    aboutCtaLabel,
    pillarsHeading,
    pillarsIntro,
    pillarsCtaLabel,
    audienceHeading,
    audienceBody,
    audienceCtaLabel,
    mapKicker,
    mapHeading,
    mapIntro,
    mapHoverHint,
    mapRegions[]{ regionId, label, note },
    thinkingHeading,
    thinkingIntro,
    thinkingCtaLabel,
    "testimonials": testimonials[]->{ _id, quote, attribution, source },
    ${SEO_FIELDS}
  }
`);

export const PILLARS_QUERY = defineQuery(`
  *[_type == "pillar"] | order(order asc){
    _id, title, "slug": slug.current, oneLiner, description, order
  }
`);

export const AUDIENCES_QUERY = defineQuery(`
  *[_type == "audience"] | order(order asc){
    _id, name, body, challenge, offer, order
  }
`);

export const WHAT_WE_DO_QUERY = defineQuery(`
  *[_type == "whatWeDoPage"][0]{
    title, intro,
    viewpointHeading, viewpointBody,
    howWeWorkHeading, howWeWorkBody,
    "pullQuote": pullQuote->{ _id, quote, attribution, source },
    closingBody, closingCtaLabel,
    ${SEO_FIELDS}
  }
`);

export const WHO_WE_WORK_WITH_QUERY = defineQuery(`
  *[_type == "whoWeWorkWithPage"][0]{
    title, intro,
    stagesHeading, stagesBody,
    "pullQuote": pullQuote->{ _id, quote, attribution, source },
    closingBody, closingCtaLabel,
    ${SEO_FIELDS}
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0]{
    title, intro, name, role,
    headshot{ ..., "alt": alt },
    story,
    highlightsHeading, highlights,
    civicHeading, civicBody,
    closingBody, closingCtaLabel,
    ${SEO_FIELDS}
  }
`);

export const THINKING_PAGE_QUERY = defineQuery(`
  *[_type == "thinkingPage"][0]{
    title, intro, emptyState, closingBody, closingCtaLabel, ${SEO_FIELDS}
  }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0]{
    title, intro, formHeading,
    enquiryTypeLabel, enquiryTypes,
    messageLabel, submitLabel,
    successMessage, responseNote,
    ${SEO_FIELDS}
  }
`);

/** Mixed feed for /thinking: native essays and external articles, newest first. */
export const THINKING_FEED_QUERY = defineQuery(`
  *[
    (_type == "post" || _type == "externalArticle") &&
    ($tag == "" || $tag in tags[]->slug.current)
  ] | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publication,
    url,
    publishedAt,
    "tags": tags[]->{ title, "slug": slug.current }
  }
`);

export const LATEST_THINKING_QUERY = defineQuery(`
  *[_type == "post" || _type == "externalArticle"]
    | order(coalesce(publishedAt, _createdAt) desc)[0...3]{
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publication,
    url,
    publishedAt
  }
`);

export const TAGS_QUERY = defineQuery(`
  *[_type == "tag"] | order(title asc){ _id, title, "slug": slug.current }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    body,
    "tags": tags[]->{ title, "slug": slug.current },
    ${SEO_FIELDS}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);
