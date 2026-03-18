# PERF-009: Build Size Trend History

**Status**: Complete
**Created**: 2026-03-18
**Branch**: feature/perf-009-build-size-trend-history

## Goal

Append build sizes (raw + gzip for CSS and JS) to `docs/size-history.json` after each build. Provides historical trend visibility for asset growth over time.

## Design Decisions

1. **JSON structure**: ISO timestamp (`new Date().toISOString()`) since multiple builds can happen on the same day
2. **History growth**: No limit -- let it grow indefinitely (personal portfolio, file stays tiny)
3. **Git tracking**: `docs/size-history.json` committed to repo. CI builds won't commit it, but local builds update it for manual commit
4. **Duplicate prevention**: Always append a new entry, even if sizes haven't changed (timestamp itself is valuable data)
5. **Initial seed**: Start with empty array `[]`. First `npm run build` populates the first entry

## Implementation Plan

### Phase 1: Implementation

1. Create `docs/size-history.json` with empty array `[]`
2. Modify `scripts/report-sizes.js` to append size entry after reporting
3. Update CLAUDE.md build system documentation
4. Run lint and tests to verify

### JSON Entry Format

```json
{
  "timestamp": "2026-03-18T12:34:56.789Z",
  "css": { "raw": 12345, "gzip": 4567 },
  "js": { "raw": 8901, "gzip": 2345 }
}
```

## Key Discoveries

- The `report-sizes.js` script already had all the size data computed; adding history tracking was a clean extension at the end of `main()`
- Build process regenerates HTML hash references; must be careful not to commit those as part of feature changes

## Future Improvements

1. **Size trend visualization**: Add a simple CLI command or script that reads `size-history.json` and prints a text-based trend chart (e.g., sparkline or percentage change from previous entry)
2. **Budget trend alerts**: Warn when gzip sizes are trending upward over the last N entries (e.g., 3 consecutive increases), catching gradual bloat before it hits the hard budget limit
3. **CI size comparison**: In CI, compare current build sizes against the last committed entry in `size-history.json` and annotate the PR with the delta (e.g., "CSS +0.2 KB, JS -0.1 KB")

### Execution Log

#### 2026-03-18 — PHASE: Planning
- Goal: Add build size history tracking to report-sizes.js
- Approach: Extend existing script, append to JSON file after console output
- Risks: File path resolution, JSON parse errors on malformed file

#### 2026-03-18 — PHASE: Implementation
- Created `docs/size-history.json` with empty array seed
- Added `appendSizeHistory()` function to `scripts/report-sizes.js`
- Graceful error handling: missing file creates new array, malformed JSON starts fresh with warning
- Updated CLAUDE.md: build size reporting docs, architecture tree, key files list

#### 2026-03-18 — PHASE: Complete
- All 288 Playwright tests passing
- Lint (CSS + JS) clean
- Build runs successfully, first history entry written
- Code committed: d9295f3
