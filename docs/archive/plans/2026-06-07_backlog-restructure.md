# Backlog Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `docs/planning/BACKLOG.md` into a source-split file (📌 Process Rules + 🔵 User-Flagged / 🟡 Operational / 🟤 Auto-Generated) with weekly SP quotas, pruning completed items while preserving every open item and every `**Origin**` line; add a `## Backlog Intake Rules` section to `CLAUDE.md`; and ship a Node structure-guard pre-commit hook wired into husky + CI.

**Architecture:** One feature branch `chore/backlog-restructure` with up to 5 implementation commits. Pass 1 produces a per-item classification artifact reviewed by the user before any BACKLOG edit. Pass 2 rewrites BACKLOG.md mechanically from the approved table, with four no-loss checks (open-item set parity, Origin preservation, 4-header structure, prune accounting) embedded in the commit message. CLAUDE.md and the structure-guard hook follow as small, independently-revertible commits. An optional reword pass can run later.

**Tech Stack:** Markdown (BACKLOG.md, CLAUDE.md), Node.js (CommonJS, in the style of `scripts/validate-backlog-paths.js`), husky pre-commit, GitHub Actions (`.github/workflows/deploy.yml`), git. Commands below run via the Bash tool (git-bash on Windows); `grep`/`sed`/`sort`/`comm`/`wc` are available there.

**Spec:** `docs/archive/specs/2026-06-07_backlog-restructure-design.md` (committed as `607cef9`).

---

## File Structure

**Files to create:**
- `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` — Pass 1 per-item classification artifact (table + prune list + promotion list + counts + sign-off)
- `scripts/check-backlog-structure.js` — pre-commit hook asserting the 4 required top-level headers exist in BACKLOG.md

**Files to modify:**
- `docs/planning/BACKLOG.md` — full rewrite (pinned 📌 Process Rules + 3 source sections; completed items pruned; `### From … (date)` sub-headers + `**Origin**` lines preserved)
- `docs/planning/BACKLOG.md` header `**Last Updated**` line — refreshed to the rewrite date
- `CLAUDE.md` — add `## Backlog Intake Rules` section (~25 lines) after `## Code Conventions`, before `## Key Patterns & Gotchas`
- `package.json` — add `"check-backlog-structure"` script
- `.husky/pre-commit` — run the structure hook conditionally when BACKLOG.md is staged
- `.github/workflows/deploy.yml` — add a structure-check step to the `lint` job

**Files NOT touched:**
- `docs/planning/TODO.md`, `docs/planning/DONE.md`, `docs/planning/ROADMAP.md`, `docs/planning/WEEKLY.md` — out of scope per spec
- `scripts/validate-backlog-paths.js` — stays as-is; we preserve `**Origin**` lines rather than change the validator
- `~/.claude/CLAUDE.md` (global) — project-specific change only
- Weekly-planning prompt — user-local, verified verbally (Task 8)

**Branch note:** the spec was committed (`607cef9`) on `content/content-005-hardware-screenshots`. This implementation branches `chore/backlog-restructure` off `main`. The spec file is not yet on `main`; Task 1 cherry-picks it onto the new branch so the branch is self-contained and Origin/links resolve.

---

## Task 1: Set Up Feature Branch and Capture Baseline

**Files:**
- No files modified yet — branch + baseline only.

- [ ] **Step 1: Confirm working state and current branch**

Run:
```bash
git status --short
git branch --show-current
git log -1 --oneline
```

Expected: branch is `content/content-005-hardware-screenshots`; HEAD is `607cef9` (the spec commit); working tree has only pre-existing unrelated WIP (`.claude/settings.json`, `.mcp.json.example`, `docs/size-history.json`, `sitemap.xml`, untracked wokwi PNGs, `.playwright-mcp/`). Do NOT stage or commit any of that WIP.

- [ ] **Step 2: Create the branch off main and bring the spec along**

The WIP is unrelated to this task. Stash it (including untracked) so the branch starts clean, branch off `main`, then cherry-pick the spec commit:
```bash
git stash push -u -m "content-005 WIP (restore after backlog-restructure)"
git checkout main
git checkout -b chore/backlog-restructure
git cherry-pick 607cef9
git log -1 --oneline
```

Expected: new branch `chore/backlog-restructure` with the spec commit (`docs(specs): backlog restructure design (source-split + quotas)`) applied. If `git cherry-pick` reports the commit is already present on main (e.g., content-005 was merged), skip it — verify the spec file exists with `ls docs/superpowers/specs/2026-06-07_backlog-restructure-design.md`.

NOTE: the stashed WIP is restored at the very end (Task 7 Step 4) after returning to the content-005 branch. It is NOT part of this branch.

- [ ] **Step 3: Capture baseline metrics for no-loss verification**

Run (creates scratch files in `/tmp`, NOT committed):
```bash
mkdir -p /tmp/backlog-baseline
B=docs/planning/BACKLOG.md
# Open items: trimmed text of every '- [ ]' line (any indentation). Sorted unique set.
grep -nE '^[[:space:]]*- \[ \]' "$B" | sed -E 's/^[0-9]+:[[:space:]]*//' | sort -u > /tmp/backlog-baseline/open-items.txt
# Completed items (to be pruned): '- [x]' checkboxes and '~~strikethrough~~' lines.
grep -nE '^[[:space:]]*- \[x\]|~~' "$B" > /tmp/backlog-baseline/completed-items.txt
# Origin lines (must survive for sections with open items).
grep -nE '^\s*(?:[-*+]\s+)?\*\*Origin\*\*' "$B" > /tmp/backlog-baseline/origin-lines.txt
# Counts.
echo "open:      $(wc -l < /tmp/backlog-baseline/open-items.txt)"
echo "completed: $(wc -l < /tmp/backlog-baseline/completed-items.txt)"
echo "origins:   $(wc -l < /tmp/backlog-baseline/origin-lines.txt)"
```

Expected: three baseline files + a count summary. Record the three integers — they are reused in Task 2 (verification counts) and Task 3 (no-loss checks). `open-items.txt` is the authoritative set every open item must round-trip into.

---

## Task 2: Generate Pass 1 Classification Artifact

**Files:**
- Create: `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md`

- [ ] **Step 1: Enumerate every open item with its current section context**

Run:
```bash
B=docs/planning/BACKLOG.md
# Section headers (## and ###) with line numbers — the provenance context.
grep -nE '^#{2,3} ' "$B" > /tmp/backlog-baseline/headers.txt
# Open items with line numbers.
grep -nE '^[[:space:]]*- \[ \]' "$B" > /tmp/backlog-baseline/open-items-lines.txt
wc -l /tmp/backlog-baseline/headers.txt /tmp/backlog-baseline/open-items-lines.txt
```

Expected: two files. For every open-item line, the nearest preceding `##`/`###` header (from `headers.txt`) is its current section. This mapping is the raw input for the classification table.

- [ ] **Step 2: Identify plain-`-` prose bullets that are open work (promotion candidates)**

Several topical sections express open work as plain `-` bullets rather than `- [ ]`. Read these sections in `docs/planning/BACKLOG.md` and list any plain bullet that is genuinely actionable open work:
- `## Features` (e.g. "Project Detail Pages", "Blog Section" and its "Planned Blog Posts" list, "Contact Form" — note Contact Form is already shipped; verify against DONE.md before promoting)
- `## Internationalization (i18n)` → "Multi-Language Support" (its sub-bullets are already `- [ ]`, so likely no promotion needed — verify)
- `## Media & Visual Content` → "Project Card Media Enhancements", "Project Media Strategy" (mix of `- [ ]` and prose)
- `## Ideas from Portfolio Rebuild` (plain bullets)
- `## Notes` (struck — prune, do not promote)

For each genuine open prose bullet, decide: promote to `- [ ]` (and which source bucket), or drop (if obsolete/superseded). Record decisions in the promotion list (Step 3). Do NOT promote already-completed or struck prose.

- [ ] **Step 3: Write the classification artifact**

Create `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` with this structure. Fill in ACTUAL rows for every open item from Step 1 and every promotion from Step 2 — no `...` placeholders in the committed artifact:

````markdown
# BACKLOG.md Pass 1 Classification Artifact

**Spec:** [2026-06-07_backlog-restructure-design.md](./2026-06-07_backlog-restructure-design.md)
**Status:** Awaiting user audit before BACKLOG.md rewrite (Task 3)
**Generated:** 2026-06-07
**Source file:** `docs/planning/BACKLOG.md` at branch `chore/backlog-restructure` HEAD

## Purpose

One row per OPEN item in BACKLOG.md, classified into the 3 source sections defined in
the spec. **The user must audit this artifact before the Task 3 rewrite begins.** Push
back on misclassifications, request splits, flag dups, object to prunes.

## Classification rules (tie-breakers)

- 🔵 User-Flagged — user raised it: feature ideas, content tasks (screenshots, showcase
  repos, README fixes), UX changes, user-reported bugs.
- 🟡 Operational — time-sensitive ops/watch: post-deploy & CI checks, Lighthouse/size
  monitoring, Bing-index verification, Formspree spam watch, dependency/Actions deadlines.
- 🟤 Auto-Generated — Claude/automation surfaced: `(code review finding, confidence NN)`
  items, PR post-merge review, CLAUDE.md staleness, doc-hygiene, test robustness/backfill.
- 🔵-vs-🟡 tie: tooling the user explicitly wants → 🔵; pure monitoring/observation → 🟡.
- 🔵-vs-🟤 tie: visible content/feature impact → 🔵; internal code/test/doc hygiene → 🟤.

## Verification counts (pre-migration)

- Open items: <N from Task 1 Step 3>
- Completed/struck items (to prune): <N from Task 1 Step 3>
- Origin lines: <N from Task 1 Step 3>
- Promotions (plain `-` → `- [ ]`): <count from Step 2>

## Classification table

| # | Current section (line) | Open item title | Proposed source | Proposed `### From …` sub-header | Keep `**Origin**`? | Notes |
|---|---|---|---|---|---|---|
| 1 | `## Features` → Project Detail Modal (L29) | Data structure decision (JSON vs attrs vs JS object) | 🔵 User | `### From Project Detail Modal (2026-01-22)` | n/a | — |
| 2 | ... (one row per open item) | ... | ... | ... | ... | ... |

## Prune list (completed items dropped)

Grouped by current section. Each line is recoverable via git history + its `*(completed …)*` tag.

- `## Features` → ~~Theme Toggle~~ *(completed 2026-01-28, MP-003)*
- ... (one bullet per completed/struck item)

## Promotion list (plain `-` bullets promoted to `- [ ]`)

- `## Media & Visual Content` → "Add multiple project images to project cards (carousel/gallery)" → 🔵 User → `### From Project Card Media Enhancements (2026-01-27)`
- ... (one bullet per promotion; or "None" if empty)

## Items per source (after classification)

- 🔵 User-Flagged: <count> items
- 🟡 Operational: <count> items
- 🟤 Auto-Generated: <count> items
- **Total: <count> == open-items baseline (<N>) + promotions (<count>)**

## Audit sign-off

- [ ] User reviewed and approved the classification (date: ___)
- [ ] Misclassifications / prune objections corrected
- [ ] Source-totals equal open-items baseline + promotions
````

The actual rows for every open item must be filled in — do not leave `...` placeholders in the committed artifact.

- [ ] **Step 4: Verify the artifact is complete (no placeholders, totals reconcile)**

Run:
```bash
C=docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md
# No literal placeholders left in committed rows.
grep -nE '\bTBD\b|one row per open item|\.\.\.' "$C" && echo "FAIL: placeholders remain" || echo "OK: no placeholders"
# Table row count (excluding header + separator) >= open-items baseline.
echo "table rows: $(grep -cE '^\| [0-9]' "$C")"
echo "open baseline: $(wc -l < /tmp/backlog-baseline/open-items.txt)"
```

Expected: "OK: no placeholders"; table-row count == open-items baseline (every open item has a row). The per-source totals in the artifact must equal baseline + promotions. If short, add missing rows before commit.

- [ ] **Step 5: Commit (Commit A)**

```bash
git add docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md
git commit -m "$(cat <<'EOF'
docs(specs): backlog restructure Pass 1 classification artifact

One row per OPEN item in docs/planning/BACKLOG.md, classified into
🔵 User-Flagged / 🟡 Operational / 🟤 Auto-Generated per the spec at
docs/superpowers/specs/2026-06-07_backlog-restructure-design.md.
Includes prune list (completed items to drop) and promotion list
(plain-bullet open work to convert). Awaiting user audit before rewrite.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
git log -1 --oneline
```

Expected: commit lands on `chore/backlog-restructure`. The commit-msg header is ≤72 chars (commitlint enforces this — keep the header line short).

---

## Task 3: User Audit Gate

**Files:**
- No files modified — review gate only.

- [ ] **Step 1: Surface the artifact for user review**

Stop work. Tell the user explicitly:

> "Classification artifact is at `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md`. Please review for misclassifications, splits, dups, and prune objections. No BACKLOG.md edits will happen until you approve. Reply with: (a) approved as-is, (b) specific row changes, or (c) bulk correction."

- [ ] **Step 2: Apply any user-requested corrections**

If the user requests changes: edit the artifact, re-verify Step 4 totals, and amend Commit A (`git commit --amend --no-edit` after `git add`). If approved as-is, tick the sign-off boxes and amend:
```bash
C=docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md
sed -i 's/- \[ \] User reviewed and approved the classification (date: ___)/- [x] User reviewed and approved the classification (date: 2026-06-07)/' "$C"
git add "$C"
git commit --amend --no-edit
```
(Use the actual approval date.)

- [ ] **Step 3: Confirm approval is recorded**

```bash
grep 'User reviewed and approved' docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md
```

Expected: line shows `[x]` with a real date. If `[ ]`, do NOT proceed to Task 4.

---

## Task 4: Rewrite BACKLOG.md (Pass 2 — Mechanical Rewrite + No-Loss Verification)

**Files:**
- Modify: `docs/planning/BACKLOG.md` (full rewrite)

- [ ] **Step 1: Build the new file skeleton**

Create `/tmp/BACKLOG.md.new` starting with the header + pinned Process Rules. Use this exact top-of-file block (the 4 `##` headers must match the structure hook's required strings character-for-character, emoji included):

````markdown
# Backlog

Future ideas and improvements for the portfolio.

**Last Updated**: 2026-06-07 (restructure — source-split + pinned process rules)

**Active tasks**: See [TODO.md](TODO.md)
**Completed work**: See [DONE.md](DONE.md)
**Design spec**: See [docs/archive/specs/2026-06-07_backlog-restructure-design.md](../specs/2026-06-07_backlog-restructure-design.md)

---

## 📌 Process Rules (READ BEFORE PROPOSING WORK)

This file is split into three source sections. Weekly planning MUST respect the quotas
below. The split exists because user-flagged feature/content work was systematically
crowded out by auto-generated PR-review follow-ups (root cause: BACKLOG had no source
concept; the weekly-planning prompt selected on priority + domain only).

### Source sections (in priority order for weekly picks)
- 🔵 User-Flagged Ideas — user-raised: feature ideas, content tasks (screenshots,
  showcase repos, README fixes), UX changes, user-reported bugs. Default home for any
  item the user explicitly raised.
- 🟡 Operational & Observation Items — time-sensitive ops/watches: post-deploy & CI
  checks, Lighthouse/size-budget monitoring, Bing-index verification, Formspree spam
  watch, dependency/GitHub-Actions deadline items. NOT feature work.
- 🟤 Auto-Generated Tech Debt — Claude/automation-surfaced: code-review findings,
  PR post-merge review, CLAUDE.md staleness, doc-hygiene sweeps, test robustness/
  backfill, plan-archival debt.

### Quotas (hard rules for weekly planning)
- ≥50% of weekly SP from 🔵 User-Flagged
- ≤25% of weekly SP from 🟡 Operational
- ≤1 group per week (batch OR solo) from 🟤 Auto-Generated, AND total auto-generated
  SP ≤25% of weekly SP. PR-review items accumulate; they are NOT spread across the week.
- Cleanup Week cadence: every ~3 weeks (or when 🟤 grows beyond ~20 SP pending),
  schedule a dedicated Cleanup Week that inverts the quota — note in WEEKLY.md header.
- Quota Check subsection mandatory in every WEEKLY.md Notes section.

### Intake rules (when adding NEW entries)
- User mentions it → 🔵 User-Flagged under `### From <event> (YYYY-MM-DD)`
- PR post-merge review / code-review finding → 🟤 Auto-Generated under
  `### From PR #N … review (YYYY-MM-DD)`
- Post-deploy / observation / monitoring → 🟡 Operational
- If unsure, ask before adding — default-to-🔵 if user-raised, default-to-🟤 if
  Claude-surfaced
- One entry per concrete actionable item; do NOT merge entries on intake even if they
  look similar — explicit `[possible-dup-of: ...]` tag instead

### Origin convention (portfolio-specific — validator-enforced)
- Any section migrated from a completed plan keeps its
  `**Origin**: docs/archive/plans/<file>` line. `scripts/validate-backlog-paths.js`
  (pre-commit + CI lint) forbids `docs/planning/plans/` and `docs/superpowers/` Origin
  paths — always reference the archived plan.

### Cross-references
- Active tasks: TODO.md
- Completed work: DONE.md
- Weekly plan: WEEKLY.md (must include Quota Check)
- Roadmap/milestones: ROADMAP.md

---

## 🔵 User-Flagged Ideas

<sections from the artifact where source = 🔵, intake-date descending>

---

## 🟡 Operational & Observation Items

<sections from the artifact where source = 🟡, intake-date descending>

---

## 🟤 Auto-Generated Tech Debt

<sections from the artifact where source = 🟤, intake-date descending>
````

Replace each `<sections from …>` block with actual content in the next steps.

- [ ] **Step 2: Populate 🔵 User-Flagged section**

For every artifact row with `Proposed source = 🔵`, newest intake-date first:
1. Create/find the `### From … (YYYY-MM-DD)` sub-header from the artifact's "Proposed sub-header" column.
2. If the artifact's "Keep `**Origin**`?" column is yes, copy the original `**Origin**:` line verbatim under the sub-header.
3. Append each open item **verbatim** (preserve `- [ ]` text exactly — rewording is the separate optional Task 6). Promoted items use the new `- [ ]` text from the promotion list.

- [ ] **Step 3: Populate 🟡 Operational section**

Same procedure as Step 2 for rows where `Proposed source = 🟡`. Intake-date descending.

- [ ] **Step 4: Populate 🟤 Auto-Generated section**

Same procedure as Step 2 for rows where `Proposed source = 🟤`. Intake-date descending.

- [ ] **Step 5: Run no-loss verification (four mechanical checks)**

```bash
NEW=/tmp/BACKLOG.md.new
BASE=/tmp/backlog-baseline

# Build the expected open-item set = baseline open-items ∪ promotion texts.
# Extract promoted '- [ ]' texts from the artifact's Promotion list into /tmp/promotions.txt
# (one trimmed '- [ ] ...' line each; create empty file if no promotions).
sort -u /tmp/backlog-baseline/open-items.txt /tmp/promotions.txt > /tmp/expected-open.txt

# New file's open-item set.
grep -nE '^[[:space:]]*- \[ \]' "$NEW" | sed -E 's/^[0-9]+:[[:space:]]*//' | sort -u > /tmp/new-open.txt

echo "=== Check 1: open-item parity ==="
if diff -q /tmp/expected-open.txt /tmp/new-open.txt >/dev/null; then echo "PASS"; else echo "FAIL"; diff /tmp/expected-open.txt /tmp/new-open.txt; fi

echo "=== Check 2: Origin preservation (every retained-section Origin present) ==="
# Every Origin path that had open items must appear in the new file. List any missing:
comm -23 \
  <(sed -E 's/^[0-9]+://' "$BASE/origin-lines.txt" | sed -E 's/^[[:space:]]*//' | sort -u) \
  <(grep -E '^\s*(?:[-*+]\s+)?\*\*Origin\*\*' "$NEW" | sed -E 's/^[[:space:]]*//' | sort -u) \
  > /tmp/missing-origins.txt
if [ -s /tmp/missing-origins.txt ]; then echo "REVIEW: origins absent (OK only if their section had no open items):"; cat /tmp/missing-origins.txt; else echo "PASS: all origins present"; fi

echo "=== Check 3: structure (exactly 4 ## headers) ==="
grep -E '^## ' "$NEW"
# Expect exactly: 📌 Process Rules / 🔵 User-Flagged Ideas / 🟡 Operational & Observation Items / 🟤 Auto-Generated Tech Debt

echo "=== Check 4: prune accounting ==="
echo "dropped_completed_count = $(wc -l < /tmp/backlog-baseline/completed-items.txt)"
```

Expected: Check 1 PASS (exact set equality). Check 2 PASS, or any listed missing origin must correspond ONLY to sections whose every item was completed (and thus pruned) — verify each against the prune list; if an origin for a section WITH open items is missing, it's a real failure. Check 3 shows exactly the 4 headers. Check 4 prints the prune count for the commit message.

If Check 1 or 3 fails, or Check 2 lists an origin for a section with surviving open items: do NOT swap the file. Diff, recover the missing content from the artifact, re-run Step 5.

- [ ] **Step 6: Replace BACKLOG.md with the verified new file**

Only after Step 5 passes:
```bash
mv /tmp/BACKLOG.md.new docs/planning/BACKLOG.md
```

- [ ] **Step 7: Spot-check + run the existing Origin validator**

```bash
sed -n '1,40p' docs/planning/BACKLOG.md
grep -E '^## ' docs/planning/BACKLOG.md
npm run validate-backlog
```

Expected: top of file shows the pinned `## 📌 Process Rules` section; the `## ` list shows exactly the 4 source headers; `validate-backlog` prints `BACKLOG Origin paths: OK` (no forbidden paths introduced).

- [ ] **Step 8: Commit (Commit B)**

```bash
git add docs/planning/BACKLOG.md
git commit -m "$(cat <<'EOF'
docs(planning): restructure BACKLOG — source-split + pinned rules

Replaces the topical+origin hybrid layout with 3 source sections + a
pinned 📌 Process Rules block:
- 🔵 User-Flagged Ideas (feature/content tasks, UX, user bugs)
- 🟡 Operational & Observation Items (post-deploy/CI, monitoring, watches)
- 🟤 Auto-Generated Tech Debt (code-review findings, doc/test hygiene)

Completed items pruned; OPEN items preserved verbatim. **Origin** lines
retained for sections with open items (validate-backlog-paths.js green).

No-loss verification vs pre-migration baseline:
- Open-item set parity: PASS (baseline ∪ promotions == new set)
- Origin preservation: PASS
- Structure: 4 required headers present
- Pruned completed items: <dropped_completed_count>

Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md
Pass 1: docs/archive/specs/2026-06-07_backlog-restructure-classification.md

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

Substitute `<dropped_completed_count>` with the actual number from Step 5 Check 4. The pre-commit hook will run `validate-backlog` (BACKLOG is staged) — it must pass. Do NOT bypass with `--no-verify`.

---

## Task 5: Add `## Backlog Intake Rules` to `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Find the insertion point**

```bash
grep -nE '^## ' CLAUDE.md
```

Expected: a list including `## Code Conventions` and `## Key Patterns & Gotchas`. Insert the new section between them (after the last line of Code Conventions, before `## Key Patterns & Gotchas`).

- [ ] **Step 2: Insert the section**

Use the Edit tool to insert this block immediately before the `## Key Patterns & Gotchas` line:

````markdown
## Backlog Intake Rules

BACKLOG.md is split into three source sections. Authoritative rules live in
`docs/planning/BACKLOG.md` 📌 Process Rules section — read it first. Summary:

### Where new entries go
- User mentioned it (conversation, idea sharing, content request) → 🔵 User-Flagged
- Claude/automation surfaced it (code-review finding, PR post-merge review, CLAUDE.md
  staleness, doc hygiene, test backfill) → 🟤 Auto-Generated Tech Debt
- Time-sensitive ops/watch (post-deploy, CI check, Lighthouse/size monitoring,
  Bing-index verification, Formspree spam watch) → 🟡 Operational & Observation
- Unsure → ask before adding; default-to-🔵 if user-raised, default-to-🟤 if Claude-surfaced

### Intake format
- Group by `### From <event> (YYYY-MM-DD)`
- Keep the `**Origin**: docs/archive/plans/<file>` line when migrating from a completed
  plan (validate-backlog-paths.js enforces archive paths)
- One entry per concrete actionable item; never silently merge similar entries on
  intake — tag `[possible-dup-of: <other-entry-title>]` instead
- Required entry shape: `- [ ] **Short title** — body with context, cross-refs, affected files`

### Rate limit on 🟤 Auto-Generated
- PR post-merge review findings accumulate in a single `### From PR #N … review` section
  per PR — they do NOT spread into the weekly plan unless this week is a Cleanup Week
  (declared in WEEKLY.md header)
- When 🟤 grows beyond ~20 SP of pending items, surface this in the next planning
  conversation as a Cleanup Week trigger

````

- [ ] **Step 3: Verify the section landed**

```bash
grep -nA2 '^## Backlog Intake Rules' CLAUDE.md | head -5
```

Expected: the new header followed by its first ~2 lines.

- [ ] **Step 4: Commit (Commit C)**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(claude): add Backlog Intake Rules section

Cross-references the authoritative 📌 Process Rules in
docs/planning/BACKLOG.md. Documents intake routing defaults
(user-raised → 🔵, Claude-surfaced → 🟤, ops → 🟡), the no-merge-on-intake
rule, the **Origin** archive-path convention, and the 🟤 PR-review rate limit.

Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

Verify the staged diff is ONLY the new section (CLAUDE.md may have no other pending edits on this branch, but confirm): `git show --stat HEAD`.

---

## Task 6: Structure-Guard Hook + Wiring

**Files:**
- Create: `scripts/check-backlog-structure.js`
- Modify: `package.json`, `.husky/pre-commit`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the hook script**

Create `scripts/check-backlog-structure.js` (mirrors `scripts/validate-backlog-paths.js`: CommonJS, JSDoc header, git-index read by default, ANSI errors; accepts an optional path argument for standalone/testing):

```javascript
/**
 * Validates that docs/planning/BACKLOG.md retains the 4 required top-level
 * headers: the pinned 📌 Process Rules section plus the 3 source sections
 * (🔵 User-Flagged / 🟡 Operational / 🟤 Auto-Generated). The source-split is
 * load-bearing for weekly planning — accidental deletion of a header (or an
 * emoji typo) would silently break source-quota enforcement. Reads from the
 * git index when available (canonical "what's about to be committed"); falls
 * back to the working tree. An optional path argument overrides both (used for
 * standalone checks and tests). Invoked by pre-commit hook, npm script, and CI.
 *
 * Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BACKLOG_REL_PATH = 'docs/planning/BACKLOG.md';

const REQUIRED_HEADERS = [
  '## 📌 Process Rules (READ BEFORE PROPOSING WORK)',
  '## 🔵 User-Flagged Ideas',
  '## 🟡 Operational & Observation Items',
  '## 🟤 Auto-Generated Tech Debt',
];

function readBacklog(argPath) {
  if (argPath) {
    if (!fs.existsSync(argPath)) return null;
    return fs.readFileSync(argPath, 'utf8');
  }
  // Default: read the staged content from the git index (matches
  // validate-backlog-paths.js). Falls back to working tree if git is absent.
  try {
    return execFileSync('git', ['show', `:${BACKLOG_REL_PATH}`], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    try {
      execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      // Inside a git repo but file not in index — skip.
      return null;
    } catch {
      const fullPath = path.join(__dirname, '..', BACKLOG_REL_PATH);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    }
  }
}

const content = readBacklog(process.argv[2]);
if (content === null) {
  console.log('BACKLOG structure: skipped (BACKLOG.md not present)');
  process.exit(0);
}

const missing = REQUIRED_HEADERS.filter((h) => !content.includes(h));

if (missing.length > 0) {
  console.error('\x1b[31mBACKLOG structure validation failed — missing required headers:\x1b[0m\n');
  missing.forEach((h) => console.error(`  - ${h}`));
  console.error(
    '\n\x1b[33mThe source-split (📌 Process Rules + 🔵/🟡/🟤) is load-bearing for weekly planning. Restore the missing header(s).\x1b[0m\n'
  );
  process.exit(1);
}

console.log('BACKLOG structure: OK');
```

- [ ] **Step 2: Smoke test against the real BACKLOG.md (positive)**

```bash
node scripts/check-backlog-structure.js docs/planning/BACKLOG.md
echo "exit=$?"
```

Expected: `BACKLOG structure: OK` and `exit=0` (BACKLOG.md from Task 4 has all 4 headers).

- [ ] **Step 3: Negative test against a broken copy**

```bash
cp docs/planning/BACKLOG.md /tmp/BACKLOG.broken.md
sed -i 's/## 📌 Process Rules (READ BEFORE PROPOSING WORK)/## XX Process Rules/' /tmp/BACKLOG.broken.md
node scripts/check-backlog-structure.js /tmp/BACKLOG.broken.md
echo "exit=$?"
rm /tmp/BACKLOG.broken.md
```

Expected: stderr lists the missing `## 📌 Process Rules (READ BEFORE PROPOSING WORK)` header; `exit=1`.

- [ ] **Step 4: Add the npm script**

Edit `package.json` — add this line to `"scripts"` immediately after the `"validate-backlog"` line:
```json
    "check-backlog-structure": "node scripts/check-backlog-structure.js",
```

Verify JSON parses:
```bash
node -e "require('./package.json'); console.log('package.json OK')"
```

Expected: `package.json OK`.

- [ ] **Step 5: Wire into `.husky/pre-commit`**

The current hook is:
```bash
npx lint-staged || exit 1
if git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$'; then
  npm run validate-backlog
fi
```

Use the Edit tool to add the structure check inside the same `if` block (it shares the BACKLOG-staged condition), so the block becomes:
```bash
npx lint-staged || exit 1
if git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$'; then
  npm run validate-backlog
  npm run check-backlog-structure
fi
```

(Keeping both inside one `if/fi` preserves the documented grep-`&&` gotcha avoidance — a no-match `grep` exit does not abort the commit.)

- [ ] **Step 6: Wire into CI `lint` job**

Use the Edit tool on `.github/workflows/deploy.yml` — add a step immediately after the existing "Validate BACKLOG Origin paths" step (around line 41-42):
```yaml
      - name: Check BACKLOG structure
        run: npm run check-backlog-structure
```

Verify YAML parses (if `python`/`yq` available; otherwise visual-check indentation matches the sibling step):
```bash
python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('yaml OK')" 2>/dev/null || echo "skip yaml lint (no python yaml); verify indentation manually"
```

Expected: `yaml OK` (or the skip message). Indentation must match the "Validate BACKLOG Origin paths" step exactly (6-space `- name:`).

- [ ] **Step 7: End-to-end pre-commit dry run**

Confirm the hook fires correctly by staging BACKLOG.md and running the hook commands manually (the next real commit, Step 8, exercises it for real):
```bash
git add docs/planning/BACKLOG.md
git diff --cached --name-only | grep -qE '(^|/)BACKLOG\.md$' && npm run validate-backlog && npm run check-backlog-structure
echo "exit=$?"
git restore --staged docs/planning/BACKLOG.md
```

Expected: both scripts print OK; `exit=0`.

- [ ] **Step 8: Commit (Commit D)**

```bash
git add scripts/check-backlog-structure.js package.json .husky/pre-commit .github/workflows/deploy.yml
git commit -m "$(cat <<'EOF'
chore(scripts): add backlog-structure-intact guard

scripts/check-backlog-structure.js asserts docs/planning/BACKLOG.md retains
the 4 required top-level headers (📌 Process Rules + 🔵/🟡/🟤 source
sections). Reads the git index by default (matches validate-backlog-paths.js);
optional path arg for standalone/testing.

Wired three ways, mirroring validate-backlog:
- package.json "check-backlog-structure" script
- .husky/pre-commit (runs when BACKLOG.md is staged, same if/fi guard)
- CI lint job step (closes the --no-verify bypass)

Verified: positive smoke test (exit 0) + negative test (missing header → exit 1).

Spec: docs/archive/specs/2026-06-07_backlog-restructure-design.md

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit lands. The pre-commit hook runs `lint-staged` (eslint on the new JS file — fix any lint errors in-place) and, because BACKLOG.md is NOT staged in this commit, the BACKLOG conditional is skipped. Do NOT bypass hooks.

---

## Task 7: Open Pull Request and Restore WIP

**Files:**
- No file modifications — repository operations only.

- [ ] **Step 1: Verify branch state**

```bash
git log main..HEAD --oneline
git status --short
```

Expected: 4-5 commits ahead of `main` (spec cherry-pick + A + B + C + D, plus optional E). Working tree clean.

- [ ] **Step 2: Push the branch**

```bash
git push -u origin chore/backlog-restructure
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --base main --title "Restructure BACKLOG: source-split + weekly quotas + lossless-for-open migration" --body "$(cat <<'EOF'
## Summary

- Restructures `docs/planning/BACKLOG.md` into 3 source sections (🔵 user-flagged / 🟡 operational / 🟤 auto-generated) with a pinned 📌 Process Rules block at top
- Encodes hard weekly SP quotas: ≥50% user-flagged, ≤25% ops, ≤1 auto group + ≤25% auto SP, cleanup week every ~3 weeks
- Prunes completed items; OPEN items preserved verbatim; `**Origin**` lines retained (validate-backlog-paths.js stays green)
- Adds `## Backlog Intake Rules` to `CLAUDE.md` cross-referencing the pinned rules
- Adds `check-backlog-structure.js` guard (husky + npm + CI) protecting the 4 required headers

## Spec & classification
- Spec: `docs/archive/specs/2026-06-07_backlog-restructure-design.md`
- Pass 1 classification (user-audited): `docs/archive/specs/2026-06-07_backlog-restructure-classification.md`

## Test plan
- [ ] No-loss verification numbers in the BACKLOG rewrite commit match (open-item parity PASS)
- [ ] `npm run validate-backlog` exits 0
- [ ] `npm run check-backlog-structure` exits 0; negative test (missing header) exits 1
- [ ] Pre-commit hook + CI lint job both run the structure check
- [ ] First weekly plan under the new rules produces a `### Quota Check` showing ✅ with 🔵 ≥ 50% (verified separately after merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL returned. Hand it to the user for review.

- [ ] **Step 4: Restore the content-005 WIP**

After the PR is open, return to the original branch and restore the stash from Task 1 Step 2:
```bash
git checkout content/content-005-hardware-screenshots
git stash pop
git status --short
```

Expected: back on `content/content-005-hardware-screenshots` with the original WIP restored (settings.json, sitemap.xml, wokwi PNGs, etc.). If `git stash pop` reports a conflict (unlikely — the branches don't touch the same files), resolve by keeping the stashed WIP versions.

---

## Task 8 (Out-of-Repo): Verify Weekly-Planning Prompt

**Files:**
- No repo files — verbal verification.

- [ ] **Step 1: Ask the user to paste their local weekly-planning prompt**

> "Paste your current weekly-planning prompt. I'll verify it against the 8-item checklist in the spec (Section 5) and show exact diffs for anything missing."

- [ ] **Step 2: Run the 8-item verification**

Check each item from spec Section 5:
1. `Sources` line for BACKLOG.md says "READ THE 📌 PROCESS RULES SECTION AT THE TOP FIRST"
2. `Sources` mentions Cleanup-Week date awareness
3. `Task Selection Rules` opens with the 4 source/quota rules
4. Carry-forward rule: items count against the source quota of their origin bucket
5. `Weekly Challenge` (🏆) defaults to 🔵 User-Flagged
6. Summary table adds a `Source` column (🔵/🟡/🟤)
7. `Notes` includes a mandatory `### Quota Check` subsection
8. Header includes Cleanup-Week status when applicable

For each missing item, show the user the exact text to add (from spec Section 5).

- [ ] **Step 3: Confirm verbally** — user edits their local prompt and confirms. Mark Task 8 done.

---

## Task 9 (Out-of-Repo): First Real-World Test

**Files:**
- New WEEKLY.md for the next planning week (user runs separately, not in this branch).

- [ ] **Step 1: Run weekly planning under the new rules**

On the next weekly-planning invocation, Claude reads the restructured BACKLOG.md, the pinned 📌 Process Rules, and the updated prompt, and produces a WEEKLY.md with a `### Quota Check` subsection.

- [ ] **Step 2: Verify success criteria (spec Section: Success Criteria)**

- 🔵 User-Flagged ≥ 50% SP
- 🟡 Operational ≤ 25% SP
- 🟤 Auto-Generated ≤ 1 group AND ≤ 25% SP
- `### Quota Check` present, shows ✅ Compliance (or justified deviation)
- At least one long-deferred 🔵 feature/content item is picked

- [ ] **Step 3: Triage failures**

If a criterion fails, add a BACKLOG entry under 🟤 Auto-Generated (Claude-surfaced design-tuning item) and discuss with the user whether the prompt or a quota threshold needs adjustment.

---

## Optional Task E: Reword Pass

**Files:**
- Modify: `docs/planning/BACKLOG.md` (targeted reword / split / dup-tag only)

OPTIONAL and deferrable indefinitely. Run only if specific entries need wording cleanup or dup-tagging surfaced during the Task 3 audit.

- [ ] **Step 1: List proposed rewords** — for each flagged entry: original `- [ ] **<old title>**`, proposed `- [ ] **<new title>**`, reason (tighten / split / dup-tag).

- [ ] **Step 2: Apply one at a time, re-running Task 4 Step 5 Check 1 after each** — a split changes the open-item count; update `/tmp/expected-open.txt` to match and document the split in the commit message.

- [ ] **Step 3: Commit (Commit E)**

```bash
git add docs/planning/BACKLOG.md
git commit -m "$(cat <<'EOF'
docs(planning): backlog reword pass

Content-only edits (structure headers untouched, independently revertible).

Renames / splits / dup-tags:
- <old title> → <new title>
- ...

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

Substitute placeholders with actual changes. Skip entirely if no rewords are needed.

---

## Self-Review

**Spec coverage:**
- Spec Section 1 (BACKLOG Restructure) → Tasks 2, 4 (skeleton + pinned block + 3 sections)
- Spec Section 2 (Migration, two-pass, lossless-for-open, promotions) → Tasks 1, 2, 3, 4 (baseline, artifact, audit gate, rewrite + 4 checks)
- Spec Section 3 (CLAUDE.md Intake Rules) → Task 5
- Spec Section 4 (Structure-guard hook + wiring) → Task 6
- Spec Section 5 (Weekly Planning Prompt, user-local) → Task 8
- Spec Section 6 (Sequencing & Tooling) → Tasks 1, 6, 7 (branch order, hook, PR)
- Spec Success Criteria → Task 9
- Spec Failure Modes → Tasks 4 (no-loss checks), 6 (negative test), 3 (audit gate), 7 (stash restore)

**Placeholder scan:** No "TBD"/"implement later"/"add appropriate X" in executable steps. The classification artifact (Task 2) and reword commit (Task E) contain intentional `...` ONLY inside template examples that the engineer must fill with actual rows; Task 2 Step 4 greps for leftover `...` and fails if any remain in committed content.

**Type/string consistency:** The 4 required-header strings are identical across the BACKLOG skeleton (Task 4 Step 1), the hook's `REQUIRED_HEADERS` (Task 6 Step 1), the negative test (Task 6 Step 3), and the structure check (Task 4 Step 5 Check 3). Quota numbers (≥50 / ≤25 / ≤25, ≤1 group, ~3 weeks, ~20 SP) match the spec and the pinned block. Script/function names (`check-backlog-structure`, `readBacklog`, `REQUIRED_HEADERS`) are consistent. File names use the underscore date convention (`2026-06-07_…`).

---
