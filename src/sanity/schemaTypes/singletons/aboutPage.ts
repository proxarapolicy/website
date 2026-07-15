import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "About",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Founder name",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Founder role line",
      type: "string",
      description: "E.g. “Founder & Principal, Proxara Policy”.",
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      description: "The only photograph on the site. Must be prominent.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "story",
      title: "The story",
      type: "blockContent",
      description: "Narrative biography written as a story, not a CV.",
    }),
    defineField({
      name: "highlightsHeading",
      title: "Career highlights heading",
      type: "string",
      initialValue: "Career highlights",
    }),
    defineField({
      name: "highlights",
      title: "Career highlights",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 2 })],
      description: "Three or four specific achievements, not job titles.",
    }),
    defineField({
      name: "civicHeading",
      title: "Civic work heading",
      type: "string",
      initialValue: "Beyond the day job",
    }),
    defineField({
      name: "civicBody",
      title: "Civic work",
      type: "text",
      rows: 4,
      description: "Village Trust founding board membership.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "About" }),
  },
});
