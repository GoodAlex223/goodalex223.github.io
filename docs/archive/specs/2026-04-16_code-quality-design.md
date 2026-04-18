# Code Quality Batch — Design Spec

**Date**: 2026-04-16
**Branch**: `quality/code-quality`
**Source**: WEEKLY.md Thursday — Code Quality [batch] (5 SP)
**Domain**: JS Logic

---

## Overview

Three independent code quality improvements addressing accumulated code review findings and recurring process bugs.

---

## Task 1: Automate BACKLOG Origin Path Validation (3 SP)

**Problem**: BACKLOG.md `**Origin**:` lines frequently reference `docs/planning/plans/` instead of `docs/archive/plans/` after task completion. This same bug has recurred in PRs #51, #56, #57, #59, and #62 despite repeated code review flags.

**Solution**: Pre-commit hook script that blocks commits when staged `BACKLOG.md` contains Origin paths pointing to `docs/planning/plans/`.

### Design

**New file**: `scripts/validate-backlog-paths.js` (Node CJS, consistent with other scripts in `scripts/`)

- Reads `BACKLOG.md` from disk
- Scans for lines matching `**Origin**:` that contain `docs/planning/plans/`
- Reports offending lines with line numbers
- Exits 1 on match (blocks commit), exits 0 on clean
- Clear error message explaining the fix: paths should point to `docs/archive/plans/`

**Hook integration**: `.husky/pre-commit` adds a conditional check:

```
# Validate BACKLOG Origin paths if BACKLOG.md is staged
git diff --cached --name-only | grep -q 'BACKLOG.md' && node scripts/validate-backlog-paths.js
```

Runs after `npx lint-staged` (existing line). Only triggers when `BACKLOG.md` is in the staging area — zero overhead for normal code commits.

**Scope exclusions**:
- Only validates `**Origin**:` lines — other mentions of `docs/planning/plans/` (e.g., the backlog item on line 588 documenting the stale plan copy issue, or line 790 documenting this very automation task) are intentional and must not trigger false positives
- Does not validate other documentation files (TODO.md, DONE.md) — Origin paths only appear in BACKLOG.md

**Pre-existing fixes**: The 3 currently broken Origin paths in BACKLOG.md (lines 169, 284, 492) will be corrected so the hook passes from day one. These reference plans that were archived long ago but whose Origin lines were never updated.

### ESLint

The new script file lives in `scripts/` and is already covered by the existing ESLint Node CJS environment block — no config changes needed.

---

## Task 2: Remove `checkBatch` Callback Indirection (1 SP)

**Problem**: `checkBatch(urls, checkFn)` in `scripts/check-links.js` accepts a callback parameter but is only ever called with `checkUrl`. The indirection adds complexity without enabling testability or reuse.

**Solution**: Inline the batching logic directly into `main()` and delete the `checkBatch` function.

### Design

**File**: `scripts/check-links.js`

Remove `checkBatch` function (lines 133-141). Replace `main()` call site (line 149) with inlined loop:

```js
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  const batchResults = await Promise.all(batch.map(checkUrl));
  results.push(...batchResults);
}
```

No behavioral change. Same concurrency model, same ordering.

---

## Task 3: Update `filterProjects()` JSDoc (1 SP)

**Problem**: The `filterProjects()` JSDoc in `js/main.js` (lines 256-263) documents animations, rapid click handling, and reduced motion support — but omits the eager `currentFilter` update contract introduced by BUG-004.

**Solution**: Add a JSDoc line documenting that `currentFilter` is updated immediately before animation starts (not after completion), and why this matters.

### Design

**File**: `js/main.js`

Update the JSDoc block at lines 256-263 to add:

```
 * - Updates currentFilter immediately (before animation) so callers always
 *   see the intended state, not stale pre-animation state (BUG-004)
```

The inline comment at lines 272-274 already explains the implementation detail. The JSDoc addition surfaces this as part of the function's public contract — callers (specifically `activateFilter()` and `resetFilter()`) depend on the state being eager.

---

## Testing Strategy

- **Task 1**: Manual test — stage BACKLOG.md with a bad Origin path, verify commit is blocked with clear error. Stage with clean paths, verify commit proceeds. Also run `npm test` to ensure no regressions.
- **Task 2**: Run `npm run check-links` to verify link checking still works with inlined logic. Run `npm run lint:js` to verify ESLint passes.
- **Task 3**: Run `npm run lint:js` to verify JSDoc syntax is valid. No behavioral change — documentation only.

---

## BACKLOG Items to Mark Complete

After implementation:
- Line 790: "Automate BACKLOG Origin path validation"
- Line 809: "Replace `checkBatch` callback parameter with direct `checkUrl` call"
- Line 738: "Update `filterProjects()` JSDoc to document eager `currentFilter` update contract"

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/validate-backlog-paths.js` | New — Origin path validator |
| `.husky/pre-commit` | Add conditional validator call |
| `docs/planning/BACKLOG.md` | Fix 3 broken Origin paths, mark 3 items complete |
| `scripts/check-links.js` | Remove `checkBatch`, inline into `main()` |
| `js/main.js` | Update `filterProjects()` JSDoc |
