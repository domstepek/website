# Phase 6: Set up custom domain via is-a-dev/register - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure a custom `jean-dominique-stepek.is-a.dev` subdomain for the site by forking the is-a-dev/register repo, preparing the domain registration PR, updating this repo's deployment config to use the new domain with root base path, refreshing site metadata to be visitor-facing, and adding a CNAME validation check to the site gate. The phase ends with a manual handoff checklist for DNS propagation and HTTPS enforcement.

</domain>

<decisions>
## Implementation Decisions

### Subdomain name and site identity
- Register `jean-dominique-stepek.is-a.dev` as the custom domain.
- Keep the site's internal identity as "dom" everywhere — page titles, nav, copy, and site name stay unchanged.
- The subdomain is the address; the brand voice remains casual and lowercase.

### Registration workflow
- Fork the is-a-dev/register repo to the user's GitHub account as part of this phase.
- Create the domain JSON file (`jean-dominique-stepek.json`) with the correct CNAME record pointing to `jstepek.github.io`.
- Prepare the PR for submission — user will submit and manage the PR themselves.

### Old URL and transition handling
- GitHub Pages auto-redirects `jstepek.github.io/website` to the custom domain once CNAME is configured — no extra redirect logic needed.
- Keep the GitHub repo named "website" — repo name is irrelevant once the custom domain is active.
- Enforce HTTPS on the custom domain via GitHub Pages settings after DNS propagates.

### Site metadata refresh
- Update `DEFAULT_SITE_URL` in both `astro.config.mjs` and `src/data/site.ts` from `https://jstepek.github.io` to `https://jean-dominique-stepek.is-a.dev`.
- Update `DEFAULT_BASE_PATH` from `/website` to `/` in both files.
- Update CI workflow env var defaults to match the new domain and root base path.
- Refresh `defaultDescription` in `src/data/site.ts` to a visitor-facing description in the site's casual lowercase voice (not the current repo-style description).
- All canonical URLs, OG tags, and internal route references will automatically update through the existing `siteConfig` and `routePath()` helpers once the defaults change.

### Validation scope
- Add a CNAME file check to the site validation gate — verify `public/CNAME` exists and contains the correct domain.
- Existing Phase 1-5 validators confirm the site builds correctly under the new root base path.
- No new live-domain smoke test in CI — DNS propagation is async and outside the build gate.

### Manual handoff checklist
- Phase includes a post-deploy verification checklist: submit is-a-dev PR, wait for merge, verify domain resolves, enable HTTPS in GitHub Pages settings, confirm redirect from old URL works.

### Claude's Discretion
- Exact wording of the refreshed site description, as long as it matches the casual lowercase voice.
- Structure of the is-a-dev domain JSON file, following the is-a-dev/register repo's current format requirements.
- Order of operations for the config updates and CNAME addition.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `astro.config.mjs`: Already uses `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` env vars with overridable defaults — changing the defaults is the primary config change.
- `src/data/site.ts`: Centralized `siteConfig` with `siteUrl` and `basePath` derived from env vars — single source of truth for all URL generation.
- `src/lib/paths.ts`: All route helpers (`routePath`, `domainPath`, `homePath`, `assetPath`, `canonicalUrl`) derive from `siteConfig.basePath` — switching to `/` base path propagates automatically.
- `.github/workflows/deploy.yml`: CI already computes `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` from repo context with override support via repository variables.

### Established Patterns
- URL and base path are configured in exactly two places (astro config + site data) and consumed everywhere else through helpers.
- CI env vars can be overridden via GitHub repository variables without changing workflow code.
- The `validate:site` script chains all phase validators and runs after build in CI.

### Integration Points
- `public/CNAME` file needs to be added — Astro copies `public/` contents to `dist/` at build time, so GitHub Pages will find it.
- GitHub Pages custom domain setting needs to be configured in repo settings (manual step).
- is-a-dev/register repo needs a fork, domain JSON file, and PR (external to this repo).

</code_context>

<specifics>
## Specific Ideas

- The site was architecturally designed from Phase 1 to support this exact transition — env-var-driven URL config and base-path-aware helpers make the switch clean.
- The is-a-dev registration is an external dependency with its own review timeline; the phase should clearly separate "code changes we control" from "external steps we wait on."

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-set-up-custom-domain-via-is-a-dev-register*
*Context gathered: 2026-03-09*
