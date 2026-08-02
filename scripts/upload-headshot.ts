/**
 * Uploads the founder headshot and attaches it to the About page.
 *
 * The About page reads `aboutPage.headshot` from Sanity, so the image lives in
 * the CMS (client-replaceable, served through Sanity's image CDN) rather than
 * being hardcoded in /public.
 *
 * Run with:  npx sanity exec scripts/upload-headshot.ts --with-user-token
 */
import { createReadStream, existsSync } from "node:fs";
import { basename } from "node:path";

import { getCliClient } from "sanity/cli";

const token = process.env.SANITY_API_WRITE_TOKEN;
const client = getCliClient().withConfig({
  apiVersion: "2026-07-15",
  ...(token ? { token } : {}),
});

const SOURCE = process.argv[2] ?? "public/Mwenda.JPG";
const ALT =
  "Mwenda Kilemi, Founder and Principal of Proxara Policy, in a light knit jumper against a grey backdrop";

async function run() {
  if (!existsSync(SOURCE)) {
    throw new Error(`Source image not found: ${SOURCE}`);
  }

  const asset = await client.assets.upload("image", createReadStream(SOURCE), {
    filename: basename(SOURCE),
    title: "Mwenda Kilemi headshot",
  });
  console.log(`Uploaded ${asset._id} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`);

  await client
    .patch("aboutPage")
    .set({
      headshot: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: ALT,
      },
    })
    .commit();

  console.log("Attached to aboutPage.headshot with alt text.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
