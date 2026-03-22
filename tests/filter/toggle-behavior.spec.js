import { test } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";

test.describe("Toggle-to-Reset Behavior", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
  });

  test("clicking active category filter resets to all", async () => {
    await fp.clickFilter("iot");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);

    // Click IoT again → should reset to "all"
    await fp.clickFilter("iot");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });

  test("clicking All when already on All does nothing", async () => {
    await fp.expectActiveFilter("all");
    await fp.clickFilter("all");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
  });

  test("toggle-to-reset moves focus to All button", async () => {
    await fp.clickFilter("backend");
    await fp.clickFilter("backend"); // Toggle reset
    await fp.expectFocused("all");
  });

  test("toggle-to-reset works during animation", async () => {
    // Click IoT without waiting for animation to complete
    await fp.clickFilterNoWait("iot");
    // Immediately click IoT again (toggle-to-reset during animation)
    await fp.clickFilter("iot");

    // Should have reset to "all" even though first animation was in progress
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });
});
