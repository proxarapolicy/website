import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial / Pull Quote",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Who said it — name and role, or publication for a pull quote.",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Optional context, e.g. the op-ed or engagement it came from.",
    }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
  },
});
