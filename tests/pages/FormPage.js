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

  /**
   * Mock Formspree with a deferred response. Returns a release function that
   * resolves the response when the test calls it. Use to assert intermediate
   * states (e.g., loading state) without a fixed-timeout race.
   *
   * Always call the returned release function before assertions that wait on
   * the response, otherwise the test will hang until Playwright's per-test
   * timeout fires.
   *
   * @param {{ status?: number, body?: object }} [options]
   * @returns {() => void} releaseRoute — call to send the response
   */
  async mockFormspreeDeferred({ status = 200, body = { ok: true } } = {}) {
    let releaseRoute;
    const released = new Promise((resolve) => { releaseRoute = resolve; });
    await this.page.route("**/formspree.io/f/*", async (route) => {
      await released;
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
    return releaseRoute;
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
}
