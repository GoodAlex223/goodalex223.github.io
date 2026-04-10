import { test } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import { waitForAnimationComplete } from "../utils/timing.js";

test.describe("Keyboard Navigation", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
    await fp.focusButton("all");
  });

  test("ArrowRight moves focus to next button", async () => {
    await fp.pressKey("ArrowRight");
    await fp.expectFocused("backend");
  });

  test("ArrowLeft moves focus to previous button", async () => {
    await fp.focusButton("backend");
    await fp.pressKey("ArrowLeft");
    await fp.expectFocused("all");
  });

  test("ArrowRight wraps from last to first", async () => {
    await fp.focusButton("tools");
    await fp.pressKey("ArrowRight");
    await fp.expectFocused("all");
  });

  test("ArrowLeft wraps from first to last", async () => {
    await fp.pressKey("ArrowLeft");
    await fp.expectFocused("tools");
  });

  test("ArrowDown moves focus forward", async () => {
    await fp.pressKey("ArrowDown");
    await fp.expectFocused("backend");
  });

  test("ArrowUp moves focus backward", async () => {
    await fp.focusButton("backend");
    await fp.pressKey("ArrowUp");
    await fp.expectFocused("all");
  });

  test("Home moves focus to first button", async () => {
    await fp.focusButton("tools");
    await fp.pressKey("Home");
    await fp.expectFocused("all");
  });

  test("End moves focus to last button", async () => {
    await fp.pressKey("End");
    await fp.expectFocused("tools");
  });

  test("Escape resets filter to all", async ({ page }) => {
    await fp.clickFilter("iot");
    await fp.focusButton("iot");

    await fp.pressKey("Escape");
    await waitForAnimationComplete(page);

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectFocused("all");
  });

  test("Escape does nothing when already on all", async () => {
    await fp.pressKey("Escape");
    await fp.expectActiveFilter("all");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
  });
});
