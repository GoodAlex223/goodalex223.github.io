import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import {
  getAnimationDuration,
  waitForFilterAnimation,
} from "../utils/timing.js";

test.describe("Rapid Click Handling", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
  });

  test("rapid sequential clicks reach correct final state", async () => {
    await fp.rapidClickFilters(["backend", "iot", "web", "tools"]);

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.tools);
    await fp.expectAllVisibleCardsAreCategory("tools");
    await fp.expectActiveFilter("tools");
    await fp.expectUrlHash("filter=tools");
  });

  test("interrupting animation mid-exit reaches correct state", async ({
    page,
  }) => {
    // Start backend filter (don't wait)
    await fp.clickFilterNoWait("backend");
    // Interrupt at ~30% through exit animation
    const duration = await getAnimationDuration(page);
    await page.waitForTimeout(Math.floor(duration * 0.3));
    await fp.clickFilterNoWait("iot");

    await waitForFilterAnimation(page);

    // Second click should win
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectAllVisibleCardsAreCategory("iot");
  });

  test("rapid double-click on same filter ends in consistent state", async () => {
    // Clicking same button twice rapidly: second click may re-apply filter
    // (if currentFilter hasn't updated yet) OR toggle-to-reset (if it has).
    // Both are valid — verify no broken intermediate state.
    await fp.clickFilterNoWait("iot");
    await fp.button("iot").click();
    await waitForFilterAnimation(fp.page);

    await fp.expectNoAnimationClasses();
    const count = await fp.getVisibleCardCount();
    expect([CATEGORY_COUNTS.iot, CATEGORY_COUNTS.all]).toContain(count);
  });

  test("no animation classes remain after rapid clicks", async () => {
    await fp.rapidClickFilters(["backend", "iot", "tools", "web", "all"]);

    await fp.expectNoAnimationClasses();
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
  });
});
