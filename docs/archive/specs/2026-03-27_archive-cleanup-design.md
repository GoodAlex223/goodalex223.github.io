# Documentation Debt & Archive Cleanup — Design Spec

**Date**: 2026-03-27
**Status**: Approved
**Origin**: [WEEKLY.md — Monday task](../../planning/WEEKLY.md) (7 pts)

## Problem

The `docs/superpowers/` directory accumulated plan and spec files from the brainstorming/writing-plans workflow. Some were properly archived during task completion; others were not. This created:

1. **Duplicate files** — 4 files in `superpowers/` that already exist in `docs/archive/plans/`
2. **Unarchived files** — 4 unique files in `superpowers/` never moved to the archive
3. **Misplaced design specs** — 3 `*-design.md` files sitting in `archive/plans/` instead of `archive/specs/`
4. **Stale references** — 7 archived plan files point to old `docs/superpowers/specs/` paths
5. **Undocumented directory** — `archive/specs/` exists but isn't listed in `docs/archive/README.md`
6. **Naming inconsistency** — 1 file uses hyphens after date instead of underscores (`2026-03-22-content-002-...`)

## Solution

File moves, deletes, renames, and reference updates. No code changes. `docs/superpowers/` directory remains in place for future plugin use.

## Changes

### 1. Delete duplicates from `docs/superpowers/`

| File | Duplicate of |
|------|-------------|
| `superpowers/plans/2026-03-21_challenge-003-contact-form.md` | `archive/plans/` (same file) |
| `superpowers/plans/2026-03-21_quality-010-commitlint.md` | `archive/plans/` (same file) |
| `superpowers/specs/2026-03-21_challenge-003-contact-form-design.md` | `archive/plans/` (misplaced there) |
| `superpowers/specs/2026-03-21_quality-010-commitlint-design.md` | `archive/plans/` (misplaced there) |

### 2. Archive unique files from `docs/superpowers/`

| From | To |
|------|-----|
| `superpowers/plans/2026-03-18-workflow-plugin.md` | `archive/plans/2026-03-18_workflow-plugin.md` |
| `superpowers/specs/2026-03-18-workflow-plugin-design.md` | `archive/specs/2026-03-18_workflow-plugin-design.md` |
| `superpowers/specs/2026-03-20-quality-009-eslint-enhancements-design.md` | `archive/specs/2026-03-20_quality-009-eslint-enhancements-design.md` |
| `superpowers/specs/2026-03-23_content-003-cleaning-site-design.md` | `archive/specs/2026-03-23_content-003-cleaning-site-design.md` |

Hyphen-to-underscore rename applied where needed (post-date separator convention).

### 3. Move misplaced design specs: `archive/plans/` → `archive/specs/`

| From archive/plans/ | To archive/specs/ |
|---------------------|-------------------|
| `2026-03-21_challenge-003-contact-form-design.md` | Same name |
| `2026-03-21_quality-010-commitlint-design.md` | Same name |
| `2026-03-22-content-002-portfolio-requirements-design.md` | `2026-03-22_content-002-portfolio-requirements-design.md` (underscore fix) |

### 4. Update stale spec references in archived plans

Seven plan files have `**Spec:**` lines pointing to `docs/superpowers/specs/...`. Update each to `docs/archive/specs/...`:

| Plan file | Old spec path | New spec path |
|-----------|--------------|---------------|
| `2026-03-20_quality-009-eslint-enhancements.md` | `superpowers/specs/2026-03-20-quality-009-...` | `archive/specs/2026-03-20_quality-009-...` |
| `2026-03-21_challenge-003-contact-form.md` | `superpowers/specs/2026-03-21_challenge-003-...` | `archive/specs/2026-03-21_challenge-003-...` |
| `2026-03-21_quality-010-commitlint.md` | `superpowers/specs/2026-03-21_quality-010-...` | `archive/specs/2026-03-21_quality-010-...` |
| `2026-03-22-bug-004-filter-race-condition.md` | `superpowers/specs/2026-03-22-bug-004-...` | `archive/specs/2026-03-22_bug-004-...` |
| `2026-03-22_content-002-portfolio-requirements.md` | `superpowers/specs/2026-03-22-content-002-...` (3 refs) | `archive/specs/2026-03-22_content-002-...` |
| `2026-03-23_content-003-cleaning-site.md` | `superpowers/specs/2026-03-23_content-003-...` | `archive/specs/2026-03-23_content-003-...` |
| `2026-03-24_content-004-update-project-info.md` | `superpowers/specs/2026-03-24_content-004-...` | `archive/specs/2026-03-24_content-004-...` |

Note: content-002 plan has 3 references (line 11 spec pointer + lines 200, 218 in archival instructions). The archival instructions are historical — update paths but don't change the described actions.

### 5. Update `docs/archive/README.md`

Add `specs/` row to the Contents table:

```markdown
| [specs/](specs/) | Completed design specifications | 2026-03-27 |
```

Update "Last Updated" to `2026-03-27`. Update `plans/` last-updated date to `2026-03-27`.

### 6. Preserve `docs/superpowers/` directory

Leave directory in place (empty of tracked files). Git won't track empty directories, so add `.gitkeep` files to `superpowers/plans/` and `superpowers/specs/` to preserve the structure for future plugin use.

## Files Modified

- **Delete**: 4 files from `docs/superpowers/`
- **Move + rename**: 4 files from `docs/superpowers/` → `docs/archive/`
- **Move**: 3 files from `docs/archive/plans/` → `docs/archive/specs/`
- **Edit**: 7 plan files (spec path references)
- **Edit**: 1 file (`docs/archive/README.md`)
- **Create**: 2 `.gitkeep` files in `docs/superpowers/`

## Out of Scope

- Updating `docs/README.md` (no superpowers references found)
- Updating `docs/planning/DONE.md` (no superpowers references found)
- Changes to CLAUDE.md or any code files
