# Phase 3 Research: Homepage Positioning

**Researched:** 2026-03-09
**Domain:** Astro homepage information architecture and dist-first static validation
**Confidence:** HIGH

## Phase Intent

Phase 3 should turn the Phase 1 placeholder homepage into a real front door for the site. The homepage needs to explain Dom's scope quickly, route visitors into the five domain hubs from Phase 2, surface contact links, and show a lightweight freshness signal.

This phase should stay deliberately narrow:

- in scope: homepage framing, domain-first navigation from the landing page, contact links, freshness signal, homepage-specific validation
- out of scope: flagship proof and visuals from Phase 4, and personal-context or notes work from Phase 5

## Repo-Specific Instruction Files

No `CLAUDE.md`, `.claude/skills/**/SKILL.md`, or `.agents/skills/**/SKILL.md` files were found in the repo.

## User Constraints

No `03-CONTEXT.md` exists for Phase 3, so there are no additional locked decisions captured through `$gsd-discuss-phase`. Existing planning artifacts still constrain the direction of the work:

- keep the overall site minimal, text-forward, and lightweight
- keep the voice casual, direct, and lowercase
- keep the information architecture domain-first rather than turning the homepage into a generic project gallery
- reuse the Phase 2 domain system instead of inventing a second homepage-only taxonomy
- keep flagship proof, screenshots, and deeper role/outcome storytelling deferred to Phase 4
- keep `how i work`, resume, and `open to` framing deferred to Phase 5

## Current-State Implications

- `src/pages/index.astro` is still the Phase 1 placeholder and is the natural Phase 3 entry point. Replacing it is low-risk because it is intentionally temporary.
- Phase 2 already created the main reusable content primitive for this phase: `src/data/domains/index.ts` exports the ordered `domains` registry, and each entry already has `title`, `summary`, and `seoDescription`.
- `src/components/layout/BaseLayout.astro` already owns metadata and the page shell. Phase 3 should continue to pass only page-level metadata into that layout.
- `src/lib/paths.ts` already provides GitHub Pages-safe helpers such as `homePath` and `domainPath(slug)`. Homepage links should use those helpers instead of raw root-relative URLs.
- `package.json` already exposes `validate:site`, and `.github/workflows/deploy.yml` already runs the aggregate validator after build. Phase 3 can plug into that flow by adding `validate:phase3` and widening the aggregate script instead of creating a second release path.
- `src/styles/global.css` is already tuned for sparse, text-first reading. Homepage changes should extend that baseline with a small set of home-specific hooks rather than introducing card-heavy layouts or client-side interactivity.

## Recommended Homepage Information Architecture

The homepage should be intentionally short, but the first screen still needs to do real work.

Recommended top-to-bottom structure:

1. a short lowercase intro or eyebrow line
2. one `h1` that frames Dom's scope across systems, products, and tooling
3. one compact paragraph that explains the homepage as an entry point into the domain hubs
4. a primary domain-navigation block that exposes all five v1 domains using the existing domain registry
5. a small contact cluster for GitHub, LinkedIn, and email
6. a lightweight freshness note such as `currently` or `last updated`

Planning implications:

- the domain links need to appear near the top of the page; if they are buried under long narrative copy, `HOME-01` and `HOME-02` will be weak
- the domain registry should stay the single source of truth for route labels and one-line previews
- the homepage should feel like a routing surface, not a second set of project pages

## Recommended Data And Component Structure

The cleanest Phase 3 shape is:

- `src/data/home.ts` for homepage-specific intro copy, contact links, and freshness content
- `src/components/home/HomePage.astro` for shared homepage markup
- `src/pages/index.astro` as a thin route that passes metadata into `BaseLayout` and renders `HomePage`

Why this fits the repo well:

- it mirrors the existing `src/data/site.ts` and `src/data/domains/*` pattern
- it keeps homepage-specific copy out of the route file
- it lets the homepage reuse the shared domain registry directly instead of duplicating domain content into a second data object
- it creates a clear place for stable `data-*` markers that a Phase 3 validator can inspect in built HTML

## Contact And Freshness Guidance

### Contact links

- GitHub, LinkedIn, and email should be visible in the main homepage flow, not only in the footer
- the homepage data shape should make those links explicit, for example with entries keyed as `github`, `linkedin`, and `email`
- GitHub and LinkedIn should stay absolute `https` URLs, while email should use `mailto:`

### Freshness signal

- use a low-maintenance, intentional signal such as `currently` or `last updated`
- prefer a manually meaningful content field in `src/data/home.ts` over an automatic build timestamp
- avoid showing a value that changes on every deploy without conveying real content freshness

## Validation Architecture

Phase 3 should add a homepage-specific validator that inspects built `dist/index.html`, not source templates. This keeps the checks aligned with what GitHub Pages will actually publish.

### Automated Verification

Recommended commands:

- `pnpm astro check`
- `pnpm astro build`
- `node ./scripts/validate-phase3.mjs`
- `pnpm validate:site`

Recommended homepage markers:

- `data-home-page`
- `data-home-hero`
- `data-home-domain-nav`
- `data-home-domain-link`
- `data-home-contact-links`
- `data-home-contact-link`
- `data-home-freshness`

Recommended Phase 3 assertions:

- `dist/index.html` exists and has a non-empty `<title>` plus canonical URL
- the built homepage exposes a hero marker near the top
- exactly five homepage domain links are rendered from the shared registry
- each domain link points to the expected base-aware `/domains/<slug>/` path
- the homepage contains visible GitHub, LinkedIn, and email contact links
- GitHub and LinkedIn use absolute `https` URLs
- email uses a `mailto:` URL
- the homepage exposes a non-empty freshness marker

### Manual Verification

Required browser-level checks after the automated gate is green:

- confirm the first screen makes it obvious that Dom works across analytics, infrastructure, ai / ml, product, and developer experience
- confirm the domain links feel like the primary next step instead of a secondary footer list
- confirm the contact links are visible without hunting
- confirm the freshness note reads as intentional, not decorative noise
- confirm spacing, heading wraps, and focus states stay comfortable on mobile and desktop widths

Preferred execution path:

- use `/agent-browser --native` first for homepage smoke checks before escalating any remaining subjective checks

## Risks And Pitfalls

### 1. The hero copy stays too vague

If the first screen leans on broad language like "i build things" without surfacing the five working areas, `HOME-01` will technically exist but still feel weak.

Mitigation:

- keep the lead paragraph short
- name or clearly signal the five areas near the top
- use the domain links themselves as proof of scope

### 2. The homepage duplicates later phases

It will be easy to start adding flagship stories, screenshots, or resume-like personal framing once the homepage becomes real.

Mitigation:

- keep the homepage focused on orientation and routing
- defer flagship proof to Phase 4
- defer `how i work`, resume, and `open to` framing to Phase 5

### 3. Homepage navigation becomes a generic gallery

If the homepage switches to a repo dump, card wall, or generic project teaser grid, it will break the domain-first story established in Phase 2.

Mitigation:

- render the homepage navigation from the shared domain registry
- use short one-line summaries, not project lists
- keep domain links as the primary internal navigation surface

### 4. Freshness becomes noisy or meaningless

An automatic deploy timestamp would always look current even if the content meaningfully had not changed.

Mitigation:

- keep freshness in explicit homepage data
- prefer a stable `currently` or `last updated` value that reflects intentional edits

### 5. Contact links are technically present but not visible enough

Putting GitHub, LinkedIn, and email only in the footer might satisfy a source-level reading but still underserve `HOME-03`.

Mitigation:

- keep the contact cluster in the main page flow
- validate the contact section with stable markers in built HTML
- include browser-level checks for link prominence

## Planning Takeaway

Phase 3 is best planned as "make the homepage a real front door using the Phase 2 domain system," not "finish the whole portfolio." The safest breakdown is:

1. replace the placeholder homepage with shared homepage data and a reusable component
2. sharpen the first-screen copy, domain previews, and text-first layout
3. add a dist-first homepage validator and extend the aggregate site gate

That sequence keeps the phase tightly scoped, reuses the domain-first architecture that already exists, and leaves later storytelling phases intact.

---

*Phase: 03-homepage-positioning*
*Research completed: 2026-03-09*
*Ready for planning: yes*
