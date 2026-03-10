# Phase 1 Research: Publishing Foundation

## Phase Intent

Phase 1 is the infrastructure and quality baseline, not the full content rollout. The goal is to leave this phase with a static Astro site that deploys correctly to GitHub Pages, has a readable shared shell, and already handles the polish items that are easy to forget later: metadata defaults, favicon, Open Graph image, and `404` behavior.

Because the repository is still greenfield, project setup is part of the phase itself. This phase should optimize for a stable foundation that later phases can extend without reworking routes, metadata, or CSS primitives.

## Current-State Implications

- There is no existing Astro scaffold, content model, or deployment workflow yet.
- The roadmap assigns only `QUAL-01` through `QUAL-04` to this phase, so content-heavy work should stay out of scope.
- The git state shows no trustworthy remote deployment setup to infer the final Pages URL from, so `site` and `base` should be treated as configuration, not hard-coded assumptions.
- Existing project research already points to Astro + TypeScript + plain CSS + GitHub Actions. Phase 1 should implement that stack directly rather than reopen framework selection.

## Recommended Implementation Approach

- Bootstrap a minimal Astro project with `TypeScript`, plain CSS, and zero client-side JavaScript by default.
- Treat the site as a pure static export from the start:
  - no server routes
  - no auth
  - no form handling that requires a backend
  - no SPA router assumptions
- Keep the first page set intentionally small:
  - `src/pages/index.astro`
  - `src/pages/404.astro`
- Put the reusable shell in a shared layout immediately so later domain pages inherit the same semantics, typography, and metadata behavior.
- Add deployment automation in the same phase. For this project, the site is not "real" until a built `dist` artifact is being published to GitHub Pages consistently.

This phase should produce a real but intentionally sparse homepage. It does not need finalized homepage positioning copy or domain navigation yet. The homepage only needs enough real content to verify layout, readability, metadata, and deploy behavior.

## Astro And GitHub Pages Constraints

The most important implementation constraint for this phase is GitHub Pages base-path behavior.

- If the site is published as a project site such as `username.github.io/website`, the built app must work under `/website/`, not just `/`.
- Astro configuration should define both `site` and `base` explicitly. If the final public URL is still unknown, those values should be parameterized so a repo rename or custom domain later does not require route rewrites.
- Public assets and internal route helpers must be base-aware. Do not hard-code root-relative URLs like `/favicon.svg` or `/domains/analytics/` in templates.
- Prefer one consistent URL strategy from the beginning:
  - directory-style output
  - trailing-slash routes
  - helper-generated internal links
- `src/pages/404.astro` should be implemented in Phase 1 so Astro emits `404.html` at build time.
- GitHub Pages is static hosting, so later deep routes will work only if real files are generated for them. The Phase 1 shell should not assume rewrite behavior that Pages does not provide.

Implication for planning: the first implementation tasks should settle `site`/`base` handling and route helpers before any metadata or asset references are added.

## Page, Layout, And Data Structure Decisions

Phase 1 only needs the shared structure that later phases will build on.

### Shared Layout

Create a `BaseLayout` or equivalent shared wrapper that owns:

- document `<head>` defaults
- page title template
- meta description
- canonical URL generation
- Open Graph defaults
- favicon links
- global shell landmarks

The layout API should accept at least:

- `title`
- `description`
- `canonicalPath`
- `ogImage`
- `noindex`

That is enough for Phase 1 while still covering Phase 2 and later pages without redesigning the metadata interface.

### Site Configuration

Create a single site config module such as `src/data/site.ts` for values that should not be duplicated:

- site name
- default title
- default description
- site URL
- base path
- default social image
- contact URLs if they will appear in the shell

This is a better Phase 1 investment than building full content collections early, because metadata and deploy settings will otherwise get duplicated immediately.

### Path Utilities

Add a small helper module such as `src/lib/paths.ts` to centralize:

- home route
- future domain route construction
- asset URL construction for public files
- canonical URL generation

This reduces the biggest Pages risk in the entire project: broken links or assets caused by mixing root-relative and base-aware URLs.

### Content Modeling Scope

Full domain and highlight collections are not required to complete this phase. The research summary recommends those collections for the overall site, but Phase 1 should only reserve space for them, not block on fully defining them.

Recommended Phase 1 stance:

- create `src/data/site.ts` now
- reserve the expected `src/content/domains` and `src/content/highlights` locations if helpful
- defer real domain and highlight schema work to Phase 2 unless the planner finds a very cheap setup path

This keeps Phase 1 aligned to the roadmap instead of pulling domain-content work forward.

## Accessibility And Readability Baseline

`QUAL-02` and `QUAL-03` are not just styling tasks. They require the shell to be comfortable to read and navigate before deeper content exists.

Phase 1 should establish these defaults:

- semantic landmarks: `header`, `main`, `footer`
- a visible skip link to main content
- correct document language
- logical heading order, even on the sparse homepage
- strong text/background contrast
- obvious link styling that does not rely on color alone
- visible keyboard focus states
- comfortable type scale and line height for text-heavy pages
- width constraints that support readable line length on large screens
- spacing that still works on narrow mobile widths without crowding

Useful practical targets for planning:

- body text at a true readable size, not "minimalist" tiny text
- line length around prose-friendly widths rather than full-bleed paragraphs
- touch-friendly spacing for links on mobile
- minimal motion, with no decorative animation as a baseline dependency
- system font stack first, because it is fast and predictable on Pages

The layout and CSS should be designed for future domain pages, not just for a short hero. If the shell only looks good with a tiny homepage, later phases will need a CSS rewrite.

## Metadata, 404, Favicon, And Deployment Concerns

This phase should wire the quality metadata once, centrally.

### Metadata

- Every page should inherit a valid title and description even if no override is provided.
- Canonical URLs should be generated from the configured site URL plus the page path.
- Open Graph metadata should use absolute URLs, not relative paths.
- A single default OG image is enough for Phase 1. It does not need to be fancy; it just needs to exist and preview cleanly.
- The `404` page should likely be `noindex`.

### Favicon

- Add a simple favicon in `public`.
- Reference it through the same base-aware path strategy as every other public asset.
- Keep it simple and low-risk for now. A text or monogram mark is enough.

### 404

- Implement `src/pages/404.astro`.
- Give it the same typography baseline as the rest of the site.
- Include a clear link back to the homepage.
- Test it on the actual deployed Pages URL, not only locally.

### Deployment

- Use GitHub Actions and publish the built static output.
- The workflow should install dependencies, run `astro check`, run the production build, and publish the artifact.
- The deploy workflow should be part of the phase scope, not deferred. Without it, `QUAL-01` is not actually validated.

Optional but low-cost if implementation stays simple:

- `sitemap`
- `robots.txt`

These are helpful, but they are secondary to the required `title`, `description`, Open Graph, favicon, and `404` deliverables.

## Likely Sequencing Implications

The safest implementation order for this phase is:

1. Confirm the expected GitHub Pages URL shape, or make `site` and `base` configurable if the final URL is not known yet.
2. Scaffold Astro, TypeScript, formatting, and the minimal package scripts.
3. Add the shared site config and path helpers before writing page templates.
4. Build the base layout and global CSS with accessibility and readability defaults.
5. Implement the sparse homepage and the custom `404` page.
6. Add metadata defaults, favicon, and the default OG asset.
7. Add the GitHub Actions deploy workflow.
8. Validate the built and deployed site under the real base path before moving to Phase 2.

Important scope implication: Phase 1 should stop once the shell is deployable and trustworthy. Final homepage positioning, domain hubs, and flagship content belong to later phases even if the layout created here supports them.

## Risks And Pitfalls To Plan Around

### 1. Base-path regressions after deployment

This is the biggest technical risk in the phase. A site can look correct locally and still ship broken styles, icons, or links on GitHub Pages if paths assume root hosting.

Mitigation:

- centralize path construction
- test production output under the real Pages path
- avoid hard-coded root-relative asset URLs

### 2. Scope bleed from later phases

It will be tempting to start solving homepage messaging or domain structure while building the shell. That risks turning a quality-foundation phase into a content phase and delaying deploy validation.

Mitigation:

- keep homepage content intentionally minimal
- implement layout primitives, not final information architecture
- defer full domain collections and domain copy to Phase 2

### 3. Minimal styling that hurts readability

The reference inspiration is sparse, but sparse design is not the same as good reading quality. This project is text-forward, so typography and link behavior are part of the product.

Mitigation:

- prioritize readable font sizing and spacing
- keep contrast comfortably above bare minimum
- validate keyboard navigation and mobile reading early

### 4. Metadata scattered across files

If metadata defaults, canonical logic, and asset URLs are added ad hoc, later phases will pay repeated cleanup cost.

Mitigation:

- centralize metadata behavior in the layout
- centralize site constants in one config module
- define a clear page-level metadata API now

## Validation Architecture

Later plans for this phase should treat validation as a phase gate, not as an optional cleanup step.

### Automated Verification

Recommended baseline automated checks:

- `pnpm astro check`
- `pnpm astro build`
- a build-artifact check that confirms these outputs exist:
  - `dist/index.html`
  - `dist/404.html`
  - favicon asset
  - default OG image asset
- a small script or test that inspects built HTML for:
  - non-empty `<title>`
  - meta description
  - Open Graph title and description
  - favicon link
  - canonical URL
- a CI workflow that runs the same validation before Pages publish

Recommended optional automation if the planner wants one small browser-level smoke test:

- a minimal Playwright test against the built preview that checks:
  - homepage renders without console errors
  - skip link is reachable by keyboard
  - `404` route renders custom content
  - primary links are visible and focusable at a mobile viewport

Playwright is useful but not required if it would slow down the phase. `astro check`, production build validation, and HTML artifact assertions are the minimum bar.

### Manual Verification

Required manual QA after deployment:

- open the deployed homepage at the real GitHub Pages URL
- confirm CSS, favicon, and OG asset URLs resolve under the configured base path
- open a nonexistent route under the same base path and confirm the custom `404` page appears
- test mobile and desktop widths for readable spacing and line length
- tab through the page and confirm visible focus states plus skip-link behavior
- inspect page source or browser devtools to confirm title, description, canonical URL, and Open Graph tags are present and correct
- confirm body text, headings, and links remain comfortably readable without zoom on a narrow viewport

### Phase 1 Exit Criteria For Validation

Phase 1 should not be considered complete until:

- the site deploys successfully to GitHub Pages
- the deployed site works from the real base path
- the shared shell is readable on mobile and desktop
- keyboard navigation and focus treatment are acceptable
- metadata, favicon, and `404` behavior are verified in the built and deployed output

## Planning Takeaway

Phase 1 should be planned as "deployment-safe shell plus quality baseline," not as "start the full site." The highest-value decisions are the ones that remove future churn:

- base-aware routing and assets
- centralized metadata
- readable global CSS
- a reusable layout
- early Pages deployment validation

If those pieces are done well, Phase 2 can focus on actual domain content instead of revisiting infrastructure and polish.
