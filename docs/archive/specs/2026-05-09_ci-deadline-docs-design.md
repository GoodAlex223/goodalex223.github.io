# CI Deadline & Docs — Design

**Date**: 2026-05-09
**Branch**: `chore/ci-deadline-docs`
**Group**: Thursday — CI Deadline & Docs (7 SP)
**Origin**: `docs/planning/WEEKLY.md` lines 76-84

---

## Problem

Two unrelated obligations are due this week:

1. **Node.js 24 deprecation deadline (2026-06-02)** — GitHub is moving the default JavaScript-action runtime from Node 20 to Node 24. All workflow actions in `.github/workflows/deploy.yml` are pinned to `@v4` majors that pre-date Node 24 support; without a bump, the workflow either continues running on a deprecated runtime or breaks once GitHub forces the cutover.

2. **Documentation drift** — Three pieces of documentation are stale or duplicated:
   - `docs/planning/ROADMAP.md` was last updated 2026-01-26 and shows v1.1/v1.5 items as not-done despite four sprints of completed work; it has no mention of the current "Quality & Hardening" phase.
   - The `&&` vs `if/fi` shell gotcha that recurred in pre-commit hooks (PR #64 review) is documented inside the Pre-commit-hook subsection of CLAUDE.md but is invisible from any "shell" / "grep" / "if-fi" search vector.
   - `docs/superpowers/` contains five files that overlap with `docs/archive/`: three byte-identical duplicates and two specs not yet archived. PR #61, #62, #63 reviews have flagged this as recurring.

These four items are independent enough to ship as a single bundled PR (precedent: PR #69 mixed code + docs).

---

## Goal

Close the Node 24 deadline and clear the three documentation-drift items in one PR. After this work:

- Every action in `deploy.yml` runs on a Node 24-compatible major (or has an explicit `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` opt-in for any action whose Node 24 major has not shipped yet).
- `docs/planning/ROADMAP.md` accurately reflects current state, with a phase-based timeline that elevates "Quality & Hardening" as the active phase.
- The `&&` vs `if/fi` gotcha is discoverable from a top-level "Shell Gotchas" subsection in CLAUDE.md, with a cross-link from the existing pre-commit hook documentation.
- `docs/superpowers/` contains only `.gitkeep` files and is ready as a clean staging area for future Superpowers-skill specs.

**Out of scope**:
- Bumping `node-version: '20'` in the five `setup-node` steps (separate concern, separate risk surface).
- Reorganizing `docs/superpowers/` directory structure beyond removing the duplicates and stragglers.
- Adding new long-term aspirations to ROADMAP.md beyond reflecting completed phase work.
- Creating a Pre-commit-hook gotchas catalog beyond the one entry being elevated.

---

## Approach

Four independent deliverables, sequenced low-risk → high-risk, one commit per deliverable. Per design discussion, the chosen approaches across decision points:

| Decision | Chosen | Rejected |
|---|---|---|
| Node 24 scope | **Action majors only** — bump 7 action references; leave `node-version: '20'` | Also bump runtime to Node 22 / 24 (adds unrelated risk to deadline-driven PR) |
| ROADMAP shape | **Phase-based timeline** — v1.0 / v1.1 / v1.5 / Quality & Hardening / v2.0 with status markers | In-place patch (undersells four-sprint magnitude); full rewrite (loses historical narrative) |
| Gotcha placement | **Elevate inline + cross-link** — new "Shell Gotchas" subsection + cross-link from existing Pre-commit text | Move-only (breaks pre-commit narrative); generic-form (loses concrete trigger context) |
| Cleanup approach | **Move-then-delete** — `git mv` 2 unarchived specs into `docs/archive/specs/`, `git rm` 3 byte-identical duplicates, keep `.gitkeep` files | Delete-and-remove-directory (breaks brainstorming skill's default write path); duplicates-only (leaves the two stragglers as a known inconsistency) |
| PR strategy | **Single PR, 4 commits** | Bifurcated docs-direct-to-main + Node 24 PR (the bundled-PR precedent of PR #69 fits better when CI work already requires a branch) |

---

## Changes

### 1. `.github/workflows/deploy.yml` — Node 24 GitHub Actions upgrade (D1, 3 SP, IMPORTANT)

Bump action references across the six jobs (lint, build, check-links, test, lighthouse, deploy). Inputs to each action stay unchanged (`node-version: '20'`, `cache: 'npm'`, artifact paths, etc.).

| Action | Current | Target |
|---|---|---|
| `actions/checkout` | `@v4` (5×) | `@v5` |
| `actions/setup-node` | `@v4` (5×) | `@v5` |
| `actions/upload-artifact` | `@v4` (3×) | `@v5` |
| `actions/download-artifact` | `@v4` (5×) | `@v5` |
| `actions/configure-pages` | `@v4` | latest Node-24 major if shipped, else `@v4` + opt-in env var |
| `actions/upload-pages-artifact` | `@v4` | latest Node-24 major if shipped, else `@v4` + opt-in env var |
| `actions/deploy-pages` | `@v4` | latest Node-24 major if shipped, else `@v4` + opt-in env var |

**Verification path during implementation**:
1. Check each action's GitHub releases page (or `gh api repos/actions/<name>/releases`) for the latest major and confirm Node 24 compatibility from the release notes.
2. For any action whose Node 24 major has not shipped on implementation day, leave at `@v4` and add a workflow-level `env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` block with a comment citing the 2026-06-02 deadline. The pages-family actions are the most likely candidates for this fallback.
3. Push to branch; watch `lint`, `build`, `check-links`, `test`, `lighthouse` jobs run end-to-end. Verify `build-output` artifact still contains `index.html`, `404.html`, `sitemap.xml`, `dist/`. Verify `playwright-report/` and `lighthouse-report/` artifacts upload as expected (these have `if: ${{ !cancelled() }}` and need to keep working).

**Risk surface**: `actions/upload-artifact@v5` is the highest-risk bump — its v5 release line had non-trivial behavior changes around hidden files and compression defaults. Confirm via release notes that `dist/` upload still includes hashed asset files.

**Rollback**: revert the single D1 commit on main, push, re-deploy.

### 2. `docs/planning/ROADMAP.md` — Phase restructure (D2, 2 SP)

Replace the version-ladder structure (Current State / v1.1 / v1.5 / v2.0 / Ongoing / Principles) with a phase-based timeline:

```
# ROADMAP

**Last Updated**: 2026-05-09

## Vision
[1-2 sentences preserving current intent]

## Phase Timeline

### v1.0 — Launch (✅ Completed 2026-01-20)
[3-4 bullets: original launch scope]

### v1.1 — Polish (✅ Completed 2026-02-XX)
[Favicon, OG image, Lighthouse 100/100, link checking]

### v1.5 — Enhanced Features (✅ Completed 2026-03-XX)
[Theme toggle, filtering, scroll animations, 404 page, modal, contact form]

### Quality & Hardening (🔧 In Progress, since 2026-04)
[CI hardening, test stability, asset/link checking, BACKLOG validator,
 Node 24 upgrade, docs refresh — link to docs/planning/WEEKLY.md
 for current sprint detail]

### v2.0 — Content Expansion (📋 Planned)
[Project detail pages, blog, multi-language — keep only items
 still actually planned. Drop "Resume PDF download" if no longer relevant.]

## Ongoing
[Preserve current entries or trim]

## Principles
[Preserve unchanged]
```

**Cross-references**: link to `docs/planning/WEEKLY.md` from the Quality & Hardening section for current sprint detail; link to `docs/planning/DONE.md` for the historical record. Do not enumerate every Apr-May PR — that is the DONE.md role.

**Open detail (resolve during implementation)**: exact completion dates for v1.1 and v1.5 phases. Pull from `git log` and `docs/planning/DONE.md`.

### 3. `CLAUDE.md` — Shell Gotchas subsection + cross-link (D3, 1 SP)

Two-part edit on the project-level CLAUDE.md (not the user-global file):

**Part A — new "Shell Gotchas" subsection** under "Key Patterns & Gotchas", placed between "BACKLOG Origin Paths" and "Adding New Projects":

```markdown
### Shell Gotchas

- **Conditional grep + `&&` aborts the chain on no-match**: When a
  pre-commit hook or CI step uses `grep ... && some-action`, the `&&`
  short-circuits on grep's exit code 1 (no matches found). On a fresh
  repo or unstaged-file commit, this *blocks every commit*, not just
  ones that should trigger the action. Fix: use `if grep ...; then ...; fi`
  so a no-match exit is treated as "skip", not "fail". Triggered by
  `.husky/pre-commit` validate-backlog conditional. See the Pre-commit
  hook subsection under "Commits" for the concrete pattern.
```

**Part B — cross-link from existing Pre-commit-hook bullet** (under "Commits"): append `(See "Shell Gotchas" for general pattern.)` to the existing sentence about using `if/fi` (not `&&`).

**Why a top-level subsection vs. just elevating the pre-commit text**: future shell gotchas (CMD vs PowerShell quoting, `set -e` interactions, etc.) get a natural home. Single entry today is acceptable — the section is a placeholder that future entries can join.

### 4. `docs/superpowers/` — Cleanup (D4, 1 SP)

Three operations, all via `git mv` / `git rm` to preserve history:

**Move 2 specs to archive**:
- `docs/superpowers/specs/2026-04-05_automated-link-checking-design.md` → `docs/archive/specs/2026-04-05_automated-link-checking-design.md`
- `docs/superpowers/specs/2026-04-09_ci-hardening-design.md` → `docs/archive/specs/2026-04-09_ci-hardening-design.md`

**Delete 3 byte-identical duplicates** (verified via `git diff --no-index --stat`, all empty diff against archive equivalents):
- `docs/superpowers/plans/2026-04-09_ci-hardening.md` (duplicate of `docs/archive/plans/2026-04-09_ci-hardening.md`)
- `docs/superpowers/plans/2026-04-10_firefox-test-audit.md` (duplicate of `docs/archive/plans/2026-04-10_firefox-test-audit-plan.md`)
- `docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md` (duplicate of `docs/archive/plans/2026-04-10_firefox-test-audit-spec.md`)

**Preserve directory**: leave `docs/superpowers/plans/.gitkeep` and `docs/superpowers/specs/.gitkeep` untouched. The brainstorming skill writes to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` by default; preserving the directory means the current PR's own design doc lives at the canonical path.

**Note on archive filename inconsistency**: `docs/archive/plans/2026-04-10_firefox-test-audit-spec.md` is filed as a "plan" but is a design doc (filename ends `-spec.md`). Pre-existing inconsistency; out of scope for this cleanup.

---

## Sequencing

One commit per deliverable, ordered low-risk → high-risk:

1. **D4** — `docs/superpowers/` cleanup (file moves + deletes)
2. **D3** — CLAUDE.md shell gotcha
3. **D2** — ROADMAP.md restructure
4. **D1** — Node 24 upgrade

D1 lands last so the validate-backlog and lint runs gate the modernized actions on the same PR. If something breaks, it isolates to one commit.

---

## Verification

### Per-Deliverable

**D1 (Node 24)** — push to branch; full CI run must pass green:
- `lint` — CSS lint + JS lint + validate-backlog all run on bumped action runtime
- `build` — `build-output` artifact contains `index.html`, `404.html`, `sitemap.xml`, `dist/`
- `check-links` — artifact download succeeds; both `check-links` and `check-assets` pass
- `test` — Playwright runs across Chromium/Firefox/WebKit; report uploads
- `lighthouse` — runs against preview server; report uploads
- `deploy` — runs only on push to main, verified post-merge

**D2/D3** — visual review only. No tests reference these files.

**D4** —
- `npm run validate-backlog` passes locally (no `**Origin**` line in BACKLOG.md references the 5 touched files).
- `git status` shows the 2 moves as renames (`git diff -M`).
- `npm run check-links` and `npm run check-assets` pass (defensive sanity check; neither crawls `docs/`).

### Pre-PR Local Verification

```bash
npm run lint            # CSS + JS lint
npm run validate-backlog
npm run build
npm test                # Playwright E2E (smoke check, not strictly required)
git diff main...HEAD --stat   # ~7 files
```

### CI Gates the PR Must Pass

The same 5-job pipeline that has gated PRs #56-#69:
- `lint` (incl. validate-backlog)
- `build`
- `check-links` (external + internal)
- `test` (Playwright × 3 browsers)
- `lighthouse` (≥90/100 all categories)

D2/D3/D4 do not affect the build output, so test/lighthouse/check-links are essentially regression checks for D1.

### Manual Verification (Post-Merge)

After merge to main, the `deploy` job runs for the first time with the bumped actions. Watch the deploy job on the merge commit's workflow run. If the Pages-family actions misbehave, GitHub Pages keeps serving the prior successful deploy until a new one succeeds.

**Rollback if deploy fails**: revert the D1 commit on main, push; subsequent push triggers a re-deploy with the prior `@v4` action set.

### Out-of-Scope Manual Tests

- Browser smoke test (no UI changes)
- Lighthouse score check beyond CI gate
- Cross-browser modal/filter/form interaction tests beyond CI Playwright run

---

## Open Questions Resolved During Brainstorming

| Question | Resolution |
|---|---|
| Bump `node-version: '20'`? | No — separate risk surface, queue as backlog item if not present |
| ROADMAP structure | Phase-based timeline (recommendation B) |
| Shell gotcha placement | Elevate inline + cross-link (recommendation A) |
| `docs/superpowers/` cleanup approach | Move-then-delete, preserve directory (recommendation A) |
| PR strategy | Single PR, 4 commits, bundled CI + docs |

---

## PR Summary (Anticipated)

**Title**: `chore: CI Deadline & Docs (Node 24 + docs refresh)`
**Branch**: `chore/ci-deadline-docs`
**Commits**: 4 (one per deliverable: D4 → D3 → D2 → D1)
**Files changed**: ~7 in deliverables (1 workflow YAML, 2 docs, 2 spec moves, 3 deletes) + this spec itself
**Risk**: medium — Node 24 action major bumps cross a deprecation boundary; rest is documentation
**Reviewers**: solo (matches Thursday's `[batch]` solo classification in WEEKLY.md)
