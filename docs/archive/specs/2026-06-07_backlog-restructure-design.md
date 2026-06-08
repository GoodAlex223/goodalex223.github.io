# Backlog Restructure — Source-Split, Weekly Quota, Lossless-for-Open Migration

**Date**: 2026-06-07
**Author**: brainstorming session with user (alexminak32@gmail.com)
**Status**: Design — awaiting user review before plan generation
**Related**: `docs/planning/BACKLOG.md`, `docs/planning/WEEKLY.md`, `docs/planning/ROADMAP.md`, `docs/planning/TODO.md`, `docs/planning/DONE.md`, `CLAUDE.md`, `scripts/validate-backlog-paths.js`, `.husky/pre-commit`, `.github/workflows/deploy.yml`
**Precedent**: `rating_bot` planning restructure (`docs/superpowers/specs/2026-05-30-planning-restructure-design.md` in the `rating_bot` repo) — this is an adaptation, not a port.

---

## Problem

`docs/planning/BACKLOG.md` (997 lines) has grown into a hard-to-scan mix of two organizing schemes:

1. **Topical sections** — `## Features`, `## Enhancements` (→ Visual / Performance / SEO / Accessibility), `## Internationalization`, `## Media & Visual Content`, `## Technical Debt`, `## Notes`.
2. **Origin-based sections** — ~70 `## From <task/PR>: … (date)` blocks, most carrying a `**Origin**: docs/archive/plans/…` line.

Two structural problems follow:

- **No source signal.** Like `rating_bot` before its restructure, the weekly-planning prompt has no concept of *source* — only priority (IMPORTANT vs nice-to-have) and domain. Auto-generated PR post-merge review findings (the `(code review finding, confidence NN/100)` items) accumulate every PR and easily fill the weekly plan, systematically crowding out user-flagged feature/content work. The portfolio uses the same SP-based weekly-planning system as `rating_bot` (story points, `[batch]`, `🏆` weekly challenge, IMPORTANT markers, domains — see `docs/planning/WEEKLY.md`), so the same root cause and the same fix apply.
- **Completed cruft.** Roughly half the file is completed items written as `~~strikethrough~~` / `[x]` with `*(completed DATE, TASK-ID)*` tags. They inflate the file and bury open work.

The portfolio additionally has infrastructure `rating_bot` lacked: a `**Origin**`-path validator (`scripts/validate-backlog-paths.js`, run via `.husky/pre-commit`, `npm run validate-backlog`, and the CI `lint` job) that enforces `**Origin**` lines point at `docs/archive/plans/`. Any restructure must keep those `**Origin**` lines intact.

---

## Goal

Restructure planning so:

1. User-flagged feature/content work gets a guaranteed minimum share of every week (≥50% SP).
2. Auto-generated tech debt accumulates predictably and drains in scheduled cleanup weeks (every ~3 weeks).
3. The priority/source signal is unambiguous to Claude on every read of BACKLOG.md and every weekly-planning invocation.
4. The file shrinks to open work only (completed items pruned), while remaining lossless for open items.

## Hard Constraints

- **No OPEN item is lost** during migration (open-item title set preserved; no silent merges).
- **Completed (`~~struck~~` / `[x]`) items are pruned**, not preserved. Recoverability is via git history + the inline `*(completed …)*` tags + the classification artifact's prune list. No DONE.md cross-check is claimed (many completed items are sub-items whose record is their completion tag, not a DONE.md line).
- **`**Origin**` lines survive** for every migrated section that retains open items — `validate-backlog-paths.js` must stay green.
- **Rewording is allowed** (tightening, splitting compound entries) — substance of open items must survive.
- All planning output remains in English (per global CLAUDE.md).

## Out of Scope

- Changing milestone targets in ROADMAP.md.
- Restructuring TODO.md or DONE.md.
- Re-prioritizing individual entries — classification only; priority stays as currently marked.
- Automated Quota Check audit script (human-judgment lever; see Section 5).
- Reworking `validate-backlog-paths.js` (it stays as-is; we preserve `**Origin**` lines rather than change the validator).
- Editing the weekly-planning prompt in-repo (it is user-local; see Section 5).

---

## Design

Six sections, each independently revertible.

### Section 1 — BACKLOG.md Restructure

Top-level file shape — exactly four `##` headers after the title block:

```
# Backlog

[Header — purpose, related files, Last Updated]

## 📌 Process Rules (READ BEFORE PROPOSING WORK)
[pinned rules — source defs, quotas, cleanup cadence, intake routing, **Origin** convention]

## 🔵 User-Flagged Ideas
### From <task/feature/intake> (YYYY-MM-DD)
**Origin**: docs/archive/plans/...      ← preserved where present
- [ ] open item …

## 🟡 Operational & Observation Items
### From <task> (YYYY-MM-DD)
- [ ] open item …

## 🟤 Auto-Generated Tech Debt
### From <PR/code-review/task> (YYYY-MM-DD)
**Origin**: docs/archive/plans/...
- [ ] open item …
```

**Source definitions** (adapted to a static portfolio; encoded in the pinned block):

- **🔵 User-Flagged Ideas** — anything the user raised: feature ideas (blog, project detail pages, i18n, media galleries), content tasks (capture screenshots, showcase repos, README fixes/translations), UX changes, user-reported bugs. Default home for any user-raised item.
- **🟡 Operational & Observation Items** — time-sensitive ops/watches: post-deploy & CI checks, Lighthouse / size-budget monitoring, Bing-index verification, Formspree spam-dashboard watch, dependency / GitHub-Actions deadline items. NOT feature work.
- **🟤 Auto-Generated Tech Debt** — Claude/automation-surfaced: `(code review finding, confidence NN)` items, PR post-merge review follow-ups, doc-hygiene (CLAUDE.md staleness, archive cleanup), test robustness/backfill, plan-archival debt.

**Pinned 📌 Process Rules content** (load-bearing — drives Claude's behavior on every read):

```markdown
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
```

**Intake sub-grouping** — within each source section, entries stay grouped by
`### From <event> (YYYY-MM-DD)` with the `**Origin**` line preserved where present.
Sub-headers are ordered newest-first within each bucket.

**Entry format** unchanged: `- [ ] **Short title** — body with context, cross-refs, affected files`.

### Section 2 — Migration Plan (Two-Pass, Lossless-for-Open)

#### Baseline capture (before any edit)

- Extract the sorted set of every OPEN item, anchored on `- [ ]` checkbox lines.
- Record: open-item count, completed/struck count (to be pruned).
- **Plain-`-` prose bullets:** some topical sections (`## Features`, `## Media & Visual Content`, `## Internationalization`) contain open work written as plain `-` bullets or nested sub-bullets rather than `- [ ]` checkboxes. Any such open work is converted to a `- [ ]` item during migration and logged on a **promotion list** so it is neither silently invented nor lost. (Completed `~~struck~~` plain bullets are pruned like any other completed item.)

#### Pass 1 — Classification artifact (review gate)

Produce `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` containing:

1. **Classification table** — one row per OPEN item:

   | # | Current location (section / line) | Open item title | Proposed source | Proposed `### From …` sub-header | Keep `**Origin**`? | Notes |
   |---|---|---|---|---|---|---|

2. **Prune list** — every completed / `~~struck~~` / `[x]` item with its `*(completed …)*` tag, grouped by section. The auditable record of what is dropped.

3. **Promotion list** — any plain-`-` prose bullet promoted to a real `- [ ]` open item.

4. **Verification counts** — open-item count, prune count, promotion count, per-source item counts.

5. **Audit sign-off** — user-approval checkbox + "open-item set preserved" confirmation.

The existing structure is used as a *classification heuristic*: `### From … Code Review` sub-sections are almost always 🟤; `## From <task>` implementation follow-ups skew 🔵 (content/feature) or 🟡 (ops); `(code review finding, confidence NN)` markers are 🟤; monitoring/post-deploy items are 🟡.

User reviews the table. Misclassifications, splits, dups, and prune objections are flagged via written feedback. Assistant revises until approved. **No edits to BACKLOG.md during Pass 1.**

#### Pass 2 — Apply the rewrite

After table approval, produce a single rewrite commit. Build the new file from the approved table, then run the no-loss checks below before swapping the file in.

#### No-loss verification (mechanical)

Four checks before committing the rewrite:

1. **Open-item parity** — sorted set of `- [ ]` titles in the new file == (baseline open-set ∪ promotion-list). Must be exactly equal (zero open-work loss).
2. **Origin preservation** — every `**Origin**:` line belonging to a section that retains open items appears in the new file (keeps `validate-backlog-paths.js` green).
3. **Structure** — exactly four `##` headers (📌 + 🔵 + 🟡 + 🟤), each matching the required strings.
4. **Prune accounting** — `dropped_completed_count` computed and embedded in the commit message.

If any check fails → do NOT swap the file; diff, recover from the table, re-run.

#### Reword pass (separate, optional commit)

After the structural migration commits cleanly, an optional commit can do targeted rewording — tightening, splitting compound entries, adding `[possible-dup-of: …]` tags. Each reword is listed in the commit message (`old-title → new-title`) and cannot drop an open item (parity still holds). Kept separate so structure and content edits are independently revertible.

#### Failure recovery

Entire migration is one branch (`chore/backlog-restructure`). If the user rejects the rewrite at any point, the branch is dropped and the existing BACKLOG.md is untouched. No half-state risk.

### Section 3 — CLAUDE.md Intake Rules

Add a `## Backlog Intake Rules` section (~25 lines) to the **project** `CLAUDE.md` (not global `~/.claude/CLAUDE.md`, which already carries generic source-routing guidance). Placement: its own top-level section near the other working-convention sections (after "Code Conventions", before "Key Patterns & Gotchas"). The authoritative rules live in BACKLOG.md's 📌 Process Rules; this is a cross-reference + behavioral reminder.

Concrete text to add:

```markdown
## Backlog Intake Rules

BACKLOG.md is split into three source sections. Authoritative rules live in
`docs/planning/BACKLOG.md` 📌 Process Rules section — read it first. Summary:

### Where new entries go
- User mentioned it (conversation, idea sharing, content request) → 🔵 User-Flagged
- Claude/automation surfaced it (code-review finding, PR post-merge review,
  CLAUDE.md staleness, doc hygiene, test backfill) → 🟤 Auto-Generated Tech Debt
- Time-sensitive ops/watch (post-deploy, CI check, Lighthouse/size monitoring,
  Bing-index verification, Formspree spam watch) → 🟡 Operational & Observation
- Unsure → ask before adding; default-to-🔵 if user-raised, default-to-🟤 if
  Claude-surfaced

### Intake format
- Group by `### From <event> (YYYY-MM-DD)`
- Keep the `**Origin**: docs/archive/plans/<file>` line when migrating from a
  completed plan (validate-backlog-paths.js enforces archive paths)
- One entry per concrete actionable item; never silently merge similar entries
  on intake — tag `[possible-dup-of: <other-entry-title>]` instead
- Required entry shape: `- [ ] **Short title** — body with context, cross-refs,
  affected files`

### Rate limit on 🟤 Auto-Generated
- PR post-merge review findings accumulate in a single `### From PR #N … review`
  section per PR — they do NOT spread into the weekly plan unless this week is a
  Cleanup Week (declared in WEEKLY.md header)
- When 🟤 grows beyond ~20 SP of pending items, surface this in the next planning
  conversation as a Cleanup Week trigger
```

**Failure mode this prevents:** the current pattern where every PR post-merge review ends with "added N follow-up items to BACKLOG.md" and those items immediately become candidates for next week's plan. Under the new rule they go to 🟤 and wait for a Cleanup Week or the ≤1 auto-group/week slot.

### Section 4 — Structure-Guard Hook & Wiring

New `scripts/check-backlog-structure.js` (Node, matching the repo's `scripts/*.js` conventions — file-level JSDoc header, same style as `validate-backlog-paths.js`):

- Asserts `docs/planning/BACKLOG.md` contains all four required headers, matched exactly (emoji included):
  - `## 📌 Process Rules (READ BEFORE PROPOSING WORK)`
  - `## 🔵 User-Flagged Ideas`
  - `## 🟡 Operational & Observation Items`
  - `## 🟤 Auto-Generated Tech Debt`
- Exits non-zero with a specific stderr line naming each missing header; exits 0 when all present. Acts only on a `BACKLOG.md` path argument (ignores other paths), mirroring `rating_bot`'s hook semantics.

**Wiring (three places, matching the existing `validate-backlog` pattern):**

1. `package.json` → `"check-backlog-structure": "node scripts/check-backlog-structure.js docs/planning/BACKLOG.md"`.
2. `.husky/pre-commit` → run conditionally when `BACKLOG.md` is staged, using the same `if … fi` guard already present (avoids the grep-`&&` abort gotcha documented in CLAUDE.md "Shell Gotchas").
3. CI `lint` job in `.github/workflows/deploy.yml` → add a step so `--no-verify` cannot bypass it (same closure rationale as the existing validate-backlog CI step).

**Testing:** the repo uses Playwright for E2E and has no `scripts/` unit-test harness today (`rating_bot` had pytest for its hook; this project does not). Per decision, the hook ships with a **manual smoke test** (run against the migrated BACKLOG.md → exit 0) and a **negative test** (break one header → hook exits non-zero, then restore), both documented as plan verification steps — consistent with the repo's current testing norms and avoiding scope creep. (A `scripts/__tests__/` harness is already a separate backlog item and is not pulled in here.)

### Section 5 — Weekly Planning Prompt (User-Local)

The weekly-planning prompt is maintained locally (not in repo). The spec captures a verification checklist; after merge the user pastes the prompt and the assistant diffs it against these items (adapted from `rating_bot`'s 8-point list):

- [ ] `Sources` line for BACKLOG.md says "READ THE 📌 PROCESS RULES SECTION AT THE TOP FIRST"
- [ ] `Sources` mentions Cleanup-Week date awareness (from WEEKLY.md history)
- [ ] `Task Selection Rules` opens with the 4 source/quota rules (≥50% 🔵, ≤25% 🟡, ≤1 🟤 group + ≤25% 🟤 SP, cleanup cadence)
- [ ] Carry-forward rule: items count against the source quota of their origin bucket
- [ ] `Weekly Challenge` (🏆) defaults to 🔵 User-Flagged (auto-correctness items only in Cleanup Weeks)
- [ ] Summary table adds a `Source` column (🔵/🟡/🟤) alongside Domain/SP
- [ ] `Notes` includes a mandatory `### Quota Check` subsection
- [ ] Header includes Cleanup-Week status when applicable

`### Quota Check` template for WEEKLY.md:

```
### Quota Check
- 🔵 User-Flagged SP: X / Y (Z%) — must be ≥50%
- 🟡 Operational SP:  X / Y (Z%) — must be ≤25%
- 🟤 Auto-Generated SP: X / Y (Z%) — must be ≤25% AND ≤1 group (batch or solo)
- Cleanup Week status: [normal | due | active]
- Last Cleanup Week: [date or "never"]
- Compliance: ✅ all quotas met / ⚠️ deviation: [justification]
```

This is out-of-repo, so it is a post-merge follow-up, not part of the PR.

### Section 6 — Sequencing & Tooling

**Branch + commits** (code change → feature branch + PR, per the user's workflow; not direct-to-main):

- Branch: `chore/backlog-restructure`

| Step | Commit | Deliverable | Reviewer gate |
|---|---|---|---|
| 0 | — | This spec on `main` (or the branch) | User reviews spec |
| 1 | A | Classification artifact `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` | **User audits before any BACKLOG edit** |
| 2 | B | `docs/planning/BACKLOG.md` rewrite — pinned 📌 + 3 source sections + `### From …` sub-headers + preserved `**Origin**` lines; no-loss numbers + prune count in commit message | User spot-checks the diff |
| 3 | C | `CLAUDE.md` `## Backlog Intake Rules` section | User spot-checks |
| 4 | D | `scripts/check-backlog-structure.js` + `.husky/pre-commit` + `package.json` + CI `lint` wiring | User spot-checks |
| 5 | E (optional) | Reword / split / dup-tag pass — deferrable indefinitely | User spot-checks each rename |
| 6 | — | PR against `main` | Standard review |
| 7 | — | Prompt verification (out of repo) — user pastes local prompt; assistant checks against the Section 5 checklist | Verbal confirmation |
| 8 | — | First weekly plan under the new rules; verify Quota Check shows ✅ | Compare to prior WEEKLY.md |

**Why this order:** classification is load-bearing — once approved, the rest is mechanical. CLAUDE.md update precedes the optional reword pass so the new intake rules apply to any adjusted entries. The structure hook ships before the reword pass so the invariants are protected from that point forward.

**Tooling (minimal by design):**

1. **Structure-guard hook** `scripts/check-backlog-structure.js` (~30 lines) — asserts the 4 required headers. Wired into `package.json`, `.husky/pre-commit`, and CI `lint`.
2. **No Quota Check audit script.** Considered and rejected (as in `rating_bot`): the Quota Check subsection makes violations self-evident; Cleanup-Week logic gets complicated; human judgment is the right lever for "this deviation is justified."

---

## Success Criteria

- ✅ BACKLOG.md has exactly the 4 required headers; structure hook passes; `validate-backlog-paths.js` still green.
- ✅ Open-item parity check passed (zero open-work loss); prune count recorded in the rewrite commit message.
- ✅ `**Origin**` lines preserved for all sections that retain open items.
- ✅ First weekly plan under the new rules has a `### Quota Check` showing ✅ Compliance (or justified deviation) with 🔵 ≥ 50% SP — verified separately after merge.
- ✅ At least one long-deferred 🔵 feature/content item is pulled into a near-term week (crowd-out problem eases).
- ✅ Pre-commit structure hook is active and would catch accidental header deletion (negative test verified).

If any criterion fails after the first cycle, triage: either the prompt needs further tightening or a quota threshold needs adjustment.

---

## Failure Modes & Mitigations

| Failure mode | Mitigation |
|---|---|
| Mis-classification of an item (e.g., a code-review item is actually user-flagged) | Pass 1 classification table is reviewer-gated; corrections happen before any file edit |
| Silent OPEN-item loss during rewrite | Open-item set-parity check (baseline ∪ promotion-list) embedded in the commit message |
| Plain-`-` prose bullet silently dropped or invented | Explicit promotion list in the Pass-1 artifact; promoted items included in the parity check |
| `**Origin**` line dropped → validator breaks | Origin-preservation check before swap; `validate-backlog-paths.js` runs at pre-commit and in CI |
| Pinned 📌 / source header accidentally deleted in a future edit | `check-backlog-structure.js` fails the commit (and CI lint) |
| Claude reverts to old habits and produces an imbalanced WEEKLY.md | Quota Check subsection makes the violation self-evident; first-cycle verification catches it |
| 🟤 grows unboundedly even with ≤1 group/week cap | Cleanup Week trigger at ~20 SP pending forces a drain cycle |
| Reword pass introduces a regression | Reword is a separate commit (E) — revertible without affecting structural commits |
| Pruned a completed item that was still needed | Recoverable via git history + inline `*(completed …)*` tag + the artifact's prune list |
| User's local weekly-planning prompt drifts out of sync | Section 5 verification checklist — user pastes prompt; assistant verifies |

---

## Open Questions (for plan generation, not blocking design approval)

- Cleanup Week threshold: ~20 SP pending, or different? Calibrate after the first 2–3 normal weeks.
- Some `## From <task>` implementation follow-ups blur 🔵 vs 🟡 (e.g. "portfolio requirements linter", "auto-update dates from git history"). Default: tooling/automation that the user explicitly wants → 🔵; pure monitoring/observation → 🟡. Resolve per-row during Pass 1.
- A few items blur 🔵 vs 🟤 (e.g. CONTENT-005 placeholder-WebP — a content bug Claude surfaced). Default: visible content/feature impact → 🔵; internal code/test/doc hygiene → 🟤. Resolve per-row during Pass 1.

---

## Deliverables

Pre-implementation:

1. `docs/superpowers/specs/2026-06-07_backlog-restructure-design.md` (this file)

Implementation (branch `chore/backlog-restructure` → PR against `main`):

2. `docs/superpowers/specs/2026-06-07_backlog-restructure-classification.md` (Pass 1 artifact, commit A)
3. `docs/planning/BACKLOG.md` rewritten — pinned 📌 + 3 source sections, completed items pruned (commit B)
4. `CLAUDE.md` with new `## Backlog Intake Rules` section (commit C)
5. `scripts/check-backlog-structure.js` + `.husky/pre-commit` + `package.json` + CI `lint` wiring (commit D)
6. (Optional, deferred) Reword commit(s) on individual entries (commit E)

Out-of-repo follow-ups (after PR merge):

7. User's local weekly-planning prompt updated against the Section 5 checklist
8. First weekly plan executed under the new rules; Quota Check verified.

---

**End of Design**
