# QUALITY-009: ESLint Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `eslint-plugin-playwright` for test-specific linting and `no-console` rule for browser code to strengthen the ESLint configuration.

**Architecture:** Two-entry flat config pattern for the Playwright plugin (preset entry + overrides entry), plus a file-level exception for SEO cross-tag tests. `no-console: "error"` added to the existing browser code block.

**Tech Stack:** ESLint v10 (flat config, CJS), eslint-plugin-playwright v2.x, @playwright/test

**Spec:** `docs/superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modified | Add `eslint-plugin-playwright` devDependency |
| `eslint.config.js` | Modified | Import playwright plugin, restructure tests block, add no-console, add SEO override |
| test files (if any) | Modified | Fix any lint violations surfaced by new rules |

---

### Task 1: Install eslint-plugin-playwright

**Files:**
- Modify: `package.json` (devDependencies)
- Modify: `package-lock.json` (auto-generated)

- [ ] **Step 1: Install the dependency**

Run:
```bash
npm install -D eslint-plugin-playwright@^2
```

Expected: Clean install, `eslint-plugin-playwright` added to `devDependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

Run:
```bash
node -e "require('eslint-plugin-playwright').configs['flat/recommended']" && echo "OK"
```

Expected: Prints `OK` — confirms the `flat/recommended` export exists (v2+ requirement).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add eslint-plugin-playwright dependency"
```

---

### Task 2: Add `no-console` rule to browser code block

**Files:**
- Modify: `eslint.config.js:11-23` (browser script block)

- [ ] **Step 1: Add the rule**

In `eslint.config.js`, add `"no-console": "error"` to the browser code block's `rules` object. The block should become:

```js
  // Browser script: js/main.js (ES6+, non-module)
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: globals.browser,
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "error",
    },
  },
```

- [ ] **Step 2: Run lint to verify no violations**

Run:
```bash
npx eslint "js/**/*.js"
```

Expected: Clean output, exit code 0. There are zero `console.*` calls in `js/main.js` today.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "feat(lint): add no-console error rule for browser code"
```

---

### Task 3: Add Playwright plugin to ESLint config

**Files:**
- Modify: `eslint.config.js:1-2` (imports), `eslint.config.js:39-53` (tests block)

This is the most complex change. The existing single tests block is replaced with a two-entry pattern (preset + overrides) plus a third entry for the SEO file-level exception.

- [ ] **Step 1: Add the import**

At the top of `eslint.config.js`, after the existing `require` lines, add:

```js
const playwright = require("eslint-plugin-playwright");
```

The imports section should be:

```js
const js = require("@eslint/js");
const globals = require("globals");
const playwright = require("eslint-plugin-playwright");
```

- [ ] **Step 2: Replace the tests block with three entries**

Replace the existing Playwright test block (lines 39-53):

```js
  // Playwright test files (Node.js, ESM)
  // Browser globals (document, getComputedStyle, etc.) included because
  // page.evaluate() callbacks execute in browser context.
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
    },
  },
```

With these three entries:

```js
  // Playwright test files: recommended preset (registers plugin + base rules)
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.js"],
  },

  // Playwright test files: project overrides (languageOptions, custom rules)
  // Browser globals (document, getComputedStyle, etc.) included because
  // page.evaluate() callbacks execute in browser context.
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
        "assertFunctionNames": ["checkAccessibility"],
      }],
      "playwright/prefer-web-first-assertions": "error",
    },
  },

  // SEO tests: getAttribute() needed for cross-tag value comparison
  {
    files: ["tests/seo/**/*.js"],
    rules: {
      "playwright/prefer-web-first-assertions": "off",
    },
  },
```

- [ ] **Step 3: Run lint on all test files**

Run:
```bash
npx eslint "tests/**/*.js"
```

Expected: Clean output, exit code 0. If violations appear, note them — they'll be fixed in Task 4.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "feat(lint): add eslint-plugin-playwright with recommended preset

Two-entry pattern: preset registers plugin + base rules, override entry
adds project languageOptions and custom rules (expect-expect with
assertFunctionNames, prefer-web-first-assertions). SEO tests exempted
from prefer-web-first-assertions (cross-tag comparison pattern)."
```

---

### Task 4: Fix any lint violations

**Files:**
- Modify: any test files flagged by the new rules

- [ ] **Step 1: Run full lint**

Run:
```bash
npm run lint:js
```

Expected: Clean output, exit code 0. If there are violations, proceed to Step 2. If clean, skip to Step 4.

- [ ] **Step 2: Fix violations (if any)**

For each violation:
- `playwright/expect-expect`: If a test delegates all assertions to a helper not in `assertFunctionNames`, add the helper name to the config. If the test genuinely has no assertions, add one.
- `playwright/prefer-web-first-assertions`: Rewrite `getAttribute()` + `expect().toBe()` to `expect(locator).toHaveAttribute()` where possible. For cross-tag comparisons (already handled by SEO override), no fix needed.
- `playwright/no-conditional-in-test`: Remove conditionals from tests — tests should have deterministic paths.
- Other rules: Fix according to rule documentation at `https://github.com/playwright-community/eslint-plugin-playwright#rules`.

- [ ] **Step 3: Commit fixes (if any)**

```bash
git add -A
git commit -m "fix(lint): resolve eslint-plugin-playwright violations"
```

- [ ] **Step 4: Verify full lint passes**

Run:
```bash
npm run lint:js
```

Expected: Clean output, exit code 0. Zero errors, zero warnings.

---

### Task 5: Verify tests still pass

**Files:** None modified — verification only.

- [ ] **Step 1: Run the full test suite**

Run:
```bash
npm test
```

Expected: All 461+ tests pass. Lint changes are config-only and should not affect runtime behavior.

- [ ] **Step 2: Verify lint-staged works**

Create a temporary test to confirm lint-staged catches violations via husky:

Run:
```bash
npx lint-staged --diff="HEAD~1"
```

Expected: Clean output — staged JS files pass ESLint.

- [ ] **Step 3: Final commit (if any remaining changes)**

If any files were modified during verification, commit them. Otherwise, skip.

---

### Task 6: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md` (JS Linting section, ESLint config description)

- [ ] **Step 1: Update the JS Linting description**

In `CLAUDE.md`, find the **JS Linting** paragraph under **Code Conventions** and update it to mention the Playwright plugin and `no-console` rule. The updated text should reflect:
- `eslint-plugin-playwright` with `flat/recommended` preset for `tests/**/*.js`
- `no-console: "error"` for `js/**/*.js`
- SEO test override for `prefer-web-first-assertions`

Also update the **ESLint config** description in the **Architecture** section where it says "ESLint v9 flat config" — the project uses ESLint v10.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with eslint-plugin-playwright and no-console"
```
