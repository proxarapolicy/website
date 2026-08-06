# Cookie Consent Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an institutional Accept/Reject cookie bar that gates GA4 until the visitor accepts, with all banner copy from Sanity.

**Architecture:** Site layout (RSC) mounts two client components: `CookieBanner` (UI + writes consent cookie) and `Analytics` (loads GA4 only when consent is `accepted`). Consent helpers live in `src/lib/consent.ts`. A `proxara:consent` window event keeps Analytics in sync the moment the visitor chooses.

**Tech Stack:** Next.js 16 App Router, React 19, Sanity (`siteSettings`), shadcn `Button`, `next/script`, browser cookie + Node built-in test runner (`node --test`) for consent helpers.

## Global Constraints

- All visitor-visible banner strings come from Sanity — no client-side English fallbacks.
- Flat design: navy / gold / white only; no gradients; no decorative shadows; no cookie emoji.
- No second animation library; no GSAP on the banner.
- Do not load GA4 until `proxara_consent=accepted`.
- Cookie: name `proxara_consent`, values `accepted` | `rejected`, Max-Age `31536000`, `Path=/; SameSite=Lax` (not HttpOnly).
- After schema/query changes: `npx sanity schema extract && npx sanity typegen generate`.
- Prefer RSC; only the banner and analytics wrappers are client components.

## File map

| Path | Role |
| --- | --- |
| `src/lib/consent.ts` | Cookie read/write + event name |
| `src/lib/consent.test.ts` | Node tests for parsing helpers |
| `src/components/site/cookie-banner.tsx` | Client banner UI |
| `src/components/site/analytics.tsx` | Client GA4 loader |
| `src/app/(site)/layout.tsx` | Mount banner + analytics; remove unconditional GA |
| `src/sanity/schemaTypes/singletons/siteSettings.ts` | New fields |
| `src/sanity/lib/queries.ts` | Query new fields |
| `scripts/seed.ts` | Seed cookie copy for local resets |
| `src/sanity/types.ts` | Regenerated — do not hand-edit |

---

### Task 1: Consent helpers + unit tests

**Files:**
- Create: `src/lib/consent.ts`
- Create: `src/lib/consent.test.ts`

**Interfaces:**
- Produces:
  - `export type ConsentValue = "accepted" | "rejected"`
  - `export const CONSENT_COOKIE = "proxara_consent"`
  - `export const CONSENT_EVENT = "proxara:consent"`
  - `export const CONSENT_MAX_AGE = 31536000`
  - `export function parseConsentCookie(cookieHeader: string | undefined | null): ConsentValue | null`
  - `export function getConsent(): ConsentValue | null` (browser `document.cookie`)
  - `export function setConsent(value: ConsentValue): void` (writes cookie + dispatches `CustomEvent`)

- [ ] **Step 1: Write the failing tests**

Create `src/lib/consent.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONSENT_COOKIE,
  parseConsentCookie,
} from "./consent";

describe("parseConsentCookie", () => {
  it("returns null when cookie missing", () => {
    assert.equal(parseConsentCookie(""), null);
    assert.equal(parseConsentCookie(null), null);
    assert.equal(parseConsentCookie("other=1"), null);
  });

  it("returns accepted or rejected when present", () => {
    assert.equal(
      parseConsentCookie(`${CONSENT_COOKIE}=accepted`),
      "accepted",
    );
    assert.equal(
      parseConsentCookie(`foo=1; ${CONSENT_COOKIE}=rejected; bar=2`),
      "rejected",
    );
  });

  it("returns null for unknown values", () => {
    assert.equal(parseConsentCookie(`${CONSENT_COOKIE}=maybe`), null);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `node --import tsx --test src/lib/consent.test.ts`  
If `tsx` is not installed, run instead:

```bash
npx --yes tsx --test src/lib/consent.test.ts
```

Expected: FAIL (module `./consent` missing or exports missing).

- [ ] **Step 3: Implement `src/lib/consent.ts`**

```ts
export type ConsentValue = "accepted" | "rejected";

export const CONSENT_COOKIE = "proxara_consent";
export const CONSENT_EVENT = "proxara:consent";
export const CONSENT_MAX_AGE = 31536000;

export function parseConsentCookie(
  cookieHeader: string | undefined | null,
): ConsentValue | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    if (name !== CONSENT_COOKIE) continue;
    const value = part.slice(eq + 1).trim();
    if (value === "accepted" || value === "rejected") return value;
    return null;
  }
  return null;
}

export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  return parseConsentCookie(document.cookie);
}

export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: value satisfies ConsentValue }),
  );
}
```

If TypeScript complains about `satisfies` in that position, use:

```ts
window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx --yes tsx --test src/lib/consent.test.ts`  
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/consent.ts src/lib/consent.test.ts
git commit -m "Add proxara_consent cookie helpers."
```

---

### Task 2: Sanity schema, query, typegen, content

**Files:**
- Modify: `src/sanity/schemaTypes/singletons/siteSettings.ts`
- Modify: `src/sanity/lib/queries.ts`
- Modify: `scripts/seed.ts` (add the three cookie fields on `siteSettings`)
- Regenerate: `src/sanity/types.ts` (via typegen)

**Interfaces:**
- Consumes: existing `siteSettings` document `_id: "siteSettings"`
- Produces: query fields `cookieBannerMessage`, `cookieAcceptLabel`, `cookieRejectLabel` on `SITE_SETTINGS_QUERY_RESULT`

- [ ] **Step 1: Add schema fields**

In `siteSettings.ts`, after the `ga4MeasurementId` field, add:

```ts
defineField({
  name: "cookieBannerMessage",
  title: "Cookie banner message",
  type: "text",
  rows: 3,
  description:
    "Short notice shown in the cookie bar. Leave empty to hide the banner.",
}),
defineField({
  name: "cookieAcceptLabel",
  title: "Cookie accept label",
  type: "string",
  initialValue: "Accept all",
}),
defineField({
  name: "cookieRejectLabel",
  title: "Cookie reject label",
  type: "string",
  initialValue: "Reject",
}),
```

- [ ] **Step 2: Update `SITE_SETTINGS_QUERY`**

In `src/sanity/lib/queries.ts`, extend the projection:

```ts
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    wordmark,
    contactEmail,
    linkedinUrl,
    location,
    navItems[]{ label, href },
    ctaLabel,
    footerCta,
    footerLegal,
    ga4MeasurementId,
    cookieBannerMessage,
    cookieAcceptLabel,
    cookieRejectLabel,
    defaultSeo { metaTitle, metaDescription, ogImage }
  }
`);
```

- [ ] **Step 3: Update seed defaults**

In `scripts/seed.ts` inside the `siteSettings` `createOrReplace` object, add:

```ts
cookieBannerMessage:
  "We use analytics cookies to understand how the site is used. You can accept or reject.",
cookieAcceptLabel: "Accept all",
cookieRejectLabel: "Reject",
```

- [ ] **Step 4: Extract schema + generate types**

Run:

```bash
npx sanity schema extract && npx sanity typegen generate
```

Expected: completes without error; `src/sanity/types.ts` includes the new fields on the site settings query result.

- [ ] **Step 5: Patch live Sanity content**

Using Sanity MCP `patch_documents` (or Studio), set on document `siteSettings`:

- `cookieBannerMessage`: `We use analytics cookies to understand how the site is used. You can accept or reject.`
- `cookieAcceptLabel`: `Accept all`
- `cookieRejectLabel`: `Reject`

Publish the document.

Resource: `projectId: 48icdz6f`, `dataset: production`.

- [ ] **Step 6: Commit**

```bash
git add src/sanity/schemaTypes/singletons/siteSettings.ts src/sanity/lib/queries.ts src/sanity/types.ts scripts/seed.ts schema.json
git commit -m "Add Sanity cookie banner fields and typegen."
```

(Include whatever schema extract artifact this repo already tracks, e.g. `schema.json` / `sanity-typegen.json` — match existing git tracking.)

---

### Task 3: Cookie banner component

**Files:**
- Create: `src/components/site/cookie-banner.tsx`

**Interfaces:**
- Consumes: `getConsent`, `setConsent`, `ConsentValue` from `@/lib/consent`; `Button` from `@/components/ui/button`
- Produces: `<CookieBanner message acceptLabel rejectLabel />` client component

- [ ] **Step 1: Implement the banner**

Create `src/components/site/cookie-banner.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";

type CookieBannerProps = {
  message: string;
  acceptLabel: string;
  rejectLabel: string;
};

export function CookieBanner({
  message,
  acceptLabel,
  rejectLabel,
}: CookieBannerProps) {
  // null = unknown (hide to avoid flash); "show" = no stored choice
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (existing === null) setVisible(true);
  }, []);

  function choose(value: ConsentValue) {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={message}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold bg-white text-navy"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-5">
        <p className="max-w-2xl text-sm leading-relaxed text-navy/90 md:text-[0.9375rem]">
          {message}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="border-navy/20 text-navy hover:bg-navy/5"
            onClick={() => choose("rejected")}
          >
            {rejectLabel}
          </Button>
          <Button
            type="button"
            size="lg"
            className="bg-navy text-white hover:bg-navy-deep"
            onClick={() => choose("accepted")}
          >
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Smoke-check in isolation (optional)**

No unit test harness for React in this repo. Manual check happens after Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/cookie-banner.tsx
git commit -m "Add cookie consent banner UI."
```

---

### Task 4: Consent-gated Analytics component

**Files:**
- Create: `src/components/site/analytics.tsx`

**Interfaces:**
- Consumes: `getConsent`, `CONSENT_EVENT`, `ConsentValue` from `@/lib/consent`; `next/script`
- Produces: `<Analytics measurementId={string} />` — loads gtag only when consent is `accepted`

- [ ] **Step 1: Implement Analytics**

Create `src/components/site/analytics.tsx`:

```tsx
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from "@/lib/consent";

export function Analytics({ measurementId }: { measurementId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function sync(value: ConsentValue | null) {
      setAllowed(value === "accepted");
    }

    sync(getConsent());

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<ConsentValue>).detail;
      sync(detail);
    }

    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  if (!allowed || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/site/analytics.tsx
git commit -m "Gate GA4 behind cookie consent."
```

---

### Task 5: Wire layout + remove unconditional GA

**Files:**
- Modify: `src/app/(site)/layout.tsx`

**Interfaces:**
- Consumes: `CookieBanner`, `Analytics`, `SITE_SETTINGS_QUERY` fields including cookie copy + `ga4MeasurementId`

- [ ] **Step 1: Replace layout GA block**

Replace `src/app/(site)/layout.tsx` with:

```tsx
import { Analytics } from "@/components/site/analytics";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
    query: SITE_SETTINGS_QUERY,
    tags: ["sanity", "siteSettings"],
  });

  const ga4Id = settings?.ga4MeasurementId?.trim() || null;
  const cookieMessage = settings?.cookieBannerMessage?.trim() || null;
  const acceptLabel = settings?.cookieAcceptLabel?.trim() || null;
  const rejectLabel = settings?.cookieRejectLabel?.trim() || null;
  const showBanner = Boolean(cookieMessage && acceptLabel && rejectLabel);

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      {showBanner ? (
        <CookieBanner
          message={cookieMessage!}
          acceptLabel={acceptLabel!}
          rejectLabel={rejectLabel!}
        />
      ) : null}
      {ga4Id ? <Analytics measurementId={ga4Id} /> : null}
    </>
  );
}
```

Remove the previous `next/script` GA imports/blocks entirely.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: no errors related to cookie fields or layout.

- [ ] **Step 3: Manual browser verification**

Start: `npm run dev`

1. Clear site cookies for localhost → banner appears.
2. DevTools Network → filter `google` → click **Reject** → no gtag requests; banner gone; reload stays gone.
3. Clear `proxara_consent` → Accept → gtag/js request appears with the measurement ID; reload keeps GA without banner.
4. Narrow viewport: buttons usable; after choice content not permanently covered.
5. Submit contact form after Reject: no console error from missing `gtag`.

- [ ] **Step 4: Commit**

```bash
git add src/app/(site)/layout.tsx
git commit -m "Wire cookie banner and consent-gated analytics in site layout."
```

---

### Task 6: Production sanity check

**Files:** none (verification only)

- [ ] **Step 1: Confirm Sanity webhook still healthy** (unrelated but keep publish→cache path intact)

Publish a harmless siteSettings tweak (or re-publish cookie fields) and confirm the site picks up copy after revalidation.

- [ ] **Step 2: Production smoke (after deploy)**

On `https://proxarapolicy.com` in a private window:

1. Banner shows once.
2. Reject → no GA network calls.
3. Accept (another private window) → GA loads.

- [ ] **Step 3: Final commit only if Task 5 left dirty files**

If docs or types remain unstaged, commit them with an accurate message. Otherwise skip.

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Custom Accept/Reject bar | 3, 5 |
| GA gated until accept | 4, 5 |
| Sanity-managed copy | 2, 5 |
| Cookie name/values/max-age | 1 |
| No flash of banner for return visitors | 3 (`visible` starts false) |
| No client English fallbacks | 5 (`showBanner` requires all three strings) |
| Contact form gtag optional | already optional-chained; verified in Task 5 |
| Out of scope CMP / categories | not implemented |

## Plan self-review notes

- No TBD placeholders.
- `ConsentValue`, `CONSENT_EVENT`, and component prop names are consistent across tasks.
- Repo has no Jest/Vitest — consent uses `node:test` + `tsx`; UI verified manually in Task 5.
