# Form & A11Y Polish — Design Spec

**Date**: 2026-04-08
**Branch**: `polish/form-a11y-polish`
**Origin**: BACKLOG.md — PR #56 code review findings (3 items)
**Effort**: 4 SP (batch)

---

## Overview

Three independent fixes addressing consistency gaps found during PR #56 (Contact Form A11Y Hardening) code review. All are small, localized changes with no architectural impact.

---

## Task 1: Add `aria-hidden="true"` to Status SVGs (1 SP)

### Problem

The two inline SVGs injected by `showFormStatus()` in `js/main.js` (lines 1285-1287) lack `aria-hidden="true"`. Every other inline SVG in the codebase includes this attribute. These SVGs are decorative — the adjacent `.contact-form__status-message` text conveys meaning to screen readers.

### Fix

Add `aria-hidden="true"` to both `<svg>` elements in the template strings:
- Success checkmark SVG (line 1286)
- Error X icon SVG (line 1287)

### Files Changed

- `js/main.js` — add attribute to 2 SVG template strings in `showFormStatus()`

---

## Task 2: Add `color` to Input Transition (2 SP)

### Problem

`.contact-form__input` in `css/form.css` (lines 48-51) transitions `border-color`, `background-color`, and `outline-color` but omits `color`. When the user toggles the theme, input text color snaps instantly while borders and background animate smoothly.

### Fix

Add `color var(--transition-fast)` to the existing transition shorthand. Uses `--transition-fast` to stay consistent with the other properties on the same element.

**Precedent**: `.btn` in `components.css` includes `color` in its component-level transition list.

### Files Changed

- `css/form.css` — add `color var(--transition-fast)` to `.contact-form__input` transition
- `CLAUDE.md` — remove the "Pending" note about this omission in the Contact Form section

---

## Task 3: `test.expect()` → `expect()` Migration (1 SP)

### Problem

BACKLOG item states lines 69 and 118 of `tests/form/submission.spec.js` use `test.expect(requestMade).toBe(false)` instead of the imported `expect`.

### Current State

Code inspection shows both lines already use `expect()` (the imported version from line 1). This may have been fixed in a prior commit.

### Action

- Verify at implementation time via git blame
- If already migrated: mark as no-op, remove from BACKLOG, note in commit
- If still present: complete the migration

### Files Changed (conditional)

- `tests/form/submission.spec.js` — only if migration is still needed
- `docs/planning/BACKLOG.md` — remove the completed item

---

## Testing Strategy

1. **Automated**: `npm test` — full Playwright suite (all 3 browsers)
2. **Automated**: `npm run lint` — CSS + JS linting
3. **Automated**: Existing `tests/form/axe-scan.spec.js` covers WCAG compliance for form states
4. **Manual**: Theme toggle on contact form — verify input text color animates smoothly
5. **Screen reader spot-check**: Verify status SVGs are not announced

---

## CLAUDE.md Updates

- Remove "Pending" note: "`.contact-form__input` transition lists `border-color`, `background-color`, `outline-color` but omits `color`..."
- Remove "Pending" note: "these SVGs lack `aria-hidden="true"`..."

---

## BACKLOG Cleanup

Remove these completed items from BACKLOG.md (under "From Contact Form A11Y Hardening Code Review"):
- `Add aria-hidden="true" to decorative SVGs in showFormStatus()`
- `Add color to .contact-form__input component-level transition`
- `Complete test.expect() → expect() migration in submission.spec.js`
