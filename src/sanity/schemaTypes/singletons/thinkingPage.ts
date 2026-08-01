import { defineField, defineType } from "sanity";

export const thinkingPageType = defineType({
  name: "thinkingPage",
  title: "Thinking",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Thinking",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "string",
      description:
        "Shown when no pieces are published, or when a topic filter returns nothing.",
      initialValue: "No pieces under this topic yet.",
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
    prepare: () => ({ title: "Thinking" }),
  },
});
