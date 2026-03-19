import { test } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";

test.describe("Modal URL Hash", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
  });

  test("updates URL hash when modal opens", async () => {
    await mp.goto();
    await mp.clickCard("rating-bot");
    await mp.expectUrlHash("project=rating-bot");
  });

  test("removes URL hash when modal closes", async () => {
    await mp.goto();
    await mp.clickCard("rating-bot");
    await mp.clickClose();
    await mp.expectUrlHash("");
  });

  test("opens modal from URL hash on page load", async () => {
    await mp.gotoWithProjectHash("rating-bot");
    await mp.expectTitle("rating_bot");
  });

  test("opens modal from URL hash for rule-indicators", async () => {
    await mp.gotoWithProjectHash("rule-indicators");
    await mp.expectTitle("Industrial Rule Indicators");
  });

  test("opens modal from URL hash for media-viewer", async () => {
    await mp.gotoWithProjectHash("media-viewer");
    await mp.expectTitle("Media Viewer");
  });

  test("does not open modal for invalid project hash", async ({ page }) => {
    await page.goto("/#project=nonexistent");
    // Wait for JS to initialize
    const mp2 = new ModalPage(page);
    await page.waitForTimeout(500);
    await mp2.expectClosed();
  });

  test("does not interfere with filter hash", async ({ page }) => {
    await page.goto("/#filter=backend");
    const mp2 = new ModalPage(page);
    await page.waitForTimeout(500);
    await mp2.expectClosed();
  });

  test("browser back closes modal", async ({ page }) => {
    await mp.goto();
    await mp.clickCard("rating-bot");
    await mp.expectOpen();

    await page.goBack();
    await mp.expectClosed();
  });
});
