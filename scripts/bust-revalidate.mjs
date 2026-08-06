import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
let secret = "";
for (const line of raw.split(/\r?\n/)) {
  if (!line.startsWith("SANITY_REVALIDATE_SECRET=")) continue;
  secret = line
    .slice("SANITY_REVALIDATE_SECRET=".length)
    .trim()
    .replace(/^["']|["']$/g, "");
}
if (!secret) {
  console.error("NO_SECRET");
  process.exit(1);
}

const url =
  "https://proxarapolicy.com/api/revalidate?secret=" +
  encodeURIComponent(secret);
const res = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ _type: "siteSettings" }),
});
const text = await res.text();
console.log("status=" + res.status);
console.log("body=" + text.replaceAll(secret, "[REDACTED]"));

// Also revalidate catch-all sanity tag via same endpoint (it always does)
const home = await fetch("https://proxarapolicy.com/", {
  headers: { "cache-control": "no-cache" },
});
const html = await home.text();
console.log("cache=" + (home.headers.get("x-vercel-cache") || "n/a"));
console.log(
  "banner=" + (html.includes("analytics cookies") ? "FOUND" : "MISSING"),
);
