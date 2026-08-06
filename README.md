# Proxara Policy — proxarapolicy.com

Six-page consultancy website for Proxara Policy Limited. Next.js 16 (App Router) + Sanity (headless CMS, Studio embedded at `/studio`) + Tailwind v4 + shadcn/ui.

Every piece of content — page copy, service pillars, audiences, the About story, site settings, and the entire **Thinking** section — lives in Sanity and is editable without a developer.

## Step 0 — Sign up for Sanity (free)

Sanity is the content backend (CMS). The free plan is enough for this site (2 non-admin users, generous API quota, no card required).

1. Go to **[sanity.io](https://www.sanity.io)** → **Get started**.
2. Sign up with **Google**, **GitHub**, or **email + password**. Use the email address that should *own* the content (whoever signs up here is the project admin).
3. When asked to create a project during onboarding, you can **skip it** — the commands below create the project properly from the terminal.

You never need to touch Sanity's own dashboard for day-to-day editing: content is edited in the Studio built into this site at `/studio`. The dashboard at [sanity.io/manage](https://www.sanity.io/manage) is only for admin work (members, CORS, webhooks, tokens).

## Step 1 — Connect this repo to your Sanity account

Run everything below **from this project folder** (commands will fail with "No file found" if you run them from elsewhere):

```bash
cd "C:\Users\gmwan\dev\Mwenda Kilema Portfolio\proxara-policy"   # adjust to wherever the repo lives
npm install
```

Log in with the account you created in Step 0 (opens a browser window):

```bash
npx sanity login
```

Create the project and its dataset:

```bash
npx sanity projects create "Proxara Policy" --dataset production --dataset-visibility public --json -y
```

The output prints a `projectId` (e.g. `"projectId": "ab12cd34"`). Copy `.env.example` to `.env.local` if it doesn't exist yet, and paste that ID into it:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="ab12cd34"
NEXT_PUBLIC_SANITY_DATASET="production"
```

Then allow the embedded Studio to talk to the API, and load the sample content:

```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity exec scripts/seed.ts --with-user-token
```

You should see: `✔ Seed complete: tags, pillars, audiences, testimonial, all pages, 3 external articles, 2 essays.`

## Step 2 — Run it

```bash
npm run dev
```

- Site: **http://localhost:3000** — every page renders the seeded sample content.
- Content editor (Studio): **http://localhost:3000/studio** — log in with the same Sanity account. Edit any document, press **Publish**, refresh the site.

If the Studio shows a "Connect this Studio / Add CORS origin" screen instead of a login, the CORS command in Step 1 didn't run — run it again from the project folder.

## Day-to-day development

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
- **Contact form** (`/api/contact`): sends email via Resend to the address in Site Settings. Without `RESEND_API_KEY` it logs the enquiry server-side and still succeeds, so the site works before Resend is configured. Optional Google reCAPTCHA v3 via `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` (required when the secret is set). Fires a GA4 `generate_lead` event on success.
- **Analytics**: paste a GA4 Measurement ID into Site Settings in the Studio — no code change needed.
- **SEO**: every page and essay has an SEO tab in the Studio (meta title, description, share image). `sitemap.xml` and `robots.txt` are generated automatically; essays emit Article JSON-LD.

## Transferring the site to a new owner / another Sanity account

Two situations, two paths:

### Option A — keep the same project, change who controls it (recommended)

Nothing in the code changes; the project ID stays the same.

1. The new owner signs up at sanity.io (Step 0 above).
2. Current admin goes to [sanity.io/manage](https://www.sanity.io/manage) → project → **Members** → invite the new owner's email as **Administrator**.
3. Once they accept, they can remove the old account from Members (or demote it). To move the project into the new owner's organisation/billing: project → **Settings** → **General** → *Transfer to organization*.
4. Nothing else changes — env vars, deploys, webhooks, and the Studio keep working. To give the client edit-only access, invite them as **Editor** instead of Administrator.

### Option B — move the content to a brand-new project (new account, clean break)

Use this if the new owner must have the data under a project they created themselves.

1. New owner completes **Step 0 + Step 1** above (login, `projects create`, put the new `projectId` in `.env.local`, `cors add`).
2. Copy the content across. Either **re-seed** (`npx sanity exec scripts/seed.ts --with-user-token`) if placeholder content is fine, or **export/import the real data** from the old project:

   ```bash
   # while logged into the OLD account (or as a member of the old project)
   npx sanity dataset export production backup.tar.gz

   # after switching .env.local to the new project (and logging into the new account)
   npx sanity dataset import backup.tar.gz production
   ```

3. Redo the project-level settings on the new project — these do NOT transfer:
   - **CORS origins**: `npx sanity cors add http://localhost:3000 --credentials` and the production origin (e.g. `https://proxarapolicy.com`).
   - **Revalidation webhook** (see Architecture below) with the deploy's `SANITY_REVALIDATE_SECRET`.
   - **Members**: invite editors again.
   - **API tokens**: any tokens (e.g. for CI) must be recreated under the new project.
4. Update `NEXT_PUBLIC_SANITY_PROJECT_ID` wherever it is set: `.env.local` locally **and** the environment variables in Vercel (then redeploy).
5. Optionally delete the old project at sanity.io/manage → Settings → General → *Delete project* (irreversible).

### If the deployment (Vercel) or domains also change hands

- Vercel: project → Settings → **Transfer** to the new owner's Vercel account/team; or the new owner imports the GitHub repo fresh and re-enters the env vars from `.env.example`.
- GitHub repo: Settings → **Transfer ownership**.
- Domains: update the registrar account or repoint DNS to the new Vercel project; keep `proxarapolicy.co.ke` as a 301 redirect to `proxarapolicy.com`.
- Resend / GA4: API keys and Measurement IDs are account-bound — the new owner creates their own and updates `RESEND_API_KEY` (Vercel) and the GA4 ID (Studio → Site Settings).

## Launch checklist (handover)

1. **Copy & headshot**: replace placeholder content in the Studio (`/studio`). Everything marked "Placeholder" must be replaced. Upload the headshot on the About document.
2. **Deploy**: push to GitHub, import into [Vercel](https://vercel.com). Set env vars from `.env.example` (`NEXT_PUBLIC_SITE_URL=https://proxarapolicy.com`, `RESEND_API_KEY`, `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`).
3. **Domains**: add `proxarapolicy.com` as the primary domain in Vercel; add `proxarapolicy.co.ke` and set it to 301-redirect to the primary. Point both domains' DNS at Vercel per its instructions.
4. **CORS**: in sanity.io/manage → API → CORS origins, add `https://proxarapolicy.com` (with credentials) so the embedded Studio works in production.
5. **Resend**: create a free account at resend.com, verify the sending domain, set `RESEND_API_KEY` in Vercel, and change the `from:` address in `src/app/api/contact/route.ts` to the verified domain.
5b. **reCAPTCHA**: create a **v3** key at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin), add `localhost` and the production domain, then set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` in `.env.local` and Vercel.
6. **GA4**: create the property at analytics.google.com, paste the Measurement ID into Studio → Site Settings. Mark the `generate_lead` event as a key event in GA4 for contact-form goal tracking.
7. **Webhook**: create the revalidation webhook (see Architecture above) with the same secret as `SANITY_REVALIDATE_SECRET`.
8. **Studio access**: invite the client as an editor at sanity.io/manage so they can log into `/studio`.
