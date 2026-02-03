# PERF-003: Bundle CSS Files

**Status**: Complete
**Created**: 2026-02-03
**Branch**: perf/003-bundle-css

---

## 1. Problem Statement

The CSS architecture uses `@import` statements in `main.css` to load 5 other CSS files. Each `@import` creates a separate HTTP request in a waterfall pattern (browser discovers each import only after downloading the previous file). This increases page load time.

**Current state**: 6 HTTP requests for CSS
**Target state**: 1 HTTP request for bundled CSS

---

## 2. Acceptance Criteria

- [x] Single CSS file serves all styles in production
- [x] Build script or process documented
- [x] No visual regressions across all pages
- [x] Development workflow preserved (modular files still editable)

---

## 3. Approach Chosen

**Build Tool**: PostCSS with postcss-import plugin
- Industry standard, minimal configuration
- Resolves @import statements natively
- Extensible for future needs (autoprefixer, minification)

**Output**: `dist/style.css`
- Separation of source vs build artifacts
- gitignored (not committed)

**Deployment**: GitHub Actions
- Builds CSS on push to main
- Deploys to GitHub Pages via artifact upload

**Local Development**:
- HTML references `dist/style.css`
- Run `npm run build` before testing
- Optional `npm run watch` for auto-rebuild

---

## 4. Implementation

### Files Created

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies and build scripts |
| `postcss.config.js` | PostCSS plugin configuration |
| `.github/workflows/deploy.yml` | CI/CD workflow |

### Files Modified

| File | Change |
|------|--------|
| `.gitignore` | Added `dist/`, `node_modules/` |
| `index.html` | CSS path: `css/main.css` → `dist/style.css` |
| `404.html` | CSS path: `css/main.css` → `dist/style.css` |
| `CLAUDE.md` | Added Build System Pattern documentation |

### Build Artifacts

- `dist/style.css` — Bundled CSS (24KB, 1124 lines)

---

## 5. Key Discoveries

1. **Font paths work correctly**: Relative path `../fonts/` from `css/fonts.css` still resolves correctly from `dist/style.css` because both are one directory deep from root.

2. **No minification needed initially**: User chose concatenation only for easier debugging. Minification can be added later with cssnano.

3. **GitHub Pages requires settings change**: After merging, must change Pages source from "Branch: main" to "GitHub Actions".

---

## 6. Future Improvements

- [ ] Add CSS minification with cssnano for production (reduces file size further)
- [ ] Add cache-busting with content hash in filename (e.g., `style.abc123.css`)
- [ ] Consider adding autoprefixer for browser compatibility
- [ ] Add Lighthouse CI to verify performance improvements

---

## 7. Execution Log

### 2026-02-03 — PHASE: Planning
- Explored codebase CSS architecture
- Identified 6 CSS files with @import chain
- User chose: PostCSS, no minification, GitHub Actions, dist/ output

### 2026-02-03 — PHASE: Implementation
- Created package.json with postcss, postcss-cli, postcss-import
- Created postcss.config.js with minimal config
- Created GitHub Actions workflow for build + deploy
- Updated .gitignore, HTML files
- Tested locally: `npm run build` creates dist/style.css (24KB)

### 2026-02-03 — PHASE: Review
- Code review found redundant sed step in workflow (HTML already updated)
- Removed sed step, keeping simpler approach

### 2026-02-03 — PHASE: Complete
- Committed: 81acc73
- CLAUDE.md updated with Build System Pattern
- Ready for PR

---

## 8. Commands Reference

```bash
# Install dependencies
npm install

# Build bundled CSS
npm run build

# Watch for CSS changes
npm run watch

# Start local server
python -m http.server 8000
```

---

## 9. Post-Merge Action Required

**IMPORTANT**: After merging to main, you must change GitHub Pages settings:

1. Go to repository Settings → Pages
2. Change "Source" from "Deploy from a branch" to "GitHub Actions"
3. The workflow will handle deployment automatically on next push
