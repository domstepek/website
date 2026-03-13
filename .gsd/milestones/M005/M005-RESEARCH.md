# M005: Next.js Migration — Research

**Date:** 2026-03-13

## Summary

The migration from Astro to Next.js App Router is well-scoped and the existing codebase is cleanly structured for it. The site has ~10 route pages, ~1,664 lines of plain CSS, ~975 lines of shader code, and 3 TypeScript data modules — all framework-agnostic except for Astro page/component files, Astro content collections, and `import.meta.env` references in `src/data/site.ts`. The hard part is not porting the rendering — it's getting the server-side gate right (middleware + cookie + server action) and rewriting the entire 23-test Puppeteer suite to Playwright.

The highest-risk slice is the gate upgrade (middleware + cookie auth). This is a new capability, not a port, and it touches the Edge Runtime constraint (no Node `crypto`, only `crypto.subtle`), cookie attributes (`HttpOnly`, `Secure`, `SameSite`, `path`), and the server action ↔ redirect flow. It should be proven early so the rest of the migration can proceed with confidence on a known-working auth surface.

**Primary recommendation:** Prove the gate (middleware + server action + cookie) first in a minimal Next.js skeleton with Playwright tests, then port public pages, then wire the shader, notes, and CI/Vercel deployment as follow-up slices. The existing `src/data/` modules, `src/lib/shader/`, and `src/styles/global.css` port with minimal changes.

## Recommendation

Start with a Next.js App Router scaffold alongside the existing Astro source. Port in vertical slices:

1. **Gate auth first** — middleware + server action + cookie on `/domains/*` routes. This is the only genuinely new behavior and the riskiest integration. Prove it with Playwright before porting all content.
2. **Public pages** — `/`, `/about`, `/resume` are thin wrappers around data modules. Port as React Server Components.
3. **Notes pipeline** — Replace Astro content collections with `gray-matter` + `remark`. The 2 markdown files have simple frontmatter matching the existing schema.
4. **Shader** — Wrap existing `src/lib/shader/` in a `'use client'` component with `useEffect`. The shader code is framework-agnostic; only the mount/teardown changes.
5. **CI + Vercel** — Replace GitHub Pages workflow with Vercel deployment + Playwright in GitHub Actions.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Markdown parsing for notes | `gray-matter` + `remark` + `remark-html` | Astro content collections are being removed; these are the standard replacements for reading frontmatter + rendering markdown to HTML |
| Browser integration tests | `@playwright/test` | Replaces Puppeteer per D034; first-class Next.js integration, better API, built-in assertions, parallel execution |
| Cookie-based session auth in middleware | Next.js `cookies()` from `next/headers` + `NextResponse` cookie API | Built into the framework; no need for a separate session library for this single-passcode model |
| Edge-compatible hashing | `crypto.subtle.digest('SHA-256', ...)` (Web Crypto API) | Available in Edge Runtime; no npm dependency needed for SHA-256 comparison |

## Existing Code and Patterns

- `src/data/domains/*.ts`, `src/data/site.ts`, `src/data/home.ts`, `src/data/personal.ts`, `src/data/resume.ts` — Pure TypeScript data modules. Port directly. Only `src/data/site.ts` needs changes: replace `import.meta.env` with `process.env` (Next.js convention).
- `src/data/domains/types.ts` — Type definitions for `DomainEntry`, `FlagshipHighlight`, etc. Port unchanged.
- `src/data/domains/domain-view-model.ts` — `buildDomainProofViewModel()` builds the proof shape. Currently used for both Astro SSR and client-side mount. In Next.js, it's only needed server-side (proof is server-rendered after cookie check, never shipped as JSON to client). Simplifies significantly.
- `src/lib/shader/` (975 lines) — Vanilla TypeScript WebGPU/WebGL2 engine. Framework-agnostic. Wrap in a `'use client'` React component with `useEffect` for init and cleanup on unmount.
- `src/lib/paths.ts` — Route helpers with `basePath` abstraction for GitHub Pages. Vercel deploys to `/`, so `basePrefix` is always empty. Simplify to plain `/`-prefixed routes or keep thin wrappers for consistency. The `canonicalUrl` helper still needs the site URL for SEO.
- `src/styles/global.css` (1,664 lines) — Plain CSS. Import in `app/layout.tsx` unchanged.
- `src/components/domains/DomainGateShell.astro` — Gate UI (locked state). Rebuild as a React Server Component. The markup and data attributes (`data-gate-state`, `data-protected-gate`, etc.) must be preserved for test contracts.
- `src/components/domains/DomainPage.astro` — Full proof page. Rebuild as a React Server Component. Currently ships proof as hidden JSON for client mount; in Next.js, proof is server-rendered only when cookie is valid.
- `src/components/domains/domain-gate-client.ts` — **Entirely replaced.** The client-side SHA-256 hash + sessionStorage/localStorage unlock flow is superseded by server-side middleware + cookie (D033). The gate form submits to a server action instead.
- `src/components/domains/domain-proof-view.ts` — Client-side DOM builder for proof after unlock. **Entirely replaced.** Proof is server-rendered in Next.js when the cookie is valid.
- `src/components/domains/screenshot-gallery-init.ts` — Gallery carousel/lightbox JS. Still needed as a `'use client'` component — galleries are interactive and need client-side scroll/lightbox behavior.
- `src/components/shader/ShaderBackground.astro` — Shader mount point. Becomes a `'use client'` React component.
- `src/content/notes/*.md` — 2 markdown files with `title`, `summary`, `published` frontmatter. Read with `gray-matter` + `remark` via `fs.readFileSync` in server components or `generateStaticParams`.
- `src/content.config.ts` — Astro content collection schema. Replaced by TypeScript type + `gray-matter` parsing.
- `tests/helpers/site-boundary-fixtures.mjs` — Test fixture vocabulary (routes, selectors, server helpers). Rewrite for Playwright but preserve the route/selector vocabulary — it's the most valuable part.
- `.github/workflows/deploy.yml` — GitHub Pages deploy. Replace with Vercel deployment + Playwright CI step.

## Constraints

- **Edge Runtime in middleware** — `middleware.ts` runs on the Edge Runtime. Cannot use Node.js `fs`, `crypto`, or `Buffer`. Must use `crypto.subtle` (Web Crypto API) for any hash operations, or compare against a pre-hashed env var (simpler).
- **`cookies()` is async in Next.js 15+** — Must `await cookies()` before reading/setting. The Context7 docs confirm this pattern.
- **`'use client'` boundary** — Shader, screenshot gallery, and passcode form are the only components that need client-side JS. Everything else (layout, pages, domain proof, notes) can be server components.
- **No `import.meta.env`** — Next.js uses `process.env.NEXT_PUBLIC_*` for client-exposed vars and `process.env.*` for server-only. Replace all `import.meta.env` references.
- **Trailing slashes** — Astro config enforces `trailingSlash: "always"`. Next.js needs `trailingSlash: true` in `next.config.ts` to match existing URL conventions.
- **Static assets** — `public/` directory works identically in Next.js. CNAME file can be removed (Vercel handles custom domains differently). All image/PDF paths stay as `/images/...`, `/favicon.svg`, etc.
- **DOM marker contract** — Tests rely on `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`, `data-shader-renderer`, `data-home-page`, `data-personal-page`, `data-resume-page` attributes. These must be preserved in the React component output.
- **Cookie scope** — `path: '/domains'` ensures the auth cookie only ships on protected routes, not site-wide. This is a good default for both privacy and specificity.

## Common Pitfalls

- **Shipping proof content before auth** — The whole point of the migration is that proof is never in the response HTML until the cookie validates. If the domain page component renders proof server-side without checking the cookie, it defeats the purpose. Middleware must block AND the page component must conditionally render based on auth state.
- **Middleware redirect loops** — If middleware redirects `/domains/[slug]` to a gate page that's also under `/domains/`, the matcher will catch it again. Solution: either use a gate route outside `/domains/` (e.g., `/gate?next=...`) or exclude the gate view from the matcher with a query param or pathname convention.
- **`crypto.subtle` not available in Node test environment** — Playwright tests run against the Next.js dev/preview server, not in the Edge Runtime directly. But if server actions or utilities are tested in isolation, `crypto.subtle` may not be available in Node < 20. Node 20+ has `crypto.subtle` in the global scope — verify CI runs Node 20+.
- **Cookie not set on redirect response** — When a server action validates the passcode and needs to set a cookie + redirect, the cookie must be set on the response that performs the redirect. In Next.js server actions, use `cookies().set(...)` before `redirect(...)` — the framework handles the Set-Cookie header on the redirect response.
- **Forgetting `HttpOnly` on cookie set** — The cookie must be `httpOnly: true` to prevent client-side JS from reading/exfiltrating the session token. This is the security upgrade over the localStorage/sessionStorage model.
- **Shader SSR crash** — If the shader component or any import in its tree references `window`, `navigator`, `document`, or `HTMLCanvasElement` at module scope (outside `useEffect`), it will crash during SSR. The existing shader code uses these only inside `initDitherShader()` which is called at runtime, so this is safe — but the `'use client'` boundary must be at the component level, not deeper.
- **Astro `astro:page-load` event** — The gallery init currently dispatches `astro:page-load` after dynamic mount. This Astro-specific event goes away. In Next.js, gallery init should happen via `useEffect` in a client component or via a small script that runs after hydration.

## Open Risks

- **Vercel custom domain setup** — The site currently uses `jean-dominique-stepek.is-a.dev` via CNAME on GitHub Pages. Moving to Vercel requires DNS changes. The CNAME file in `public/` is GitHub Pages-specific and should be removed. Vercel domain configuration is done through the dashboard, not a file.
- **Cookie session length decision** — Context doc flags this as an open question. Session-scoped (no `maxAge`/`expires`) matches the current sessionStorage model. This should be decided before the gate slice is planned.
- **`/shader-demo/` page fate** — Context doc flags keeping vs. dropping. Low risk either way; can be ported or dropped with minimal effort.
- **Mermaid diagrams** — `MermaidDiagram.astro` renders Mermaid charts in flagships. Needs porting to a React component. The `mermaid` npm package (currently a dependency) does client-side rendering, so this becomes a `'use client'` component.
- **Test environment passcode** — Currently `GATE_TEST_PASSCODE` is a GitHub Actions secret. The new server action needs a `GATE_HASH` (or similar) env var on Vercel, and tests need either the raw passcode or a way to authenticate. The env var strategy for test vs. production needs explicit design.

## Candidate Requirements

These are not auto-binding — they surface observations from research that may warrant explicit requirements.

- **R501 (candidate): `next build` succeeds and Vercel deployment is live** — The context doc lists this as acceptance criteria but there's no explicit requirement for the new deployment model. R004 covers the old "static Astro on GitHub Pages" model and should be updated or a new requirement created to cover the Vercel deployment target.
- **R502 (candidate): Zero proof content in unauthenticated response HTML** — R301 covers "server-side access control" but doesn't explicitly state the zero-leakage property. The context doc's acceptance criteria do ("zero proof content in the response HTML"). Consider making this explicit.
- **R503 (candidate): Existing DOM marker contracts preserved** — Tests depend on stable `data-*` attributes. No existing requirement covers this continuity. It's implicitly part of R407 ("existing test suite continues to pass") but the test suite is being rewritten, not continued.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Next.js App Router | `wshobson/agents@nextjs-app-router-patterns` | available (8.1K installs) — covers App Router patterns, server/client components, middleware |
| Playwright | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | available (9K installs) — covers test patterns, best practices |
| Next.js (general) | `sickn33/antigravity-awesome-skills@nextjs-best-practices` | available (3K installs) — general Next.js best practices |
| Frontend design | `frontend-design` | installed — use for component porting if UI quality is at risk |

## Sources

- Next.js App Router middleware, cookies, server actions, Edge Runtime (source: [Context7 /vercel/next.js](https://github.com/vercel/next.js/tree/canary/docs))
- Next.js `cookies()` is async in v15+ — must `await cookies()` (source: Context7 docs, `next/headers` API reference)
- Middleware runs on Edge Runtime with Web API only — `crypto.subtle` available, Node `crypto` not (source: [Next.js Route Segment Config docs](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route-segment-config.mdx))
- `NextResponse.cookies.set()` for setting cookies in middleware responses (source: Context7 NextResponse API docs)
- Existing codebase analysis: `src/data/site.ts` is the only file using `import.meta.env`; all other data modules are pure TypeScript
- Shader engine (`src/lib/shader/`) uses browser APIs only inside `initDitherShader()` — safe for `'use client'` + `useEffect` wrapping
- Current test suite uses Puppeteer with `node:test` runner; all 23 tests are browser tests against a built static server
- Gallery init (`screenshot-gallery-init.ts`) is framework-agnostic DOM manipulation — port as-is inside a `useEffect`
