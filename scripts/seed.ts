/**
 * Seeds the dataset with the approved website copy
 * (Proxara-Website-Copy-Combined.pdf, signed off by the client).
 *
 * Idempotent: every document is written with a fixed _id via createOrReplace,
 * and retired documents are removed via the RETIRED_IDS list below.
 *
 * Run with:  npx sanity exec scripts/seed.ts --with-user-token
 *
 * If the logged-in CLI account is not a member of the target project, create an
 * Editor token at manage.sanity.io → API → Tokens, put it in .env.local as
 * SANITY_API_WRITE_TOKEN, and run the same command — the token takes over.
 */
import { getCliClient } from "sanity/cli";

const token = process.env.SANITY_API_WRITE_TOKEN;

const client = getCliClient().withConfig({
  apiVersion: "2026-07-15",
  ...(token ? { token } : {}),
});

let keyCounter = 0;
const key = () => `seed${(keyCounter++).toString().padStart(4, "0")}`;

type Para = string | { h2: string };

/** Build Portable Text blocks from plain paragraphs and h2 headings. */
const blocks = (...paragraphs: Para[]) =>
  paragraphs.map((para) => {
    const heading = typeof para === "object";
    return {
      _type: "block",
      _key: key(),
      style: heading ? "h2" : "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: key(),
          text: heading ? para.h2 : para,
          marks: [],
        },
      ],
    };
  });

/**
 * Documents from the placeholder seed that the approved copy retires.
 * Deleting a missing id is a no-op, so re-running stays safe.
 */
const RETIRED_IDS = [
  "audience-ngos",
  "testimonial-placeholder",
  "post-placeholder-1",
  "post-placeholder-2",
  "external-placeholder-1",
  "external-placeholder-2",
  "external-placeholder-3",
  "tag-africa",
  "tag-emea-regulation",
  "tag-multilateral-affairs",
];

/** Themes named in the copy draft as the eventual filter set for /thinking. */
const tags = [
  { id: "tag-ai-governance", title: "AI Governance", slug: "ai-governance" },
  { id: "tag-platform-policy", title: "Platform Policy", slug: "platform-policy" },
  {
    id: "tag-government-and-technology",
    title: "Government and Technology",
    slug: "government-and-technology",
  },
  { id: "tag-digital-economy", title: "Digital Economy", slug: "digital-economy" },
];

const pillars = [
  {
    id: "pillar-ai-tech-policy",
    title: "AI and Tech Policy Advisory",
    slug: "ai-tech-policy-advisory",
    oneLiner:
      "Helping institutions understand what emerging technology regulation means for them, and what to do about it.",
    description:
      "Governments and companies alike are being asked to make decisions about AI faster than most institutions are built to handle. We help clients understand what a given piece of regulation, whether the EU AI Act, an AU framework, or a national AI strategy, actually requires of them, and translate that into a practical plan. This includes regulatory mapping, policy drafting, and advising leadership teams on where the real risks and opportunities sit.",
    order: 1,
  },
  {
    id: "pillar-government-relations",
    title: "Government Relations and Lobbying",
    slug: "government-relations-lobbying",
    oneLiner:
      "Representing technology companies before legislatures and regulators, and helping governments engage productively with industry.",
    description:
      "We represent technology companies before legislatures, regulators, and government ministries, and we help governments engage productively with an industry that is often difficult to reach. Having sat on both sides of this relationship, at TikTok and inside government advisory work, we know what each side actually needs from the conversation, and how to get past the posturing that usually slows it down.",
    order: 2,
  },
  {
    id: "pillar-multilateral-engagement",
    title: "Multilateral and IGO Engagement",
    slug: "multilateral-igo-engagement",
    oneLiner:
      "Supporting the UN, AU, World Bank, and similar bodies as they develop technology governance frameworks that work across borders.",
    description:
      "Cross-border technology governance is being written right now, by the UN, the AU, the World Bank, and a growing list of regional bodies. We help these institutions develop frameworks that are technically sound and politically workable, and we help governments and companies engage with that process rather than simply react to its outcomes.",
    order: 3,
  },
  {
    id: "pillar-capacity-building",
    title: "Government and Public Sector Capacity Building",
    slug: "public-sector-capacity-building",
    oneLiner:
      "Training programmes that give officials the literacy to make confident decisions on AI and technology policy.",
    description:
      "Many of the officials being asked to regulate AI have never had a structured opportunity to understand it. We design and deliver training programmes built for decision-making literacy rather than technical depth, giving senior officials the confidence to ask the right questions and make sound calls. Each programme concludes with a practical readiness assessment that the institution can act on immediately.",
    order: 4,
  },
  {
    id: "pillar-platform-content-policy",
    title: "Platform and Content Policy",
    slug: "platform-content-policy",
    oneLiner:
      "Drafting content and platform policies that reflect local markets and languages, not just headquarters assumptions.",
    description:
      "Content policy written for a headquarters audience rarely survives contact with a local market. We help platforms draft and adapt content and community policies that reflect the languages, cultures, and legal environments they actually operate in, and we help governments understand how those policies get made so they can engage with platforms more effectively.",
    order: 5,
  },
];

const audiences = [
  {
    id: "audience-governments",
    name: "Governments and Regulators",
    body: "We advise ministries, regulators, and legislative bodies on how to approach AI and technology policy without either overreacting or falling behind. This includes drafting frameworks, briefing officials ahead of major decisions, and building the internal capacity to engage with industry from a position of understanding rather than catch-up.",
    order: 1,
  },
  {
    id: "audience-corporations",
    name: "Technology Companies",
    body: "We help platforms and technology companies engage with governments and regulators in markets where the rules are still being written. This spans direct government relations work, content and platform policy adapted to local context, and guidance on how to enter or expand in a market without triggering the regulatory friction that usually comes with getting there too fast.",
    order: 2,
  },
  {
    id: "audience-igos",
    name: "Multilateral and International Organisations",
    body: "We support the UN, AU, World Bank, and comparable institutions as they design technology governance frameworks meant to work across very different legal and political systems. This work draws on the same experience that informs our government advisory, applied at the scale these institutions operate at.",
    order: 3,
  },
];

const POSITIONING =
  "Helping governments, technology companies, and multilateral institutions navigate the politics of emerging technology.";

async function run() {
  const tx = client.transaction();

  for (const id of RETIRED_IDS) {
    tx.delete(id);
  }

  for (const t of tags) {
    tx.createOrReplace({
      _id: t.id,
      _type: "tag",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
    });
  }

  for (const p of pillars) {
    tx.createOrReplace({
      _id: p.id,
      _type: "pillar",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      oneLiner: p.oneLiner,
      description: p.description,
      order: p.order,
    });
  }

  for (const a of audiences) {
    tx.createOrReplace({
      _id: a.id,
      _type: "audience",
      name: a.name,
      body: a.body,
      order: a.order,
    });
  }

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmark: "Proxara Policy",
    contactEmail: "mwenda@proxarapolicy.com",
    linkedinUrl: "https://linkedin.com/in/mwendak",
    location: "Nairobi, Kenya — with UK presence",
    navItems: [
      { _key: key(), label: "What We Do", href: "/what-we-do" },
      { _key: key(), label: "Who We Work With", href: "/who-we-work-with" },
      { _key: key(), label: "About", href: "/about" },
      { _key: key(), label: "Thinking", href: "/thinking" },
      { _key: key(), label: "Contact", href: "/contact" },
    ],
    ctaLabel: "Get in touch",
    footerCta:
      "Whether you are a government exploring an AI strategy, a company navigating a new market, or an institution building a governance framework, we would like to hear from you.",
    footerLegal: "Proxara Policy Limited — Nairobi, Kenya, with UK presence.",
    cookieBannerMessage:
      "We use analytics cookies to understand how the site is used. You can accept or reject.",
    cookieAcceptLabel: "Accept all",
    cookieRejectLabel: "Reject",
    defaultSeo: {
      _type: "seo",
      metaTitle: "Proxara Policy — Technology & AI Policy Advisory",
      metaDescription: POSITIONING,
    },
  });

  tx.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroHeading: POSITIONING,
    heroSubline:
      "From Nairobi to Brussels, we bridge the gap between how technology is built and how it is governed.",
    heroCtaLabel: "Get in touch",
    positioningHeading: "Our position",
    positioningBody: blocks(
      "Technology regulation is no longer a niche concern for governments or a compliance afterthought for companies. It sits at the centre of trade policy, national security, elections, and economic growth. Proxara Policy was founded to help the institutions shaping this landscape, governments, platforms, and the multilateral bodies that sit between them, make sense of it and act on it with confidence.",
      "We work across five areas, drawing on direct experience inside two of the world’s largest technology platforms and close engagement with government policymaking in Kenya and beyond."
    ),
    credibilityHeading: "Experience drawn from",
    credibilityItems: [
      "TikTok",
      "Google",
      "Office of the President of Kenya",
      "University of Nairobi",
    ],
    aboutHeading: "About",
    aboutTeaserBody:
      "Proxara Policy is led by Mwenda Kilemi, who has held senior policy roles at TikTok and Google, advised Kenya’s Office of the President, and lectured at the University of Nairobi. That combination of platform-side, government-side, and academic experience is rare, and it is the foundation the firm is built on.",
    aboutCtaLabel: "About Mwenda",
    pillarsHeading: "What we do",
    pillarsCtaLabel: "See all services",
    audienceHeading: "Who we work with",
    audienceBody:
      "We work with governments and regulators building technology policy, technology companies engaging with public institutions, and multilateral organisations developing cross-border frameworks. Our clients span Africa, Europe, and beyond.",
    audienceCtaLabel: "Learn more",
    mapKicker: "Geographic reach",
    mapHeading: "Where we advise",
    mapIntro:
      "Our work sits across Europe, the Middle East, and Africa — one theatre of policy, not three separate markets.",
    mapHoverHint: "Hover to see other regions",
    mapRegions: [
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "east-africa",
        label: "East Africa",
        note: "Government advisory and platform engagement from Nairobi across the region.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "southern-africa",
        label: "Southern Africa",
        note: "Regulatory mapping and capacity building with public institutions and operators.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "west-africa",
        label: "West Africa",
        note: "Policy briefings and market-entry counsel for governments and technology companies.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "central-africa",
        label: "Central Africa",
        note: "Advisory support where regional frameworks and national digital agendas meet.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "north-africa",
        label: "North Africa",
        note: "Cross-border digital policy bridging Mediterranean and African frameworks.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "gulf",
        label: "Gulf & Levant",
        note: "AI governance and platform policy for institutions shaping regional standards.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "eu",
        label: "European Union & neighbours",
        note: "Brussels-facing counsel on AI Act, platform rules, and multilateral engagement.",
      },
      {
        _key: key(),
        _type: "mapRegion",
        regionId: "uk",
        label: "United Kingdom & Ireland",
        note: "UK presence supporting European and African mandates with London-facing work.",
      },
    ],
    thinkingHeading: "Latest thinking",
    thinkingIntro:
      "Mwenda writes regularly on AI governance, platform policy, and the digital economy for outlets including Rest of World, Daily Nation, and Tech Policy Press.",
    thinkingCtaLabel: "Read our latest thinking",
    seo: {
      _type: "seo",
      metaTitle: "Proxara Policy — Technology & AI Policy Advisory",
      metaDescription: POSITIONING,
    },
  });

  tx.createOrReplace({
    _id: "whatWeDoPage",
    _type: "whatWeDoPage",
    title: "What We Do",
    intro:
      "Technology policy sits at the intersection of law, politics, and product. Getting it right requires understanding all three. Proxara Policy offers five interconnected services, each drawing on direct experience inside major technology platforms and close engagement with government policymaking.",
    viewpointHeading: "Our view on government and technology",
    viewpointBody: blocks(
      "Much of the conversation around government and technology focuses on restriction: what to regulate, what to ban, what to slow down. We believe there is just as much opportunity in the other direction, in helping governments harness technology more productively to serve citizens, run institutions more effectively, and participate in the digital economy on stronger terms. Proxara Policy also helps governments navigate their own bureaucracy, translating good intentions into decisions that actually move through the system, which is often the harder part. This perspective, shaped by time on both sides of the table, underpins each of the services below."
    ),
    closingBody:
      "Every engagement starts with a conversation about what you are actually trying to solve. Get in touch to talk through where you are.",
    closingCtaLabel: "Get in touch",
    seo: {
      _type: "seo",
      metaTitle: "What We Do — Proxara Policy",
      metaDescription:
        "Five interconnected services: AI and tech policy advisory, government relations, multilateral engagement, public sector capacity building, and platform and content policy.",
    },
  });

  tx.createOrReplace({
    _id: "whoWeWorkWithPage",
    _type: "whoWeWorkWithPage",
    title: "Who We Work With",
    intro:
      "Proxara Policy works with three kinds of institutions: governments and regulators shaping technology policy, companies engaging with those governments, and multilateral organisations building the frameworks that connect them. What unites our clients is not just geography, but the fact that they are making decisions about technology that will outlast any single product cycle or election.",
    stagesHeading: "Working with companies at different stages",
    stagesBody:
      "Our platform-side experience spans both a mature technology company and one still in high-growth mode, building out its policy function for the first time. That range means we understand what a governance team at an established company needs from an advisor, and what a fast-scaling company navigating regulatory attention for the first time needs instead, which are rarely the same thing. Whichever stage your organisation is at, we bring judgment shaped by having worked inside both kinds of environment.",
    closingBody:
      "Every client relationship starts with a scoped first deliverable, whether that is a diagnostic memo, a gap analysis, or a briefing note, so you can see how we work before committing to more.",
    closingCtaLabel: "Get in touch",
    seo: {
      _type: "seo",
      metaTitle: "Who We Work With — Proxara Policy",
      metaDescription:
        "Governments and regulators, technology companies, and multilateral organisations across Africa, Europe, and beyond.",
    },
  });

  tx.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About",
    intro:
      "Proxara Policy was founded on the simple observation that the people best placed to advise on technology policy are rarely the ones sitting only inside government, or only inside a platform. The most useful perspective sits at the point where both sides have to actually work together, and in this region, very few advisors have genuinely occupied both.",
    name: "Mwenda Kilemi",
    role: "Founder & Principal, Proxara Policy",
    story: blocks(
      "Mwenda Kilemi founded Proxara Policy after leaving TikTok, where he served as Head of EMEA Product Policy, working across more than fifty markets on content policy, platform safety, and government engagement. Before that, he was Senior Policy Advisor for Responsible AI and Language Policy at Google in Dublin, and he has advised Kenya’s Office of the President on technology matters. He lectures at the University of Nairobi and is a founding board member of Village Trust, an NGO in Meru County supporting women, youth, and people with disabilities. That grassroots work keeps him grounded in how technology and policy decisions actually land on the person using the product or waiting on the service, not just on the institutions writing the rules.",
      "That combination of platform-side experience at two of the world’s largest technology companies and direct engagement with government policymaking is genuinely rare in this region, where most advisors have built a career on one side of the table or the other, not both.",
      { h2: "A view shaped by living across continents" },
      "Mwenda’s career has taken him from Nairobi to Dublin to New York and beyond, holding degrees from Columbia University and Purdue University in the United States, working across TikTok’s EMEA markets, and advising government in Kenya. That path has given him a practical feel for how culture shapes both the personal and professional side of getting things done, whether that is how a relationship is built before a deal is discussed, how hierarchy and consensus operate differently across a government ministry and a technology company, or how the same policy question lands differently in Nairobi, Brussels, or Washington. Advising well across borders requires understanding this interplay, not just the regulatory text.",
      "That range, from a mature platform to a fast-growing one, from government corridors to boardrooms, is also what shapes how Proxara Policy sees the wider relationship between government and technology: less a story of restriction, and more one of opportunities to build stronger, more productive systems together. More on that on the What We Do and Who We Work With pages.",
      { h2: "How we work" },
      "Every engagement is led personally, with judgment built from having actually made these decisions from inside a platform and inside government, not just studied them from outside. We work with governments, technology companies, and multilateral institutions across Africa, Europe, and beyond, and we bring the same rigour to a Nairobi county briefing as we would to a multilateral working group in Geneva."
    ),
    closingBody:
      "If you are navigating a technology policy question that needs someone who has actually sat where you are sitting, get in touch.",
    closingCtaLabel: "Get in touch",
    seo: {
      _type: "seo",
      metaTitle: "About Mwenda Kilemi — Proxara Policy",
      metaDescription:
        "Founded by Mwenda Kilemi, former Head of EMEA Product Policy at TikTok and Senior Policy Advisor at Google, and adviser to Kenya’s Office of the President.",
    },
  });

  tx.createOrReplace({
    _id: "thinkingPage",
    _type: "thinkingPage",
    title: "Thinking",
    intro:
      "Technology policy moves fast, and most of the writing about it comes from people who have only ever seen one side of the table. This is where we share our perspective, drawn from time inside major platforms, inside government advisory work, and inside the rooms where these decisions actually get made.",
    emptyState: "Pieces will appear here as they are published.",
    closingBody:
      "Have a question about something you read here, or a topic you would like our take on? Get in touch.",
    closingCtaLabel: "Get in touch",
    seo: {
      _type: "seo",
      metaTitle: "Thinking — Proxara Policy",
      metaDescription:
        "Writing on AI governance, platform policy, and the digital economy, from someone who has worked on both sides of the regulatory table.",
    },
  });

  tx.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    title: "Contact",
    intro:
      "Whether you are a government exploring an AI strategy, a company navigating a new market, or an institution building a governance framework, we would like to hear from you.",
    enquiryTypeLabel: "What can we help with?",
    enquiryTypes: [
      "Government and Public Policy",
      "Corporate Advisory",
      "Multilateral Engagement",
      "Capacity Building",
      "Other",
    ],
    messageLabel: "Message",
    submitLabel: "Send",
    successMessage:
      "Thank you. Your enquiry has been received — we’ll be in touch shortly.",
    responseNote: "We respond to every enquiry within two business days.",
    seo: {
      _type: "seo",
      metaTitle: "Contact — Proxara Policy",
      metaDescription:
        "Get in touch with Proxara Policy about technology and AI policy advisory, government relations, or capacity building.",
    },
  });

  await tx.commit();
  console.log(
    `Seeded ${tags.length} tags, ${pillars.length} pillars, ${audiences.length} audiences, ` +
      `and 7 singletons. Removed ${RETIRED_IDS.length} retired placeholder documents.`
  );
  console.log(
    "The /thinking feed is intentionally empty — add essays or published articles in the Studio as they go live."
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
