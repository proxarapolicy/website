import { defineField, defineType } from "sanity";

export const whatWeDoPageType = defineType({
  name: "whatWeDoPage",
  title: "What We Do",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "What We Do",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "viewpointHeading",
      title: "Viewpoint heading",
      type: "string",
      initialValue: "Our view on government and technology",
      description: "Frames the five pillars — renders between the intro and the pillar list.",
    }),
    defineField({
      name: "viewpointBody",
      title: "Viewpoint body",
      type: "blockContent",
    }),
    defineField({
      name: "howWeWorkHeading",
      title: "“How we work” heading",
      type: "string",
      initialValue: "How we work",
    }),
    defineField({
      name: "howWeWorkBody",
      title: "“How we work” body",
      type: "blockContent",
      description: "Engagement model: retainer, project-based, and advisory mandates. Leave empty to hide the section.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      type: "reference",
      to: [{ type: "testimonial" }],
      description:
        "Breaks the reading rhythm between the pillar list and “How we work”. Leave empty to hide the band.",
    }),
    defineField({
      name: "closingBody",
      title: "Closing CTA body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "closingCtaLabel",
      title: "Closing CTA label",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "What We Do" }),
  },
});
