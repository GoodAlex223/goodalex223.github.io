# Archived-Doc Dead-Link Cleanup + Recurrence Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair all 19 dead `docs/superpowers/` navigational pointers across 8 archived plans, and add a CI/pre-commit guard that prevents the dead links from recurring.

**Architecture:** Three tasks. Task 1 adds `scripts/check-archived-links.js` (anchored nav-pointer regex + single-file allowlist) and its wiring; it goes RED against the current unfixed archive (19 violations). Task 2 performs the surgical sweep, turning the guard GREEN. Task 3 documents the guard in CLAUDE.md. Ships as one PR on branch `docs/archived-dead-links`.

**Tech Stack:** Node.js (CommonJS, in the style of `scripts/validate-backlog-paths.js`), husky pre-commit, GitHub Actions (`.github/workflows/deploy.yml`), git. Commands run via the Bash tool (git-bash on Windows).

## Global Constraints

- **Surgical edits only:** fix only navigational pointer lines (`**Spec:**` header, footer `Spec:`/`Plan:`/`Pass 1…:`, `**Design spec**:` cross-ref). Never rewrite historical command/record text (`git add docs/superpowers/…`, `Create:`, `ls`), the validator denylist literal, classification-spec backlog-title quotes, or the external `rating_bot` ref.
- **Rewrite targets the real archived file:** spec refs → `docs/archive/specs/`, a plan's own `Plan:` self-ref → `docs/archive/plans/`. Normalize hyphen dates → underscore so the link resolves to the file that exists. Preserve each line's existing markup (backticks stay backticks; markdown links keep `[label](href)` form with both corrected).
- **Allowlist:** `docs/archive/plans/2026-03-27_archive-cleanup.md` is exempt (its 7 superpowers refs document the migration itself).
- **Guard not folded into `npm run lint`:** it is a separate npm script run in the CI `lint` *job* and the husky hook, matching `validate-backlog` / `check-backlog-structure`.
- **Verification is manual-reproduction:** the repo has no `scripts/` unit-test harness (Group C precedent, 2026-06-14). This deviates from global TDD-first and is justified by that precedent.
- **Conventional Commits** (commitlint + husky): types `build`, `docs`, etc.; 72-char header max.
- **Branch base already in place:** `76f3f8b` (chore: auto-memory cleanup) and `71c6586` (docs: spec) are committed; working tree is clean.

---

### Task 1: Guard script + wiring

**Files:**
- Create: `scripts/check-archived-links.js`
- Modify: `package.json` (scripts block, after the `check-backlog-structure` entry)
- Modify: `.github/workflows/deploy.yml` (lint job, after the "Check BACKLOG structure" step ~line 45)
- Modify: `.husky/pre-commit` (append a conditional block after the existing BACKLOG `fi`)

**Interfaces:**
- Produces: `scripts/check-archived-links.js` — a standalone Node script, no exports. Exit 0 + `Archived-doc links: OK` (or `skipped`) on success; exit 1 + red violation block on failure. npm alias `check-archived-links`.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Write the guard script**

Create `scripts/check-archived-links.js` with exactly this content:

```js
/**
 * Validates that archived docs (docs/archive/**) contain no dead navigational
 * pointers to docs/superpowers/. Plans and specs are authored in
 * docs/superpowers/<plans|specs>/ then archived to docs/archive/<plans|specs>/;
 * their internal Spec:/Plan:/Pass 1:/Design spec: pointers must be retargeted to
 * the archived location during archival. This guard catches the ones that slip
 * through and prevents recurrence. Reads the working tree (a directory scan; the
 * pre-commit conditional only fires when docs/archive/ files are staged, so the
 * on-disk content it reads is what is about to be committed). Invoked by the
 * pre-commit hook, the npm script, and CI.
 *
 * Spec: docs/archive/specs/2026-06-17_archived-doc-dead-links-design.md
 */

const fs = require('fs');
const path = require('path');

const ARCHIVE_REL_DIR = 'docs/archive';
const FORBIDDEN = 'docs/superpowers/';

// Files exempt from the check: genuinely-historical docs whose docs/superpowers/
// references document the superpowers -> archive migration itself and must not
// be rewritten. Repo-relative, POSIX-style paths. Add a file here only when its
// superpowers refs are genuinely historical, not stale navigational pointers.
const ALLOWED_FILES = ['docs/archive/plans/2026-03-27_archive-cleanup.md'];

// A navigational pointer line: a Spec:/Plan:/Pass 1...:/Design spec: label at the
// start of the line (after optional blockquote, bullet, and ** markup). Command
// text (git add ..., ls ...), prose, table cells, and denylist literals do not
// start with such a label and are therefore left untouched.
const NAV_POINTER =
  /^\s*(?:>\s*)?(?:[-*]\s*)?(?:\*\*)?(?:Spec|Plan|Pass 1[^:]*|Design spec)(?:\*\*)?\s*:/;

function listMarkdownFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // dir missing or unreadable — caller handles "skipped"
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

const repoRoot = path.join(__dirname, '..');
const archiveDir = path.join(repoRoot, ARCHIVE_REL_DIR);

if (!fs.existsSync(archiveDir)) {
  console.log('Archived-doc links: skipped (docs/archive/ not present)');
  process.exit(0);
}

const violations = [];
for (const file of listMarkdownFiles(archiveDir)) {
  const relPath = path.relative(repoRoot, file).split(path.sep).join('/');
  if (ALLOWED_FILES.includes(relPath)) continue;
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, index) => {
    if (NAV_POINTER.test(line) && line.includes(FORBIDDEN)) {
      violations.push({ file: relPath, line: index + 1, content: line.trim() });
    }
  });
}

if (violations.length > 0) {
  console.error('\x1b[31mArchived-doc dead-link validation failed:\x1b[0m\n');
  violations.forEach((v) => {
    console.error(`  ${v.file}:${v.line} — ${v.content}`);
  });
  console.error(
    `\n\x1b[33mArchived docs must not point navigational links (Spec:/Plan:/Pass 1:/Design spec:) at ${FORBIDDEN}\x1b[0m`
  );
  console.error(
    'Fix: retarget each to docs/archive/specs/ (specs) or docs/archive/plans/ (plans) with an underscore date.\n'
  );
  process.exit(1);
}

console.log('Archived-doc links: OK');
```

- [ ] **Step 2: Add the npm script**

In `package.json`, add the alias immediately after the `"check-backlog-structure"` line:

```json
    "check-backlog-structure": "node scripts/check-backlog-structure.js",
    "check-archived-links": "node scripts/check-archived-links.js",
```

- [ ] **Step 3: Run the guard against the current archive — expect RED (the failing test)**

Run: `npm run check-archived-links`
Expected: exit 1; red header `Archived-doc dead-link validation failed:`; **exactly 19** violation lines across 8 files:
- `docs/archive/plans/2026-04-05_automated-link-checking.md:11`
- `docs/archive/plans/2026-04-16_code-quality.md:11`
- `docs/archive/plans/2026-04-20_internal-asset-link-checking.md:11`
- `docs/archive/plans/2026-04-28_test-stability-investigations.md:11, 581, 582`
- `docs/archive/plans/2026-05-02_asset-checker-polish.md:11`
- `docs/archive/plans/2026-05-09_ci-deadline-docs.md:598, 599`
- `docs/archive/plans/2026-05-16_scroll-animation-deterministic-polling.md:11`
- `docs/archive/plans/2026-06-07_backlog-restructure.md:11, 280, 445, 446, 525, 557, 723, 767, 768`

Count check: `npm run check-archived-links 2>&1 | grep -c ' — '` → `19`.

- [ ] **Step 4: Verify the allowlist is actively excluding the migration record**

Prove the allowlist is load-bearing (the migration record HAS matching nav-pointers, yet the guard does not report it):

```bash
# (a) the migration record contains nav-pointers to superpowers that the regex matches:
grep -nE '^[[:space:]]*(>[[:space:]]*)?([-*][[:space:]]*)?(\*\*)?(Spec|Plan|Pass 1[^:]*|Design spec)(\*\*)?[[:space:]]*:' \
  docs/archive/plans/2026-03-27_archive-cleanup.md | grep -c 'docs/superpowers'   # expect 7
# (b) ...but the guard output never mentions it, because it is allowlisted:
npm run check-archived-links 2>&1 | grep -c '2026-03-27_archive-cleanup'          # expect 0
```
Expected: `7` then `0` — the 7 would-be violations are actively suppressed by `ALLOWED_FILES` (no temp files, real script untouched).

- [ ] **Step 5: Wire the guard into CI**

In `.github/workflows/deploy.yml`, add a step to the `lint` job immediately after the "Check BACKLOG structure" step:

```yaml
      - name: Check BACKLOG structure
        run: npm run check-backlog-structure

      - name: Check archived-doc links
        run: npm run check-archived-links
```

- [ ] **Step 6: Wire the guard into the pre-commit hook**

Append to `.husky/pre-commit` (after the existing BACKLOG `fi`), using the `if/fi` pattern (not `&&`) so a no-match exit never aborts unrelated commits:

```sh
npx lint-staged || exit 1
if git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$'; then
  npm run validate-backlog || exit 1
  npm run check-backlog-structure || exit 1
fi
if git diff --cached --name-only | grep -qE '^docs/archive/'; then
  npm run check-archived-links || exit 1
fi
```

- [ ] **Step 7: Lint the new script**

Run: `npm run lint:js`
Expected: PASS (no errors). The script follows the same CommonJS style as `scripts/validate-backlog-paths.js`, which already passes the `scripts/` ESLint environment.

- [ ] **Step 8: Commit**

The guard is intentionally RED against the archive right now; that is fixed in Task 2. This commit stages only script/config files (no `docs/archive/` files), so the pre-commit guard does not fire on it.

```bash
git add scripts/check-archived-links.js package.json .github/workflows/deploy.yml .husky/pre-commit
git commit -m "build: add archived-doc dead-link guard + wiring"
```

---

### Task 2: Surgical 8-file sweep

**Files (all under `docs/archive/plans/`):**
- Modify: `2026-04-05_automated-link-checking.md:11`
- Modify: `2026-04-16_code-quality.md:11`
- Modify: `2026-04-20_internal-asset-link-checking.md:11`
- Modify: `2026-04-28_test-stability-investigations.md:11,581,582`
- Modify: `2026-05-02_asset-checker-polish.md:11`
- Modify: `2026-05-09_ci-deadline-docs.md:598,599`
- Modify: `2026-05-16_scroll-animation-deterministic-polling.md:11`
- Modify: `2026-06-07_backlog-restructure.md:11,280,445,446,525,557,723,767,768`

**Interfaces:**
- Consumes: the guard from Task 1 (used to verify GREEN at the end).
- Produces: a clean archive (0 nav-pointers to `docs/superpowers/` outside the allowlist).

Each edit below is an exact `old_string` → `new_string`. Apply with the Edit tool. Read each file first if the tool requires it.

- [ ] **Step 1: Fix `2026-04-05_automated-link-checking.md`**

old: `` **Spec:** `docs/superpowers/specs/2026-04-05-automated-link-checking-design.md` ``
new: `` **Spec:** `docs/archive/specs/2026-04-05_automated-link-checking-design.md` ``
(Note: `superpowers`→`archive` **and** hyphen date `2026-04-05-`→underscore `2026-04-05_`.)

- [ ] **Step 2: Fix `2026-04-16_code-quality.md`**

old: `` **Spec:** `docs/superpowers/specs/2026-04-16_code-quality-design.md` ``
new: `` **Spec:** `docs/archive/specs/2026-04-16_code-quality-design.md` ``

- [ ] **Step 3: Fix `2026-04-20_internal-asset-link-checking.md` (label only — href already correct)**

old: `**Spec:** [docs/superpowers/specs/2026-04-20_internal-asset-link-checking-design.md](../specs/2026-04-20_internal-asset-link-checking-design.md)`
new: `**Spec:** [docs/archive/specs/2026-04-20_internal-asset-link-checking-design.md](../specs/2026-04-20_internal-asset-link-checking-design.md)`
(Only the bracketed display text changes; the `(../specs/…)` href is already valid.)

- [ ] **Step 4: Fix `2026-04-28_test-stability-investigations.md` (3 lines)**

Edit 4a — old: `` **Spec:** `docs/superpowers/specs/2026-04-28_test-stability-investigations-design.md` ``
new: `` **Spec:** `docs/archive/specs/2026-04-28_test-stability-investigations-design.md` ``

Edit 4b — old: `Spec: docs/superpowers/specs/2026-04-28_test-stability-investigations-design.md`
new: `Spec: docs/archive/specs/2026-04-28_test-stability-investigations-design.md`

Edit 4c — old: `Plan: docs/superpowers/plans/2026-04-28_test-stability-investigations.md`
new: `Plan: docs/archive/plans/2026-04-28_test-stability-investigations.md`

- [ ] **Step 5: Fix `2026-05-02_asset-checker-polish.md`**

old: `` **Spec:** `docs/superpowers/specs/2026-05-02-asset-checker-polish-design.md` ``
new: `` **Spec:** `docs/archive/specs/2026-05-02_asset-checker-polish-design.md` ``
(Hyphen date `2026-05-02-`→underscore.)

- [ ] **Step 6: Fix `2026-05-09_ci-deadline-docs.md` (2 lines)**

Edit 6a — old: `- Spec: [docs/superpowers/specs/2026-05-09-ci-deadline-docs-design.md](docs/superpowers/specs/2026-05-09-ci-deadline-docs-design.md)`
new: `- Spec: [docs/archive/specs/2026-05-09_ci-deadline-docs-design.md](docs/archive/specs/2026-05-09_ci-deadline-docs-design.md)`
(Both label and href; hyphen dates → underscore.)

Edit 6b — old: `- Plan: [docs/superpowers/plans/2026-05-09-ci-deadline-docs.md](docs/superpowers/plans/2026-05-09-ci-deadline-docs.md)`
new: `- Plan: [docs/archive/plans/2026-05-09_ci-deadline-docs.md](docs/archive/plans/2026-05-09_ci-deadline-docs.md)`

- [ ] **Step 7: Fix `2026-05-16_scroll-animation-deterministic-polling.md`**

old: `` **Spec:** `docs/superpowers/specs/2026-05-16_scroll-animation-deterministic-polling-design.md` ``
new: `` **Spec:** `docs/archive/specs/2026-05-16_scroll-animation-deterministic-polling-design.md` ``

- [ ] **Step 8: Fix `2026-06-07_backlog-restructure.md` (9 lines via 6 edits)**

Edit 8a (line 11) — old: `` **Spec:** `docs/superpowers/specs/2026-06-07_backlog-restructure-design.md` (committed as `607cef9`). ``
new: `` **Spec:** `docs/archive/specs/2026-06-07_backlog-restructure-design.md` (committed as `607cef9`). ``

Edit 8b (line 280) — old: `**Design spec**: See [docs/superpowers/specs/2026-06-07_backlog-restructure-design.md](../superpowers/specs/2026-06-07_backlog-restructure-design.md)`
new: `**Design spec**: See [docs/archive/specs/2026-06-07_backlog-restructure-design.md](../specs/2026-06-07_backlog-restructure-design.md)`
(Both label and href; href `../superpowers/specs/` → `../specs/` which resolves to `docs/archive/specs/` from `docs/archive/plans/`.)

Edit 8c (lines 445, 525, 557, 723 — **use `replace_all: true`**) — old: `Spec: docs/superpowers/specs/2026-06-07_backlog-restructure-design.md`
new: `Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md`
(This exact substring appears bare at 445/525/723 and as the tail of the ` * Spec:` block-comment line 557 — `replace_all` fixes all four. It does NOT touch line 11 (`Spec:** \`docs…`) or line 767 (`Spec: \`docs…` with backtick), whose surrounding text differs.)

Edit 8d (line 446) — old: `Pass 1: docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md`
new: `Pass 1: docs/archive/specs/2026-06-07_backlog-restructure-classification.md`

Edit 8e (line 767) — old: `` - Spec: `docs/superpowers/specs/2026-06-07_backlog-restructure-design.md` ``
new: `` - Spec: `docs/archive/specs/2026-06-07_backlog-restructure-design.md` ``

Edit 8f (line 768) — old: `` - Pass 1 classification (user-audited): `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` ``
new: `` - Pass 1 classification (user-audited): `docs/archive/specs/2026-06-07_backlog-restructure-classification.md` ``

- [ ] **Step 9: Verify the guard is now GREEN**

Run: `npm run check-archived-links`
Expected: exit 0; `Archived-doc links: OK`.

- [ ] **Step 10: Verify all rewrite targets actually exist**

```bash
for f in \
  docs/archive/specs/2026-04-05_automated-link-checking-design.md \
  docs/archive/specs/2026-04-16_code-quality-design.md \
  docs/archive/specs/2026-04-20_internal-asset-link-checking-design.md \
  docs/archive/specs/2026-04-28_test-stability-investigations-design.md \
  docs/archive/specs/2026-05-02_asset-checker-polish-design.md \
  docs/archive/specs/2026-05-09_ci-deadline-docs-design.md \
  docs/archive/specs/2026-05-16_scroll-animation-deterministic-polling-design.md \
  docs/archive/specs/2026-06-07_backlog-restructure-design.md \
  docs/archive/specs/2026-06-07_backlog-restructure-classification.md \
  docs/archive/plans/2026-04-28_test-stability-investigations.md \
  docs/archive/plans/2026-05-09_ci-deadline-docs.md ; do
  test -f "$f" && echo "OK  $f" || echo "MISSING  $f";
done
```
Expected: every line prints `OK` (no `MISSING`).

- [ ] **Step 11: Verify historical refs were left untouched**

```bash
# These intentional refs MUST still be present (count > 0 each):
grep -c 'git add docs/superpowers' docs/archive/plans/2026-06-07_backlog-restructure.md
grep -c 'forbids `docs/planning/plans/` and `docs/superpowers/`' docs/archive/specs/2026-06-07_backlog-restructure-design.md
grep -c 'rating_bot' docs/archive/specs/2026-06-07_backlog-restructure-design.md
grep -c 'docs/superpowers' docs/archive/plans/2026-03-27_archive-cleanup.md   # migration record, expect 47
```
Expected: first three ≥ 1; last = 47 (migration record fully preserved).

- [ ] **Step 12: Commit**

```bash
git add docs/archive/
git commit -m "docs: retarget dead superpowers links in archived plans"
```
(The pre-commit guard fires here because `docs/archive/` files are staged — it must pass, confirming the sweep is complete.)

---

### Task 3: Document the guard in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (Key Patterns & Gotchas section — insert a new `###` subsection immediately before `### Shell Gotchas`)

**Interfaces:**
- Consumes: the guard's behavior from Task 1 (rule, allowlist, wiring) — documents it.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Insert the documentation subsection**

In `CLAUDE.md`, find the line `### Shell Gotchas` and insert the following block immediately **before** it (keep one blank line on each side):

```markdown
### Archived-Doc Link Hygiene (`scripts/check-archived-links.js`)
- Plans/specs are authored in `docs/superpowers/<plans|specs>/` then archived to `docs/archive/<plans|specs>/`; their internal navigational pointers (`**Spec:**` header, footer `Spec:`/`Plan:`/`Pass 1:`, `**Design spec**:` cross-ref) must be retargeted to the archived location with an **underscore** date during archival. `check-archived-links.js` scans `docs/archive/**/*.md` (working-tree read) and fails on any nav-pointer line still pointing at `docs/superpowers/`
- **Nav-pointer detection is anchored**: `/^\s*(?:>\s*)?(?:[-*]\s*)?(?:\*\*)?(?:Spec|Plan|Pass 1[^:]*|Design spec)(?:\*\*)?\s*:/` — only lines that START (after optional blockquote/bullet/`**`) with a `Spec:`/`Plan:`/`Pass 1…:`/`Design spec:` label are checked. Historical command text (`git add docs/superpowers/…`), the `validate-backlog-paths.js` denylist literal, table-cell backlog-title quotes, and external-repo refs are intentionally NOT flagged
- **Allowlist**: `ALLOWED_FILES = ['docs/archive/plans/2026-03-27_archive-cleanup.md']` — the migration record whose `docs/superpowers/` references document the consolidation itself. Add a file here only when its superpowers refs are genuinely historical, not stale pointers
- Runs three ways: pre-commit hook (when any `docs/archive/` file is staged, via the `if/fi` pattern), `npm run check-archived-links` (standalone), and the CI `lint` job. Prints `Archived-doc links: OK`, a `skipped` note if `docs/archive/` is absent, or a red violation block (`path:line — <text>`) on failure
```

- [ ] **Step 2: Verify CLAUDE.md is coherent**

Run: `grep -n "Archived-Doc Link Hygiene" CLAUDE.md`
Expected: one match, positioned just before the `### Shell Gotchas` line (`grep -n "### Shell Gotchas" CLAUDE.md` shows a higher line number).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document archived-doc link guard in CLAUDE.md"
```

---

## Verification (whole-branch, before PR)

- [ ] `npm run check-archived-links` → `Archived-doc links: OK`
- [ ] `npm run lint` → passes (CSS + JS)
- [ ] `npm run validate-backlog` → `BACKLOG Origin paths: OK`
- [ ] `npm run check-backlog-structure` → `BACKLOG structure: OK`
- [ ] `git log --oneline` shows: `chore` (76f3f8b) → `docs(specs)` (71c6586) → `build` (guard) → `docs` (sweep) → `docs` (CLAUDE.md)
- [ ] No `docs/archive/` nav-pointer references `docs/superpowers/` (re-run the guard); the `2026-03-27` migration record and all historical command text remain unchanged.

## Out of scope / non-goals

- The upstream `superpowers:writing-plans` / `superpowers:brainstorming` skill templates (plugin cache, out of repo) — replaced by the repo-local guard.
- `docs/archive/plans/2026-03-27_archive-cleanup.md` (allowlisted migration record) and `docs/archive/plans/2026-05-06_backlog-validator-hardening.md:489` (execution-handoff prose, not a nav-pointer).
- Reading the git index instead of the working tree in the guard (deferred for simplicity; documented in the script header).

## Notes

- This plan's own `**Spec:**` link (header below the title is omitted; the spec is referenced in commit bodies) and the task-completion archival will move both this plan and its spec into `docs/archive/` — the spec pointer used in commit messages is written in final archive form (`docs/archive/specs/2026-06-17_archived-doc-dead-links-design.md`) so the archived copies ship guard-clean (dogfooding the new convention).
