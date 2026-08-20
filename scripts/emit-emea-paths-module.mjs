/**
 * Emit src/components/site/emea-map-paths.ts from scripts/tmp/emea-paths.json
 */
import fs from "node:fs";

const j = JSON.parse(fs.readFileSync("scripts/tmp/emea-paths.json", "utf8"));
const REGION_IDS = [
  "east-africa",
  "southern-africa",
  "west-africa",
  "central-africa",
  "north-africa",
  "gulf",
  "eu",
  "uk",
];

const AFRICA_IDS = [
  "east-africa",
  "southern-africa",
  "west-africa",
  "central-africa",
  "north-africa",
];

const lines = [];
lines.push(`/**`);
lines.push(` * Cropped EMEA land geometry for the home-page coverage map.`);
lines.push(` * Paths generated once from Natural Earth 110m (public domain) via`);
lines.push(` * scripts/generate-emea-paths.mjs — not fetched at runtime.`);
lines.push(` */`);
lines.push(``);
lines.push(`export const EMEA_VIEWBOX = "${j.viewBox}" as const;`);
lines.push(``);
lines.push(`export const EMEA_REGION_IDS = [`);
for (const id of REGION_IDS) {
  lines.push(`  "${id}",`);
}
lines.push(`] as const;`);
lines.push(``);
lines.push(`/** African sub-regions — default coverage highlight on the hero map. */`);
lines.push(`export const EMEA_AFRICA_REGION_IDS = [`);
for (const id of AFRICA_IDS) {
  lines.push(`  "${id}",`);
}
lines.push(`] as const;`);
lines.push(``);
lines.push(`export type EmeaRegionId = (typeof EMEA_REGION_IDS)[number];`);
lines.push(``);
lines.push(`export function isEmeaRegionId(value: string): value is EmeaRegionId {`);
lines.push(`  return (EMEA_REGION_IDS as readonly string[]).includes(value);`);
lines.push(`}`);
lines.push(``);
lines.push(`export function isAfricaRegionId(value: string): boolean {`);
lines.push(
  `  return (EMEA_AFRICA_REGION_IDS as readonly string[]).includes(value);`,
);
lines.push(`}`);
lines.push(``);
lines.push(`/** Inactive land drawn for geographic context only. */`);
lines.push(
  `export const EMEA_CONTEXT_PATHS = ${JSON.stringify(j.regions.context)} as const;`,
);
lines.push(``);
lines.push(`export const EMEA_REGION_PATHS: Record<EmeaRegionId, readonly string[]> = {`);
for (const id of REGION_IDS) {
  lines.push(`  "${id}": ${JSON.stringify(j.regions[id] ?? [])},`);
}
lines.push(`};`);
lines.push(``);

fs.writeFileSync("src/components/site/emea-map-paths.ts", lines.join("\n"));
console.log("Wrote src/components/site/emea-map-paths.ts");
