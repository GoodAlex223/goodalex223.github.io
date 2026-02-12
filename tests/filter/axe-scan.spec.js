import { test } from "@playwright/test";
import { FilterPage } from "../pages/FilterPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";
import { waitForFilterAnimation } from "../utils/timing.js";

test.describe("Accessibility Scanning (Axe-Core)", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
    await fp.waitForScrollAnimations();
  });

  test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
    await checkAccessibility(page);
  });

  test("page remains accessible after backend filter", async ({ page }) => {
    await fp.clickFilter("backend");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible after IoT filter", async ({ page }) => {
    await fp.clickFilter("iot");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible after web filter", async ({ page }) => {
    await fp.clickFilter("web");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible after tools filter", async ({ page }) => {
    await fp.clickFilter("tools");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible after toggle-to-reset", async ({ page }) => {
    await fp.clickFilter("iot");
    await fp.clickFilter("iot");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible after keyboard navigation", async ({
    page,
  }) => {
    await fp.focusButton("all");
    await fp.pressKey("ArrowRight");
    await fp.pressKey("Enter");
    await waitForFilterAnimation(page);
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });

  test("page remains accessible with URL hash navigation", async ({
    page,
  }) => {
    await fp.gotoWithHash("tools");
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
});
