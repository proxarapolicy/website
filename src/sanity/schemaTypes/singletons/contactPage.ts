import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "enquiryTypeLabel",
      title: "Enquiry type label",
      type: "string",
      initialValue: "What can we help with?",
    }),
    defineField({
      name: "enquiryTypes",
      title: "Enquiry types",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Options in the enquiry dropdown. Leave empty to hide the field entirely.",
    }),
    defineField({
      name: "messageLabel",
      title: "Message label",
      type: "string",
      initialValue: "Message",
    }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      initialValue: "Send",
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "string",
      description: "Shown after the enquiry form is submitted.",
    }),
    defineField({
      name: "responseNote",
      title: "Response-time note",
      type: "string",
      description: "E.g. “We respond to every enquiry within two business days.”",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Contact" }),
  },
});
