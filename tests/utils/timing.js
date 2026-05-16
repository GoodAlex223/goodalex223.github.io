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

/**
 * Wait for scroll-in animations to settle by polling DOM state.
 * Replaces the fixed-timeout waitForScrollAnimations() POM methods.
 *
 * Resolves when every [data-animate] element currently in the viewport has
 * computed opacity 1 (fully painted). Polling on the .is-visible class
 * alone is insufficient: the class triggers a 400ms opacity transition
 * (see css/components.css:449-455), and axe-core sampling mid-transition
 * produces false color-contrast failures on WebKit. Polling on computed
 * opacity catches both class addition AND transition completion.
 * Below-fold elements are skipped — they legitimately have not been
 * observed by IntersectionObserver yet.
 *
 * Short-circuits under prefers-reduced-motion: reduce — js/main.js never
 * sets up the observer in that case, and CSS in the reduced-motion media
 * query applies opacity: 1 unconditionally to [data-animate], so polling
 * would resolve on the first tick anyway. The early return makes the
 * intent explicit and saves a round-trip.
 *
 * The r.width > 0 guard skips display:none filter-hidden cards
 * (getBoundingClientRect returns 0x0 at 0,0 for display:none), matching
 * the observer-side skip in js/main.js for .project-card--hidden.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number }} [options]
 */
export async function waitForScrollAnimations(page, { timeout = 5000 } = {}) {
  const reducedMotion = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (reducedMotion) return;

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const elements = document.querySelectorAll("[data-animate]");
          for (const el of elements) {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0 && r.width > 0) {
              const opacity = parseFloat(getComputedStyle(el).opacity);
              if (opacity < 1) return false;
            }
          }
          return true;
        }),
      { timeout },
    )
    .toBe(true);
}
