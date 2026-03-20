# QUALITY-009: ESLint Enhancements — Design Spec

**Date**: 2026-03-20
**Status**: Approved
**Origin**: [BACKLOG.md — QUALITY-007 spawned tasks](../../planning/BACKLOG.md#from-quality-007-eslint-integration-2026-03-12)

## Goal

Strengthen the ESLint configuration with two targeted enhancements:

1. **Playwright-specific linting** for test files — catches common test anti-patterns
2. **`no-console` guard** for browser code — prevents accidental `console.*` in production

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Playwright plugin preset | `flat/recommended` + cherry-picked rules | Safety net of recommended without the full strictness of `flat/playwright-test`; avoids unnecessary churn |
| Cherry-picked rules | `prefer-web-first-assertions: "error"` | Called out in TODO.md; promotes Playwright best practices (auto-waiting assertions) |
| `no-console` scope | `js/**/*.js` only (browser code) | Build scripts (`scripts/**/*.js`) legitimately use `console.*` for CLI output |
| `no-console` level | `"warn"` with no allowed methods | Zero `console.*` calls exist today; purely preventative. Portfolio site has no runtime error reporting needs |
| `no-console` in tests | Not applied | Test files may use console for debugging during development; Playwright has its own logging |

## Changes

### 1. New Dependency

```bash
npm install -D eslint-plugin-playwright
```

- Package: `eslint-plugin-playwright` (v2.x)
- Purpose: Playwright-specific ESLint rules for `tests/**/*.js`

### 2. ESLint Config Modifications

**File**: `eslint.config.js`

#### Browser code block (`js/**/*.js`)

Add `no-console` rule:

```js
rules: {
  "no-var": "error",
  "prefer-const": "error",
  "no-console": "warn",
},
```

#### Playwright test block (`tests/**/*.js`)

Integrate `eslint-plugin-playwright` recommended preset and cherry-pick `prefer-web-first-assertions`:

```js
const playwright = require("eslint-plugin-playwright");

// Playwright test files (Node.js, ESM)
{
  ...playwright.configs["flat/recommended"],
  files: ["tests/**/*.js"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    globals: { ...globals.node, ...globals.browser },
  },
  rules: {
    ...playwright.configs["flat/recommended"].rules,
    "no-var": "error",
    "prefer-const": "error",
    "playwright/prefer-web-first-assertions": "error",
  },
},
```

**Key detail**: The spread of `flat/recommended` provides the plugin reference and base rules. Our explicit `languageOptions` and `rules` override the preset's defaults, preserving browser globals (needed for `page.evaluate()` callbacks) and our existing `no-var`/`prefer-const` rules.

#### No changes to

- `scripts/**/*.js` block — build scripts keep unrestricted `console.*`
- `ignores` block — unchanged
- `js.configs.recommended` — unchanged (applies to all files)

### 3. Fix Violations

**Expected violations**: Zero or minimal.

- `js/main.js`: No `console.*` calls exist today
- `tests/**/*.js`: No `console.*` calls; test patterns generally follow Playwright best practices

If violations surface from Playwright plugin rules (e.g., `expect-expect` on helper functions, `no-conditional-in-test` patterns), fix them inline in the affected test files.

### 4. Verification

1. `npm run lint:js` — must pass clean (zero errors, zero warnings)
2. `npm test` — all 461+ tests still pass (lint changes don't affect runtime)
3. lint-staged still works — `*.js` files auto-fixed on commit via husky

## Out of Scope

- No changes to Stylelint configuration
- No changes to Husky or lint-staged configuration
- No changes to CI workflow (`deploy.yml`)
- No new ESLint rules beyond `eslint-plugin-playwright` recommended + `prefer-web-first-assertions` + `no-console`
- No refactoring of test files unless required to fix violations

## Files Modified

| File | Change |
|------|--------|
| `package.json` | Add `eslint-plugin-playwright` devDependency |
| `package-lock.json` | Updated by npm install |
| `eslint.config.js` | Add playwright plugin import, modify tests block, add no-console to browser block |
| `tests/**/*.js` | Fix any violations (if any) |
