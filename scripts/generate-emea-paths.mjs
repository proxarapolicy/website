/**
 * One-shot: Natural Earth 110m → simplified SVG path data for the EMEA map.
 * Run: node scripts/generate-emea-paths.mjs
 */
import fs from "node:fs";

const geo = JSON.parse(fs.readFileSync("scripts/tmp/ne_110m.geojson", "utf8"));

/** @type {Record<string, string[]>} ISO_A2 → region */
const REGION_ISO = {
  "east-africa": ["KE", "TZ", "UG", "RW", "ET", "SO", "SS", "DJ", "ER", "BI"],
  "southern-africa": [
    "ZA",
    "NA",
    "BW",
    "ZW",
    "MZ",
    "ZM",
    "MW",
    "LS",
    "SZ",
    "AO",
    "MG",
  ],
  "west-africa": [
    "NG",
    "GH",
    "SN",
    "CI",
    "ML",
    "BF",
    "NE",
    "GN",
    "LR",
    "SL",
    "TG",
    "BJ",
    "GM",
    "GW",
    "CV",
    "MR",
  ],
  "north-africa": ["EG", "LY", "TN", "DZ", "MA", "EH", "SD"],
  gulf: [
    "SA",
    "AE",
    "QA",
    "BH",
    "KW",
    "OM",
    "YE",
    "IQ",
    "IR",
    "JO",
    "IL",
    "LB",
    "SY",
    "PS",
  ],
  eu: [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "GR",
    "HU",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
    "NO",
    "CH",
    "IS",
    "AL",
    "BA",
    "MK",
    "ME",
    "RS",
    "XK",
    "MD",
    "UA",
    "BY",
    "TR",
  ],
  uk: ["GB", "IE"],
};

/** Context land drawn but not interactive. */
const CONTEXT_ISO = ["RU", "KZ", "AF", "PK", "IN", "TM", "UZ", "AZ", "GE", "AM"];

const LON_MIN = -25;
const LON_MAX = 62;
const LAT_MIN = -36;
const LAT_MAX = 72;
const WIDTH = 900;
const HEIGHT = 1000;

function project([lon, lat]) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * WIDTH;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * HEIGHT;
  return [x, y];
}

function inBounds([lon, lat]) {
  return lon >= LON_MIN - 5 && lon <= LON_MAX + 5 && lat >= LAT_MIN - 5 && lat <= LAT_MAX + 5;
}

/** Douglas–Peucker */
function simplify(points, epsilon) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const t = ((x - x1) * dx + (y - y1) * dy) / len2;
    const px = x1 + t * dx;
    const py = y1 + t * dy;
    const dist = (x - px) ** 2 + (y - py) ** 2;
    if (dist > maxDist) {
      index = i;
      maxDist = dist;
    }
  }
  if (Math.sqrt(maxDist) > epsilon) {
    const left = simplify(points.slice(0, index + 1), epsilon);
    const right = simplify(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

function ringToPath(ring, epsilon) {
  const projected = ring.map(project).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (projected.length < 3) return "";
  const simp = simplify(projected, epsilon);
  if (simp.length < 3) return "";
  let d = `M${simp[0][0].toFixed(1)} ${simp[0][1].toFixed(1)}`;
  for (let i = 1; i < simp.length; i++) {
    d += `L${simp[i][0].toFixed(1)} ${simp[i][1].toFixed(1)}`;
  }
  return d + "Z";
}

function geometryToPaths(geometry, epsilon) {
  const paths = [];
  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates) {
      // Skip tiny rings / holes that are mostly outside the frame
      const sample = ring[0];
      if (!inBounds(sample)) continue;
      const d = ringToPath(ring, epsilon);
      if (d) paths.push(d);
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) {
      const ring = poly[0];
      if (!ring || !inBounds(ring[0])) continue;
      // Only keep polygons that have a centroid-ish point in frame
      let lon = 0;
      let lat = 0;
      for (const p of ring) {
        lon += p[0];
        lat += p[1];
      }
      lon /= ring.length;
      lat /= ring.length;
      if (!inBounds([lon, lat])) continue;
      const d = ringToPath(ring, epsilon);
      if (d) paths.push(d);
    }
  }
  return paths;
}

function isoOf(f) {
  const a2 = f.properties.ISO_A2;
  if (a2 && a2 !== "-99") return a2;
  // France overseas etc.
  return f.properties.ISO_A2_EH;
}

const byRegion = Object.fromEntries(
  [...Object.keys(REGION_ISO), "context"].map((k) => [k, []]),
);

const isoToRegion = new Map();
for (const [region, codes] of Object.entries(REGION_ISO)) {
  for (const c of codes) isoToRegion.set(c, region);
}
for (const c of CONTEXT_ISO) isoToRegion.set(c, "context");

const EPSILON = 1.8;

for (const f of geo.features) {
  const iso = isoOf(f);
  const region = isoToRegion.get(iso);
  if (!region) continue;
  const paths = geometryToPaths(f.geometry, region === "context" ? 2.4 : EPSILON);
  byRegion[region].push(...paths);
}

// Also include African / European countries not listed as inactive context if they fall in frame
const allActive = new Set([...isoToRegion.keys()]);
for (const f of geo.features) {
  const iso = isoOf(f);
  if (allActive.has(iso)) continue;
  const cont = f.properties.CONTINENT;
  const regionUn = f.properties.REGION_UN;
  if (
    cont === "Africa" ||
    cont === "Europe" ||
    regionUn === "Western Asia" ||
    f.properties.SUBREGION === "Western Asia"
  ) {
    const paths = geometryToPaths(f.geometry, 2.4);
    if (paths.length) byRegion.context.push(...paths);
  }
}

const out = {
  viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
  regions: byRegion,
  counts: Object.fromEntries(
    Object.entries(byRegion).map(([k, v]) => [k, v.length]),
  ),
};

fs.writeFileSync(
  "scripts/tmp/emea-paths.json",
  JSON.stringify(out, null, 2),
);
console.log(out.counts);
console.log("Wrote scripts/tmp/emea-paths.json");
