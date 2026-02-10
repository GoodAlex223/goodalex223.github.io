import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import {
  getAnimationDuration,
  waitForFilterAnimation,
} from "../utils/timing.js";

test.describe("Animation States", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
  });

  test("applies filtering-out class during exit phase", async () => {
    await fp.clickFilterNoWait("backend");

    // Poll rapidly to catch the transient exit animation class
    await expect
      .poll(() => fp.exitingCards.count(), { intervals: [50], timeout: 2000 })
      .toBeGreaterThan(0);
  });

  test("applies filtering-in class during entrance phase", async () => {
    await fp.clickFilterNoWait("iot");

    // Poll rapidly to catch the transient entrance animation class
    await expect
      .poll(() => fp.enteringCards.count(), { intervals: [50], timeout: 3000 })
      .toBeGreaterThan(0);
  });

  test("removes all animation classes after completion", async () => {
    await fp.clickFilter("backend");

    await fp.expectNoAnimationClasses();
  });

  test("adds is-visible class to cards after filter animation", async ({
    page,
  }) => {
    await fp.clickFilter("iot");

    const visibleWithClass = page.locator(
      ".project-card.is-visible:not(.project-card--hidden)",
    );
    const count = await visibleWithClass.count();
    expect(count).toBeGreaterThan(0);
  });

  test("hidden cards use position absolute and visibility hidden", async ({
    page,
  }) => {
    await fp.clickFilter("backend");

    const hidden = fp.hiddenCards.first();
    await expect(hidden).toHaveCSS("position", "absolute");
    await expect(hidden).toHaveCSS("visibility", "hidden");
  });

  test("skips animations with prefers-reduced-motion", async () => {
    await fp.enableReducedMotion();
    await fp.goto();

    await fp.button("backend").click();

    // Should be instant — Playwright auto-waits for DOM assertions
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.backend);
    await fp.expectNoAnimationClasses();
  });
});
