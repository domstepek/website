# Retrospective

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-10
**Phases:** 6 | **Plans:** 19

### What Was Built

- Static Astro site with GitHub Pages deploy pipeline and 6-phase CI validation gate
- Five domain hubs (analytics, infrastructure, AI/ML, product, developer experience) with typed registry
- Domain-first homepage naming all five domains with contact links and freshness signal
- 10 flagship stories with problem/role/decisions/outcome/stack structure and 3 local SVG diagrams
- Personal context at /about/ with how-i-work, resume, open-to framing
- Lightweight notes system with Astro content collections and 2 starter notes
- Dark retro terminal aesthetic: CRT scanline overlay, Space Mono, pixel cursors, avatar blending
- Custom domain (jean-dominique-stepek.is-a.dev) with CNAME and CI config

### What Worked

- **Phase-by-phase validation:** Each phase shipped with its own dist-first validator, catching regressions early
- **Typed domain registry:** Single source of truth for routes, homepage nav, and domain pages eliminated drift
- **Base-aware path helpers:** One set of helpers (paths.ts) survived the transition from /website/ to / without rewrites
- **Gap closure via UAT:** verify-work found real visual issues (missing dark theme, stale copy) that got fixed before milestone close
- **Parallel plan execution:** Independent plans within phases ran concurrently, keeping total execution under 2 hours

### What Was Inefficient

- **REQUIREMENTS.md checkbox staleness:** Phase 5 requirements (PROF/NOTE) never got checked off despite being verified — caught only at audit
- **Phase 3 gap closure added 2 extra plans (03-04, 03-05):** Visual design and copy quality should have been part of the original phase scope
- **Config duplication:** site.ts and astro.config.mjs declare the same DEFAULT_SITE_URL/DEFAULT_BASE_PATH — a single source would be cleaner

### Patterns Established

- Dist-first validation: all validators read built HTML, not source templates
- One validate:site chain extended per phase — CI runs the same gate as local dev
- Domain data modules: one .ts file per domain with typed schema
- Shared page patterns: DomainPage.astro, PersonalPage.astro, NotesIndexPage.astro render from data

### Key Lessons

- Ship the visual identity earlier — dark theme and CRT effect should have been Phase 1, not a Phase 3 gap closure
- Write visitor-facing copy from the start — internal taxonomy patterns got rewritten in 03-05
- Keep requirements checkboxes updated during plan execution, not just at audit time

### Cost Observations

- Sessions: ~8 across 2 days
- Total execution: ~1.5 hours for 19 plans
- Average plan: ~5 minutes

## Cross-Milestone Trends

(First milestone — trends will be tracked from v1.1 onward)
