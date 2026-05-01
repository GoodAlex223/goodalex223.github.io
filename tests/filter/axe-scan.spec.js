import { test } from "@playwright/test";
import { FilterPage } from "../pages/FilterPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";
import { waitForAnimationComplete } from "../utils/timing.js";

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
    await waitForAnimationComplete(page);
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

  // ── Theme-specific WCAG AA scans ─────────────────────────────────────────
  // Explicit theme testing prevents color contrast regressions that are
  // invisible when tests only run in the browser's default theme.
  // Found 4 light-theme violations in TEST-002 that motivated this coverage.

  test.describe("Light theme", () => {
    test.beforeEach(async () => {
      await fp.setTheme("light");
    });

    test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
      await checkAccessibility(page);
    });

    test("active filter passes WCAG 2.1 AA", async ({ page }) => {
      await fp.clickFilter("iot");
      await fp.waitForScrollAnimations();
      await checkAccessibility(page);
    });
  });

  test.describe("Dark theme", () => {
    test.beforeEach(async () => {
      await fp.setTheme("dark");
    });

    test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
      await checkAccessibility(page);
    });

    test("active filter passes WCAG 2.1 AA", async ({ page }) => {
      await fp.clickFilter("iot");
      await fp.waitForScrollAnimations();
      await checkAccessibility(page);
    });
  });

  // ── Reduced motion WCAG AA scans ──────────────────────────────────────
  // Verify page remains accessible with prefers-reduced-motion enabled.
  // No waitForScrollAnimations() — animations are disabled under reduced motion.

  test.describe("Reduced motion", () => {
    test.beforeEach(async () => {
      await fp.enableReducedMotion();
      await fp.goto();
    });

    test("initial page load passes WCAG 2.1 AA", async ({ page }) => {
      await checkAccessibility(page);
    });

    test("active filter passes WCAG 2.1 AA", async ({ page }) => {
      await fp.clickFilter("iot");
      // WebKit-Linux race: after `--active` class swap, axe color-contrast
      // briefly samples interpolated colors between the two affected buttons.
      // setTheme() pins data-theme + waits 400ms, letting style computation settle.
      await fp.setTheme("light");
      await checkAccessibility(page);
    });
  });
});
