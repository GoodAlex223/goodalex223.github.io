# Plan: QUALITY-007 — ESLint Integration for JavaScript

**Date**: 2026-03-12
**Status**: In Progress
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

## 4. Implementation Steps

1. Install: `eslint`, `@eslint/js`, `globals`
2. Create `eslint.config.js` with three environment blocks (browser/Node CJS/Node ESM)
3. Update `package.json`: scripts + lint-staged
4. Update `deploy.yml`: add `Lint JS` step to `lint` job
5. Run `npm run lint:js` and fix violations

## 5. Future Improvements

- Add `eslint-plugin-playwright` for Playwright-specific rules in tests/
- Consider adding `no-console` rule with `warn` level for `js/main.js` (browser code shouldn't log)

---

### Execution Log

#### 2026-03-12 — PHASE: Planning
- Goal: Add ESLint mirroring Stylelint pattern
- Approach: ESLint v9 flat config, three environment blocks
- Risks: Existing catch clauses use unused `e` binding — may need `catch {}` fixes
