# Asset Checker Polish & PR #65 Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish `scripts/check-assets.js` to address all six PR #65 review follow-ups: tighten case-sensitivity check via `realpathSync.native`, add a hybrid `dist/` preflight + stale-hash hint, harden the JSON walk, improve the CI error wording, align output format brackets with `check-links.js`, and document the HTML-regex scope assumption.

**Architecture:** Single-file change. All 6 items live in `scripts/check-assets.js`. No new files, no test-infrastructure scaffolding (out of scope per spec), no `check-links.js` modifications. Tasks ordered low-risk → high-risk so each commit lands on stable ground: docs/wording → defensive guards → cosmetic format → behavior change → orchestration logic.

**Tech Stack:** Node.js 22 (CommonJS), `fs` module (`existsSync`, `readdirSync`, `realpathSync.native`), `path` module. Zero new dependencies. Lint via ESLint (Node CJS env, configured in `eslint.config.js`).

**Spec:** `docs/archive/specs/2026-05-02_asset-checker-polish-design.md`

**Branch:** `chore/asset-checker-polish`

---

## File Structure

| File | Type | Responsibility |
|------|------|----------------|
| `scripts/check-assets.js` | Modify | All 6 changes — single file, ~165 lines today, ~200 lines after |

No other files in scope. The unrelated working-tree modifications already on the branch (`docs/planning/WEEKLY.md`, `docs/size-history.json`, `sitemap.xml`) stay untouched by this plan; they belong to a separate concern and should be left alone.

---

## Testing approach

`scripts/` has no automated test infrastructure (separate BACKLOG item, out of scope per spec). Each task has a manual smoke-test step that mirrors the spec's "Manual smoke-test plan" — temporarily mutate state, run the script, verify output, restore state. CI gates (`npm run lint:js`, `check-links` workflow job on Linux) provide the final guardrail.

---

## Task 1: Document HTML-regex scope assumption (Item 6)

**Files:**
- Modify: `scripts/check-assets.js:48-64` (JSDoc above `extractHtmlRefs`)

**Why first:** Pure docs change. No behavior, no test impact. Smallest possible commit; warms up the file's git history with a low-risk first edit.

- [ ] **Step 1: Replace the JSDoc comment above `extractHtmlRefs`**

In `scripts/check-assets.js`, the current comment at line 48-51 reads:

```js
/**
 * Extracts href= and src= attribute values from an HTML file.
 * Returns an array of { ref, source } objects. Excluded refs are filtered out.
 */
```

Replace it with:

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

- [ ] **Step 2: Verify the script still runs cleanly**

Run: `npm run build && npm run check-assets`
Expected: same all-green output as before this change. The comment doesn't affect runtime behavior.

- [ ] **Step 3: Lint**

Run: `npm run lint:js`
Expected: clean exit (no warnings, no errors).

- [ ] **Step 4: Commit**

```bash
git add scripts/check-assets.js
git commit -m "docs: Note HTML-regex scope in check-assets extractHtmlRefs"
```

---

## Task 2: Improve "not found" CI error message (Item 4)

**Files:**
- Modify: `scripts/check-assets.js:114-119` (startup loop in `main`)

**Why second:** Single string change. Triggers only when a startup file is missing — rare but easy to simulate by running from the wrong directory. No interaction with other items.

- [ ] **Step 1: Replace the error message in the startup-file check**

Current code at lines 114-119:

```js
function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }
```

Replace the `console.error` line with:

```js
      console.error(
        `Error: ${path.relative(ROOT, src)} not found. ` +
        `Run from project root, and ensure \`npm run build\` completed and any CI artifacts downloaded.`
      );
```

(Indentation: 6 spaces leading on the inner lines to match the surrounding block.)

- [ ] **Step 2: Smoke-test the new wording locally**

Run from a non-repo directory:
```bash
cd /tmp && node "$(realpath ~/Projects/HTML/goodalex223)/scripts/check-assets.js"
```
On Windows PowerShell:
```powershell
Set-Location $env:TEMP; node "C:\Users\alexm\Projects\HTML\goodalex223\scripts\check-assets.js"
```

Expected stderr line:
```
Error: index.html not found. Run from project root, and ensure `npm run build` completed and any CI artifacts downloaded.
```

Exit code: 1.

- [ ] **Step 3: Lint**

Run: `npm run lint:js`
Expected: clean exit.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-assets.js
git commit -m "fix: Improve check-assets startup error wording for CI context"
```

---

## Task 3: Harden JSON walk against non-flat projects shape (Item 3)

**Files:**
- Modify: `scripts/check-assets.js:70-83` (function `extractJsonRefs`)

**Why third:** Defensive guard, no current behavior change (JSON shape is always flat today). Smoke-test by temporarily mutating `data/projects.json` to a degenerate shape and verifying no crash.

- [ ] **Step 1: Add the `typeof` guard at the top of the loop**

Current code at lines 70-83:

```js
function extractJsonRefs() {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  const refs = [];
  for (const project of Object.values(projects)) {
    if (!Array.isArray(project.screenshots)) continue;
    for (const screenshot of project.screenshots) {
      const ref = screenshot && screenshot.src;
      if (typeof ref === 'string' && !isExcludedRef(ref)) {
        refs.push({ ref, source: 'data/projects.json' });
      }
    }
  }
  return refs;
}
```

Add one new line so the body becomes:

```js
function extractJsonRefs() {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  const refs = [];
  for (const project of Object.values(projects)) {
    if (typeof project !== 'object' || project === null) continue;
    if (!Array.isArray(project.screenshots)) continue;
    for (const screenshot of project.screenshots) {
      const ref = screenshot && screenshot.src;
      if (typeof ref === 'string' && !isExcludedRef(ref)) {
        refs.push({ ref, source: 'data/projects.json' });
      }
    }
  }
  return refs;
}
```

(Note: in JavaScript, `typeof null === 'object'` is true, so both halves of the guard are needed.)

- [ ] **Step 2: Smoke-test the guard with a degenerate JSON shape**

```bash
cp data/projects.json data/projects.json.bak
echo '{"x": null, "y": "string", "z": 42, "ok": {"screenshots": [{"src": "images/projects/cleanspark-card.png"}]}}' > data/projects.json
npm run check-assets
```

Expected: no crash; the run scans only the `ok` entry's screenshot (and HTML refs) without an "Cannot read properties of null" error. Exit code 0 if all the resulting refs resolve, otherwise 1 with normal ✗ lines — either way, no `TypeError`.

Restore:
```bash
mv data/projects.json.bak data/projects.json
```

- [ ] **Step 3: Re-run baseline to confirm normal operation**

Run: `npm run check-assets`
Expected: all-green, same output as before this task started.

- [ ] **Step 4: Lint**

Run: `npm run lint:js`
Expected: clean exit.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-assets.js
git commit -m "fix: Guard check-assets JSON walk against non-object project entries"
```

---

## Task 4: Switch output format from parens to brackets (Item 5)

**Files:**
- Modify: `scripts/check-assets.js:147-156` (result-printing loop in `main`)

**Why fourth:** Cosmetic. Sets up the print-loop area to receive Task 6's stale-hint logic. Doing the format switch first lets Task 6 land already-bracketed code without re-touching the same lines.

- [ ] **Step 1: Capture baseline output for visual diff**

Run: `npm run build && npm run check-assets > /tmp/before.txt 2>&1`

(Or PowerShell: `npm run build; npm run check-assets *> $env:TEMP\before.txt`)

Skim `/tmp/before.txt` — every result line should currently use parens: `✓ ref (source)` / `✗ ref (source)`.

- [ ] **Step 2: Replace `(${sourceList})` with `[${sourceList}]` in both print lines**

Current code at lines 147-156:

```js
  for (const result of results) {
    const sourceList = result.sources.join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}✓${RESET} ${result.ref} (${sourceList})`);
      passed++;
    } else {
      console.log(`  ${RED}✗${RESET} ${result.ref} (${sourceList})`);
      failed++;
    }
  }
```

Change the two `console.log` lines to use brackets:

```js
  for (const result of results) {
    const sourceList = result.sources.join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}✓${RESET} ${result.ref} [${sourceList}]`);
      passed++;
    } else {
      console.log(`  ${RED}✗${RESET} ${result.ref} [${sourceList}]`);
      failed++;
    }
  }
```

- [ ] **Step 3: Capture new output and visual-diff against baseline**

Run: `npm run check-assets > /tmp/after.txt 2>&1`
Then: `diff /tmp/before.txt /tmp/after.txt`

Expected diff: every result line shows `(...)` → `[...]` swap. No other lines change.

- [ ] **Step 4: Lint**

Run: `npm run lint:js`
Expected: clean exit.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-assets.js
git commit -m "style: Use brackets for sources in check-assets output (matches check-links)"
```

---

## Task 5: Rewrite `assetExists` to use `realpathSync.native` (Item 1)

**Files:**
- Modify: `scripts/check-assets.js:96-111` (function `assetExists`, including JSDoc)

**Why fifth:** Behavior change with the highest single-task risk. All earlier tasks left the print pipeline and JSON walker stable, so any regression here will surface cleanly without cross-contamination.

- [ ] **Step 1: Capture baseline pass behavior**

Run: `npm run check-assets`
Expected: all-green. Note the result count from the "Checking N internal asset references" line — this should not change after the rewrite.

- [ ] **Step 2: Replace the `assetExists` function and its JSDoc**

Current code at lines 96-111:

```js
/**
 * Returns true if the file exists AND its basename matches the on-disk case exactly.
 * The case check catches refs that pass fs.existsSync on macOS/Windows (case-insensitive)
 * but would fail on Linux CI (case-sensitive).
 */
function assetExists(absolutePath) {
  if (!fs.existsSync(absolutePath)) return false;
  const dir = path.dirname(absolutePath);
  const base = path.basename(absolutePath);
  try {
    const entries = fs.readdirSync(dir);
    return entries.includes(base);
  } catch {
    return false;
  }
}
```

Replace with:

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
 *
 * Assumption: realpathSync.native case-canonicalization on macOS/Windows is
 * empirically reliable but not docs-guaranteed by Node. If a future Node
 * release changes this behavior, fall back to a per-segment readdirSync walk
 * (see BACKLOG: Memoize readdirSync per-directory in assetExists).
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

- [ ] **Step 3: Re-run baseline — must still be all-green**

Run: `npm run check-assets`
Expected: same all-green output as Step 1, same result count. If anything goes red, the realpath/path.join interaction is producing a path-string mismatch on this OS — investigate before continuing.

- [ ] **Step 4: Smoke-test the case-mismatch detection**

Pick any image ref from `index.html`, e.g. `images/projects/cleanspark-card.png`. Temporarily mis-case its directory component:

```bash
# Edit index.html: change one ref like images/projects/cleanspark-card.png
# to Images/projects/cleanspark-card.png (capital I).
# Use sed (Linux/macOS):
sed -i.bak 's|images/projects/cleanspark-card.png|Images/projects/cleanspark-card.png|' index.html
```

PowerShell on Windows:
```powershell
Copy-Item index.html index.html.bak
(Get-Content index.html) -replace 'images/projects/cleanspark-card\.png', 'Images/projects/cleanspark-card.png' | Set-Content index.html
```

Run: `npm run check-assets`

Expected:
- One ✗ line for the mis-cased ref.
- Exit code 1.
- Other refs remain ✓.

Restore:
```bash
mv index.html.bak index.html
```

PowerShell:
```powershell
Move-Item -Force index.html.bak index.html
```

Re-run `npm run check-assets` to confirm all-green again.

- [ ] **Step 5: Lint**

Run: `npm run lint:js`
Expected: clean exit.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-assets.js
git commit -m "fix: Tighten check-assets case check to cover directory segments"
```

---

## Task 6: Add `dist/` hybrid preflight + stale-hash hint (Item 2)

**Files:**
- Modify: `scripts/check-assets.js` — two edits:
  - Add new function `checkDistPreflight()` (insert before `function main()`)
  - Modify `main()`: call preflight first; add stale-hash hint inside the result-printing loop

**Why last:** Highest-orchestration item; benefits from the now-stable `assetExists` and bracketed print format.

- [ ] **Step 1: Add the `checkDistPreflight` helper above `main`**

Locate the `function main()` declaration (around line 113 after prior tasks). Insert directly before it:

```js
/**
 * Fast-fails when dist/ is missing or empty (the common "forgot npm run build"
 * case). Avoids printing one generic ✗ per dist/ ref. Returns nothing; calls
 * process.exit(1) on failure.
 */
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

- [ ] **Step 2: Call `checkDistPreflight()` at the top of `main`**

In `main()`, immediately after the existing startup-file `for` loop (the one Task 2 modified), add the preflight call. The block becomes:

```js
function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(
        `Error: ${path.relative(ROOT, src)} not found. ` +
        `Run from project root, and ensure \`npm run build\` completed and any CI artifacts downloaded.`
      );
      process.exit(1);
    }
  }

  checkDistPreflight();

  const allRefs = [
    ...extractHtmlRefs(INDEX_PATH, 'index.html'),
    // ...rest unchanged
  ];
  // ...
}
```

(Insert exactly one blank line above `checkDistPreflight();` for readability.)

- [ ] **Step 3: Add the stale-hash hint to the result-printing loop**

The loop (post-Task-4) currently looks like:

```js
  for (const result of results) {
    const sourceList = result.sources.join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}✓${RESET} ${result.ref} [${sourceList}]`);
      passed++;
    } else {
      console.log(`  ${RED}✗${RESET} ${result.ref} [${sourceList}]`);
      failed++;
    }
  }
```

Hoist a `distHintShown` flag above the loop and inject the hint above the failure-print:

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

- [ ] **Step 4: Smoke-test the preflight (missing dist/)**

```bash
# Stash any existing dist/ for safe restoration
mv dist dist.bak 2>/dev/null || true
npm run check-assets
```

PowerShell:
```powershell
if (Test-Path dist) { Move-Item dist dist.bak }
npm run check-assets
```

Expected:
- Exit code 1.
- Only one stderr line: `Error: dist/ missing or incomplete — run \`npm run build\` first.`
- No "Checking N internal asset references" or per-ref output.

Restore:
```bash
[ -d dist.bak ] && mv dist.bak dist
```

PowerShell:
```powershell
if (Test-Path dist.bak) { Move-Item dist.bak dist }
```

- [ ] **Step 5: Smoke-test the stale-hash hint**

Re-build first to ensure dist/ is fresh, then mutate one dist ref in `index.html` to a non-existent hash:

```bash
npm run build
cp index.html index.html.bak
# Find the actual current dist/style hash:
grep -oE 'dist/style\.[a-f0-9]+\.css' index.html | head -1
# Use sed to swap the hash to a fake one (replace HASH with the real one from above):
sed -i 's|dist/style\.HASH\.css|dist/style.deadbeef.css|' index.html
npm run check-assets
```

PowerShell:
```powershell
npm run build
Copy-Item index.html index.html.bak
$realHash = (Select-String -Path index.html -Pattern 'dist/style\.([a-f0-9]+)\.css').Matches[0].Groups[1].Value
(Get-Content index.html) -replace "dist/style\.$realHash\.css", "dist/style.deadbeef.css" | Set-Content index.html
npm run check-assets
```

Expected:
- Exit code 1.
- A single hint line: `Hint: dist/ may be stale — run \`npm run build\` to refresh hashed assets.`
- Exactly one ✗ line: `✗ dist/style.deadbeef.css [index.html]` (or similar — depending on whether the ref had a leading `/`).
- All other refs ✓.

Restore:
```bash
mv index.html.bak index.html
```

PowerShell:
```powershell
Move-Item -Force index.html.bak index.html
```

- [ ] **Step 6: Verify the hint does NOT fire for non-dist failures**

Temporarily mis-case a non-dist ref (e.g., the same `Images/projects/...` swap from Task 5's smoke test). Run check-assets — expect ✗ but no `Hint:` line. Restore.

- [ ] **Step 7: Lint**

Run: `npm run lint:js`
Expected: clean exit.

- [ ] **Step 8: Commit**

```bash
git add scripts/check-assets.js
git commit -m "feat: Add dist/ preflight and stale-hash hint to check-assets"
```

---

## Task 7: PR-readiness review

**Files:** none modified — verification + housekeeping only.

- [ ] **Step 1: Final all-green verification**

Run: `npm run build && npm run check-assets`
Expected: all-green; same result count as before this branch started.

- [ ] **Step 2: Run the full lint pipeline**

Run: `npm run lint`
Expected: clean exit (CSS + JS).

- [ ] **Step 3: Confirm git history is clean**

Run: `git log --oneline main..HEAD`
Expected: 7 commits — the spec commit (`docs: Spec for Asset Checker Polish & PR #65 follow-ups`) plus six task commits in order. No fixup commits, no commented-out code in the diff.

Run: `git diff main..HEAD -- scripts/check-assets.js | head -200`
Eyeball the diff: every change should map to one of the six items. No unrelated edits.

- [ ] **Step 4: (Optional) Squash to single commit if preferred for PR review**

If the spec's "single logical commit" preference applies for this PR:
```bash
git rebase -i main
# Mark the 6 task commits as 'squash' (keep the first one as 'pick')
# Keep the spec commit separate at the top — it's already a coherent unit
```

Or leave the per-task commits intact for easier review of the larger Item 1 change. The spec explicitly allows either; pick what reads cleanest.

- [ ] **Step 5: Final commit (only if any housekeeping changes were needed)**

If the review surfaces any whitespace, missed restoration of `*.bak` files, or other small issues, fix them and create a final commit:

```bash
git add <fixed-files>
git commit -m "chore: Final cleanup for asset-checker-polish branch"
```

Otherwise, no commit needed — the branch is ready for PR.

---

## Self-review notes (for plan author)

**Spec coverage check:**
- Item 1 (case check) → Task 5 ✓
- Item 2 (`dist/` preflight + stale-hint) → Task 6 ✓
- Item 3 (JSON walk hardening) → Task 3 ✓
- Item 4 (CI error wording) → Task 2 ✓
- Item 5 (output format brackets) → Task 4 ✓
- Item 6 (HTML-regex JSDoc, bundled) → Task 1 ✓

All 6 spec items mapped to tasks. No orphans.

**Type/identifier consistency check:** `assetExists`, `extractJsonRefs`, `extractHtmlRefs`, `checkDistPreflight`, `distHintShown` — names used consistently across tasks. Variable `sourceList` matches existing code. Regex `/^\/?dist\//` used identically in spec Item 2 risk row and Task 6 implementation.

**Placeholder scan:** No "TBD"/"TODO"/"implement later" markers; every code step shows full code; every smoke-test step has an exact command and exact expected output.

**Edge-case coverage in smoke tests:**
- Task 3 covers null entries (relies on `typeof null === 'object'` quirk being handled)
- Task 5 covers macOS/Windows behavior (the user's current OS is Windows, so smoke-test commands have PowerShell variants)
- Task 6 covers both preflight (missing dist/) and hint (stale dist/) paths, plus a negative case (non-dist failure should NOT fire the hint)
