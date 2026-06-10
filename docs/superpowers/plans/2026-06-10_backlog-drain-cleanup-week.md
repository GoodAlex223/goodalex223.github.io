# Backlog Drain & Cleanup-Week Bootstrapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drain the 🟤 bucket by pruning the 31 verified-done "prune-on-audit candidates" from BACKLOG.md, and record Cleanup Week #1 with a durable recalibration baseline.

**Architecture:** Two parts. Part 1 (Tasks 1–6) audits each candidate row against current code/file state (the deciding evidence), prunes confirmed-done items, and re-runs the BACKLOG guards after each cluster. Part 2 (Tasks 7–8) creates `docs/planning/cleanup-week-log.md`, indexes it, and records closeout in DONE.md + WEEKLY.md.

**Tech Stack:** Markdown planning docs; `npm run validate-backlog` + `npm run check-backlog-structure` + `npm run lint` guards; git; Grep/Read for evidence.

---

## Spec

[docs/superpowers/specs/2026-06-10_backlog-drain-cleanup-week-design.md](../specs/2026-06-10_backlog-drain-cleanup-week-design.md)

## Authoritative inputs

- Time-box (the 31 rows): classification artifact Audit sign-off, line 376 — [docs/archive/specs/2026-06-07_backlog-restructure-classification.md](../../archive/specs/2026-06-07_backlog-restructure-classification.md)
- Completion evidence: [docs/planning/DONE.md](../../planning/DONE.md) + git history + the live code/config files.

## Conventions for every task

- **Edit BACKLOG by item identity** (section header + item text), NOT line number — each prune shifts the numbers below it.
- **Prune** = delete the `- [ ]` line. If that empties its `### From …` sub-header, delete the header (and its `**Origin**` line) too. **Never** delete a `## 🔵/🟡/🟤` or `## 📌` bucket header.
- **Keep + annotate** = leave the line, append ` *(audited 2026-06-10: <reason>)*`.
- Preserve **exact indentation** when deleting — the modal rows (1–5) and the i18n/media rows are 2-space-indented (`  - [ ]`); most others are column-0 (`- [ ]`).
- Dispositions below are **hypotheses to confirm**, not assumptions. If evidence does NOT confirm "done," keep + annotate instead of pruning, and note it for the user.
- Maintain a running **prune tally by bucket** (🟤 / 🔵 / 🟡) — Task 7 needs it.

## File Structure

| File | Responsibility | Tasks |
|----|----|----|
| `docs/planning/BACKLOG.md` (modify) | Remove verified-done `- [ ]` rows + emptied sub-headers; bump "Last Updated" | 2–6 |
| `docs/planning/cleanup-week-log.md` (create) | Durable Cleanup-Week ledger; Cleanup Week #1 entry | 7 |
| `docs/README.md` (modify) | Index the new log in the Planning & Tasks table | 7 |
| `docs/planning/DONE.md` (modify) | New `## 2026-06-10` Backlog Drain completion entry | 8 |
| `docs/planning/WEEKLY.md` (modify) | Group A status ⏳ → ✅ (Summary Table + Monday) | 8 |

---

### Task 1: Pre-drain baseline

**Files:** none modified (measurement only).

- [ ] **Step 1: Record the pre-drain baseline**

Pre-drain open-item counts (authoritative, from the classification artifact "Items per source" + 3 promotions): **🔵 72 · 🟡 16 · 🟤 149 · total 237.** Note these in your working notes — Task 7 compares against them.

- [ ] **Step 2: Sanity-check the total against the live file**

Run:
```bash
git grep -c -E '^\s*- \[ \]' HEAD -- docs/planning/BACKLOG.md
```
Expected: ~237 (small drift is fine; if wildly off, stop and reconcile before pruning).

- [ ] **Step 3: Initialize the prune tally**

Start a tally you carry through Tasks 2–6: `pruned 🟤=0 🔵=0 🟡=0`, plus a `kept+annotated` list.

---

### Task 2: Audit & prune — Modal cluster (rows 1–5)

**Files:** Modify `docs/planning/BACKLOG.md`.

Candidate rows and evidence:

| Row | Bucket | BACKLOG item (exact text to match) | Verify | Expect |
|----|----|----|----|----|
| 1 | 🟤 | `Data structure decision (JSON file vs data attributes vs JS object)` | `data/projects.json` exists & is the modal store (DONE.md CHALLENGE-002) | prune |
| 2 | 🟤 | `Accessibility: focus trap, ESC to close, aria-modal, restore focus` | Grep `js/main.js` for the modal focus trap / ESC / aria-modal / focus restore | prune |
| 3 | 🟡 | `Lazy-load media to maintain <200KB initial page load` | Grep `js/main.js` for lazy screenshot loading (`loading`/`lazy`) | prune (dup row 46 survives) |
| 4 | 🔵 | `Mobile-friendly modal UX` | Grep `css/modal.css` for `@media` responsive breakpoints | **judgment** → prune if responsive modal confirmed |
| 5 | 🔵 | `Clear visual hint that cards are clickable (hover state, "View details")` | Grep `index.html` for `details-btn` / "View Details" buttons | prune |

- [ ] **Step 1: Verify rows 1–5**

Run (each confirms "shipped"):
```bash
test -f data/projects.json && echo "row1: data store exists"
grep -nE 'aria-modal|Escape|focus|tabindex' js/main.js | grep -i modal | head
grep -nE 'loading|lazy' js/main.js | head
grep -nE '@media' css/modal.css | head
grep -nE 'details-btn|View Details|aria-haspopup="dialog"' index.html | head
```
Expected: row 1 store exists; row 2 modal focus-trap/ESC/aria present; row 3 lazy present; row 4 `@media` blocks present in modal.css; row 5 details buttons present. For row 4 (judgment): if `css/modal.css` has responsive `@media` rules, the "mobile-friendly modal UX" deliverable shipped → prune; if genuinely thin, keep + annotate.

- [ ] **Step 2: Prune confirmed rows**

In the **🟤 Auto-Generated** bucket, the sub-header `### From Project Detail Modal (2026-01-22)` contains ONLY rows 1 & 2 (2-space-indented). If both confirmed, delete the whole block:
```
### From Project Detail Modal (2026-01-22)

  - [ ] Data structure decision (JSON file vs data attributes vs JS object)
  - [ ] Accessibility: focus trap, ESC to close, aria-modal, restore focus
```
In the **🟡 Operational** bucket, `### From Project Detail Modal (2026-01-22)` contains ONLY row 3. If pruned, delete the whole block:
```
### From Project Detail Modal (2026-01-22)

  - [ ] Lazy-load media to maintain <200KB initial page load
```
In the **🔵 User-Flagged** bucket, `### From Project Detail Modal (2026-01-22)` contains rows 4 & 5. If BOTH pruned, delete the whole block; if row 4 kept, delete only the row-5 line:
```
### From Project Detail Modal (2026-01-22)

  - [ ] Mobile-friendly modal UX
  - [ ] Clear visual hint that cards are clickable (hover state, "View details")
```

- [ ] **Step 3: Bump BACKLOG "Last Updated"**

Change line 5 from `**Last Updated**: 2026-06-08 (restructure — source-split + pinned process rules)` to `**Last Updated**: 2026-06-10 (Cleanup Week #1 — verify-and-prune drain)`.

- [ ] **Step 4: Run the guards**

Run:
```bash
npm run validate-backlog && npm run check-backlog-structure
```
Expected: `BACKLOG Origin paths: OK` and the structure check passes (4 required headers present).

- [ ] **Step 5: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs(backlog): prune verified-done modal items (rows 1-5)"
```
Update the tally (e.g. `🟤+2 🔵+2 🟡+1` if all five pruned).

---

### Task 3: Audit & prune — Shipped features/perf cluster (rows 10, 11, 22, 87, 115, 148)

**Files:** Modify `docs/planning/BACKLOG.md`.

| Row | Bucket | Item (match text) | Verify | Expect |
|----|----|----|----|----|
| 10 | 🔵 | `URL hash-based filtering — Allow shareable links like` | Grep `js/main.js` for `applyHashFilter` / `#filter` | prune |
| 11 | 🔵 | `Add Open Graph image for social sharing` | `og-image.png` exists + `og:image` in index.html | prune |
| 22 | 🟤 | `Inline critical CSS — Inline above-the-fold styles` | `scripts/inline-css.js` exists (PERF-006) | prune |
| 87 | 🔵 | `Add automated link checking` | `scripts/check-links.js` exists (DONE 2026-04-05) | prune |
| 115 | 🟡 | `Size trend history (append to size-history.json)` | `docs/size-history.json` exists (PERF-009) | prune |
| 148 | 🟤 | `Pre-existing axe-scan flakiness in scroll animation timing` | Grep `tests/utils/timing.js` for `waitForScrollAnimations` (PR #71) | prune |

- [ ] **Step 1: Verify rows**

```bash
grep -nE 'applyHashFilter|#filter|hash' js/main.js | head
test -f og-image.png && grep -n 'og:image' index.html | head
test -f scripts/inline-css.js && echo "row22 ok"
test -f scripts/check-links.js && echo "row87 ok"
test -f docs/size-history.json && echo "row115 ok"
grep -n 'waitForScrollAnimations' tests/utils/timing.js | head
```
Expected: all present ⇒ all six prune.

- [ ] **Step 2: Prune confirmed rows**

- **Row 10** — 🔵 bucket, sub-header `### From LP-001: Project Filtering (2026-01-28)` contains ONLY row 10. Delete the whole block:
```
### From LP-001: Project Filtering (2026-01-28)

- [ ] URL hash-based filtering — Allow shareable links like `#filter=backend`
```
- **Row 11** — 🔵 bucket, under `### From Enhancements: Visual` (rows 12, 13 remain). Delete only:
```
- [ ] Add Open Graph image for social sharing
```
- **Row 22** — 🟤 bucket, sub-header `### From PERF-002: Font Preload Hint (2026-02-02)` contains ONLY row 22. Delete the whole block (header + Origin + item):
```
### From PERF-002: Font Preload Hint (2026-02-02)
**Origin**: docs/archive/plans/2026-02-02_perf-002-font-preload-hint.md

- [ ] Inline critical CSS — Inline above-the-fold styles in `<head>` and load full CSS asynchronously for faster first paint
```
- **Row 87** — 🔵 bucket, under `### From Technical Debt` (row 88 "Create development build script" remains). Delete only:
```
- [ ] Add automated link checking
```
- **Row 115** — 🟡 bucket, under `### From PERF-008: Build Size Reporting (2026-02-25)` (rows 116, 117 remain). Delete only:
```
- [ ] Size trend history — Append build sizes to `docs/size-history.json` after each build for historical trend visibility (original task description goal: "visibility into asset growth over time")
```
- **Row 148** — 🟤 bucket, sub-header `### From CHALLENGE-003: Contact Form (2026-03-21)` contains ONLY row 148. Delete the whole block (header + Origin + item):
```
### From CHALLENGE-003: Contact Form (2026-03-21)
**Origin**: docs/archive/plans/2026-03-21_challenge-003-contact-form.md

- [ ] Pre-existing axe-scan flakiness in scroll animation timing — `waitForScrollAnimations(700ms)` is sometimes insufficient across browsers; consider a deterministic wait (e.g., polling `is-visible` class) instead of a fixed timeout
```

- [ ] **Step 3: Run the guards**

```bash
npm run validate-backlog && npm run check-backlog-structure
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs(backlog): prune verified-done feature/perf items"
```
Update tally (`🟤+2 🔵+2 🟡+1` if all six pruned).

---

### Task 4: Audit & prune — Lint/commit tooling cluster (rows 105, 122, 126, 127, 129)

**Files:** Modify `docs/planning/BACKLOG.md`.

| Row | Bucket | Item (match text) | Verify | Expect |
|----|----|----|----|----|
| 105 | 🟤 | `commitlint for conventional commits` | `commitlint.config.js` + `.husky/commit-msg` exist (QUALITY-010) | prune |
| 122 | 🟤 | `Fix `.gitignore` missing trailing newline (confidence 0/100)` | Read `.gitignore`; check it ends with a newline | **verify** → prune if fixed/moot |
| 126 | 🟤 | `Add `eslint-plugin-playwright`` | Grep `package.json` for `eslint-plugin-playwright` (QUALITY-009) | prune |
| 127 | 🟤 | `Add `no-console` rule for browser code` | Grep `eslint.config.js` for `no-console` | prune |
| 129 | 🟤 | `Fix `9b.` numbering in CLAUDE.md Build System Pattern list` | Grep `CLAUDE.md` for `Build System Pattern` (section removed → moot) | prune-as-moot |

- [ ] **Step 1: Verify rows**

```bash
test -f commitlint.config.js && test -f .husky/commit-msg && echo "row105 ok"
tail -c 40 .gitignore | xxd | tail -3   # row122: confirm trailing newline present
grep -n 'eslint-plugin-playwright' package.json eslint.config.js | head
grep -n 'no-console' eslint.config.js | head
grep -n 'Build System Pattern' CLAUDE.md | head   # row129: expect NO match → moot
```
Expected: rows 105/126/127 present ⇒ prune. Row 122: if `.gitignore` ends with a newline (or `.lighthouseci/` is not the final line), the issue is resolved/moot ⇒ prune; else keep + annotate. Row 129: `grep` returns nothing (the "Build System Pattern" numbered list was removed per DONE.md 2026-04-03) ⇒ the `9b.` fix is moot ⇒ prune-as-moot.

- [ ] **Step 2: Prune confirmed rows**

- **Row 105** — 🟤 bucket, under `### From QUALITY-004: Pre-commit Hook with Husky (2026-02-17)` (row 104 "Extend lint-staged with Prettier" remains). Delete only:
```
- [ ] commitlint for conventional commits — Add `@commitlint/cli` with `commit-msg` husky hook to enforce conventional commit message format (feat:, fix:, docs:, etc.)
```
- **Row 122** (if confirmed) — 🟤 bucket, under `### From CHALLENGE-001: Lighthouse CI in GitHub Actions (2026-03-11)` (row 121 "Explicit Chrome install" remains). Delete only:
```
- [ ] Fix `.gitignore` missing trailing newline — File lacks trailing newline after `.lighthouseci/` entry; pre-existing issue carried forward (code review finding, confidence 0/100)
```
- **Rows 126 & 127** — 🟤 bucket, sub-header `### From QUALITY-007: ESLint Integration (2026-03-12)` contains ONLY rows 126 & 127. If both confirmed, delete the whole block (header + Origin + both items):
```
### From QUALITY-007: ESLint Integration (2026-03-12)
**Origin**: docs/archive/plans/2026-03-12_quality-007-eslint.md

- [ ] Add `eslint-plugin-playwright` — Playwright-specific rules for test files (e.g., `no-conditional-in-test`, `prefer-web-first-assertions`)
- [ ] Add `no-console` rule for browser code — `warn` level for `js/**/*.js` to catch accidental console.log in production code
```
- **Row 129** — 🟤 bucket, under `### From QUALITY-007 Code Review (2026-03-12)` (rows 128 "Remove stale plan copy" and 130 "Update deploy job description" remain). Delete only:
```
- [ ] Fix `9b.` numbering in CLAUDE.md Build System Pattern list — should use sequential integers (renumber items 10-12 to 11-13, insert new JS linting item as 10)
```

- [ ] **Step 3: Run the guards**

```bash
npm run validate-backlog && npm run check-backlog-structure
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs(backlog): prune verified-done lint/commit-tooling items"
```
Update tally (`🟤+5` if all five pruned).

---

### Task 5: Audit & prune — Validator cluster (rows 178, 181–187)

**Files:** Modify `docs/planning/BACKLOG.md`. All 🟤.

| Row | Item (match text) | Verify | Expect |
|----|----|----|----|
| 178 | `Automate BACKLOG Origin path validation` | `scripts/validate-backlog-paths.js` exists | prune |
| 181 | `Extend `validate-backlog-paths.js` to catch `docs/superpowers/`` | Grep that file for `superpowers` (in `FORBIDDEN_ORIGIN_PATHS`) | prune |
| 182 | `Read BACKLOG.md from git index, not working tree` | Grep that file for `git show` / `is-inside-work-tree` | prune |
| 183 | `Add `npm run validate-backlog` script` | Grep `package.json` for `validate-backlog` | prune |
| 184 | `Add success output to `validate-backlog-paths.js`` | Grep that file for `Origin paths: OK` | prune |
| 185 | `Document shell gotcha: `&&` vs `if/fi` with grep exit code` | Grep `CLAUDE.md` for `Shell Gotchas` (PR #70) | prune |
| 186 | `Tighten pre-commit grep pattern for BACKLOG.md detection` | Grep `.husky/pre-commit` for `(^\|/)BACKLOG\.md$` | prune |
| 187 | `Handle staged deletion of BACKLOG.md in `validate-backlog-paths.js`` | Grep that file for the two-level fallback (`is-inside-work-tree`) | prune |

- [ ] **Step 1: Verify rows**

```bash
test -f scripts/validate-backlog-paths.js && echo "row178 ok"
grep -nE 'superpowers|git show|is-inside-work-tree|Origin paths: OK' scripts/validate-backlog-paths.js
grep -n 'validate-backlog' package.json | head
grep -n 'Shell Gotchas' CLAUDE.md | head
grep -nE 'BACKLOG\\.md\$|\\(\\^\\|/\\)' .husky/pre-commit | head
```
Expected: all present ⇒ all eight prune. (Row 187's staged-deletion handling and row 182's git-index read are the same two-level fallback — both satisfied by the `is-inside-work-tree` probe.)

- [ ] **Step 2: Prune confirmed rows**

- **Row 178** — under `### From Firefox & Test Audit Code Review (2026-04-11)` (row 177 "Remove duplicate plans/specs from docs/superpowers/" remains). Delete only:
```
- [ ] **Automate BACKLOG Origin path validation** — The BACKLOG Origin path pointing to `docs/superpowers/` instead of `docs/archive/` has recurred in PRs #51, #56, #57, #59, and now #62. Consider a CI check or pre-commit hook that validates Origin paths in BACKLOG.md point to `docs/archive/plans/`
```
- **Rows 181–184** — sub-header `### From Code Quality batch (2026-04-16)` also contains row 180 (Firefox flaky NOT REPRODUCING — **keep**). Delete only the four confirmed lines (leave the header, Origin, and row 180):
```
- [ ] Extend `validate-backlog-paths.js` to catch `docs/superpowers/` Origin paths — currently only detects `docs/planning/plans/`. BACKLOG line 848 notes the same broken-origin-path bug has recurred with `docs/superpowers/` references. Expand regex to both (code review finding, confidence 75/100)
- [ ] Read BACKLOG.md from git index, not working tree — `validate-backlog-paths.js` uses `fs.readFileSync(BACKLOG_PATH)` which reads the working-tree copy. If staged and unstaged changes coexist in BACKLOG.md, validator inspects unstaged content. Canonical approach: `git show :docs/planning/BACKLOG.md` (code review finding, confidence 50/100)
- [ ] Add `npm run validate-backlog` script — makes validator discoverable and callable standalone outside the pre-commit hook. Mirrors `npm run check-links` pattern
- [ ] Add success output to `validate-backlog-paths.js` — currently exits silently on clean. Other gate scripts (check-links) print a confirmation message. Add `console.log('BACKLOG Origin paths: OK')` for consistency
```
- **Row 185** — sub-header `### From Code Quality batch Code Review (2026-04-16)` contains ONLY row 185. Delete the whole block (header + item):
```
### From Code Quality batch Code Review (2026-04-16)

- [ ] Document shell gotcha: `&&` vs `if/fi` with grep exit code — pre-commit hook initially used `grep -q 'BACKLOG.md' && node script` pattern. When grep didn't match, its exit code (1) became the script's exit code, blocking all commits unrelated to BACKLOG.md. Fixed with `if/fi`. Document this pattern in CLAUDE.md or a shell scripting gotcha doc so it doesn't recur
```
- **Rows 186 & 187** — sub-header `### From PR #64 Code Review (2026-04-19)` contains ONLY rows 186 & 187. If both confirmed, delete the whole block:
```
### From PR #64 Code Review (2026-04-19)

- [ ] Tighten pre-commit grep pattern for BACKLOG.md detection — `.husky/pre-commit` uses `grep -q 'BACKLOG.md'` with unescaped `.` (regex wildcard) and no anchor, so it would also match hypothetical paths like `OLD_BACKLOG.md` or `BACKLOGxmd_notes.txt`. Harmless today (no such files exist) but stricter pattern `grep -qE '(^|/)BACKLOG\.md$'` is more correct (code review finding, confidence 35/100)
- [ ] Handle staged deletion of BACKLOG.md in `validate-backlog-paths.js` — if a commit stages `git rm docs/planning/BACKLOG.md`, the pre-commit hook still runs the validator (grep finds the path in the staged diff), then `fs.readFileSync(BACKLOG_PATH)` throws an uncaught ENOENT. Either check existence first or catch ENOENT and exit 0 with a friendly message. Overlaps with existing "Read BACKLOG.md from git index" item — switching to `git show :docs/planning/BACKLOG.md` would solve both (code review finding, confidence 75/100)
```

- [ ] **Step 3: Run the guards**

```bash
npm run validate-backlog && npm run check-backlog-structure
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs(backlog): prune verified-done validator items"
```
Update tally (`🟤+8` if all eight pruned).

---

### Task 6: Audit & prune — Asset-checker cluster (rows 193–199)

**Files:** Modify `docs/planning/BACKLOG.md`. All 🟤.

| Row | Item (match text) | Verify | Expect |
|----|----|----|----|
| 193 | `Implement the `dist/` preflight error message (confidence 90)` | Grep `scripts/check-assets.js` for `checkDistPreflight` (PR #68) | prune |
| 194 | `Improve generic "not found" error on CI (confidence 85)` | Grep that file for the improved wrong-cwd/CI-artifact message | prune |
| 195 | `Document HTML-regex scope assumption (confidence 70)` | Grep that file for the `extractHtmlRefs` JSDoc note | prune |
| 196 | `Harden JSON walk against non-flat `projects` shape (confidence 80)` | Grep that file for `typeof` / `!== null` guard in `extractJsonRefs` | prune |
| 197 | `Extend extractor to `<source src>`, `<video poster>`, `link imagesrcset`, `img srcset`` | Grep that file for `source` / `poster` / `srcset` | **keep + annotate** (not shipped) |
| 198 | `Tighten case-sensitivity check to cover directory segments (confidence 65)` | Grep that file for `realpathSync.native` (PR #68) | prune |
| 199 | `Align output format between `check-links.js` and `check-assets.js`` | Grep that file for bracketed `[source]` output (PR #68) | prune |

- [ ] **Step 1: Verify rows**

```bash
grep -nE 'checkDistPreflight|realpathSync\.native|extractHtmlRefs|typeof' scripts/check-assets.js | head
grep -nE 'poster|<source|srcset' scripts/check-assets.js | head    # row197: expect NO match
grep -nE '\[' scripts/check-assets.js | grep -iE 'source|\$\{' | head # row199: bracketed source format
```
Expected: rows 193/194/195/196/198/199 confirmed present ⇒ prune. Row 197 returns NO match (extractor not extended to `<source>`/`<video poster>`/srcset) ⇒ **keep + annotate**.

- [ ] **Step 2: Prune confirmed rows + annotate row 197**

In the 🟤 bucket, two sub-headers are involved:

`### From Internal Asset Link Checking Code Review (2026-04-20)` contains rows 193–197. Delete rows 193–196; **keep row 197 with an annotation**. Delete:
```
- [ ] Implement the `dist/` preflight error message — spec promised a targeted "dist/ missing or incomplete — run `npm run build` first" message the first time a `dist/` ref fails, but the implementation just prints a generic red ✗ line. Local UX slightly worse than spec. (confidence 90)
- [ ] Improve generic "not found" error on CI — `scripts/check-assets.js:116` error message `"Run from project root"` is misleading if the failure is actually a missing CI artifact download. Consider `"Did `npm run build` complete and artifacts download?"`. (confidence 85)
- [ ] Document HTML-regex scope assumption — `scripts/check-assets.js:54` runs `href=`/`src=` regex over raw HTML text, so any attribute-shaped string inside HTML comments, `<script>` blocks, or JSON-LD `"url":"..."` would be extracted. Today the repo has none that bypass exclusions, but a future JSON-LD addition could hit it. Add a comment noting the assumption. (confidence 70)
- [ ] Harden JSON walk against non-flat `projects` shape — `scripts/check-assets.js:73` uses `Object.values(projects)` and assumes `{projectId: {...}}`. Add `typeof project === 'object' && project !== null` guard before `project.screenshots` for robustness. (confidence 80)
```
Then edit the row-197 line to append the annotation — it becomes:
```
- [ ] Extend extractor to `<source src>`, `<video poster>`, `link imagesrcset`, `img srcset` — not needed today (no video, no responsive images), but document the limitation in the script header or queue for follow-up as assets evolve. *(audited 2026-06-10: still open — extractor not extended; no `<source>`/`poster`/`srcset` refs exist yet)*
```

`### From PR #65 Review (2026-04-28)` contains ONLY rows 198 & 199. If both confirmed, delete the whole block:
```
### From PR #65 Review (2026-04-28)

- [ ] Tighten case-sensitivity check to cover directory segments — `assetExists()` in `scripts/check-assets.js` only validates basename case via `readdirSync`, so a ref like `Images/projects/foo.webp` (wrong directory case) still passes locally on macOS/Windows but would fail on Linux CI. The header JSDoc claim "catches case-mismatch refs that would fail on Linux CI but pass on macOS/Windows" overstates the scope. Walk each path segment from repo root to fully match Linux behavior, or update the JSDoc to scope the claim to basename. (confidence 65)
- [ ] Align output format between `check-links.js` and `check-assets.js` — the link checker prints failure sources in brackets (`✗ url (status) [sources]`) while the asset checker uses parens (`✓ ref (source)` / `✗ ref (source)`). Pick one convention so the combined CI output reads consistently.
```

- [ ] **Step 3: Run the guards**

```bash
npm run validate-backlog && npm run check-backlog-structure
```
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs(backlog): prune verified-done asset-checker items (keep row 197)"
```
Update tally (`🟤+6`, `kept: row 197`).

---

### Task 7: Create `cleanup-week-log.md` + index it

**Files:** Create `docs/planning/cleanup-week-log.md`; Modify `docs/README.md`.

- [ ] **Step 1: Measure post-drain totals**

Run (counts removed `- [ ]` lines across all prune commits on this branch):
```bash
git diff main -- docs/planning/BACKLOG.md | grep -cE '^-\s*- \[ \]'
```
Call this `TOTAL_PRUNED`. From your per-task tally you also have the per-bucket split (`🟤_PRUNED`, `🔵_PRUNED`, `🟡_PRUNED`). Compute:
- post-drain 🟤 = 149 − `🟤_PRUNED`
- post-drain total open = 237 − `TOTAL_PRUNED`
- post-drain 🟤 % = round(100 × post-drain 🟤 ÷ post-drain total open)

- [ ] **Step 2: Create the log file**

Create `docs/planning/cleanup-week-log.md` with this content, substituting the measured numbers for the **bracketed** values (no brackets should remain in the saved file):

```markdown
# Cleanup Week Log

Durable ledger of Cleanup Weeks draining the 🟤 Auto-Generated Tech Debt bucket. Each
Cleanup Week inverts the normal weekly quota (≥50% 🟤 instead of ≥50% 🔵). See
[BACKLOG.md](BACKLOG.md) 📌 Process Rules for the cadence rule and [WEEKLY.md](WEEKLY.md)
for the active week.

**Trigger rule (current):** a Cleanup Week every ~3 weeks, OR when 🟤 grows beyond ~20 SP
pending.
**Calibration status:** under review — see Cleanup Week #1 observations.

---

## Cleanup Week #1 — Week of June 8–12, 2026

- **Declared:** 2026-06-09 (WEEKLY.md header) — first Cleanup Week ever.
- **Trigger:** the 🟤 bucket reached ~149 items (~63% of the 234-item open backlog) at the
  source-split restructure (PR #72, merged 2026-06-09) — far over the ~20-SP trigger.
- **Pre-drain bucket counts** (classification artifact, 2026-06-07): 🔵 72 · 🟡 16 · 🟤 149
  · total open 237.
- **Group A drain (2026-06-10):** pruned [TOTAL_PRUNED] verified-done items
  (🟤 [🟤_PRUNED] · 🔵 [🔵_PRUNED] · 🟡 [🟡_PRUNED]); kept 1 (asset-checker extractor
  extension, row 197 — genuinely open).
- **Post-drain baseline:** 🟤 = [post-drain 🟤] items / [post-drain 🟤 %]% of [post-drain
  total open] open. ← future weeks compare against this.
- **Observations for recalibration:**
  - Trigger units are ambiguous: the rule says "~20 SP pending," but the bucket is tracked
    by item count (149 items). Decide whether the trigger is SP-based or item-count-based.
  - The drain confirmed that most accumulated 🟤 were already-shipped PR-review follow-ups
    never marked complete — the prune-on-audit backlog hygiene gap, not net-new debt.
- **Next recheck:** after 2–3 normal weeks (~2026-06-30) — re-run the WEEKLY Quota Check
  against the post-drain 🟤 count; confirm ≥50% 🔵 is now sustainably achievable; finalize
  the threshold number.
- **Threshold decision:** DEFERRED to the recheck (~20 SP kept provisional; no change to
  BACKLOG 📌 Process Rules this week).
```

- [ ] **Step 3: Index the log in `docs/README.md`**

In the "Planning & Tasks" table, add a row immediately after the ROADMAP.md row (line 17):
```
| [planning/cleanup-week-log.md](planning/cleanup-week-log.md) | Cleanup Week ledger (drain start/end state, threshold calibration) | 2026-06-10 |
```

- [ ] **Step 4: Commit**

```bash
git add docs/planning/cleanup-week-log.md docs/README.md
git commit -m "docs(planning): add cleanup-week-log + index (Cleanup Week #1)"
```

---

### Task 8: Closeout — DONE.md entry + WEEKLY.md status + final sweep

**Files:** Modify `docs/planning/DONE.md`, `docs/planning/WEEKLY.md`.

- [ ] **Step 1: Add the DONE.md entry**

In `docs/planning/DONE.md`: bump line 3 to `**Last Updated**: 2026-06-10 (Backlog Drain & Cleanup-Week Bootstrapping)`. Insert this new section immediately after the `---` on line 7 and before `## 2026-06-08` (substitute the measured counts for bracketed values):

```markdown
## 2026-06-10

### Backlog Drain & Cleanup-Week Bootstrapping 🏆 (Weekly Challenge — Cleanup Week #1)

**Plan**: [docs/archive/plans/2026-06-10_backlog-drain-cleanup-week.md](../archive/plans/2026-06-10_backlog-drain-cleanup-week.md)
**Spec**: [docs/archive/specs/2026-06-10_backlog-drain-cleanup-week-design.md](../archive/specs/2026-06-10_backlog-drain-cleanup-week-design.md)
**PR**: pending (branch `chore/backlog-drain-cleanup-week`)
**Summary**: Monday Group A of the first Cleanup Week. Audited the 31 "prune-on-audit candidate" rows pinned in the restructure classification artifact's Audit sign-off (line 376) — items written `- [ ]` but shipped without being marked complete — against current code/file state + DONE.md + git. Pruned [TOTAL_PRUNED] verified-done items (🟤 [🟤_PRUNED] · 🔵 [🔵_PRUNED] · 🟡 [🟡_PRUNED]), kept 1 genuinely-open (row 197, asset-checker extractor extension). Recorded Cleanup Week #1 in a new durable `docs/planning/cleanup-week-log.md` with a post-drain baseline for the 2–3-week threshold-recalibration window; threshold number deferred.
**Key Changes**:
- `docs/planning/BACKLOG.md`: pruned [TOTAL_PRUNED] verified-done rows across 5 domain clusters (modal, feature/perf, lint/commit tooling, validator, asset-checker); removed emptied `### From …` sub-headers; "Last Updated" bumped. 🟤 bucket 149 → [post-drain 🟤].
- `docs/planning/cleanup-week-log.md` (new): Cleanup Week #1 entry — trigger state, pre/post-drain counts, SP-vs-item trigger-units observation, recheck ~2026-06-30. Indexed in `docs/README.md`.
- Scope held to the 31 sign-off candidates; no code/doc fixes (Groups B–E own those).
**Resolved/Pruned BACKLOG items**: [TOTAL_PRUNED] (rows 1–5, 10, 11, 22, 87, 105, 115, 122, 126–127, 129, 148, 178, 181–187, 193–196, 198–199 — confirm the final list against the branch diff). Kept open: row 197. The pruned lines remain recoverable via git history.
**Lessons Learned**: ~[🟤_PRUNED] of the 149 🟤 items were already-shipped PR-review follow-ups never completion-tagged — the restructure deliberately left them for this audit. Confirms the source-split's premise: the bulk of 🟤 was backlog-hygiene lag, not unaddressed debt.
```

- [ ] **Step 2: Verify the resolved-items list matches the diff**

Run and reconcile the bracketed list above against the actual removed lines:
```bash
git diff main -- docs/planning/BACKLOG.md | grep -E '^-\s*- \[ \]'
```
Expected: the removed lines correspond exactly to the pruned rows; fix the DONE.md list if any row was kept/annotated instead of pruned.

- [ ] **Step 3: Update WEEKLY.md Group A status**

In `docs/planning/WEEKLY.md`:
- Summary Table row for Group A — change `⏳ Planned` to `✅ Done` in:
```
| A. Backlog Drain & Cleanup Bootstrapping 🏆 | Planning/Docs | 🟤 Auto | 2 | 5 | Mon | ⏳ Planned |
```
- Monday schedule — check both boxes:
```
- [ ] 🏆 Verify-and-prune the ~25 prune-on-audit candidates against DONE.md + git *(3 SP)*
- [ ] Calibrate Cleanup-Week threshold + formally record this as the first Cleanup Week *(2 SP)*
```
become `- [x] …` (keep the text).

- [ ] **Step 4: Final guard + lint sweep**

```bash
npm run validate-backlog && npm run check-backlog-structure && npm run lint
```
Expected: `BACKLOG Origin paths: OK`, structure check passes, lint clean.

- [ ] **Step 5: Confirm no production files touched**

```bash
git diff --stat main -- js/ css/ index.html 404.html data/
```
Expected: empty output (this task is docs/planning only).

- [ ] **Step 6: Commit**

```bash
git add docs/planning/DONE.md docs/planning/WEEKLY.md
git commit -m "docs(planning): record Backlog Drain in DONE + WEEKLY status"
```

---

## Self-Review (writing-plans)

**Spec coverage:**
- §2 verify-and-prune (31 rows, cluster method, evidence bar, keep+annotate) → Tasks 2–6. ✓
- §2.3 guardrails (item-identity edits, emptied sub-headers, Last Updated bump, re-run guards) → each task Steps 2–4 + Task 2 Step 3. ✓
- §3 cleanup-week-log.md + deferred threshold → Task 7. ✓
- §4 closeout (DONE entry, WEEKLY status, README index) → Tasks 7–8. ✓
- §5 non-goals (no fixes, no out-of-31 prunes, flag-only, leave settings.json) → stated in Conventions + Task 8 Step 5. ✓
- §7 verification (validate-backlog, check-backlog-structure, lint, log indexed, diff scope) → Task 8 Steps 4–5. ✓

**Placeholder scan:** The cleanup-week-log and DONE entries carry bracketed measured values with the exact count commands that produce them (Task 7 Step 1, Task 8 Step 2) — runtime values, not unresolved TBDs. No "implement later" / vague-error placeholders remain.

**Type/identity consistency:** Row→bucket→item-text mapping is consistent across the spec table and Tasks 2–6; commit-staged paths match the File Structure table; guard command names (`validate-backlog`, `check-backlog-structure`, `lint`) match package.json scripts in CLAUDE.md.

**One adjustment made inline:** row 197 is the only expected keep — Tasks 6/7/8 all account for it explicitly (annotation + "kept 1" in log + DONE list), so the post-drain math (`TOTAL_PRUNED` from diff) stays self-consistent regardless of how the 3 judgment calls resolve.
