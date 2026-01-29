# FEAT-001: Project Metadata Badges

**Status**: Complete
**Created**: 2026-01-29
**Completed**: 2026-01-29

---

## 1. Goal

Add "last updated" dates and "In Development" status indicators to all project cards. Signals active portfolio maintenance to recruiters.

## 2. Approach

**Pragmatic Blend** architecture — combines semantic HTML (`<footer>`, `<time>`) with card-scoped BEM styles. Single status color variable for all badges (not category-colored). CSS pulse animation on status dot.

### Approaches Considered
1. **Minimal Changes** — No new variables, category-colored status badges, static dot character
2. **Clean Architecture** — Full reusable badge component system, 30+ new variables, 4 pre-built status types
3. **Pragmatic Blend (chosen)** — Best of both: semantic HTML, dedicated status color, pulse animation, footer pinning

### Key Decisions
- Used `<footer>` and `<time datetime="">` semantic elements (valid HTML5 inside `<article>`)
- Single `--color-status-active` color for all "In Development" badges (not category-dependent)
- CSS pulse animation on dot with `prefers-reduced-motion` handling
- `margin-top: var(--space-4)` for footer spacing (not `auto`, since CSS columns layout doesn't provide extra height)
- Theme transitions added to footer and status badge for smooth light/dark switching

## 3. Changes

### Files Modified
| File | Changes |
|------|---------|
| `css/variables.css` | Added `--color-status-active` and `--color-status-active-bg` in 3 theme contexts |
| `css/components.css` | Added flex layout to `.project-card`, footer styles, status badge, dot pulse animation, theme transitions, reduced-motion handling |
| `index.html` | Added `data-updated`, `data-status` attributes + `<footer>` markup to all 7 project cards |
| `CLAUDE.md` | Updated data attributes, component patterns, "Adding New Projects" template |

### Active Projects (data-status="active")
- rating_bot (Backend) — Jan 2026
- E-commerce Prototype (Web) — Jan 2026
- Media Viewer (Tools) — Jan 2026

### Inactive Projects (date only)
- Industrial Rule Indicators (IoT) — Aug 2025
- Automatic Machine Lubrication (IoT) — Jun 2025
- HX711 Multi-Scale System (IoT) — Jul 2025
- SVG Layer Processor (Tools) — Sep 2025

## 4. Key Discoveries

- `margin-top: auto` in flex column does nothing when the container has no fixed height (CSS columns layout). Use explicit spacing instead.
- `<footer>` inside `<article>` is valid HTML5 — the spec explicitly allows it for article metadata.
- Theme transitions must be added explicitly to new elements; they don't cascade from parent cards.

## 5. Future Improvements

1. **Auto-update dates from git history** — Script or pre-commit hook to update `data-updated` and display text based on last commit touching each project's repo
2. **Additional status types** — Add "Completed", "Archived", "Beta" status variants when needed (requires new color variables per status)
3. **Date format localization** — Use JavaScript to format dates based on user's locale (e.g., "Jan 2026" vs "2026-01")

## Execution Log

### 2026-01-29 — PHASE: Planning
- Goal: Add metadata badges to project cards
- 3 approaches designed (minimal, clean, pragmatic blend)
- User chose pragmatic blend

### 2026-01-29 — PHASE: Implementation
- Added status color variables to variables.css (3 theme contexts)
- Added footer, status badge, pulse animation CSS to components.css
- Added flex column layout to .project-card
- Added footer markup to all 7 project cards
- Updated CLAUDE.md documentation

### 2026-01-29 — PHASE: Quality Review
- 3 code reviewers ran in parallel (simplicity, bugs, conventions)
- No critical bugs found
- Fixed: Added theme transitions to footer and status badge
- Fixed: Changed margin-top from auto to explicit spacing (user feedback on visual gap)

### 2026-01-29 — PHASE: Complete
- All acceptance criteria met
- User approved visual result
