# BUG-004: Filter Toggle-to-Reset Race Condition — Design Spec

**Date**: 2026-03-22
**Status**: Approved
**Branch**: `fix/bug-004-filter-race-condition`

---

## Problem Statement

The filter system has a race condition during rapid clicks that causes two bugs:

1. **Toggle-to-reset replay**: Click a filter -> click it again quickly (toggle-to-reset to "all") -> immediately click the same filter again -> stays on "all" instead of activating the filter
2. **Cross-filter rapid clicks**: Rapid-clicking between different filters causes incorrect state transitions — a previous filter's toggle-to-reset fires late, resetting to "all" unexpectedly

### Root Cause

`currentFilter` is only updated at the END of the animation cycle (~910ms after click) inside a cleanup timeout. During that window:

- The toggle-to-reset check (`filter === currentFilter`) sees a stale value, misrouting clicks
- `cancelFilterAnimations()` clears the cleanup timeout that would have updated `currentFilter`, so state can stay stale indefinitely across rapid clicks
- `resetFilter()` has no `isAnimating` guard, allowing parallel animation cycles

### Affected Code

| Location | Issue |
|----------|-------|
| `js/main.js` line 383 | `currentFilter = category` inside cleanup timeout (delayed ~910ms) |
| `js/main.js` line 447 | `activateFilter` guard uses `!isAnimating` escape hatch for stale state |
| `js/main.js` line 429 | `resetFilter()` has no animation guard |
| `js/main.js` line 488 | Toggle-to-reset checks stale `currentFilter` |
| `js/main.js` lines 236-242 | `cancelFilterAnimations()` clears cleanup timeout unconditionally |

---

## Chosen Approach: Eager `currentFilter` Update

**Decision**: Update `currentFilter` immediately when the user clicks (before animation starts), rather than after animation completes.

### Alternatives Considered

| Approach | Description | Verdict |
|----------|-------------|---------|
| **A: Eager update** (chosen) | Move `currentFilter` assignment to start of `filterProjects()` | Simplest fix, eliminates stale state at source |
| **B: Separate `targetFilter`** | New variable for intent, keep `currentFilter` for visual state | Two variables tracking same thing, maintenance trap |
| **C: Debounce/queue clicks** | Drop or queue clicks during animation | Bad UX (C1: lost clicks) or unnecessary complexity (C2: queue logic) |

**Why A**: The bug is fundamentally "stale state during animation." Approach A eliminates stale state at the source with minimal code change. All consumers of `currentFilter` (toggle-to-reset, `activateFilter` guard, `resetFilter` guard, `updateHash`, `applyHashFilter`) need the *intended* filter, not the visual state.

---

## Design

### 1. State Management Fix

Move `currentFilter = category` from the cleanup timeout (end of animation) to the **start** of `filterProjects()` (before exit animation begins).

After this change, `currentFilter` always reflects the user's last-clicked filter, regardless of animation state. `cancelFilterAnimations()` clearing old cleanup timeouts no longer causes stale state because `currentFilter` was already updated before any timeouts were created.

### 2. Guard Changes

**`resetFilter()`**: Add animation cancellation before starting reset. Currently has no guard, so a toggle-to-reset during animation starts a second parallel animation cycle. Fix: call `cancelFilterAnimations()` at the top (or let `filterProjects` handle it, since it already calls `cancelFilterAnimations` at line 270).

**`activateFilter()` guard (line 447)**: Simplify from `if (category === currentFilter && !isAnimating) return;` to `if (category === currentFilter) return;`. The `!isAnimating` escape hatch existed because `currentFilter` was stale during animation. With eager update, if you already requested this filter, it's a no-op regardless of animation state.

### 3. Cleanup Timeout Simplification

The cleanup timeout at end of animation currently sets:
- `currentFilter = category` — **remove** (already set at start)
- `isAnimating = false` — **keep**
- Animation class cleanup — **keep**

### 4. Test Updates

**`rapid-clicks.spec.js` test#3** (double-click same filter): Currently accepts both outcomes (`[iot, all]`). Change to assert deterministic toggle-to-reset — should always reset to "all".

**`rapid-clicks.spec.js` test#2** (mid-exit interrupt): Replace `waitForTimeout(duration * 0.3)` with DOM state polling (wait for `.project-card--filtering-out` class). Fixes Firefox flakiness per BACKLOG item.

**`toggle-behavior.spec.js`**: Add rapid variant that clicks during animation to verify toggle-to-reset works mid-animation.

### 5. Scope Boundary

**NOT included**:
- Debouncing live region announcements (A11Y-001 backlog item) — separate concern
- Animation choreography changes — exit->settle->entrance flow unchanged
- CSS timing variables — no changes

---

## Edge Cases

1. **Click filter A -> click filter A during exit animation**: `currentFilter` is already "A" (eager update), so toggle-to-reset fires immediately -> `resetFilter()` cancels A's animation, starts "all" animation. Correct.

2. **Click filter A -> click filter B during exit animation**: `currentFilter` is "A", click is "B", not equal -> `activateFilter("B")` fires, cancels A's animation, starts B's animation with `currentFilter = "B"`. Correct.

3. **Click filter A -> click filter A -> click filter A (triple rapid)**: First click sets `currentFilter = "A"`. Second sees `currentFilter === "A"` -> toggle-to-reset -> `currentFilter = "all"`. Third sees `currentFilter === "all"` -> `activateFilter("A")` -> `currentFilter = "A"`. Correct.

4. **Browser back/forward during animation**: `applyHashFilter()` calls `activateFilter()` which checks `currentFilter` (now eager). If hash matches current intent, no-op. If different, new filter starts. Correct.

5. **`popstate` event fires mid-animation**: Same as edge case 4. `cancelFilterAnimations()` is called inside `filterProjects()`, so old animation is properly cancelled before new one starts.

---

## Success Criteria

- [ ] Toggle-to-reset works correctly during rapid clicks (deterministic, not timing-dependent)
- [ ] Cross-filter rapid clicks reach correct final state
- [ ] `rapid-clicks.spec.js` test#3 asserts deterministic outcome (not either/or)
- [ ] `rapid-clicks.spec.js` test#2 uses DOM state polling instead of percentage-based timing
- [ ] All existing filter tests pass unchanged (except the two updated tests)
- [ ] No visual change to animation choreography
- [ ] Lighthouse scores unchanged
