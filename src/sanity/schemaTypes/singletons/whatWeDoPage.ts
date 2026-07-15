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
      name: "howWeWorkHeading",
      title: "“How we work” heading",
      type: "string",
      initialValue: "How we work",
    }),
    defineField({
      name: "howWeWorkBody",
      title: "“How we work” body",
      type: "blockContent",
      description: "Engagement model: retainer, project-based, and advisory mandates.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "What We Do" }),
  },
});
