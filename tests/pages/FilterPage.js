/**
 * Page Object Model for the filter system on the portfolio page.
 * Encapsulates all filter-related locators and actions.
 */
import { expect } from "@playwright/test";
import { waitForFilterAnimation } from "../utils/timing.js";

/** Category → expected card count (source of truth for assertions) */
export const CATEGORY_COUNTS = {
  all: 8,
  backend: 1,
  iot: 3,
  web: 2,
  tools: 2,
};

export const CATEGORIES = ["all", "backend", "iot", "web", "tools"];

export class FilterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Toolbar & buttons
    this.toolbar = page.locator('[role="toolbar"]');
    this.filterButtons = page.locator(".filter-btn");
    this.activeButton = page.locator(".filter-btn--active");

    // Project cards
    this.allCards = page.locator(".project-card");
    this.visibleCards = page.locator(
      ".project-card:not(.project-card--hidden)",
    );
    this.hiddenCards = page.locator(".project-card.project-card--hidden");

    // Animation state locators
    this.exitingCards = page.locator(".project-card--filtering-out");
    this.enteringCards = page.locator(".project-card--filtering-in");
    this.filteringCards = page.locator(".project-card.is-filtering");

    // Accessibility
    this.liveRegion = page.locator("#filter-status");
  }

  // ── Navigation ──────────────────────────────────────────

  async goto() {
    await this.page.goto("/");
    // Wait for JS to initialize (button labels with counts)
    await expect(this.filterButtons.first()).toContainText("(");
  }

  /** Wait for initial scroll-in animations to settle (hero + visible sections) */
  async waitForScrollAnimations() {
    // Hero elements stagger up to 150ms + 400ms transition = 550ms; add buffer
    await this.page.waitForTimeout(700);
  }

  async gotoWithHash(category) {
    await this.page.goto(`/#filter=${category}`);
    await waitForFilterAnimation(this.page);
  }

  // ── Filter actions ──────────────────────────────────────

  /** Click a filter button by category and wait for animation to finish */
  async clickFilter(category) {
    await this.button(category).click();
    await waitForFilterAnimation(this.page);
  }

  /** Click a filter button WITHOUT waiting (for testing mid-animation state) */
  async clickFilterNoWait(category) {
    await this.button(category).click();
  }

  /** Rapidly click through a list of categories without waiting between */
  async rapidClickFilters(categories) {
    for (const cat of categories) {
      await this.button(cat).click();
    }
    await waitForFilterAnimation(this.page);
  }

  // ── Button locators ─────────────────────────────────────

  /** Get locator for a specific filter button */
  button(category) {
    return this.page.locator(`[data-filter="${category}"]`);
  }

  // ── State queries ───────────────────────────────────────

  async getActiveFilterCategory() {
    return this.activeButton.getAttribute("data-filter");
  }

  async getVisibleCardCount() {
    return this.visibleCards.count();
  }

  async getVisibleCategories() {
    const cards = await this.visibleCards.all();
    return Promise.all(cards.map((c) => c.getAttribute("data-category")));
  }

  async getUrlHash() {
    const url = this.page.url();
    return url.includes("#") ? url.split("#")[1] : "";
  }

  // ── Assertions ──────────────────────────────────────────

  async expectVisibleCardCount(count) {
    await expect(this.visibleCards).toHaveCount(count);
  }

  async expectAllVisibleCardsAreCategory(category) {
    const categories = await this.getVisibleCategories();
    for (const cat of categories) {
      expect(cat).toBe(category);
    }
  }

  async expectActiveFilter(category) {
    await expect(this.activeButton).toHaveAttribute("data-filter", category);
  }

  async expectUrlHash(hash) {
    await expect
      .poll(() => this.getUrlHash(), { timeout: 5000 })
      .toBe(hash);
  }

  async expectButtonPressed(category, pressed) {
    await expect(this.button(category)).toHaveAttribute(
      "aria-pressed",
      String(pressed),
    );
  }

  async expectTabindex(category, value) {
    await expect(this.button(category)).toHaveAttribute(
      "tabindex",
      String(value),
    );
  }

  async expectFocused(category) {
    await expect(this.button(category)).toBeFocused();
  }

  async expectLiveRegionText(text) {
    await expect(this.liveRegion).toHaveText(text);
  }

  async expectNoAnimationClasses() {
    await expect(this.exitingCards).toHaveCount(0);
    await expect(this.enteringCards).toHaveCount(0);
    await expect(this.filteringCards).toHaveCount(0);
  }

  // ── Keyboard helpers ────────────────────────────────────

  async focusButton(category) {
    await this.button(category).focus();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  // ── Media & Theme helpers ───────────────────────────────

  async enableReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  /**
   * Force the page theme for testing purposes.
   * Must be called after goto() — the document must exist.
   * Waits for CSS transitions to settle (250ms theme transition + buffer).
   * @param {'light'|'dark'} theme
   */
  async setTheme(theme) {
    await this.page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await this.page.waitForTimeout(400);
  }
}
