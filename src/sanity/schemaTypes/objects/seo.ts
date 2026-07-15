import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Shown in the browser tab and search results (max ~60 characters).",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Shown in search results and link previews (max ~160 characters).",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "ogImage",
      title: "Social sharing image",
      type: "image",
      description: "Used when the page is shared on LinkedIn or other platforms. Optional — falls back to the site default.",
    }),
  ],
});
