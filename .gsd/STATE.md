# GSD State

**Active Milestone:** M002 — Portfolio Access Gate
**Active Slice:** S01 — Public vs Protected Route Boundary
**Active Task:** None
**Phase:** Planning

## Recent Decisions
- Use a simple static passcode gate instead of real auth because the site stays on GitHub Pages.
- Protect `/domains/*` only.
- Keep `/`, `/about/`, and `/resume/` public.
- Persist unlock state for the current browser session.

## Blockers
- None

## Next Action
Create `S01-PLAN.md` for M002/S01 using the protected/public route split and boundary-map contracts in `M002-ROADMAP.md`.
