# Code Quality Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three independent code quality improvements — BACKLOG Origin path validation hook, check-links callback removal, filterProjects JSDoc update.

**Architecture:** Pre-commit hook script (Node CJS) validates BACKLOG.md Origin paths. Two surgical edits to existing files (check-links.js, main.js). No new dependencies.

**Tech Stack:** Node.js (CJS scripts), husky pre-commit hook, JSDoc

**Spec:** `docs/superpowers/specs/2026-04-16_code-quality-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/validate-backlog-paths.js` | Create | Origin path validator script |
| `.husky/pre-commit` | Modify | Add conditional validator call |
| `docs/planning/BACKLOG.md` | Modify | Fix 3 Origin paths, mark 3 items complete |
| `scripts/check-links.js` | Modify | Remove `checkBatch`, inline into `main()` |
| `js/main.js` | Modify | Update `filterProjects()` JSDoc |
| `docs/archive/plans/` | Move 3 files into | Archive stale plan files |

---

### Task 1: Create BACKLOG Origin Path Validator (3 SP)

**Files:**
- Create: `scripts/validate-backlog-paths.js`
- Modify: `.husky/pre-commit`
- Modify: `docs/planning/BACKLOG.md`
- Move: 3 plan files from `docs/planning/plans/` → `docs/archive/plans/`

- [ ] **Step 1: Create `scripts/validate-backlog-paths.js`**

```js
/**
 * Validates that BACKLOG.md Origin paths point to docs/archive/plans/,
 * not docs/planning/plans/. Run by pre-commit hook when BACKLOG.md is staged.
 * Exits non-zero on violation (blocks commit).
 */

const fs = require('fs');
const path = require('path');

const BACKLOG_PATH = path.join(__dirname, '..', 'docs', 'planning', 'BACKLOG.md');

const lines = fs.readFileSync(BACKLOG_PATH, 'utf8').split('\n');
const violations = [];

lines.forEach((line, index) => {
  if (line.includes('**Origin**') && line.includes('docs/planning/plans/')) {
    violations.push({ line: index + 1, content: line.trim() });
  }
});

if (violations.length > 0) {
  console.error('\x1b[31mBACKLOG Origin path validation failed:\x1b[0m\n');
  violations.forEach((v) => {
    console.error(`  Line ${v.line}: ${v.content}`);
  });
  console.error(
    '\n\x1b[33mOrigin paths must point to docs/archive/plans/, not docs/planning/plans/.\x1b[0m'
  );
  console.error('Fix: Replace "docs/planning/plans/" with "docs/archive/plans/" in the Origin lines above.\n');
  process.exit(1);
}
```

- [ ] **Step 2: Test the validator against current broken BACKLOG.md**

Run: `node scripts/validate-backlog-paths.js`

Expected: Exit 1 with 3 violations (lines 169, 284, 492).

- [ ] **Step 3: Move 3 stale plan files to archive**

The 3 Origin paths reference plans that were never archived. Move them so the corrected paths are valid:

Run:
```bash
git mv docs/planning/plans/2026-02-03_perf-003-bundle-css.md docs/archive/plans/2026-02-03_perf-003-bundle-css.md
git mv docs/planning/plans/2026-02-03_feat-003-enhanced-filter-animations.md docs/archive/plans/2026-02-03_feat-003-enhanced-filter-animations.md
git mv docs/planning/plans/2026-02-16_perf-006-inline-critical-css.md docs/archive/plans/2026-02-16_perf-006-inline-critical-css.md
```

- [ ] **Step 4: Fix 3 broken Origin paths in BACKLOG.md**

In `docs/planning/BACKLOG.md`, make these 3 replacements:

Line 169: `**Origin**: docs/planning/plans/2026-02-03_perf-003-bundle-css.md`
→ `**Origin**: docs/archive/plans/2026-02-03_perf-003-bundle-css.md`

Line 284: `**Origin**: docs/planning/plans/2026-02-03_feat-003-enhanced-filter-animations.md`
→ `**Origin**: docs/archive/plans/2026-02-03_feat-003-enhanced-filter-animations.md`

Line 492: `**Origin**: docs/planning/plans/2026-02-16_perf-006-inline-critical-css.md`
→ `**Origin**: docs/archive/plans/2026-02-16_perf-006-inline-critical-css.md`

- [ ] **Step 5: Re-run validator to confirm clean**

Run: `node scripts/validate-backlog-paths.js`

Expected: Exit 0, no output (clean).

- [ ] **Step 6: Add validator to pre-commit hook**

Modify `.husky/pre-commit` from:
```
npx lint-staged
```

To:
```
npx lint-staged
git diff --cached --name-only | grep -q 'BACKLOG.md' && node scripts/validate-backlog-paths.js
```

- [ ] **Step 7: Test the hook end-to-end**

Stage BACKLOG.md and run lint-staged manually to simulate:

Run: `npx lint-staged`

Expected: lint-staged passes (no JS/CSS files staged). Then manually verify the hook line works:

Run: `echo "test" | git diff --cached --name-only | grep -q 'BACKLOG.md' && echo "would run validator" || echo "BACKLOG not staged, skip"`

Expected: "BACKLOG not staged, skip" (since BACKLOG.md changes aren't staged yet).

- [ ] **Step 8: Run ESLint on new script**

Run: `npx eslint scripts/validate-backlog-paths.js`

Expected: No errors (file is in the `scripts/` Node CJS environment block).

- [ ] **Step 9: Commit**

```bash
git add scripts/validate-backlog-paths.js .husky/pre-commit docs/planning/BACKLOG.md docs/planning/plans/ docs/archive/plans/
git commit -m "feat: Add pre-commit BACKLOG Origin path validation

Recurring bug in PRs #51, #56, #57, #59, #62: Origin paths in
BACKLOG.md point to docs/planning/plans/ instead of docs/archive/plans/.
New pre-commit hook catches this before commit.

Also fixes 3 existing broken paths and archives 3 stale plan files."
```

---

### Task 2: Remove `checkBatch` Callback Indirection (1 SP)

**Files:**
- Modify: `scripts/check-links.js:133-149`

- [ ] **Step 1: Remove `checkBatch` function and inline into `main()`**

In `scripts/check-links.js`, delete lines 133-141 (the `checkBatch` function) and replace line 149 (`const results = await checkBatch(urls, checkUrl);`) with the inlined loop:

Replace the `checkBatch` function (lines 133-141) and its call in `main()` (line 149). The result in `main()` should be:

```js
async function main() {
  const urlSources = extractUrls();
  const urls = [...urlSources.keys()];

  console.log(`Checking ${urls.length} links...\n`);

  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
  }

  let passed = 0;
  let failed = 0;
```

- [ ] **Step 2: Run ESLint on modified file**

Run: `npx eslint scripts/check-links.js`

Expected: No errors.

- [ ] **Step 3: Run link checker to verify behavior unchanged**

Run: `node scripts/check-links.js`

Expected: All links pass (same output as before — URLs checked concurrently in batches of 5, pass/fail counts printed).

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.js
git commit -m "refactor: Inline checkBatch into main() in check-links.js

Remove unnecessary callback indirection — checkBatch only ever received
checkUrl as its callback parameter."
```

---

### Task 3: Update `filterProjects()` JSDoc (1 SP)

**Files:**
- Modify: `js/main.js:256-263`

- [ ] **Step 1: Update the JSDoc block**

In `js/main.js`, replace lines 256-263:

```js
  /**
   * Filter projects by category with staggered animations
   * - Parallel hide/show animations for smooth transitions
   * - Stagger delay creates choreographed effect
   * - Respects prefers-reduced-motion
   * - Handles rapid clicks gracefully (cancels pending animations)
   * @param {string} category - Category to filter by, or "all" to show all
   */
```

With:

```js
  /**
   * Filter projects by category with staggered animations
   * - Parallel hide/show animations for smooth transitions
   * - Stagger delay creates choreographed effect
   * - Respects prefers-reduced-motion
   * - Handles rapid clicks gracefully (cancels pending animations)
   * - Updates currentFilter immediately (before animation) so callers always
   *   see the intended state, not stale pre-animation state (BUG-004)
   * @param {string} category - Category to filter by, or "all" to show all
   */
```

- [ ] **Step 2: Run ESLint on modified file**

Run: `npx eslint js/main.js`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "docs: Document eager currentFilter update in filterProjects JSDoc

Add BUG-004 contract: currentFilter is set before animation starts so
activateFilter() guard and toggle-to-reset see intended state."
```

---

### Task 4: Mark BACKLOG Items Complete

**Files:**
- Modify: `docs/planning/BACKLOG.md`

- [ ] **Step 1: Mark 3 backlog items as complete**

In `docs/planning/BACKLOG.md`, mark these items with `[x]` and add completion notes:

Line 790 (under "From Code Quality & Lint Fixes Code Review"):
`- [ ] Automate BACKLOG Origin path validation`
→ `- [x] ~~Automate BACKLOG Origin path validation~~ *(completed 2026-04-16, quality/code-quality — pre-commit hook in scripts/validate-backlog-paths.js)*`

Line 809 (under "From Automated Link Checking Challenge"):
`- [ ] Replace `checkBatch` callback parameter with direct `checkUrl` call`
→ `- [x] ~~Replace `checkBatch` callback parameter with direct `checkUrl` call~~ *(completed 2026-04-16, quality/code-quality — inlined into main())*`

Line 738 (under "From BUG-004 Code Review"):
`- [ ] Update `filterProjects()` JSDoc to document eager `currentFilter` update contract`
→ `- [x] ~~Update `filterProjects()` JSDoc to document eager `currentFilter` update contract~~ *(completed 2026-04-16, quality/code-quality)*`

- [ ] **Step 2: Update BACKLOG "Last Updated" header**

Line 3: `**Last Updated**: 2026-04-16 (Test Robustness Code Review)`
→ `**Last Updated**: 2026-04-16 (Code Quality batch)`

- [ ] **Step 3: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs: Mark 3 Code Quality backlog items complete"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run full lint suite**

Run: `npm run lint`

Expected: No errors across CSS and JS.

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: All tests pass (no behavioral changes in this batch).

- [ ] **Step 3: Verify git log looks clean**

Run: `git log --oneline -6`

Expected: 4 task commits + 1 spec commit on `quality/code-quality` branch.
