# Documentation Accuracy Sweep (Group B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the three genuinely-real ROADMAP.md accuracy fixes from WEEKLY Group B and close the four already-done / obsolete / verified-correct items with recorded rationale.

**Architecture:** Verify-first triage. Three hand-edits to `docs/planning/ROADMAP.md` only; CLAUDE.md AUTO-MANAGED regions are out of scope (sync-owned). Tracking-doc bookkeeping (BACKLOG/WEEKLY resolution, DONE entry) and ARCHIVE follow in the task-completion phase. Single `docs:` PR from `docs/accuracy-sweep`.

**Tech Stack:** Markdown only. No build/test framework involved. The sole executable gates are the doc-integrity validators (`npm run validate-backlog`, `npm run check-backlog-structure`), which the pre-commit hook runs automatically when `BACKLOG.md` is staged.

**Testing note (read first):** This is a pure-documentation change — no automated tests apply, and TDD's test-first cycle does not map. Each edit task is: apply the exact edit → verify with `git diff` + Markdown-render reasoning → commit. Do **not** invent tests.

**Spec:** [docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md](../specs/2026-06-16_doc-accuracy-sweep-design.md).

---

## File Structure

- **Modify** `docs/planning/ROADMAP.md` — the only content edits (Tasks 1–3).
- **Modify** `docs/planning/BACKLOG.md` — check off 9 tracked Group B items with dispositions (Task 5). Triggers the validators.
- **Modify** `docs/planning/WEEKLY.md` — check off the 5 Thursday boxes (Task 5).
- **Modify** `docs/planning/DONE.md` — add the Group B completion entry + bump its header date (Task 6).
- **Move** `docs/superpowers/specs/2026-06-16-doc-accuracy-sweep-design.md` + this plan → `docs/archive/{specs,plans}/` (Task 7).

---

### Task 1: ROADMAP — remove duplicate "Last Updated" (item 1)

**Files:**
- Modify: `docs/planning/ROADMAP.md` (header field at L3 kept; trailing footer L82–84 removed)

- [ ] **Step 1: Apply the edit**

Remove the trailing footer block so the file ends after the Principles list. Match this exact block (end of file):

```markdown
5. **Professionalism**: Clean, polished presentation

---

*Last updated: 2026-05-10*
```

Replace with:

```markdown
5. **Professionalism**: Clean, polished presentation
```

(The structured header field `**Last Updated**: 2026-05-10` at L3 is the single retained date — matching the DONE.md / WEEKLY.md convention.)

- [ ] **Step 2: Verify**

Run: `git diff docs/planning/ROADMAP.md`
Expected: only the trailing `---` + blank + `*Last updated: 2026-05-10*` lines removed; file now ends with the Professionalism bullet. No other changes.

- [ ] **Step 3: Commit**

```bash
git add docs/planning/ROADMAP.md
git commit -m "docs(roadmap): remove duplicate Last Updated footer"
```

---

### Task 2: ROADMAP — v1.5 parallel-development footnote (item 2)

**Files:**
- Modify: `docs/planning/ROADMAP.md` (insert one italic note after the v1.5 bullet list, before the Quality & Hardening header)

Context: BACKLOG L349 establishes the drift — v1.5 feature commits (theme toggle, filter, scroll animations, 404) date to **2026-01-28**, predating v1.1's Bing Webmaster Tools item (**2026-02-10**), yet v1.5 is dated "Completed 2026-03-21" and ordered after v1.1. The footnote acknowledges the parallel development without re-dating or reordering (light-footnote decision).

- [ ] **Step 1: Apply the edit**

Match this block:

```markdown
- Contact Form (Weekly Challenge — Formspree, honeypot, full validation, accessible state machine)

### Quality & Hardening (🔧 In Progress, since 2026-04)
```

Replace with:

```markdown
- Contact Form (Weekly Challenge — Formspree, honeypot, full validation, accessible state machine)

> _Phase versions group feature themes, not a strict delivery sequence: several v1.5 features (theme toggle, filtering, scroll animations, the 404 page) were committed as early as 2026-01-28 — in parallel with v1.1 — while "Completed 2026-03-21" marks when the v1.5 theme's headline work (Project Detail Modal, Contact Form) shipped._

### Quality & Hardening (🔧 In Progress, since 2026-04)
```

- [ ] **Step 2: Verify**

Run: `git diff docs/planning/ROADMAP.md`
Expected: a single blockquote line added between the Contact Form bullet and the Quality & Hardening header; no dates in existing phase entries changed; phase order unchanged.

- [ ] **Step 3: Commit**

```bash
git add docs/planning/ROADMAP.md
git commit -m "docs(roadmap): note v1.5/v1.1 parallel development"
```

---

### Task 3: ROADMAP — cross-link form + in-progress transition convention (item 3)

**Files:**
- Modify: `docs/planning/ROADMAP.md` (cross-links on the Quality & Hardening description line; HTML transition comment after the phase header)

- [ ] **Step 1: Apply edit 3a (cross-links → bare-name form)**

Match this line:

```markdown
Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization. See [docs/planning/WEEKLY.md](WEEKLY.md) for the current sprint and [docs/planning/DONE.md](DONE.md) for the historical record.
```

Replace with:

```markdown
Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization. See [WEEKLY.md](WEEKLY.md) for the current sprint and [DONE.md](DONE.md) for the historical record.
```

(Display text now matches the href — the standard form for same-directory links. Resolves BACKLOG L351.)

- [ ] **Step 2: Apply edit 3b (transition-convention comment)**

Match this block (the v1.5 footnote from Task 2 sits above the header and is unaffected):

```markdown
### Quality & Hardening (🔧 In Progress, since 2026-04)

Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization.
```

Replace with:

```markdown
### Quality & Hardening (🔧 In Progress, since 2026-04)

<!-- Transition convention: when this phase closes, change the header from "🔧 In Progress, since 2026-04" to "✅ Completed YYYY-MM-DD" to match the v1.x phase entries above. -->

Test reliability, CI/CD robustness, code quality, automated link/asset checking, validator hardening, runtime modernization.
```

(HTML comment is invisible in rendered Markdown; documents the convention in-place. Resolves BACKLOG L352.)

- [ ] **Step 3: Verify**

Run: `git diff docs/planning/ROADMAP.md`
Expected: two changes only — the `[docs/planning/...]` display prefixes dropped on the See-line, and one HTML comment inserted after the Quality & Hardening header.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/ROADMAP.md
git commit -m "docs(roadmap): consistent cross-links + phase-transition note"
```

---

### Task 4: Verify the closed items against ground truth (items 4, 5a, 5b, 5c)

No file edits — this task confirms the four "close" dispositions still hold before recording them in Task 5. Record each result.

- [ ] **Step 1: Item 5a — `check-backlog-structure` already synced**

Run: `git grep -n "check-backlog-structure" CLAUDE.md`
Expected: references present at the Build Commands block, the `scripts/` architecture line, and the Pre-commit hook bullet — all inside `<!-- AUTO-MANAGED -->` regions (synced by commit `687940a`). Confirms 5a is **done**.

- [ ] **Step 2: Item 5b — Shell Gotchas wording is sync-owned**

Run: `git grep -n "On a fresh repo" CLAUDE.md`
Expected: the wording sits in the `### Shell Gotchas` bullet, which is inside the `patterns` AUTO-MANAGED region (CLAUDE.md L153–244). Hand-edits would be clobbered by the next `/auto-memory:sync`; current wording is accurate and already cites `.husky/pre-commit`. Confirms 5b is **won't-do (sync-owned)**.

- [ ] **Step 3: Item 5c — checkout@v4 target is gone**

Run: `git grep -n "actions/checkout@v4" docs/planning/BACKLOG.md`
Expected: the ONLY match is the self-referential tracking item (the "BACKLOG.md observability item — update parenthetical at line 948…" line). No live observability item containing `actions/checkout@v4` remains — it was pruned in Group A (file is 666 lines, not 948). Confirms 5c is **obsolete**.

- [ ] **Step 4: Item 4 — "zero extra" describes migration parity**

Run: `git grep -n "zero dropped, zero extra" docs/planning/DONE.md`
Expected: the phrase appears in the Backlog Restructure entry's no-loss verification sentence (234 + 3 = 237), scoped to the migration transform. The 3 task-completion EXTRACT follow-ups are documented separately in the same entry ("3 new 🟤 follow-ups extracted"). The sentence is accurate within its stated scope. Confirms item 4 is **won't-do (verified correct in scope)** per the brainstorming decision. (Recorded rationale answers BACKLOG L318's claim.)

- [ ] **Step 5: No commit** — verification only; results feed Task 5.

---

### Task 5: Resolve tracked BACKLOG items + check WEEKLY boxes (task-completion bookkeeping)

**Files:**
- Modify: `docs/planning/BACKLOG.md` (9 items)
- Modify: `docs/planning/WEEKLY.md` (5 Thursday boxes)

For each BACKLOG item below: change its leading `- [ ]` to `- [x]` and append the disposition annotation to the **end of that item's line**. Locate each by its unique lead text (line numbers will have shifted).

- [ ] **Step 1: Check off the 9 BACKLOG items with dispositions**

| Item lead text (locate by this) | New disposition annotation to append |
|---|---|
| `CLAUDE.md drift after the` check-backlog-structure `guard shipped` | ` **[DONE 2026-06-16, Group B: all 3 sites synced by 687940a]**` |
| `DONE.md no-loss claim undercounts` | ` **[WON'T-DO 2026-06-16, Group B: "zero extra" is scoped to migration parity (234+3=237); the 3 EXTRACT follow-ups are documented separately in the same entry — accurate as written]**` |
| `CLAUDE.md "Shell Gotchas" — tighten` Triggered by `reference` | ` **[WON'T-DO 2026-06-16, Group B: AUTO-MANAGED region (sync-owned); bullet already cites .husky/pre-commit]**` |
| `CLAUDE.md "Shell Gotchas" — replace "On a fresh repo` | ` **[WON'T-DO 2026-06-16, Group B: AUTO-MANAGED region (sync-owned); current wording accurate]**` |
| `ROADMAP.md — annotate v1.5's "Completed 2026-03-21"` | ` **[DONE 2026-06-16, Group B: parallel-development footnote added]**` |
| `ROADMAP.md — remove duplicate "Last Updated" field` | ` **[DONE 2026-06-16, Group B: trailing footer removed; header field retained]**` |
| `ROADMAP.md — align Quality & Hardening cross-link` | ` **[DONE 2026-06-16, Group B: bare-name cross-links]**` |
| `ROADMAP.md — document transition convention for the in-progress phase` | ` **[DONE 2026-06-16, Group B: HTML transition comment added]**` |
| `BACKLOG.md observability item — update parenthetical at line 948` | ` **[OBSOLETE 2026-06-16, Group B: target observability item pruned in Group A; no live actions/checkout@v4 remains]**` |

- [ ] **Step 2: Check off the 5 WEEKLY Thursday boxes**

In `docs/planning/WEEKLY.md` under "### Thursday — Documentation Accuracy (7 SP)", change each `- [ ]` to `- [x]` and append a short disposition:
- `ROADMAP.md — remove duplicate "Last Updated"` → ` — done`
- `ROADMAP.md — v1.5 parallel-development / phase-ladder drift annotation` → ` — done (footnote)`
- `ROADMAP.md — cross-link display-text + in-progress-phase transition convention` → ` — done`
- `DONE.md — fix "zero extra" undercount` → ` — won't-do (verified correct in scope)`
- `CLAUDE.md AUTO-MANAGED sync … (check-backlog-structure drift + checkout@v6 + Shell Gotchas wording)` → ` — done/closed (5a synced via 687940a; 5b sync-owned; checkout target obsolete)`

- [ ] **Step 3: Run the doc-integrity validators**

Run: `npm run validate-backlog && npm run check-backlog-structure`
Expected: `BACKLOG Origin paths: OK` and the structure check passes (4 required headers present). Both must be green.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md docs/planning/WEEKLY.md
git commit -m "docs(backlog): resolve Group B items + check WEEKLY boxes"
```

(The pre-commit hook re-runs both validators because `BACKLOG.md` is staged — expect them green again.)

---

### Task 6: DONE.md completion entry (TRANSITION)

**Files:**
- Modify: `docs/planning/DONE.md` (new dated section at top, after the L7 `---`; bump header date at L3)

- [ ] **Step 1: Update the DONE header date**

Match: `**Last Updated**: 2026-06-14 (Script Robustness & Observability — Cleanup Week #1 Group C)`
Replace: `**Last Updated**: 2026-06-16 (Documentation Accuracy Sweep — Cleanup Week #1 Group B)`

- [ ] **Step 2: Insert the completion entry**

Immediately after the top `---` (before `## 2026-06-14`), insert:

```markdown
## 2026-06-16

### Documentation Accuracy Sweep `[batch]` (Cleanup Week #1 — Group B)

**Plan**: [docs/archive/plans/2026-06-16_doc-accuracy-sweep.md](../archive/plans/2026-06-16_doc-accuracy-sweep.md)
**Spec**: [docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md](../archive/specs/2026-06-16_doc-accuracy-sweep-design.md)
**PR**: pending (branch `docs/accuracy-sweep`)
**Summary**: Thursday Group B of Cleanup Week #1 — a verify-first documentation-accuracy pass over the five planned items. Ground-truth verification (2026-06-16) showed the list was a mix: 3 genuinely-real `ROADMAP.md` edits, plus 4 items closed without edit (1 already-done, 2 sync-owned/accurate, 1 obsolete). Only `ROADMAP.md` received content edits; CLAUDE.md AUTO-MANAGED regions were left to `/auto-memory:sync` by design.
**Key Changes**:
- `docs/planning/ROADMAP.md`: removed the duplicate trailing `*Last updated*` footer (header field retained); added a v1.5/v1.1 parallel-development footnote (v1.5 feature commits date to 2026-01-28, predating v1.1's 2026-02-10 Bing item, despite the later "Completed 2026-03-21" label); switched the Quality & Hardening cross-links to bare-name form and added an HTML comment documenting the in-progress→completed header transition convention.
**Resolved BACKLOG items**: 9 closed across the 🟤 bucket — 5 DONE (check-backlog-structure sync via 687940a; v1.5 footnote; duplicate footer; cross-links; transition comment), 3 WON'T-DO (DONE "zero extra" verified correct in scope; 2× Shell Gotchas reword sync-owned + accurate), 1 OBSOLETE (checkout@v4→v6 target pruned in Group A).
**Task-completion EXTRACT**: [fill at completion — e.g. process note on routing CLAUDE.md AUTO-MANAGED drift through /auto-memory:sync, or "no new follow-ups"].
```

- [ ] **Step 3: Commit**

```bash
git add docs/planning/DONE.md
git commit -m "docs(done): record Group B documentation accuracy sweep"
```

---

### Task 7: ARCHIVE spec + plan (task-completion)

**Files:**
- Move: `docs/superpowers/specs/2026-06-16-doc-accuracy-sweep-design.md` → `docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md`
- Move: `docs/superpowers/plans/2026-06-16-doc-accuracy-sweep.md` → `docs/archive/plans/2026-06-16_doc-accuracy-sweep.md`

- [ ] **Step 1: Move both files (git mv, hyphen-date → underscore-date)**

```bash
git mv docs/superpowers/specs/2026-06-16-doc-accuracy-sweep-design.md docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md
git mv docs/superpowers/plans/2026-06-16-doc-accuracy-sweep.md docs/archive/plans/2026-06-16_doc-accuracy-sweep.md
```

- [ ] **Step 2: Fix internal cross-links to archived form (Group E lesson — no fresh `docs/superpowers/` dead links)**

In the moved plan (`docs/archive/plans/2026-06-16_doc-accuracy-sweep.md`), update the **Spec:** link to:
`[docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md](../specs/2026-06-16_doc-accuracy-sweep-design.md)`

Run: `git grep -n "docs/superpowers/" docs/archive/specs/2026-06-16_doc-accuracy-sweep-design.md docs/archive/plans/2026-06-16_doc-accuracy-sweep.md`
Expected: no matches (all internal references now point at the archived paths).

- [ ] **Step 3: Commit**

```bash
git add -A docs/superpowers docs/archive
git commit -m "docs(archive): archive Group B spec + plan"
```

---

### Task 8: Final verification + PR

- [ ] **Step 1: Confirm the full change set**

Run: `git log --oneline main..docs/accuracy-sweep` and `git diff --stat main..docs/accuracy-sweep`
Expected: commits for the spec, the 3 ROADMAP edits, the BACKLOG/WEEKLY bookkeeping, the DONE entry, and the archive move. Files touched: `docs/planning/{ROADMAP,BACKLOG,WEEKLY,DONE}.md` and the archived spec/plan only.

- [ ] **Step 2: Re-run the validators once more**

Run: `npm run validate-backlog && npm run check-backlog-structure`
Expected: both green.

- [ ] **Step 3: Push and open the PR**

```bash
git push -u origin docs/accuracy-sweep
gh pr create --title "docs: Group B documentation accuracy sweep (Cleanup Week #1)" --body "<summary of the 3 edits + 4 closed items, linking the archived spec/plan>"
```

Use archived-form links in the PR body (`docs/archive/...`), per the Group E lesson.

---

## Self-Review

- **Spec coverage:** All 7 spec sub-items mapped — items 1/2/3 → Tasks 1–3; items 4/5a/5b/5c → Task 4 (verify) + Task 5 (record). Tracking-doc updates and ARCHIVE → Tasks 5–7. PR → Task 8. No gaps.
- **Placeholder scan:** The only bracketed token is the EXTRACT line in Task 6 Step 2, which is intentionally decided at completion; all edit content is concrete. The `YYYY-MM-DD` in the ROADMAP HTML comment is literal intended content.
- **Consistency:** Branch `docs/accuracy-sweep`, date 2026-06-16, and the spec/archive paths are used identically across tasks. Dispositions in Task 5 match Task 4's verification and the DONE entry's "Resolved BACKLOG items" counts (5 DONE / 3 WON'T-DO / 1 OBSOLETE = 9).
