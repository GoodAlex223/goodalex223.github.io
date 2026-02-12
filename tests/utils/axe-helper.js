/**
 * Accessibility testing utilities using @axe-core/playwright.
 * Centralized configuration for WCAG 2.1 AA compliance testing.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

/**
 * Run axe accessibility scan on the current page state.
 * Configured for WCAG 2.1 Level A and AA compliance.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [options]
 * @param {string[]} [options.exclude] - CSS selectors to exclude from scan
 * @param {string[]} [options.tags] - Axe tags to check
 */
export async function checkAccessibility(page, options = {}) {
  const builder = new AxeBuilder({ page });

  const tags = options.tags || ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
  builder.withTags(tags);

  if (options.exclude) {
    for (const selector of options.exclude) {
      builder.exclude(selector);
    }
  }

  const results = await builder.analyze();

  if (results.violations.length > 0) {
    const messages = results.violations.map((v) => {
      const nodes = v.nodes.map((n) => `  - ${n.html}`).join("\n");
      return `[${v.impact}] ${v.help} (${v.id})\n${nodes}\n  More info: ${v.helpUrl}`;
    });
    expect(results.violations, messages.join("\n\n")).toEqual([]);
  }
}
