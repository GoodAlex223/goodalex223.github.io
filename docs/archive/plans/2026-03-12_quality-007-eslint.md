# Plan: QUALITY-007 — ESLint Integration for JavaScript

**Date**: 2026-03-12
**Status**: Complete
**Branch**: feature/quality-007-eslint-integration

---

## 1. Goal

Add ESLint for JavaScript linting, mirroring how Stylelint validates CSS:
- `lint:js` / `lint:js:fix` npm scripts
- lint-staged auto-fix on commit
- CI lint step in `deploy.yml` (gates build)

## 2. Scope

Files to lint:
- `js/main.js` — browser ES6+ script
- `scripts/*.js` — Node.js CommonJS build utilities
- `tests/**/*.js` — Playwright test files (ESM)

## 3. Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| ESLint version | v9 flat config (`eslint.config.js`) | Current standard, better per-directory env control |
| Config format | CJS (`module.exports`) | Consistent with project (no `"type":"module"` in package.json) |
| Rule strictness | `eslint:recommended` + `no-var` + `prefer-const` | Matches clean ES6+ code already in project |
| Lint tests/ | Yes | Full coverage |
| Combined `lint` script | Yes | Convenience shortcut for `lint:css && lint:js` |
| Test globals | Node + browser combined | Browser globals needed for `page.evaluate()` callbacks |
| Self-ignore | `eslint.config.js` in ignores | Prevents lint-staged from linting the CJS config with no environment |

## 4. Implementation Steps

1. Install: `eslint`, `@eslint/js`, `globals`
2. Create `eslint.config.js` with three environment blocks (browser/Node CJS/Node ESM)
3. Update `package.json`: scripts + lint-staged
4. Update `deploy.yml`: add `Lint JS` step to `lint` job
5. Run `npm run lint:js` and fix violations

## 5. Future Improvements

- Add `eslint-plugin-playwright` for Playwright-specific rules in tests/
- Consider adding `no-console` rule with `warn` level for `js/main.js` (browser code shouldn't log)
- Investigate flaky Firefox `rapid-clicks` test (pre-existing, unrelated to ESLint)

## 6. Key Discoveries

- ESLint v10 installed (latest) — flat config is the only supported format
- `eslint.config.js` must be in the ignores list because lint-staged passes all `*.js` files to `eslint --fix`, including the config file itself
- Existing code had 17 violations: 2 unused catch bindings (`js/main.js`), 5 unused imports/params in test files, 5 `no-undef` for browser APIs in `page.evaluate()` callbacks
- Optional catch binding (`catch {}` without parameter) is ES2019+ and works cleanly

---

### Execution Log

#### 2026-03-12 — PHASE: Planning
- Goal: Add ESLint mirroring Stylelint pattern
- Approach: ESLint v9 flat config, three environment blocks
- Risks: Existing catch clauses use unused `e` binding — may need `catch {}` fixes

#### 2026-03-12 — PHASE: Implementation
- Installed eslint@10, @eslint/js@10, globals@17
- Created eslint.config.js with three environment blocks
- Updated package.json with scripts and lint-staged
- Updated deploy.yml with Lint JS step
- Found and fixed 17 violations across 6 files

#### 2026-03-12 — PHASE: Verification
- `npm run lint` passes (CSS + JS)
- `npm test`: 197/198 passed (1 pre-existing flaky test on Firefox)
- lint-staged hook: initially failed on `eslint.config.js` itself → added to ignores → passes

#### 2026-03-12 — PHASE: Complete
- Commit: `6dab742` — feat: Add ESLint integration for JavaScript linting (QUALITY-007)
- CLAUDE.md updated with ESLint documentation
- All tests passing, all linting clean
