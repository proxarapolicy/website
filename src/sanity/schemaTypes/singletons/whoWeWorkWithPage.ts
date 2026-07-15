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
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Who We Work With" }),
  },
});
