const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Ignore generated files, dependencies, and root config files
  { ignores: ["dist/**", "node_modules/**", "eslint.config.js"] },

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

  // Playwright test files (Node.js, ESM)
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
    },
  },
];
