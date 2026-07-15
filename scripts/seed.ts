/**
 * Seeds the dataset with placeholder content taken from the client brief.
 * All copy is placeholder and will be replaced by the client in the Studio.
 *
 * Run with:  npx sanity exec scripts/seed.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient().withConfig({ apiVersion: "2026-07-15" });

let keyCounter = 0;
const key = () => `seed${(keyCounter++).toString().padStart(4, "0")}`;

/** Build Portable Text blocks from plain paragraphs. */
const blocks = (...paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

const tagRef = (id: string) => ({ _type: "reference", _key: key(), _ref: id });

const tags = [
  { id: "tag-ai-governance", title: "AI Governance", slug: "ai-governance" },
  { id: "tag-platform-policy", title: "Platform Policy", slug: "platform-policy" },
  { id: "tag-africa", title: "Africa", slug: "africa" },
  { id: "tag-emea-regulation", title: "EMEA Regulation", slug: "emea-regulation" },
  { id: "tag-digital-economy", title: "Digital Economy", slug: "digital-economy" },
  { id: "tag-multilateral-affairs", title: "Multilateral Affairs", slug: "multilateral-affairs" },
];

const pillars = [
  {
    id: "pillar-ai-tech-policy",
    title: "AI & Tech Policy Advisory",
    slug: "ai-tech-policy-advisory",
    oneLiner:
      "AI governance frameworks, regulatory interpretation, and compliance readiness across EMEA.",
    description:
      "Helping governments and corporations build AI governance frameworks, interpret emerging regulation, and prepare for compliance across EMEA.",
    order: 1,
  },
  {
    id: "pillar-government-relations",
    title: "Government Relations & Lobbying",
    slug: "government-relations-lobbying",
    oneLiner:
      "Navigating regulators, lobbying legislatures, and building coalitions across 50+ markets.",
    description:
      "Helping private companies navigate regulators, lobby legislatures, and build strategic coalitions across 50+ EMEA markets.",
    order: 2,
  },
  {
    id: "pillar-multilateral-engagement",
    title: "Multilateral & IGO Engagement",
    slug: "multilateral-igo-engagement",
    oneLiner:
      "Engagement with the UN, AU, World Bank, and other multilateral bodies on tech policy.",
    description:
      "Helping organisations engage with the UN, AU, World Bank, and other multilateral bodies on tech policy and digital economy issues.",
    order: 3,
  },
  {
    id: "pillar-capacity-building",
    title: "Government & Public Sector Capacity Building",
    slug: "public-sector-capacity-building",
    oneLiner:
      "Training ministries and public institutions to understand and regulate emerging technologies.",
    description:
      "Training and equipping government officials, ministries, and public institutions to understand and regulate emerging technologies.",
    order: 4,
  },
  {
    id: "pillar-platform-content-policy",
    title: "Platform & Content Policy",
    slug: "platform-content-policy",
    oneLiner:
      "Content policies grounded in local market realities; trust and safety for emerging markets.",
    description:
      "Drafting content policies that reflect local market realities. Trust and safety frameworks for emerging markets. Platform strategy for public sector clients.",
    order: 5,
  },
];

const audiences = [
  {
    id: "audience-governments",
    name: "Governments & Ministries",
    challenge:
      "Drafting technology regulation without deep industry knowledge — and negotiating with platforms that know more about the market than the regulator does.",
    offer:
      "Insider perspective from both sides of the regulatory table: someone who has built policy inside the world’s largest platforms and advised the governments that regulate them.",
    order: 1,
  },
  {
    id: "audience-corporations",
    name: "Corporations & Big Tech",
    challenge:
      "Navigating 50+ EMEA markets with inconsistent, fast-moving regulatory environments.",
    offer:
      "A single senior advisor who has done it from the inside — leading policy frameworks across those exact markets.",
    order: 2,
  },
  {
    id: "audience-igos",
    name: "IGOs & Multilaterals",
    challenge:
      "AI governance frameworks that ignore the Global South and struggle to bridge technical and political dimensions.",
    offer:
      "Someone who has briefed the UN and AU and understands both the technology and the politics — with particular depth in emerging markets.",
    order: 3,
  },
  {
    id: "audience-ngos",
    name: "NGOs & Civil Society",
    challenge:
      "Being excluded from Big Tech policy decisions that directly affect their communities.",
    offer:
      "Help engaging meaningfully with platforms and regulators — from someone who built those coalitions from the platform side.",
    order: 4,
  },
];

async function run() {
  const tx = client.transaction();

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
      challenge: a.challenge,
      offer: a.offer,
      order: a.order,
    });
  }

  tx.createOrReplace({
    _id: "testimonial-placeholder",
    _type: "testimonial",
    quote:
      "The rare advisor who has sat on both sides of the regulatory table — inside the world’s largest platforms, and beside the governments that regulate them.",
    attribution: "Placeholder pull quote — replace with a client testimonial or published op-ed line",
    source: "Placeholder",
  });

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmark: "Proxara Policy",
    positioningStatement:
      "Proxara Policy helps governments, corporations, and multilateral institutions navigate the politics of emerging technology — across EMEA and beyond.",
    contactEmail: "mwendak@gmail.com",
    linkedinUrl: "https://linkedin.com/in/mwendak",
    location: "Nairobi, Kenya — with UK presence",
    navItems: [
      { _key: key(), label: "What We Do", href: "/what-we-do" },
      { _key: key(), label: "Who We Work With", href: "/who-we-work-with" },
      { _key: key(), label: "About", href: "/about" },
      { _key: key(), label: "Thinking", href: "/thinking" },
      { _key: key(), label: "Contact", href: "/contact" },
    ],
    ctaLabel: "Let’s Talk",
    footerCta: "Working on something complex? Let’s talk.",
    footerLegal: "Proxara Policy Limited — Nairobi, Kenya, with UK presence.",
    defaultSeo: {
      _type: "seo",
      metaTitle: "Proxara Policy — Technology & AI Policy Advisory across EMEA",
      metaDescription:
        "Proxara Policy helps governments, corporations, and multilateral institutions navigate the politics of emerging technology — across EMEA and beyond.",
    },
  });

  tx.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroKicker: "Technology & AI Policy Advisory",
    heroHeading:
      "We help governments, corporations, and multilateral institutions navigate the politics of emerging technology — across EMEA and beyond.",
    heroCtaLabel: "Let’s Talk",
    credibilityHeading: "Experience drawn from",
    credibilityItems: ["TikTok", "Google", "Office of the President of Kenya"],
    pillarsHeading: "What we do",
    pillarsIntro:
      "Five practice areas at the intersection of emerging technology, regulation, and governance.",
    testimonials: [
      { _type: "reference", _key: key(), _ref: "testimonial-placeholder" },
    ],
    thinkingHeading: "Latest thinking",
    seo: {
      _type: "seo",
      metaTitle: "Proxara Policy — Technology & AI Policy Advisory across EMEA",
      metaDescription:
        "Senior advisory on AI governance, platform policy, and technology regulation for governments, Big Tech, IGOs, and civil society across EMEA.",
    },
  });

  tx.createOrReplace({
    _id: "whatWeDoPage",
    _type: "whatWeDoPage",
    title: "What We Do",
    intro:
      "Five practice areas, one throughline: helping institutions on every side of the table make better decisions about emerging technology.",
    howWeWorkHeading: "How we work",
    howWeWorkBody: blocks(
      "Engagements take three forms: ongoing retainers for organisations that need a senior policy capability on call; defined projects with clear deliverables — a governance framework, a market-entry strategy, a regulatory readiness assessment; and advisory mandates, where Proxara acts as a standing counsel to leadership through a defined period of regulatory change.",
      "Every engagement is led personally by the founder. No leverage model, no junior teams — the person in the room is the person who has done the work."
    ),
    seo: {
      _type: "seo",
      metaTitle: "What We Do — Proxara Policy",
      metaDescription:
        "AI & tech policy advisory, government relations, multilateral engagement, public sector capacity building, and platform & content policy across EMEA.",
    },
  });

  tx.createOrReplace({
    _id: "whoWeWorkWithPage",
    _type: "whoWeWorkWithPage",
    title: "Who We Work With",
    intro:
      "Proxara works with institutions on every side of the technology policy table — and is often the only advisor in the room who has sat on more than one side of it.",
    seo: {
      _type: "seo",
      metaTitle: "Who We Work With — Proxara Policy",
      metaDescription:
        "Governments, corporations, IGOs, and civil society organisations navigating technology regulation and AI governance across EMEA.",
    },
  });

  tx.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About",
    name: "Mwenda Kilemi",
    role: "Founder & Principal, Proxara Policy",
    story: blocks(
      "Placeholder story copy — to be replaced with the client’s final narrative. Mwenda Kilemi’s career began in Nairobi and has run through Columbia University, Google’s Responsible AI work in Dublin, and TikTok’s EMEA policy leadership in London — before returning, deliberately, to build from Nairobi.",
      "He is the rare policy executive who has sat on both sides of the regulatory table: inside the world’s largest platforms, drafting the policies that govern how billions of people speak and trade online; and beside governments, helping them understand and regulate the technologies reshaping their societies.",
      "At Google, he developed foundational AI and language policy safety frameworks and briefed the UN and AU on ethical deployment in emerging markets. At TikTok, he led product policy across more than fifty EMEA markets. Before that, he shaped national policy communication in the Office of the President of Kenya and taught digital policy and ethics at the University of Nairobi for a decade.",
      "Proxara Policy exists because the gap he kept seeing never closed: institutions making decisions about technology without anyone in the room who understood both the technology and the politics. He built the firm to be that person."
    ),
    highlightsHeading: "Career highlights",
    highlights: [
      "Led policy frameworks across 50+ EMEA markets at TikTok, representing the company to governments and multilateral institutions on AI governance and platform transparency.",
      "Developed foundational Responsible AI and NLP safety policies at Google, briefing the UN and AU on ethical deployment in emerging markets.",
      "Built central message architecture and national policy communication in the Office of the President of Kenya.",
      "Ten years teaching digital policy, ethics, and journalism at the University of Nairobi.",
    ],
    civicHeading: "Beyond the day job",
    civicBody:
      "Mwenda is a founding board member of Village Trust, an NGO in Meru County, Kenya — a commitment to equitable technology that predates, and outlasts, any job title.",
    seo: {
      _type: "seo",
      metaTitle: "About Mwenda Kilemi — Proxara Policy",
      metaDescription:
        "Mwenda Kilemi has led technology policy inside TikTok and Google and advised the governments that regulate them. Proxara Policy is the bridge between.",
    },
  });

  tx.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    title: "Contact",
    intro:
      "Working on something complex? Tell us briefly what you need. We respond to every serious enquiry.",
    formHeading: "Start a conversation",
    successMessage: "Thank you. Your enquiry has been received — we’ll be in touch shortly.",
    seo: {
      _type: "seo",
      metaTitle: "Contact — Proxara Policy",
      metaDescription:
        "Get in touch with Proxara Policy. Nairobi, Kenya — with UK presence.",
    },
  });

  // External articles (placeholders in the style of the brief)
  const externals = [
    {
      id: "external-placeholder-1",
      title: "Placeholder: Why AI governance keeps ignoring the Global South",
      publication: "Rest of World",
      publishedAt: "2026-05-14",
      url: "https://restofworld.org/",
      tags: ["tag-ai-governance", "tag-africa"],
    },
    {
      id: "external-placeholder-2",
      title: "Placeholder: What the EU gets wrong about platform regulation in Africa",
      publication: "Tech Policy Press",
      publishedAt: "2026-03-02",
      url: "https://techpolicy.press/",
      tags: ["tag-platform-policy", "tag-emea-regulation"],
    },
    {
      id: "external-placeholder-3",
      title: "Placeholder: Kenya’s digital economy needs rules written in Nairobi",
      publication: "Daily Nation",
      publishedAt: "2026-01-20",
      url: "https://nation.africa/",
      tags: ["tag-digital-economy", "tag-africa"],
    },
  ];
  for (const e of externals) {
    tx.createOrReplace({
      _id: e.id,
      _type: "externalArticle",
      title: e.title,
      publication: e.publication,
      publishedAt: e.publishedAt,
      url: e.url,
      tags: e.tags.map(tagRef),
    });
  }

  // Native essays (placeholders)
  tx.createOrReplace({
    _id: "post-placeholder-1",
    _type: "post",
    title: "Placeholder essay: The regulator’s dilemma — governing technology you cannot see inside",
    slug: { _type: "slug", current: "the-regulators-dilemma" },
    excerpt:
      "Placeholder standfirst. Governments are being asked to regulate systems whose inner workings are trade secrets. There is a better way to close the information gap than subpoenas.",
    publishedAt: "2026-06-10T09:00:00Z",
    tags: [tagRef("tag-ai-governance"), tagRef("tag-emea-regulation")],
    body: blocks(
      "Placeholder body copy — the client will supply the final essay. This essay should run 1,200–2,000 words.",
      "Every technology regulator faces the same structural problem: the institutions they regulate know more than they do. The information asymmetry is not a bug of the current moment; it is the defining condition of technology governance, and most regulatory frameworks pretend it does not exist.",
      "Having drafted platform policy from the inside and advised ministries from the outside, I have watched the same failure repeat in market after market: rules written for the technology of three years ago, enforced by institutions staffed for the problems of ten years ago.",
      "The answer is not more aggressive enforcement of outdated rules. It is building regulatory institutions that can learn at something closer to the speed of the systems they govern — and that starts with how governments hire, structure, and inform their policy teams."
    ),
    seo: {
      _type: "seo",
      metaTitle: "The regulator’s dilemma — Proxara Policy",
      metaDescription:
        "Governments are being asked to regulate systems whose inner workings are trade secrets. There is a better way to close the information gap.",
    },
  });

  tx.createOrReplace({
    _id: "post-placeholder-2",
    _type: "post",
    title: "Placeholder essay: AI rules written in Brussels, applied in Nairobi",
    slug: { _type: "slug", current: "ai-rules-brussels-nairobi" },
    excerpt:
      "Placeholder standfirst. The Brussels effect is real — but exporting European AI regulation wholesale to emerging markets produces compliance theatre, not governance.",
    publishedAt: "2026-04-22T09:00:00Z",
    tags: [tagRef("tag-ai-governance"), tagRef("tag-africa"), tagRef("tag-multilateral-affairs")],
    body: blocks(
      "Placeholder body copy — the client will supply the final essay. This essay should run 1,200–2,000 words.",
      "When the EU writes technology rules, the world inherits them — usually without the enforcement capacity, the institutional context, or the market structure that made those rules coherent in Europe.",
      "For ministries across Sub-Saharan Africa and MENA, the practical question is not whether to align with European frameworks but how to adapt them: which provisions translate, which need local reinvention, and which should be rejected outright.",
      "This is where multilateral institutions could matter most — and where, so far, they have mattered least."
    ),
    seo: {
      _type: "seo",
      metaTitle: "AI rules written in Brussels, applied in Nairobi — Proxara Policy",
      metaDescription:
        "Exporting European AI regulation wholesale to emerging markets produces compliance theatre, not governance.",
    },
  });

  await tx.commit();
  console.log("✔ Seed complete: tags, pillars, audiences, testimonial, all pages, 3 external articles, 2 essays.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
