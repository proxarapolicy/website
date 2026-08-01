import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
  api: { projectId, dataset },
  // The hosted Studio at https://proxarapolicy.sanity.studio — pinning the id
  // stops `sanity deploy` prompting for it.
  deployment: { appId: "bcgfh2wt1reya48o7chfzmg3" },
});
