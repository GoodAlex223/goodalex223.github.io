# CHALLENGE-003: Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible contact form replacing the email mailto link, with Formspree integration, client-side validation, and inline success/error feedback.

**Architecture:** New CSS file (`css/form.css`) for form styles, new design tokens in `css/variables.css`, form HTML in the contact section of `index.html`, JS functions appended to `js/main.js`, and a full Playwright test suite with Page Object Model in `tests/form/`.

**Tech Stack:** HTML5 forms, CSS3 (custom properties, BEM), vanilla JS (Constraint Validation API, Fetch API), Formspree, Playwright + axe-core

**Spec:** `docs/superpowers/specs/2026-03-21_challenge-003-contact-form-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `css/variables.css` | Modify | Add `--color-error`, `--color-error-bg`, `--color-success`, `--color-success-bg` tokens |
| `css/form.css` | Create | All form styles: fields, labels, errors, status, honeypot, responsive, reduced-motion |
| `css/main.css` | Modify | Add `@import url("form.css")`, add `.contact-form__input` to theme transition group |
| `index.html` | Modify | Replace email `<li>` with `<form>` + status container; keep 4 social links |
| `js/main.js` | Modify | Add `initContactForm()` + validation/submission functions, call from DOMContentLoaded |
| `tests/pages/FormPage.js` | Create | Page Object Model: locators, actions, assertions for form tests |
| `tests/form/validation.spec.js` | Create | Required fields, email format, minlength, blur/submit validation, focus management |
| `tests/form/submission.spec.js` | Create | Formspree mock, success/error states, loading, honeypot, "Send another"/"Try again" |
| `tests/form/accessibility.spec.js` | Create | ARIA attrs, label association, focus management, keyboard nav, screen reader |
| `tests/form/axe-scan.spec.js` | Create | WCAG 2.1 AA scanning: default, errors, success, light, dark, reduced-motion |

---

## Task 1: Add Error/Success Design Tokens

**Files:**
- Modify: `css/variables.css:1-21` (dark theme `:root` block)
- Modify: `css/variables.css:131-148` (explicit `[data-theme="light"]` block)

- [ ] **Step 1: Add dark theme error/success tokens**

In `css/variables.css`, add after `--color-status-active-bg` (line 21):

```css
  /* Error colors */
  --color-error: #ef5350;
  --color-error-bg: rgb(239 83 80 / 0.1);

  /* Success colors (reuse status-active) */
  --color-success: var(--color-status-active);
  --color-success-bg: var(--color-status-active-bg);
```

- [ ] **Step 2: Add light theme error tokens**

In `css/variables.css`, inside the `[data-theme="light"]` block (after line 148), add:

```css
  /* Error colors adjusted for light backgrounds */
  --color-error: #c62828;
  --color-error-bg: rgb(198 40 40 / 0.08);
```

Also add inside the `@media (prefers-color-scheme: light)` block (after line 118), the same light error tokens:

```css
    /* Error colors adjusted for light backgrounds */
    --color-error: #c62828;
    --color-error-bg: rgb(198 40 40 / 0.08);
```

- [ ] **Step 3: Verify CSS linting passes**

Run: `npm run lint:css`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add css/variables.css
git commit -m "style: Add error and success color design tokens"
```

---

## Task 2: Create Form CSS

**Files:**
- Create: `css/form.css`
- Modify: `css/main.css:1-7` (import list)
- Modify: `css/main.css:12-22` (theme transition group)

- [ ] **Step 1: Create `css/form.css`**

```css
/* ===================
   CONTACT FORM
   =================== */

/* Form container */
.contact-form {
  max-width: 32rem;
  margin-inline: auto;
  margin-bottom: var(--space-6);
  text-align: left;
}

/* Honeypot - hidden from humans */
.contact-form__honeypot {
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  overflow: hidden;
}

/* Field wrapper */
.contact-form__field {
  margin-bottom: var(--space-5);
}

/* Labels */
.contact-form__label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

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
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast),
    outline-color var(--transition-fast);
}

.contact-form__input::placeholder {
  color: var(--color-text-muted);
}

.contact-form__input:focus-visible {
  border-color: var(--color-accent);
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}

/* Textarea modifier */
.contact-form__input--textarea {
  min-height: 8rem;
  resize: vertical;
}

/* Invalid state */
.contact-form__input--invalid {
  border-color: var(--color-error);
}

.contact-form__input--invalid:focus-visible {
  border-color: var(--color-error);
  outline-color: var(--color-error);
}

/* Error messages */
.contact-form__error {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

/* Submit button */
.contact-form__submit {
  width: 100%;
  justify-content: center;
}

/* Loading state */
.contact-form__submit[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Status container (success/error feedback) */
.contact-form__status {
  max-width: 32rem;
  margin-inline: auto;
  margin-bottom: var(--space-6);
  padding: var(--space-6);
  text-align: center;
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.contact-form__status:not([hidden]) {
  opacity: 1;
}

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
  font-size: var(--font-size-xl);
}

.contact-form__status--success .contact-form__status-icon {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.contact-form__status--error .contact-form__status-icon {
  background-color: var(--color-error-bg);
  color: var(--color-error);
}

/* Status message */
.contact-form__status-message {
  margin-bottom: var(--space-4);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

/* Status action button */
.contact-form__status-action {
  margin-inline: auto;
}

/* ===================
   REDUCED MOTION
   =================== */

@media (prefers-reduced-motion: reduce) {
  .contact-form__status {
    transition: none;
  }
}
```

- [ ] **Step 2: Add import to `css/main.css`**

Add after `@import url("modal.css");` (line 6):

```css
@import url("form.css");
```

- [ ] **Step 3: Add `.contact-form__input` to theme transition group**

In `css/main.css`, add `.contact-form__input` to the selector list (after `.contact__link`, line 16):

```css
body,
.site-header,
.project-card,
.skill-group,
.contact__link,
.contact-form__input {
```

- [ ] **Step 4: Verify CSS linting passes**

Run: `npm run lint:css`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add css/form.css css/main.css
git commit -m "style: Add contact form CSS with BEM naming"
```

---

## Task 3: Add Form HTML to Contact Section

**Files:**
- Modify: `index.html:552-613` (contact section)

- [ ] **Step 1: Replace email `<li>` and add form**

In `index.html`, replace the contact section content. Remove the email `<li>` (lines 559-567). Add the form and status container between `<p class="contact__intro">` and `<ul class="contact__links">`. Keep the 4 remaining social links (GitHub, LinkedIn, Telegram, Wokwi).

The form `action` should use a placeholder Formspree URL: `https://formspree.io/f/YOUR_FORM_ID` — the real form ID will be added when the Formspree account is set up.

Full replacement for lines 552-613:

```html
      <!-- Contact Section -->
      <section id="contact" class="contact section">
        <div class="container text-center">
          <h2 class="section__title" data-animate>Get in Touch</h2>
          <p class="contact__intro" data-animate data-animate-delay="50">Open to opportunities and collaborations.</p>

          <!-- Contact Form -->
          <form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID"
                method="POST" novalidate data-animate data-animate-delay="100">

            <!-- Honeypot (spam protection — hidden from humans) -->
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

          <ul class="contact__links">
            <li data-animate data-animate-delay="150">
              <a href="https://github.com/GoodAlex223" class="contact__link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>
            </li>
            <li data-animate data-animate-delay="200">
              <a href="https://www.linkedin.com/in/alexey-minakov-302457168" class="contact__link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
            </li>
            <li data-animate data-animate-delay="250">
              <a href="https://t.me/GoodAlex223" class="contact__link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 5L2 12.5l7 1M21 5l-2.5 15L9 13.5M21 5L9 13.5m0 0V19l3.249-3.277"/>
                </svg>
                Telegram
              </a>
            </li>
            <li data-animate data-animate-delay="300">
              <a href="https://wokwi.com/makers/goodalex223" class="contact__link" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                  <line x1="9" y1="1" x2="9" y2="4"/>
                  <line x1="15" y1="1" x2="15" y2="4"/>
                  <line x1="9" y1="20" x2="9" y2="23"/>
                  <line x1="15" y1="20" x2="15" y2="23"/>
                  <line x1="20" y1="9" x2="23" y2="9"/>
                  <line x1="20" y1="14" x2="23" y2="14"/>
                  <line x1="1" y1="9" x2="4" y2="9"/>
                  <line x1="1" y1="14" x2="4" y2="14"/>
                </svg>
                Wokwi
              </a>
            </li>
          </ul>
        </div>
      </section>
```

- [ ] **Step 2: Build to verify CSS + HTML work together**

Run: `npm run build`
Expected: Build succeeds, no errors

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: Add contact form HTML to contact section"
```

---

## Task 4: Implement Form JavaScript

**Files:**
- Modify: `js/main.js:2` (DOMContentLoaded init block)
- Modify: `js/main.js:1075` (append after `initProjectModal`)

- [ ] **Step 1: Add `initContactForm()` call to DOMContentLoaded**

In `js/main.js`, add after `initProjectModal();` (line 18):

```javascript
  // Initialize contact form
  initContactForm();
```

- [ ] **Step 2: Add contact form functions at end of file**

Append after the closing `}` of `initProjectModal()` (line 1075):

```javascript

/**
 * Contact Form
 * - Client-side validation with inline error messages
 * - Async Formspree submission with loading state
 * - Honeypot spam protection
 * - Inline success/error feedback
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusContainer = document.getElementById("contact-form-status");
  const submitButton = form.querySelector(".contact-form__submit");
  const submitText = form.querySelector(".contact-form__submit-text");
  const submitLoading = form.querySelector(".contact-form__submit-loading");
  const honeypot = form.querySelector("[name='_gotcha']");

  const fields = form.querySelectorAll(
    ".contact-form__input:not(.contact-form__honeypot input)"
  );

  // Validate on blur
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      // Only validate if field has been interacted with (has value or was touched)
      if (field.value.trim() !== "") {
        const result = validateField(field);
        if (!result.valid) {
          showFieldError(field, result.message);
        } else {
          clearFieldError(field);
        }
      }
    });

    // Clear error on input (while typing)
    field.addEventListener("input", () => {
      if (field.classList.contains("contact-form__input--invalid")) {
        const result = validateField(field);
        if (result.valid) {
          clearFieldError(field);
        }
      }
    });
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateForm(form)) return;

    // Honeypot check — silently "succeed" if bot filled it
    if (honeypot && honeypot.value) {
      showFormStatus(form, statusContainer, "success", "Thanks! I'll get back to you soon.");
      return;
    }

    // Disable submit, show loading
    submitButton.disabled = true;
    submitText.hidden = true;
    submitLoading.hidden = false;
    submitLoading.setAttribute("aria-hidden", "false");

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showFormStatus(form, statusContainer, "success", "Thanks! I'll get back to you soon.");
      } else {
        showFormStatus(form, statusContainer, "error", "Something went wrong. Please try again.");
      }
    } catch {
      showFormStatus(form, statusContainer, "error", "Something went wrong. Please try again.");
    } finally {
      // Re-enable submit
      submitButton.disabled = false;
      submitText.hidden = false;
      submitLoading.hidden = true;
      submitLoading.setAttribute("aria-hidden", "true");
    }
  });

  // Status action button (Send another / Try again)
  const actionButton = statusContainer.querySelector(".contact-form__status-action");
  actionButton.addEventListener("click", () => {
    resetForm(form, statusContainer);
  });
}

/**
 * Validate a single field
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @returns {{ valid: boolean, message: string }}
 */
function validateField(field) {
  const value = field.value.trim();
  const name = field.name;

  // Required check
  if (field.required && value === "") {
    const labels = { name: "your name", email: "your email address", message: "a message" };
    return { valid: false, message: `Please enter ${labels[name] || "this field"}` };
  }

  // Email format (using Constraint Validation API)
  if (field.type === "email" && value !== "" && field.validity.typeMismatch) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  // Minlength check
  const minlength = field.getAttribute("minlength");
  if (minlength && value.length < parseInt(minlength, 10)) {
    const fieldLabels = { name: "Name", message: "Message" };
    const label = fieldLabels[name] || "This field";
    return { valid: false, message: `${label} must be at least ${minlength} characters` };
  }

  return { valid: true, message: "" };
}

/**
 * Show inline error for a field
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @param {string} message
 */
function showFieldError(field, message) {
  field.classList.add("contact-form__input--invalid");
  field.setAttribute("aria-invalid", "true");

  const errorId = field.getAttribute("aria-describedby");
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = false;
  }
}

/**
 * Clear inline error for a field
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 */
function clearFieldError(field) {
  field.classList.remove("contact-form__input--invalid");
  field.removeAttribute("aria-invalid");

  const errorId = field.getAttribute("aria-describedby");
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.hidden = true;
  }
}

/**
 * Validate all form fields, focus first invalid
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  const fields = form.querySelectorAll(
    ".contact-form__input:not(.contact-form__honeypot input)"
  );
  let firstInvalid = null;

  fields.forEach((field) => {
    const result = validateField(field);
    if (!result.valid) {
      showFieldError(field, result.message);
      if (!firstInvalid) firstInvalid = field;
    } else {
      clearFieldError(field);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }

  return true;
}

/**
 * Show success or error status, hide form
 * @param {HTMLFormElement} form
 * @param {HTMLElement} statusContainer
 * @param {"success"|"error"} type
 * @param {string} message
 */
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
}

/**
 * Reset form and show it again, hide status
 * @param {HTMLFormElement} form
 * @param {HTMLElement} statusContainer
 */
function resetForm(form, statusContainer) {
  // Hide status
  statusContainer.hidden = true;

  // Reset form fields and errors
  form.reset();
  const fields = form.querySelectorAll(".contact-form__input--invalid");
  fields.forEach((field) => clearFieldError(field));

  // Show form
  form.hidden = false;
}
```

- [ ] **Step 3: Verify JS linting passes**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 4: Build to verify everything works together**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add js/main.js
git commit -m "feat: Add contact form JS with validation and submission"
```

---

## Task 5: Create FormPage Page Object Model

**Files:**
- Create: `tests/pages/FormPage.js`

- [ ] **Step 1: Create the Page Object Model**

```javascript
/**
 * Page Object Model for the contact form.
 * Encapsulates all form-related locators and actions.
 */
import { expect } from "@playwright/test";

export class FormPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Form elements
    this.form = page.locator("#contact-form");
    this.nameField = page.locator("#contact-name");
    this.emailField = page.locator("#contact-email");
    this.messageField = page.locator("#contact-message");
    this.honeypot = page.locator("#contact-phone");
    this.submitButton = page.locator(".contact-form__submit");
    this.submitText = page.locator(".contact-form__submit-text");
    this.submitLoading = page.locator(".contact-form__submit-loading");

    // Error elements
    this.nameError = page.locator("#contact-name-error");
    this.emailError = page.locator("#contact-email-error");
    this.messageError = page.locator("#contact-message-error");

    // Status elements
    this.statusContainer = page.locator("#contact-form-status");
    this.statusIcon = page.locator(".contact-form__status-icon");
    this.statusMessage = page.locator(".contact-form__status-message");
    this.statusAction = page.locator(".contact-form__status-action");

    // Labels
    this.nameLabel = page.locator('label[for="contact-name"]');
    this.emailLabel = page.locator('label[for="contact-email"]');
    this.messageLabel = page.locator('label[for="contact-message"]');
  }

  // ── Navigation ──────────────────────────────────────────

  async goto() {
    await this.page.goto("/");
    // Wait for JS to initialize (filter button labels with counts)
    await expect(this.page.locator(".filter-btn").first()).toContainText("(");
  }

  // ── Actions ──────────────────────────────────────────────

  async fillName(value) {
    await this.nameField.fill(value);
  }

  async fillEmail(value) {
    await this.emailField.fill(value);
  }

  async fillMessage(value) {
    await this.messageField.fill(value);
  }

  async fillAllFields({ name = "Test User", email = "test@example.com", message = "Hello, this is a test message." } = {}) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillMessage(message);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickStatusAction() {
    await this.statusAction.click();
  }

  async blurField(field) {
    await field.blur();
  }

  // ── Formspree Mocking ────────────────────────────────────

  async mockFormspreeSuccess() {
    await this.page.route("**/formspree.io/f/*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
  }

  async mockFormspreeError(statusCode = 500) {
    await this.page.route("**/formspree.io/f/*", (route) => {
      route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });
  }

  async mockFormspreeNetworkError() {
    await this.page.route("**/formspree.io/f/*", (route) => {
      route.abort("connectionrefused");
    });
  }

  // ── Assertions ───────────────────────────────────────────

  async expectFieldError(errorLocator, message) {
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(message);
  }

  async expectNoFieldError(errorLocator) {
    await expect(errorLocator).toBeHidden();
  }

  async expectFieldInvalid(fieldLocator) {
    await expect(fieldLocator).toHaveAttribute("aria-invalid", "true");
    await expect(fieldLocator).toHaveClass(/contact-form__input--invalid/);
  }

  async expectFieldValid(fieldLocator) {
    await expect(fieldLocator).not.toHaveAttribute("aria-invalid");
    await expect(fieldLocator).not.toHaveClass(/contact-form__input--invalid/);
  }

  async expectFormVisible() {
    await expect(this.form).toBeVisible();
  }

  async expectFormHidden() {
    await expect(this.form).toBeHidden();
  }

  async expectSuccess(message = "Thanks! I'll get back to you soon.") {
    await expect(this.statusContainer).toBeVisible();
    await expect(this.statusMessage).toHaveText(message);
    await expect(this.statusContainer).toHaveClass(/contact-form__status--success/);
    await expect(this.statusAction).toHaveText("Send another message");
  }

  async expectError(message = "Something went wrong. Please try again.") {
    await expect(this.statusContainer).toBeVisible();
    await expect(this.statusMessage).toHaveText(message);
    await expect(this.statusContainer).toHaveClass(/contact-form__status--error/);
    await expect(this.statusAction).toHaveText("Try again");
  }

  async expectSubmitDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectLoadingState() {
    await expect(this.submitText).toBeHidden();
    await expect(this.submitLoading).toBeVisible();
  }

  // ── Media & Theme Helpers ────────────────────────────────

  async enableReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  async setTheme(theme) {
    await this.page.evaluate(
      (t) => document.documentElement.setAttribute("data-theme", t),
      theme,
    );
    // Wait for CSS transitions to settle
    await this.page.waitForTimeout(400);
  }

  async waitForScrollAnimations() {
    // Wait for scroll-in animations to settle (prevents false axe failures)
    await this.page.waitForTimeout(700);
  }
}
```

- [ ] **Step 2: Verify JS linting passes**

Run: `npm run lint:js`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/pages/FormPage.js
git commit -m "test: Add FormPage Page Object Model for contact form"
```

---

## Task 6: Write Validation Tests

**Files:**
- Create: `tests/form/validation.spec.js`

- [ ] **Step 1: Create the validation test suite**

```javascript
import { test } from "@playwright/test";
import { FormPage } from "../pages/FormPage.js";

test.describe("Form Validation", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FormPage(page);
    await fp.goto();
  });

  test("shows error when submitting empty form", async () => {
    await fp.clickSubmit();
    await fp.expectFieldError(fp.nameError, "Please enter your name");
    await fp.expectFieldError(fp.emailError, "Please enter your email address");
    await fp.expectFieldError(fp.messageError, "Please enter a message");
  });

  test("focuses first invalid field on submit", async ({ page }) => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    const focused = await page.evaluate(() => document.activeElement.id);
    test.expect(focused).toBe("contact-name");
  });

  test("shows error for name too short", async () => {
    await fp.fillName("A");
    await fp.blurField(fp.nameField);
    await fp.expectFieldError(fp.nameError, "Name must be at least 2 characters");
  });

  test("shows error for invalid email", async () => {
    await fp.fillEmail("not-an-email");
    await fp.blurField(fp.emailField);
    await fp.expectFieldError(fp.emailError, "Please enter a valid email address");
  });

  test("shows error for message too short", async () => {
    await fp.fillMessage("Hi");
    await fp.blurField(fp.messageField);
    await fp.expectFieldError(fp.messageError, "Message must be at least 10 characters");
  });

  test("clears error when field becomes valid", async () => {
    await fp.fillName("A");
    await fp.blurField(fp.nameField);
    await fp.expectFieldError(fp.nameError, "Name must be at least 2 characters");

    await fp.fillName("Alex");
    await fp.expectNoFieldError(fp.nameError);
    await fp.expectFieldValid(fp.nameField);
  });

  test("does not validate empty fields on blur (only after interaction)", async () => {
    await fp.nameField.focus();
    await fp.blurField(fp.nameField);
    await fp.expectNoFieldError(fp.nameError);
  });

  test("validates all fields on submit even without prior interaction", async () => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    await fp.expectFieldInvalid(fp.emailField);
    await fp.expectFieldInvalid(fp.messageField);
  });

  test("accepts valid form data without errors", async () => {
    await fp.fillAllFields();
    await fp.blurField(fp.messageField);
    await fp.expectNoFieldError(fp.nameError);
    await fp.expectNoFieldError(fp.emailError);
    await fp.expectNoFieldError(fp.messageError);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx playwright test tests/form/validation.spec.js`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/form/validation.spec.js
git commit -m "test: Add contact form validation tests"
```

---

## Task 7: Write Submission Tests

**Files:**
- Create: `tests/form/submission.spec.js`

- [ ] **Step 1: Create the submission test suite**

```javascript
import { test } from "@playwright/test";
import { FormPage } from "../pages/FormPage.js";

test.describe("Form Submission", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FormPage(page);
    await fp.goto();
  });

  test("shows success message after successful submission", async () => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectFormHidden();
    await fp.expectSuccess();
  });

  test("shows error message after failed submission", async () => {
    await fp.mockFormspreeError(500);
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectFormHidden();
    await fp.expectError();
  });

  test("shows error message on network failure", async () => {
    await fp.mockFormspreeNetworkError();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectFormHidden();
    await fp.expectError();
  });

  test("shows loading state during submission", async () => {
    // Use a delayed route to observe loading state
    await fp.page.route("**/formspree.io/f/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectLoadingState();
    await fp.expectSubmitDisabled();

    // Wait for response
    await fp.expectSuccess();
    await fp.expectSubmitEnabled();
  });

  test("honeypot silently succeeds without sending", async ({ page }) => {
    let requestMade = false;
    await page.route("**/formspree.io/f/*", () => {
      requestMade = true;
    });

    await fp.fillAllFields();
    // Fill honeypot (bots would do this)
    await fp.honeypot.evaluate((el) => { el.value = "spam-bot"; });
    await fp.clickSubmit();

    await fp.expectSuccess();
    test.expect(requestMade).toBe(false);
  });

  test("Send another message resets to form", async () => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();

    await fp.clickStatusAction();
    await fp.expectFormVisible();
  });

  test("Try again resets to form after error", async () => {
    await fp.mockFormspreeError(500);
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectError();

    await fp.clickStatusAction();
    await fp.expectFormVisible();
  });

  test("does not submit when validation fails", async ({ page }) => {
    let requestMade = false;
    await page.route("**/formspree.io/f/*", () => {
      requestMade = true;
    });

    await fp.clickSubmit();
    test.expect(requestMade).toBe(false);
    await fp.expectFormVisible();
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx playwright test tests/form/submission.spec.js`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/form/submission.spec.js
git commit -m "test: Add contact form submission tests with Formspree mocking"
```

---

## Task 8: Write Accessibility Tests

**Files:**
- Create: `tests/form/accessibility.spec.js`

- [ ] **Step 1: Create the accessibility test suite**

```javascript
import { test, expect } from "@playwright/test";
import { FormPage } from "../pages/FormPage.js";

test.describe("Form Accessibility", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FormPage(page);
    await fp.goto();
  });

  test("all fields have associated labels", async () => {
    await expect(fp.nameLabel).toHaveAttribute("for", "contact-name");
    await expect(fp.emailLabel).toHaveAttribute("for", "contact-email");
    await expect(fp.messageLabel).toHaveAttribute("for", "contact-message");
  });

  test("fields have aria-describedby pointing to error elements", async () => {
    await expect(fp.nameField).toHaveAttribute("aria-describedby", "contact-name-error");
    await expect(fp.emailField).toHaveAttribute("aria-describedby", "contact-email-error");
    await expect(fp.messageField).toHaveAttribute("aria-describedby", "contact-message-error");
  });

  test("invalid fields get aria-invalid attribute", async () => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    await fp.expectFieldInvalid(fp.emailField);
    await fp.expectFieldInvalid(fp.messageField);
  });

  test("aria-invalid is removed when field becomes valid", async () => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);

    await fp.fillName("Valid Name");
    await fp.expectFieldValid(fp.nameField);
  });

  test("error messages have role=alert and aria-live", async () => {
    await expect(fp.nameError).toHaveAttribute("role", "alert");
    await expect(fp.nameError).toHaveAttribute("aria-live", "polite");
    await expect(fp.emailError).toHaveAttribute("role", "alert");
    await expect(fp.messageError).toHaveAttribute("role", "alert");
  });

  test("status container has role=alert and aria-live", async () => {
    await expect(fp.statusContainer).toHaveAttribute("role", "alert");
    await expect(fp.statusContainer).toHaveAttribute("aria-live", "polite");
  });

  test("honeypot is hidden from assistive technology", async () => {
    const honeypotContainer = fp.page.locator(".contact-form__honeypot");
    await expect(honeypotContainer).toHaveAttribute("aria-hidden", "true");
    await expect(honeypotContainer).toHaveAttribute("tabindex", "-1");
  });

  test("focus moves to first invalid field on submit", async ({ page }) => {
    await fp.clickSubmit();
    const focusedId = await page.evaluate(() => document.activeElement.id);
    expect(focusedId).toBe("contact-name");
  });

  test("focus moves to second field when first is valid", async ({ page }) => {
    await fp.fillName("Valid Name");
    await fp.clickSubmit();
    const focusedId = await page.evaluate(() => document.activeElement.id);
    expect(focusedId).toBe("contact-email");
  });

  test("form is keyboard navigable with Tab", async ({ page }) => {
    await fp.nameField.focus();
    await page.keyboard.press("Tab");
    const secondFocused = await page.evaluate(() => document.activeElement.id);
    expect(secondFocused).toBe("contact-email");

    await page.keyboard.press("Tab");
    const thirdFocused = await page.evaluate(() => document.activeElement.id);
    expect(thirdFocused).toBe("contact-message");
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx playwright test tests/form/accessibility.spec.js`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/form/accessibility.spec.js
git commit -m "test: Add contact form accessibility tests"
```

---

## Task 9: Write Axe-Core WCAG Scan Tests

**Files:**
- Create: `tests/form/axe-scan.spec.js`

- [ ] **Step 1: Create the axe-scan test suite**

```javascript
import { test } from "@playwright/test";
import { FormPage } from "../pages/FormPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";

test.describe("Form WCAG Scan", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FormPage(page);
    await fp.goto();
    await fp.waitForScrollAnimations();
  });

  test("passes axe scan in default state", async ({ page }) => {
    await checkAccessibility(page);
  });

  test("passes axe scan with validation errors visible", async ({ page }) => {
    await fp.clickSubmit();
    await checkAccessibility(page);
  });

  test("passes axe scan in success state", async ({ page }) => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();
    await checkAccessibility(page);
  });

  test("passes axe scan in error state", async ({ page }) => {
    await fp.mockFormspreeError();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectError();
    await checkAccessibility(page);
  });

  test("passes axe scan with explicit light theme", async ({ page }) => {
    await fp.setTheme("light");
    await checkAccessibility(page);
  });

  test("passes axe scan with explicit dark theme", async ({ page }) => {
    await fp.setTheme("dark");
    await checkAccessibility(page);
  });

  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.page.goto("/");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx playwright test tests/form/axe-scan.spec.js`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/form/axe-scan.spec.js
git commit -m "test: Add contact form WCAG 2.1 AA axe-core scanning"
```

---

## Task 10: Update ESLint Config for FormPage POM

**Files:**
- Modify: `eslint.config.js` — update `assertFunctionNames` to include FormPage assertion methods

- [ ] **Step 1: Read current assertFunctionNames list**

Check the existing `assertFunctionNames` array in `eslint.config.js` to see the current POM methods listed. Note the format: bare method names without object prefix (e.g., `"expectVisibleCardCount"`, not `"fp.expectVisibleCardCount"`).

- [ ] **Step 2: Add FormPage assertion method names**

Add these bare method names to the `assertFunctionNames` array (alphabetically sorted, matching existing convention):

```
"expectError",
"expectFieldError",
"expectFieldInvalid",
"expectFieldValid",
"expectFormHidden",
"expectFormVisible",
"expectLoadingState",
"expectNoFieldError",
"expectSubmitDisabled",
"expectSubmitEnabled",
"expectSuccess",
```

- [ ] **Step 3: Verify linting passes**

Run: `npm run lint:js`
Expected: No errors, no `expect-expect` warnings for form tests

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js
git commit -m "build: Add FormPage assertion methods to ESLint config"
```

---

## Task 11: Run Full Test Suite and Lint

**Files:** None (verification only)

- [ ] **Step 1: Run full lint**

Run: `npm run lint`
Expected: No errors from CSS or JS linting

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass (existing + new form tests)

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds, size budgets met

- [ ] **Step 4: Fix any failures**

If tests or lint fail, fix the issues and re-run. Commit fixes individually.

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: Address test/lint issues from full suite run"
```

(Skip this step if no fixes were needed.)
