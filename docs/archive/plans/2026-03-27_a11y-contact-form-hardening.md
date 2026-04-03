# Contact Form Accessibility Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 7 accessibility and quality issues in the contact form — focus management, CSS focus pattern alignment, theme transitions, SVG icons, and test improvements.

**Architecture:** Three layers executed in dependency order. Layer 1 (CSS) fixes the focus pattern foundation. Layer 2 (JS) adds focus management and SVG icons on top. Layer 3 (Tests) validates and improves test quality. Each task produces a working commit.

**Tech Stack:** HTML5, CSS3 (Custom Properties), ES6+, Playwright E2E tests

**Spec:** `docs/archive/specs/2026-03-27_contact-form-a11y-hardening-design.md`

**Branch:** `a11y/contact-form-hardening`

---

## File Map

| File | Role | Tasks |
|------|------|-------|
| `css/form.css` | Form component styles | 1, 4 |
| `css/main.css` | Theme transition group + layout | 2 |
| `js/main.js` | `showFormStatus()`, `resetForm()`, icon rendering | 3, 4 |
| `tests/form/validation.spec.js` | Form validation E2E tests | 5 |
| `tests/form/submission.spec.js` | Form submission E2E tests | 5 |
| `tests/form/axe-scan.spec.js` | WCAG axe scans | 6 |
| `tests/pages/FormPage.js` | Form Page Object Model | 5 |

---

## Task 1: Align form input focus-visible pattern

**Files:**
- Modify: `css/form.css:37-76`

- [ ] **Step 1: Add base transparent outline to `.contact-form__input`**

In `css/form.css`, add two outline properties to the `.contact-form__input` rule (after the existing `line-height` declaration, before `transition`):

```css
/* Inputs and textarea */
.contact-form__input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  outline: var(--focus-outline-width) solid transparent;
  outline-offset: var(--focus-outline-offset);
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    outline-color var(--transition-fast);
}
```

- [ ] **Step 2: Change `:focus-visible` to outline-color only**

Replace the full `outline` shorthand with just `outline-color`:

```css
.contact-form__input:focus-visible {
  border-color: var(--color-accent);
  outline-color: var(--focus-outline-color);
}
```

This removes the `outline` and `outline-offset` lines from `:focus-visible` — they're now set permanently on the base rule.

- [ ] **Step 3: Simplify `--invalid:focus-visible`**

The invalid focus-visible rule already only sets `outline-color`, but verify it looks like this (no changes needed if it already matches):

```css
.contact-form__input--invalid:focus-visible {
  border-color: var(--color-error);
  outline-color: var(--color-error);
}
```

- [ ] **Step 4: Run lint to verify CSS is valid**

Run: `npm run lint:css`
Expected: No errors (Stylelint passes)

- [ ] **Step 5: Commit**

```bash
git add css/form.css
git commit -m "style: Align form input focus pattern with reset.css convention

Add permanent transparent outline to .contact-form__input base rule
and change :focus-visible to only modify outline-color, matching the
established pattern for a/button in reset.css."
```

---

## Task 2: Fix theme transition group (remove input, add status)

**Files:**
- Modify: `css/main.css:13-24`

- [ ] **Step 1: Remove `.contact-form__input` and add `.contact-form__status`**

In `css/main.css`, change the theme transition group selector list. Remove `.contact-form__input` (component-level transition in `form.css` already covers theme properties). Add `.contact-form__status` for smooth theme switching on the status container.

Before:
```css
body,
.site-header,
.project-card,
.skill-group,
.contact__link,
.contact-form__input {
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base),
    outline-color var(--transition-fast);
}
```

After:
```css
body,
.site-header,
.project-card,
.skill-group,
.contact__link,
.contact-form__status {
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base),
    outline-color var(--transition-fast);
}
```

- [ ] **Step 2: Run lint to verify CSS is valid**

Run: `npm run lint:css`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add css/main.css
git commit -m "style: Fix theme transition group for contact form

Remove .contact-form__input (component transition in form.css already
covers theme properties — follows .btn exclusion precedent). Add
.contact-form__status for smooth theme switching on status container."
```

---

## Task 3: Add focus management to showFormStatus and resetForm

**Files:**
- Modify: `js/main.js:1277-1313`

- [ ] **Step 1: Add focus to action button in `showFormStatus()`**

In `js/main.js`, find `showFormStatus()` (line 1277). After `statusContainer.hidden = false;` (line 1294), add `actionButton.focus();`:

```js
function showFormStatus(form, statusContainer, type, message) {
  // Hide the form
  form.hidden = true;

  // Configure status container
  statusContainer.className = `contact-form__status contact-form__status--${type}`;

  const icon = statusContainer.querySelector(".contact-form__status-icon");
  icon.textContent = type === "success" ? "\u2713" : "\u2717";

  const messageEl = statusContainer.querySelector(".contact-form__status-message");
  messageEl.textContent = message;

  const actionButton = statusContainer.querySelector(".contact-form__status-action");
  actionButton.textContent = type === "success" ? "Send another message" : "Try again";

  // Show status
  statusContainer.hidden = false;

  // Move focus to action button for keyboard/screen reader users
  actionButton.focus();
}
```

Note: The `icon.textContent` line still uses Unicode here — Task 4 will replace it with SVG.

- [ ] **Step 2: Add focus to first field in `resetForm()`**

In `js/main.js`, find `resetForm()` (line 1302). After `form.hidden = false;` (line 1312), add focus to the first input:

```js
function resetForm(form, statusContainer) {
  // Hide status
  statusContainer.hidden = true;

  // Reset form fields and errors
  form.reset();
  const fields = form.querySelectorAll(".contact-form__input--invalid");
  fields.forEach((field) => clearFieldError(field));

  // Show form
  form.hidden = false;

  // Restore focus to first field
  form.querySelector(".contact-form__input").focus();
}
```

- [ ] **Step 3: Run lint to verify JS is valid**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 4: Manually verify focus behavior**

Start a local server (`npx serve`) and test:
1. Fill form with valid data, submit (use browser DevTools Network tab to block formspree.io so it errors, or just test the flow)
2. After status appears → verify the action button has focus (Tab should move forward from it, Shift+Tab backward)
3. Click "Try again" → verify the Name field has focus

- [ ] **Step 5: Commit**

```bash
git add js/main.js
git commit -m "a11y: Add focus management after form submission

Move focus to action button in showFormStatus() so keyboard/SR users
have an immediate actionable target. Restore focus to first field in
resetForm() when returning to the form."
```

---

## Task 4: Replace Unicode status icons with inline SVG

**Files:**
- Modify: `js/main.js:1284-1285` (inside `showFormStatus()`)
- Modify: `css/form.css:115-126` (`.contact-form__status-icon`)

- [ ] **Step 1: Replace `icon.textContent` with SVG `innerHTML` in `showFormStatus()`**

In `js/main.js`, find the icon line inside `showFormStatus()` (the `icon.textContent = type === "success" ? ...` line). Replace it with:

```js
  const icon = statusContainer.querySelector(".contact-form__status-icon");
  icon.innerHTML = type === "success"
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
```

These are minimal feather-style SVGs: a checkmark polyline for success, an X (two crossing lines) for error. They use `stroke="currentColor"` to inherit the existing success/error color from the parent's CSS `color` property.

- [ ] **Step 2: Remove `font-size` from `.contact-form__status-icon` CSS**

In `css/form.css`, update the status icon rule to remove the `font-size` line (no longer rendering text):

```css
/* Status icon */
.contact-form__status-icon {
  width: 3rem;
  height: 3rem;
  margin-inline: auto;
  margin-bottom: var(--space-4);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors from either CSS or JS linting

- [ ] **Step 4: Manually verify icons render correctly**

Start a local server (`npx serve`) and test:
1. Submit form to see success state → verify checkmark SVG renders inside the green circle
2. Trigger error state → verify X SVG renders inside the red circle
3. Toggle theme → verify icons inherit the correct color in both themes

- [ ] **Step 5: Commit**

```bash
git add js/main.js css/form.css
git commit -m "style: Replace Unicode status icons with inline SVG

Use stroke-based SVGs (checkmark/X) instead of Unicode ✓/✗ for
consistent cross-platform rendering. Remove font-size from status
icon CSS since it no longer renders text."
```

---

## Task 5: Improve validation test assertions + add focus tests

**Files:**
- Modify: `tests/form/validation.spec.js:1-2, 19-23`
- Modify: `tests/form/submission.spec.js`
- Modify: `tests/pages/FormPage.js`

- [ ] **Step 1: Add `expectFocused` helper to FormPage POM**

In `tests/pages/FormPage.js`, add this method in the Assertions section (after `expectSubmitEnabled()`):

```js
  async expectFocused(locator) {
    await expect(locator).toBeFocused();
  }
```

- [ ] **Step 2: Fix web-first assertion in validation test**

In `tests/form/validation.spec.js`, add `expect` to the import:

```js
import { test, expect } from "@playwright/test";
```

Then replace the focus test (lines 19-24):

Before:
```js
  test("focuses first invalid field on submit", async ({ page }) => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    const focused = await page.evaluate(() => document.activeElement.id);
    test.expect(focused).toBe("contact-name");
  });
```

After:
```js
  test("focuses first invalid field on submit", async () => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    await expect(fp.nameField).toBeFocused();
  });
```

Note: Removed `{ page }` destructuring since it's no longer needed.

- [ ] **Step 3: Add focus-after-submission test to submission.spec.js**

In `tests/form/submission.spec.js`, add `expect` to the import:

```js
import { test, expect } from "@playwright/test";
```

Then add these two tests after the existing "Send another message resets to form" test (after line 80):

```js
  test("focuses action button after successful submission", async () => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();
    await expect(fp.statusAction).toBeFocused();
  });

  test("focuses first field after clicking Send another message", async () => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();

    await fp.clickStatusAction();
    await fp.expectFormVisible();
    await expect(fp.nameField).toBeFocused();
  });
```

- [ ] **Step 4: Run the form tests to verify they pass**

Run: `npm test -- --grep "Form Validation|Form Submission"`
Expected: All tests pass, including the new focus tests and the updated assertion.

- [ ] **Step 5: Commit**

```bash
git add tests/form/validation.spec.js tests/form/submission.spec.js tests/pages/FormPage.js
git commit -m "test: Add focus assertions and improve test quality

Replace page.evaluate activeElement check with web-first toBeFocused()
assertion. Add tests for focus management after form submission and
after clicking Send another message. Add expectFocused helper to POM."
```

---

## Task 6: Fix reduced-motion axe test to use POM goto()

**Files:**
- Modify: `tests/form/axe-scan.spec.js:54-58`

- [ ] **Step 1: Replace `fp.page.goto("/")` with `fp.goto()`**

In `tests/form/axe-scan.spec.js`, change the reduced-motion test (lines 54-58):

Before:
```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.page.goto("/");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
```

After:
```js
  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
```

`enableReducedMotion()` sets the emulation before navigation, so `goto()` navigates with reduced motion already active. The POM's `goto()` includes a readiness assertion (waits for filter button labels), preventing flaky axe scans on uninitialized pages.

- [ ] **Step 2: Run the axe scan tests to verify they pass**

Run: `npm test -- --grep "Form WCAG Scan"`
Expected: All 7 axe scan tests pass, including the reduced-motion test.

- [ ] **Step 3: Commit**

```bash
git add tests/form/axe-scan.spec.js
git commit -m "test: Use POM goto() in reduced-motion axe test

Replace direct fp.page.goto('/') with fp.goto() which includes a
readiness assertion. Prevents flaky axe scans on pages that haven't
fully initialized."
```

---

## Task 7: Full test suite + lint verification

- [ ] **Step 1: Run full lint**

Run: `npm run lint`
Expected: No errors from CSS or JS linting.

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass across all browsers (Chromium, Firefox, WebKit).

- [ ] **Step 3: Run build pipeline**

Run: `npm run build`
Expected: Build succeeds, size budgets respected.

- [ ] **Step 4: Run Lighthouse audit**

Run: `npm run lighthouse`
Expected: All categories ≥90/100.

- [ ] **Step 5: If all gates pass, the implementation is complete**

All 7 items from the spec are implemented and verified. Ready for PR creation.
