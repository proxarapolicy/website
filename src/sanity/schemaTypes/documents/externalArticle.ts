import { defineArrayMember, defineField, defineType } from "sanity";

export const externalArticleType = defineType({
  name: "externalArticle",
  title: "Published Article",
  type: "document",
  description: "Pieces published elsewhere — Rest of World, Daily Nation, Tech Policy Press, Chatham House.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publication",
      title: "Publication",
      type: "string",
      description: "E.g. Rest of World, Daily Nation, Tech Policy Press.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tags",
      title: "Topics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publication" },
  },
});
