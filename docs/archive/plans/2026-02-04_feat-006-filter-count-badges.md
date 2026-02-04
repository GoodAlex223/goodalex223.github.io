# FEAT-006: Filter Count Badges

**Status**: Complete
**Priority**: Medium
**Created**: 2026-02-04
**Completed**: 2026-02-04
**Branch**: feat/006-filter-count-badges

---

## 1. Problem Statement

Users see filter buttons ("All", "Backend", "IoT", etc.) but have no indication of how many projects exist in each category before clicking.

## 2. Approach Chosen

**Approach A: Pure JavaScript Injection** -- counts calculated from DOM at page load, injected into button textContent as inline parentheses.

**Alternatives considered:**
1. HTML hardcoded + JS verification -- 3 files changed, manual maintenance
2. HTML data attributes + JS population -- 3 files changed, over-engineered for static site

**Reasoning:** Single file change, counts derived from actual DOM (single source of truth), consistent with existing JS-enhanced static HTML pattern.

## 3. Implementation

### Files Modified
- `js/main.js` -- Added `calculateCategoryCounts()` and `updateButtonLabels()` functions (~41 lines)

### Key Decisions
- **Inline parentheses** over separate badge/chip (simpler, no CSS needed)
- **Include "All" count** showing total projects
- **Static calculation** at page load (no MutationObserver needed)
- **Preserve original casing** by reading button textContent before modification (handles "IoT")
- **aria-label** for clean screen reader output ("Backend, 1 project" instead of "Backend (1)")

### User Decisions
- Display format: inline parentheses
- "All" button: show total count
- Count timing: once at page load

## 4. Testing

### Browser Testing
- All 5 buttons show correct counts: All (7), Backend (1), IoT (3), Web (1), Tools (2)
- Filtering works correctly after count injection
- Toggle-to-reset works (clicking active filter resets to "All")
- URL hash integration intact
- No console errors

### Accessibility Testing
- Screen reader labels: "Backend, 1 project" (clean, no parentheses)
- aria-pressed toggles correctly
- Singular/plural handled ("1 project" vs "3 projects")

### Code Review
- 3 parallel reviewers (simplicity/DRY, bugs/correctness, conventions)
- No issues found at confidence >= 80

## 5. Future Improvements

1. **Animated count transitions** -- When filtering, could animate the count change on the "All" button to reflect visible vs total (e.g., "All (3/7)") -- adds visual feedback but increases complexity
2. **Zero-count button dimming** -- If a category has 0 projects, the button could be visually dimmed or disabled to signal "nothing here" -- improves UX for sparse portfolios

## 6. Key Discoveries

- Button textContent must be read before modification to preserve original casing ("IoT" not "Iot")
- `aria-label` completely replaces accessible name per ARIA spec, so parenthesized text is hidden from screen readers
- Existing filter logic uses `data-filter` attribute (not button text), so textContent changes are safe

---

### Execution Log

#### 2026-02-04 — PHASE: Planning
- Goal: Add project count badges to filter buttons
- Approach chosen: JS-only injection (Approach A)
- Risks: FOC (mitigated by scroll animation delay), screen reader verbosity (mitigated by aria-label)

#### 2026-02-04 — PHASE: Implementation
- Added `calculateCategoryCounts()` and `updateButtonLabels()` to `initProjectFilter()`
- Initialization call placed before `applyHashFilter()` for correct ordering
- Deviation from plan: No -- straightforward implementation

#### 2026-02-04 — PHASE: Sub-Item Complete
- Sub-item: Filter count badge implementation
- **Results obtained**: All 5 buttons display accurate counts with accessible labels
- **Lessons learned**: Reading textContent before modification preserves casing; aria-label overrides accessible name
- **Problems encountered**: None
- **Improvements identified**: Animated count transitions, zero-count button dimming
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-04 — PHASE: Complete
- Final approach: JS-only injection with aria-label
- Tests passing: Yes (browser + code review)
- User approval: Received
