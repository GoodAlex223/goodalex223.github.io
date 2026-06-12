/**
 * Guard tests for the contracts in tests/utils/timing.js.
 *
 * These pin behavior that production code cannot enforce by import:
 * the mirror constants must equal the IntersectionObserver config the
 * page actually constructs, and waitForScrollAnimations must keep
 * skipping filter-hidden cards (which hold opacity 0 forever).
 */
import { test, expect } from "@playwright/test";
import { FilterPage } from "../pages/FilterPage.js";
import {
  SCROLL_OBSERVER_THRESHOLD,
  SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
  waitForScrollAnimations,
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

  test("waitForScrollAnimations resolves while filter-hidden cards are present", async ({
    page,
  }) => {
    const fp = new FilterPage(page);
    await fp.goto();
    // Hides all non-iot cards (counts: see CATEGORY_COUNTS in FilterPage.js);
    // clickFilter bundles waitForAnimationComplete.
    await fp.clickFilter("iot");
    await page.locator(".projects__grid").scrollIntoViewIfNeeded();

    // Precondition: at least one filter-hidden card overlaps the observer's
    // effective viewport by >= threshold AND is still un-animated
    // (opacity < 1). That is exactly the hang condition this test guards:
    // hidden cards never receive .is-visible (the observer skips them), so
    // without the class-skip in waitForScrollAnimations the poll would wait
    // on their opacity forever. If layout changes ever void this setup, the
    // test fails HERE (loudly) instead of silently passing.
    // expect.poll retries the measurement until the scrollIntoViewIfNeeded
    // scroll has settled — a one-shot evaluate could sample mid-scroll
    // rects and report a false 0.
    await expect
      .poll(
        () =>
          page.evaluate(
            ({ threshold, rootMarginBottom }) => {
              const effectiveBottom = window.innerHeight - rootMarginBottom;
              const hidden = document.querySelectorAll(
                ".project-card--hidden[data-animate]",
              );
              let count = 0;
              for (const el of hidden) {
                const r = el.getBoundingClientRect();
                if (r.height === 0 || r.width === 0) continue;
                const visibleHeight = Math.max(
                  0,
                  Math.min(r.bottom, effectiveBottom) - Math.max(r.top, 0),
                );
                if (
                  visibleHeight / r.height >= threshold &&
                  parseFloat(getComputedStyle(el).opacity) < 1
                ) {
                  count += 1;
                }
              }
              return count;
            },
            {
              threshold: SCROLL_OBSERVER_THRESHOLD,
              rootMarginBottom: SCROLL_OBSERVER_ROOT_MARGIN_BOTTOM,
            },
          ),
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);

    // Resolving without hitting the poll timeout IS the assertion.
    await waitForScrollAnimations(page);
  });
});
