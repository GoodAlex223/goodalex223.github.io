/**
 * Animation timing utilities for Playwright tests.
 */
import { expect } from "@playwright/test";


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
 * Resolves when every [data-animate] element whose visible fraction
 * meets the IntersectionObserver threshold (10%, with the same -50px
 * bottom rootMargin used in js/main.js) has computed opacity 1 (fully
 * painted). Polling on the .is-visible class alone is insufficient: the
 * class triggers a 400ms opacity transition (see css/components.css:449-455),
 * and axe-core sampling mid-transition produces false color-contrast
 * failures on WebKit. Polling on computed opacity catches both class
 * addition AND transition completion. The threshold check mirrors the
 * observer's own trigger condition — elements below 10% visibility are
 * skipped because the observer would never fire for them either, so
 * waiting on their opacity would hang.
 *
 * Short-circuits under prefers-reduced-motion: reduce — js/main.js never
 * sets up the observer in that case, and CSS in the reduced-motion media
 * query applies opacity: 1 unconditionally to [data-animate], so polling
 * would resolve on the first tick anyway. The early return makes the
 * intent explicit and saves a round-trip.
 *
 * The .project-card--hidden guard skips filter-hidden cards. These cards
 * use position:absolute + visibility:hidden (not display:none), so their
 * getBoundingClientRect() returns a non-zero rect — the r.width > 0
 * guard alone is insufficient. The class check mirrors the observer-side
 * skip in js/main.js:595 that prevents the IntersectionObserver from
 * animating filter-hidden cards.
 *
 * Filter-animation transient states (.project-card--filtering-in /
 * --filtering-out) are NOT handled here. Callers that may invoke this
 * helper mid-filter-animation must first await waitForAnimationComplete()
 * — otherwise filtering-in cards in the viewport with opacity 0 (start
 * state) will hold the poll until the 5000ms safety-net timeout. The
 * filter POM's clickFilter() already bundles waitForAnimationComplete,
 * so the sequencing is safe for axe-scan callers today.
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
          // Mirror the production IntersectionObserver config in
          // js/main.js:583-587 so the helper only waits on elements the
          // observer would actually fire for. Otherwise an element that's
          // geometrically in the viewport but below the threshold (e.g.,
          // 8% visible after a focus-driven scroll on WebKit) holds the
          // poll open until the safety-net timeout.
          //
          // DRIFT RISK: these constants must match js/main.js:585-586.
          // If either side changes, update both — no automated guard.
          const ROOT_MARGIN_BOTTOM = 50; // mirrors rootMargin "0px 0px -50px 0px"
          const THRESHOLD = 0.1; // mirrors threshold: 0.1
          const effectiveBottom = window.innerHeight - ROOT_MARGIN_BOTTOM;
          const elements = document.querySelectorAll("[data-animate]");
          for (const el of elements) {
            // Skip cards hidden by the filter system (position:absolute,
            // visibility:hidden — getBoundingClientRect returns a non-zero rect)
            if (el.classList.contains("project-card--hidden")) continue;
            const r = el.getBoundingClientRect();
            if (r.height === 0 || r.width === 0) continue;
            const visibleHeight = Math.max(
              0,
              Math.min(r.bottom, effectiveBottom) - Math.max(r.top, 0),
            );
            if (visibleHeight / r.height >= THRESHOLD) {
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
