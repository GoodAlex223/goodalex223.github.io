# Learning Backlog

Topics and concepts to explore further, captured from development sessions.

---

### 2026-03-18 Session: "PERF-009: Build Size Trend History"

**What was done**: Added build size trend tracking to `report-sizes.js` — each `npm run build` now appends a timestamped entry with CSS and JS sizes (raw, minified, gzip) to `docs/size-history.json`.

**Topics to explore**:
- **Build size trend visualization** — the history data is now being collected but not yet visualized; explore lightweight charting options (e.g., inline SVG sparklines, GitHub Actions job summary tables) to surface trends without adding dependencies
- **JSON schema validation for build artifacts** — the `Array.isArray` guard was added reactively after code review; explore JSON Schema or lightweight validation patterns for config/data files consumed by build scripts to catch malformed data earlier

### 2026-03-19 Session: "CHALLENGE-002: Project Detail Modal"

**What was done**: Implemented accessible project detail modal with lazy-fetched JSON data, focus trap, URL hash integration, and 45 Playwright tests. Fixed CI focus timing bug (setTimeout must exceed CSS visibility transition duration).

**Topics to explore**:
- **CSS visibility transition and focus interaction** — `focus()` silently fails on elements with `visibility: hidden` (even mid-transition); explore `transitionend` event-based focus management as a more robust alternative to fixed timeouts, and how different browsers handle focusability during CSS transitions
- **Focus trap patterns in vanilla JS** — implemented manual Tab/Shift+Tab cycling with `querySelectorAll` for focusable elements; explore existing lightweight libraries (e.g., focus-trap) and the emerging `inert` HTML attribute as alternatives for managing focus within modal dialogs
