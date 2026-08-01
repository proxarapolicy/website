"use client";

/**
 * This configuration is used for the Sanity Studio mounted at `/studio`.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "whatWeDoPage",
  "whoWeWorkWithPage",
  "aboutPage",
  "thinkingPage",
  "contactPage",
]);

export default defineConfig({
  basePath: "/studio",
  title: "Proxara Policy",
  projectId,
  dataset,
  schema: {
    ...schema,
    // Singletons cannot be created or deleted from the "new document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
