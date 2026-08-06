# Cookie consent banner — design

**Date:** 2026-08-06  
**Status:** Approved for planning  
**Goal:** Institutional Accept / Reject cookie bar with real GA4 gating so the live site feels premium and analytics only run after consent.

## Problem

The site loads Google Analytics 4 whenever `siteSettings.ga4MeasurementId` is set, with no visitor consent. Senior policy audiences expect a restrained consent experience; EU/UK-style expectations require analytics not to start until the visitor accepts.

## Decision

Build a **custom** bottom bar (no third-party CMP package). Gate GA4 on an Accept decision. Manage all banner copy in Sanity.

Rejected alternatives:

- Off-the-shelf React cookie packages — generic look, still need custom GA gating.
- Hosted CMPs (Cookiebot / Osano / OneTrust) — heavier, paid, and visually off-brand for this site.

## Behaviour

1. On first visit (no consent cookie): show the banner.
2. **Accept all:** write `proxara_consent=accepted` (≈1 year, `SameSite=Lax`, path `/`) → load GA4.
3. **Reject:** write `proxara_consent=rejected` → do not load GA4; site otherwise unchanged.
4. Later visits: read the cookie; hide the banner; load GA4 only if value is `accepted`.
5. Contact-form `gtag` lead events remain optional-chained; they no-op when GA never loaded.

## UI

- Fixed bottom bar (not a modal): white surface, thin gold top rule, navy body text, generous padding.
- Two actions: **Reject** (outline/ghost) and **Accept all** (solid navy).
- Flat design only — no gradients, decorative shadows, or cookie emoji.
- No GSAP on the banner; respect `prefers-reduced-motion` by avoiding unnecessary motion.
- Avoid consent-unknown flash: decide visibility on the client after reading the cookie (banner hidden until known “unset”).

## Content (Sanity)

Add fields on the `siteSettings` singleton:

| Field | Purpose | Example |
| --- | --- | --- |
| `cookieBannerMessage` | Short notice | “We use analytics cookies to understand how the site is used. You can accept or reject.” |
| `cookieAcceptLabel` | Primary button | “Accept all” |
| `cookieRejectLabel` | Secondary button | “Reject” |

Rules:

- If `cookieBannerMessage` is empty → do not render the banner.
- If either label is empty → do not render the banner (no client-side English fallbacks; all visible strings come from Sanity).
- Schema `initialValue`s supply “Accept all” / “Reject” for new or migrated settings documents so Studio starts with usable copy.
- If `ga4MeasurementId` is empty → banner may still show when message and labels are set; Accept/Reject only store preference (no scripts to load).

After schema change: run `npx sanity schema extract && npx sanity typegen generate`, update `SITE_SETTINGS_QUERY`, and set copy in Studio (or patch via Sanity tools).

## Architecture

```
Site layout (RSC)
  ├── CookieBanner (client) — reads/writes consent cookie; Accept / Reject
  └── Analytics (client) — if consent === accepted && ga4Id → next/script gtag
```

### Modules

| File | Responsibility |
| --- | --- |
| `src/lib/consent.ts` | Cookie name, `ConsentValue` type, `getConsent` / `setConsent` helpers |
| `src/components/site/cookie-banner.tsx` | Client UI |
| `src/components/site/analytics.tsx` | Client GA4 loader gated on consent |
| `src/app/(site)/layout.tsx` | Mount banner + analytics; remove unconditional GA scripts |
| `src/sanity/schemaTypes/singletons/siteSettings.ts` | New fields |
| `src/sanity/lib/queries.ts` | Include new fields in `SITE_SETTINGS_QUERY` |

### Consent cookie

- Name: `proxara_consent`
- Values: `accepted` \| `rejected`
- Max-Age: 31536000 (1 year)
- `Path=/; SameSite=Lax` (not HttpOnly — client must read it)

## Out of scope

- Category preference centre / “Cookie settings” panel
- Hosted CMP integrations
- Blocking reCAPTCHA or other non-analytics cookies (contact form keeps its existing anti-spam behaviour)
- Privacy policy page rewrite (link can be added later if copy requires it)

## Test plan

1. Fresh profile / cleared cookies: banner appears; Reject → no requests to `googletagmanager.com` / `google-analytics.com`.
2. Fresh profile: Accept → GA scripts load; measurement ID matches Sanity.
3. Reload after Accept or Reject: banner stays hidden; behaviour matches stored choice.
4. Mobile viewport: text readable; both buttons tappable; bar does not permanently obscure content after a choice.
5. Empty `cookieBannerMessage` in Studio: no banner on the site.
6. Contact form submit without prior Accept: no console errors from missing `gtag`.

## Success criteria

- Analytics never load before Accept.
- Banner matches Proxara visual language (navy / gold / white, institutional tone).
- All visitor-facing banner strings come from Sanity.
- No new animation library; no second perpetual motion.
