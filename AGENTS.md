<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Proxara Policy — project rules (from the client brief)

This is the website of Proxara Policy Limited, a senior technology & AI policy consultancy. The audience is government ministers, Chief Policy Officers, and World Bank programme leads. Every change must hold up to that audience.

## Content

- **All copy comes from Sanity.** Never hardcode user-visible text in components; add a field to the relevant schema in `src/sanity/schemaTypes/` instead, re-run `npx sanity schema extract && npx sanity typegen generate`, and query it via `src/sanity/lib/queries.ts` (always `defineQuery`, always typed with the generated `*_QUERY_RESULT` types from `@/sanity/types`).
- The **Thinking page (`/thinking`) is the most important page** on the site — it is the long-term inbound engine. Changes there require extra care and must not regress SEO or load speed.
- URL structure is fixed and part of the client contract: `/what-we-do`, `/who-we-work-with`, `/about`, `/thinking`, `/contact`.

## Design (non-negotiable client rules)

- Flat design. **No gradients**, no shadows-as-decoration, no stock photography, no clip art, no generic icons. The About headshot is the ONLY photograph allowed on the site.
- Palette: deep navy primary + single muted gold accent + white content backgrounds. Tokens live in `src/app/globals.css` (`--navy`, `--navy-deep`, `--gold`, and the shadcn variables). Do not introduce new colors.
- Typography: serif for headings (`font-serif`, Source Serif 4), sans for body (Public Sans). Both loaded via `next/font` in `src/app/layout.tsx`.
- UI primitives come from shadcn/ui in `src/components/ui/` — don't add other component libraries.
- Tone: authoritative, minimal, institutional (think Chatham House/Teneo). Generous whitespace. Never frame Africa as a limiting visual category — the Africa depth is expressed through substance, not visual cues.

## Performance (client rule: "if in doubt, remove the element causing the slowdown")

- No animation libraries, no client-side data fetching on public pages — everything is React Server Components except the contact form and mobile nav.
- All Sanity reads go through `sanityFetch` (`src/sanity/lib/client.ts`) with cache tags; the Sanity webhook hits `/api/revalidate` to bust them. Don't switch pages to dynamic rendering without a reason.
- Mobile optimisation is non-negotiable; senior clients review the site on phones.
<!-- END:nextjs-agent-rules -->
