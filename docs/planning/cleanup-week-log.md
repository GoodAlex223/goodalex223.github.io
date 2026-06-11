# Cleanup Week Log

Durable ledger of Cleanup Weeks draining the 🟤 Auto-Generated Tech Debt bucket. Each
Cleanup Week inverts the normal weekly quota (≥50% 🟤 instead of ≥50% 🔵). See
[BACKLOG.md](BACKLOG.md) 📌 Process Rules for the cadence rule and [WEEKLY.md](WEEKLY.md)
for the active week.

**Trigger rule (current):** a Cleanup Week every ~3 weeks, OR when 🟤 grows beyond ~20 SP
pending.
**Calibration status:** under review — see Cleanup Week #1 observations.

---

## Cleanup Week #1 — Week of June 8–12, 2026

- **Declared:** 2026-06-09 (WEEKLY.md header) — first Cleanup Week ever.
- **Trigger:** the 🟤 bucket reached ~149 items (~63% of the 234-item open backlog) at the
  source-split restructure (PR #72, merged 2026-06-09) — far over the ~20-SP trigger.
- **Pre-drain bucket counts** (on-branch, 2026-06-10): 🔵 72 · 🟡 16 · 🟤 154 · total open
  242. *(The classification artifact, 2026-06-07, counted 🟤 149 / 237; PR #72's own merge
  added 5 🟤 — 2 PR-review items + 3 restructure follow-ups.)*
- **Group A drain (2026-06-10, this task):** pruned **31** verified-done items
  (🟤 24 · 🔵 5 · 🟡 2), including the 2 restructure follow-ups that described this drain
  task itself. Kept **2** genuinely-open items (annotated in BACKLOG): the `.gitignore`
  trailing-newline nit (confidence 0) and the asset-checker extractor extension.
- **Post-drain baseline:** 🟤 = **130** items / **62%** of 211 total open (immediately
  post-prune). Task-completion then extracted 2 🟤 follow-ups → **🟤 132 / total 213** net
  at task close. ← future weeks compare against this net baseline.
- **Observations for recalibration:**
  - Trigger units are ambiguous: the rule says "~20 SP pending," but the bucket is tracked
    by item count (130 now). Decide whether the trigger is SP-based or item-count-based
    before the next recalibration.
  - The drain confirmed the bulk of 🟤 were already-shipped PR-review follow-ups never
    checked off (a backlog-hygiene lag), not unaddressed debt — 22 of the 24 pruned 🟤 were
    code/test/tooling items shipped in PRs #66–#72 but left as open `- [ ]`.
- **Next recheck:** after 2–3 normal weeks (~2026-06-30) — re-run the WEEKLY Quota Check
  against the post-drain 🟤 count; confirm ≥50% 🔵 is now sustainably achievable; finalize
  the threshold number.
- **Threshold decision:** DEFERRED to the recheck (~20 SP kept provisional; no change to
  BACKLOG 📌 Process Rules this week).
