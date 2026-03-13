# Ship

Ship the current work to production. Validates everything passes before pushing.

## Steps

### 1. Stage & review changes

```bash
git add -A
git diff --cached --stat
```

Confirm the diff looks right — no unintended files, no leftover debug code.

### 2. Type check

```bash
pnpm check
```

Must exit with **0 errors**. Fix any issues before continuing.

### 3. Build

```bash
pnpm build
```

Must complete successfully. This is what GitHub Pages deploys — if it fails here, CI will fail.

### 4. Run tests

```bash
pnpm validate:site
```

All 23+ tests must pass (9 + 4 + 4 + 2 + 1 + 3). This runs the full suite: route boundary, route unlock, visual reveal, notes isolation, assembled flow, and shader presence tests.

### 5. Commit

Write a clear commit message following conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for restructuring without behavior change
- `chore:` for config/tooling changes

Include a short body if the change isn't obvious from the title.

```bash
git commit -m "type: short description

Optional body with context."
```

### 6. Push

```bash
git push origin main
```

Verify the push succeeded. If rejected (e.g. behind remote), pull first:

```bash
git pull --rebase origin main
git push origin main
```

## Checklist

- [ ] `git diff --cached --stat` reviewed
- [ ] `pnpm check` — 0 errors
- [ ] `pnpm build` — complete
- [ ] `pnpm validate:site` — all tests pass
- [ ] Committed with conventional commit message
- [ ] Pushed to `origin main`
