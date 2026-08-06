/**
 * Creates the Sanity document webhook that POSTs to /api/revalidate on publish.
 * Reads SANITY_REVALIDATE_SECRET from .env.local and auth from the Sanity CLI config.
 * Never prints secrets.
 *
 * Usage: node scripts/create-revalidate-webhook.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PROJECT_ID = "48icdz6f";
const DATASET = "production";
const SITE_URL = "https://proxarapolicy.com";
const API_VERSION = "v2021-10-04";

function readEnvLocal(key) {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    if (k !== key) continue;
    let v = trimmed.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  }
  return undefined;
}

function findAuthToken() {
  const candidates = [
    join(homedir(), "AppData", "Roaming", "sanity", "config.json"),
    join(homedir(), ".config", "sanity", "config.json"),
    process.env.APPDATA
      ? join(process.env.APPDATA, "sanity", "config.json")
      : "",
  ].filter(Boolean);

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const cfg = JSON.parse(readFileSync(path, "utf8"));
      const token = cfg?.authToken || cfg?.token || cfg?.auth?.token;
      if (typeof token === "string" && token.length > 10) return token;
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

const secret = readEnvLocal("SANITY_REVALIDATE_SECRET");
if (!secret) {
  console.error("Missing SANITY_REVALIDATE_SECRET in .env.local");
  process.exit(1);
}

const token = findAuthToken();
if (!token) {
  console.error(
    "Could not find Sanity CLI auth token. Run `npx sanity login` then retry."
  );
  process.exit(1);
}

const body = {
  type: "document",
  name: "Revalidate Next.js cache",
  description:
    "On create/update/delete of published documents, bust Next.js cache tags via /api/revalidate.",
  url: `${SITE_URL}/api/revalidate?secret=${encodeURIComponent(secret)}`,
  dataset: DATASET,
  apiVersion: API_VERSION,
  httpMethod: "POST",
  includeDrafts: false,
  includeAllVersions: false,
  rule: {
    on: ["create", "update", "delete"],
    filter:
      '_type in ["homePage","whatWeDoPage","whoWeWorkWithPage","aboutPage","thinkingPage","contactPage","siteSettings","post","externalArticle","pillar","audience","tag","testimonial"]',
    projection: "{_type}",
  },
};

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/hooks/projects/${PROJECT_ID}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
);

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = null;
}

if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  console.error((text || "").replaceAll(secret, "[REDACTED]").slice(0, 800));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      id: json?.id,
      name: json?.name,
      dataset: json?.dataset,
      httpMethod: json?.httpMethod,
      isDisabled: json?.isDisabled,
      url: "https://proxarapolicy.com/api/revalidate?secret=[REDACTED]",
      rule: json?.rule,
    },
    null,
    2
  )
);
console.log(
  "\nWebhook created. Confirm SANITY_REVALIDATE_SECRET is set on Vercel Production to the same value as .env.local."
);
