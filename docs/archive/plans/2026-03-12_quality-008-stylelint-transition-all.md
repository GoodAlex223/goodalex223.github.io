# QUALITY-008: Stylelint Rule to Prevent `transition: all`

**Status**: Complete
**Date**: 2026-03-12
**Source**: BACKLOG.md → From QUALITY-005

## Goal

Add `declaration-property-value-disallowed-list` rule for `transition: all` to `.stylelintrc.json` to enforce explicit property lists at lint time. Document the convention in CLAUDE.md.

## Approach

**Chosen**: Add Stylelint `declaration-property-value-disallowed-list` rule with word-boundary regex `/\ball\b/` for both `transition` and `transition-property` properties.

**Why this approach**:
- Preventive guard — zero existing violations (confirmed by QUALITY-005 audit)
- Word-boundary regex avoids false positives on values containing "all" as substring (e.g., `recall`)
- Covers both `transition` and `transition-property` to prevent bypass
- Custom error message guides developers toward the fix

## Changes Made

### `.stylelintrc.json`
- Added `declaration-property-value-disallowed-list` rule
- Regex `/\ball\b/` for both `transition` and `transition-property`
- Custom message: "Use explicit property lists instead of 'all' to prevent unintended side effects"

### `CLAUDE.md`
- Added bullet to CSS Linting conventions section (line 192)
- Auto-memory updated Build System Pattern section (line 431)

## Verification

- `npm run lint:css` — zero violations on all existing CSS (no false positives)
- `transition: all 250ms ease` — correctly flagged with custom message
- `transition-property: all` — correctly flagged
- `transition: none` — correctly allowed (no false positive)

## Key Discoveries

- All 20+ transition declarations in the codebase already use explicit property lists (QUALITY-005 confirmed)
- `.contact__link` has a potentially redundant `transition: background-color` since the `main.css` theme group already covers it

## Future Improvements

1. **Redundant `.contact__link` transition** — component-level `transition: background-color` may be redundant given theme group coverage → BACKLOG
2. **Case-insensitive regex** — `/\ball\b/` is case-sensitive; adding `/i` flag would provide defense-in-depth against `transition: All` (mitigated by `value-keyword-case: "lower"`) → BACKLOG
