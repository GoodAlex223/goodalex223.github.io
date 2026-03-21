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
| `no-console` level | `"error"` with no allowed methods | Zero `console.*` calls exist today; `"error"` ensures CI lint gate catches violations (ESLint exits 0 on warnings-only). Portfolio site has no runtime error reporting needs |
| `no-console` in tests | Not applied | Test files may use console for debugging during development; Playwright has its own logging |

## Changes

### 1. New Dependency

```bash
npm install -D eslint-plugin-playwright@^2
```

- Package: `eslint-plugin-playwright` (v2.x — v2+ required for `flat/recommended` export)
- Purpose: Playwright-specific ESLint rules for `tests/**/*.js`

### 2. ESLint Config Modifications

**File**: `eslint.config.js`

#### Browser code block (`js/**/*.js`)

Add `no-console` rule:

```js
rules: {
  "no-var": "error",
  "prefer-const": "error",
  "no-console": "error",
},
```

#### Playwright test block (`tests/**/*.js`)

Integrate `eslint-plugin-playwright` recommended preset and cherry-pick `prefer-web-first-assertions`:

```js
const playwright = require("eslint-plugin-playwright");

// Playwright test files: recommended preset (registers plugin + base rules)
{
  ...playwright.configs["flat/recommended"],
  files: ["tests/**/*.js"],
},

// Playwright test files: project overrides (languageOptions, custom rules)
{
  files: ["tests/**/*.js"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    globals: { ...globals.node, ...globals.browser },
  },
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    "playwright/expect-expect": ["error", {
      "assertFunctionNames": ["checkAccessibility"]
    }],
    "playwright/prefer-web-first-assertions": "error",
  },
},
```

**Two-entry pattern**: The first entry spreads `flat/recommended` to register the `playwright` plugin and its base rules, scoped to `tests/**/*.js`. The second entry layers our project overrides on top — `languageOptions` (browser globals for `page.evaluate()`) and custom rules. This avoids the anti-pattern of spreading and immediately overwriting keys in a single object.

#### SEO test file override (`tests/seo/**/*.js`)

Disable `prefer-web-first-assertions` for SEO tests that compare attribute values across locators:

```js
// SEO tests: getAttribute() needed for cross-tag value comparison
{
  files: ["tests/seo/**/*.js"],
  rules: {
    "playwright/prefer-web-first-assertions": "off",
  },
},
```

#### No changes to

- `scripts/**/*.js` block — build scripts keep unrestricted `console.*`
- `ignores` block — unchanged
- `js.configs.recommended` — unchanged (applies to all files)

### 3. Fix Violations

**Expected violations**: Zero or minimal.

- `js/main.js`: No `console.*` calls exist today
- `tests/**/*.js`: No `console.*` calls; test patterns generally follow Playwright best practices

**Known patterns requiring configuration**:

1. **`expect-expect` + `checkAccessibility()` delegation**: The `checkAccessibility()` helper in `tests/utils/axe-helper.js` delegates `expect()` calls outside the test body. The `expect-expect` rule is configured with `assertFunctionNames: ["checkAccessibility"]` to recognize this delegation pattern.

2. **`prefer-web-first-assertions` + cross-tag comparison tests**: `tests/seo/meta-tags.spec.js` uses `getAttribute("content")` to fetch two locator values and compare them (e.g., `og:title` must equal `twitter:title`). This cannot be rewritten with `toHaveAttribute()` because that matcher takes a literal value, not another locator's attribute. Fix: add a file-level override in `eslint.config.js` to disable `playwright/prefer-web-first-assertions` for `tests/seo/**/*.js` (SEO structural tests, not UI interaction tests where auto-retry matters).

If additional violations surface from Playwright plugin rules, fix them inline in the affected test files.

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
