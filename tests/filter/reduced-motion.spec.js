import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";

test.describe("Reduced Motion Accessibility", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    // Enable reduced motion BEFORE navigation so CSS media query
    // is active when page loads (initScrollAnimations early-exits)
    await fp.enableReducedMotion();
    await fp.goto();
  });

  // ── Element Visibility ──────────────────────────────────────────────────

  test("all [data-animate] elements are visible, not stuck at opacity 0", async ({
    page,
  }) => {
    const elements = await page.locator("[data-animate]").all();
    expect(elements.length).toBeGreaterThan(0);

    for (const el of elements) {
      const opacity = await el.evaluate(
        (node) => getComputedStyle(node).opacity,
      );
      expect(Number(opacity)).toBe(1);
    }
  });

  // ── Filter Functionality ────────────────────────────────────────────────

  test("filters projects correctly without animations", async () => {
    await fp.clickFilterNoWait("iot");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectAllVisibleCardsAreCategory("iot");
    await fp.expectActiveFilter("iot");
    await fp.expectUrlHash("filter=iot");
    await fp.expectNoAnimationClasses();
  });

  test("toggle-to-reset works without animations", async () => {
    await fp.clickFilterNoWait("iot");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);

    await fp.clickFilterNoWait("iot");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
    await fp.expectNoAnimationClasses();
  });

  test("URL hash filter works without animations", async ({ page }) => {
    await page.goto("/#filter=tools");
    // Wait for JS to initialize (button labels with counts)
    await expect(fp.filterButtons.first()).toContainText("(");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.tools);
    await fp.expectActiveFilter("tools");
    await fp.expectNoAnimationClasses();
  });

  // ── Axe-Core Scanning ──────────────────────────────────────────────────

  test("page load passes WCAG 2.1 AA with reduced motion", async ({
    page,
  }) => {
    await checkAccessibility(page);
  });

  test("active filter passes WCAG 2.1 AA with reduced motion", async ({
    page,
  }) => {
    await fp.clickFilter("iot");
    await checkAccessibility(page);
  });

  // ── Theme-specific scans under reduced motion ──────────────────────────
  // Reduced motion + theme is a unique CSS state combination.
  // Explicit theme testing prevents cross-state regressions.

  test.describe("Light theme", () => {
    test.beforeEach(async () => {
      await fp.setTheme("light");
    });

    test("passes WCAG 2.1 AA with reduced motion", async ({ page }) => {
      await checkAccessibility(page);
    });
  });

  test.describe("Dark theme", () => {
    test.beforeEach(async () => {
      await fp.setTheme("dark");
    });

    test("passes WCAG 2.1 AA with reduced motion", async ({ page }) => {
      await checkAccessibility(page);
    });
  });
});
