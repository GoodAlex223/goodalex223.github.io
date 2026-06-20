# deploy.yml PR Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `pull_request:` trigger to `.github/workflows/deploy.yml` so the full CI gate runs on PRs to `main`, while guarding the `deploy` job to main-only and ref-scoping concurrency.

**Architecture:** One file (`.github/workflows/deploy.yml`), three coordinated edits: (1) add `pull_request: branches: [main]` to `on:`; (2) ref-scope the workflow `concurrency` block; (3) add an `if:` guard to the `deploy` job. The change is self-verifying — `pull_request` runs the workflow from the PR merge ref, so the new trigger fires on this PR.

**Tech Stack:** GitHub Actions (YAML workflow), `gh` CLI for PR-run inspection.

## Global Constraints

- **Single file changed:** `.github/workflows/deploy.yml`. No other workflow/job bodies change.
- **Deploy guard (verbatim):** `if: ${{ github.ref == 'refs/heads/main' && github.event_name != 'pull_request' }}` on the `deploy` job only.
- **Concurrency (verbatim):** `group: ${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`.
- **Trigger (verbatim):** `pull_request: branches: [main]` (default activity types; no `types:`/`paths:` filters).
- **Out of scope:** no `paths-ignore`, no `permissions` refactor, no `node-version` bump, no branch-protection edits.
- **No local CI runner** (`act` not installed): local verification is `git diff` review + optional `npx actionlint`; the live PR run is the authoritative gate.
- **Commit style:** Conventional Commits, ≤72-char header, sign-off footer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Add PR trigger, ref-scope concurrency, guard the deploy job

**Files:**
- Modify: `.github/workflows/deploy.yml` (3 hunks: `on:` lines 3-6, `concurrency:` lines 13-15, `deploy:` job key ~line 182)

**Interfaces:**
- Consumes: nothing (first and only code task).
- Produces: a `deploy.yml` that runs `lint`/`build`/`check-links`/`test`/`lighthouse` on `push` to main **and** `pull_request` to main, and runs `deploy` only on a non-PR event on `refs/heads/main`.

- [ ] **Step 1: Add the `pull_request` trigger**

Edit the `on:` block. Current:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

New:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

- [ ] **Step 2: Ref-scope the `concurrency` block**

Edit the `concurrency:` block. Current:

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

New:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

- [ ] **Step 3: Guard the `deploy` job**

Add the `if:` as the first key under `deploy:` (before `runs-on:`). Current:

```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: [build, test, lighthouse, check-links]
```

New:

```yaml
  deploy:
    if: ${{ github.ref == 'refs/heads/main' && github.event_name != 'pull_request' }}
    runs-on: ubuntu-latest
    needs: [build, test, lighthouse, check-links]
```

- [ ] **Step 4: Review the diff for exactly three hunks**

Run: `git diff .github/workflows/deploy.yml`
Expected: precisely three changed regions — (1) two added lines under `on:` (`pull_request:` + `branches: [main]`), (2) two changed lines in `concurrency:` (`group:` + `cancel-in-progress:`), (3) one added line (`if:`) under `deploy:`. No other job/step bodies touched. Indentation matches surrounding 2-space YAML.

- [ ] **Step 5: Workflow lint (best-effort)**

Run: `npx --yes actionlint .github/workflows/deploy.yml`
Expected: no errors. If `actionlint` cannot be fetched/run in this environment, skip — note "actionlint unavailable; relying on diff review + live PR run" and continue. Do **not** add new tooling to `package.json` for this.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -F - <<'EOF'
ci: Run CI on PRs to main; guard deploy to main-only

Add a pull_request: trigger so lint/build/check-links/test/lighthouse run
on PRs targeting main (closing the statusCheckRollup: 0 gap from PRs
#65/#66/#68/#69/#70). Guard the deploy job with an explicit
if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
so it never deploys from a PR or feature branch. Ref-scope concurrency to
${{ github.workflow }}-${{ github.ref }} with cancel-in-progress only for
pull_request events, keeping main deploys serialized and never cancelled.

Origin: WEEKLY.md Group D. Spec: docs/superpowers/specs/2026-06-20-deploy-pr-trigger-design.md

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 2: Open the self-verifying PR and confirm the gate + skipped deploy

**Files:** none (verification only).

**Interfaces:**
- Consumes: the committed `deploy.yml` from Task 1 on branch `ci/deploy-pr-trigger`.
- Produces: a green PR gate with `deploy` reported **skipped** — the success condition this task exists to prove.

- [ ] **Step 1: Push the branch**

Run: `git push -u origin ci/deploy-pr-trigger`
Expected: branch published to origin.

- [ ] **Step 2: Open the PR**

```bash
gh pr create --base main --head ci/deploy-pr-trigger \
  --title "ci: Run CI on PRs to main; guard deploy to main-only" \
  --body "Adds a pull_request: trigger to deploy.yml so the full CI gate runs on PRs to main, with an explicit deploy-job guard (main + non-PR only) and ref-scoped concurrency. Self-verifying: this PR's own checks demonstrate the new trigger. Spec: docs/superpowers/specs/2026-06-20-deploy-pr-trigger-design.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
Expected: PR URL printed.

- [ ] **Step 3: Confirm the gate jobs run on the PR**

Run (wait for runs to register): `gh pr checks --watch` (or `gh pr view --json statusCheckRollup`)
Expected: `lint`, `build`, `check-links`, `test`, `lighthouse` all present and running/passing — i.e. `statusCheckRollup` is non-empty (the gap is closed).

- [ ] **Step 4: Confirm `deploy` is skipped (not run, not failed)**

Run: `gh run view <run-id> --json jobs --jq '.jobs[] | {name, status, conclusion}'`
Expected: the `deploy` job shows `conclusion: skipped` (the `if:` guard evaluated false on the `pull_request` event). It must NOT have run and must NOT have failed the PR.

- [ ] **Step 5: Record verification evidence**

Capture the PR number, the run id, the gate-jobs list, and the `deploy: skipped` line into the session notes / PR comment as the verification artifact. This is the evidence required before claiming the trigger works (verification-before-completion).

> **Post-merge confirmation (during finishing-a-development-branch, after merge):** confirm the push-to-`main` run executes `deploy` and the Pages deployment succeeds — proving the guard did not over-block. Then run task-completion (EXTRACT ≥2 → BACKLOG incl. least-privilege permissions + "mark checks required in branch protection"; ARCHIVE spec+plan to `docs/archive/`; TRANSITION TODO→DONE + tick WEEKLY Group D; COMMIT docs; capture learnings to memory).

---

## Self-Review

**1. Spec coverage:**
- Trigger (`pull_request: branches: [main]`) → Task 1 Step 1. ✓
- Deploy guard (`if:` main + non-PR) → Task 1 Step 3. ✓
- Ref-scoped concurrency (approach B) → Task 1 Step 2. ✓
- Out-of-scope items (no paths-ignore / permissions / node bump / branch protection) → Global Constraints. ✓
- Verification: local diff/actionlint → Task 1 Steps 4-5; self-verifying PR (gate runs + deploy skipped) → Task 2; post-merge deploy → Task 2 post-merge note. ✓
- Task-completion / Extract follow-ups → Task 2 post-merge note. ✓
No gaps.

**2. Placeholder scan:** `<run-id>` / `<filename>` are runtime values the executor fills from `gh` output, not unspecified plan content — acceptable. No TBD/TODO/"handle edge cases" placeholders. ✓

**3. Type consistency:** No code symbols across tasks. The three verbatim YAML strings in Task 1 match the Global Constraints block exactly (guard, concurrency group, trigger). ✓
