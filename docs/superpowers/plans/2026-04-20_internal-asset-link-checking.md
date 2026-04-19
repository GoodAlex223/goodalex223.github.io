# Internal Asset Link Checking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CI-gated checker that verifies every internal asset referenced in `index.html`, `404.html`, and `data/projects.json` exists on disk.

**Architecture:** New `scripts/check-assets.js` runs in the same CI `check-links` job as the existing external URL checker. Extracts `href`/`src` attrs from HTML and `screenshots[].src` values from projects.json, filters out external URLs / in-page anchors / homepage-nav, resolves each remaining ref against the repo root, and verifies existence with case-sensitivity parity between Linux CI and macOS/Windows devs.

**Tech Stack:** Node.js 20 built-ins (`fs`, `path`), no new dependencies. Mirrors `scripts/check-links.js` conventions (file-level JSDoc, ANSI color output, dedup via `Map<path, Set<source>>`).

**Spec:** [docs/superpowers/specs/2026-04-20_internal-asset-link-checking-design.md](../specs/2026-04-20_internal-asset-link-checking-design.md)

**Branch:** `challenge/internal-asset-link-checking`

**Testing approach:** No automated unit tests — `scripts/` has no test framework today (`check-links.js`, `hash-assets.js`, `inline-css.js` all manually verified). Each task uses manual verification against the real repo or a temporarily-corrupted state reverted before commit.

---

## File Structure

**Create:**
- `scripts/check-assets.js` — The checker (~100 LOC). Single responsibility: validate internal asset refs exist on disk.

**Modify:**
- `package.json` — Add one npm script entry.
- `.github/workflows/deploy.yml` — Modify the `check-links` job (4 diffs in one job).
- `CLAUDE.md` — Extend the existing Link Checker paragraph under "Key Patterns & Gotchas".

No changes to `index.html`, `404.html`, `data/projects.json`, CSS, JS, or tests.

---

## Task 1: Scaffold script and wire `npm run check-assets`

**Files:**
- Create: `scripts/check-assets.js`
- Modify: `package.json:21` (scripts block)

- [ ] **Step 1: Create the skeletal script file**

Create `scripts/check-assets.js` with this exact content:

```javascript
/**
 * Validates that internal asset references in index.html, 404.html, and
 * data/projects.json resolve to files that exist on disk.
 *
 * Complements scripts/check-links.js (external HTTP URL check). Together they
 * form the CI "check-links" gate that blocks broken references before deploy.
 *
 * Exits non-zero on any missing asset. Requires `npm run build` to have run
 * first so that hashed dist/ references are present.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const NOT_FOUND_PATH = path.join(ROOT, '404.html');
const PROJECTS_PATH = path.join(ROOT, 'data', 'projects.json');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }
  console.log('Checking 0 internal asset references...\n');
  console.log('Results: 0 passed, 0 failed');
}

main();
```

- [ ] **Step 2: Add npm script entry**

Open `package.json`. Locate the `"check-links": "node scripts/check-links.js"` line (~line 21 in the scripts block). Add immediately after it:

```json
    "check-assets": "node scripts/check-assets.js",
```

The scripts block should now include, in order: `check-links`, `check-assets`, `prepare`.

- [ ] **Step 3: Verify the skeleton runs**

Run: `npm run check-assets`

Expected output:
```
Checking 0 internal asset references...

Results: 0 passed, 0 failed
```

Exit code: 0. If any error, fix before proceeding.

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint:js`

Expected: clean pass (no ESLint errors on the new file).

- [ ] **Step 5: Commit**

```bash
git add scripts/check-assets.js package.json
git commit -m "feat: Scaffold check-assets script"
```

---

## Task 2: Implement HTML ref extraction with exclusions

**Files:**
- Modify: `scripts/check-assets.js`

- [ ] **Step 1: Add exclusion helper and HTML extractor**

In `scripts/check-assets.js`, directly above `function main() {`, insert these two functions:

```javascript
/**
 * Returns true for refs that are not internal asset paths we can check on disk:
 *   - External URLs (http://, https://, protocol-relative //)
 *   - mailto: and tel: schemes
 *   - data: URIs
 *   - In-page anchors (#foo) and root/homepage-nav (/ and /#foo)
 *   - Empty strings
 */
function isExcludedRef(ref) {
  if (!ref) return true;
  if (/^(https?:)?\/\//.test(ref)) return true;
  if (ref.startsWith('mailto:')) return true;
  if (ref.startsWith('tel:')) return true;
  if (ref.startsWith('data:')) return true;
  if (ref.startsWith('#')) return true;

  // Strip ?query and #fragment to see if only "/" or "" remains (homepage nav)
  const withoutQuery = ref.split('?')[0].split('#')[0];
  if (withoutQuery === '' || withoutQuery === '/') return true;

  return false;
}

/**
 * Extracts href= and src= attribute values from an HTML file.
 * Returns an array of { ref, source } objects. Excluded refs are filtered out.
 */
function extractHtmlRefs(filePath, sourceLabel) {
  const html = fs.readFileSync(filePath, 'utf8');
  const pattern = /(?:href|src)="([^"]+)"/g;
  const refs = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const ref = match[1];
    if (!isExcludedRef(ref)) {
      refs.push({ ref, source: sourceLabel });
    }
  }
  return refs;
}
```

- [ ] **Step 2: Wire extractor into main() for visual verification**

Replace the body of `main()` with:

```javascript
function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }

  const refs = [
    ...extractHtmlRefs(INDEX_PATH, 'index.html'),
    ...extractHtmlRefs(NOT_FOUND_PATH, '404.html'),
  ];

  console.log(`Extracted ${refs.length} HTML refs:`);
  for (const { ref, source } of refs) {
    console.log(`  ${ref} [${source}]`);
  }
}

main();
```

- [ ] **Step 3: Run and verify output against current repo**

Run: `npm run check-assets`

Expected: a list of ~20 refs total across both HTML files. Must include:
- `/favicon.svg`, `/favicon-96x96.png`, `/favicon.ico`, `/apple-touch-icon.png`, `/site.webmanifest` (from both HTML files)
- `fonts/inter-latin.woff2`, `fonts/inter-latin-ext.woff2`
- `images/projects/rating-bot.webp` (and 7 other project card images)
- `404.webp` (from 404.html)
- `dist/main.<hash>.js`

Must NOT include:
- Any `https://...` URL
- `#about`, `#projects`, `#main-content`, etc.
- `/`, `/#about`, `/#projects`, etc. (from 404.html)
- `mailto:...` refs

If the output contains any excluded ref or misses any of the expected refs, debug the regex/filter before proceeding.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-assets.js
git commit -m "feat: Extract HTML asset refs with exclusion filter"
```

---

## Task 3: Implement JSON ref extraction + ref deduplication

**Files:**
- Modify: `scripts/check-assets.js`

- [ ] **Step 1: Add JSON extractor**

In `scripts/check-assets.js`, directly above `function main() {`, insert:

```javascript
/**
 * Extracts screenshot src paths from data/projects.json.
 * Walks projects[*].screenshots[].src. Skips excluded refs.
 */
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

- [ ] **Step 2: Update main() to merge HTML + JSON refs into a dedup Map**

Replace the body of `main()` with:

```javascript
function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }

  const allRefs = [
    ...extractHtmlRefs(INDEX_PATH, 'index.html'),
    ...extractHtmlRefs(NOT_FOUND_PATH, '404.html'),
    ...extractJsonRefs(),
  ];

  // Dedup: Map<ref, Set<sourceLabel>>
  const refSources = new Map();
  for (const { ref, source } of allRefs) {
    if (!refSources.has(ref)) refSources.set(ref, new Set());
    refSources.get(ref).add(source);
  }

  console.log(`Dedup: ${allRefs.length} refs → ${refSources.size} unique:`);
  for (const [ref, sources] of refSources) {
    console.log(`  ${ref} (${[...sources].join(', ')})`);
  }
}

main();
```

- [ ] **Step 3: Run and verify**

Run: `npm run check-assets`

Expected:
- Dedup count: original HTML total + ~14 JSON refs → significantly fewer unique (favicons, fonts, and project card thumbnails dedup across index.html + 404.html).
- `/favicon.svg` line must show sources `(index.html, 404.html)`.
- `images/projects/rating-bot-detail-1.webp` must appear with source `(data/projects.json)`.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-assets.js
git commit -m "feat: Add JSON screenshot extraction and ref dedup"
```

---

## Task 4: Add path resolution + existence check with case-sensitivity parity

**Files:**
- Modify: `scripts/check-assets.js`

- [ ] **Step 1: Add resolver and existence check functions**

In `scripts/check-assets.js`, directly above `function main() {`, insert:

```javascript
/**
 * Resolves an internal asset ref to an absolute path from the repo root.
 * Strips query strings and fragments. Leading "/" is treated as repo-root-absolute
 * (matches GitHub Pages behavior for this site).
 */
function resolveRef(ref) {
  const clean = ref.split('?')[0].split('#')[0];
  const relative = clean.startsWith('/') ? clean.slice(1) : clean;
  return path.join(ROOT, relative);
}

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

- [ ] **Step 2: Rewrite main() for final output format**

Replace the body of `main()` with:

```javascript
function main() {
  for (const src of [INDEX_PATH, NOT_FOUND_PATH, PROJECTS_PATH]) {
    if (!fs.existsSync(src)) {
      console.error(`Error: ${path.relative(ROOT, src)} not found. Run from project root.`);
      process.exit(1);
    }
  }

  const allRefs = [
    ...extractHtmlRefs(INDEX_PATH, 'index.html'),
    ...extractHtmlRefs(NOT_FOUND_PATH, '404.html'),
    ...extractJsonRefs(),
  ];

  const refSources = new Map();
  for (const { ref, source } of allRefs) {
    if (!refSources.has(ref)) refSources.set(ref, new Set());
    refSources.get(ref).add(source);
  }

  console.log(`Checking ${refSources.size} internal asset references...\n`);

  const results = [];
  for (const [ref, sources] of refSources) {
    const absolutePath = resolveRef(ref);
    const ok = assetExists(absolutePath);
    results.push({ ref, sources: [...sources], ok });
  }

  // Sort: OK first, broken at the bottom for visibility
  results.sort((a, b) => Number(b.ok) - Number(a.ok));

  let passed = 0;
  let failed = 0;
  for (const result of results) {
    const sourceList = result.sources.join(', ');
    if (result.ok) {
      console.log(`  ${GREEN}\u2713${RESET} ${result.ref} (${sourceList})`);
      passed++;
    } else {
      console.log(`  ${RED}\u2717${RESET} ${result.ref} (${sourceList})`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
```

Note: `\u2713` and `\u2717` are the unicode checkmark and X (matching the existing `check-links.js` which uses the same glyphs).

- [ ] **Step 3: Build first, then run**

Run: `npm run build`

Expected: build completes without error. `dist/main.<hash>.js` and `dist/style.<hash>.css` exist.

Run: `npm run check-assets`

Expected: all refs pass with ✓, exit 0, summary `Results: N passed, 0 failed` (N depends on current repo state, expected ~30).

If any ✗ appears on the current (presumably-clean) repo, fix the underlying issue before proceeding — this check must be green against `main` before it can gate CI.

- [ ] **Step 4: Verify lint still passes**

Run: `npm run lint:js`

Expected: clean pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-assets.js
git commit -m "feat: Add existence check with case-sensitivity parity"
```

---

## Task 5: Manual negative-path verification (no commit)

This task exercises the failure paths. Revert every temporary edit before moving on.

- [ ] **Step 1: Broken HTML ref test**

Edit `index.html` (any copy): find a line like `<img src="images/projects/rating-bot.webp" ...>` and change it to `rating-bott.webp` (insert a typo).

Run: `npm run check-assets`

Expected output includes a red `\u2717` line for `images/projects/rating-bott.webp (index.html)`, summary shows `1 failed`, exit code 1.

Revert the edit: `git checkout -- index.html`. Re-run `npm run check-assets` and confirm exit 0.

- [ ] **Step 2: Broken JSON ref test**

Edit `data/projects.json`: find any `"src": "images/projects/..."` and insert a typo in the filename.

Run: `npm run check-assets`

Expected: red ✗ line naming the typo path with source `(data/projects.json)`, exit 1.

Revert: `git checkout -- data/projects.json`. Re-run and confirm exit 0.

- [ ] **Step 3: Case-sensitivity parity test** (macOS/Windows only — Linux skips because `existsSync` already catches it)

Edit `index.html`: change `images/projects/rating-bot.webp` to `images/projects/Rating-bot.webp` (capitalize first letter of basename).

Run: `npm run check-assets`

Expected: on macOS/Windows, the `readdirSync` check catches the mismatch and emits ✗ even though `fs.existsSync` returns true. Exit 1.

Revert: `git checkout -- index.html`. Re-run and confirm exit 0.

- [ ] **Step 4: Homepage-nav exclusion test**

Verify that `404.html`'s `href="/"` and `href="/#about"` refs are not flagged. The current `npm run check-assets` run from Task 4 Step 3 already proves this — no commit needed, just sanity-confirm the output from that run listed zero `/` or `/#...` refs.

If any of Steps 1-3 behaved incorrectly, debug the script and re-run Task 4 Step 3 to confirm the current repo is still clean. Do not commit corrupted state.

---

## Task 6: Update CI workflow

**Files:**
- Modify: `.github/workflows/deploy.yml` (the `check-links` job only, lines ~75-89)

- [ ] **Step 1: Rewrite the check-links job**

Open `.github/workflows/deploy.yml`. Locate the `check-links:` job block. Replace the entire job (from `check-links:` line down to but not including the next top-level `test:` line) with:

```yaml
  check-links:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        env:
          HUSKY: 0

      - name: Download build output
        uses: actions/download-artifact@v4
        with:
          name: build-output

      - name: Check external links
        run: npm run check-links

      - name: Check internal assets
        run: npm run check-assets
```

Diff vs. previous version:
- `needs: lint` → `needs: build`
- Added `Install dependencies` (`npm ci`) step
- Added `Download build output` step (makes hashed `dist/` files available)
- Renamed the existing step to `Check external links` for clarity
- Added `Check internal assets` step

- [ ] **Step 2: Verify YAML validity**

Run: `node -e "require('js-yaml')"` — if this errors with "Cannot find module", install isn't needed; instead use a quick Node one-liner:

```bash
node -e "require('fs').readFileSync('.github/workflows/deploy.yml', 'utf8')"
```

Or simply inspect visually — YAML indentation is critical. The job block must use 2-space indentation consistent with the existing `lint:`, `build:`, etc. jobs.

If your editor has a YAML linter, run it on the file. Otherwise, GitHub's workflow parser will reject malformed YAML at push time.

- [ ] **Step 3: Confirm local build + check pipeline works end-to-end**

Run these in order:

```bash
npm run lint
npm run build
npm run check-links
npm run check-assets
```

Each must exit 0. Note: `npm run check-links` hits the network and may take ~10-20 seconds. If network is unavailable locally, skip that one command — it's already verified in prior CI runs and is not what this task changes.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: Run internal asset check alongside external links"
```

---

## Task 7: Document the new check in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (the `### Link Checker` subsection under "Key Patterns & Gotchas")

- [ ] **Step 1: Read the current Link Checker section**

Open `CLAUDE.md` and find the `### Link Checker (`scripts/check-links.js`)` heading. Read its 6 existing bullets to confirm style.

- [ ] **Step 2: Rename the heading and append internal-asset coverage**

Change the heading:

```markdown
### Link Checker (`scripts/check-links.js`)
```

to:

```markdown
### Link Checkers (`scripts/check-links.js` + `scripts/check-assets.js`)
```

Then, directly below the existing 6 bullets and above the next `###` heading, add a new paragraph (blank line separating it from the existing bullets):

```markdown
- **Internal asset check** (`scripts/check-assets.js`, `npm run check-assets`): scans `index.html`, `404.html`, and `data/projects.json` for `href`/`src` attributes and `screenshots[].src` values, resolves each against the repo root, and verifies existence via `fs.existsSync` + a `readdirSync` basename case match (catches case-mismatch refs that would fail on Linux CI but pass on macOS/Windows). Excludes: external URLs (`http(s)://`, `//`), `mailto:`/`tel:`, `data:` URIs, in-page anchors (`#foo`), and homepage-nav (`/`, `/#foo`). Requires `npm run build` to have run first so hashed `dist/` refs exist on disk.
- **CI job**: the `check-links` workflow job runs both checkers sequentially after `build` completes. Downloads the `build-output` artifact so internal-asset resolution sees the same hashed `dist/` files the deploy step will ship.
```

- [ ] **Step 3: Verify no broken references elsewhere in CLAUDE.md**

Search `CLAUDE.md` for any other mention of "Link Checker" or "check-links" to ensure nothing contradicts the updated scope:

Run: `grep -n "check-links\|Link Checker" CLAUDE.md`

Verify every mention is consistent with "both checkers run in the `check-links` CI job." The Build & Development Commands table at the top of the file lists `npm run check-links` — leave that line as-is (the command name is unchanged); the new `npm run check-assets` command is described in the Link Checker section.

Optional: add `npm run check-assets` to the Build & Development Commands table under `check-links` for completeness. If you do, mirror the existing format exactly.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: Document internal asset checker in CLAUDE.md"
```

---

## Task 8: Final pre-PR verification

**Files:**
- None modified. Verification only.

- [ ] **Step 1: Run the full local gate**

Run each in order. Every command must exit 0.

```bash
npm run lint
npm run build
npm run check-links
npm run check-assets
npm test
```

Expected: all green. If `npm test` surfaces a pre-existing flaky Firefox test (`tests/filter/accessibility.spec.js:44`), re-run once to confirm flake vs. regression — it's documented in BACKLOG.md line 865 as pre-existing.

- [ ] **Step 2: Inspect commit log**

Run: `git log --oneline main..HEAD`

Expected: 5-7 commits on the feature branch, each with a clear Conventional Commit subject (`feat:`, `ci:`, `docs:`). Subject lines <= 72 chars. No WIP/fixup commits.

- [ ] **Step 3: Confirm no stray changes**

Run: `git status`

Expected: working tree clean. If `docs/planning/WEEKLY.md` has an uncommitted change carried over from the branch creation, decide: stage + commit as part of task progress updates, or revert if it's pre-existing drift. Note: `WEEKLY.md` already had unstaged edits when the branch was created (weekday checkboxes reflecting completed work earlier in the week) — stage and commit those now with a `docs:` message so the branch doesn't carry uncommitted state into the PR.

```bash
git add docs/planning/WEEKLY.md
git commit -m "docs: Update weekly plan checkboxes"
```

- [ ] **Step 4: Task completion artifact updates**

Before creating the PR, update planning docs per the project's task-completion workflow (see CLAUDE.md "Task Completion" section):

1. Mark `Internal Asset Link Checking` as ✅ in `docs/planning/WEEKLY.md` line 84 (the `[ ]` Friday row).
2. Move the task summary from TODO's "In Progress" (if added) to `docs/planning/DONE.md` with a brief outcome summary and the plan path.
3. Extract follow-ups to `docs/planning/BACKLOG.md` under a new `## From Internal Asset Link Checking (2026-04-20)` section — minimum 2 items per CLAUDE.md convention. Expected items:
   - Shared HTML ref extractor (`scripts/lib/extract-refs.js`) if the two checkers' regex/filter logic begins to diverge
   - CSS `url(...)` scanning (deferred; YAGNI today)
   - Optional orphan detection (informational, non-blocking)
4. Archive the plan: move `docs/superpowers/plans/2026-04-20_internal-asset-link-checking.md` → `docs/archive/plans/2026-04-20_internal-asset-link-checking.md`. Also move the spec: `docs/superpowers/specs/2026-04-20_internal-asset-link-checking-design.md` → `docs/archive/specs/2026-04-20_internal-asset-link-checking-design.md`.
5. BACKLOG **Origin** lines MUST use `docs/archive/plans/...` (enforced by `scripts/validate-backlog-paths.js` pre-commit hook — using the old `docs/planning/plans/` or `docs/superpowers/` paths will block the commit).

- [ ] **Step 5: Commit planning doc updates**

```bash
git add docs/planning/WEEKLY.md docs/planning/DONE.md docs/planning/BACKLOG.md
git add docs/archive/plans/2026-04-20_internal-asset-link-checking.md
git add docs/archive/specs/2026-04-20_internal-asset-link-checking-design.md
git rm docs/superpowers/plans/2026-04-20_internal-asset-link-checking.md
git rm docs/superpowers/specs/2026-04-20_internal-asset-link-checking-design.md
git commit -m "docs: Task completion for internal asset link checking"
```

- [ ] **Step 6: Hand off to superpowers:finishing-a-development-branch**

Invoke `superpowers:finishing-a-development-branch` to open the PR. Expected flow: push branch, create PR with conventional title, fill description with the Summary and Test Plan template, request code review via `superpowers:requesting-code-review` once the bot has approved.

---

## Completion Criteria

All of the following must be true before PR merge:

- [x] `scripts/check-assets.js` created, ~100 LOC, JSDoc header, ANSI color output, dedup Map
- [x] `package.json` has `"check-assets": "node scripts/check-assets.js"`
- [x] `npm run check-assets` exits 0 against the current repo after `npm run build`
- [x] Manual negative tests (Task 5 Steps 1-3) all produce expected ✗ output + exit 1
- [x] `.github/workflows/deploy.yml` `check-links` job updated: `needs: build`, `npm ci`, download artifact, both checker steps
- [x] `CLAUDE.md` Link Checker section renamed + extended with internal-asset paragraph
- [x] `npm run lint`, `npm run build`, `npm run check-links`, `npm run check-assets`, `npm test` all green locally
- [x] Commit log is clean (Conventional Commits, <=72 char subjects)
- [x] Task completion workflow executed (Task 8 Step 4-5): WEEKLY/DONE/BACKLOG updated, plan and spec archived
