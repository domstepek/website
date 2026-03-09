# Phase 01: User Setup Required

**Generated:** 2026-03-09
**Phase:** 01-publishing-foundation
**Status:** Incomplete

Complete these items so the GitHub Pages workflow can publish a real Phase 1 build and the manual QA gate in `01-VALIDATION.md` can run against the hosted site.

## Environment Variables

These variables are optional. The workflow already defaults to the standard project-site shape of `https://{owner}.github.io/{repo}` with base path `/{repo}`.

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `PUBLIC_SITE_URL` (optional) | Final GitHub Pages origin or custom domain once known | GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables |
| [ ] | `PUBLIC_BASE_PATH` (optional) | Final GitHub Pages base path, such as `/{repo}` or `/` | GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables |

## Account Setup

- [ ] **Reconnect this local repository to the final GitHub remote or create it first**
  - URL: https://github.com/new
  - Skip if: `git remote -v` already points at the repository you want to publish from

## Dashboard Configuration

- [ ] **Confirm GitHub Pages publishes from GitHub Actions**
  - Location: GitHub repository -> Settings -> Pages
  - Set to: Source = `GitHub Actions`
  - Notes: The workflow deploys `dist` only after `pnpm astro check`, `pnpm astro build`, and `pnpm validate:phase1` pass.

- [ ] **Add optional Pages override variables if the final hosted URL is not the default project-site shape**
  - Location: GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables
  - Set to: `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH`
  - Notes: Only needed if the final site will publish from a different origin or base path than `https://{owner}.github.io/{repo}`.

- [ ] **Trigger and confirm the first live deploy**
  - Location: Local git remote plus GitHub repository -> Actions
  - Set to: Push `main`, then confirm the `Deploy site` workflow succeeds
  - Notes: Use the published URL from that successful run for the manual checks in `01-VALIDATION.md`.

## Local Development Notes

- Local verification is already wired up through `pnpm astro check && pnpm astro build && pnpm validate:phase1`.
- If the final Pages target is a user site or custom domain, set the optional GitHub Actions variables above before rerunning the workflow so canonical URLs and asset paths match production.
- The remaining live checks are intentionally a handoff item because this repo's current remote state is not trustworthy for autonomous Pages verification.

## Verification

After completing setup, verify with:

```bash
git remote -v
git push -u origin main
```

Expected results:
- `origin` points at the intended GitHub repository.
- Pushing `main` triggers the `Deploy site` workflow and GitHub Pages reports a published URL.
- The manual QA checklist in `01-VALIDATION.md` can be completed against that live URL.

---

**Once all items complete:** Mark status as "Complete" at the top of this file.
