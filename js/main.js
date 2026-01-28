// Update copyright year
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize theme toggle
  initThemeToggle();

  // Initialize project filter
  initProjectFilter();
});

/**
 * Theme Toggle Functionality
 * - Respects system preference as default
 * - Persists user choice in localStorage
 * - Provides smooth transitions between themes
 */
function initThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const html = document.documentElement;

  /**
   * Get system color scheme preference
   * @returns {"light" | "dark"}
   */
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  /**
   * Get current active theme
   * @returns {"light" | "dark"}
   */
  function getCurrentTheme() {
    return html.dataset.theme || getSystemTheme();
  }

  /**
   * Apply theme and update UI
   * @param {"light" | "dark"} theme
   * @param {boolean} save - Whether to persist to localStorage
   */
  function applyTheme(theme, save = false) {
    html.dataset.theme = theme;

    if (save) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // localStorage unavailable (private browsing) - continue without persistence
      }
    }

    // Update button aria-label for screen readers
    const label =
      theme === "light" ? "Switch to dark theme" : "Switch to light theme";
    toggle.setAttribute("aria-label", label);

    // Update theme-color meta for mobile browser chrome
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = theme === "light" ? "#f8f9fa" : "#0f0f23";
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === "light" ? "dark" : "light";
    applyTheme(next, true);
  }

  // Initialize: apply saved theme or sync with system preference
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {
    // localStorage unavailable (private browsing)
  }
  if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    // No saved preference - sync aria-label with system preference
    const systemTheme = getSystemTheme();
    const label =
      systemTheme === "light" ? "Switch to dark theme" : "Switch to light theme";
    toggle.setAttribute("aria-label", label);
  }

  // Handle toggle button clicks
  toggle.addEventListener("click", toggleTheme);

  // Listen for system preference changes
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      // Only auto-switch if user hasn't set explicit preference
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "light" : "dark";
        applyTheme(newTheme, false);
      }
    });
}

/**
 * Project Filter Functionality
 * - Filters project cards by category
 * - Smooth fade-then-reflow animation
 * - Single-select with toggle-to-reset behavior
 */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');

  if (!filterButtons.length || !projectCards.length) return;

  let currentFilter = "all";

  /**
   * Filter projects by category with fade-then-reflow animation
   * @param {string} category - Category to filter by, or "all" to show all
   */
  function filterProjects(category) {
    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === "all" || cardCategory === category;

      if (shouldShow) {
        // Show: remove both classes immediately
        card.classList.remove("filter-fading", "filter-hidden");
      } else if (!card.classList.contains("filter-hidden")) {
        // Hide: fade first, then hide after transition
        card.classList.add("filter-fading");

        // After fade completes, fully hide the card
        card.addEventListener(
          "transitionend",
          function handleTransitionEnd(e) {
            if (e.propertyName === "opacity" && card.classList.contains("filter-fading")) {
              card.classList.add("filter-hidden");
              card.classList.remove("filter-fading");
            }
            card.removeEventListener("transitionend", handleTransitionEnd);
          }
        );
      }
    });

    currentFilter = category;
  }

  /**
   * Update active button state
   * @param {HTMLElement} activeButton - The button to mark as active
   */
  function setActiveButton(activeButton) {
    filterButtons.forEach((btn) => {
      btn.classList.remove("filter-btn--active");
      btn.setAttribute("aria-pressed", "false");
    });
    activeButton.classList.add("filter-btn--active");
    activeButton.setAttribute("aria-pressed", "true");
  }

  // Add click handlers to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Toggle-to-reset: clicking active filter resets to "all"
      if (filter === currentFilter && filter !== "all") {
        setActiveButton(allButton);
        filterProjects("all");
      } else {
        setActiveButton(button);
        filterProjects(filter);
      }
    });
  });
}
