/**
 * Animation timing utilities for Playwright tests.
 * Reads durations from CSS custom properties (single source of truth).
 */
import { expect } from "@playwright/test";

/**
 * Get filter animation duration from CSS custom property
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>} Duration in milliseconds
 */
export async function getAnimationDuration(page) {
  return page.evaluate(() =>
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--filter-animation-duration",
      ),
      10,
    ),
  );
}

/**
 * Get stagger delay from CSS custom property
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>} Delay in milliseconds per card
 */
export async function getStaggerDelay(page) {
  return page.evaluate(() =>
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--filter-stagger-delay",
      ),
      10,
    ),
  );
}


/**
 * Wait for the filter animation cycle to complete by polling DOM state.
 * Replaces fixed-timeout waitForFilterAnimation() — immune to browser
 * timing variance (Firefox flaky test fix).
 *
 * Uses a brief initial delay to ensure the click handler's setTimeout
 * callbacks have fired and animation classes are present in the DOM
 * before polling for their removal.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number }} [options]
 */
export async function waitForAnimationComplete(page, { timeout = 5000 } = {}) {
  // Allow the click handler's setTimeout callbacks to fire (animation classes
  // are added asynchronously via staggered setTimeout in filterProjects())
  await page.waitForTimeout(50);

  await expect(page.locator(".project-card--filtering-out")).toHaveCount(0, {
    timeout,
  });
  await expect(page.locator(".project-card--filtering-in")).toHaveCount(0, {
    timeout,
  });
  await expect(page.locator(".project-card.is-filtering")).toHaveCount(0, {
    timeout,
  });
}