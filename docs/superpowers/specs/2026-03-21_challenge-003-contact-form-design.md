# CHALLENGE-003: Contact Form — Design Spec

**Date**: 2026-03-21
**Status**: Draft
**Origin**: [TODO.md](../../planning/TODO.md) — Weekly Challenge, [ROADMAP.md](../../planning/ROADMAP.md) v2.0, [BACKLOG.md](../../planning/BACKLOG.md) — Contact Form

---

## 1. Goal

Add an accessible contact form to the portfolio, replacing the passive email `mailto:` link with an active engagement path. The form enables recruiters, employers, and collaborators to reach out directly without leaving the site.

## 2. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form placement | Replaces email link only | Least disruptive; 4 social links (GitHub, LinkedIn, Telegram, Wokwi) remain as-is below the form |
| Fields | Name, Email, Message (all required) | Minimal friction, highest conversion; standard for portfolio contact forms |
| Spam protection | Honeypot + Formspree built-in filtering | No third-party dependency (no Google reCAPTCHA), no privacy concerns, no visible badges |
| Submission service | Formspree (free tier, 50/month) | Industry standard for static sites, simple `fetch()` POST, built-in spam filtering |
| Success/error feedback | Inline replacement | Form fades out, replaced by success/error message in same space; keeps single-page experience |
| Validation approach | Hybrid (HTML5 + custom JS) | Progressive enhancement — works without JS, polished themed errors when JS available |

## 3. Architecture

### 3.1 HTML Structure

The contact form replaces the first `<li>` (email link) in the existing `<ul class="contact__links">`. The form sits above the social links list.

```html
<section id="contact" class="contact section">
  <div class="container text-center">
    <h2 class="section__title" data-animate>Get in Touch</h2>
    <p class="contact__intro" data-animate data-animate-delay="50">
      Open to opportunities and collaborations.
    </p>

    <!-- Contact Form (replaces mailto link) -->
    <form id="contact-form" class="contact-form" action="https://formspree.io/f/{FORM_ID}"
          method="POST" novalidate data-animate data-animate-delay="100">

      <!-- Honeypot (spam protection) -->
      <div class="contact-form__honeypot" aria-hidden="true" tabindex="-1">
        <label for="contact-phone">Phone</label>
        <input type="text" id="contact-phone" name="_gotcha" autocomplete="off" tabindex="-1">
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-name">Name</label>
        <input class="contact-form__input" type="text" id="contact-name" name="name"
               required minlength="2" maxlength="100" autocomplete="name"
               aria-describedby="contact-name-error">
        <p class="contact-form__error" id="contact-name-error" role="alert" aria-live="polite" hidden></p>
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-email">Email</label>
        <input class="contact-form__input" type="email" id="contact-email" name="email"
               required autocomplete="email"
               aria-describedby="contact-email-error">
        <p class="contact-form__error" id="contact-email-error" role="alert" aria-live="polite" hidden></p>
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-message">Message</label>
        <textarea class="contact-form__input contact-form__input--textarea"
                  id="contact-message" name="message"
                  required minlength="10" maxlength="2000" rows="5"
                  aria-describedby="contact-message-error"></textarea>
        <p class="contact-form__error" id="contact-message-error" role="alert" aria-live="polite" hidden></p>
      </div>

      <button class="btn btn--primary contact-form__submit" type="submit">
        <span class="contact-form__submit-text">Send Message</span>
        <span class="contact-form__submit-loading" aria-hidden="true" hidden>Sending...</span>
      </button>
    </form>

    <!-- Success/Error feedback (inline replacement) -->
    <div class="contact-form__status" id="contact-form-status" role="alert" aria-live="polite" hidden>
      <div class="contact-form__status-icon" aria-hidden="true"></div>
      <p class="contact-form__status-message"></p>
      <button class="contact-form__status-action btn btn--secondary" type="button"></button>
    </div>

    <!-- Social links (unchanged, minus email) -->
    <ul class="contact__links">
      <!-- GitHub, LinkedIn, Telegram, Wokwi links remain as-is -->
    </ul>
  </div>
</section>
```

### 3.2 CSS — New File: `css/form.css`

Imported in `css/main.css` after `modal.css`:

```css
@import url("form.css");
```

**BEM class inventory:**

| Class | Element | Purpose |
|-------|---------|---------|
| `.contact-form` | `<form>` | Form container; max-width, centered |
| `.contact-form__honeypot` | `<div>` | Hidden honeypot field; `position: absolute; left: -9999px; opacity: 0` |
| `.contact-form__field` | `<div>` | Field wrapper; margin-bottom for spacing |
| `.contact-form__label` | `<label>` | Field label; left-aligned, font-weight medium |
| `.contact-form__input` | `<input>`, `<textarea>` | Text/email/textarea; full-width, themed border, background, focus ring |
| `.contact-form__input--textarea` | `<textarea>` | Textarea modifier; resize vertical, min-height |
| `.contact-form__input--invalid` | modifier | Invalid state; error border color, `aria-invalid="true"` |
| `.contact-form__error` | `<p>` | Inline error message; red text, hidden by default |
| `.contact-form__submit` | `<button>` | Submit button; uses existing `.btn--primary` styles |
| `.contact-form__submit-text` | `<span>` | Default button label |
| `.contact-form__submit-loading` | `<span>` | Loading state label; shown during submission |
| `.contact-form__status` | `<div>` | Success/error message container; replaces form after submission |
| `.contact-form__status-icon` | `<div>` | Checkmark (success) or X (error) icon |
| `.contact-form__status-message` | `<p>` | Status text ("Thanks!" or error description) |
| `.contact-form__status-action` | `<button>` | "Send another" or "Try again" button |

**Design token usage:**

- Backgrounds: `--color-bg-card` (input bg), `--color-bg-secondary` (input focus bg)
- Borders: `--color-border` (default), `--color-accent` (focus), error color for invalid
- Text: `--color-text-primary` (input text), `--color-text-secondary` (labels)
- Spacing: `--space-2` to `--space-6` for field gaps, padding
- Radii: `--radius-md` for inputs, matching `.contact__link` style
- Transitions: `--transition-fast` for border/focus, `--transition-base` for fade in/out
- Focus: `--focus-outline-width`, `--focus-outline-offset`, `--focus-outline-color`

**Error colors** — new CSS custom properties in `variables.css`:

```css
/* Dark theme */
--color-error: #ef5350;
--color-error-bg: rgba(239, 83, 80, 0.1);

/* Light theme */
[data-theme="light"] {
  --color-error: #c62828;
  --color-error-bg: rgba(198, 40, 40, 0.08);
}
```

**Success colors** — reuse existing status colors:

```css
--color-success: var(--color-status-active);       /* green */
--color-success-bg: var(--color-status-active-bg);  /* green bg */
```

**Responsive:**
- Mobile: Full-width form, stacked fields
- Desktop (37.5em+): Form constrained to `max-width: 32rem`, centered
- Form layout: Single column at all breakpoints (appropriate for contact forms)

**Theme transitions:**
- `.contact-form__input` added to the theme transition group in `main.css` for smooth light/dark switching

**Reduced motion:**
- Form submission fade transition set to `transition: none` under `prefers-reduced-motion: reduce`

### 3.3 JavaScript — Functions in `js/main.js`

New initialization function `initContactForm()` called from `DOMContentLoaded`.

**Function inventory:**

| Function | Purpose |
|----------|---------|
| `initContactForm()` | Sets up event listeners (submit, blur), honeypot check |
| `validateField(field)` | Validates single field, returns `{valid, message}`; checks `required`, `type`, `minlength`, `maxlength` |
| `showFieldError(field, message)` | Shows inline error: adds `--invalid` class, sets `aria-invalid="true"`, populates error `<p>`, unhides it |
| `clearFieldError(field)` | Removes error state: removes `--invalid` class, clears `aria-invalid`, hides error `<p>` |
| `validateForm(form)` | Validates all fields, returns boolean; focuses first invalid field |
| `submitForm(form)` | Async: disables button, shows loading text, `fetch()` POST to Formspree, calls `showFormStatus()` |
| `showFormStatus(type, message)` | Fades form out, shows success/error message with appropriate icon and action button |
| `resetForm(form)` | Fades status out, shows form again, resets all fields and errors |

**Validation rules:**

| Field | Rules | Error messages |
|-------|-------|----------------|
| Name | Required, minlength 2, maxlength 100 | "Please enter your name" / "Name must be at least 2 characters" |
| Email | Required, valid email format | "Please enter your email address" / "Please enter a valid email address" |
| Message | Required, minlength 10, maxlength 2000 | "Please enter a message" / "Message must be at least 10 characters" |

**Email validation:** Use the same pattern as the browser's `type="email"` check via `input.validity.typeMismatch` (leverages the Constraint Validation API rather than a custom regex).

**Submission flow:**

```
User clicks Submit
  → validateForm() — if invalid, focus first bad field, return
  → Check honeypot — if filled, silently "succeed" (don't reveal detection)
  → Disable submit button, show "Sending..." text
  → fetch() POST to Formspree endpoint (JSON body, Accept: application/json)
  → On 200: showFormStatus("success", "Thanks! I'll get back to you soon.")
  → On error: showFormStatus("error", "Something went wrong. Please try again.")
  → Re-enable submit button
```

**Honeypot behavior:** If the hidden `_gotcha` field has a value, the form pretends to submit successfully (shows success message) but doesn't actually send. This prevents bots from knowing they were caught.

### 3.4 Formspree Integration

- **Endpoint**: `https://formspree.io/f/{FORM_ID}` — the actual form ID is configured in the HTML `action` attribute
- **Method**: `fetch()` POST with `Content-Type: application/json` and `Accept: application/json` headers
- **Body**: `{ name, email, message }` (honeypot field `_gotcha` sent to Formspree for their spam filtering)
- **Fallback**: The `<form>` has a standard `action` + `method="POST"`, so it works without JS (Formspree handles the redirect)
- **Setup required**: Create a Formspree account, create a form, get the form ID, replace `{FORM_ID}` in HTML

### 3.5 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | `<label for="id">` associated with each input via matching `id` |
| Error identification | `aria-invalid="true"` on invalid fields |
| Error description | `aria-describedby` linking each input to its error `<p>` |
| Dynamic errors | Error `<p>` elements have `role="alert"` + `aria-live="polite"` |
| Focus management | On validation failure, focus moves to first invalid field |
| Keyboard | Full Tab navigation; Enter submits form |
| Honeypot isolation | `aria-hidden="true"` + `tabindex="-1"` on honeypot container |
| Form status | Status container has `role="alert"` + `aria-live="polite"` for screen reader announcement |
| Submit state | Button disabled during submission; loading text announced |
| Reduced motion | Fade animations disabled via `prefers-reduced-motion` |
| Color contrast | Error colors meet WCAG AA (4.5:1) in both themes |

### 3.6 Testing

**New test directory:** `tests/form/`

**Page Object Model:** `tests/pages/FormPage.js`
- Locators: form, fields, labels, errors, submit button, status container
- Actions: `fillField()`, `submitForm()`, `expectFieldError()`, `expectNoFieldError()`, `expectSuccess()`, `expectError()`
- Helpers: `enableReducedMotion()`, `setTheme()`

**Test suites:**

| File | Coverage |
|------|----------|
| `tests/form/validation.spec.js` | Required fields, email format, minlength, maxlength, blur validation, submit validation, focus on first error |
| `tests/form/submission.spec.js` | Successful submit (mock Formspree), error handling (mock network failure), loading state, honeypot detection, inline success/error messages, "Send another" / "Try again" actions |
| `tests/form/accessibility.spec.js` | ARIA attributes, label associations, focus management, keyboard navigation, screen reader announcements |
| `tests/form/axe-scan.spec.js` | WCAG 2.1 AA scanning: form default state, field errors visible, success state, light theme, dark theme, reduced motion |

**Formspree mocking:** Use Playwright's `page.route()` to intercept `https://formspree.io/f/*` requests and return controlled responses (200 success, 400/500 errors) without hitting the real API.

## 4. Files Changed

| File | Change |
|------|--------|
| `index.html` | Remove email `<li>`, add `<form>` and status container above social links |
| `css/form.css` | **New** — form field styles, validation states, status messages |
| `css/main.css` | Add `@import url("form.css")`, add `.contact-form__input` to theme transition group |
| `css/variables.css` | Add `--color-error`, `--color-error-bg`, `--color-success`, `--color-success-bg` |
| `js/main.js` | Add `initContactForm()` and supporting functions |
| `tests/pages/FormPage.js` | **New** — Page Object Model for form tests |
| `tests/form/validation.spec.js` | **New** — validation test suite |
| `tests/form/submission.spec.js` | **New** — submission test suite |
| `tests/form/accessibility.spec.js` | **New** — accessibility test suite |
| `tests/form/axe-scan.spec.js` | **New** — WCAG axe-core scanning |

## 5. Out of Scope

- reCAPTCHA (can be added later if spam becomes a problem)
- Subject/topic dropdown
- Phone field
- File attachments
- Auto-reply emails (Formspree paid feature)
- Contact form on 404.html
- Analytics/tracking on form submissions
