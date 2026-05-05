# Asset Checker Polish & PR #65 Follow-ups — Design

**Date**: 2026-05-02
**Branch**: `chore/asset-checker-polish`
**Origin**: WEEKLY.md (Tue, May 4–8 group), BACKLOG.md (PR #65 Review section + Internal Asset Link Checking Code Review section)
**Story points**: 7 SP

---

## Goal

Polish `scripts/check-assets.js` to address all six follow-ups from the PR #65 review cycle. Single-file change, no behavior visible to end-users of the site, no CI workflow changes.

The script's job (validating that internal asset references resolve to files on disk, gating CI before deploy) is unchanged. This PR closes accuracy and UX gaps in how it does that job.

---

## In scope (6 items)

| # | Source | Confidence | SP |
|---|--------|-----------|----|
| 1 | Tighten case-sensitivity check to cover directory segments (PR #65 review) | 65 | 3 |
| 2 | `dist/` preflight error message (Internal Asset Link Checking code review) | 90 | 1 |
| 3 | Harden JSON walk against non-flat `projects` shape (Internal Asset Link Checking code review) | 80 | 1 |
| 4 | Improve generic "not found" CI error message (Internal Asset Link Checking code review) | 85 | 1 |
| 5 | Align output format between `check-links.js` and `check-assets.js` (PR #65 review) | — | 1 |
| 6 | **(Bundled)** Document HTML-regex scope assumption (Internal Asset Link Checking code review) | 70 | <1 |

## Out of scope (explicit anchors)

- Shared HTML-ref extractor refactor (`scripts/lib/extract-refs.js`) — separate BACKLOG item.
- CSS `url(...)` scanning — separate BACKLOG item.
- Orphan asset detection — separate BACKLOG item.
- Memoize `readdirSync` per-directory — no longer naturally needed under the approach below.
- `<source src>` / `<video poster>` / `img srcset` / `link imagesrcset` extraction — separate BACKLOG item, no such assets in repo today.
- `scripts/__tests__/` automated test infrastructure — separate BACKLOG item, larger surface.
- Output-format changes to `check-links.js` itself — keep diff minimal; align asset-checker to link-checker conventions instead.

---

## Architecture decisions

### Q1 — Case-sensitivity approach: `realpathSync.native` (option B)

The current `assetExists()` walks a single `readdirSync` of the parent directory and matches the basename against the on-disk entries. This catches basename case-mismatches but lets wrong-cased *directory segments* (`Images/projects/foo.webp`) pass on macOS/Windows while failing on Linux CI. The header JSDoc claim "catches case-mismatch refs that would fail on Linux CI" overstates what is delivered.

**Chosen approach**: replace the basename-readdir check with a single `fs.realpathSync.native()` call and compare the canonicalized path to the requested absolute path with `===`. On macOS/Windows the canonical path is returned with on-disk casing — any mismatch flags the ref. On Linux, wrong-cased refs already fail `fs.existsSync()` upfront so realpath is mostly defensive.

**Why not segment walk + memoization (option A)**: more code, more FS calls, more state to maintain (memoization map). Reserved as fallback if `realpathSync.native` case behavior is observed to drift in a future Node release.

**Why not narrow the JSDoc claim (option C)**: would ship the gap; defeats the original purpose of the case check.

**Verification**: Node docs are explicit that `fs.realpath()` (the JS variant) does *not* case-convert on case-insensitive filesystems but are silent on `fs.realpathSync.native()`. Empirically, the native variant on macOS calls into `realpath(3)` which returns on-disk casing, and on Windows uses `GetFinalPathNameByHandle` which returns canonical casing. Documented as an assumption in Risks below; spec includes a fallback path.

### Q2 — `dist/` UX: hybrid preflight (option C)

The original feature spec promised a targeted "dist/ missing or incomplete — run `npm run build` first" message; the PR #65 implementation just printed a generic red ✗ for each broken `dist/` ref. Two failure modes need handling:

1. **dist/ missing or empty** — dev forgot to run `npm run build`. Fast-fail upfront before scanning anything.
2. **dist/ exists but contains stale hashes** — dev edited CSS/JS but `index.html` got rebuilt with new hashes against an older `dist/`. Detect during scan; print a hint once before listing the broken refs.

**Chosen approach**: layer both checks.

- **Preflight (top of `main()`)**: if `dist/` doesn't exist or is empty, print the targeted message and `exit(1)` before doing any extraction or scanning.
- **Stale-hash detection (during scan loop)**: if any `dist/...` ref fails to resolve despite `dist/` being populated, print the hint once before the broken-ref summary.

### Q3 — Output format: brackets in asset checker (option A)

`check-links.js` uses `(status)` parens for HTTP status and `[sources]` brackets for source files (failure only). `check-assets.js` uses `(sources)` parens always. Pick a convention so combined CI output reads consistently.

**Chosen approach**: switch asset-checker `(sources)` → `[sources]` on both success and failure lines. Link-checker stays untouched. Cross-script convention: `[]` always means "source file(s)", `()` always means "HTTP status".

Source info stays visible on success lines (asset checker has no other field competing for that visual slot). Trade-off: minor asymmetry where asset-success has `[sources]` and link-success has nothing — but the two scripts don't share a metadata field on success, so full symmetry is impossible without dropping information from one of them.

### Q4 — Scope: bundle "Document HTML-regex scope assumption" (option B)

5-line JSDoc comment in the same file we're already modifying. Same PR cycle (came out of the original Internal Asset Link Checking code review). Bundling avoids a future drive-by commit just to add a comment.

---

## Implementation

Single file modified: `scripts/check-assets.js`. No new files. No deletions.

### Item 1 — `assetExists()` rewrite

```js
/**
 * Returns true if the file exists at the requested case.
 *
 * On case-insensitive filesystems (macOS default, Windows), the requested
 * casing must match the on-disk casing exactly — otherwise the ref would fail
 * on Linux CI. This is enforced by canonicalizing via realpathSync.native()
 * (which returns the on-disk casing on macOS via realpath(3) and on Windows
 * via GetFinalPathNameByHandle) and comparing to the originally requested
 * absolute path. On Linux, wrong-cased refs already fail fs.existsSync, so
 * realpath is defensive.
 */
function assetExists(absolutePath) {
  if (!fs.existsSync(absolutePath)) return false;
  try {
    const canonical = fs.realpathSync.native(absolutePath);
    return canonical === absolutePath;
  } catch {
    return false;
  }
}
```

`path.join()` in `resolveRef()` already normalizes path separators on Windows, so the `===` comparison is direct.

### Item 2 — `dist/` hybrid preflight

**Preflight helper, called from `main()` before scanning**:

```js
function checkDistPreflight() {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0) {
    console.error(
      `Error: ${RED}dist/ missing or incomplete${RESET} — run \`npm run build\` first.`
    );
    process.exit(1);
  }
}
```

**Stale-hash detection, in the result-printing loop**:

```js
let distHintShown = false;
for (const result of results) {
  const sourceList = result.sources.join(', ');
  if (result.ok) {
    console.log(`  ${GREEN}✓${RESET} ${result.ref} [${sourceList}]`);
    passed++;
  } else {
    if (!distHintShown && /^\/?dist\//.test(result.ref)) {
      console.log(
        `\n  ${RED}Hint:${RESET} dist/ may be stale — run \`npm run build\` to refresh hashed assets.\n`
      );
      distHintShown = true;
    }
    console.log(`  ${RED}✗${RESET} ${result.ref} [${sourceList}]`);
    failed++;
  }
}
```

The `/^\/?dist\//` pattern matches both `/dist/style.HASH.css` (root-relative) and `dist/style.HASH.css` (already-stripped) ref shapes. Hint prints once, before the first failing `dist/` ref in the output.

### Item 3 — Harden JSON walk

```js
for (const project of Object.values(projects)) {
  if (typeof project !== 'object' || project === null) continue;
  if (!Array.isArray(project.screenshots)) continue;
  // ...existing screenshot iteration unchanged
}
```

### Item 4 — Improved "not found" CI error

Replace the existing message in the startup loop:

```js
console.error(
  `Error: ${path.relative(ROOT, src)} not found. ` +
  `Run from project root, and ensure \`npm run build\` completed and any CI artifacts downloaded.`
);
```

Single message covers both local (wrong cwd) and CI (missing artifact) failure modes without branching logic.

### Item 5 — Output format alignment

Asset-checker prints in items above already use `[${sourceList}]`. Old `(${sourceList})` is removed.

### Item 6 — HTML-regex scope comment (bundled)

Above `extractHtmlRefs()`, add:

```js
/**
 * Extracts href= and src= attribute values from an HTML file.
 *
 * Note: this regex extracts any `href=` / `src=` attribute-shaped string in
 * the raw HTML, including matches inside <script> blocks, JSON-LD payloads
 * (<script type="application/ld+json">), and HTML comments. Today the repo
 * has no such bypasses (verified during PR #65 review), but a future JSON-LD
 * addition could need a stricter parser.
 *
 * Returns an array of { ref, source } objects. Excluded refs are filtered out.
 */
```

---

## Testing strategy

`scripts/` has no automated test infrastructure today (separate BACKLOG item). For this PR: manual smoke-test before opening, then CI gates on the PR.

### Manual smoke-test plan

Run before opening PR:

1. **Baseline**: `npm run build && npm run check-assets` — all-green.
2. **Item 1 — case check**: temporarily edit `index.html` to mis-case one ref's directory (e.g. `images/projects/cleanspark-card.png` → `Images/projects/cleanspark-card.png`); `npm run check-assets`; expect a single ✗ on the mis-cased ref. Restore the file.
3. **Item 2a — preflight**: `rm -rf dist/ && npm run check-assets`; expect early-exit with the new "dist/ missing or incomplete" message and no scan output.
4. **Item 2b — stale-hash hint**: `npm run build`, then temporarily change a hash in `index.html` to a non-existent one (`/dist/style.deadbeef.css`); run `npm run check-assets`; expect the hint line + the ✗. Restore.
5. **Item 3 — JSON guard**: temporarily replace `data/projects.json` with `{ "x": null }` or `{ "x": "string" }`; `npm run check-assets` should not crash (returns zero JSON refs cleanly). Restore.
6. **Item 4 — CI error wording**: `cd /tmp && node "$REPO/scripts/check-assets.js"`; expect the new wording.
7. **Item 5 — output format**: visual diff before/after — every line uses `[sources]` instead of `(sources)`.
8. **Item 6 — JSDoc**: verify comment present above `extractHtmlRefs()`.

### CI gates that will run on the PR

- `npm run lint:js` — ESLint Node CJS env covers `scripts/**`.
- `check-links` workflow job — runs both `check-links.js` and `check-assets.js` against the built artifact. Validates the new logic on Linux CI.
- Pre-commit hook — `lint-staged` runs ESLint fix on the modified file.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Future Node version changes `realpathSync.native` case-canonicalization on macOS or Windows | Low | Case check would silently degrade to existsSync-only (Linux still catches via case-sensitive FS, so CI gate stays intact) | JSDoc documents the assumption; option A (segment walk + memoization) reserved as fallback BACKLOG item if the regression is ever observed |
| Stale-hint regex misfires on incidental refs (e.g. a future `/distribute/...` page) | Low | False-positive hint on an unrelated broken ref | Pattern uses `^\/?dist\/` (anchored) — only true `dist/` resolution failures trigger |
| Preflight false-positive on partial-build state (`dist/` exists but missing files) | Medium | Early-exit when developer might have a partial build | Acceptable: that *is* a broken-build state; the preflight message tells the dev to rebuild |
| `realpathSync.native` ENOENT on a broken symlink | Negligible — repo has no symlinks | Returns `false` from `assetExists()` — same as a missing file, same outcome | The wrapping try/catch handles it |
| `existsSync` + `realpathSync.native` TOCTOU race | Negligible — local script, single-threaded, no concurrent writers | Spurious pass/fail | None. Acceptable for this use case |

---

## Rollout

- Branch: `chore/asset-checker-polish` (already created from `main`).
- Single PR with one logical commit covering all 6 items. If review surface concerns arise, split into two commits — Item 1 (largest, behavior change) standalone, Items 2–6 as a second commit.
- Conventional commit type: `chore` (script polish, no behavior visible to site visitors).
- After merge: BACKLOG entries for items 1–5 strike through and move to "completed" markers; Item 6 BACKLOG entry strikes through separately. Plan archives to `docs/archive/plans/2026-05-02_asset-checker-polish.md`. WEEKLY.md Tuesday checkboxes mark complete. TODO → DONE transition.

---

## Open follow-ups (post-merge BACKLOG additions)

If anything new surfaces during implementation or review:

- If `realpathSync.native` behavior turns out to drift across the supported OS matrix (Linux/macOS/Windows on Node 22+), reopen as "switch to segment-walk + memoization" with a confidence rating tied to the failure observed.
- If the stale-hint regex needs broadening (e.g. a future `images/dist/...` user-asset path triggers it), tighten to absolute-path comparison rather than ref-string matching.
