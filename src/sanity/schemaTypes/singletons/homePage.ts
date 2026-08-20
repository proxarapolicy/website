import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "sections", title: "Sections" },
    { name: "map", title: "Map" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "text",
      rows: 3,
      group: "hero",
      description: "The positioning statement. Must land with authority in under five seconds.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroKicker",
      title: "Hero kicker",
      type: "string",
      group: "hero",
      description: "Small line above the heading, e.g. “Technology & AI Policy Advisory”.",
    }),
    defineField({
      name: "heroSubline",
      title: "Hero sub-line",
      type: "text",
      rows: 2,
      group: "hero",
      description: "Optional line under the heading, e.g. the Nairobi-to-Brussels framing.",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      group: "hero",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "heroMotifOrigin",
      title: "Hero motif — origin",
      type: "string",
      group: "hero",
      initialValue: "Nairobi",
      description:
        "Left-hand end of the span drawn beside the heading. Keep it to a single place name — it is set small, and it should echo the sub-line rather than restate it. Defaults to “Nairobi” if left empty.",
    }),
    defineField({
      name: "heroMotifDestination",
      title: "Hero motif — destination",
      type: "string",
      group: "hero",
      initialValue: "Brussels",
      description: "Right-hand end of the span. Defaults to “Brussels” if left empty.",
    }),
    defineField({
      name: "positioningHeading",
      title: "Positioning heading",
      type: "string",
      group: "sections",
      initialValue: "Our position",
      description: "Heading above the positioning statement on the home page.",
    }),
    defineField({
      name: "positioningBody",
      title: "Positioning statement",
      type: "blockContent",
      group: "sections",
      description: "The longer statement below the fold, before the credibility strip.",
    }),
    defineField({
      name: "credibilityHeading",
      title: "Credibility strip heading",
      type: "string",
      group: "sections",
      description: "E.g. “Experience drawn from”.",
    }),
    defineField({
      name: "credibilityItems",
      title: "Credibility references",
      type: "array",
      group: "sections",
      of: [defineArrayMember({ type: "string" })],
      description: "Named organisations, e.g. TikTok, Google, Office of the President of Kenya.",
    }),
    defineField({
      name: "pillarsHeading",
      title: "Service pillars heading",
      type: "string",
      group: "sections",
      initialValue: "What we do",
    }),
    defineField({
      name: "pillarsIntro",
      title: "Service pillars intro",
      type: "text",
      rows: 2,
      group: "sections",
    }),
    defineField({
      name: "pillarsCtaLabel",
      title: "Service pillars CTA label",
      type: "string",
      group: "sections",
      initialValue: "See all services",
      description: "Links to /what-we-do.",
    }),
    defineField({
      name: "audienceHeading",
      title: "Who we work with heading",
      type: "string",
      group: "sections",
      initialValue: "Who we work with",
    }),
    defineField({
      name: "audienceBody",
      title: "Who we work with summary",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "audienceCtaLabel",
      title: "Who we work with CTA label",
      type: "string",
      group: "sections",
      initialValue: "Learn more",
      description: "Links to /who-we-work-with.",
    }),
    defineField({
      name: "mapKicker",
      title: "Map kicker",
      type: "string",
      group: "map",
      initialValue: "Geographic reach",
      description: "Small line above the map heading.",
    }),
    defineField({
      name: "mapHeading",
      title: "Map heading",
      type: "string",
      group: "map",
      initialValue: "Where we advise",
      description: "Heading for the EMEA coverage section on the home page.",
    }),
    defineField({
      name: "mapIntro",
      title: "Map intro",
      type: "text",
      rows: 3,
      group: "map",
      description:
        "One or two sentences framing EMEA as the working theatre. Shown beside the map.",
    }),
    defineField({
      name: "mapHoverHint",
      title: "Map hover hint",
      type: "string",
      group: "map",
      initialValue: "Hover to see other regions",
      description:
        "Small line under the region caption. East Africa is highlighted by default; this invites exploration of the rest.",
    }),
    defineField({
      name: "mapRegions",
      title: "Map regions",
      type: "array",
      group: "map",
      description:
        "Hover notes for each active region on the EMEA map. Region IDs must match the SVG groups — do not invent new ones. East Africa is the default highlight; other regions highlight on hover only.",
      of: [
        defineArrayMember({
          type: "object",
          name: "mapRegion",
          fields: [
            defineField({
              name: "regionId",
              title: "Region",
              type: "string",
              options: {
                list: [
                  { title: "East Africa", value: "east-africa" },
                  { title: "Southern Africa", value: "southern-africa" },
                  { title: "West Africa", value: "west-africa" },
                  { title: "Central Africa", value: "central-africa" },
                  { title: "North Africa", value: "north-africa" },
                  { title: "Gulf & Levant", value: "gulf" },
                  { title: "European Union & neighbours", value: "eu" },
                  { title: "United Kingdom & Ireland", value: "uk" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "text",
              rows: 2,
              description: "Short sentence shown on hover or focus.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "regionId" },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((regions) => {
          if (!regions?.length) return true;
          const ids = regions
            .map((r) =>
              r && typeof r === "object" && "regionId" in r
                ? (r as { regionId?: string }).regionId
                : undefined,
            )
            .filter(Boolean);
          if (new Set(ids).size !== ids.length) {
            return "Each region can only appear once.";
          }
          return true;
        }),
    }),
    defineField({
      name: "aboutHeading",
      title: "About section heading",
      type: "string",
      group: "sections",
      initialValue: "About",
      description: "Heading above the about teaser on the home page.",
    }),
    defineField({
      name: "aboutTeaserBody",
      title: "About teaser",
      type: "text",
      rows: 3,
      group: "sections",
      description: "Sits under the credibility strip.",
    }),
    defineField({
      name: "aboutCtaLabel",
      title: "About CTA label",
      type: "string",
      group: "sections",
      initialValue: "About Mwenda",
      description: "Links to /about.",
    }),
    defineField({
      name: "testimonials",
      title: "Social proof",
      type: "array",
      group: "sections",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
      description: "One or two testimonials or pull quotes.",
    }),
    defineField({
      name: "thinkingHeading",
      title: "Latest thinking heading",
      type: "string",
      group: "sections",
      initialValue: "Latest thinking",
      description: "The three most recent articles are pulled in automatically.",
    }),
    defineField({
      name: "thinkingIntro",
      title: "Latest thinking intro",
      type: "text",
      rows: 2,
      group: "sections",
    }),
    defineField({
      name: "thinkingCtaLabel",
      title: "Latest thinking CTA label",
      type: "string",
      group: "sections",
      initialValue: "Read our latest thinking",
      description: "Links to /thinking.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Home" }),
  },
});
