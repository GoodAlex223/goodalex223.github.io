const js = require("@eslint/js");
const globals = require("globals");
const playwright = require("eslint-plugin-playwright");

module.exports = [
  // Ignore generated files, dependencies, and root config files
  { ignores: ["dist/**", "node_modules/**", "eslint.config.js", "commitlint.config.js"] },

  // Recommended rules applied to all JS files
  js.configs.recommended,

  // Browser script: js/main.js (ES6+, non-module)
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: globals.browser,
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "error",
    },
  },

  // Node.js CommonJS build scripts
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
    },
  },

  // Playwright test files: recommended preset (registers plugin + base rules)
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.js"],
  },

  // Playwright test files: project overrides (languageOptions, custom rules)
  // Browser globals (document, getComputedStyle, etc.) included because
  // page.evaluate() callbacks execute in browser context.
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "playwright/expect-expect": ["error", {
        // Sorted alphabetically — update when adding new POM assertion methods
        "assertFunctionNames": [
          "checkAccessibility",
          "expectActiveFilter",
          "expectAllVisibleCardsAreCategory",
          "expectAriaLabelledBy",
          "expectAriaModal",
          "expectButtonPressed",
          "expectCategory",
          "expectClosed",
          "expectDescriptionCount",
          "expectDetailsBtnFocused",
          "expectDetailsButtonAccessibility",
          "expectError",
          "expectFieldError",
          "expectFieldInvalid",
          "expectFieldValid",
          "expectFocusOnClose",
          "expectFocused",
          "expectFormHidden",
          "expectFormVisible",
          "expectHighlightsCount",
          "expectLinksCount",
          "expectLiveRegionText",
          "expectLoadingState",
          "expectNoAnimationClasses",
          "expectNoFieldError",
          "expectOpen",
          "expectScreenshotsCount",
          "expectScrollLocked",
          "expectScrollUnlocked",
          "expectSubmitDisabled",
          "expectSubmitEnabled",
          "expectSuccess",
          "expectTabindex",
          "expectTechPillsCount",
          "expectTitle",
          "expectUrlHash",
          "expectVisibleCardCount",
        ],
      }],
      "playwright/no-skipped-test": "off", // browser-specific test.skip() in modal/accessibility
      "playwright/no-wait-for-timeout": "off", // CSS animation timing waits throughout POM helpers
      "playwright/prefer-web-first-assertions": "error",
    },
  },

  // SEO tests: getAttribute() needed for cross-tag value comparison
  {
    files: ["tests/seo/**/*.js"],
    rules: {
      "playwright/prefer-web-first-assertions": "off",
    },
  },
];
