/**
 * Page Object Model for the project detail modal.
 * Encapsulates all modal-related locators and actions.
 */
import { expect } from "@playwright/test";

/** Project IDs that have detail data */
export const PROJECTS_WITH_DETAILS = [
  "rating-bot",
  "rule-indicators",
  "media-viewer",
  "lubrication",
  "hx711-scale",
  "dropshipping",
  "svg-processor",
  "cleanspark",
];

export class ModalPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Modal elements
    this.modal = page.locator("#project-modal");
    this.backdrop = page.locator(".project-modal__backdrop");
    this.dialog = page.locator(".project-modal__dialog");
    this.closeButton = page.locator("[data-modal-close]");

    // Modal content
    this.title = page.locator("#project-modal-title");
    this.category = page.locator(".project-modal__category");
    this.description = page.locator(".project-modal__description p");
    this.highlights = page.locator(".project-modal__highlights li");
    this.techPills = page.locator(".project-modal__tech li");
    this.screenshots = page.locator(".project-modal__screenshot");
    this.links = page.locator(".project-modal__link");
    this.footer = page.locator(".project-modal__footer");

    // Cards
    this.clickableCards = page.locator(".project-card[data-project]");
  }

  // ── Navigation ──────────────────────────────────────────

  async goto() {
    await this.page.goto("/");
    // Wait for JS to initialize (filter button labels with counts)
    await expect(this.page.locator(".filter-btn").first()).toContainText("(");
  }

  async gotoWithProjectHash(projectId) {
    await this.page.goto(`/#project=${projectId}`);
    // Wait for modal to open
    await this.expectOpen();
  }

  // ── Modal actions ──────────────────────────────────────

  /** Click a project card body (avoiding links) to open modal */
  async clickCard(projectId) {
    const card = this.page.locator(`[data-project="${projectId}"]`);
    const title = card.locator(".project-card__title");
    // Scroll into view to trigger IntersectionObserver, then wait for card
    // to reach full opacity before clicking. Without this, Firefox clicks
    // at opacity:0 (before scroll animation completes) and the click handler
    // doesn't reliably fire. Checking computed opacity (not .is-visible class)
    // works for both normal mode (opacity via transition) and reduced-motion
    // mode (opacity via CSS override, no .is-visible needed).
    await title.scrollIntoViewIfNeeded();
    await expect
      .poll(() => card.evaluate((el) => getComputedStyle(el).opacity), {
        timeout: 5000,
      })
      .toBe("1");
    await title.click();
    await this.expectOpen();
  }

  /** Close modal via close button */
  async clickClose() {
    await this.closeButton.click();
    await this.expectClosed();
  }

  /** Close modal via ESC key */
  async pressEscape() {
    await this.page.keyboard.press("Escape");
    await this.expectClosed();
  }

  /** Close modal via backdrop click */
  async clickBackdrop() {
    // Click at position (10, 10) of the modal overlay (backdrop area outside dialog)
    await this.modal.click({ position: { x: 10, y: 10 } });
    await this.expectClosed();
  }

  // ── State queries ───────────────────────────────────────

  async getModalTitle() {
    return this.title.textContent();
  }

  async getUrlHash() {
    const url = this.page.url();
    return url.includes("#") ? url.split("#")[1] : "";
  }

  // ── Assertions ──────────────────────────────────────────

  async expectOpen() {
    await expect(this.modal).toHaveClass(/project-modal--open/);
    await expect(this.modal).not.toHaveAttribute("hidden", "");
    // Wait for modal opacity transition (250ms) to complete. Without this,
    // axe-core scans mid-transition and computes reduced text colors from
    // the parent's partial opacity, causing false contrast failures.
    await this.page.waitForTimeout(300);
  }

  async expectClosed() {
    await expect(this.modal).not.toHaveClass(/project-modal--open/);
  }

  async expectTitle(expectedTitle) {
    await expect(this.title).toHaveText(expectedTitle);
  }

  async expectCategory(expectedCategory) {
    await expect(this.category).toHaveText(expectedCategory);
  }

  async expectDescriptionCount(count) {
    await expect(this.description).toHaveCount(count);
  }

  async expectHighlightsCount(count) {
    await expect(this.highlights).toHaveCount(count);
  }

  async expectTechPillsCount(count) {
    await expect(this.techPills).toHaveCount(count);
  }

  async expectScreenshotsCount(count) {
    await expect(this.screenshots).toHaveCount(count);
  }

  async expectLinksCount(count) {
    await expect(this.links).toHaveCount(count);
  }

  async expectUrlHash(hash) {
    await expect
      .poll(() => this.getUrlHash(), { timeout: 5000 })
      .toBe(hash);
  }

  async expectScrollLocked() {
    const hasClass = await this.page.evaluate(() =>
      document.body.classList.contains("modal-open")
    );
    expect(hasClass).toBe(true);
  }

  async expectScrollUnlocked() {
    const hasClass = await this.page.evaluate(() =>
      document.body.classList.contains("modal-open")
    );
    expect(hasClass).toBe(false);
  }

  async expectFocusOnClose() {
    // Wait for focus to settle (async openModal may still be processing)
    await expect(this.closeButton).toBeFocused({ timeout: 5000 });
  }

  async expectDetailsBtnFocused(projectId) {
    const btn = this.page.locator(`[data-project="${projectId}"] .project-card__details-btn`);
    await expect(btn).toBeFocused();
  }

  // ── Accessibility assertions ──────────────────────────────

  async expectAriaModal() {
    await expect(this.modal).toHaveAttribute("role", "dialog");
    await expect(this.modal).toHaveAttribute("aria-modal", "true");
  }

  async expectAriaLabelledBy() {
    await expect(this.modal).toHaveAttribute("aria-labelledby", "project-modal-title");
  }

  async expectDetailsButtonAccessibility(projectId) {
    const btn = this.page.locator(`[data-project="${projectId}"] .project-card__details-btn`);
    await expect(btn).toHaveAttribute("aria-haspopup", "dialog");
    await expect(btn).toBeVisible();
  }

  // ── Keyboard helpers ────────────────────────────────────

  async pressTab() {
    await this.page.keyboard.press("Tab");
  }

  async pressShiftTab() {
    await this.page.keyboard.press("Shift+Tab");
  }

  // ── Media & Theme helpers ───────────────────────────────

  async enableReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  /**
   * Force the page theme for testing purposes.
   * @param {'light'|'dark'} theme
   */
  async setTheme(theme) {
    await this.page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await this.page.waitForTimeout(400);
  }

  /** Wait for initial scroll-in animations to settle */
  async waitForScrollAnimations() {
    await this.page.waitForTimeout(700);
  }
}
