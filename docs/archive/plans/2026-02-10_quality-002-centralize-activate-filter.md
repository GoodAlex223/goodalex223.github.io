# QUALITY-002: Centralize activateFilter() Function

**Status**: Complete
**Branch**: quality/002-centralize-activate-filter
**Created**: 2026-02-10

---

## 1. Problem Statement

Filter activation logic was duplicated across 2 code paths in `js/main.js`:
- **Click handler** (lines 467-469): `setActiveButton()` → `filterProjects()` → `updateHash()`
- **applyHashFilter()** (lines 227-236): `setActiveButton()` → conditional focus → `filterProjects()` (no hash update)

This duplication risked future desync bugs (similar to BUG-002 tabindex desync).

## 2. Approach Chosen

**Options object with full centralization** — `activateFilter(category, { shouldUpdateHash, conditionalFocus })`

Alternatives considered:
1. ~~Separate functions~~ — Doesn't solve duplication
2. ~~Boolean parameter~~ — Less readable than named options
3. **Options object** — Explicit control, handles both paths cleanly

## 3. Implementation

### Changes to `js/main.js`

1. **Added `activateFilter()` function** (after `resetFilter()`):
   - Guard clause: `if (category === currentFilter && !isAnimating) return`
   - `!isAnimating` check prevents false guard during rapid clicks (stale `currentFilter`)
   - Options: `shouldUpdateHash` (default true), `conditionalFocus` (default false)
   - Queries DOM for target button, validates existence
   - Conditional focus only when user already in toolbar

2. **Simplified click handler**: 3 lines → `activateFilter(filter)`

3. **Simplified `applyHashFilter()`**: 12 lines → `activateFilter(category, { shouldUpdateHash: false, conditionalFocus: true })`

### Net change: +33 insertions, -17 deletions (+16 net lines)

## 4. Key Discoveries

- **Guard clause edge case**: `currentFilter` is updated in animation cleanup timeout (line 390), which gets cancelled during rapid clicks. A naive `if (category === currentFilter) return` guard would incorrectly skip reactivation when `currentFilter` is stale. The `!isAnimating` check resolves this.
- **Pre-existing test flakiness**: `rapid-clicks.spec.js:25` ("interrupting animation mid-exit") is timing-sensitive and flaky across Firefox/WebKit — pre-existing, not introduced by this change.

## 5. Future Improvements

1. **Stabilize rapid-click timing tests** — `rapid-clicks.spec.js:25` uses `page.waitForTimeout(duration * 0.3)` which is timing-sensitive across browsers. Consider using DOM state polling instead of percentage-based timing. (IDEA)
2. **Unify resetFilter into activateFilter** — `resetFilter()` could potentially become `activateFilter("all", { manageFocus: true })` to further reduce duplication, but current separation is clearer for the distinct use cases. (IDEA)

## 6. Test Results

- 137-138/138 tests pass (1 pre-existing flaky rapid-click timing test)
- All acceptance criteria met
- Code review: 3 parallel reviewers, no issues >= 80 confidence

### Execution Log

#### 2026-02-10 — PHASE: Planning
- Explored 2 activation paths via code-explorer agents
- Identified guard clause edge case with `isAnimating` flag

#### 2026-02-10 — PHASE: Implementation
- Added `activateFilter()`, simplified 2 call sites
- Fixed guard clause bug discovered during testing (added `!isAnimating`)

#### 2026-02-10 — PHASE: Complete
- All tests passing (except pre-existing flaky rapid-click test)
- Code review passed (3 reviewers, 0 issues)
- Commit: a55865c
