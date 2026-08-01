import type { StructureResolver } from "sanity/structure";

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: string,
  title: string
) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, "homePage", "Home"),
              singleton(S, "whatWeDoPage", "What We Do"),
              singleton(S, "whoWeWorkWithPage", "Who We Work With"),
              singleton(S, "aboutPage", "About"),
              singleton(S, "thinkingPage", "Thinking"),
              singleton(S, "contactPage", "Contact"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Thinking")
        .child(
          S.list()
            .title("Thinking")
            .items([
              S.documentTypeListItem("post").title("Essays (published here)"),
              S.documentTypeListItem("externalArticle").title("Published Articles (external)"),
              S.documentTypeListItem("tag").title("Topics"),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("pillar").title("Service Pillars"),
      S.documentTypeListItem("audience").title("Audiences"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      singleton(S, "siteSettings", "Site Settings"),
    ]);
