/**
 * Animation timing utilities for Playwright tests.
 * Reads durations from CSS custom properties (single source of truth).
 */

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
 * Wait for the full filter animation cycle to complete.
 * exit (duration) + entrance (duration) + max stagger (7 cards * delay) + buffer
 * @param {import('@playwright/test').Page} page
 */
export async function waitForFilterAnimation(page) {
  const duration = await getAnimationDuration(page);
  const stagger = await getStaggerDelay(page);
  const maxCards = 7;
  const buffer = 300;
  const totalTime = duration * 2 + stagger * maxCards + buffer;
  await page.waitForTimeout(totalTime);
}