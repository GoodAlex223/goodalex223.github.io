import { test } from "@playwright/test";
import { ModalPage } from "../pages/ModalPage.js";

test.describe("Basic Modal", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
  });

  test("opens modal when clicking project card body", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectOpen();
    await mp.expectTitle("rating_bot");
    await mp.expectCategory("Backend");
  });

  test("displays correct content for rating-bot", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(6);
    await mp.expectScreenshotsCount(2);
    await mp.expectLinksCount(1); // GitHub only
  });

  test("displays correct content for rule-indicators", async () => {
    await mp.clickCard("rule-indicators");
    await mp.expectTitle("Industrial Rule Indicators");
    await mp.expectCategory("IoT");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(5);
    await mp.expectLinksCount(2); // GitHub + Demo
  });

  test("displays correct content for media-viewer", async () => {
    await mp.clickCard("media-viewer");
    await mp.expectTitle("Media Viewer");
    await mp.expectCategory("Tools");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(4);
    await mp.expectLinksCount(1); // GitHub only
  });

  test("displays correct content for lubrication", async () => {
    await mp.clickCard("lubrication");
    await mp.expectTitle("Automatic Machine Lubrication");
    await mp.expectCategory("IoT");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(4);
    await mp.expectScreenshotsCount(0);
    await mp.expectLinksCount(2); // GitHub + Demo
  });

  test("displays correct content for hx711-scale", async () => {
    await mp.clickCard("hx711-scale");
    await mp.expectTitle("HX711 Multi-Scale System");
    await mp.expectCategory("IoT");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(5);
    await mp.expectScreenshotsCount(0);
    await mp.expectLinksCount(2); // GitHub + Demo
  });

  test("displays correct content for dropshipping", async () => {
    await mp.clickCard("dropshipping");
    await mp.expectTitle("E-commerce Prototype");
    await mp.expectCategory("Web");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(6);
    await mp.expectScreenshotsCount(0);
    await mp.expectLinksCount(2); // GitHub + Demo
  });

  test("displays correct content for svg-processor", async () => {
    await mp.clickCard("svg-processor");
    await mp.expectTitle("SVG Layer Processor");
    await mp.expectCategory("Tools");
    await mp.expectDescriptionCount(3);
    await mp.expectHighlightsCount(6);
    await mp.expectTechPillsCount(4);
    await mp.expectScreenshotsCount(0);
    await mp.expectLinksCount(1); // GitHub only
  });

  test("does not open modal when clicking card links", async ({ page }) => {
    // Click the GitHub link on rating-bot card (should NOT open modal)
    const card = page.locator('[data-project="rating-bot"]');
    const link = card.locator(".project-card__link").first();

    // Intercept the link navigation to prevent leaving the page
    await page.route("**/github.com/**", (route) => route.abort());

    await link.click();

    // Modal should NOT be open
    await mp.expectClosed();
  });

  test("locks scroll when modal is open", async () => {
    await mp.clickCard("rating-bot");
    await mp.expectScrollLocked();
  });

  test("unlocks scroll when modal is closed", async () => {
    await mp.clickCard("rating-bot");
    await mp.clickClose();
    await mp.expectScrollUnlocked();
  });
});
