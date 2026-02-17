# QUALITY-004: Pre-commit Hook with Husky + lint-staged

**Status**: Complete
**Created**: 2026-02-17
**Completed**: 2026-02-17
**Branch**: `quality/004-pre-commit-hook-husky`

---

## 1. Problem Statement

CSS violations can reach the repository because Stylelint linting only runs in CI (after push). Developers must remember to run `npm run lint:css` manually before committing. A pre-commit hook automates this check.

## 2. Approach

Standard Husky v9 + lint-staged setup:
- Husky v9 uses `core.hooksPath` to point git at `.husky/_/` for hook dispatch
- lint-staged runs Stylelint with `--fix` on staged CSS files only
- Configuration lives in `package.json` (no separate config files)
- CI skips hook installation via `HUSKY=0` environment variable

### Alternatives Considered
1. **Husky + lint-staged** (chosen) — Industry standard, well-maintained, minimal config
2. **simple-git-hooks** — Lighter alternative, but less ecosystem support
3. **Manual .git/hooks script** — No dependencies, but not portable (hooks not committed to git)

## 3. Implementation

### Files Changed
| File | Change |
|------|--------|
| `package.json` | Added `husky` (^9.1.7) and `lint-staged` (^16.2.7) devDeps, `"prepare": "husky"` script, `"lint-staged": { "*.css": "stylelint --fix" }` config |
| `package-lock.json` | Auto-updated by npm install |
| `.husky/pre-commit` | New file: `npx lint-staged` |
| `.github/workflows/deploy.yml` | Added `HUSKY: 0` env to `npm ci` step |

### How It Works
1. `npm install` runs `prepare` script → `husky` sets `core.hooksPath` to `.husky/_/`
2. `git commit` triggers `.husky/_/pre-commit` → delegates to `.husky/pre-commit`
3. `.husky/pre-commit` runs `npx lint-staged`
4. lint-staged identifies staged `*.css` files and runs `stylelint --fix`
5. If `--fix` resolves all issues → auto-stages fixes → commit proceeds
6. If unfixable violations remain → non-zero exit → commit blocked

## 4. Testing

### Verification Tests
- **Clean CSS commit**: Hook runs, stylelint passes, commit proceeds
- **CSS violation commit**: Intentional BEM naming violation (`BadClassName`) correctly blocked the commit with error message
- **No CSS staged**: Hook fires but lint-staged skips (no matching files)
- **Existing test suite**: 161/162 passed (1 pre-existing flaky Firefox rapid-clicks test)
- **Build pipeline**: Passes without issues
- **CSS linting**: All source files pass

### Acceptance Criteria
- [x] `husky` and `lint-staged` installed
- [x] Pre-commit hook runs `stylelint --fix` on staged `.css` files
- [x] Lint failures block the commit
- [x] Works on fresh `npm install` (prepare script)

## 5. Key Discoveries

- Husky v9 uses `core.hooksPath` git config instead of `.git/hooks/` symlinks
- `.husky/_/` directory has its own `.gitignore` with `*` to exclude generated infrastructure
- `git reset --hard` reverts tracked file changes — must re-apply edits after test commits that are reset
- lint-staged backs up and restores state when commands fail — clean rollback on violations

## 6. Future Improvements

1. **Add more linters to lint-staged** — When JS or HTML linting is added, extend lint-staged config (e.g., `"*.js": "eslint --fix"`, `"*.html": "prettier --write"`)
2. **commitlint for conventional commits** — Add `@commitlint/cli` with `commit-msg` hook to enforce conventional commit message format (feat:, fix:, docs:, etc.)
3. **Mark BACKLOG.md pre-commit item as done** — The TEST-003 backlog item "Pre-commit hook integration" (line 441) is now implemented

---

### Execution Log

#### 2026-02-17 — PHASE: Planning
- Goal: Add pre-commit hook to catch CSS violations before commit
- Approach: Husky v9 + lint-staged (industry standard)
- Risks: CI compatibility, Windows/Linux path differences

#### 2026-02-17 — PHASE: Implementation
- Installed husky ^9.1.7 and lint-staged ^16.2.7
- Added prepare script, lint-staged config, and pre-commit hook
- Added HUSKY=0 to CI workflow

#### 2026-02-17 — PHASE: Verification
- Tested: clean commit passes, violation blocks, no CSS staged skips
- All existing tests pass (161/162, 1 pre-existing flaky)
- Build pipeline unaffected

#### 2026-02-17 — PHASE: Complete
- Committed: a3b80c9
- All acceptance criteria met
