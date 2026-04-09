# Form & A11Y Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three consistency gaps found during PR #56 code review — SVG accessibility, input transition smoothness, and backlog cleanup.

**Architecture:** Three independent, localized fixes. No new files, no architectural changes. Two code fixes (JS + CSS), one verified no-op with documentation cleanup.

**Tech Stack:** HTML5/CSS3, vanilla JS, Playwright E2E tests

---

## Task 1: Add `aria-hidden="true"` to Status SVGs (1 SP)

**Files:**
- Modify: `js/main.js:1285-1287` — add `aria-hidden="true"` to both SVG template strings

- [ ] **Step 1: Add `aria-hidden="true"` to both SVGs in `showFormStatus()`**

In `js/main.js`, find the `showFormStatus()` function (line 1285). The two SVG template strings are missing `aria-hidden="true"`. Every other inline SVG in the codebase includes it. These are decorative — the adjacent `.contact-form__status-message` conveys meaning.

Change line 1285-1287 from:

```js
  icon.innerHTML = type === "success"
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
```

To:

```js
  icon.innerHTML = type === "success"
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
```

- [ ] **Step 2: Run lint to verify**

Run: `npm run lint:js`
Expected: PASS (no new lint errors)

- [ ] **Step 3: Run form tests**

Run: `npx playwright test tests/form/ --reporter=line`
Expected: All form tests pass. The existing `tests/form/axe-scan.spec.js` suite covers success and error states — axe will validate the SVGs are properly hidden from the accessibility tree.

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "fix(a11y): Add aria-hidden to status icon SVGs in showFormStatus()"
```

---

## Task 2: Add `color` to Input Transition (2 SP)

**Files:**
- Modify: `css/form.css:48-51` — add `color` to `.contact-form__input` transition

- [ ] **Step 1: Add `color` to the transition shorthand**

In `css/form.css`, find `.contact-form__input` (line 37). The transition property (lines 48-51) lists `border-color`, `background-color`, and `outline-color` but omits `color`. This causes input text to snap instantly on theme toggle while borders/background animate.

Change lines 48-51 from:

```css
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    outline-color var(--transition-fast);
```

To:

```css
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast),
    outline-color var(--transition-fast);
```

Note: `color` is placed before `outline-color` to group visual properties logically (border, background, text color, then outline). This follows the `.btn` precedent in `components.css:12-17` which also includes `color` in its component-level transition.

- [ ] **Step 2: Run CSS lint**

Run: `npm run lint:css`
Expected: PASS. The `transition: all` ban in `.stylelintrc.json` won't trigger since we're using explicit property names.

- [ ] **Step 3: Run form tests**

Run: `npx playwright test tests/form/ --reporter=line`
Expected: All form tests pass. No behavioral change — only animation smoothness.

- [ ] **Step 4: Manual verification**

Start local server (`npx serve`) and open the contact form. Toggle between light and dark themes. Verify:
- Input text color now animates smoothly (not snapping)
- Border and background still animate as before
- Focus outline still works correctly

- [ ] **Step 5: Commit**

```bash
git add css/form.css
git commit -m "fix(css): Add color transition to contact form inputs

Text color snapped instantly on theme switch while border and
background animated smoothly. Adding color to the transition
list matches the .btn component precedent."
```

---

## Task 3: Documentation Cleanup (0 SP — no code change)

**Files:**
- Modify: `CLAUDE.md:150-151` — remove two "Pending" notes (now fixed by Tasks 1 & 2)
- Modify: `docs/planning/BACKLOG.md:704-706` — mark all 3 items as complete

**Prerequisite:** Tasks 1 and 2 must be committed first.

- [ ] **Step 1: Update CLAUDE.md — remove SVG pending note**

In `CLAUDE.md`, line 150, change:

```
- Status icons (success/error) are inline SVGs injected via `icon.innerHTML` in `showFormStatus()` — not Unicode characters. SVGs use `stroke="currentColor"` to inherit color from modifier classes. **Pending**: these SVGs lack `aria-hidden="true"` (unlike every other inline SVG in the codebase)
```

To:

```
- Status icons (success/error) are inline SVGs injected via `icon.innerHTML` in `showFormStatus()` — not Unicode characters. SVGs use `stroke="currentColor"` to inherit color from modifier classes, with `aria-hidden="true"` matching all other inline SVGs in the codebase
```

- [ ] **Step 2: Update CLAUDE.md — remove input transition pending note**

In `CLAUDE.md`, line 151, delete the entire line:

```
- **Pending**: `.contact-form__input` transition lists `border-color`, `background-color`, `outline-color` but omits `color` — text color snaps on theme switch while other properties animate
```

- [ ] **Step 3: Update BACKLOG.md — mark all 3 items complete**

In `docs/planning/BACKLOG.md`, change lines 704-706 under "From Contact Form A11Y Hardening Code Review (2026-04-03)" from:

```markdown
- [ ] Add `aria-hidden="true"` to decorative SVGs in `showFormStatus()` — every other inline SVG in the codebase includes it; the status icon SVGs omit it (score 50, not blocking but inconsistent)
- [ ] Add `color` to `.contact-form__input` component-level transition — removing input from theme transition group dropped the `color` animation; text snaps on theme switch while background/border animate smoothly (`.btn` precedent includes `color` in its own transition)
- [ ] Complete `test.expect()` → `expect()` migration in `tests/form/submission.spec.js` — lines 69 and 118 still use `test.expect(requestMade).toBe(false)` while rest of file uses imported `expect`
```

To:

```markdown
- [x] ~~Add `aria-hidden="true"` to decorative SVGs in `showFormStatus()`~~ *(completed 2026-04-08, polish/form-a11y-polish)*
- [x] ~~Add `color` to `.contact-form__input` component-level transition~~ *(completed 2026-04-08, polish/form-a11y-polish)*
- [x] ~~Complete `test.expect()` → `expect()` migration in `tests/form/submission.spec.js`~~ *(already completed in prior commit 0f751f2)*
```

- [ ] **Step 4: Commit documentation changes**

```bash
git add CLAUDE.md docs/planning/BACKLOG.md
git commit -m "docs: Update CLAUDE.md and BACKLOG for Form & A11Y Polish fixes"
```

---

## Task 4: Final Verification (0 SP)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass across Chromium, Firefox, and WebKit.

- [ ] **Step 2: Run linters**

Run: `npm run lint`
Expected: PASS — no CSS or JS lint errors.
