# M002: Portfolio Access Gate — Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

## Project Description

Add a lightweight access-control layer to the domain portfolio pages on the existing static Astro site. The public-facing homepage, about page, and resume page stay directly accessible, while the domain proof layer moves behind a simple passcode gate with a contact-for-password landing state.

## Why This Milestone

The current site already does the public positioning job well, but the deeper portfolio proof needs a softer sharing boundary. This milestone adds that boundary without changing hosting, introducing backend auth, or taking the whole site private.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Open `/`, `/about/`, and `/resume/` normally with no passcode prompt.
- Open a `/domains/*` route and see a clear gate message telling them to DM or email for the password.
- Enter the passcode once and browse protected domain pages for the rest of the current browser session.
- See protected visuals obscured before unlock and shown normally after unlock.

### Entry point / environment

- Entry point: deployed website routes (`/`, `/about/`, `/resume/`, `/domains/[slug]`)
- Environment: browser on the existing static GitHub Pages deployment and local dev build
- Live dependencies involved: none beyond the static site itself

## Completion Class

- Contract complete means: route protection behavior, gate copy, unlock persistence, and image reveal rules are all implemented and covered by deterministic artifact/runtime checks.
- Integration complete means: public routes and protected routes behave differently inside the same shipped site, and protected domain pages render correctly after unlock.
- Operational complete means: the protection behavior survives normal client-side navigation and refresh behavior within the chosen static-session model.

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A visitor can load a protected domain route cold and is shown the gate experience instead of the full proof layer.
- A visitor can enter the correct passcode once, navigate across protected domain routes during the same session, and view unblurred visuals.
- A visitor can still open `/`, `/about/`, and `/resume/` directly with no gate and no regression in the public site shell.

## Risks and Unknowns

- Static-site protection is only a deterrent, not true security — this matters because the implementation must set the right expectations and avoid being mistaken for strong auth.
- Route split correctness is easy to get wrong — if the wrong pages get gated, the public recruiting/discovery layer breaks.
- Protected-image behavior may require careful component or CSS treatment — visuals need to obscure reliably before unlock without degrading public pages.
- Current validation is dist-first — M002 likely needs browser/runtime verification in addition to artifact checks because the gate depends on client-side state.

## Existing Codebase / Prior Art

- `src/pages/domains/[slug].astro` — current protected-scope route family that renders all domain pages.
- `src/pages/index.astro` — public homepage that must remain ungated.
- `src/pages/about.astro` — public personal page that must remain ungated.
- `src/pages/resume.astro` — public resume page that must remain ungated.
- `src/lib/paths.ts` — route helper source of truth for site paths.
- `src/components/home/HomePage.astro` and `src/components/personal/PersonalPage.astro` — public surfaces whose accessibility must not regress.
- Existing dist validators and `validate:site` flow — likely extension point for M002 verification.

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R101 — Preserve direct public access to home, about, and resume.
- R102 — Gate `/domains/*` behind a passcode before showing protected proof.
- R103 — Provide a clear contact-for-password landing state on protected routes.
- R104 — Persist unlock state for the current browser session.
- R105 — Obscure protected visuals until unlock, then reveal them.

## Scope

### In Scope

- Protecting `/domains/*` with a simple client-side passcode gate.
- Showing contact/outbound links on the gate state.
- Preserving public access to `/`, `/about/`, and `/resume/`.
- Session-scoped unlock behavior across protected routes.
- Blurring or otherwise obscuring protected visuals until unlock.
- Adding verification coverage for public/protected route behavior.

### Out of Scope / Non-Goals

- Introducing server-backed auth, edge auth, or any hosted identity system.
- Protecting the entire site.
- Expanding protection to notes in this milestone.
- Reworking the site’s core information architecture or public homepage positioning.

## Technical Constraints

- Hosting remains static GitHub Pages; no runtime server is available for real auth.
- The implementation should preserve the current Astro + shared-component patterns.
- The gate copy and visuals should stay consistent with the current lowercase, retro-terminal site tone.
- Public route SEO and usability should not regress because of protected-route logic.

## Integration Points

- Browser storage/session state — used to remember unlock state for the current session.
- Domain page route/render path — where protection must intercept before full proof is shown.
- Shared styles/components — where the gate UI and blurred-visual treatment will likely live.
- Site validation tooling — where M002 needs new proof that public and protected routes behave correctly.

## Open Questions

- Exact passcode source and rotation strategy — likely repo config or env-backed build-time value, but planning should pick the least fragile static-safe option.
- Exact gate landing copy and link set — confirmed conceptually, but execution should settle the final wording and which outbound links are shown.
- Exact visual-obscuring mechanism — planning should choose whether this is component-driven, CSS-driven, or both.
