import type { SchemaTypeDefinition } from "sanity";

import { seoType } from "./objects/seo";
import { blockContentType } from "./objects/blockContent";
import { siteSettingsType } from "./singletons/siteSettings";
import { homePageType } from "./singletons/homePage";
import { whatWeDoPageType } from "./singletons/whatWeDoPage";
import { whoWeWorkWithPageType } from "./singletons/whoWeWorkWithPage";
import { aboutPageType } from "./singletons/aboutPage";
import { thinkingPageType } from "./singletons/thinkingPage";
import { contactPageType } from "./singletons/contactPage";
import { pillarType } from "./documents/pillar";
import { audienceType } from "./documents/audience";
import { testimonialType } from "./documents/testimonial";
import { tagType } from "./documents/tag";
import { postType } from "./documents/post";
import { externalArticleType } from "./documents/externalArticle";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // objects
    seoType,
    blockContentType,
    // singletons
    siteSettingsType,
    homePageType,
    whatWeDoPageType,
    whoWeWorkWithPageType,
    aboutPageType,
    thinkingPageType,
    contactPageType,
    // collections
    pillarType,
    audienceType,
    testimonialType,
    tagType,
    postType,
    externalArticleType,
  ],
};
