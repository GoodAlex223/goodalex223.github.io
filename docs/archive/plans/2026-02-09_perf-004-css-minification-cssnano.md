# PERF-004: Add CSS Minification with cssnano

**Status**: Complete
**Branch**: perf/004-css-minification-cssnano
**Created**: 2026-02-09
**Completed**: 2026-02-09

---

## 1. Goal

Add CSS minification via cssnano to the existing PostCSS build pipeline. Reduce production CSS file size while keeping development watch mode unminified for debugging.

## 2. Approach

**Chosen**: Conditional plugin via `ctx.env` in function-style PostCSS config (Approach A)

**Alternatives Considered**:
- **Approach B**: Separate config files for dev/prod — Rejected: config duplication, harder to maintain
- **Approach C**: Always minify — Rejected: user wanted build-only minification for dev debugging

**Key Decision**: Use `--env production` flag with postcss-cli, conditional `ctx.env === 'production'` in config function. Standard PostCSS pattern.

## 3. Implementation

### Files Modified
1. **postcss.config.js** — Changed from static object export to function export with conditional cssnano
2. **package.json** — Added `--env production` to build script, added cssnano ^7.1.2 dependency
3. **CLAUDE.md** — Updated 3 build documentation sections with cssnano info

### Files Unchanged
- No CSS source files modified
- No HTML files modified
- No GitHub Actions workflow changes needed (already runs `npm run build`)

## 4. Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| `dist/style.css` size | 27,223 bytes | 19,177 bytes | **-29.6%** |
| Output lines | 1,211 | 1 | Single line |

- Production build (`npm run build`): Minified output (19,177 bytes)
- Development watch (`npm run watch`): Unminified output (27,223 bytes, 1,211 lines)

## 5. Key Discoveries

- cssnano default preset is safe for all CSS features used: custom properties, @keyframes, @media, @font-face, theme system
- `.filter(Boolean)` pattern is idiomatic for conditional PostCSS plugin arrays
- postcss-cli `--env` flag correctly passes to config function via `ctx.env`

## 6. Future Improvements

1. **Source maps for production** — Add `--map` flag to build script for debugging minified CSS in production. Low priority since source CSS is well-organized and easy to trace.
2. **Build size reporting** — Add a post-build script that logs before/after file sizes for visibility into CSS size trends over time. Could use `gzip-size-cli` to show transfer size too.

---

### Execution Log

#### 2026-02-09 — PHASE: Planning
- Goal understood: Add cssnano to PostCSS pipeline for production CSS minification
- Approach chosen: Conditional plugin via ctx.env (Approach A)
- Risks identified: cssnano might break CSS features (mitigated by default preset)

#### 2026-02-09 — PHASE: Implementation
- Installed cssnano ^7.1.2 (62 packages added)
- Updated postcss.config.js to function export with conditional cssnano
- Updated package.json build script with --env production
- Verified production build: 27,223 → 19,177 bytes (29.6% reduction)
- Verified watch mode: still unminified (27,223 bytes)
- Updated CLAUDE.md documentation (3 locations)

#### 2026-02-09 — PHASE: Sub-Item Complete
- Sub-item: CSS minification implementation
- **Results obtained**: 29.6% CSS file size reduction in production
- **Lessons learned**: cssnano default preset handles all modern CSS safely; postcss-cli --env flag works cleanly with function config
- **Problems encountered**: None
- **Improvements identified**: Source maps for production, build size reporting
- **Technical debt noted**: None
- **Related code needing changes**: None

#### 2026-02-09 — PHASE: Quality Review
- Code review: No issues found (2 reviewers)
- Documentation: Updated CLAUDE.md with cssnano info
- All changes verified working

#### 2026-02-09 — PHASE: Complete
- Final approach: Conditional cssnano via ctx.env === 'production'
- Tests passing: N/A (no automated CSS tests; manual verification passed)
- User approval: Received
