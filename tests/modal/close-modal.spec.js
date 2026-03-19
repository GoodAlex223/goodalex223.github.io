import { test } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";

test.describe("Close Modal", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
    await mp.clickCard("rating-bot");
  });

  test("closes via close button", async () => {
    await mp.clickClose();
    await mp.expectClosed();
  });

  test("closes via ESC key", async () => {
    await mp.pressEscape();
    await mp.expectClosed();
  });

  test("closes via backdrop click", async () => {
    await mp.clickBackdrop();
    await mp.expectClosed();
  });

  test("restores focus to details button after closing", async () => {
    await mp.clickClose();
    await mp.expectDetailsBtnFocused("rating-bot");
  });

  test("restores focus after ESC close", async () => {
    await mp.pressEscape();
    await mp.expectDetailsBtnFocused("rating-bot");
  });
});
