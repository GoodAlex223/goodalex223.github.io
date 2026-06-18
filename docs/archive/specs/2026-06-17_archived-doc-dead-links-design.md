# Archived-Doc Dead-Link Cleanup + Recurrence Guard — Design Spec

**Date**: 2026-06-17
**Task**: Cleanup Week #1, Group E — Archived-Doc Dead-Link Cleanup (🟤 Auto-Generated, 3 SP)
**Branch**: `docs/archived-dead-links`
**Status**: Approved (brainstorming complete)

---

## Goal

Repair every dead `docs/superpowers/` navigational pointer in the archived plans, and add a repo-local CI/pre-commit guard so the same dead links cannot recur.

## Context

Plans and specs are authored in `docs/superpowers/<plans|specs>/` (per the `superpowers:writing-plans` and `superpowers:brainstorming` skills), then archived to `docs/archive/<plans|specs>/` at task completion. The archived files keep internal navigational pointers — the top-of-file `**Spec:**` header, footer `Spec:`/`Plan:` lines, and `**Design spec**:` cross-references — that still hardcode the old `docs/superpowers/` location. Those targets no longer exist there (the `docs/superpowers/` working dirs were consolidated to `.gitkeep`-only on 2026-03-27), so the pointers are dead. The defect recurs on every newly archived plan.

Group E as originally scoped (WEEKLY.md lines 58-64, 106-109) named only two files plus an upstream `writing-plans` template fix. Brainstorming established two refinements:

1. **The defect spans 8 files, not 2.** Fixing only the 2 scoped files would leave the identical dead-link class in 6 others and guarantee recurrence. Decision: comprehensive 8-file sweep.
2. **The "template fix" cannot be a repo deliverable.** The `writing-plans` skill lives in the plugin cache (`~/.claude/plugins/cache/.../superpowers/{5.1.0,6.0.0,…}/`), across 5+ versions, outside this repo — editing it would not be committed, not be tracked here, and would be clobbered on plugin update. Decision: reframe item 3 as a repo-local guard script that *enforces* the convention instead of relying on an upstream template.

## Non-Goals

- Editing the upstream `superpowers` skills (out of repo).
- Rewriting historical command/record text inside archived plans (see "Untouched" below) — archived plans are a snapshot of work as executed.
- Touching the `2026-03-27_archive-cleanup.md` migration plan, which intentionally documents the `docs/superpowers/ → docs/archive/` move (47 references, all deliberate).
- Folding the new guard into `npm run lint` (the existing `validate-backlog` / `check-backlog-structure` guards are separate npm scripts run in the CI lint *job*, not in `npm run lint` — we match that).

---

## Part A — Surgical 8-file sweep

### Editing rule

Fix **only navigational pointer lines**. A navigational pointer is a line whose purpose is to point a reader to the spec/plan's current location: the `**Spec:**` header, footer `Spec:`/`Plan:`/`Pass 1…:` lines, and `**Design spec**:` cross-references.

The rewrite is **not** a blind `superpowers → archive` string swap. Each fixed pointer must:

1. **Point to the directory the target actually lives in** — spec references → `docs/archive/specs/`; a plan's self-reference (footer `Plan:`) → `docs/archive/plans/`.
2. **Normalize the date separator** — some old refs use hyphen dates (`2026-04-05-automated-link-checking-design.md`) that do not match the real archived filename, which uses underscores (`2026-04-05_automated-link-checking-design.md`). The fixed link must resolve to the file that actually exists.
3. **Preserve the line's existing markup** — bare backticked paths stay bare backticked paths; markdown links stay markdown links with **both** label and href corrected; relative hrefs already pointing at `../specs/…` are left as-is and only the stale label is fixed.

All target files were confirmed present in `docs/archive/specs/` and `docs/archive/plans/`.

### Files and pointer lines (19 pointers, 8 files)

| File (`docs/archive/plans/`) | Lines | Notes |
|---|---|---|
| `2026-04-28_test-stability-investigations.md` | 11, 581, 582 | header + footer Spec/Plan |
| `2026-06-07_backlog-restructure.md` | 11, 280, 445, 446, 525, 557, 723, 767, 768 | header, `**Design spec**:` cross-ref, footer Spec/Pass-1 lines |
| `2026-04-05_automated-link-checking.md` | 11 | header |
| `2026-04-16_code-quality.md` | 11 | header |
| `2026-04-20_internal-asset-link-checking.md` | 11 | markdown link — **label only** (href `../specs/…` already correct) |
| `2026-05-02_asset-checker-polish.md` | 11 | header |
| `2026-05-09_ci-deadline-docs.md` | 598, 599 | footer Spec/Plan (markdown links, hyphen→underscore) |
| `2026-05-16_scroll-animation-deterministic-polling.md` | 11 | header |

Line numbers are the discovery snapshot; execution re-greps each file rather than trusting fixed line numbers.

### Untouched (verified non-navigational)

- `git add docs/superpowers/…`, `Create: docs/superpowers/…`, `ls docs/superpowers/…` command/process text inside plan bodies.
- The validator denylist literal: "forbids `docs/planning/plans/` and `docs/superpowers/` Origin paths".
- Backlog-item-title quotes in `2026-06-07_backlog-restructure-classification.md` (rows quoting the original item text).
- The external `rating_bot` repo path in `2026-06-07_backlog-restructure-design.md:7`.
- The `2026-03-27_archive-cleanup.md` migration record in its entirety.
- The `2026-06-07_backlog-restructure-design.md` spec — it has zero dead navigational pointers (its refs are all the intentional kinds above).

---

## Part B — `scripts/check-archived-links.js` guard

### Responsibility

Fail CI / the commit if any archived doc contains a dead navigational pointer to `docs/superpowers/`. This both makes the Part A sweep verifiable (0 violations ⇒ done) and prevents recurrence.

### Rule

- **Scan**: every `*.md` under `docs/archive/`.
- **Flag**: any line matching the navigational-pointer pattern that also contains `docs/superpowers/`:
  ```
  /^\s*(>\s*)?(?:[-*]\s*)?(?:\*\*)?(Spec|Plan|Pass 1[^:]*|Design spec)(?:\*\*)?\s*:/
  ```
  This anchors on the line-leading pointer label (with optional blockquote `>`, bullet, and `**` markup), mirroring the anchored detection style of `validate-backlog-paths.js`. Command text (`git add …`, `ls …`), prose, and the denylist literal do not start with a `Spec:`/`Plan:`/`Design spec:` label and so are not flagged.
- **Allowlist**: `ALLOWED_FILES = ['docs/archive/plans/2026-03-27_archive-cleanup.md']` (the migration record). Compared on a normalized POSIX-style repo-relative path so it works on Windows + POSIX.

### Output & exit code

- Success: prints `Archived-doc links: OK` (or a `skipped` note if `docs/archive/` is absent), exits 0.
- Failure: prints a red violation block — one line per dead pointer as `path:line — <line text>` plus fix guidance ("point to `docs/archive/<specs|plans>/` with an underscore date"), exits non-zero. Style mirrors `validate-backlog-paths.js`.

### Wiring (3 sites — matches repo convention for the other two guards)

1. `package.json`: `"check-archived-links": "node scripts/check-archived-links.js"`.
2. `.github/workflows/deploy.yml` — add a step to the `lint` job, after `validate-backlog` / `check-backlog-structure`.
3. `.husky/pre-commit` — conditional run, using the established `if/fi` pattern (not `&&`, per the Shell Gotchas note) so a no-match exit doesn't abort unrelated commits:
   ```sh
   if git diff --cached --name-only | grep -qE '^docs/archive/'; then
     npm run check-archived-links || exit 1
   fi
   ```

### Verification (no `scripts/` test harness)

The repo has no `scripts/` unit-test harness; the Group C precedent (2026-06-14) used manual-reproduction verification. This deviates from the global "TDD, tests first" rule and is justified by the absence of a harness plus that precedent — recorded here intentionally. Verification steps:

1. **Pre-sweep**: run the guard on the dirty tree → must fail and list all 19 pointers.
2. **Post-sweep**: run again → must print OK / exit 0.
3. **Fixture**: in a temp copy, plant a dead `**Spec:** docs/superpowers/…` pointer in a non-allowlisted archive file → guard flags it; plant the same in the allowlisted file → guard ignores it.
4. **CI gates**: full `npm run lint` + `validate-backlog` + `check-backlog-structure` + the new guard all green.

---

## Part C — Documentation

Add a short **"Archived-Doc Link Hygiene"** entry to the Key Patterns & Gotchas section of `CLAUDE.md` (the repo documents every guard — `validate-backlog-paths.js`, `check-assets.js` both have sections; skipping this would be the doc drift the repo guards against). Content: the rule, the single-file allowlist, the three wiring sites, and `npm run check-archived-links`.

---

## Pre-existing working-tree edits (handled first)

`main` carried uncommitted edits unrelated to Group E — `CLAUDE.md` AUTO-MANAGED comment markers removed and `.claude/auto-memory/config.json` deleted (finishing the auto-memory plugin removal). Decision: land them as a single `chore:` commit at the **base** of this branch, before any Group E commit, so the Group E `docs:`/`build:` commits and the CLAUDE.md guard-doc edit stay clean and separable.

---

## Commit plan

1. `chore:` — pre-existing auto-memory marker/config cleanup (CLAUDE.md markers + deleted config.json).
2. `build:` — add `scripts/check-archived-links.js` + wiring (package.json, deploy.yml, .husky/pre-commit).
3. `docs:` — the 8-file surgical sweep.
4. `docs:` — CLAUDE.md "Archived-Doc Link Hygiene" entry.

Then the task-completion workflow (EXTRACT → ARCHIVE → TRANSITION → COMMIT → MEMORY) and a PR.

## Risks

- **Guard false positives/negatives**: the anchored regex could miss an oddly-formatted pointer or flag an unusual line. Mitigated by the fixture test and by running pre/post-sweep against the real archive.
- **Allowlist drift**: if a future genuinely-historical file needs exemption, it must be added to `ALLOWED_FILES` — documented in the script header and CLAUDE.md.
- **Bundled unrelated work**: the `chore:` base commit puts auto-memory cleanup in the same PR as Group E. Accepted (user decision); it is legitimate cleanup that should land anyway and is isolated in its own commit.
- **Low base confidence (35)** for the sweep philosophy: resolved by the explicit navigational-pointer-only rule and the user-approved surgical scope.
