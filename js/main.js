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

  // Initialize project detail modal
  initProjectModal();
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
      } catch {
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
  } catch {
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
 * - URL hash integration for shareable filter links (#filter=backend)
 * - Browser back/forward navigation support
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

  // Valid filter categories (single source of truth)
  const VALID_CATEGORIES = ["all", "backend", "iot", "web", "tools"];

  /**
   * Calculate project counts per category
   * @returns {Object} Map of category to count (e.g., { all: 7, backend: 1, ... })
   */
  function calculateCategoryCounts() {
    const counts = { all: projectCards.length };

    VALID_CATEGORIES.forEach((cat) => {
      if (cat !== "all") counts[cat] = 0;
    });

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      if (category in counts) {
        counts[category]++;
      }
    });

    return counts;
  }

  /**
   * Inject counts into filter button labels
   * Uses each button's existing text as the base label to preserve casing (e.g., "IoT")
   * Adds aria-label for clean screen reader output
   * @param {Object} counts - Category to count map
   */
  function updateButtonLabels(counts) {
    filterButtons.forEach((button) => {
      const category = button.dataset.filter;
      const baseLabel = button.textContent.trim();
      const count = counts[category] || 0;

      // Build label with aria-hidden count to prevent double announcement
      // Screen readers read only the aria-label; sighted users see "Backend (3)"
      button.textContent = "";
      button.appendChild(document.createTextNode(`${baseLabel} `));
      const countSpan = document.createElement("span");
      countSpan.setAttribute("aria-hidden", "true");
      countSpan.textContent = `(${count})`;
      button.appendChild(countSpan);

      button.setAttribute(
        "aria-label",
        `${baseLabel}, ${count} project${count === 1 ? "" : "s"}`
      );
    });
  }

  /**
   * Parse and validate URL hash to get filter category
   * @returns {string} Valid category or "all" for invalid/missing hash
   */
  function getCategoryFromHash() {
    const hash = window.location.hash; // e.g., "#filter=backend"
    const match = hash.match(/^#filter=([a-z]+)$/);
    if (!match) return "all";

    const category = match[1];
    return VALID_CATEGORIES.includes(category) ? category : "all";
  }

  /**
   * Update URL hash to match filter state
   * Uses pushState for browser history navigation support
   * @param {string} category - Active filter category
   */
  function updateHash(category) {
    const newHash = category === "all" ? "" : `#filter=${category}`;
    const newUrl = window.location.pathname + window.location.search + newHash;
    history.pushState(null, "", newUrl);
  }

  /**
   * Apply filter from URL hash (on page load or browser navigation)
   * Does NOT update hash to prevent circular updates
   * Moves focus to active button only if focus is already in filter toolbar
   */
  function applyHashFilter() {
    const category = getCategoryFromHash();
    activateFilter(category, { shouldUpdateHash: false, conditionalFocus: true });
  }

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
    // All visible cards exit (fade out), all target cards enter (fade in).
    // Cards visible in both states go through the full exit→enter cycle
    // to avoid layout jumps from CSS columns reflow.
    const cardsToShow = [];
    const cardsToHide = [];

    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === "all" || cardCategory === category;
      const isCurrentlyHidden = card.classList.contains("project-card--hidden");

      // Clean up any stale animation classes from interrupted animations
      cleanupAnimationClasses(card);

      if (!isCurrentlyHidden) {
        cardsToHide.push(card);
      }
      if (shouldShow) {
        cardsToShow.push(card);
      }
    });

    // Nothing to animate (e.g., clicking the already-active filter)
    if (cardsToHide.length === 0 && cardsToShow.length === 0) {
      currentFilter = category;
      return;
    }

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      // Hide all non-target cards, show all target cards
      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === "all" || cardCategory === category;
        card.classList.toggle("project-card--hidden", !shouldShow);
      });
      currentFilter = category;
      announceFilterResults(category, cardsToShow.length);
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

    // Announce results immediately (before animations) for instant screen reader feedback
    announceFilterResults(category, cardsToShow.length);

    // Mark animation as in progress
    isAnimating = true;

    // Calculate when entrance should start:
    // - If cards are exiting, wait for exit to finish before entrance
    // - If no cards to exit, entrance starts immediately
    const entranceDelay = cardsToHide.length > 0 ? animationDuration : 0;

    // PHASE 1: Start exit animations for cards being hidden
    cardsToHide.forEach((card) => {
      card.classList.add("project-card--filtering-out");
    });

    // PHASE 2: After exit animation, remove from layout + start entrance
    const exitTimeout = setTimeout(() => {
      // Remove exiting cards from layout
      cardsToHide.forEach((card) => {
        card.classList.remove("project-card--filtering-out");
        card.classList.add("project-card--hidden");
      });

      // PHASE 3: Prepare entrance (set start state after layout settles)
      cardsToShow.forEach((card) => {
        card.classList.remove("project-card--hidden");
        card.classList.add("project-card--filtering-in");
      });

      // PHASE 4: Trigger entrance with stagger
      // Force style recalculation so browser paints start state before transition
      if (cardsToShow.length > 0) {
        void cardsToShow[0].offsetHeight;
      }

      cardsToShow.forEach((card, index) => {
        const delay = index * staggerDelay;

        const staggerTimeout = setTimeout(() => {
          card.classList.add("is-filtering");
        }, delay);
        animationTimeouts.push(staggerTimeout);
      });

      // Clean up after all entrance animations complete
      const totalEntranceTime =
        animationDuration + cardsToShow.length * staggerDelay;
      const cleanupTimeout = setTimeout(() => {
        cardsToShow.forEach((card) => {
          card.classList.remove("project-card--filtering-in", "is-filtering");
          // Ensure card has scroll animation's visible state so it doesn't
          // revert to [data-animate] opacity: 0 after filter classes are removed
          card.classList.add("is-visible");
        });

        // Update state only after all animations complete
        currentFilter = category;
        isAnimating = false;
      }, totalEntranceTime);
      animationTimeouts.push(cleanupTimeout);
    }, entranceDelay);
    animationTimeouts.push(exitTimeout);
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
   * @param {number} visibleCount - Number of visible projects
   */
  function announceFilterResults(category, visibleCount) {
    const liveRegion = document.getElementById("filter-status");
    if (!liveRegion) return;

    const plural = visibleCount === 1 ? "" : "s";

    if (category === "all") {
      liveRegion.textContent = `Showing all ${visibleCount} project${plural}`;
    } else {
      // Get display label with correct casing from button text (e.g., "IoT" not "iot")
      const button = document.querySelector(`[data-filter="${category}"]`);
      const displayLabel = button
        ? button.textContent.trim().replace(/\s*\(\d+\)\s*$/, "")
        : category;
      liveRegion.textContent =
        `Showing ${visibleCount} ${displayLabel} project${plural}`;
    }
  }

  /**
   * Reset filter to show all projects.
   * No-op if already showing all.
   */
  function resetFilter() {
    if (currentFilter === "all") return;
    setActiveButton(allButton);
    allButton.focus();
    filterProjects("all");
    updateHash("all");
  }

  /**
   * Activate a specific category filter.
   * No-op if already showing the requested category (unless mid-animation,
   * where currentFilter may be stale from cancelled animation cleanup).
   * @param {string} category - Category to activate
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.shouldUpdateHash=true] - Whether to update URL hash
   * @param {boolean} [options.conditionalFocus=false] - Move focus only if already in toolbar
   */
  function activateFilter(category, { shouldUpdateHash = true, conditionalFocus = false } = {}) {
    if (category === currentFilter && !isAnimating) return;

    const targetButton = document.querySelector(`[data-filter="${category}"]`);
    if (!targetButton) return;

    setActiveButton(targetButton);

    if (conditionalFocus) {
      const isInToolbar = Array.from(filterButtons).includes(document.activeElement);
      if (isInToolbar) {
        targetButton.focus();
      }
    }

    filterProjects(category);

    if (shouldUpdateHash) {
      updateHash(category);
    }
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
        resetFilter();
      } else {
        activateFilter(filter);
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

        case "Escape":
          e.preventDefault();
          resetFilter();
          return;

        default:
          return;
      }

      const targetButton = filterButtons[targetIndex];
      updateTabindex(targetButton);
      targetButton.focus();
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", () => {
    applyHashFilter();
  });

  // Initialize button labels with project counts
  const categoryCounts = calculateCategoryCounts();
  updateButtonLabels(categoryCounts);

  // Apply initial filter from URL hash on page load
  const initialCategory = getCategoryFromHash();
  if (initialCategory !== "all") {
    applyHashFilter();
  }
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

/**
 * Project Detail Modal
 * - Opens a modal overlay with extended project information
 * - Data fetched lazily from data/projects.json on first open
 * - Focus trap, ESC to close, backdrop click to close
 * - URL hash integration (#project=rating-bot) coexists with #filter= hashes
 * - Restores focus to the triggering card on close
 * - Scroll lock prevents background scrolling when modal is open
 */
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const backdrop = modal ? modal.querySelector(".project-modal__backdrop") : null;
  const dialog = modal ? modal.querySelector(".project-modal__dialog") : null;

  if (!modal || !backdrop || !dialog) return;

  // State
  let projectsData = null; // Cached JSON data
  let isOpen = false;
  let triggerElement = null; // Element that opened the modal (for focus restore)

  /**
   * Fetch project data from JSON file (lazy, cached)
   * @returns {Promise<Object|null>} Projects data object or null on error
   */
  async function fetchProjectData() {
    if (projectsData) return projectsData;

    try {
      const response = await fetch("data/projects.json");
      if (!response.ok) return null;
      projectsData = await response.json();
      return projectsData;
    } catch {
      return null;
    }
  }

  /**
   * Render modal content from project data using safe DOM methods.
   * All text content is inserted via textContent (not innerHTML) to prevent XSS.
   * The project data comes from our own JSON file (data/projects.json),
   * but we use safe DOM construction as a defense-in-depth measure.
   * @param {string} projectId - Project key in the JSON data
   * @param {Object} project - Project data object
   */
  function renderModalContent(projectId, project) {
    const categoryClass = project.category.toLowerCase();

    // Clear previous content
    while (dialog.firstChild) {
      dialog.removeChild(dialog.firstChild);
    }

    // ── Header ──
    const header = createElement("div", "project-modal__header");

    const headerInfo = createElement("div", "project-modal__header-info");
    const title = createElement("h2", "project-modal__title");
    title.id = "project-modal-title";
    title.textContent = project.title;
    headerInfo.appendChild(title);

    const categoryBadge = createElement(
      "span",
      `project-modal__category project-modal__category--${categoryClass}`
    );
    categoryBadge.textContent = project.category;
    headerInfo.appendChild(categoryBadge);
    header.appendChild(headerInfo);

    const closeBtn = createElement("button", "project-modal__close");
    closeBtn.setAttribute("aria-label", "Close project details");
    closeBtn.setAttribute("data-modal-close", "");
    closeBtn.insertAdjacentHTML(
      "afterbegin",
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    );
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // ── Body ──
    const body = createElement("div", "project-modal__body");

    // Description paragraphs
    const descDiv = createElement("div", "project-modal__description");
    project.description.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      descDiv.appendChild(p);
    });
    body.appendChild(descDiv);

    // Technical Highlights
    const highlightsSection = document.createElement("section");
    const highlightsTitle = createElement("h3", "project-modal__section-title");
    highlightsTitle.textContent = "Technical Highlights";
    highlightsSection.appendChild(highlightsTitle);

    const highlightsList = createElement("ul", "project-modal__highlights");
    project.highlights.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      highlightsList.appendChild(li);
    });
    highlightsSection.appendChild(highlightsList);
    body.appendChild(highlightsSection);

    // Tech Stack
    const techSection = document.createElement("section");
    const techTitle = createElement("h3", "project-modal__section-title");
    techTitle.textContent = "Tech Stack";
    techSection.appendChild(techTitle);

    const techList = createElement("ul", "project-modal__tech");
    project.tech.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      techList.appendChild(li);
    });
    techSection.appendChild(techList);
    body.appendChild(techSection);

    // Screenshots
    if (project.screenshots && project.screenshots.length > 0) {
      const screenshotsSection = document.createElement("section");
      const screenshotsTitle = createElement("h3", "project-modal__section-title");
      screenshotsTitle.textContent = "Screenshots";
      screenshotsSection.appendChild(screenshotsTitle);

      const screenshotsGrid = createElement("div", "project-modal__screenshots");
      project.screenshots.forEach((s) => {
        const figure = createElement("figure", "project-modal__screenshot");
        const img = document.createElement("img");
        img.src = s.src;
        img.alt = s.alt;
        img.loading = "lazy";
        img.width = 640;
        img.height = 360;
        figure.appendChild(img);
        screenshotsGrid.appendChild(figure);
      });
      screenshotsSection.appendChild(screenshotsGrid);
      body.appendChild(screenshotsSection);
    }

    // Links
    if (project.links) {
      const linksSection = document.createElement("section");
      const linksTitle = createElement("h3", "project-modal__section-title");
      linksTitle.textContent = "Links";
      linksSection.appendChild(linksTitle);

      const linksDiv = createElement("div", "project-modal__links");
      appendProjectLinks(linksDiv, project.links);
      linksSection.appendChild(linksDiv);
      body.appendChild(linksSection);
    }

    dialog.appendChild(body);

    // ── Footer ──
    const footer = createElement("div", "project-modal__footer");
    const updatedSpan = document.createElement("span");
    updatedSpan.textContent = "Updated " + project.updated;
    footer.appendChild(updatedSpan);

    if (project.status) {
      const statusSpan = createElement("span", "project-modal__status");
      const statusDot = createElement("span", "project-modal__status-dot");
      statusDot.setAttribute("aria-hidden", "true");
      statusSpan.appendChild(statusDot);
      statusSpan.appendChild(document.createTextNode(project.status));
      footer.appendChild(statusSpan);
    }

    dialog.appendChild(footer);
  }

  /**
   * Create an element with a className
   * @param {string} tag - HTML tag name
   * @param {string} className - CSS class(es)
   * @returns {HTMLElement}
   */
  function createElement(tag, className) {
    const el = document.createElement(tag);
    el.className = className;
    return el;
  }

  /**
   * Append project links (GitHub, Demo) to a container
   * Uses static SVG icons (trusted, not from JSON data)
   * @param {HTMLElement} container - Parent element
   * @param {Object} links - Links object { github, demo }
   */
  function appendProjectLinks(container, links) {
    if (links.github) {
      const a = document.createElement("a");
      a.href = links.github;
      a.className = "project-modal__link";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      // Static SVG icon (not from user data)
      a.insertAdjacentHTML(
        "afterbegin",
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>'
      );
      a.appendChild(document.createTextNode(" View on GitHub"));
      container.appendChild(a);
    }

    if (links.demo) {
      const a = document.createElement("a");
      a.href = links.demo;
      a.className = "project-modal__link";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      // Static SVG icon (not from user data)
      a.insertAdjacentHTML(
        "afterbegin",
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
      );
      a.appendChild(document.createTextNode(" Live Demo"));
      container.appendChild(a);
    }
  }

  /**
   * Open the project modal
   * @param {string} projectId - Project identifier matching JSON key
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.updateHash=true] - Whether to update URL hash
   */
  async function openModal(projectId, { updateHash = true } = {}) {
    if (isOpen) return;

    const data = await fetchProjectData();
    if (!data || !data[projectId]) return;

    const project = data[projectId];

    // Render content using safe DOM methods
    renderModalContent(projectId, project);

    // Update aria-labelledby
    modal.setAttribute("aria-labelledby", "project-modal-title");

    // Show modal
    modal.removeAttribute("hidden");

    // Force reflow before adding open class (ensures CSS transition plays)
    void modal.offsetHeight;

    modal.classList.add("project-modal--open");
    document.body.classList.add("modal-open");
    isOpen = true;

    // Update URL hash
    if (updateHash) {
      const newHash = "#project=" + projectId;
      const newUrl = window.location.pathname + window.location.search + newHash;
      history.pushState(null, "", newUrl);
    }

    // Focus the close button after the modal becomes visible.
    // Use setTimeout to ensure the element is focusable after visibility
    // transition settles (CSS visibility: hidden -> visible prevents focus).
    setTimeout(() => {
      if (!isOpen) return;
      const closeButton = dialog.querySelector("[data-modal-close]");
      if (closeButton) {
        closeButton.focus();
      }
    }, 50);

    // Add event listeners
    modal.addEventListener("click", handleModalClick);
    document.addEventListener("keydown", handleModalKeydown);
  }

  /**
   * Close the project modal
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.updateHash=true] - Whether to update URL hash
   */
  function closeModal({ updateHash = true } = {}) {
    if (!isOpen) return;

    modal.classList.remove("project-modal--open");
    document.body.classList.remove("modal-open");
    isOpen = false;

    // Remove event listeners
    modal.removeEventListener("click", handleModalClick);
    document.removeEventListener("keydown", handleModalKeydown);

    // Update URL hash (remove #project=...)
    if (updateHash) {
      const newUrl = window.location.pathname + window.location.search;
      history.pushState(null, "", newUrl);
    }

    // Restore focus to the triggering element
    if (triggerElement) {
      triggerElement.focus();
      triggerElement = null;
    }

    // Wait for transition to finish before hiding
    const duration = getModalAnimationDuration();
    setTimeout(() => {
      if (!isOpen) {
        modal.setAttribute("hidden", "");
        // Clear content after hide transition
        while (dialog.firstChild) {
          dialog.removeChild(dialog.firstChild);
        }
      }
    }, duration);
  }

  /**
   * Get modal animation duration from CSS custom property
   * @returns {number} Duration in milliseconds
   */
  function getModalAnimationDuration() {
    const rootStyles = getComputedStyle(document.documentElement);
    return parseInt(
      rootStyles.getPropertyValue("--modal-animation-duration") || "250",
      10
    );
  }

  /**
   * Handle clicks inside the modal (backdrop click to close, close button)
   * @param {MouseEvent} e
   */
  function handleModalClick(e) {
    // Close button click
    if (e.target.closest("[data-modal-close]")) {
      closeModal();
      return;
    }

    // Backdrop click (click is on the backdrop element itself, not the dialog)
    if (e.target === backdrop) {
      closeModal();
    }
  }

  /**
   * Handle keyboard events when modal is open
   * @param {KeyboardEvent} e
   */
  function handleModalKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    // Focus trap: Tab / Shift+Tab
    if (e.key === "Tab") {
      trapFocus(e);
    }
  }

  /**
   * Trap focus within the modal dialog
   * Cycles through focusable elements with Tab/Shift+Tab
   * @param {KeyboardEvent} e
   */
  function trapFocus(e) {
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = dialog.querySelectorAll(focusableSelectors);

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Parse URL hash for project modal
   * @returns {string|null} Project ID or null if no project hash
   */
  function getProjectFromHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#project=([a-z0-9-]+)$/);
    return match ? match[1] : null;
  }

  // ── Card click handlers ──────────────────────────────────

  const clickableCards = document.querySelectorAll(".project-card[data-project]");

  clickableCards.forEach((card) => {
    const projectId = card.dataset.project;
    if (!projectId) return;

    const detailsBtn = card.querySelector(".project-card__details-btn");

    // Mouse: clicking card body (outside links) opens modal
    // Focus restores to the details button (keyboard-accessible anchor)
    card.addEventListener("click", (e) => {
      // Don't intercept clicks on links or the details button inside the card
      if (e.target.closest("a") || e.target.closest(".project-card__details-btn")) return;

      triggerElement = detailsBtn || card;
      openModal(projectId);
    });

    // Keyboard: the "View Details" button provides the accessible entry point
    // This avoids nested-interactive issues (article with role=button containing <a> links)
    if (detailsBtn) {
      detailsBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent card click handler from also firing
        triggerElement = detailsBtn;
        openModal(projectId);
      });
    }
  });

  // ── Hash-based navigation ──────────────────────────────────

  // Handle popstate (browser back/forward)
  window.addEventListener("popstate", () => {
    const projectId = getProjectFromHash();
    if (projectId && !isOpen) {
      openModal(projectId, { updateHash: false });
    } else if (!projectId && isOpen) {
      closeModal({ updateHash: false });
    }
  });

  // Apply initial hash on page load
  const initialProject = getProjectFromHash();
  if (initialProject) {
    openModal(initialProject, { updateHash: false });
  }
}
