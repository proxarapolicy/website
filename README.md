# Proxara Policy — proxarapolicy.com

Six-page consultancy website for Proxara Policy Limited. Next.js 16 (App Router) + Sanity (headless CMS, Studio embedded at `/studio`) + Tailwind v4 + shadcn/ui.

Every piece of content — page copy, service pillars, audiences, the About story, site settings, and the entire **Thinking** section — lives in Sanity and is editable without a developer.

## First-time backend setup (no Sanity project connected yet)

The repo ships as a **sample backend**: all schemas and a seed script with full placeholder content are ready, but no Sanity project is connected. Create one under your own account (gmwangi3174@gmail.com):

```bash
npx sanity login                       # sign in with gmwangi3174@gmail.com
npx sanity projects create "Proxara Policy" --dataset production --dataset-visibility public --json -y
```

Copy the `projectId` from the output into `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`), then:

```bash
npx sanity cors add http://localhost:3000 --credentials   # let the embedded Studio talk to the API
npx sanity exec scripts/seed.ts --with-user-token         # load all sample content
```

## Development

```bash
npm install
npm run dev          # site at http://localhost:3000, Studio at /studio
```

Environment variables: copy `.env.example` to `.env.local` and fill in the project ID from the setup above (dataset: `production`).

After changing any schema in `src/sanity/schemaTypes/`:

```bash
npx sanity schema extract && npx sanity typegen generate
```

Re-seed placeholder content (idempotent):

```bash
npx sanity exec scripts/seed.ts --with-user-token
```

## Architecture

- **Pages** (`src/app/(site)/`): all React Server Components, statically cached. Data comes through `sanityFetch` (`src/sanity/lib/client.ts`) with cache tags.
- **Instant content updates**: create a webhook in [sanity.io/manage](https://www.sanity.io/manage) (your project) → API → Webhooks pointing at `https://proxarapolicy.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>` (events: create, update, delete). Edits go live in seconds without a rebuild.
- **Contact form** (`/api/contact`): sends email via Resend to the address in Site Settings. Without `RESEND_API_KEY` it logs the enquiry server-side and still succeeds, so the site works before Resend is configured. Fires a GA4 `generate_lead` event on success.
- **Analytics**: paste a GA4 Measurement ID into Site Settings in the Studio — no code change needed.
- **SEO**: every page and essay has an SEO tab in the Studio (meta title, description, share image). `sitemap.xml` and `robots.txt` are generated automatically; essays emit Article JSON-LD.

## Launch checklist (handover)

1. **Copy & headshot**: replace placeholder content in the Studio (`/studio`). Everything marked "Placeholder" must be replaced. Upload the headshot on the About document.
2. **Deploy**: push to GitHub, import into [Vercel](https://vercel.com). Set env vars from `.env.example` (`NEXT_PUBLIC_SITE_URL=https://proxarapolicy.com`, `RESEND_API_KEY`, `SANITY_REVALIDATE_SECRET`).
3. **Domains**: add `proxarapolicy.com` as the primary domain in Vercel; add `proxarapolicy.co.ke` and set it to 301-redirect to the primary. Point both domains' DNS at Vercel per its instructions.
4. **CORS**: in sanity.io/manage → API → CORS origins, add `https://proxarapolicy.com` (with credentials) so the embedded Studio works in production.
5. **Resend**: create a free account at resend.com, verify the sending domain, set `RESEND_API_KEY` in Vercel, and change the `from:` address in `src/app/api/contact/route.ts` to the verified domain.
6. **GA4**: create the property at analytics.google.com, paste the Measurement ID into Studio → Site Settings. Mark the `generate_lead` event as a key event in GA4 for contact-form goal tracking.
7. **Webhook**: create the revalidation webhook (see Architecture above) with the same secret as `SANITY_REVALIDATE_SECRET`.
8. **Studio access**: invite the client as an editor at sanity.io/manage so they can log into `/studio`.
