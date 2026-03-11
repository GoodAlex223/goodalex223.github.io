/**
 * Lighthouse CI configuration.
 *
 * Runs 3 audits against the local test server, takes the median score,
 * and fails if any category drops below 90/100.
 */

"use strict";

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: ["http://127.0.0.1:4173/"],

      // LHCI manages the server lifecycle: start, wait for ready, kill after runs.
      startServerCommand: "node scripts/serve.js",
      startServerReadyPattern: "Listening on http://127.0.0.1:4173",
      startServerReadyTimeout: 10000,

      settings: {
        // Desktop preset — portfolio is primarily viewed on desktop.
        // 'provided' throttling disables simulated CPU/network slowdown,
        // giving stable scores on shared CI runners.
        preset: "desktop",
        throttlingMethod: "provided",

        // Required for headless Chrome on CI runners without a display server.
        chromeFlags: "--no-sandbox --disable-gpu",
      },
    },

    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },

    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
