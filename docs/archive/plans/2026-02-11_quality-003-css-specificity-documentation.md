# Plan: QUALITY-003 — Add CSS Specificity Documentation

**Task**: Add comment block in `components.css` explaining the specificity hierarchy between scroll and filter animation systems
**Priority**: Medium
**Status**: Complete
**Date**: 2026-02-11

---

## 1. Goal

Document the CSS cascade order dependency between scroll animations and filter animations in `components.css` to prevent future developers from reordering sections and re-introducing BUG-003.

## 2. Approach

**Chosen**: Replace existing 1-line header comment with expanded structured table format (~22 lines).

**Approaches Considered**:
1. **Structured table in filter header (chosen)** — Scannable specificity values at a glance, replaces existing header. Answers "which selectors conflict and why?" without reading prose.
2. **Prose warning format** — Explains the dependency in sentences. More readable but less scannable for quick reference.
3. **Separate block above both sections** — Adds context before either section. Risk of being skipped since it's not co-located with the filter selectors.

**Decision**: Structured table replaces the existing filter header comment. Co-location with the filter selectors ensures developers see the warning when editing.

## 3. Implementation Details

### Changes Made
- **File**: `css/components.css` (lines 475-496)
- **Action**: Replaced 4-line header comment with 22-line documentation block
- **Content**: All 9 selectors from both animation systems with specificity values, cascade order explanation, and BUG-003 reference

### Selectors Documented
| Selector | Specificity | System |
|----------|-------------|--------|
| `[data-animate]` | (0,1,0) | Scroll base |
| `.project-card[data-animate]` | (0,2,0) | Scroll combined transitions |
| `.skill-group[data-animate]` | (0,2,0) | Scroll combined transitions |
| `[data-animate].is-visible` | (0,2,0) | Scroll visible |
| `.project-card.project-card--filtering-out` | (0,2,0) | Filter exit |
| `.project-card.project-card--filtering-in` | (0,2,0) | Filter entrance |
| `.project-card.project-card--hidden` | (0,2,0) | Filter hidden |
| `.project-card.project-card--filtering-in.is-filtering` | (0,3,0) | Filter entrance end |

## 4. Key Discoveries

- Six selectors share specificity (0,2,0), making cascade order the deciding factor for which styles win when both systems apply to the same element.
- The combined transition selectors (`.project-card[data-animate]`, `.skill-group[data-animate]`) don't conflict on `opacity`/`transform` properties but are included for completeness since they share the (0,2,0) specificity tier.

## 5. Future Improvements

1. **Stylelint rule for section ordering** — A custom Stylelint rule could enforce that filter animation selectors always appear after scroll animation selectors in `components.css`, catching reordering at lint time rather than runtime (IDEA — tracks with TEST-003 Stylelint setup)
2. **CSS layers for explicit priority** — When browser support allows, `@layer scroll, filter` could replace cascade-order dependency with explicit layer priority, eliminating the source-order constraint entirely (IDEA — future CSS modernization)

---

### Execution Log

#### 2026-02-11 — PHASE: Planning
- Goal understood: Document CSS specificity hierarchy to prevent BUG-003 regression
- Approach chosen: Structured table in filter header comment
- Risks identified: None significant (documentation-only change)

#### 2026-02-11 — PHASE: Implementation
- Explored codebase with 2 parallel agents (CSS hierarchy + BUG-003 history)
- Read components.css, variables.css, DONE.md for exact selector details
- Implemented structured table with all 9 selectors
- Build passes, 137/138 tests pass (1 pre-existing WebKit flaky test)

#### 2026-02-11 — PHASE: Quality Review
- Code reviewer verified all specificity values are correct
- Added `.project-card[data-animate]` and `.skill-group[data-animate]` per reviewer suggestion for completeness

#### 2026-02-11 — PHASE: Complete
- Final approach: 22-line structured comment block with specificity table
- Tests passing: 137/138 (1 pre-existing flaky WebKit test, unrelated)
- User approval: Received
