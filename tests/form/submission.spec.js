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
