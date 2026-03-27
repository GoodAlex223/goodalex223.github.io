# Documentation Debt & Archive Cleanup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate `docs/superpowers/` into the standard `docs/archive/` structure — delete duplicates, archive unique files, fix misplaced specs, update stale references, and document the specs directory.

**Architecture:** Pure file operations — git mv/rm for moves and deletes, text edits for reference updates and README. No code, no tests, no build impact.

**Tech Stack:** git, bash

**Spec:** `docs/superpowers/specs/2026-03-27_archive-cleanup-design.md`

---

## File Structure

No new source files. Operations on existing documentation:

**Delete** (4 duplicates):
- `docs/superpowers/plans/2026-03-21_challenge-003-contact-form.md`
- `docs/superpowers/plans/2026-03-21_quality-010-commitlint.md`
- `docs/superpowers/specs/2026-03-21_challenge-003-contact-form-design.md`
- `docs/superpowers/specs/2026-03-21_quality-010-commitlint-design.md`

**Move + rename** (4 unique files from superpowers → archive):
- `docs/superpowers/plans/2026-03-18-workflow-plugin.md` → `docs/archive/plans/2026-03-18_workflow-plugin.md`
- `docs/superpowers/specs/2026-03-18-workflow-plugin-design.md` → `docs/archive/specs/2026-03-18_workflow-plugin-design.md`
- `docs/superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md` → `docs/archive/specs/2026-03-20_quality-009-eslint-enhancements-design.md`
- `docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md` → `docs/archive/specs/2026-03-23_content-003-cleaning-site-design.md`

**Move** (3 misplaced specs within archive):
- `docs/archive/plans/2026-03-21_challenge-003-contact-form-design.md` → `docs/archive/specs/`
- `docs/archive/plans/2026-03-21_quality-010-commitlint-design.md` → `docs/archive/specs/`
- `docs/archive/plans/2026-03-22-content-002-portfolio-requirements-design.md` → `docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md`

**Edit** (8 files):
- 7 plan files in `docs/archive/plans/` (spec path references)
- `docs/archive/README.md` (add specs directory entry)

**Create** (2 placeholder files):
- `docs/superpowers/plans/.gitkeep`
- `docs/superpowers/specs/.gitkeep`

---

### Task 1: Delete duplicate files from superpowers

**Files:**
- Delete: `docs/superpowers/plans/2026-03-21_challenge-003-contact-form.md`
- Delete: `docs/superpowers/plans/2026-03-21_quality-010-commitlint.md`
- Delete: `docs/superpowers/specs/2026-03-21_challenge-003-contact-form-design.md`
- Delete: `docs/superpowers/specs/2026-03-21_quality-010-commitlint-design.md`

- [ ] **Step 1: Remove duplicate plan files**

```bash
git rm docs/superpowers/plans/2026-03-21_challenge-003-contact-form.md
git rm docs/superpowers/plans/2026-03-21_quality-010-commitlint.md
```

- [ ] **Step 2: Remove duplicate spec files**

```bash
git rm docs/superpowers/specs/2026-03-21_challenge-003-contact-form-design.md
git rm docs/superpowers/specs/2026-03-21_quality-010-commitlint-design.md
```

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: Remove duplicate superpowers files already in archive"
```

---

### Task 2: Archive unique files from superpowers

**Files:**
- Move: `docs/superpowers/plans/2026-03-18-workflow-plugin.md` → `docs/archive/plans/2026-03-18_workflow-plugin.md`
- Move: `docs/superpowers/specs/2026-03-18-workflow-plugin-design.md` → `docs/archive/specs/2026-03-18_workflow-plugin-design.md`
- Move: `docs/superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md` → `docs/archive/specs/2026-03-20_quality-009-eslint-enhancements-design.md`
- Move: `docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md` → `docs/archive/specs/2026-03-23_content-003-cleaning-site-design.md`

- [ ] **Step 1: Move workflow-plugin plan (with underscore rename)**

```bash
git mv docs/superpowers/plans/2026-03-18-workflow-plugin.md docs/archive/plans/2026-03-18_workflow-plugin.md
```

- [ ] **Step 2: Move workflow-plugin design spec (with underscore rename)**

```bash
git mv docs/superpowers/specs/2026-03-18-workflow-plugin-design.md docs/archive/specs/2026-03-18_workflow-plugin-design.md
```

- [ ] **Step 3: Move quality-009 design spec (with underscore rename)**

```bash
git mv docs/superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md docs/archive/specs/2026-03-20_quality-009-eslint-enhancements-design.md
```

- [ ] **Step 4: Move content-003 design spec (already correct naming)**

```bash
git mv docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md docs/archive/specs/2026-03-23_content-003-cleaning-site-design.md
```

- [ ] **Step 5: Add .gitkeep files to preserve empty superpowers directories**

```bash
touch docs/superpowers/plans/.gitkeep
touch docs/superpowers/specs/.gitkeep
git add docs/superpowers/plans/.gitkeep docs/superpowers/specs/.gitkeep
```

- [ ] **Step 6: Commit**

```bash
git commit -m "docs: Archive unique superpowers files to standard structure"
```

---

### Task 3: Move misplaced design specs within archive

**Files:**
- Move: `docs/archive/plans/2026-03-21_challenge-003-contact-form-design.md` → `docs/archive/specs/`
- Move: `docs/archive/plans/2026-03-21_quality-010-commitlint-design.md` → `docs/archive/specs/`
- Move: `docs/archive/plans/2026-03-22-content-002-portfolio-requirements-design.md` → `docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md`

- [ ] **Step 1: Move challenge-003 design spec to specs directory**

```bash
git mv docs/archive/plans/2026-03-21_challenge-003-contact-form-design.md docs/archive/specs/2026-03-21_challenge-003-contact-form-design.md
```

- [ ] **Step 2: Move quality-010 design spec to specs directory**

```bash
git mv docs/archive/plans/2026-03-21_quality-010-commitlint-design.md docs/archive/specs/2026-03-21_quality-010-commitlint-design.md
```

- [ ] **Step 3: Move + rename content-002 design spec (hyphen→underscore fix)**

```bash
git mv docs/archive/plans/2026-03-22-content-002-portfolio-requirements-design.md docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md
```

- [ ] **Step 4: Commit**

```bash
git commit -m "docs: Move misplaced design specs from archive/plans to archive/specs"
```

---

### Task 4: Update stale spec references in archived plans

**Files:**
- Modify: `docs/archive/plans/2026-03-20_quality-009-eslint-enhancements.md:11`
- Modify: `docs/archive/plans/2026-03-21_challenge-003-contact-form.md:11`
- Modify: `docs/archive/plans/2026-03-21_quality-010-commitlint.md:11`
- Modify: `docs/archive/plans/2026-03-22-bug-004-filter-race-condition.md:11`
- Modify: `docs/archive/plans/2026-03-22_content-002-portfolio-requirements.md:11,200,218`
- Modify: `docs/archive/plans/2026-03-23_content-003-cleaning-site.md:11`
- Modify: `docs/archive/plans/2026-03-24_content-004-update-project-info.md:11`

- [ ] **Step 1: Update quality-009 plan spec reference**

In `docs/archive/plans/2026-03-20_quality-009-eslint-enhancements.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-20_quality-009-eslint-enhancements-design.md`
```

- [ ] **Step 2: Update challenge-003 plan spec reference**

In `docs/archive/plans/2026-03-21_challenge-003-contact-form.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-21_challenge-003-contact-form-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-21_challenge-003-contact-form-design.md`
```

- [ ] **Step 3: Update quality-010 plan spec reference**

In `docs/archive/plans/2026-03-21_quality-010-commitlint.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-21_quality-010-commitlint-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-21_quality-010-commitlint-design.md`
```

- [ ] **Step 4: Update bug-004 plan spec reference**

In `docs/archive/plans/2026-03-22-bug-004-filter-race-condition.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-22-bug-004-filter-race-condition-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-22_bug-004-filter-race-condition-design.md`
```

- [ ] **Step 5: Update content-002 plan spec references (3 locations)**

In `docs/archive/plans/2026-03-22_content-002-portfolio-requirements.md`:

Line 11 — change:
```
**Spec:** `docs/superpowers/specs/2026-03-22-content-002-portfolio-requirements-design.md`
```
to:
```
**Spec:** `docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md`
```

Line 200 — change:
```
- Move: `docs/superpowers/specs/2026-03-22-content-002-portfolio-requirements-design.md` → archive
```
to:
```
- Move: `docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md` → archive
```

Line 218 — change:
```
mv docs/superpowers/specs/2026-03-22-content-002-portfolio-requirements-design.md docs/archive/plans/
```
to:
```
mv docs/archive/specs/2026-03-22_content-002-portfolio-requirements-design.md docs/archive/specs/
```

- [ ] **Step 6: Update content-003 plan spec reference**

In `docs/archive/plans/2026-03-23_content-003-cleaning-site.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-23_content-003-cleaning-site-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-23_content-003-cleaning-site-design.md`
```

- [ ] **Step 7: Update content-004 plan spec reference**

In `docs/archive/plans/2026-03-24_content-004-update-project-info.md` line 11, change:

```
**Spec:** `docs/superpowers/specs/2026-03-24_content-004-update-project-info-design.md`
```

to:

```
**Spec:** `docs/archive/specs/2026-03-24_content-004-update-project-info-design.md`
```

- [ ] **Step 8: Commit**

```bash
git add docs/archive/plans/
git commit -m "docs: Update stale superpowers spec references to archive paths"
```

---

### Task 5: Update archive README and verify

**Files:**
- Modify: `docs/archive/README.md`

- [ ] **Step 1: Update archive README**

Replace the full contents of `docs/archive/README.md` with:

```markdown
# Archive

**Last Updated**: 2026-03-27

Historical documentation that is no longer active but preserved for reference.

---

## Contents

| Directory | Purpose | Last Updated |
|-----------|---------|--------------|
| [plans/](plans/) | Completed implementation plans | 2026-03-27 |
| [specs/](specs/) | Completed design specifications | 2026-03-27 |

---

## Archiving Guidelines

Documents are archived when:
- Implementation plan is complete
- Document is no longer actively maintained
- Content is outdated but historically valuable
```

- [ ] **Step 2: Verify no remaining superpowers references in archive**

```bash
grep -r "superpowers/" docs/archive/
```

Expected: no output (all references updated).

- [ ] **Step 3: Verify superpowers directory is clean (only .gitkeep and this task's spec)**

```bash
find docs/superpowers/ -type f
```

Expected output:
```
docs/superpowers/plans/.gitkeep
docs/superpowers/specs/.gitkeep
docs/superpowers/specs/2026-03-27_archive-cleanup-design.md
```

- [ ] **Step 4: Verify archive/specs has all expected files**

```bash
ls docs/archive/specs/
```

Expected (8 files):
```
2026-03-18_workflow-plugin-design.md
2026-03-20_quality-009-eslint-enhancements-design.md
2026-03-21_challenge-003-contact-form-design.md
2026-03-21_quality-010-commitlint-design.md
2026-03-22_bug-004-filter-race-condition-design.md
2026-03-22_content-002-portfolio-requirements-design.md
2026-03-23_content-003-cleaning-site-design.md
2026-03-24_content-004-update-project-info-design.md
```

- [ ] **Step 5: Commit**

```bash
git add docs/archive/README.md
git commit -m "docs: Add specs directory to archive README index"
```

---

### Task 6: Update WEEKLY.md task status

**Files:**
- Modify: `docs/planning/WEEKLY.md`

- [ ] **Step 1: Mark all Monday subtasks as complete**

In `docs/planning/WEEKLY.md`, change lines 22-25 from:

```markdown
- [ ] **Consolidate `docs/superpowers/` into standard directory structure** — Move plan/spec files to `docs/archive/plans/` and `docs/archive/specs/`, update DONE.md references, update `docs/README.md` index *(IMPORTANT, 3 pts)*
- [ ] **Update `docs/archive/README.md` to index `specs/` subdirectory** — Created by BUG-004 PR but never documented *(IMPORTANT, 2 pts)*
- [ ] **Rename + move CONTENT-002 design spec** — Fix hyphen→underscore in filename, move from `archive/plans/` to `archive/specs/` *(1 pt)*
- [ ] **Archive CONTENT-003 design spec** — Move from `docs/superpowers/specs/` to `docs/archive/specs/` *(1 pt)*
```

to:

```markdown
- [x] **Consolidate `docs/superpowers/` into standard directory structure** — Move plan/spec files to `docs/archive/plans/` and `docs/archive/specs/`, update DONE.md references, update `docs/README.md` index *(IMPORTANT, 3 pts)*
- [x] **Update `docs/archive/README.md` to index `specs/` subdirectory** — Created by BUG-004 PR but never documented *(IMPORTANT, 2 pts)*
- [x] **Rename + move CONTENT-002 design spec** — Fix hyphen→underscore in filename, move from `archive/plans/` to `archive/specs/` *(1 pt)*
- [x] **Archive CONTENT-003 design spec** — Move from `docs/superpowers/specs/` to `docs/archive/specs/` *(1 pt)*
```

And update the summary table status column for all 4 Monday rows from `Planned` to `Done`.

- [ ] **Step 2: Commit**

```bash
git add docs/planning/WEEKLY.md
git commit -m "docs: Mark Monday archive cleanup tasks as complete"
```
