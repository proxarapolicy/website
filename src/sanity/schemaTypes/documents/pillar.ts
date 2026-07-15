import { defineField, defineType } from "sanity";

export const pillarType = defineType({
  name: "pillar",
  title: "Service Pillar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "oneLiner",
      title: "One-line description",
      type: "string",
      description: "Shown on the Home page pillar grid.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      rows: 5,
      description: "Shown on the What We Do page.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().positive(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "oneLiner" },
  },
});
