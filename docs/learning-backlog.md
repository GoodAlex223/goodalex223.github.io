# Learning Backlog

Topics and concepts to explore further, captured from development sessions.

---

### 2026-03-18 Session: "PERF-009: Build Size Trend History"

**What was done**: Added build size trend tracking to `report-sizes.js` — each `npm run build` now appends a timestamped entry with CSS and JS sizes (raw, minified, gzip) to `docs/size-history.json`.

**Topics to explore**:
- **Build size trend visualization** — the history data is now being collected but not yet visualized; explore lightweight charting options (e.g., inline SVG sparklines, GitHub Actions job summary tables) to surface trends without adding dependencies
- **JSON schema validation for build artifacts** — the `Array.isArray` guard was added reactively after code review; explore JSON Schema or lightweight validation patterns for config/data files consumed by build scripts to catch malformed data earlier
