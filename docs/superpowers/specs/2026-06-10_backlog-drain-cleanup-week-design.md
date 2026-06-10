# Backlog Drain & Cleanup-Week Bootstrapping — Design

**Date:** 2026-06-10
**Status:** Approved (brainstorming) — awaiting user spec review before writing-plans
**Branch:** `chore/backlog-drain-cleanup-week`
**Source plan:** [docs/planning/WEEKLY.md](../../planning/WEEKLY.md) — Monday, Group A (🟤, 5 SP, 🏆)
**Upstream follow-up:** [BACKLOG.md](../../planning/BACKLOG.md) 🟤 "From Backlog Restructure (2026-06-08)" (2 items)
**Authoritative inputs:**
[classification artifact](../../archive/specs/2026-06-07_backlog-restructure-classification.md) (Audit sign-off, line 376),
[DONE.md](../../planning/DONE.md), git history.

---

## 1. Purpose

The source-split BACKLOG (PR #72, merged 2026-06-09) exposed that ~63% of the backlog
(~149 of 234 open items) is 🟤 Auto-Generated Tech Debt — far over the ~20-SP
Cleanup-Week trigger. This task is the Cleanup-Week centerpiece (runs **first** in the
week). It has two parts:

1. **Verify-and-prune (3 SP, 🏆)** — audit the items that were written `- [ ]` but look
   already-shipped, confirm against evidence, and prune the genuinely-done ones to
   directly shrink the 🟤 bucket.
2. **Calibrate & record (2 SP)** — formally record this as the first Cleanup Week, snapshot
   the start state for a 2–3-week recalibration window, and flag (not finalize) the
   trigger-threshold question.

**Success criteria:**
- 🟤 bucket measurably smaller; every prune backed by cited evidence.
- Cleanup Week #1 recorded with a durable post-drain baseline future weeks compare against.
- All guards green (`validate-backlog`, `check-backlog-structure`, lint).
- Ambiguous items preserved (kept + annotated), not guessed away.

---

## 2. Part 1 — Verify-and-prune

### 2.1 Scope (the time-box)

Strictly the **31 candidate rows** pinned in the classification artifact's Audit sign-off
(line 376): rows **1–5, 10, 11, 22, 87, 105, 115, 122, 126–127, 129, 148, 178, 181–187,
193–199**. This is a hard time-box (WEEKLY risk note: "anything ambiguous stays `- [ ]`
with a note rather than a guessed prune").

**Out-of-time-box rule:** if a clearly-done item *outside* the 31 is noticed during the
audit, it is **flagged to the user** in the task summary — never silently pruned.

### 2.2 Methodology (cluster-by-origin)

Verify by source cluster, not 31 isolated lookups — one DONE.md entry plus the actual
shipped artifact usually settles a whole cluster. For each row:

1. Locate by **item identity** (BACKLOG section + title), not line number — every prune
   shifts line numbers downstream.
2. Confirm against the **deciding evidence = current code/file state**, corroborated by the
   DONE.md entry + git history. The DONE.md entry alone is necessary but not sufficient;
   the artifact is the source of truth.
3. Decide: **prune** (confirmed done) or **keep + annotate** (ambiguous / not done).

The dispositions in §2.4 are **hypotheses to confirm during the audit**, not decisions made
now. If evidence does not confirm "done," the row is kept and annotated.

### 2.3 Disposition mechanics

- **Prune:** delete the `- [ ]` line from BACKLOG.md. If deleting the last item under a
  `### From …` sub-header, remove the now-empty sub-header (and its `**Origin**` line) too.
- **Keep + annotate:** leave the `- [ ]` line; append a short audit note, e.g.
  `*(audited 2026-06-10: still open — extractor extension not shipped)*`.
- After all edits: bump BACKLOG "Last Updated" to 2026-06-10; run `npm run validate-backlog`
  and `npm run check-backlog-structure` (4 required `##` headers must survive; `**Origin**`
  lines intact); run `npm run lint`.
- Record the prune count per source bucket (🟤 / 🔵 / 🟡) — Part 2 needs the post-drain 🟤 count.

### 2.4 Candidate map (expected disposition — confirm during audit)

| Row | BACKLOG section | Item (short) | Evidence to check | Expect |
|----|----|----|----|----|
| 1 | Project Detail Modal (🟤) | Data-structure decision | `data/projects.json` + CHALLENGE-002 | prune |
| 2 | Project Detail Modal (🟤) | A11y: focus trap/ESC/aria-modal/restore | modal code, CLAUDE.md Modal Focus, TEST-007 | prune |
| 3 | Project Detail Modal (🟡) | Lazy-load media <200KB | lazy screenshots; dup row 46 survives | prune (note dup) |
| 4 | Project Detail Modal (🔵) | Mobile-friendly modal UX | `modal.css` responsive breakpoints | **verify (judgment)** |
| 5 | Project Detail Modal (🔵) | "View details" clickable hint | View-Details buttons (CONTENT-001) | prune |
| 10 | LP-001 Filtering (🔵) | URL hash filtering | `#filter=` in js/main.js | prune |
| 11 | Enhancements: Visual (🔵) | OG image | `og-image.png` + OG meta (TEST-006) | prune (verify file) |
| 22 | PERF-002 Font Preload (🟤) | Inline critical CSS | PERF-006 / Critters | prune |
| 87 | Technical Debt (🔵) | Automated link checking | check-links (DONE 04-05) | prune |
| 105 | QUALITY-004 Husky (🟤) | commitlint | QUALITY-010 | prune |
| 115 | PERF-008 Size Reporting (🟡) | Size trend history | PERF-009 / size-history.json | prune |
| 122 | CHALLENGE-001 Lighthouse (🟤) | .gitignore trailing newline (conf 0) | inspect `.gitignore` | **verify** |
| 126 | QUALITY-007 ESLint (🟤) | eslint-plugin-playwright | QUALITY-009 | prune |
| 127 | QUALITY-007 ESLint (🟤) | no-console for browser | QUALITY-009 / eslint config | prune |
| 129 | QUALITY-007 Code Review (🟤) | Fix `9b.` numbering in CLAUDE.md | "Build System Pattern" section removed (DONE 04-03) | prune-as-moot (verify) |
| 148 | CHALLENGE-003 Form (🟤) | Scroll-anim axe flake | PR #71 deterministic polling | prune |
| 178 | Firefox & Test Audit CR (🟤) | Automate Origin path validation | validator (DONE 04-16) | prune |
| 181 | Code Quality batch (🟤) | Validator → docs/superpowers/ denylist | PR #69 | prune |
| 182 | Code Quality batch (🟤) | Read BACKLOG from git index | PR #69 | prune |
| 183 | Code Quality batch (🟤) | `npm run validate-backlog` script | PR #69 / package.json | prune |
| 184 | Code Quality batch (🟤) | Validator success output | PR #69 ("OK") | prune |
| 185 | Code Quality batch CR (🟤) | Document `&&` vs `if/fi` gotcha | PR #70 Shell Gotchas | prune |
| 186 | PR #64 Code Review (🟤) | Tighten pre-commit grep | PR #69 anchored regex | prune |
| 187 | PR #64 Code Review (🟤) | Handle staged deletion in validator | PR #69 two-level fallback | prune |
| 193 | Asset Link Checking CR (🟤) | dist/ preflight message (conf 90) | PR #68 checkDistPreflight | prune |
| 194 | Asset Link Checking CR (🟤) | Generic "not found" CI error (conf 85) | PR #68 | prune |
| 195 | Asset Link Checking CR (🟤) | HTML-regex scope JSDoc (conf 70) | PR #68 | prune |
| 196 | Asset Link Checking CR (🟤) | Harden JSON walk (conf 80) | PR #68 guard | prune |
| 197 | Asset Link Checking CR (🟤) | Extend extractor to `<source>`/srcset | not shipped ("not needed today") | **keep + annotate** |
| 198 | PR #65 Review (🟤) | Case check on dir segments (conf 65) | PR #68 realpathSync.native | prune |
| 199 | PR #65 Review (🟤) | Align output format | PR #68 brackets format | prune |

Expected outcome (to be confirmed): ~27 prune outright, 1 keep (197), 3 judgment calls
(rows 3, 4, 122) leaning prune (= 31). The audit confirms each against the artifact;
it does not assume these.

---

## 3. Part 2 — Calibrate & record

### 3.1 Deliverable: `docs/planning/cleanup-week-log.md` (new)

A durable ledger (chosen over a BACKLOG section or WEEKLY-only note because the 2–3-week
recalibration window spans multiple WEEKLY.md rotations). Indexed in
[docs/README.md](../../README.md). Structure:

```
# Cleanup Week Log

Durable ledger of Cleanup Weeks draining the 🟤 Auto-Generated Tech Debt bucket.
See BACKLOG.md 📌 Process Rules (cadence rule) and WEEKLY.md (active week).

**Trigger rule (current):** every ~3 weeks, OR when 🟤 grows beyond ~20 SP pending.
**Calibration status:** under review — see Cleanup Week #1 observations.

## Cleanup Week #1 — Week of June 8–12, 2026
- Declared: 2026-06-09 (WEEKLY.md header) — first Cleanup Week ever.
- Trigger: 🟤 reached ~149 items (~63% of 234) at restructure (PR #72).
- Pre-drain 🟤: 149 items (classification artifact, 2026-06-07).
- Group A drain (2026-06-10): pruned N items (🟤 N1 / 🔵 N2 / 🟡 N3).
- Post-drain baseline: 🟤 = P items / Q% of backlog.  ← future weeks compare here
- Observations for recalibration:
  - Trigger units ambiguous: rule says "~20 SP" but bucket tracked by item count (149).
    Decide SP-based vs item-count-based.
  - [others as found during the drain]
- Next recheck: after 2–3 normal weeks (~2026-06-30) — re-run Quota Check vs post-drain 🟤;
  confirm ≥50% 🔵 sustainable; finalize threshold number.
- Threshold decision: DEFERRED to recheck (~20 SP kept provisional).
```

`N / N1 / N2 / N3 / P / Q` are filled from Part 1's actual results.

### 3.2 Explicitly deferred

- No new threshold number is chosen now. The rule in BACKLOG 📌 Process Rules is left as-is
  (~20 SP), with calibration status flagged in the log.

---

## 4. Closeout artifacts

- **DONE.md:** one `Backlog Drain & Cleanup-Week Bootstrapping` entry (date 2026-06-10) with
  a Summary, Key Changes, and a "Resolved/Pruned BACKLOG items" list naming every pruned
  row (traceability — the lines are also recoverable via git).
- **WEEKLY.md:** Group A status ⏳ Planned → ✅ done (Summary Table + Monday schedule).
- **docs/README.md:** index the new `cleanup-week-log.md`.

---

## 5. Non-goals

- No code or doc **fixes** — pruning marks already-done items; fixing genuinely-open items
  (e.g., row 197's extractor extension) is out of scope (doc fixes belong to Groups B–E).
- No pruning outside the 31 sign-off candidates (flag-only).
- No threshold number finalized this week.
- `.claude/settings.json` (pre-existing working-tree modification) is left untouched.

---

## 6. Risks & mitigations

| Risk | Mitigation |
|----|----|
| Prune scope creep (cross-checking balloons) | Hard time-box to the 31; ambiguous → keep + annotate |
| Line-number drift while editing | Edit by item identity (section + title), not line number |
| Guard breakage from over-deletion | Re-run `validate-backlog` + `check-backlog-structure` after edits; 4 headers must survive |
| Over-eager prune of a judgment-call row (3/4/122) | Require artifact-level confirmation; if not confirmed, keep + annotate |
| Losing the ongoing-watch sense of a pruned 🟡 (row 3) | Note the surviving dup (row 46) in the prune record |

---

## 7. Verification

1. `npm run validate-backlog` → "BACKLOG Origin paths: OK".
2. `npm run check-backlog-structure` → passes (4 required headers).
3. `npm run lint` → clean.
4. `cleanup-week-log.md` exists, indexed in docs/README.md, numbers filled.
5. DONE.md + WEEKLY.md updated; pruned-item list matches actual BACKLOG diff.
6. `git diff` touches only planning/docs files (no `js/`, `css/`, `index.html`, `data/`).
