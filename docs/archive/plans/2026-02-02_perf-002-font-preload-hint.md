# PERF-002: Add Font Preload Hint

**Status**: Complete
**Priority**: Medium
**Created**: 2026-02-02
**Completed**: 2026-02-02

---

## 1. Problem Statement

Font files (Inter Latin and Latin Extended WOFF2 subsets) are discovered late in the critical rendering path. The browser must parse HTML -> main.css -> @import fonts.css -> @font-face rules before it even knows which fonts to download. This delays font loading by the full CSS @import waterfall depth.

## 2. Solution

Add `<link rel="preload">` hints in the `<head>` of both `index.html` and `404.html` so the browser starts downloading fonts immediately during HTML parsing, in parallel with the CSS chain.

## 3. Implementation

### Changes Made

**index.html** (lines 19-21): Added after favicon links, before Open Graph meta tags:
```html
<!-- Font preload -->
<link rel="preload" href="fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin />
```

**404.html** (lines 15-17): Added after favicon links, before `<title>`:
```html
<!-- Font preload -->
<link rel="preload" href="fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin />
```

### Key Technical Details

- `crossorigin` is **required** even for same-origin fonts per spec (`@font-face` always uses anonymous CORS mode)
- `type="font/woff2"` lets browsers that don't support WOFF2 skip the preload
- Placement early in `<head>` maximizes the head-start on font downloads

## 4. Key Discoveries

- Font preloads require `crossorigin` even for same-origin resources (CSS Font Loading spec mandates anonymous CORS mode for font fetches)
- Without `crossorigin`, the preloaded resource won't match the `@font-face` request, causing a duplicate download (defeating the purpose)
- The `@import` waterfall in main.css delays font discovery by the full depth of the CSS chain

## 5. Future Improvements

1. **Bundle CSS files (PERF-003)** — Replace the `@import` chain with a single bundled CSS file to eliminate the sequential waterfall entirely (bigger impact than preload alone)
2. **Inline critical CSS** — Inline above-the-fold styles in `<head>` and load full CSS asynchronously for faster first paint
3. **Monitor with Lighthouse CI** — Set up automated Lighthouse checks to catch performance regressions as the site grows

---

### Execution Log

#### 2026-02-02 — PHASE: Planning
- Goal understood: Add font preload hints to improve critical rendering path
- Approach chosen: `<link rel="preload">` for both Inter WOFF2 font files in both HTML pages
- Risks identified: Duplicate downloads if `crossorigin` attribute is wrong

#### 2026-02-02 — PHASE: Implementation
- Step completed: Added preload links to index.html and 404.html
- Deviation from plan: Preloaded both font files (latin + latin-ext) per user preference, not just latin as originally described in TODO
- Unexpected discovery: None

#### 2026-02-02 — PHASE: Sub-Item Complete
- Sub-item: Font preload links added to both HTML files
- **Results obtained**: Both WOFF2 fonts will now start downloading immediately during HTML parsing
- **Lessons learned**: `crossorigin` is mandatory for font preloads even same-origin (per CSS Font Loading spec)
- **Problems encountered**: Code reviewer incorrectly flagged `crossorigin` as causing duplicate downloads (opposite is true)
- **Improvements identified**: CSS bundling (PERF-003) would have even bigger impact
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-02 — PHASE: Complete
- Final approach: Two `<link rel="preload">` tags in both HTML files, after favicons, before other content
- Tests passing: N/A (static HTML, manual verification)
- User approval: Received
