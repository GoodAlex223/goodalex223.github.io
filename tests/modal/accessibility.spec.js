import { test, expect } from "@playwright/test";
import { ModalPage, PROJECTS_WITH_DETAILS } from "../pages/ModalPage.js";

test.describe("Modal Accessibility", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
  });

  test("modal has correct ARIA attributes", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectAriaModal();
    await mp.expectAriaLabelledBy();
  });

  test("details buttons have aria-haspopup=dialog", async () => {
    for (const projectId of PROJECTS_WITH_DETAILS) {
      await mp.expectDetailsButtonAccessibility(projectId);
    }
  });

  test("focus moves to close button on open", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectFocusOnClose();
  });

  // Focus trap Tab behavior varies across browser engines;
  // WebKit and Firefox have platform-specific tab focus order quirks.
  test("focus trap: Tab keeps focus within modal dialog", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "Tab focus behavior varies across browsers");

    await mp.clickCard("rating-bot");

    // Close button should be focused first
    await mp.expectFocusOnClose();

    // Tab through all focusable elements + 1 to test wrapping
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableCount = await mp.dialog.locator(focusableSelector).count();

    expect(focusableCount).toBeGreaterThan(1);

    // Tab through all elements and verify focus stays within dialog
    for (let i = 0; i < focusableCount + 1; i++) {
      await mp.pressTab();
      await expect(mp.dialog.locator(':focus')).toHaveCount(1);
    }
  });

  // Focus trap Tab/Shift+Tab behavior varies across browser engines;
  // WebKit and Firefox have platform-specific tab focus order quirks.
  test("focus trap: Shift+Tab wraps from first to last", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "Tab focus behavior varies across browsers");
    await mp.clickCard("rating-bot");
    await mp.expectFocusOnClose();

    // Shift+Tab from close button (first) should wrap to last focusable
    await mp.pressShiftTab();

    // Should be on the last focusable element (a link)
    await expect(mp.dialog.locator('a:focus')).toHaveCount(1);
  });

  test("details button opens modal on click", async ({ page }) => {
    const detailsBtn = page.locator('[data-project="rating-bot"] .project-card__details-btn');
    await detailsBtn.click();
    await mp.expectOpen();
    await mp.expectTitle("rating_bot");
  });
});
