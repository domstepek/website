# S01: Server-side portfolio gate on Next.js — Research

**Date:** 2026-03-13

## Summary

S01 establishes the entire Next.js App Router scaffold and proves the highest-risk capability: server-side portfolio gate auth. The core deliverable is that an unauthenticated visitor to `/domains/[slug]` receives a server-rendered gate page with **zero proof content in the response HTML**, and after submitting the correct passcode via a server action, receives an HttpOnly cookie and lands on the full proof page.

**Critical discovery: Next.js 16 is now the latest stable (16.1.6).** The `middleware.ts` convention has been **deprecated and renamed to `proxy.ts`**. The exported function is `proxy`, not `middleware`. The proxy runs on the **Node.js runtime** (not Edge Runtime), which means `crypto` from Node is available — no need to restrict to `crypto.subtle`. The M005 context documents reference the old `middleware.ts` + Edge Runtime model; this research corrects that. If the team wants to stay on Next.js 15.x to avoid the breaking change, the old `middleware.ts` + Edge Runtime model applies instead. This is an **open decision** that must be made before planning.

The existing codebase is well-structured for migration. The `src/data/` modules are pure TypeScript (only `src/data/site.ts` uses `import.meta.env`). The domain types, view model builder, path helpers, and test fixture vocabulary all port with minor changes. The client-side gate (`domain-gate-client.ts`, `domain-proof-view.ts`) is entirely replaced by server-side rendering — this is the whole point of the migration.

**Primary recommendation:** Use Next.js 16.x with `proxy.ts` (Node.js runtime). Build the scaffold with Tailwind + shadcn/ui, port `src/data/` modules, implement the proxy + server action + cookie flow, and prove zero-leakage with Playwright. The gate page and proof page are both React Server Components — proof is conditionally rendered only when the cookie is valid.

## Recommendation

### Next.js Version Decision (BLOCKING)

**Option A (recommended): Next.js 16.x** — Use `proxy.ts` with Node.js runtime. Full Node API access (including `crypto`, `fs`). This is the latest stable and what new projects should target. The `middleware.ts` name still works but is deprecated.

**Option B: Next.js 15.x** — Use `middleware.ts` with Edge Runtime. Restricted to Web APIs only (`crypto.subtle` for hashing). More documentation and community examples exist for this pattern. Use this if there's a reason to avoid the 16.x breaking changes.

**Recommendation: Option A.** Next.js 16.x is the stable latest. Starting a new project on a deprecated convention is unnecessary friction. The Node.js runtime in proxy is strictly more capable (full Node API), and `crypto.subtle` is also available in Node 20+ if we want to keep the implementation portable.

### Architecture

1. **`proxy.ts`** — Match `/domains/:path*`. Check for `portfolio-gate` cookie. If missing, let the request through but the page component renders the gate view (not a redirect — per D036, the gate lives at the same URL). If present, let through and the page renders proof.
2. **`app/domains/[slug]/page.tsx`** — React Server Component. Reads the cookie via `cookies()`. If no valid cookie → render `<DomainGatePage>` (zero proof content). If valid cookie → render `<DomainProofPage>` with full proof from `src/data/`.
3. **`app/domains/actions.ts`** — `'use server'` action. Receives passcode from form POST, hashes with `crypto.subtle.digest('SHA-256', ...)`, compares against `GATE_HASH` env var, sets HttpOnly cookie via `cookies().set(...)`, calls `redirect()`.
4. **Gate page component** — Server-rendered. Shows domain title, thesis, scope preview, request-access links, passcode form. Form `action` points to the server action. All existing `data-*` markers preserved.
5. **Proof page component** — Server-rendered. Uses `buildDomainProofViewModel()` or renders directly from domain data. All `data-*` markers preserved.

### Why NOT use proxy redirect

D036 says the gate view lives at `/domains/[slug]` (same URL, not a `/gate?next=...` redirect). The proxy doesn't need to redirect — it can just let the request through and the page component conditionally renders gate vs. proof based on cookie state. The proxy's role is limited to: (a) checking the cookie exists as a fast-path optimization, and (b) potentially setting response headers. The **page component** is the real gate enforcement point — it reads `cookies()` and decides what to render.

Actually, reconsidering: the proxy might not even be strictly necessary for the initial implementation. The page component alone can read cookies and conditionally render. However, the proxy adds defense-in-depth — if someone bypasses the page logic somehow, the proxy is a second check. Keep the proxy as a lightweight cookie-existence check with `NextResponse.next()` pass-through (not redirect), and let the page do the real conditional rendering.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Next.js project scaffold | `create-next-app` or manual `next` + `react` + `react-dom` | Standard setup; no reason to deviate |
| CSS utilities + design tokens | `tailwindcss` v4 + `@tailwindcss/postcss` | D035 decision; utility-first replaces 1650-line global.css |
| Interactive form components | `shadcn/ui` (Button, Input) | D035 decision; accessible primitives themed to retro palette |
| SHA-256 hashing | `crypto.subtle.digest('SHA-256', ...)` | Available in both Node 20+ and Edge Runtime; no npm dep needed |
| Cookie management | `cookies()` from `next/headers` | Built into Next.js; async in v15+/v16 |
| Browser integration tests | `@playwright/test` | D034 decision; first-class Next.js support |
| Form validation server-side | Next.js server actions (`'use server'`) | Built-in; form submits to server action, sets cookie, redirects |

## Existing Code and Patterns

### Port directly (minor changes)

- `src/data/domains/types.ts` — All domain types (`DomainEntry`, `FlagshipHighlight`, etc.). Port unchanged.
- `src/data/domains/index.ts` — Domain registry (`domains`, `getDomainBySlug`). Port unchanged.
- `src/data/domains/product.ts`, `analytics-ai.ts`, `developer-experience.ts` — Domain data. Port unchanged.
- `src/data/domains/domain-view-model.ts` — `buildDomainProofViewModel()` builds the proof shape. In Next.js this is only called server-side when cookie is valid. The `assetPath`/`domainPath` parameters simplify since basePath is always `/`.
- `src/data/home.ts`, `src/data/personal.ts`, `src/data/resume.ts` — Pure data. Port unchanged (S02 scope but S01 may need `home.ts` for contact links on gate page).
- `src/data/site.ts` — **Needs changes.** Replace `import.meta.env.PUBLIC_SITE_URL` → `process.env.NEXT_PUBLIC_SITE_URL` and `import.meta.env.PUBLIC_BASE_PATH` → `process.env.NEXT_PUBLIC_BASE_PATH` (or hardcode `/` since Vercel basePath is always `/`).
- `src/lib/paths.ts` — **Simplify significantly.** `basePrefix` is always empty on Vercel. Can simplify to direct string templates or keep thin wrappers for consistency. Remove `siteConfig` import dependency on `import.meta.env`.

### Replace entirely

- `src/components/domains/domain-gate-client.ts` — **Replaced by server action.** The entire client-side SHA-256 + sessionStorage/localStorage flow is superseded by D033 (server-side cookie auth). The server action handles passcode validation and cookie setting.
- `src/components/domains/domain-proof-view.ts` — **Replaced by React Server Component.** Proof is server-rendered when the cookie is valid. No client-side DOM building.
- `src/components/domains/DomainGateShell.astro` — **Rebuild as React Server Component.** Preserve all `data-*` attributes and markup structure. The form now has `action={serverAction}` instead of client-side JS.
- `src/components/domains/DomainPage.astro` — **Rebuild as `app/domains/[slug]/page.tsx`.** No longer ships proof as hidden JSON. Conditionally renders gate vs. proof based on cookie.
- `src/components/layout/BaseLayout.astro` — **Rebuild as `app/layout.tsx`.** Root layout with `<html>`, `<head>`, font loading, shader mount point (S03 scope — leave placeholder), `<body>` with site-shell wrapper.

### Rewrite for Playwright

- `tests/helpers/site-boundary-fixtures.mjs` — **Rewrite as TypeScript for Playwright.** The route/selector vocabulary is the most valuable part. Port `publicRoutes`, `protectedRoutes`, `protectedBoundarySelectors`, `protectedProofSelectors`, `unlockTestInputs`, etc. Replace the Node `http` server with Playwright's `webServer` config pointing at `next dev` or `next start`.

## Constraints

- **`cookies()` is async in Next.js 15+/16** — Must `await cookies()` before reading or setting. Both in server actions and in page components.
- **Server action + redirect** — When the server action validates the passcode, it calls `(await cookies()).set(...)` then `redirect(...)`. The framework handles Set-Cookie on the redirect response. `redirect()` throws internally — don't wrap it in try/catch or it won't redirect.
- **`redirect()` must be called outside try/catch** — Next.js `redirect()` works by throwing a special error. If caught, the redirect silently fails. Call it after all try/catch blocks.
- **Cookie attributes** — `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'` (false in dev for HTTP localhost), `sameSite: 'lax'`, `path: '/domains'`. Session-scoped (no `maxAge`/`expires`) per D037.
- **`GATE_HASH` env var** — Server-only env var (no `NEXT_PUBLIC_` prefix). Contains the pre-computed SHA-256 hex hash of the passcode. The server action hashes the submitted passcode and compares.
- **`GATE_TEST_PASSCODE` env var** — Used by Playwright tests to submit the real passcode through the form. Tests exercise the full server action flow, not a bypass.
- **Trailing slashes** — `trailingSlash: true` in `next.config.ts` to match existing URL conventions (D036, existing Astro behavior).
- **DOM marker contract** — These `data-*` attributes must be preserved in React output for test assertions: `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`, `data-home-page`, `data-personal-page`, `data-resume-page`.
- **No proof content leakage** — The proof page component must ONLY render when cookie is valid. The gate page must contain zero proof selectors (`data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item`).
- **Node.js 20+** — Required for `crypto.subtle` global availability (also available via `node:crypto`). Verify CI and Vercel runtime are Node 20+.

## Common Pitfalls

- **`redirect()` inside try/catch** — `redirect()` throws a `NEXT_REDIRECT` error. If caught, the redirect silently fails and the action returns normally. Solution: call `redirect()` after all try/catch blocks, or re-throw redirect errors explicitly.
- **Forgetting `httpOnly: true` on cookie** — Without this, client-side JS can read the cookie, defeating the security upgrade over the old localStorage model. Always set `httpOnly: true`.
- **Cookie `secure: true` in dev** — Dev runs on HTTP (`localhost:3000`), not HTTPS. If `secure: true` is hardcoded, the cookie won't be set in dev. Use `secure: process.env.NODE_ENV === 'production'`.
- **Proxy redirect loop** — If the proxy redirects unauthenticated `/domains/*` requests to a gate URL that's also under `/domains/*`, it loops. Per D036, the solution is: no redirect. The same URL renders either gate or proof based on cookie state. The proxy just passes through.
- **Rendering proof without checking cookie in page component** — Even if the proxy checks the cookie, the page component must independently verify. Defense in depth: don't render proof server-side unless `cookies().get('portfolio-gate')` is present.
- **`import.meta.env` in ported modules** — Only `src/data/site.ts` uses this, but if any module transitively imports it, the build breaks. Replace with `process.env` before porting anything that depends on `siteConfig`.
- **Tailwind v4 vs v3** — Tailwind v4 (released 2025) has a different config model (CSS-based `@theme` instead of `tailwind.config.ts`). If using Next.js 16.x, the scaffolding should use Tailwind v4 with the `@tailwindcss/postcss` plugin. The CSS custom properties (`--bg`, `--accent`, etc.) integrate naturally with Tailwind v4's `@theme` directive.
- **shadcn/ui with Tailwind v4** — shadcn/ui has been updated to support Tailwind v4. Use `npx shadcn@latest init` which detects the Tailwind version and sets up accordingly. The CSS variable theming approach (`--background`, `--foreground`, etc.) maps directly to the retro palette.

## Open Risks

- **Next.js 16.x `proxy.ts` vs 15.x `middleware.ts` decision** — The M005 context and roadmap reference `middleware.ts` + Edge Runtime throughout. Next.js 16.x changes this to `proxy.ts` + Node.js runtime. This is a **blocking decision** that affects file naming, runtime constraints, and all downstream documentation. If 16.x is chosen, all M005 planning docs reference outdated conventions (acceptable — docs describe intent, not file names).
- **Tailwind v4 configuration model** — Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.ts`. The retro design tokens (`--bg`, `--accent`, `--accent-strong`, Space Mono, etc.) need to be declared in the new `@theme` block. This is a different setup than most existing tutorials show.
- **`proxy.ts` behavior differences from `middleware.ts`** — The Node.js runtime proxy may have different performance characteristics than Edge middleware. For this use case (simple cookie check), performance is irrelevant. But verify that `NextResponse.next()` and cookie reading work identically.
- **Form submission UX without JavaScript** — Server actions require JavaScript for the `useActionState` / progressive enhancement flow. Without JS, the form falls back to a full-page POST. The gate form should work with this fallback (standard `<form action={...}>` submission).
- **Playwright test server startup** — Playwright needs a running Next.js server. The `playwright.config.ts` `webServer` option can start `next dev` or `next start` automatically. For S01, `next dev` is sufficient. For S04 CI, `next build && next start` is more realistic.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Next.js App Router | `wshobson/agents@nextjs-app-router-patterns` | available (8.2K installs) — covers App Router patterns, server/client components, middleware. **Recommended install.** |
| Playwright | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | available (9K installs from M005 research) — covers test patterns |
| Next.js (general) | `sickn33/antigravity-awesome-skills@nextjs-best-practices` | available (3K installs) — general best practices |
| Frontend design | `frontend-design` | installed — use for component porting if visual fidelity is at risk |

**Install recommendations:**
```bash
npx skills add wshobson/agents@nextjs-app-router-patterns
```
The Playwright skill is useful but not critical — Playwright's API is well-documented and the test patterns for this project are straightforward (navigate, assert selectors, fill form, assert redirect).

## Requirement Coverage

### R301 — Server-side access control for portfolio gate (primary owner: M005/S01 per this research — note: REQUIREMENTS.md lists M005/S03 but that appears to be a typo since S01 is the gate slice)

This is the only Active requirement. S01 directly delivers it:
- **Zero leakage:** Page component renders gate (no proof) when cookie absent → Playwright assertion on response HTML confirms no proof selectors
- **Server-side enforcement:** Proxy checks cookie existence; page component reads cookie and conditionally renders → no client-side unlock path
- **HttpOnly cookie:** Server action sets `httpOnly: true` → cookie invisible to `document.cookie`
- **Session scope:** No `maxAge`/`expires` per D037 → matches previous sessionStorage behavior

Validation: Playwright tests prove (1) cold-load with no cookie shows gate + zero proof in HTML, (2) form submit with correct passcode sets cookie + redirects to proof page, (3) subsequent navigation to other `/domains/*` routes shows proof without re-auth, (4) response HTML inspection confirms no proof selectors in unauthenticated state.

## Sources

- Next.js 16 proxy convention replaces middleware (source: [Context7 — Next.js version-16 upgrade guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx))
- `proxy.ts` runs on Node.js runtime, not Edge Runtime (source: [Context7 — proxy.mdx file convention](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/proxy.mdx))
- `cookies()` is async in Next.js 15+/16 (source: [Context7 — next/headers API](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-mutating-data.mdx))
- Server actions can set cookies then redirect (source: [Context7 — authentication guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx))
- `NextResponse.redirect` with cookie setting pattern (source: [Context7 — backend-for-frontend guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/backend-for-frontend.mdx))
- Next.js 16.1.6 is latest stable; `middleware.ts` still works but is deprecated (source: `npm view next dist-tags`, 2026-03-13)
- Existing codebase: `import.meta.env` used only in `src/data/site.ts` and `src/components/domains/DomainPage.astro` (source: `rg "import.meta.env" src/`)
- Existing `domain-gate-client.ts` SHA-256 flow and storage strategy (source: direct code read)
- Existing test fixture vocabulary in `tests/helpers/site-boundary-fixtures.mjs` (source: direct code read)
