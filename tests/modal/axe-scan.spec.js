import { test } from "@playwright/test";
import { ModalPage, PROJECTS_WITH_DETAILS } from "../pages/ModalPage.js";
import { checkAccessibility } from "../utils/axe-helper.js";
import { waitForScrollAnimations } from "../utils/timing.js";

// Scope axe scans to the modal element. When the modal is open with
// aria-modal="true", background content is inert. Axe-core cannot account
// for the semi-transparent backdrop overlay altering perceived contrast of
// elements behind it, producing false positives on background cards.
const MODAL_SCOPE = { include: "#project-modal" };

test.describe("Modal Accessibility Scanning (Axe-Core)", () => {
  let mp;

  test.beforeEach(async ({ page }) => {
    mp = new ModalPage(page);
    await mp.goto();
    await waitForScrollAnimations(page);
  });

  // ── Modal-open WCAG scans (default theme) ──────────────────────────────
  // Scan each project individually — different content structures
  // (descriptions, highlights, tech, screenshots) exercise different DOM.

  for (const projectId of PROJECTS_WITH_DETAILS) {
    test(`modal open for "${projectId}" passes WCAG 2.1 AA`, async ({ page }) => {
      await mp.clickCard(projectId);
      await checkAccessibility(page, MODAL_SCOPE);
    });
  }

  // ── Theme-specific WCAG AA scans ───────────────────────────────────────
  // Explicit theme testing catches color-contrast regressions that are
  // invisible when tests only run in the browser's default theme.

  test.describe("Light theme", () => {
    test.beforeEach(async () => {
      await mp.setTheme("light");
    });

    for (const projectId of PROJECTS_WITH_DETAILS) {
      test(`modal open for "${projectId}" passes WCAG 2.1 AA`, async ({ page }) => {
        await mp.clickCard(projectId);
        await checkAccessibility(page, MODAL_SCOPE);
      });
    }
  });

  test.describe("Dark theme", () => {
    test.beforeEach(async () => {
      await mp.setTheme("dark");
    });

    for (const projectId of PROJECTS_WITH_DETAILS) {
      test(`modal open for "${projectId}" passes WCAG 2.1 AA`, async ({ page }) => {
        await mp.clickCard(projectId);
        await checkAccessibility(page, MODAL_SCOPE);
      });
    }
  });

  // ── Reduced motion WCAG AA scans ──────────────────────────────────────
  // Verify modal remains accessible with prefers-reduced-motion enabled.

  test.describe("Reduced motion", () => {
    test.beforeEach(async ({ page }) => {
      await mp.enableReducedMotion();
      await mp.goto();
      await waitForScrollAnimations(page);
    });

    for (const projectId of PROJECTS_WITH_DETAILS) {
      test(`modal open for "${projectId}" passes WCAG 2.1 AA`, async ({ page }) => {
        await mp.clickCard(projectId);
        await checkAccessibility(page, MODAL_SCOPE);
      });
    }
  });
});
