# Dom Personal Site

## What This Is

A personal website for Dom that gives a minimal first impression and lets visitors drill into the main themes of his work. The site is for recruiters, collaborators, and curious peers who want a high-level view of the systems, products, and infrastructure he has built across analytics, platform, AI, and developer tooling.

The landing page feels casual, direct, and lightweight with a dark retro terminal aesthetic — Space Mono monospace font, CRT scanline overlay, and pixel cursors. Deeper pages organize Dom's work by domain instead of by raw project list.

## Core Value

Someone should be able to land on the site and quickly understand what kinds of complex systems Dom builds, then explore the domains that matter to them without getting buried in noise.

## Requirements

### Validated

- [x] Minimal landing page with short lowercase intro and clear personal framing — v1.0
- [x] Organize deeper content by domains/themes rather than a flat project gallery — v1.0
- [x] Highlight work across analytics platforms, infrastructure/devops, AI/ML tooling, product development, and developer experience — v1.0
- [x] Lightweight domain pages with concise summaries plus 2 flagship projects per domain — v1.0
- [x] Deploy as a static site on GitHub Pages with custom domain — v1.0
- [x] Personal context: how-i-work, resume, open-to framing — v1.0
- [x] Lightweight notes system with index and detail pages — v1.0
- [x] Dark retro terminal visual identity — v1.0

### Active

(None — next milestone not yet started)

### Out of Scope

- Blog or long-form publishing system — not part of the initial goal of presenting work at a high level
- Exhaustive project-by-project portfolio pages for every repo — domains/themes are the primary information architecture
- Heavy animations or complex visual effects — would work against the minimal, text-forward style
- Offline mode — real-time presentation is the core use case

## Context

Shipped v1.0 with ~4,000 LOC (2,475 Astro/TS/CSS + 1,583 validators).
Tech stack: Astro, TypeScript, CSS (no framework), GitHub Pages.
Custom domain: jean-dominique-stepek.is-a.dev (pending DNS propagation after is-a-dev PR merge).

The site ships 11 pages: homepage, 5 domain hubs, about, notes index, 2 note pages, and 404.
Each domain hub has 2 flagship stories (10 total) with 3 local SVG diagrams.
CI runs `astro check`, `astro build`, and 6 phase validators before deploy.

## Constraints

- **Hosting**: GitHub Pages static hosting with custom domain
- **Style**: Minimal, text-forward, dark retro terminal aesthetic
- **Information Architecture**: Domain-first, not project gallery
- **Tone**: Casual, direct, lowercase voice
- **Contact**: GitHub, LinkedIn, and email on the landing page
- **Content Depth**: Brief summaries for most work, detail for flagship examples

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Minimal landing page with deeper linked pages | Preserves clarity and low-friction feel while allowing broader work to be explored | Good — homepage routes into 5 domains cleanly |
| Organize deeper content by domains/themes | Better communicates capabilities across projects than a repo-by-repo gallery | Good — domains are the primary navigation |
| Use a casual lowercase voice | Matches the desired feel and makes the site read as more personal and direct | Good — consistent across all pages |
| Build for GitHub Pages | Keeps hosting simple and aligned with deployment target | Good — CI pipeline validates and deploys automatically |
| Dark retro terminal aesthetic | Gives the site visual identity without heavy animation or gimmicks | Good — CRT overlay, pixel cursors, Space Mono create distinctive feel |
| Dist-first validation (6 phase validators) | Gates catch regressions in built output before deploy | Good — prevented multiple regressions during development |
| Domain-first homepage (not personal-first) | Homepage acts as orientation layer into domains rather than a personal statement | Good — visitors find relevant work faster |
| Inline flagships (not standalone case studies) | Deepens domain hubs without undoing the information architecture | Good — keeps content concentrated on domain pages |
| Text-based resume on /about/ (not PDF) | Keeps resume repo-owned, one-click reachable, and style-consistent | Good — eliminates PDF maintenance |
| Astro content collections for notes | Adds repeatable content without blog platform complexity | Good — two starter notes prove the pattern |
| Base-aware path helpers (paths.ts) | One source of truth for routes/assets under any base path | Good — survived transition from /website/ to / |

---
*Last updated: 2026-03-10 after v1.0 milestone*
