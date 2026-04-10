import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import { waitForAnimationComplete } from "../utils/timing.js";

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

  test("interrupting animation mid-exit reaches correct state", async () => {
    // Start backend filter (don't wait for animation to complete)
    await fp.clickFilterNoWait("backend");
    // Wait for exit animation to actually start (DOM state, not timing)
    await expect(fp.exitingCards).not.toHaveCount(0);
    // Interrupt with a different filter
    await fp.clickFilterNoWait("iot");

    await waitForAnimationComplete(fp.page);

    // Second click should win
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectAllVisibleCardsAreCategory("iot");
  });

  test("rapid double-click on same filter triggers toggle-to-reset", async () => {
    // First click activates filter, second click triggers toggle-to-reset
    // With eager currentFilter update, this is deterministic: always resets to "all"
    await fp.clickFilterNoWait("iot");
    await fp.button("iot").click();
    await waitForAnimationComplete(fp.page);

    await fp.expectNoAnimationClasses();
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });

  test("no animation classes remain after rapid clicks", async () => {
    await fp.rapidClickFilters(["backend", "iot", "tools", "web", "all"]);

    await fp.expectNoAnimationClasses();
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
  });
});
