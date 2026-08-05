import { defineField, defineType } from "sanity";

export const whoWeWorkWithPageType = defineType({
  name: "whoWeWorkWithPage",
  title: "Who We Work With",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Who We Work With",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "stagesHeading",
      title: "Company stages heading",
      type: "string",
      initialValue: "Working with companies at different stages",
    }),
    defineField({
      name: "stagesBody",
      title: "Company stages body",
      type: "text",
      rows: 5,
      description: "Renders as a full-width band after the audience grid.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      type: "reference",
      to: [{ type: "testimonial" }],
      description:
        "Breaks the reading rhythm before the closing CTA. Leave empty to hide the band.",
    }),
    defineField({
      name: "closingBody",
      title: "Closing note",
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
    prepare: () => ({ title: "Who We Work With" }),
  },
});
