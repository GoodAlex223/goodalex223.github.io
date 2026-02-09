import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";
import { waitForFilterAnimation } from "../utils/timing.js";

test.describe("URL Hash Integration", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
  });

  test("loads with hash filter applied on page load", async ({ page }) => {
    await fp.gotoWithHash("backend");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.backend);
    await fp.expectActiveFilter("backend");
    await fp.expectButtonPressed("backend", true);
  });

  test("invalid hash defaults to showing all", async ({ page }) => {
    await fp.gotoWithHash("invalid");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
  });

  test("updates URL hash when filter is clicked", async ({ page }) => {
    await fp.goto();
    await fp.clickFilter("tools");

    await fp.expectUrlHash("filter=tools");
  });

  test("clears hash when reset to all", async ({ page }) => {
    await fp.goto();
    await fp.clickFilter("web");
    await fp.expectUrlHash("filter=web");

    await fp.clickFilter("all");
    await fp.expectUrlHash("");
  });

  test("browser back restores previous filter", async ({ page }) => {
    await fp.goto();
    await fp.clickFilter("iot");
    await fp.clickFilter("web");

    await page.goBack();
    await waitForFilterAnimation(page);

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectActiveFilter("iot");
    await fp.expectUrlHash("filter=iot");
  });

  test("browser forward restores next filter", async ({ page }) => {
    await fp.goto();
    await fp.clickFilter("iot");
    await fp.clickFilter("web");

    await page.goBack();
    await waitForFilterAnimation(page);

    await page.goForward();
    await waitForFilterAnimation(page);

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.web);
    await fp.expectActiveFilter("web");
  });
});
