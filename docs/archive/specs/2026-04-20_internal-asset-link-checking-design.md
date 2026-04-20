# Internal Asset Link Checking — Design Spec

**Date**: 2026-04-20
**Author**: Brainstorming session (Claude + GoodAlex223)
**Weekly challenge (5 SP)**: Friday of week 2026-04-13 → 2026-04-17 (carried to 2026-04-20)
**Source**: `docs/planning/WEEKLY.md` line 83-84, `docs/planning/BACKLOG.md` line 807
**Branch**: `challenge/internal-asset-link-checking`

---

## Goal

Detect broken local asset references in committed `index.html`, `404.html`, and `data/projects.json` before they hit production. Complements the existing external-URL checker (`scripts/check-links.js`, added in PR #59) so that CI blocks both classes of broken references: unreachable external URLs and missing local files.

## Why this matters

The existing link checker only validates external HTTP(S) URLs. A broken local path — say a typo in `images/projects/rule-indicators-detail-1.webp` inside `data/projects.json` — fails silently in CI today. It only surfaces when a user opens the modal (image 404), as a Lighthouse resource warning, or as a visual regression. Catching these at CI time makes them cheap to fix instead of post-deploy.

## Non-goals

- **CSS `url(...)` scanning** — no broken CSS asset URLs today; can be added as a separate task if needed.
- **Orphan detection** — files on disk but not referenced. High false-positive rate (webmanifest refs, OG meta, favicons referenced by browser-default paths). Nice-to-have, not in scope.
- **HTTP validation of meta-tag URLs** — `og:image` absolute URLs are covered by the external checker.
- **Automated unit/integration tests for the script itself** — the `scripts/` directory contains no such tests today (`check-links.js`, `hash-assets.js`, `inline-css.js`, etc. are all manually verified). This script follows the same convention.

---

## Scope

### Sources scanned

1. `index.html`
2. `404.html`
3. `data/projects.json`

### Reference extractors

- **HTML**: attribute regex for `href="X"` and `src="X"` where `X` is not excluded (see *Exclusions* below). Applied to both HTML files.
- **JSON**: typed walk of `projects[*].screenshots[].src` values. No regex — read JSON, iterate. Future schema additions (e.g., gallery, video thumb) are easy to extend.

### Exclusions (not treated as internal asset refs)

- External URLs: `^https?://`, `^//` (protocol-relative), `^mailto:`, `^tel:`
- Hash anchors: `^#` (in-page navigation — `#main-content`, `#projects`, etc.)
- `data:` URIs (inline base64)
- Empty strings

### Path resolution

- Leading `/` → resolved against repo root: `/favicon.svg` → `<repo>/favicon.svg`
- No leading `/` (relative path) → also resolved against repo root: `fonts/inter-latin.woff2` → `<repo>/fonts/inter-latin.woff2`
- Both collapse to an absolute repo-root path, matching how GitHub Pages serves the site root after the deploy step stages `_site/`.

### Existence check

`fs.existsSync(resolvedPath)` — synchronous, fast, no network, no race conditions.

### Case-sensitivity parity

`fs.existsSync` is case-insensitive on macOS and Windows, case-sensitive on Linux CI. To prevent local false-passes that would fail in CI, after `existsSync` succeeds, verify the basename appears in `fs.readdirSync(dirname)` with exact case match. If not, report as broken.

### Exit behavior

- Exit 0 if all refs resolve to existing files.
- Exit 1 on any missing ref or case-mismatch.
- Same contract as `scripts/check-links.js`.

---

## Architecture

### New files

- `scripts/check-assets.js` — the checker. Expected ~100 LOC.

### Modified files

- `package.json` — add `"check-assets": "node scripts/check-assets.js"` to `scripts`.
- `.github/workflows/deploy.yml` — modify the `check-links` job (see *CI Integration*).
- `CLAUDE.md` — extend the **Link Checker** section to document the new internal-asset step (scope, exclusions, CI placement).

### Module layout of `check-assets.js`

```
- Constants: ROOT, source file paths, exclusion patterns
- extractHtmlRefs(filePath): Set<{ ref: string, source: string }>
    - reads HTML, runs href/src regex, filters exclusions
- extractJsonRefs(): Set<{ ref: string, source: string }>
    - reads projects.json, walks screenshots[].src, filters exclusions
- resolveRef(ref): absolute path from repo root (strips query/fragment)
- assetExists(resolvedPath): boolean (existsSync + case-sensitivity check)
- main():
    - gather refs from all sources → Map<resolvedPath, Set<sourceLabel>>
    - loop: check existence, print ✓/✗ line per unique path
    - summary line, exit code
```

### Shared helpers (optional, deferred)

`check-links.js` and `check-assets.js` both extract `href`/`src` attributes from HTML, though with different filters. If duplication becomes painful, extract `scripts/lib/extract-refs.js` later. Not part of this task — YAGNI.

---

## CI Integration

### Current state (`.github/workflows/deploy.yml`)

```
lint → build (build artifact)
lint → check-links  (runs `npm run check-links`, no npm ci, no artifact)
build → test
build → lighthouse
[build, test, lighthouse, check-links] → deploy
```

### After this change

```
lint → build (build artifact)
lint → build → check-links  (downloads artifact, runs `npm ci`, then both checkers)
build → test
build → lighthouse
[build, test, lighthouse, check-links] → deploy
```

### Diff summary for `check-links` job

1. Change `needs: lint` → `needs: build`.
2. Add `npm ci` step (currently omitted because the external checker uses only Node built-ins).
3. Add `actions/download-artifact@v4` step for `build-output` — ensures hashed `dist/` paths referenced in `index.html` exist on disk when scanned.
4. Add second step `Check internal assets` running `npm run check-assets`.
5. Keep step name for external check; the job itself can remain `check-links` (no rename — reducing workflow churn).

### Runtime impact

- CI wall-clock increase: ~0 (the job now blocks on `build`, which was already the critical path for `test`, `lighthouse`, and `deploy`).
- Job runtime increase: `+ npm ci` (~15 s) + `+ download-artifact` (~1 s) + `+ check-assets` (~0.5 s). Net ~20 s added to the single job. No critical-path impact because `deploy` still waits for the slowest of `[build, test, lighthouse, check-links]`, which remains `test` or `lighthouse`.

### Local UX

- `npm run check-assets` works directly on any machine after a `npm run build`.
- If `dist/` is absent (pre-build or post-`rm -rf dist`), the script fails with a clear message: `"dist/ missing or incomplete — run `npm run build` first."`. This message is triggered the first time a `dist/` ref is seen and the file doesn't exist. Exit 1.

---

## Output Format

Matches existing `check-links.js` style for consistency:

```
Checking 27 internal asset references...

  ✓ /favicon.svg (index.html, 404.html)
  ✓ fonts/inter-latin.woff2 (index.html)
  ✓ images/projects/rating-bot.webp (index.html)
  ✓ images/projects/rating-bot-detail-1.webp (data/projects.json)
  ✓ dist/main.c5d22c8b.js (index.html)
  ✗ images/projects/typo.webp (data/projects.json)

Results: 26 passed, 1 failed
```

- Green checkmark / red X (same ANSI codes as existing script)
- Deduped: one line per resolved path, all source files listed in parentheses
- Sorted: broken refs appear at the bottom of the list for visibility (implementation: collect all results, sort OK-first, print)

---

## Edge Cases

| # | Case | Handling |
|---|------|----------|
| 1 | Query string: `image.png?v=2` | Strip `?` and everything after before resolution |
| 2 | Fragment: `image.png#section` | Strip `#` and everything after before resolution |
| 3 | Hashed `dist/` miss | Caught via downloaded artifact; exit 1 with clear source trace |
| 4 | Duplicate refs across sources | Dedup via `Map<resolvedPath, Set<source>>`; each path checked once |
| 5 | Missing source file (`index.html`, etc.) | Error message + exit 1 (matches `check-links.js` pattern) |
| 6 | Case mismatch on Linux | Explicit `readdirSync` check after `existsSync` so macOS/Windows devs hit the same failure they'd see in CI |
| 7 | Empty `href=""` / `src=""` | Skipped silently (no false-positive) |
| 8 | `href="#"` or `src="data:..."` | Skipped by exclusion filter |

---

## Manual Test Plan

Run locally after implementation:

1. **Happy path, post-build**: `npm run build && npm run check-assets` → exit 0, all refs ✓.
2. **Happy path, pre-build**: Delete `dist/`, run `npm run check-assets` → exit 1, clear message naming `dist/main.[hash].js`.
3. **Broken HTML ref**: Edit `index.html`, typo one image src (e.g., `ratng-bot.webp`) → exit 1, ✗ line names file + source.
4. **Broken JSON ref**: Edit `data/projects.json`, typo one `screenshots[].src` → exit 1, ✗ line names file + source.
5. **Case mismatch (Windows/macOS)**: Rename a ref to wrong case (e.g., `Rating-bot.webp`) → exit 1 even though `fs.existsSync` passes.
6. **Exclusions work**: Verify `href="https://github.com/..."`, `mailto:...`, `#main-content`, `data:image/svg+xml,...` produce no warnings or false-failures.
7. **CI dry run**: Push branch → `check-links` job passes both steps. Deliberately break a ref in a throwaway commit → CI fails with clear output. Revert before PR.

---

## Completion Criteria

- [ ] `scripts/check-assets.js` written, ~100 LOC, matches `scripts/` style conventions (file-level JSDoc header, consistent with `check-links.js`).
- [ ] `package.json` has `"check-assets"` script.
- [ ] `npm run check-assets` exits 0 against current repo state (after `npm run build`).
- [ ] `.github/workflows/deploy.yml` `check-links` job: `needs: build`, downloads artifact, runs `npm ci`, executes both checkers.
- [ ] CI green on feature branch.
- [ ] Manual test plan items 1-6 all pass locally.
- [ ] CLAUDE.md Link Checker section extended with internal-asset paragraph (scope, exclusions, CI placement).
- [ ] `npm run lint` passes.
- [ ] `npm test` passes (no regressions; this is a tooling-only change).
- [ ] Build output (`dist/`) byte-identical before and after the PR (build pipeline unchanged).

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CI timing shift breaks `check-links` job isolation | Low | Low | `check-links` was already a leaf job; moving `needs: build` only adds a dep. Existing parallel structure (test/lighthouse also depend on build) proves this is a safe pattern. |
| False positives from overly broad regex | Low | Medium | Explicit exclusion list for external/hash/data/empty; tested via manual test case 6. |
| Case-sensitivity check slows the script | Low | Low | `readdirSync` per unique reference path is cheap on the current asset tree (~30 files); the check completes in well under a second. Memoize per-directory if profiling ever flags it. |
| Hash changes between build and check produce phantom broken refs | Low | Low | The `check-links` job now consumes the same `build-output` artifact `test`/`lighthouse` use — all three see identical hashes. |
| Script breaks when a new asset type is introduced (e.g., SVG `<use>` xlink:href) | Medium | Low | Regex currently covers `href`/`src` only. `<use xlink:href="sprite.svg#icon">` would be detected (has `href` attribute). Actual new asset types (CSS url(), video poster, etc.) will require extending the extractor — straightforward change, cost deferred to when needed. |

---

## Open Questions / Follow-ups (post-PR backlog)

- [ ] Extract shared HTML extractor into `scripts/lib/extract-refs.js` if the two checkers' extractors diverge or duplicate more.
- [ ] Consider CSS `url(...)` scanning once CSS has non-font assets.
- [ ] Consider orphan detection as a separate informational/non-blocking script.
