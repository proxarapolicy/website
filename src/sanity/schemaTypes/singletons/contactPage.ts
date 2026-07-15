import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "formHeading",
      title: "Form heading",
      type: "string",
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "string",
      description: "Shown after the enquiry form is submitted.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Contact" }),
  },
});
