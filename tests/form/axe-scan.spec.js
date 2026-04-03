import { test } from "@playwright/test";
import { FormPage } from "../pages/FormPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";

const FORM_SCOPE = "#contact";

test.describe("Form WCAG Scan", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FormPage(page);
    await fp.goto();
    await fp.waitForScrollAnimations();
  });

  test("passes axe scan in default state", async ({ page }) => {
    await checkAccessibility(page);
  });

  test("passes axe scan with validation errors visible", async ({ page }) => {
    await fp.clickSubmit();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page, { include: FORM_SCOPE });
  });

  test("passes axe scan in success state", async ({ page }) => {
    await fp.mockFormspreeSuccess();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectSuccess();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page, { include: FORM_SCOPE });
  });

  test("passes axe scan in error state", async ({ page }) => {
    await fp.mockFormspreeError();
    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectError();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page, { include: FORM_SCOPE });
  });

  test("passes axe scan with explicit light theme", async ({ page }) => {
    await fp.setTheme("light");
    await checkAccessibility(page);
  });

  test("passes axe scan with explicit dark theme", async ({ page }) => {
    await fp.setTheme("dark");
    await checkAccessibility(page);
  });

  test("passes axe scan with reduced motion", async ({ page }) => {
    await fp.enableReducedMotion();
    await fp.goto();
    await fp.waitForScrollAnimations();
    await checkAccessibility(page);
  });
});
