# Documentation Accuracy Sweep (Group B) — Design Spec

**Status**: Approved (brainstorming) — pending implementation plan
**Date**: 2026-06-16
**Branch**: `docs/accuracy-sweep`
**Source**: WEEKLY.md Group B `[batch]` — 🟤 Auto-Generated — 7 SP — Cleanup Week #1 (Thursday)
**Domain**: Docs
**Tracked in**: BACKLOG.md L351–353; WEEKLY.md L96–101

---

## Problem / Context

WEEKLY.md Group B lists five documentation-accuracy items spread across `ROADMAP.md`,
`DONE.md`, and `CLAUDE.md`/`BACKLOG.md`. Several were authored before the Cleanup-Week
prune pass (Group A) and the auto-memory sync (`687940a`) that pre-empted parts of them.
A verify-first pass against ground truth (read 2026-06-16) shows the list is a mix of
genuinely-real edits, already-done work, an obsolete item, and one arguably-correct line.

This sweep is **verify-first triage**: apply only the fixes that survive verification, and
close the rest with a documented rationale. Per WEEKLY.md L165, "won't-do with rationale"
is an explicitly acceptable Cleanup-Week outcome.

The CLAUDE.md sub-items all live inside `<!-- AUTO-MANAGED -->` regions that the next
`/auto-memory:sync` would clobber, so hand-edits there are out of scope by design
(WEEKLY.md L156). No sync is run in this branch.

## Decisions (from brainstorming)

1. **Verify-first triage** — fix only genuinely-real items; close already-done / obsolete /
   correct items with rationale.
2. **CLAUDE.md portion: verify & close, no sync** — confirm 5a already synced and 5b's
   wording accurate; no `/auto-memory:sync` and no AUTO-MANAGED hand-edits in this PR.
3. **v1.5 fix depth: light footnote** — one parallel-development note; no re-dating or
   phase-ladder reordering.
4. Cross-link form: bare-name (`[WEEKLY.md](WEEKLY.md)`); no optional item-4 clarifier.

## Scope — Per-Item Disposition

| # | Item | Disposition | Action |
|---|------|-------------|--------|
| 1 | ROADMAP duplicate "Last Updated" (L3 + L84) | **EDIT** | Remove trailing footer block (L82–84) |
| 2 | ROADMAP v1.5 phase-ladder drift | **EDIT** | Add light parallel-development footnote |
| 3 | ROADMAP cross-link display-text + in-progress convention | **EDIT** | Bare-name cross-links (L47) + HTML transition comment by L45 |
| 4 | DONE "zero extra" undercount | **CLOSE (won't-do)** | Verified correct — describes migration parity; 3 EXTRACT follow-ups documented separately at DONE L80 |
| 5a | CLAUDE.md `check-backlog-structure` drift, 3 sites | **CLOSE (done)** | Synced by `687940a`; refs present at L34/40/61/113 in AUTO-MANAGED regions |
| 5b | CLAUDE.md Shell Gotchas reword | **CLOSE (won't-do)** | Wording at L237 accurate + already cites `.husky/pre-commit`; sits in AUTO-MANAGED region → sync-owned |
| 5c | BACKLOG "line 948" `checkout@v4`→`@v6` | **CLOSE (obsolete)** | File is 666 lines; target observability item pruned in Group A. Only the self-referential tracking item (BACKLOG L353) still mentions `checkout@v4` |

**Net: 3 edits to `docs/planning/ROADMAP.md`; 4 items closed with rationale.**

### Edit detail

**Item 1** — Keep the structured header field at ROADMAP L3 (`**Last Updated**: 2026-05-10`).
Remove the trailing footer block (the `---` separator + blank + `*Last updated: 2026-05-10*`,
L82–84) so the file ends cleanly after the Principles list with no dangling horizontal rule.

**Item 2** — Add one italic note under the v1.5 section, in substance:
> _Phase versions group feature themes, not strictly sequential delivery — v1.5 feature work
> overlapped late-stage v1.1 polish; "Completed" marks when the theme's headline work shipped._

**Item 3** —
- ROADMAP L47: `[docs/planning/WEEKLY.md](WEEKLY.md)` → `[WEEKLY.md](WEEKLY.md)` and
  `[docs/planning/DONE.md](DONE.md)` → `[DONE.md](DONE.md)` (display text matches href; the
  standard form for same-directory links).
- Add an HTML comment by the "🔧 In Progress" header (L45): a note that when the phase
  closes, the header changes to `✅ Completed YYYY-MM-DD` to match the v1.x convention above.
  Invisible in render; documents the transition convention in-place.

## Out of Scope

- Any edit to CLAUDE.md AUTO-MANAGED regions (sync-owned; clobbered on next sync).
- Running `/auto-memory:sync` (no real drift to regenerate; 5a already synced).
- Re-dating or reordering ROADMAP phases (item 2 stays a footnote).
- BACKLOG.md content edits beyond the task-completion bookkeeping below.

## Validation

Pure documentation — no code, therefore no TDD/tests. Validation is:
- Proofread the 3 ROADMAP edits; confirm Markdown renders (no dangling separator, footnote
  placement reads correctly, HTML comment is invisible).
- `lint:css` / `lint:js` are unaffected by Markdown.
- When tracking-doc bookkeeping touches `BACKLOG.md`, run `npm run validate-backlog` and
  `npm run check-backlog-structure` and keep both green (also enforced by the pre-commit hook).

## Workflow / Tracking-Doc Updates

Core ROADMAP edit lands first. Tracking-doc updates happen in the task-completion phase:
- **WEEKLY.md** L97–101 — check off all 5 boxes with one-word dispositions
  (edited / done / obsolete / won't-do).
- **BACKLOG.md** L351–353 — resolve the 3 tracked items: L351 fixed (cross-link edit),
  L352 fixed (in-progress comment), L353 obsolete (target pruned).
- **DONE.md** — add a Group B completion entry (plan link, summary, dispositions).

Single `docs:` PR from `docs/accuracy-sweep` (the WEEKLY "One PR" intent), then the standard
task-completion workflow: EXTRACT → ARCHIVE (this spec + plan → `docs/archive/`) →
TRANSITION (DONE.md) → COMMIT → MEMORY.

## Risks

- **Over-closing**: a "won't-do" that is actually a real defect. Mitigated by recording the
  ground-truth evidence (line refs, commit `687940a`, 666-line file length) for each close.
- **Footnote tone (item 2)**: an annotation that contradicts DONE.md/PR history. Mitigated by
  keeping it a non-committal "themes, not strictly sequential" note with no new dates.
- **BACKLOG bookkeeping** trips the structure/Origin guards. Mitigated by running both
  validators after editing BACKLOG.md.
