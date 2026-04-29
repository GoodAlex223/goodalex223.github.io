import { test, expect } from "@playwright/test";
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
    // Deferred-promise route control: response is held until the test
    // releases it, so loading-state assertions have unbounded time to land.
    // Replaces the previous fixed 500ms setTimeout that flaked on WebKit
    // when click→assert overhead exceeded the response window.
    const releaseRoute = await fp.mockFormspreeDeferred();

    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectLoadingState();
    await fp.expectSubmitDisabled();

    releaseRoute();

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
    expect(requestMade).toBe(false);
  });

  test("Send another message resets to form", async () => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();

    await fp.clickStatusAction();
    await fp.expectFormVisible();
  });

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
    expect(requestMade).toBe(false);
    await fp.expectFormVisible();
  });
});
