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

  // Initialize scroll animations
  initScrollAnimations();
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
 * - Filters project cards by category with staggered animations
 * - Choreographed entrance/exit transitions with fade + scale effects
 * - Single-select with toggle-to-reset behavior
 * - Respects prefers-reduced-motion preference
 */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');

  if (!filterButtons.length || !projectCards.length) return;

  let currentFilter = "all";

  // Animation state tracking for filter animations
  let isAnimating = false;
  let animationTimeouts = [];
  let animationFrame = null;

  /**
   * Cancel any pending filter animations
   * Ensures clean state when new animation starts
   */
  function cancelFilterAnimations() {
    animationTimeouts.forEach((id) => clearTimeout(id));
    animationTimeouts = [];
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  /**
   * Clean up all animation classes from a card
   * @param {HTMLElement} card - Project card element
   */
  function cleanupAnimationClasses(card) {
    card.classList.remove(
      "project-card--filtering-out",
      "project-card--filtering-in",
      "is-filtering"
    );
  }

  /**
   * Filter projects by category with staggered animations
   * - Parallel hide/show animations for smooth transitions
   * - Stagger delay creates choreographed effect
   * - Respects prefers-reduced-motion
   * - Handles rapid clicks gracefully (cancels pending animations)
   * @param {string} category - Category to filter by, or "all" to show all
   */
  function filterProjects(category) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Cancel any pending animations from rapid clicks
    cancelFilterAnimations();

    // Separate cards into show/hide groups
    const cardsToShow = [];
    const cardsToHide = [];

    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === "all" || cardCategory === category;
      const isCurrentlyHidden = card.classList.contains("project-card--hidden");

      // Clean up any stale animation classes from interrupted animations
      cleanupAnimationClasses(card);

      if (shouldShow && isCurrentlyHidden) {
        cardsToShow.push(card);
      } else if (!shouldShow && !isCurrentlyHidden) {
        cardsToHide.push(card);
      }
    });

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      cardsToShow.forEach((card) => {
        card.classList.remove("project-card--hidden");
      });
      cardsToHide.forEach((card) => {
        card.classList.add("project-card--hidden");
      });
      currentFilter = category;
      announceFilterResults(category);
      return;
    }

    // Read animation timing from CSS custom properties (single source of truth)
    const rootStyles = getComputedStyle(document.documentElement);
    const animationDuration = parseInt(
      rootStyles.getPropertyValue("--filter-animation-duration"),
      10
    );
    const staggerDelay = parseInt(
      rootStyles.getPropertyValue("--filter-stagger-delay"),
      10
    );

    // Mark animation as in progress
    isAnimating = true;

    // PHASE 1: Start exit animations for cards being hidden
    cardsToHide.forEach((card) => {
      card.classList.add("project-card--filtering-out");
    });

    // PHASE 2: After exit animation, remove from layout
    const exitTimeout = setTimeout(() => {
      cardsToHide.forEach((card) => {
        card.classList.remove("project-card--filtering-out");
        card.classList.add("project-card--hidden");
      });
    }, animationDuration);
    animationTimeouts.push(exitTimeout);

    // PHASE 3: Prepare entrance animations (set start state immediately)
    cardsToShow.forEach((card) => {
      card.classList.remove("project-card--hidden");
      card.classList.add("project-card--filtering-in");
    });

    // PHASE 4: Trigger entrance animations with stagger delay
    // Double requestAnimationFrame ensures browser paints the start state
    animationFrame = requestAnimationFrame(() => {
      animationFrame = requestAnimationFrame(() => {
        cardsToShow.forEach((card, index) => {
          const delay = index * staggerDelay;

          const staggerTimeout = setTimeout(() => {
            card.classList.add("is-filtering");
          }, delay);
          animationTimeouts.push(staggerTimeout);
        });

        // Clean up animation classes and update state after all animations complete
        const totalAnimationTime =
          animationDuration + cardsToShow.length * staggerDelay;
        const cleanupTimeout = setTimeout(() => {
          cardsToShow.forEach((card) => {
            card.classList.remove("project-card--filtering-in", "is-filtering");
          });

          // Update state only after animation completes
          currentFilter = category;
          isAnimating = false;

          // Announce results to screen readers after animation completes
          announceFilterResults(category);
        }, totalAnimationTime);
        animationTimeouts.push(cleanupTimeout);
      });
    });
  }

  /**
   * Update roving tabindex - only focused button is tabbable
   * @param {HTMLElement} focusedButton - The button that should receive tabindex="0"
   */
  function updateTabindex(focusedButton) {
    filterButtons.forEach((btn) => {
      btn.tabIndex = btn === focusedButton ? 0 : -1;
    });
  }

  /**
   * Announce filter results to screen readers via live region
   * @param {string} category - The active filter category
   */
  function announceFilterResults(category) {
    const liveRegion = document.getElementById("filter-status");
    if (!liveRegion) return;

    const visibleCount = Array.from(projectCards).filter(
      (card) => !card.classList.contains("project-card--hidden")
    ).length;

    const label = category === "all" ? "all" : category;
    liveRegion.textContent =
      `Showing ${visibleCount} ${label} project${visibleCount === 1 ? "" : "s"}`;
  }

  /**
   * Update active button state and roving tabindex
   * @param {HTMLElement} activeButton - The button to mark as active
   */
  function setActiveButton(activeButton) {
    filterButtons.forEach((btn) => {
      btn.classList.remove("filter-btn--active");
      btn.setAttribute("aria-pressed", "false");
    });
    activeButton.classList.add("filter-btn--active");
    activeButton.setAttribute("aria-pressed", "true");
    updateTabindex(activeButton);
  }

  // Add click handlers to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Toggle-to-reset: clicking active filter resets to "all"
      if (filter === currentFilter && filter !== "all") {
        setActiveButton(allButton);
        allButton.focus();
        filterProjects("all");
        // announceFilterResults is called after animation completes in filterProjects()
      } else {
        setActiveButton(button);
        filterProjects(filter);
        // announceFilterResults is called after animation completes in filterProjects()
      }
    });
  });

  // Keyboard navigation for filter buttons (roving tabindex pattern)
  filterButtons.forEach((button, index) => {
    button.addEventListener("keydown", (e) => {
      const lastIndex = filterButtons.length - 1;
      let targetIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          targetIndex = index >= lastIndex ? 0 : index + 1;
          break;

        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          targetIndex = index <= 0 ? lastIndex : index - 1;
          break;

        case "Home":
          e.preventDefault();
          targetIndex = 0;
          break;

        case "End":
          e.preventDefault();
          targetIndex = lastIndex;
          break;

        default:
          return;
      }

      const targetButton = filterButtons[targetIndex];
      updateTabindex(targetButton);
      targetButton.focus();
    });
  });
}

/**
 * Scroll Animation Functionality
 * - Fade + Slide Up effect when elements enter viewport
 * - Stagger effect for grouped elements (cards, skills, links)
 * - Respects prefers-reduced-motion (CSS handles this)
 * @returns {void}
 */
function initScrollAnimations() {
  // Skip if user prefers reduced motion (CSS will show elements immediately)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  // Use double requestAnimationFrame to ensure browser has painted
  // the initial hidden state before we start observing.
  // This prevents elements from appearing without animation.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupAnimationObserver();
    });
  });
}

/**
 * Set up Intersection Observer for scroll animations
 * @returns {void}
 */
function setupAnimationObserver() {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px 0px -50px 0px", // Trigger 50px before fully entering viewport
    threshold: 0.1, // Trigger when 10% of element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Skip if element is hidden by project filter
        if (element.classList.contains("project-card--hidden")) {
          return;
        }

        const delay = parseInt(element.dataset.animateDelay || "0", 10);

        // Apply animation with stagger delay
        setTimeout(() => {
          element.classList.add("is-visible");
        }, delay);

        // Stop observing after animation (performance optimization)
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach((element) => observer.observe(element));
}
