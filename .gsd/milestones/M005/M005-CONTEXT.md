# M005: Next.js Migration — Context

**Gathered:** 2026-03-13
**Status:** Queued — pending auto-mode execution.

## Project Description

Migrate the entire site from Astro (static GitHub Pages) to Next.js App Router on Vercel. All existing pages, content, visual effects, and the portfolio gate are preserved — but rebuilt in React/Next.js and upgraded where the new runtime unlocks better solutions. The gate in particular moves from a client-side SHA-256 hash (proof content visible in source HTML) to real server-side auth: Next.js middleware + HttpOnly cookie, so protected proof is never sent to the client until a valid session exists.

## Why This Milestone

Two reasons: framework preference and genuine capability unlock.

The user prefers Next.js/React as the primary framework going forward. Beyond preference, moving to Vercel's runtime unlocks one meaningful upgrade — the portfolio gate can become real server-side access control instead of a client-side deterrent. The current SHA-256 approach ships the proof payload in the HTML and relies on a blur overlay; with middleware + cookies, the proof content is simply never served until auth, which is a qualitatively stronger model.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit any page and see the same site as before — same design, same content (sentence-cased from M004), same shader background, same retro terminal aesthetic — but the site runs on Next.js/Vercel
- Open a `/domains/*` route unauthenticated and see the gate page (server-rendered, no proof content in the response HTML whatsoever)
- Enter the correct passcode, have the server validate it and set an HttpOnly cookie, and be redirected to the domain page where all proof content renders normally
- Navigate across protected domain routes for the duration of the cookie session without re-entering the passcode
- Visit `/`, `/about/`, `/resume/`, and `/notes/*` with no gate, no regression
- See the WebGPU/WebGL2 faded dither shader background on all pages

### Entry point / environment

- Entry point: All site URLs (`/`, `/about`, `/resume`, `/domains/[slug]`, `/notes`, `/notes/[slug]`, `/404`)
- Environment: Browser on Vercel deployment and local dev (`next dev`)
- Live dependencies involved: Vercel (hosting, serverless functions for server actions)

## Completion Class

- Contract complete means: All pages render correctly, middleware blocks unauthenticated `/domains/*` access, passcode form sets HttpOnly cookie and redirects, Playwright test suite passes
- Integration complete means: Shader coexists with Next.js client/server boundary, notes markdown pipeline reads files correctly, gate cookie is set and checked correctly across navigations
- Operational complete means: Vercel deploy succeeds, GitHub Actions CI runs Playwright tests and blocks deploy on failure

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A visitor can open `/domains/[slug]` cold with no cookie and receive a server-rendered gate page with zero proof content in the response HTML
- A visitor can submit the correct passcode, receive a redirect, and land on the domain page with all proof content server-rendered and cookie-authenticated
- A visitor can navigate between protected domain pages without re-authenticating for the duration of the cookie session
- The full Playwright test suite passes (covering public route access, gate enforcement, passcode auth flow, session persistence, and shader presence)
- `next build` succeeds and the Vercel deployment is live and functional

## Risks and Unknowns

- **Shader CSS var dependency** — The shader reads `--bg`, `--accent`, and `--accent-strong` via `getComputedStyle` at init time. These must be declared as CSS custom properties in Tailwind's base layer (or a minimal `globals.css`) — they cannot be replaced by Tailwind's `bg-*` utility classes alone.
- **shadcn theming against the retro aesthetic** — shadcn ships with a neutral design system. The bracket-style links (`a::before: "["`, `a::after: "]"`), Space Mono typography, and muted green accent palette need to be explicitly threaded into the Tailwind config and shadcn CSS variable overrides. Risk: default shadcn component styles visually clash with the site identity if theming is incomplete.
- **1664-line CSS migration** — The existing `global.css` is large with BEM-style component classes. Migrating to Tailwind utilities is mechanical but tedious; missing a rule is easy. Each component must be visually verified after migration.
- **Client/server boundary for shader** — The WebGPU/WebGL2 shader is pure browser-side code. It must be wrapped in `useEffect` with a `'use client'` directive. No SSR access to `navigator` or `canvas` APIs. This is straightforward but requires care.
- **Notes pipeline** — Astro content collections are replaced by `gray-matter` + `remark` (or `next-mdx-remote`). The markdown files are simple and this is low risk, but the content type definitions need rewriting.
- **Cookie behavior on Vercel** — HttpOnly cookies set by server actions behave correctly on Vercel but need the right `secure`, `sameSite`, and `path` attributes to work across the domain. Cookie lifetime needs a decision (session-scoped vs. expiry-based).
- **Middleware execution context** — Next.js middleware runs on the Edge Runtime. Access to Node.js APIs (fs, crypto) is limited. Passcode hash comparison must use `crypto.subtle` (Web Crypto API) or a pre-computed env variable comparison.
- **Asset paths** — The existing `assetPath` / `basePath` abstraction in `src/lib/paths.ts` exists for GitHub Pages base-path support. Vercel deploys to `/`, so this simplifies significantly — but all path logic needs auditing to avoid broken asset references.
- **Existing test suite is fully obsolete** — All 23 Puppeteer tests must be rewritten as Playwright tests. The test helpers (`site-boundary-fixtures.mjs`) must be ported or replaced. The old dist validators no longer apply.
- **M004 dependency** — M005 should start after M004 completes so the ported copy is already sentence-cased.

## Existing Codebase / Prior Art

- `src/data/*.ts`, `src/data/domains/*.ts` — TypeScript data files; port directly with minor adjustments (remove `import.meta.env`)
- `src/lib/shader/` — Vanilla TypeScript WebGPU/WebGL2 shader engine; wraps cleanly in a `useEffect` React component
- `src/lib/paths.ts` — Route helpers built for base-path support; simplifies significantly with Vercel (base path is always `/`)
- `src/styles/global.css` — Plain CSS; imports into Next.js layout unchanged
- `src/content/notes/*.md` — Markdown note files; read via `gray-matter` + `remark` in Next.js
- `src/components/domains/domain-gate-client.ts` — Client-side gate controller; replaced entirely by middleware + server action + redirect
- `src/components/domains/domain-proof-view.ts` — Client-side proof renderer; replaced by server-rendered React components
- `src/components/domains/DomainGateShell.astro` — Gate UI; rebuilt as a React server component
- `src/components/domains/DomainPage.astro` — Domain proof page; rebuilt as a React server component
- `tests/helpers/site-boundary-fixtures.mjs` — Test fixture vocabulary; rewritten for Playwright
- `scripts/validate-m002-s*.mjs` — Dist validators; replaced by Playwright tests (no longer relevant for a Next.js app)

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R301 — "Strong backend auth" was out-of-scope because the site was static GitHub Pages. Moving to Vercel removes that constraint. R301 should be moved to active and claimed by this milestone's S03.
- R004 — Describes the site as "static Astro site on GitHub Pages." This milestone replaces the deployment model entirely; R004 should be updated to reflect the new stack on completion.
- R401–R406 — Shader requirements remain valid; must still be satisfied by the ported shader component.
- R101–R105 — Public route access and gate behavior requirements remain valid; now proven by server-side enforcement rather than client-side JS.

## Scope

### In Scope

- Full migration from Astro to Next.js App Router
- Vercel deployment with GitHub Actions CI
- All existing pages: `/`, `/about`, `/resume`, `/domains/[slug]`, `/notes`, `/notes/[slug]`, custom 404
- Notes pipeline: `gray-matter` + `remark` for existing markdown files in `src/content/notes/`
- Gate upgrade: Next.js middleware + HttpOnly cookie + server action passcode form
- Domain pages as React Server Components (proof content server-rendered, never shipped before auth)
- WebGPU/WebGL2 shader ported to a `'use client'` React component
- Full Playwright test suite replacing existing 23 Puppeteer tests, wired into CI
- **Tailwind CSS** configured with the existing design tokens (colors, spacing, typography) — replaces the 1664-line `global.css` with utility classes; the retro terminal aesthetic is preserved, only the implementation mechanism changes
- **shadcn/ui** for interactive components (passcode form, button, input, dialog for screenshot lightbox) — themed to match the existing dark retro palette
- The shader's `--bg`, `--accent`, and `--accent-strong` CSS custom properties must survive in the Tailwind config (declared in the base layer so `getComputedStyle` still reads them)
- All existing `src/data/` TypeScript data files ported (minor adjustments only)
- `disableShader` per-page opt-out preserved via React prop
- Update `AGENTS.md` (and `CLAUDE.md` symlink) to reflect the new stack, commands, and conventions

### Out of Scope / Non-Goals

- Adding new pages or content (content migration only, no new features beyond the gate upgrade)
- Changing the design, visual identity, or copy beyond what's needed to port
- Introducing a database, CMS, or user account system
- Adding authentication beyond the single shared passcode model
- Changing the notes content or adding new notes
- Protecting notes behind the gate

## Technical Constraints

- Next.js App Router (not Pages Router)
- Vercel deployment target
- Middleware must use Edge Runtime-compatible APIs only (`crypto.subtle` for hash comparison, not Node `crypto`)
- Cookie must be HttpOnly, Secure, SameSite=Lax, scoped to `/domains`
- Shader component must be `'use client'` with `useEffect` — no SSR execution
- All existing content (data files, markdown notes, images in `public/`) must be preserved without lossy transformation
- Playwright for tests — not Puppeteer, not Cypress
- M005 should not begin until M004 (sentence case audit) is complete

## Integration Points

- **Vercel** — Deployment target; serverless functions handle server actions; Edge Middleware enforces cookie check
- **Next.js middleware** — Checks for valid auth cookie on all `/domains/*` requests; redirects to gate page if absent
- **`cookies()` from `next/headers`** — Sets and reads HttpOnly auth cookie in server actions and middleware
- **`gray-matter` + `remark`** — Parses markdown notes files for the notes pipeline
- **GitHub Actions** — Runs `next build` + Playwright test suite before Vercel deploy; blocks on failure
- **Existing `src/data/` modules** — Port directly; data shape is stable TypeScript, no framework coupling
- **`src/lib/shader/`** — Port directly; wrap initialization in `useEffect` inside a `'use client'` component
- **`public/` assets** — Static files (images, PDF, favicon, CNAME) — kept as-is, referenced with simple `/` paths

## Open Questions

- Cookie session length — session-only (expires on browser close) or a fixed expiry (e.g., 7 days)? Current model was session-scoped; likely match that behavior unless changed.
- Gate page route — should the gate live at `/domains/[slug]` (middleware rewrites to a gate view) or at a dedicated `/gate?next=/domains/[slug]` URL? Middleware redirect with return URL is cleaner for Next.js.
- Whether to keep the `/shader-demo/` page or drop it — it exists as a dev tool for the shader; can be dropped in the Next.js migration unless explicitly kept.
