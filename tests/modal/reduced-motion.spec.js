import { test } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";

test.describe("Modal Reduced Motion", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.enableReducedMotion();
    await mp.goto();
  });

  test("modal opens without animation", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectOpen();
    await mp.expectTitle("rating_bot");
  });

  test("modal closes without animation", async () => {
    await mp.clickCard("rating-bot");
    await mp.clickClose();
    await mp.expectClosed();
  });

  test("focus management works with reduced motion", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectFocusOnClose();
    await mp.clickClose();
    await mp.expectDetailsBtnFocused("rating-bot");
  });
});
