/**
 * Two build systems consume this file, and they inline different variables:
 *
 * - Next.js (the site, and the Studio embedded at /studio) inlines NEXT_PUBLIC_*.
 * - The Sanity CLI (`sanity deploy`, which builds the hosted Studio with Vite)
 *   only inlines SANITY_STUDIO_*.
 *
 * So each value is read from both prefixes. Drop one and the hosted Studio
 * fails in the browser with "Missing environment variable".
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  "2026-07-15";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET (or SANITY_STUDIO_DATASET for the hosted Studio)"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID for the hosted Studio)"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
