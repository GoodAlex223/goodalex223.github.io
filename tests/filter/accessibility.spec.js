import { test, expect } from "@playwright/test";
import { FilterPage, CATEGORIES, CATEGORY_COUNTS } from "../pages/FilterPage.js";

test.describe("Accessibility", () => {
  let fp;

  test.beforeEach(async ({ page }) => {
    fp = new FilterPage(page);
    await fp.goto();
  });

  test("toolbar has correct ARIA role", async () => {
    await expect(fp.toolbar).toHaveAttribute("role", "toolbar");
    await expect(fp.toolbar).toHaveAttribute(
      "aria-label",
      "Filter projects by category",
    );
  });

  test("active button has aria-pressed true, others false", async () => {
    await fp.expectButtonPressed("all", true);
    await fp.expectButtonPressed("backend", false);
    await fp.expectButtonPressed("iot", false);
    await fp.expectButtonPressed("web", false);
    await fp.expectButtonPressed("tools", false);
  });

  test("aria-pressed updates when filter changes", async () => {
    await fp.clickFilter("iot");

    await fp.expectButtonPressed("all", false);
    await fp.expectButtonPressed("iot", true);
    await fp.expectButtonPressed("backend", false);
  });

  test("roving tabindex: only active button is tabbable", async () => {
    await fp.expectTabindex("all", 0);
    await fp.expectTabindex("backend", -1);
    await fp.expectTabindex("iot", -1);
    await fp.expectTabindex("web", -1);
    await fp.expectTabindex("tools", -1);
  });

  test("tabindex updates when filter changes", async () => {
    // TEMPORARY INSTRUMENTATION — to be removed in a follow-up commit.
    // Captures per-button tabindex (attribute + IDL), aria-pressed, active
    // class, and document.activeElement at four checkpoints to diagnose
    // intermittent Firefox failure (received tabindex="0" instead of "-1").
    const captureState = (label) =>
      fp.page.evaluate((checkpoint) => {
        const buttons = Array.from(document.querySelectorAll(".filter-btn"));
        return {
          checkpoint,
          activeFilter: document.activeElement?.dataset?.filter ?? null,
          buttons: buttons.map((b) => ({
            filter: b.dataset.filter,
            attrTabindex: b.getAttribute("tabindex"),
            idlTabIndex: b.tabIndex,
            ariaPressed: b.getAttribute("aria-pressed"),
            isActiveClass: b.classList.contains("filter-btn--active"),
          })),
        };
      }, label);

    const cp1 = await captureState("after-goto");
    const cp2 = await captureState("before-click");
    await fp.clickFilter("backend");
    const cp3 = await captureState("after-clickfilter-resolved");

    // Capture the at-assertion state right before the failing assertion.
    const cp4 = await captureState("at-assertion");
    await test.info().attach("instrumentation-trace", {
      body: JSON.stringify({ cp1, cp2, cp3, cp4 }, null, 2),
      contentType: "application/json",
    });

    await fp.expectTabindex("all", -1);
    await fp.expectTabindex("backend", 0);
  });

  test("tabindex updates when navigating with arrow keys", async () => {
    await fp.focusButton("all");
    await fp.pressKey("ArrowRight");

    await fp.expectTabindex("all", -1);
    await fp.expectTabindex("backend", 0);
  });

  test("button labels include project counts", async () => {
    for (const cat of CATEGORIES) {
      const count = CATEGORY_COUNTS[cat];
      await expect(fp.button(cat)).toContainText(`(${count})`);
    }
  });

  test("buttons have aria-label with count for screen readers", async () => {
    const backendBtn = fp.button("backend");
    await expect(backendBtn).toHaveAttribute(
      "aria-label",
      "Backend, 1 project",
    );

    const iotBtn = fp.button("iot");
    await expect(iotBtn).toHaveAttribute("aria-label", "IoT, 3 projects");
  });

  test("live region announces filter results", async () => {
    await fp.clickFilter("iot");
    await fp.expectLiveRegionText("Showing 3 IoT projects");
  });

  test("live region announces all projects correctly", async () => {
    await fp.clickFilter("backend");
    await fp.expectLiveRegionText("Showing 1 Backend project");

    await fp.clickFilter("all");
    await fp.expectLiveRegionText(`Showing all ${CATEGORY_COUNTS.all} projects`);
  });

  test("live region has correct ARIA attributes", async () => {
    await expect(fp.liveRegion).toHaveAttribute("role", "status");
    await expect(fp.liveRegion).toHaveAttribute("aria-live", "polite");
    await expect(fp.liveRegion).toHaveAttribute("aria-atomic", "true");
  });
});
