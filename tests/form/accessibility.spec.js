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

  test("error messages have role=status for polite announcements", async () => {
    await expect(fp.nameError).toHaveAttribute("role", "status");
    await expect(fp.emailError).toHaveAttribute("role", "status");
    await expect(fp.messageError).toHaveAttribute("role", "status");
  });

  test("status container has role=alert for assertive announcements", async () => {
    await expect(fp.statusContainer).toHaveAttribute("role", "alert");
  });

  test("honeypot is hidden from assistive technology", async () => {
    const honeypotContainer = fp.page.locator(".contact-form__honeypot");
    await expect(honeypotContainer).toHaveAttribute("aria-hidden", "true");
    await expect(honeypotContainer).toHaveAttribute("tabindex", "-1");
  });

  test("focus moves to first invalid field on submit", async () => {
    await fp.clickSubmit();
    await expect(fp.nameField).toBeFocused();
  });

  test("focus moves to second field when first is valid", async () => {
    await fp.fillName("Valid Name");
    await fp.clickSubmit();
    await expect(fp.emailField).toBeFocused();
  });

  test("form is keyboard navigable with Tab", async () => {
    await fp.nameField.focus();
    await fp.page.keyboard.press("Tab");
    await expect(fp.emailField).toBeFocused();

    await fp.page.keyboard.press("Tab");
    await expect(fp.messageField).toBeFocused();
  });
});
