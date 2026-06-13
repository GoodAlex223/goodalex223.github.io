import { test, expect } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";
import { waitForAnimationComplete } from "../utils/timing.js";

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
    // The hash-open path fetches projects.json even for invalid IDs — the
    // ID is validated only AFTER the fetch (js/main.js fetches, then checks
    // data[projectId]). Waiting for that response to finish replaces the
    // old fixed 500ms with the actual causal chain: once the fetch is done
    // and init has completed, a modal that was going to open would be open.
    // Promise.all registers the response listener before navigation fires,
    // so the guarantee is structural, not dependent on statement ordering.
    const [response] = await Promise.all([
      page.waitForResponse((resp) =>
        resp.url().includes("data/projects.json"),
      ),
      page.goto("/#project=nonexistent"),
    ]);
    await response.finished();
    const mp2 = new ModalPage(page);
    // JS-init signal: filter button labels include counts once init completes.
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    await mp2.expectClosed();
  });

  test("does not interfere with filter hash", async ({ page }) => {
    // No modal code runs for #filter= hashes (no projects.json fetch to
    // await). Wait for JS init, then for the hash-applied filter's
    // animation cycle (passes immediately if the initial application
    // doesn't animate), then assert the modal stayed closed.
    await page.goto("/#filter=backend");
    const mp2 = new ModalPage(page);
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    await waitForAnimationComplete(page);
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
