# CI Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 3 independent CI/build issues identified during PR #57 and #59 code reviews.

**Architecture:** Three isolated changes — a CI workflow tweak, an ESLint config update, and a JSDoc addition. No behavioral changes. Each task is independently committable.

**Tech Stack:** GitHub Actions YAML, ESLint flat config (CJS), JSDoc

---

## File Map

| File | Action | Task |
|------|--------|------|
| `.github/workflows/deploy.yml` | Modify (line 85) | Task 1 |
| `eslint.config.js` | Modify (line 7) | Task 2 |
| `scripts/check-links.js` | Modify (line 1) | Task 3 |

---

### Task 1: Add `cache: 'npm'` to check-links CI job

**Files:**
- Modify: `.github/workflows/deploy.yml:82-86`

- [ ] **Step 1: Add cache to setup-node step**

In `.github/workflows/deploy.yml`, the `check-links` job's `Setup Node.js` step (lines 82-86) is currently:

```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
```

Change it to:

```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
```

This matches the other 4 `setup-node` steps (lint, build, test, lighthouse). The cache has no functional effect here since there's no `npm ci` step — this is purely for consistency.

- [ ] **Step 2: Verify YAML is valid**

Run: `node -e "const yaml = require('js-yaml'); yaml.load(require('fs').readFileSync('.github/workflows/deploy.yml', 'utf8')); console.log('Valid YAML')"`

If `js-yaml` isn't available, visually confirm the indentation matches the other `setup-node` blocks (2-space indent under `with:`).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: Add npm cache to check-links job setup-node step

Consistency with the other 4 setup-node steps (lint, build, test,
lighthouse). No functional effect — check-links uses only Node
built-ins and skips npm ci."
```

---

### Task 2: Add remaining root config files to ESLint ignores

**Files:**
- Modify: `eslint.config.js:7`

- [ ] **Step 1: Verify current lint errors on root configs**

Run: `npx eslint lighthouserc.js playwright.config.js postcss.config.js 2>&1 || true`

Expected: 10 errors (1 `no-undef` in `lighthouserc.js`, 6 in `playwright.config.js`, 3 in `postcss.config.js`). These are false positives — the files use `module`, `require`, and `process` which aren't defined in the default ESLint environment.

- [ ] **Step 2: Add the 3 files to ignores array**

In `eslint.config.js`, line 7 currently reads:

```js
  { ignores: ["dist/**", "node_modules/**", "eslint.config.js", "commitlint.config.js"] },
```

Change it to:

```js
  { ignores: ["dist/**", "node_modules/**", "eslint.config.js", "commitlint.config.js", "lighthouserc.js", "playwright.config.js", "postcss.config.js"] },
```

- [ ] **Step 3: Verify the 3 files are now ignored**

Run: `npx eslint lighthouserc.js playwright.config.js postcss.config.js 2>&1 || true`

Expected: No output (0 errors, 0 warnings). ESLint silently skips ignored files.

- [ ] **Step 4: Verify no regressions in main lint targets**

Run: `npm run lint:js`

Expected: Clean pass (exit code 0). Only root config files changed — `js/`, `scripts/`, `tests/` are unaffected.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.js
git commit -m "chore: Add remaining root config files to ESLint ignores

lighthouserc.js, playwright.config.js, postcss.config.js are tool
configs outside the 3 ESLint environments (browser js/, Node scripts/,
Playwright tests/). Without ignoring, they produce 10 false-positive
no-undef errors for module/require/process globals."
```

---

### Task 3: Add file-level JSDoc to check-links.js

**Files:**
- Modify: `scripts/check-links.js:1`

- [ ] **Step 1: Add JSDoc comment**

Add the following at the very top of `scripts/check-links.js` (before the existing `const fs = require('fs');` on line 1):

```js
/**
 * Validates external URLs from index.html and data/projects.json.
 * HEAD-first with GET fallback, 3 retries on 5xx/network errors.
 * LinkedIn domains are skipped (HTTP 999 for all bots).
 * Exits non-zero on any broken link (CI gate).
 */
```

This matches the style of `scripts/serve.js` (short, no `@file` tag, no `@param`/`@returns`).

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint:js`

Expected: Clean pass. The JSDoc comment is valid JS, and `scripts/` files are linted under the Node CJS config.

- [ ] **Step 3: Verify script still runs**

Run: `npm run check-links`

Expected: Script runs and checks all links. The JSDoc comment has no effect on execution.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.js
git commit -m "docs: Add file-level JSDoc to check-links.js

Matches the pattern in scripts/serve.js. Describes purpose, retry
strategy, LinkedIn skip-list, and CI exit-code behavior."
```

---

## Final Verification

- [ ] **Run full lint suite:** `npm run lint`
- [ ] **Verify all 3 commits exist:** `git log --oneline -3`
