# deploy.yml PR Trigger — Design

**Date**: 2026-06-20
**Branch**: `ci/deploy-pr-trigger`
**Group**: Monday — CI Gate + Screenshot Tooling → Group D (🟡, 3 SP, *run first; CI blast radius*)
**Origin**: `docs/planning/WEEKLY.md` lines 46-52, 73-76

---

## Problem

`.github/workflows/deploy.yml` triggers only on `push: branches: [main]` and `workflow_dispatch`. There is **no `pull_request:` trigger**, so the `lint → build → check-links + test + lighthouse` gate never runs while a PR is open — it runs for the first time only *after* merge, on the push to `main`.

Evidence: recent PRs #65/#66/#68/#69/#70 all showed `statusCheckRollup: 0` (no checks attached to the PR). A regression is only caught post-merge, when reverting is the only remedy. This is the deferred operational CI gap (BACKLOG 🟡, confidence 70, "important").

The fix is not simply "add `pull_request:`" — that naively makes the `deploy` job also run on PRs (deploying to production GitHub Pages from a feature branch), and routes every PR run through the existing workflow-level `concurrency: group: pages` lane, where `cancel-in-progress: false` makes PR CI and production deploys queue behind one another.

---

## Goal

Run the full CI pipeline on every PR targeting `main`, while guaranteeing the production deploy stays main-only and concurrency stays sane. After this work:

- Opening or updating a PR against `main` runs `lint`, `build`, `check-links`, `test`, and `lighthouse` and attaches them as required-looking status checks (`statusCheckRollup` populated).
- The `deploy` job **never** runs on a `pull_request` event, and never deploys from any ref other than `main`.
- Post-merge behavior is unchanged: a push to `main` (or a `main` `workflow_dispatch`) still runs the pipeline and deploys.
- PR CI runs no longer share a serialized concurrency lane with production deploys; a new push to a PR cancels that PR's stale in-progress run, while main deploys remain serialized and are never cancelled mid-flight.

**Out of scope** (deliberate, YAGNI):

- **Path filtering** (`paths-ignore` for docs-only PRs). Skipping CI on docs PRs would re-open the very "no checks on a PR" gap this task closes. Every PR to `main` gets the full gate.
- **Least-privilege permissions refactor** (scoping `pages: write` / `id-token: write` down to the `deploy` job). The top-level `permissions` block is harmless on PR runs because `deploy` is skipped; tightening it is a separable follow-up, captured to BACKLOG if desired.
- **Bumping `node-version: '20'`** or any action major — unrelated risk surface.
- **Branch-protection rule changes** (marking these checks "required" in repo settings) — a GitHub-UI/admin action, not a workflow-file change. Noted as a manual post-merge follow-up.

---

## Approach

One file changed (`.github/workflows/deploy.yml`), three coordinated edits. Decision points settled during brainstorming:

| Decision | Chosen | Rejected |
|---|---|---|
| Trigger scope | **`pull_request: branches: [main]`** — runs on PRs targeting main (default activity types: opened, synchronize, reopened) | Trigger on all branches (noise from non-main PRs); add `types:`/`paths` filters (unneeded complexity, or re-opens the docs-PR gap) |
| Deploy guard | **Explicit job `if:`** — `github.ref == 'refs/heads/main' && github.event_name != 'pull_request'` | Rely solely on the `environment: github-pages` deployment-branch rule (unversioned repo-settings config; `pull_request` ref is `refs/pull/N/merge`, so behavior is opaque and untestable from the repo) |
| Concurrency | **Ref-scoped (approach B)** — `group: ${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` | A: leave `group: pages` (PR runs serialize against deploys/other PRs); C: split workflow-level ref-scope + job-level `pages` group on deploy (most precise but two concurrency blocks for marginal gain) |

Why the guard *and* keeps the environment gate: belt-and-suspenders. The explicit `if:` is self-documenting and lives in the versioned workflow; the environment gate (whatever it is configured to) remains as a second line of defense. We do not remove or depend on the environment config.

Why ref-scoped concurrency is Pages-safe: every push/dispatch to `main` resolves `github.ref` to `refs/heads/main`, so all main runs share one concurrency group → production deploys remain serialized. `cancel-in-progress` is `true` only for `pull_request` events, so an in-progress **deploy** (a `push` event) is never cancelled — preserving the exact guarantee GitHub's Pages starter template's `cancel-in-progress: false` provides. PR runs get their own per-ref group and a new push cancels the stale PR run, saving CI minutes.

---

## Changes

### `.github/workflows/deploy.yml`

**Edit 1 — add the `pull_request` trigger** (lines 3-6):

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

**Edit 2 — ref-scope the concurrency block** (lines 13-15):

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

**Edit 3 — guard the `deploy` job** (add an `if:` as the first key under `deploy:`, line ~183):

```yaml
  deploy:
    if: ${{ github.ref == 'refs/heads/main' && github.event_name != 'pull_request' }}
    runs-on: ubuntu-latest
    needs: [build, test, lighthouse, check-links]
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    # ...unchanged...
```

No other jobs change. `lint`, `build`, `check-links`, `test`, `lighthouse` run on both `push` and `pull_request`; only `deploy` is gated. `needs:` jobs run regardless (they are not gated), so a PR exercises the whole gate and `deploy` simply reports **skipped**.

---

## Verification

CI-trigger behavior cannot be fully exercised locally (no `act` in this repo). Verification is layered:

1. **YAML / workflow sanity (local)** — confirm the file is still valid YAML and the three edits are well-formed via a `git diff` review plus a structural read-back. If `npx actionlint` resolves, run it as a stronger lint of the workflow expressions; if not, the live PR run below is the authoritative gate (do not block on installing new tooling for a three-hunk change).
2. **Self-verifying PR (primary)** — `pull_request` runs the workflow as it exists in the PR's merge ref, so the new trigger fires on **this very PR**. After opening the Group D PR, confirm via `gh pr checks <n>` / `gh pr view <n> --json statusCheckRollup` that:
   - `lint`, `build`, `check-links`, `test`, `lighthouse` all appear and run, and
   - `deploy` is **skipped** (not run, not failed).
   This directly closes the `statusCheckRollup: 0` gap.
3. **Post-merge deploy (confirmation)** — after merge, confirm the push-to-`main` run executes `deploy` and the Pages deployment succeeds (the normal green deploy), proving the guard did not over-block.

A PR that is green on the gate **and** shows `deploy` skipped, followed by a green post-merge deploy, is the success condition.

---

## Risks & Rollback

- **Feature-branch deploy** (the headline risk) — mitigated by the explicit `if:` guard; verified by observing `deploy` skipped on the PR run.
- **Concurrency regression for Pages** — mitigated by the ref-scope keeping all `main` runs in one group with `cancel-in-progress` false for non-PR events; verified by the post-merge deploy completing.
- **check-links flakiness on PRs** — the external link checker now runs per PR push; it already has HEAD→GET fallback + 3 retries + a LinkedIn skip-list, so transient failures self-heal. No change needed.
- **Rollback** — single-file, three-hunk change; revert the commit (or the merged PR) to restore push-only triggering. No data or state migration involved.

---

## Task Completion (per CLAUDE.md)

- **Extract** ≥2 improvements → BACKLOG (🟤 for any Claude-surfaced cleanup, e.g. least-privilege permission scoping; 🔵 if user-raised). Likely candidates: least-privilege `permissions` scoping; mark the new PR checks "required" in branch protection.
- **Archive** this spec + the plan → `docs/archive/specs/` and `docs/archive/plans/` (hyphen→underscore date on archival).
- **Transition** TODO → DONE; tick the Group D box in `WEEKLY.md`.
- **Commit** docs; **capture learnings** to memory (PR-trigger self-verification mechanics; ref-scoped concurrency Pages-safety).
