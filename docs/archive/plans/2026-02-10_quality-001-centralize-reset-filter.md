# Plan: QUALITY-001 — Centralize resetFilter() Function

**Status**: Complete
**Created**: 2026-02-10
**Branch**: quality/001-centralize-reset-filter

## 1. Goal

Extract duplicated 4-line filter reset sequence into a single `resetFilter()` function to DRY up `js/main.js`.

## 2. Approach

Extract-method refactoring: create `resetFilter()` with internal guard clause, replace both duplicated call sites.

**Alternatives considered**:
- Guard clause in callers (rejected — leads to inconsistent guard logic at call sites)
- No function, just inline comments (rejected — doesn't reduce duplication)

## 3. Changes

**File**: `js/main.js` (only file modified)

1. Added `resetFilter()` function (lines 432-442) with:
   - Internal guard: `if (currentFilter === "all") return`
   - 4 operations: `setActiveButton`, `focus`, `filterProjects`, `updateHash`
2. Simplified toggle-to-reset click handler (line 465): replaced 4 inline calls with `resetFilter()`
3. Simplified Escape key handler (lines 503-506): replaced guard + 4 inline calls with `resetFilter()`

**Net change**: +14 lines added, -11 removed = +3 lines total (function definition overhead)

## 4. Key Discoveries

- Toggle-to-reset handler had its own guard (`filter === currentFilter && filter !== "all"`) making the internal guard technically redundant for that path — but keeping it in `resetFilter()` makes the function self-contained and safe to call from any context
- No other reset locations exist in the codebase (`applyHashFilter` applies arbitrary categories, not specifically "reset")

## 5. Future Improvements

1. **Centralize activateFilter() function** — QUALITY-002 in TODO.md. Same DRY opportunity for the normal filter activation path (click handler lines 467-469 and `applyHashFilter` lines 227-236).
2. **Keyboard shortcut documentation** — Already in BACKLOG.md. Add visible hint showing Escape key resets filter (improves discoverability for keyboard users).

## Execution Log

#### 2026-02-10 — PHASE: Planning
- Goal: DRY up duplicated reset logic in filter system
- Approach: extract-method with internal guard clause (user approved)

#### 2026-02-10 — PHASE: Implementation
- Added resetFilter() function after announceFilterResults()
- Replaced toggle-to-reset call site (line 465)
- Replaced Escape key call site (lines 503-506)

#### 2026-02-10 — PHASE: Verification
- 137/138 Playwright tests passed
- 1 pre-existing flaky test in Firefox (rapid-clicks timing, unrelated)
- Code review: no issues found

#### 2026-02-10 — PHASE: Complete
- Commit: a9aaf4f
- Tests passing: yes (137/138, 1 pre-existing flaky)
- User approval: received
