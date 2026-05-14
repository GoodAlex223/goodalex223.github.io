# CI Deadline & Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bump GitHub Actions to Node 24-compatible majors before the 2026-06-02 deprecation deadline and clear three documentation-drift items (ROADMAP refresh, CLAUDE.md shell gotcha, `docs/superpowers/` cleanup) in a single bundled PR.

**Architecture:** Four independent deliverables on branch `chore/ci-deadline-docs`, sequenced low-risk → high-risk (D4 cleanup → D3 CLAUDE.md → D2 ROADMAP → D1 Node 24). One commit per deliverable for clean revert isolation.

**Tech Stack:** GitHub Actions YAML, Markdown, npm scripts (`validate-backlog`, `lint`, `build`).

**Spec:** [docs/archive/specs/2026-05-09_ci-deadline-docs-design.md](../specs/2026-05-09_ci-deadline-docs-design.md)

---

## File Structure

| File | Operation | Purpose |
|---|---|---|
| `docs/superpowers/specs/2026-04-05_automated-link-checking-design.md` | git mv | Move to `docs/archive/specs/` (D4) |
| `docs/superpowers/specs/2026-04-09_ci-hardening-design.md` | git mv | Move to `docs/archive/specs/` (D4) |
| `docs/superpowers/plans/2026-04-09_ci-hardening.md` | git rm | Byte-identical duplicate of archived (D4) |
| `docs/superpowers/plans/2026-04-10_firefox-test-audit.md` | git rm | Byte-identical duplicate of archived (D4) |
| `docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md` | git rm | Byte-identical duplicate of archived (D4) |
| `CLAUDE.md` | edit | Add "Shell Gotchas" subsection (line 200-ish) + cross-link from pre-commit bullet (line 112) (D3) |
| `docs/planning/ROADMAP.md` | rewrite | Replace version-ladder with phase-based timeline (D2) |
| `.github/workflows/deploy.yml` | edit | Bump 7 action references (D1) |

Total deliverables: 8 file operations across 4 commits.

---

## Task 1 (D4): `docs/superpowers/` Cleanup — Move and Delete

**Files:**
- Move: `docs/superpowers/specs/2026-04-05_automated-link-checking-design.md` → `docs/archive/specs/2026-04-05_automated-link-checking-design.md`
- Move: `docs/superpowers/specs/2026-04-09_ci-hardening-design.md` → `docs/archive/specs/2026-04-09_ci-hardening-design.md`
- Delete: `docs/superpowers/plans/2026-04-09_ci-hardening.md`
- Delete: `docs/superpowers/plans/2026-04-10_firefox-test-audit.md`
- Delete: `docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md`

- [ ] **Step 1.1: Pre-flight verify all 5 source files exist and 3 duplicates are still byte-identical**

```bash
ls docs/superpowers/specs/2026-04-05_automated-link-checking-design.md \
   docs/superpowers/specs/2026-04-09_ci-hardening-design.md \
   docs/superpowers/plans/2026-04-09_ci-hardening.md \
   docs/superpowers/plans/2026-04-10_firefox-test-audit.md \
   docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md

git diff --no-index --stat docs/superpowers/plans/2026-04-09_ci-hardening.md docs/archive/plans/2026-04-09_ci-hardening.md
git diff --no-index --stat docs/superpowers/plans/2026-04-10_firefox-test-audit.md docs/archive/plans/2026-04-10_firefox-test-audit-plan.md
git diff --no-index --stat docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md docs/archive/plans/2026-04-10_firefox-test-audit-spec.md
```

Expected: all 5 files listed; all 3 diffs return empty (no output) confirming byte-identical.

If any diff produces output, STOP and ask the user — duplicates are not actually identical and the plan needs to be re-evaluated.

- [ ] **Step 1.2: Pre-flight verify target paths in `docs/archive/specs/` are free**

```bash
test -f docs/archive/specs/2026-04-05_automated-link-checking-design.md && echo "COLLISION" || echo "OK"
test -f docs/archive/specs/2026-04-09_ci-hardening-design.md && echo "COLLISION" || echo "OK"
```

Expected: both lines print `OK`.

If either prints `COLLISION`, STOP — a file with the target name already exists in the archive and the move would overwrite history.

- [ ] **Step 1.3: Move the 2 unarchived specs**

```bash
git mv docs/superpowers/specs/2026-04-05_automated-link-checking-design.md docs/archive/specs/2026-04-05_automated-link-checking-design.md
git mv docs/superpowers/specs/2026-04-09_ci-hardening-design.md docs/archive/specs/2026-04-09_ci-hardening-design.md
```

- [ ] **Step 1.4: Delete the 3 byte-identical duplicates**

```bash
git rm docs/superpowers/plans/2026-04-09_ci-hardening.md
git rm docs/superpowers/plans/2026-04-10_firefox-test-audit.md
git rm docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md
```

- [ ] **Step 1.5: Verify the staged tree**

```bash
git status --short | grep -E "^(R|D)"
```

Expected output (5 lines):

```
R  docs/superpowers/specs/2026-04-05_automated-link-checking-design.md -> docs/archive/specs/2026-04-05_automated-link-checking-design.md
R  docs/superpowers/specs/2026-04-09_ci-hardening-design.md -> docs/archive/specs/2026-04-09_ci-hardening-design.md
D  docs/superpowers/plans/2026-04-09_ci-hardening.md
D  docs/superpowers/plans/2026-04-10_firefox-test-audit.md
D  docs/superpowers/specs/2026-04-10_firefox-test-audit-design.md
```

If renames show as `D` + `A` instead of `R`, that is fine — git's rename detection is heuristic, but the outcome is functionally identical.

- [ ] **Step 1.6: Verify the `.gitkeep` files are still present**

```bash
ls docs/superpowers/plans/.gitkeep docs/superpowers/specs/.gitkeep
```

Expected: both files listed. If missing, restore via `git restore docs/superpowers/plans/.gitkeep docs/superpowers/specs/.gitkeep`.

- [ ] **Step 1.7: Run BACKLOG validator locally**

```bash
npm run validate-backlog
```

Expected: prints `BACKLOG Origin paths: OK` and exits 0.

If it prints any violation referencing one of the 5 touched files, STOP — there is an active BACKLOG entry whose Origin path was just invalidated. Update the BACKLOG entry to point at the new archive location before continuing.

- [ ] **Step 1.8: Commit D4**

```bash
git commit -m "$(cat <<'EOF'
chore: Cleanup docs/superpowers/ duplicates and archive stragglers

Move 2 specs (automated-link-checking, ci-hardening) to docs/archive/specs/
where they belong by convention. Remove 3 byte-identical duplicates
(ci-hardening plan, firefox-test-audit plan + spec) verified via empty
git diff against archive equivalents. Preserve .gitkeep files so
docs/superpowers/ remains as a Superpowers staging directory.

Closes recurring PR #61/#62/#63 review item.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds; pre-commit hook runs `lint-staged` (no staged JS/CSS, so noop) and skips validate-backlog (BACKLOG.md not staged).

---

## Task 2 (D3): CLAUDE.md Shell Gotchas Subsection

**Files:**
- Modify: `CLAUDE.md` — insert new subsection between line 194 (`### BACKLOG Origin Paths`) and line 201 (`### Adding New Projects`); modify line 112 (Pre-commit hook bullet under `### Commits`)

- [ ] **Step 2.1: Verify CLAUDE.md anchor lines have not shifted**

```bash
grep -n "^### " CLAUDE.md | grep -E "(BACKLOG Origin Paths|Adding New Projects|Commits)"
```

Expected: 3 lines printed including `### BACKLOG Origin Paths`, `### Adding New Projects`, and `### Commits`. If line numbers differ from 194/201/108 in the plan, adapt the line-number references in subsequent steps.

- [ ] **Step 2.2: Insert "Shell Gotchas" subsection before "Adding New Projects"**

Use Edit tool with the following exact replacement. The `old_string` is the subsection header for "Adding New Projects"; the `new_string` adds the new subsection above it.

`old_string`:
```
### Adding New Projects
```

`new_string`:
```
### Shell Gotchas

- **Conditional grep + `&&` aborts the chain on no-match**: When a pre-commit hook or CI step uses `grep ... && some-action`, the `&&` short-circuits on grep's exit code 1 (no matches found). On a fresh repo or unstaged-file commit, this *blocks every commit*, not just ones that should trigger the action. Fix: use `if grep ...; then ...; fi` so a no-match exit is treated as "skip", not "fail". Triggered by `.husky/pre-commit` validate-backlog conditional. See the Pre-commit hook bullet under "Commits" for the concrete pattern.

### Adding New Projects
```

- [ ] **Step 2.3: Add cross-link to existing Pre-commit hook bullet**

Use Edit tool to append a sentence to the existing pre-commit hook bullet on line 112.

`old_string`:
```
- **Pre-commit hook** (`.husky/pre-commit`): runs `npx lint-staged || exit 1`, then conditionally runs `npm run validate-backlog` only when `BACKLOG.md` is staged. Uses `if/fi` (not `&&`) to prevent grep's non-zero exit from aborting commits when `BACKLOG.md` is not staged. Grep pattern is `-qE '(^|/)BACKLOG\.md$'` (anchored basename, escaped dot — avoids false matches on `OLD_BACKLOG.md` etc.)
```

`new_string`:
```
- **Pre-commit hook** (`.husky/pre-commit`): runs `npx lint-staged || exit 1`, then conditionally runs `npm run validate-backlog` only when `BACKLOG.md` is staged. Uses `if/fi` (not `&&`) to prevent grep's non-zero exit from aborting commits when `BACKLOG.md` is not staged (see "Shell Gotchas" for the general pattern). Grep pattern is `-qE '(^|/)BACKLOG\.md$'` (anchored basename, escaped dot — avoids false matches on `OLD_BACKLOG.md` etc.)
```

- [ ] **Step 2.4: Visual diff review**

```bash
git diff CLAUDE.md
```

Expected: 2 hunks — one inserting the new subsection, one inserting the "(see "Shell Gotchas" for the general pattern)" parenthetical. No other unintended changes.

- [ ] **Step 2.5: Commit D3**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: Add Shell Gotchas subsection to CLAUDE.md

Elevate the `&&` vs `if/fi` conditional grep gotcha from a buried
Pre-commit-hook bullet into a discoverable top-level subsection.
Cross-link the existing pre-commit-hook bullet to the new section
so future shell gotchas have a natural home.

Closes WEEKLY task: "Document `&&` vs `if/fi` shell gotcha in CLAUDE.md".

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds; pre-commit hook runs `lint-staged` (no staged JS/CSS, noop) and skips validate-backlog (BACKLOG.md not staged).

---

## Task 3 (D2): ROADMAP.md Phase Restructure

**Files:**
- Rewrite: `docs/planning/ROADMAP.md` (77 lines → ~80-100 lines, full content replacement)

- [ ] **Step 3.1: Pull completion-date evidence from DONE.md and git log**

```bash
grep -E "^## 2026-0(1|2|3)" docs/planning/DONE.md | head -20
git log --oneline --since="2026-01-15" --until="2026-04-01" -- index.html css/ js/ | tail -30
```

Use the output to confirm:
- v1.0 launch: 2026-01-20 (from CLAUDE.md memory: "Portfolio rebuild completed 2026-01-20")
- v1.1 polish complete: ~2026-02-13 (link checking + Lighthouse 100/100 + OG by mid-Feb)
- v1.5 enhanced features complete: 2026-03-21 (last v1.5 item — Contact Form Challenge)

If DONE.md / git log shows a different boundary, prefer those dates over the estimates above.

- [ ] **Step 3.2: Replace `docs/planning/ROADMAP.md` content**

Use Write tool to replace the file with the following content (adjust the v1.1/v1.5 dates if Step 3.1 surfaced different evidence):

```markdown
# ROADMAP

**Last Updated**: 2026-05-10

Long-term vision and phase timeline for the portfolio project.

---

## Vision

A clean, fast, accessible personal portfolio that showcases working software with the same care as the projects it links to. No frameworks, minimal dependencies, deliberate engineering throughout.

---

## Phase Timeline

### v1.0 — Launch (✅ Completed 2026-01-20)

Initial portfolio rebuild from scratch.
- 7 projects across 4 categories
- Responsive layout (mobile to desktop)
- Dark theme
- Accessible (WCAG 2.1 AA)
- Zero runtime dependencies

### v1.1 — Polish (✅ Completed 2026-02-13)

Performance, SEO, and link-quality groundwork.
- Favicon + Open Graph image
- Lighthouse 100/100 across Performance/Accessibility/Best Practices/SEO
- External link verification
- robots.txt + sitemap.xml + Google Search Console + Bing Webmaster
- Self-hosted fonts (no third-party CDN)

### v1.5 — Enhanced Features (✅ Completed 2026-03-21)

User-facing feature work.
- Theme toggle (dark/light, persists, no FOUC)
- Project category filtering with animation choreography
- Subtle scroll-reveal animations
- Custom 404 page
- Project Detail Modal (Weekly Challenge — lazy-fetched data, focus management, axe-clean)
- Contact Form (Weekly Challenge — Formspree, honeypot, full validation, accessible state machine)

### Quality & Hardening (🔧 In Progress, since 2026-04)

Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization. See [docs/planning/WEEKLY.md](WEEKLY.md) for the current sprint and [docs/planning/DONE.md](DONE.md) for the historical record.

Active themes:
- Test infrastructure: deterministic DOM-state polling, browser-specific flake elimination
- CI: per-job Node version pinning, BACKLOG-validator gate, Node 24 action upgrade
- Documentation: PR-driven CLAUDE.md sync, archive discipline, per-task plan + spec pairs
- Reviewer rigor: confidence-rated findings, follow-ups extracted to BACKLOG

### v2.0 — Content Expansion (📋 Planned)

Larger content surfaces, scheduled after Quality & Hardening winds down.
- Individual project detail pages (deeper than the modal allows)
- Blog/articles section
- Multi-language support (EN/RU/UA)

---

## Ongoing

- Keep projects section updated with new work
- Update skills as they evolve
- Maintain documentation as code changes
- Regular accessibility audits (axe + manual)
- Performance monitoring (Lighthouse CI gate)

---

## Principles

1. **Simplicity**: No unnecessary complexity
2. **Performance**: Fast load times, minimal dependencies
3. **Accessibility**: Usable by everyone
4. **Maintainability**: Easy to update and extend
5. **Professionalism**: Clean, polished presentation

---

*Last updated: 2026-05-10*
```

- [ ] **Step 3.3: Visual review**

```bash
git diff docs/planning/ROADMAP.md
```

Expected: full-file replacement diff. Confirm:
- v1.0/v1.1/v1.5 each have a `✅ Completed` marker with a date
- Quality & Hardening has `🔧 In Progress` marker
- v2.0 has `📋 Planned` marker
- No leftover content from the old version-ladder structure

- [ ] **Step 3.4: Commit D2**

```bash
git add docs/planning/ROADMAP.md
git commit -m "$(cat <<'EOF'
docs: Restructure ROADMAP.md into phase-based timeline

Replace the stale version-ladder structure (v1.1/v1.5 still showing
unchecked items four months after completion) with a phase-based
timeline that elevates the current Quality & Hardening phase as
first-class. Cross-link to WEEKLY.md and DONE.md instead of
enumerating every PR. Drop "Resume PDF download" from v2.0 (no
longer planned).

Closes WEEKLY task: "Update ROADMAP.md to reflect Quality & Hardening
phase".

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds; pre-commit hook runs `lint-staged` (noop) and skips validate-backlog.

---

## Task 4 (D1): Node 24 GitHub Actions Upgrade

**Files:**
- Modify: `.github/workflows/deploy.yml` — bump 7 action references across 6 jobs (lint, build, check-links, test, lighthouse, deploy)

- [ ] **Step 4.1: Look up latest Node 24-compatible majors for the 4 core actions**

```bash
gh api repos/actions/checkout/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
gh api repos/actions/setup-node/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
gh api repos/actions/upload-artifact/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
gh api repos/actions/download-artifact/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
```

Expected: each prints the 3 most recent releases. Look for the latest major (likely `v5.x.x`) and a release-note line mentioning Node 20/Node 24 runtime. Record each action's target tag (e.g., `v5`).

If any action has no major beyond `v4`, leave it at `@v4` for Step 4.4 and use the workflow-level fallback env var.

- [ ] **Step 4.2: Look up latest Node 24-compatible majors for the 3 Pages-family actions**

```bash
gh api repos/actions/configure-pages/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
gh api repos/actions/upload-pages-artifact/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
gh api repos/actions/deploy-pages/releases --jq '.[0:3] | .[] | "\(.tag_name) - \(.published_at[0:10]) - \(.body | split("\n") | .[0:3] | join(" | "))"'
```

Expected: same format. Pages-family actions historically lag — if any are still on v4 with no Node 24 major, plan to use the `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` env var fallback.

Record the decision matrix:
- Bumpable to vN: list the actions
- Stuck at v4 + needs env var: list the actions

- [ ] **Step 4.3: Read upload-artifact release notes for breaking changes**

```bash
gh api repos/actions/upload-artifact/releases --jq '.[0] | .body' | head -40
```

Expected: scan for breaking-change notices around `include-hidden-files`, compression defaults, or artifact name uniqueness (v5 changed several behaviors). If a breaking change applies to our usage (`build-output`, `playwright-report`, `lighthouse-report` artifacts with `dist/` content), note it.

If a breaking change requires a behavioral fix (e.g., explicit `include-hidden-files: true` if our build emits dot-files), include the input addition in Step 4.4.

- [ ] **Step 4.4: Edit `.github/workflows/deploy.yml` — bump action references**

Use Edit tool with `replace_all: true` for each action. Substitute the target version recorded in Step 4.1/4.2.

```
old_string: "uses: actions/checkout@v4"
new_string: "uses: actions/checkout@v5"   (or whichever major Step 4.1 confirmed)

old_string: "uses: actions/setup-node@v4"
new_string: "uses: actions/setup-node@v5"

old_string: "uses: actions/upload-artifact@v4"
new_string: "uses: actions/upload-artifact@v5"

old_string: "uses: actions/download-artifact@v4"
new_string: "uses: actions/download-artifact@v5"

old_string: "uses: actions/configure-pages@v4"
new_string: "uses: actions/configure-pages@v5"   (or leave at v4 if Step 4.2 found no Node 24 major)

old_string: "uses: actions/upload-pages-artifact@v4"
new_string: "uses: actions/upload-pages-artifact@v5"   (same)

old_string: "uses: actions/deploy-pages@v4"
new_string: "uses: actions/deploy-pages@v5"   (same)
```

If Step 4.3 surfaced a breaking change requiring a new input (e.g., `include-hidden-files: true` on upload-artifact), apply that input edit to each upload-artifact step in the same commit.

- [ ] **Step 4.5: Add `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` opt-in env var (only if any action is stuck at v4)**

If Step 4.2 found that one or more Pages-family actions still need Node 24 forced, add a workflow-level env block. Use Edit tool:

`old_string`:
```
permissions:
  contents: read
  pages: write
  id-token: write
```

`new_string`:
```
permissions:
  contents: read
  pages: write
  id-token: write

env:
  # Force JS actions to Node 24 runtime ahead of GitHub's 2026-06-02 deprecation.
  # Required for actions that have not yet shipped a Node-24-compatible major
  # (currently: <list the actions kept at v4 from Step 4.2>).
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

If all actions bumped successfully in Step 4.4, skip this step entirely and remove this Step from progress tracking.

- [ ] **Step 4.6: Visual diff review**

```bash
git diff .github/workflows/deploy.yml
```

Expected: 7 single-character version bumps (or fewer if some Pages-family actions stay at v4) plus optional env var addition. No other YAML changes.

Sanity check the diff:
- Indentation preserved (2-space YAML)
- No accidental input changes other than what Step 4.3/4.4 demanded
- Env var (if added) sits at workflow level, not job level

- [ ] **Step 4.7: Run `lint`, `build`, and `validate-backlog` locally**

```bash
npm run lint
npm run validate-backlog
npm run build
```

Expected:
- `lint` passes (CSS + JS clean)
- `validate-backlog` prints `BACKLOG Origin paths: OK`
- `build` produces `dist/style.[hash].css` and `dist/main.[hash].js`; `report-sizes` shows CSS gzip ≤ 20 KB and JS gzip ≤ 10 KB

If `build` reports size budget violations, those are unrelated to this task — STOP and ask the user before proceeding.

- [ ] **Step 4.8: Commit D1**

```bash
git add .github/workflows/deploy.yml
git commit -m "$(cat <<'EOF'
ci: Bump GitHub Actions to Node 24-compatible majors

Upgrade 7 action references in deploy.yml ahead of GitHub's 2026-06-02
deadline that retires Node 20 as the default JavaScript-action runtime:
checkout, setup-node, upload-artifact, download-artifact, and the
Pages-family trio (configure-pages, upload-pages-artifact, deploy-pages).

Inputs unchanged: node-version stays at '20' (separate concern; queued
for a future runtime-modernization PR), artifact paths and conditional
upload guards preserved.

Closes WEEKLY task: "Upgrade all GitHub Actions to Node.js 24-compatible
versions" before 2026-06-02.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds; pre-commit hook runs `lint-staged` (noop) and skips validate-backlog.

---

## Task 5: Push Branch and Verify CI

- [ ] **Step 5.1: Push to remote**

```bash
git push -u origin chore/ci-deadline-docs
```

Expected: push succeeds; remote-tracking branch set up.

- [ ] **Step 5.2: Watch the workflow run end-to-end**

```bash
gh run list --branch chore/ci-deadline-docs --limit 1
gh run watch
```

Expected: 5 jobs run (deploy is skipped on push-to-branch — it only runs on push-to-main). All 5 must end green:
- `lint` ✓ (CSS + JS lint + validate-backlog)
- `build` ✓ (artifact uploaded)
- `check-links` ✓ (both check-links and check-assets pass)
- `test` ✓ (Playwright Chromium/Firefox/WebKit)
- `lighthouse` ✓ (≥90/100 all categories)

- [ ] **Step 5.3: If any job fails, diagnose and fix**

Common failure modes to check first:
- `actions/upload-artifact@v5` rejected the artifact name (v5 enforces uniqueness across a workflow run; v4 silently overwrote). Fix: rename one of the artifacts.
- `actions/download-artifact@v5` cannot find the v4-uploaded artifact. Fix: ensure upload+download are both v5 across the same workflow run (not mixed).
- Cache key changed under `actions/setup-node@v5`. Fix: usually self-resolving on second run; verify the cache action runs without error.
- A Pages-family action that was bumped throws "incompatible with Pages permissions" — revert that one to v4 and use the env var fallback.

If the failure does not match any of these, STOP and ask the user before pushing additional commits.

- [ ] **Step 5.4: Confirm clean state for PR**

```bash
git log main..HEAD --oneline
git status --short
```

Expected:
- 5 commits on the branch (1 spec from prior session + D4 + D3 + D2 + D1)
- Clean working tree (or only the carry-over working-tree files: `.claude/settings.json`, `docs/size-history.json`, `sitemap.xml`, `.claude/auto-memory/dirty-files-*` — these are not part of this PR and stay local)

---

## Task 6: Open Pull Request

- [ ] **Step 6.1: Open PR**

```bash
gh pr create --title "chore: CI Deadline & Docs (Node 24 + docs refresh)" --body "$(cat <<'EOF'
## Summary
- Bumps 7 GitHub Actions to Node 24-compatible majors before the 2026-06-02 deadline
- Restructures ROADMAP.md from version-ladder to phase-based timeline; elevates Quality & Hardening as current
- Adds a "Shell Gotchas" subsection to CLAUDE.md (elevating the `&&` vs `if/fi` gotcha) with a cross-link from the existing Pre-commit hook bullet
- Cleans up `docs/superpowers/` — moves 2 unarchived specs to `docs/archive/specs/`, removes 3 byte-identical duplicates

## Test plan
- [x] `npm run lint` — CSS + JS clean
- [x] `npm run validate-backlog` — Origin paths OK
- [x] `npm run build` — within size budget
- [ ] CI: `lint` job passes
- [ ] CI: `build` job passes (artifact uploaded with bumped upload-artifact)
- [ ] CI: `check-links` job passes (download-artifact + both checkers)
- [ ] CI: `test` job passes (Playwright × 3 browsers)
- [ ] CI: `lighthouse` job passes (≥90/100 all categories)
- [ ] Post-merge: `deploy` job succeeds on first main push with bumped Pages-family actions

## Risk

Medium. The 7 action bumps cross a runtime-deprecation boundary; the rest is documentation. `actions/upload-artifact@v5` is the highest-risk single bump (changed defaults around hidden files and compression). Rollback: revert the D1 commit on main and re-deploy.

## Spec / Plan
- Spec: [docs/superpowers/specs/2026-05-09-ci-deadline-docs-design.md](docs/superpowers/specs/2026-05-09-ci-deadline-docs-design.md)
- Plan: [docs/superpowers/plans/2026-05-09-ci-deadline-docs.md](docs/superpowers/plans/2026-05-09-ci-deadline-docs.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR created; URL printed.

- [ ] **Step 6.2: Confirm CI on the PR**

```bash
gh pr checks
```

Expected: all 5 checks pending or green. If any check is red, return to Step 5.3.

- [ ] **Step 6.3: Report PR URL to user and stop**

End of plan execution. Wait for user review of the PR before merging.

---

## Verification Summary

After all 6 tasks complete and the PR is open with green checks:

| Deliverable | Verification |
|---|---|
| D4 (cleanup) | `git status` clean for `docs/superpowers/`; `validate-backlog` passes |
| D3 (CLAUDE.md) | Visual diff shows 2 hunks; new section visible under "Key Patterns & Gotchas" |
| D2 (ROADMAP.md) | Phase markers (✅ / 🔧 / 📋) present; cross-links to WEEKLY.md and DONE.md work |
| D1 (Node 24) | All 5 CI jobs pass green; deploy job verified post-merge |

If post-merge `deploy` job fails on the bumped Pages-family actions, revert the D1 commit on main and re-deploy. The other 3 deliverables stand on their own and do not need rollback.
