# Project

## What This Is

A personal website for Dom that gives recruiters, collaborators, and curious peers a fast read on the systems, products, infrastructure, and tooling he has built. The site is intentionally domain-first rather than a flat repo gallery, with a minimal homepage and deeper proof on portfolio pages. Protected domain pages are gated behind a passcode with a visual blur/reveal unlock flow.

## Core Value

Someone should be able to land on the site, quickly understand what kinds of complex systems Dom builds, and access the right level of proof for their context.

## Current State

The site runs as a static Astro site on GitHub Pages with a custom domain. M001–M004 are complete.

Public surfaces (`/`, `/about/`, `/resume/`, `/notes/*`) are directly accessible. Protected `/domains/*` routes render a locked retro gate shell on cold load with request-access messaging, a passcode form with SHA-256 hash validation, session-scoped unlock via sessionStorage + localStorage bridge, and a CSS-driven blur-to-clear visual reveal with screenshot gallery rendering after unlock.

A custom WebGPU/WebGL2 faded dither shader renders as an ambient cursor-reactive background across all pages with per-page opt-out, reduced-motion freeze, and tab-visibility pause.

All visitor-facing copy uses sentence case with standard "I" capitalization (D031, superseding the original all-lowercase convention D003). The casual, direct tone is preserved.

The full `pnpm validate:site` release gate runs 23 tests (9 cold-load + 4 gate unlock + 4 visual state + 2 notes + 1 assembled flow + 3 shader) plus 3 dist validators. All 19 validated requirements remain green; 1 active requirement (R301 — server-side auth) is scoped for M005.

## Architecture / Key Patterns

- Astro + TypeScript + plain CSS on GitHub Pages
- Domain-first information architecture with route helpers in `src/lib/paths.ts`
- Thin route files with shared data modules and shared presentational components
- Dist-first validation scripts that verify shipped output before deploy
- Public site surfaces remain lightweight, text-forward, and base-path aware
- Client-side passcode gate with SHA-256 hash validation and session-scoped unlock
- CSS-driven blur-to-clear visual reveal with stable DOM marker contracts
- 23 browser tests + 3 dist validators in `pnpm validate:site` release gate
- Sentence case convention for all visitor-facing copy (D031)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Public portfolio foundation — Ship the domain-first personal site with homepage, domain hubs, flagship proof, about/resume, notes, and custom domain.
- [x] M002: Portfolio access gate — Lightweight passcode gate protecting domain portfolio proof with session-scoped unlock, visual blur/reveal, request-access messaging, and 20-test regression coverage.
- [x] M003: GPU shader background — Custom faded dither shader (WebGPU + WebGL2 fallback) as ambient cursor-reactive background across all pages with per-page opt-out.
- [x] M004: Sentence case audit — Convert all visitor-facing copy from all-lowercase to sentence case with standard "I" capitalization, preserving casual tone.
- [ ] M005: Next.js migration — Migrate from Astro/GitHub Pages to Next.js App Router on Vercel, with the portfolio gate upgraded from client-side SHA-256 to middleware + HttpOnly cookie server auth.
