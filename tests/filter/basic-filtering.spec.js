import { test } from "@playwright/test";
import { FilterPage, CATEGORY_COUNTS } from "../pages/FilterPage.js";

test.describe("Basic Filtering", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
  });

  test("shows all 7 projects by default", async () => {
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.all);
    await fp.expectActiveFilter("all");
    await fp.expectUrlHash("");
  });

  test("filters to 1 backend project", async () => {
    await fp.clickFilter("backend");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.backend);
    await fp.expectAllVisibleCardsAreCategory("backend");
    await fp.expectActiveFilter("backend");
    await fp.expectUrlHash("filter=backend");
  });

  test("filters to 3 IoT projects", async () => {
    await fp.clickFilter("iot");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);
    await fp.expectAllVisibleCardsAreCategory("iot");
    await fp.expectActiveFilter("iot");
    await fp.expectUrlHash("filter=iot");
  });

  test("filters to 1 web project", async () => {
    await fp.clickFilter("web");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.web);
    await fp.expectAllVisibleCardsAreCategory("web");
    await fp.expectActiveFilter("web");
    await fp.expectUrlHash("filter=web");
  });

  test("filters to 2 tools projects", async () => {
    await fp.clickFilter("tools");

    await fp.expectVisibleCardCount(CATEGORY_COUNTS.tools);
    await fp.expectAllVisibleCardsAreCategory("tools");
    await fp.expectActiveFilter("tools");
    await fp.expectUrlHash("filter=tools");
  });

  test("switching between categories shows correct cards", async () => {
    await fp.clickFilter("iot");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.iot);

    await fp.clickFilter("backend");
    await fp.expectVisibleCardCount(CATEGORY_COUNTS.backend);
    await fp.expectAllVisibleCardsAreCategory("backend");
  });
});
