import { test, expect } from "@playwright/test";
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

  test("focuses first invalid field on submit", async () => {
    await fp.clickSubmit();
    await fp.expectFieldInvalid(fp.nameField);
    await expect(fp.nameField).toBeFocused();
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
