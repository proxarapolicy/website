import { defineField, defineType } from "sanity";

export const audienceType = defineType({
  name: "audience",
  title: "Audience",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "E.g. “Governments”, “Corporations & Big Tech”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Their challenge",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "offer",
      title: "Proxara’s offer",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
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
    select: { title: "name", subtitle: "challenge" },
  },
});
