# AGENTS.md

Personal portfolio website for Dom — domain-first information architecture with public pages, passcode-gated portfolio proof, and a custom WebGPU/WebGL2 shader background.

## Stack

- Astro + TypeScript + plain CSS (migrating to Next.js App Router in M005)
- pnpm
- GitHub Pages (migrating to Vercel in M005)

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm validate:site` — full release gate (23 Puppeteer browser tests + 3 dist validators). Run before any deploy.
- `pnpm check` — Astro type checking

## Key Concepts

- **Domain pages** (`/domains/[slug]`) — protected portfolio proof, gated behind a passcode
- **Public pages** (`/`, `/about`, `/resume`, `/notes/*`) — always accessible, never gated
- **Shader** — custom WebGPU/WebGL2 faded dither background, site-wide with per-page opt-out
- **DOM marker contract** — `data-route-visibility`, `data-gate-state`, `data-visual-state` attributes are consumed by tests and validators; don't change them without updating both

## Conventions

- Plain CSS only — no Tailwind, no CSS-in-JS
- Data lives in `src/data/` as typed TypeScript modules, not in a CMS or database
- Notes are markdown files in `src/content/notes/` using Astro content collections
- Casual, direct tone in all copy — sentence case with standard "I" capitalization (D031)
- Dark retro terminal aesthetic — Space Mono font, muted greens, CRT overlay

## Project Planning

This project uses GSD for structured planning and execution. See `.gsd/PROJECT.md` for current state and milestone sequence, `.gsd/DECISIONS.md` for the architectural decision register.
