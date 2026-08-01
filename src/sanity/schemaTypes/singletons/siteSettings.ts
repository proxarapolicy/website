import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "wordmark",
      title: "Wordmark",
      type: "string",
      description: "The site logo text, e.g. “Proxara Policy”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description: "Enquiry form notifications are sent here.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "location",
      title: "Location line",
      type: "string",
      description: "E.g. “Nairobi, Kenya — with UK presence”.",
    }),
    defineField({
      name: "navItems",
      title: "Navigation",
      type: "array",
      of: [
        defineArrayMember({
          name: "navItem",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "href",
              type: "string",
              description: "Internal path, e.g. /what-we-do",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "Primary CTA label",
      type: "string",
      description: "E.g. “Let’s Talk”.",
    }),
    defineField({
      name: "footerCta",
      title: "Footer CTA prompt",
      type: "string",
      description: "E.g. “Working on something complex? Let’s talk.”",
    }),
    defineField({
      name: "footerLegal",
      title: "Footer legal line",
      type: "string",
      description: "E.g. “Proxara Policy Limited. Registered in Nairobi, Kenya.”",
    }),
    defineField({
      name: "ga4MeasurementId",
      title: "Google Analytics 4 Measurement ID",
      type: "string",
      description: "E.g. G-XXXXXXXXXX. Leave empty to disable analytics.",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      description: "Fallback metadata for pages without their own SEO settings.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
