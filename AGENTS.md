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

- No client-side data fetching on public pages. Everything is a React Server Component except the contact form, the mobile nav, and the motion wrappers below.
- **GSAP is the one sanctioned animation library.** Don't add a second (no motion/framer-motion, no Lenis, no AOS). All motion goes through `Reveal` / `PageEnter` in `src/components/motion/reveal.tsx`, using the tokens in `src/lib/motion.ts` — don't hand-roll tweens in a page. Those wrappers are client components that render server-rendered children untouched, so pages stay RSC.
- The motion brief is restrained: a short fade with a small rise, staggered rows, gold rules drawing in. No parallax, no scroll-scrubbing, no pinning, no split-text, no page-transition choreography. Every reveal fires **once** (`MOTION.scrollTrigger.once`) — re-firing on scroll-up is what makes this read as a gimmick rather than as typesetting.
- The credibility rail under the home masthead (`src/components/motion/credibility-marquee.tsx`) is the **single** exception: a continuous right-to-left loop. Don't add a second perpetual animation. Any continuous motion must pause on hover and focus and must stop dead under `prefers-reduced-motion`.
- Mark what moves with `data-reveal-item="up"` (or `"rule"`) in the **server** JSX. The hidden from-state lives in `globals.css` behind `.motion-ok`, set pre-paint by an inline script in `src/app/layout.tsx`, so there is never a flash of visible-then-hidden content, and reduced-motion/no-JS/GSAP-failed-to-load all fall through to plain visible content.
- Never wrap an element that has a `sticky` descendant in a plain `<Reveal>` — the animated transform makes it a containing block and kills the stickiness. Use `<Reveal stagger>` and mark the siblings instead (see `/about`, `/contact`, `/thinking`).
- Never animate the essay body on `/thinking/[slug]`, and never animate its `<h1>` — that title is mid-morph from the index via `<ViewTransition>`.
- All Sanity reads go through `sanityFetch` (`src/sanity/lib/client.ts`) with cache tags; the Sanity webhook hits `/api/revalidate` to bust them. Don't switch pages to dynamic rendering without a reason.
- Mobile optimisation is non-negotiable; senior clients review the site on phones.
<!-- END:nextjs-agent-rules -->
