# PERF-001: Self-host Google Fonts

**Status**: Complete
**Priority**: Medium
**Created**: 2026-01-29
**Completed**: 2026-01-29

---

## 1. Goal

Eliminate the external Google Fonts CDN dependency by self-hosting Inter font files. Improves First Contentful Paint, removes privacy concerns (no user data sent to Google), and increases reliability (site fonts load even if Google CDN is down).

**Origin**: BACKLOG.md — HP-002 Lighthouse audit improvement (2026-01-26)

---

## 2. Approach

### Decisions Made

- **Variable font** over static files — single woff2 per subset, supports weight range 100-900
- **woff2 only** — 97%+ browser support, best compression, matches site's modern CSS approach
- **Separate `css/fonts.css`** — clean separation of @font-face declarations from design tokens
- **Latin + Latin Extended subsets** with unicode-range — browser only downloads what it needs
- **Two subset files** (Google's approach) — Latin (48KB) for common use, Latin Extended (85KB) only if needed

### Implementation

1. Downloaded Inter variable font woff2 files from Google Fonts gstatic CDN
2. Created `fonts/` directory with two subset files
3. Created `css/fonts.css` with @font-face declarations matching Google Fonts CSS2 API
4. Updated `css/main.css` to import `fonts.css` first
5. Removed Google Fonts `<link>` tags from both `index.html` and `404.html`

---

## 3. Files Changed

### New Files
- `fonts/inter-latin.woff2` (48KB) — Latin subset variable font
- `fonts/inter-latin-ext.woff2` (85KB) — Latin Extended subset variable font
- `css/fonts.css` — @font-face declarations with unicode-range subsetting

### Modified Files
- `css/main.css` — Added `@import "fonts.css"` as first import
- `index.html` — Removed 3 Google Fonts `<link>` tags (preconnect + stylesheet)
- `404.html` — Removed 3 Google Fonts `<link>` tags (preconnect + stylesheet)

---

## 4. Key Discoveries

- Google Fonts CSS2 API serves different formats based on User-Agent header (woff2 for modern browsers, ttf for legacy)
- Google splits variable fonts into unicode-range subsets for optimal loading — browsers only download the subset they need
- For English content, only the Latin subset (48KB) downloads; Latin Extended (85KB) is deferred
- The `font-weight: 100 900` syntax in @font-face correctly declares a variable font weight axis

---

## 5. Future Improvements

1. **Bundle CSS files** — Replace @import chain with single concatenated CSS file for production. Would reduce HTTP requests from 6 CSS files to 1. (From HP-002 Lighthouse audit)
2. **Add font preload hint** — `<link rel="preload" href="fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>` in HTML `<head>` to start font download earlier in the critical path
3. **Update PROJECT.md** — Remove Google Fonts from external dependencies, document self-hosted fonts

---

## Execution Log

### 2026-01-29 — PHASE: Planning
- Goal understood: Self-host Inter font to eliminate Google Fonts CDN dependency
- Approach chosen: Variable font, woff2 only, Latin + Latin Extended, separate fonts.css
- Risks identified: Font rendering parity, correct unicode-range values

### 2026-01-29 — PHASE: Implementation
- Downloaded Inter variable font files from Google Fonts gstatic CDN
- Created css/fonts.css with @font-face declarations
- Updated css/main.css import chain
- Removed Google Fonts links from index.html and 404.html
- Deviation from plan: No — straightforward implementation

### 2026-01-29 — PHASE: Verification
- User verified via browser DevTools Network tab
- All requests from localhost only (no Google CDN requests)
- Font renders correctly (inter-latin.woff2 loaded, 48.46KB)
- fonts.css loaded at 1.04KB

### 2026-01-29 — PHASE: Complete
- Final approach: Two-subset variable font with unicode-range splitting
- Tests passing: Visual verification confirmed
- User approval: Received
