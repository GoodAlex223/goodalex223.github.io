/**
 * Guard tests for the contracts in tests/utils/timing.js.
 *
 * These pin behavior that production code cannot enforce by import:
 * the mirror constants must equal the IntersectionObserver config the
 * page actually constructs, and waitForScrollAnimations must keep
 * skipping filter-hidden cards (which hold opacity 0 forever).
 */
import { test, expect } from "@playwright/test";
import {
  SCROLL_OBSERVER_THRESHOLD,
  SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
} from "./timing.js";

test.describe("timing.js contract guards", () => {
  test("production IntersectionObserver config matches the mirror constants", async ({
    page,
  }) => {
    // Capture constructor options before any page JS runs. Intercepting the
    // runtime call (not parsing source) works against the terser-minified
    // dist/ build that the test server actually serves.
    await page.addInitScript(() => {
      window.__ioConfigs = [];
      const OriginalIO = window.IntersectionObserver;
      window.IntersectionObserver = class extends OriginalIO {
        constructor(callback, options) {
          super(callback, options);
          window.__ioConfigs.push(options);
        }
      };
    });

    // No reduced-motion emulation here: production skips observer setup
    // entirely under reduced motion (js/main.js initScrollAnimations
    // early-exit), so there would be nothing to capture.
    await page.goto("/");
    // JS-init signal — same condition the POMs' goto() waits on.
    await expect(page.locator(".filter-btn").first()).toContainText("(");
    // The observer is constructed inside a double requestAnimationFrame
    // after init, so capture is asynchronous — poll for it.
    await expect
      .poll(() => page.evaluate(() => window.__ioConfigs.length), {
        timeout: 5000,
      })
      .toBeGreaterThan(0);

    const configs = await page.evaluate(() => window.__ioConfigs);
    // Exactly one observer exists today. If this fails with 2+, someone
    // added another IntersectionObserver — decide which config the
    // timing.js helper mirrors and update this guard deliberately.
    expect(configs).toHaveLength(1);
    expect(configs[0].threshold).toBe(SCROLL_OBSERVER_THRESHOLD);
    expect(configs[0].rootMargin).toBe(
      `0px 0px -${SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM}px 0px`,
    );
  });
});
