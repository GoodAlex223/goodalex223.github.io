# PERF-006: Inline Critical CSS

**Status**: Complete
**Branch**: `perf/006-inline-critical-css`
**Date**: 2026-02-16

---

## 1. Goal

Extract above-the-fold CSS styles, inline them in `<head>`, and load the full CSS bundle asynchronously to improve First Contentful Paint (FCP) and eliminate render-blocking CSS.

## 2. Approach

**Tool chosen**: Google's Critters library (static HTML analysis, no headless browser)

**Build pipeline**: `build:css` -> `unhash` -> `inline:css` -> `hash:css`

**Key decisions**:
- Automated extraction via Critters (vs manual CSS selection)
- Full CSS bundle loaded async (vs split bundles)
- Both `index.html` and `404.html` processed
- `--restore` mode for development/watch workflow

## 3. Implementation

### Files Created
- `scripts/inline-css.js` — Critters wrapper with cleanup, post-processing, and restore mode

### Files Modified
- `package.json` — Added `critters` devDependency, updated `build` and `watch` scripts, added `inline:css` script
- `index.html` — Now contains inline `<style>` with critical CSS + async `<link>`
- `404.html` — Same treatment as index.html
- `CLAUDE.md` — Updated build system docs, architecture, patterns

### Key Technical Details
- `cleanInlineArtifacts()` shared function ensures idempotent cleanup
- Temporary `data-theme="light"` on `<html>` during processing for theme selector inclusion
- Post-processing fixes 3 critters bugs:
  1. Removes `data-critters-container` attribute
  2. Cleans `media="print" onload="..."` from `<noscript>` fallback links
  3. Injects `[data-theme="light"]` CSS variable overrides (critters skips CSS custom property blocks)
- CSS file existence validation before processing
- Critters output validation (warns if no `<style>` produced)

## 4. Testing

- **Build idempotency**: Running `npm run build` twice produces identical output
- **Restore mode**: Cleanly removes all inline artifacts
- **Playwright tests**: 162 tests passing across Chromium, Firefox, WebKit (zero failures)
- **axe-core WCAG scans**: All accessibility checks pass with inline CSS

## 5. Future Improvements

1. **Reduce inline CSS size**: index.html at 16.1 KB exceeds 14 KB TCP slow-start guideline. Could investigate Critters configuration to be more selective about which rules are "critical" vs just matching all elements present in static HTML.
2. **CSS custom property extraction**: Critters doesn't extract standalone CSS variable blocks (`[data-theme=light]{--var:val}`). Could contribute upstream fix or use PostCSS API for more precise extraction instead of regex.
3. **Automated size regression**: Add a build step or test that fails if inline CSS exceeds a threshold (e.g., 20 KB) to prevent size creep.

## 6. Execution Log

### 2026-02-16 — PHASE: Planning
- Explored CSS build system, HTML structure, performance patterns
- Identified 2 approaches: Critters (automated) vs Custom PostCSS script (manual)
- User chose Critters approach

### 2026-02-16 — PHASE: Implementation
- Installed critters, updated package.json scripts
- Created scripts/inline-css.js with Critters wrapper
- Initial build revealed 3 bugs in critters output
- Fixed all 3 bugs with post-processing logic
- Added idempotency via shared cleanup function
- Added CSS file existence check and output validation

### 2026-02-16 — PHASE: Testing
- Build succeeds consistently (idempotent)
- Restore mode verified clean
- 162 Playwright tests pass (3 browsers)

### 2026-02-16 — PHASE: Complete
- All tests passing
- CLAUDE.md updated with new patterns
- Code review completed, minor improvements applied
