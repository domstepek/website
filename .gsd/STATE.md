# GSD State

**Active Milestone:** M005 — Next.js Migration
**Active Slice:** None — roadmap planned, ready for S01
**Active Task:** None
**Phase:** Planning complete — ready for execution

## Recent Decisions
- D036: Gate view at `/domains/[slug]` via middleware rewrite (not separate `/gate` route).
- D037: Cookie is session-scoped (no maxAge), matching current sessionStorage model.
- D038: Drop `/shader-demo/` page — not ported to Next.js.
- D039: Slice ordering locked — S01 (gate) first, S02/S03 parallel, S04 (deploy) last.

## Blockers
- None

## Next Action
Begin S01 — Server-side portfolio gate on Next.js.
