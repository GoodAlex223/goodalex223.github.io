# CI Hardening — Design Spec

**Date:** 2026-04-09
**Branch:** `chore/ci-hardening`
**Story Points:** 4 SP (3 tasks)
**Source:** WEEKLY.md (PR #57, #59 review findings)

## Overview

Batch of 3 independent CI/build improvements identified during prior code reviews.

## Tasks

### 1. Add `cache: 'npm'` to `check-links` CI job (1 SP)

**File:** `.github/workflows/deploy.yml`
**Origin:** PR #59 review finding

The `check-links` job is the only `setup-node` step missing `cache: 'npm'`. The script uses only Node built-ins (no `npm ci` needed), so the cache has no functional effect — this is a consistency fix to match the other 4 jobs (lint, build, test, lighthouse).

**Change:** Add `cache: 'npm'` to the `setup-node` step at line 85.

### 2. Add remaining root config files to ESLint ignores (2 SP)

**File:** `eslint.config.js`
**Origin:** PR #57 backlog item

Currently ignored: `eslint.config.js`, `commitlint.config.js`.
Missing: `lighthouserc.js`, `playwright.config.js`, `postcss.config.js`.

These are tool configuration files that don't belong to any of the 3 ESLint environments (`js/` browser, `scripts/` Node CJS, `tests/` Playwright ESM). Without ignoring them, ESLint applies `js.configs.recommended` to them, which may produce false positives (e.g., `no-undef` for `module`).

**Change:** Add the 3 missing files to the `ignores` array.

### 3. Add file-level JSDoc to `scripts/check-links.js` (1 SP)

**File:** `scripts/check-links.js`
**Origin:** PR #59 review finding

All other build scripts have file-level JSDoc comments; `check-links.js` is the only one missing it.

**Change:** Add a `/** @file ... */` comment at line 1 describing:
- Purpose: validates external URLs from `index.html` and `projects.json`
- Strategy: HEAD-first with GET fallback, 3 retries on 5xx/network errors
- Skip-list: LinkedIn domains (HTTP 999 for all bots)
- Exit code: non-zero on any broken link (CI gate)

## Testing

- `npm run lint` — confirms ESLint ignores are correct (no errors on root configs)
- `npm run check-links` — confirms script still runs after JSDoc addition
- No behavioral changes; CI pipeline structure unchanged

## Out of Scope

- Adding `npm ci` to the `check-links` job (script has no external dependencies)
- Refactoring the check-links script itself
- Any other CI workflow changes
