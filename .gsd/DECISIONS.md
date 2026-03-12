# Decisions Register

<!-- Append-only. Migrated from legacy project summaries. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | pattern | Legacy migration carry-over | Minimal landing page with deeper linked pages | Preserves clarity and low-friction feel while allowing broader work to be explored | Yes — if future milestones supersede it |
| D002 | M001 | pattern | Legacy migration carry-over | Organize deeper content by domains/themes | Better communicates capabilities across projects than a repo-by-repo gallery | Yes — if future milestones supersede it |
| D003 | M001 | pattern | Legacy migration carry-over | Use a casual lowercase voice | Matches the desired feel and makes the site read as more personal and direct | Yes — if future milestones supersede it |
| D004 | M001 | arch | Legacy migration carry-over | Build for GitHub Pages | Keeps hosting simple and aligned with deployment target | Yes — if future milestones supersede it |
| D005 | M001 | pattern | Legacy migration carry-over | Dark retro terminal aesthetic | Gives the site visual identity without heavy animation or gimmicks | Yes — if future milestones supersede it |
| D006 | M001 | pattern | Legacy migration carry-over | Dist-first validation (6 phase validators) | Gates catch regressions in built output before deploy | Yes — if future milestones supersede it |
| D007 | M001 | pattern | Legacy migration carry-over | Domain-first homepage (not personal-first) | Homepage acts as orientation layer into domains rather than a personal statement | Yes — if future milestones supersede it |
| D008 | M001 | pattern | Legacy migration carry-over | Inline flagships (not standalone case studies) | Deepens domain hubs without undoing the information architecture | Yes — if future milestones supersede it |
| D009 | M002 | arch | Portfolio protection model | Simple static passcode gate on protected routes | GitHub Pages hosting cannot support real server-side auth; a lightweight deterrent matches the requested scope | Yes — if hosting or security needs change |
| D010 | M002 | scope | Protected route scope | Protect `/domains/*` only | Keeps the deep proof layer gated while preserving the public discovery surfaces | Yes — if notes or other surfaces should later be included |
| D011 | M002 | pattern | Unlock persistence | Session-scoped unlock across protected routes | Avoids repeated prompts while keeping access temporary to the current browser session | Yes — if a different persistence model becomes necessary |
| D012 | M002 | scope | Public route allowlist | Keep `/`, `/about/`, and `/resume/` public | The user explicitly wants public positioning and resume access to remain open | No |
