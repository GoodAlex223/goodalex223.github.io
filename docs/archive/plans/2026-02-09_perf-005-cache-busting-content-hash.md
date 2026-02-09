# PERF-005: Add Cache-Busting with Content Hash

**Status**: Complete
**Branch**: perf/005-cache-busting-content-hash
**Created**: 2026-02-09

---

## 1. Problem

Browser caching of `dist/style.css` causes stale styles after CSS changes. Need content-hashed filenames (e.g., `style.a1b2c3d4.css`) for reliable cache invalidation on GitHub Pages.

## 2. Approach

**Chosen**: Post-build Node.js script (Approach A — Minimal Changes)

PostCSS config unchanged. A separate `scripts/hash-css.js` runs after PostCSS:
1. Reads `dist/style.css`, computes SHA-256 hash (8 chars)
2. Renames to `dist/style.[hash].css`
3. Updates HTML references in `index.html` and `404.html`
4. Cleans old hashed files
5. Validates final state

**Rejected alternatives**:
- PostCSS plugin: Higher maintenance, custom code for simple task
- Orchestrator script with execSync: Wraps PostCSS CLI, fragile cross-platform
- Query parameter (?v=hash): Some CDNs ignore query params

**Key decisions**:
- Filename hash over query parameter (CDN-safe, industry standard)
- 8-char SHA-256 truncation (4B combinations, collision-free for single file)
- Zero new npm dependencies (Node.js built-ins: fs, crypto, path)
- `--unhash` flag for watch mode compatibility

## 3. Changes

| File | Change |
|------|--------|
| `scripts/hash-css.js` | **New** — Cache-busting script (hash, rename, HTML update, cleanup, validate) |
| `package.json` | Added `build:css`, `hash:css` scripts; updated `build` and `watch` |
| `index.html` | CSS reference → `dist/style.[hash].css` |
| `404.html` | CSS reference → `dist/style.[hash].css` |
| `CLAUDE.md` | Updated build-commands, architecture, patterns sections |

## 4. Key Discoveries

- cssnano strips CSS comments, so comment-only changes produce identical hashes (correct behavior — minified output is identical)
- Global regex with `.test()` advances `lastIndex`; must reset before `.replace()` or check differently
- Watch mode after production build would 404 on CSS (HTML has hashed ref, watch outputs unhashed) — solved with `--unhash` flag
- GitHub Actions workflow needs zero changes (`npm run build` covers the full pipeline)

## 5. Future Improvements

1. **JS cache-busting**: Extend hashing to `js/main.js` for complete asset cache control — currently only CSS is hashed
2. **Build size reporting**: Log before/after file sizes during build to track CSS growth over time
3. **Source maps**: Generate `.map` files for production CSS to enable debugging minified code in browser DevTools

### Execution Log

#### 2026-02-09 — PHASE: Planning
- Goal: Content-hashed CSS filenames for cache invalidation
- Approach: Post-build Node.js script, filename hash, 8-char SHA-256
- Risks: Watch mode compatibility, regex lastIndex gotcha

#### 2026-02-09 — PHASE: Implementation
- Created `scripts/hash-css.js` with hash/rename/update/cleanup/validate
- Updated `package.json` with `build:css`, `hash:css`, updated `build` and `watch`
- Fixed idempotency bug: same-hash rebuild errored on "no CSS reference found" (regex replace was no-op)
- Fixed: Changed validation to check regex match existence separately from content change

#### 2026-02-09 — PHASE: Sub-Item Complete
- Sub-item: Core hash-css.js implementation
- **Results**: `style.8795488a.css` generated, HTML refs updated, old files cleaned
- **Lessons**: Global regex `.test()` + `.replace()` combo needs `lastIndex` management
- **Problems**: Idempotent rebuild failed — fixed by separating match check from content-change check
- **Improvements**: Could add JS hashing too (improvement #1)

#### 2026-02-09 — PHASE: Quality Review
- Code review found watch mode issue (CSS 404 after production build)
- Added `--unhash` flag to `hash-css.js`
- Updated watch script: `node scripts/hash-css.js --unhash && postcss ... --watch`
- Refactored: extracted shared `updateHtmlReferences()` function (used by both hash and unhash modes)
- Flattened script structure: removed unnecessary function wrappers for linear flow

#### 2026-02-09 — PHASE: Complete
- All acceptance criteria met
- Tests: build, idempotent rebuild, content change (new hash + cleanup), unhash, watch mode
- GitHub Actions: no workflow changes needed
