// Console welcome message
console.log("If you're curious about if we might enjoy interacting,\nreach out.\n\nit's just my full name at gmail");

/**
 * Browser Environment - Abstracts DOM and Window APIs for testability
 * Provides a clean interface for browser dependencies that can be easily mocked
 */
class BrowserEnvironment {
  /**
   * Create a BrowserEnvironment instance
   * @param {Document} [doc=document] - Document object to use
   * @param {Window} [win=window] - Window object to use
   * @constructor
   */
  constructor(doc = document, win = window) {
    this.document = doc;
    this.window = win;
  }

  /**
   * Get element by ID
   * @param {string} id - Element ID
   * @returns {Element|null} Found element or null
   * @public
   */
  getElementById(id) {
    return this.document.getElementById(id);
  }

  /**
   * Query selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} Found element or null
   * @public
   */
  querySelector(selector) {
    return this.document.querySelector(selector);
  }

  /**
   * Query all elements matching selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} Found elements
   * @public
   */
  querySelectorAll(selector) {
    return this.document.querySelectorAll(selector);
  }

  /**
   * Create element
   * @param {string} tagName - Tag name
   * @returns {Element} Created element
   * @public
   */
  createElement(tagName) {
    return this.document.createElement(tagName);
  }

  /**
   * Add event listener to document
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @public
   */
  addDocumentListener(event, handler) {
    this.document.addEventListener(event, handler);
  }

  /**
   * Add event listener to window
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @public
   */
  addWindowListener(event, handler) {
    this.window.addEventListener(event, handler);
  }

  /**
   * Get window inner width
   * @returns {number} Window width
   * @public
   */
  getWindowWidth() {
    return this.window.innerWidth;
  }

  /**
   * Get window inner height
   * @returns {number} Window height
   * @public
   */
  getWindowHeight() {
    return this.window.innerHeight;
  }

  /**
   * Get page Y offset
   * @returns {number} Scroll position
   * @public
   */
  getPageYOffset() {
    return this.window.pageYOffset || this.document.documentElement.scrollTop;
  }

  /**
   * Get document height
   * @returns {number} Document height
   * @public
   */
  getDocumentHeight() {
    return this.document.documentElement.scrollHeight;
  }

  /**
   * Scroll to position
   * @param {Object} options - Scroll options
   * @public
   */
  scrollTo(options) {
    this.window.scrollTo(options);
  }

  /**
   * Get media query match
   * @param {string} query - Media query string
   * @returns {MediaQueryList} Media query list
   * @public
   */
  matchMedia(query) {
    return this.window.matchMedia(query);
  }

  /**
   * Get document ready state
   * @returns {string} Ready state
   * @public
   */
  getReadyState() {
    return this.document.readyState;
  }

  /**
   * Get document element
   * @returns {Element} Document element
   * @public
   */
  getDocumentElement() {
    return this.document.documentElement;
  }

  /**
   * Get document body
   * @returns {Element} Document body
   * @public
   */
  getBody() {
    return this.document.body;
  }

  /**
   * Request animation frame
   * @param {Function} callback - Callback function
   * @returns {number} Request ID
   * @public
   */
  requestAnimationFrame(callback) {
    return this.window.requestAnimationFrame(callback);
  }

  /**
   * Set timeout
   * @param {Function} callback - Callback function
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID
   * @public
   */
  setTimeout(callback, delay) {
    return this.window.setTimeout(callback, delay);
  }

  /**
   * Clear timeout
   * @param {number} id - Timeout ID
   * @public
   */
  clearTimeout(id) {
    this.window.clearTimeout(id);
  }
}

/**
 * Theme Manager - Handles dark/light mode toggle functionality
 * Provides automatic theme detection, manual toggle, and persistent storage
 */
class ThemeManager {
  /**
   * Create a ThemeManager instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.themeToggle = null;
    this.toggleSlider = null;
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    if (this.browser.getReadyState() === 'loading') {
      this.browser.addDocumentListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.themeToggle = this.browser.getElementById('theme-toggle');
    this.toggleSlider = this.browser.getElementById('toggle-slider');

    if (!this.themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    this.initializeTheme();
    this.setupEventListeners();
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = this.browser.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemTheme;
    this.applyTheme(this.currentTheme);
  }

  setupEventListeners() {
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.browser.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  /**
   * Toggle between light and dark themes
   * Saves preference to localStorage for persistence
   * @public
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  /**
   * Apply the specified theme to the document
   * Updates DOM classes and accessibility attributes
   * @param {string} theme - Theme to apply ('light' or 'dark')
   * @public
   */
  applyTheme(theme) {
    const html = this.browser.getDocumentElement();
    
    if (theme === 'dark') {
      html.classList.add('dark');
      this.updateToggleUI(true);
    } else {
      html.classList.remove('dark');
      this.updateToggleUI(false);
    }
    
    this.currentTheme = theme;
    
    // Update aria-checked for accessibility (role="switch" uses aria-checked)
    if (this.themeToggle) {
      this.themeToggle.setAttribute('aria-checked', theme === 'dark');
    }
  }

  updateToggleUI(isDark) {
    if (!this.toggleSlider) return;

    if (isDark) {
      this.toggleSlider.classList.remove('translate-x-1');
      this.toggleSlider.classList.add('translate-x-6');
    } else {
      this.toggleSlider.classList.remove('translate-x-6');
      this.toggleSlider.classList.add('translate-x-1');
    }
  }
}

/**
 * Heading Generator - Handles TOC generation from content headings
 * Extracts headings from post content and creates navigation structure
 */
class HeadingGenerator {
  /**
   * Create a HeadingGenerator instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.headings = [];
  }

  /**
   * Generate table of contents from post content headings
   * @param {Element} tocList - The TOC list element to populate
   * @returns {Element[]} Array of heading elements found
   * @public
   */
  generateTOC(tocList) {
    const postContent = this.browser.querySelector('.post-content');
    if (!postContent) {
      console.warn('Post content not found');
      return [];
    }

    this.headings = postContent.querySelectorAll('h2');
    
    if (this.headings.length === 0) {
      console.log('No headings found for TOC');
      return [];
    }

    console.log(`Found ${this.headings.length} headings for TOC`);
    tocList.innerHTML = '';

    this.headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = this.generateHeadingId(heading.textContent, index);
      }

      const li = this.browser.createElement('li');
      const a = this.browser.createElement('a');
      
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.setAttribute('data-heading-id', heading.id);
      a.className = `toc-${heading.tagName.toLowerCase()}`;
      
      li.appendChild(a);
      tocList.appendChild(li);
    });

    return this.headings;
  }

  /**
   * Generate a unique ID for a heading
   * @param {string} text - The heading text content
   * @param {number} index - Fallback index for uniqueness
   * @returns {string} Generated heading ID
   * @private
   */
  generateHeadingId(text, index) {
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .substring(0, 50);

    if (!id || this.browser.getElementById(id)) {
      id = `heading-${index}`;
    }
    
    return id;
  }

  /**
   * Get the generated headings array
   * @returns {Element[]} Array of heading elements
   * @public
   */
  getHeadings() {
    return this.headings;
  }
}

/**
 * Scroll Tracker - Handles scroll-based active heading detection
 * Manages the highlighting of current section in TOC during scroll
 */
class ScrollTracker {
  /**
   * Create a ScrollTracker instance
   * @param {Element[]} headings - Array of heading elements to track
   * @param {Element} tocList - TOC list element for updating active states
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(headings, tocList, browser = new BrowserEnvironment()) {
    this.headings = headings || [];
    this.tocList = tocList;
    this.browser = browser;
    this.activeHeading = null;
  }

  /**
   * Initialize scroll tracking with throttled event listener
   * @public
   */
  initScrollTracking() {
    let isThrottled = false;
    
    this.browser.addWindowListener('scroll', () => {
      if (!isThrottled) {
        this.updateActiveHeading();
        isThrottled = true;
        
        this.browser.setTimeout(() => {
          isThrottled = false;
          // Update one more time in case we missed the final position
          this.updateActiveHeading();
        }, 16); // ~60fps for smooth tracking
      }
    });

    this.updateActiveHeading();
  }

  /**
   * Update which heading is currently active based on scroll position
   * @public
   */
  updateActiveHeading() {
    if (this.headings.length === 0) return;

    const scrollTop = this.browser.getPageYOffset();
    const windowHeight = this.browser.getWindowHeight();
    const docHeight = this.browser.getDocumentHeight();
    
    let activeId = null;

    // Check if we're near the bottom of the page (within 100px)
    const isNearBottom = (scrollTop + windowHeight) >= (docHeight - 100);
    
    if (isNearBottom) {
      // When near bottom, always highlight the last heading
      activeId = this.headings[this.headings.length - 1].id;
    } else {
      // Normal logic for middle of page
      for (let i = 0; i < this.headings.length; i++) {
        const heading = this.headings[i];
        const rect = heading.getBoundingClientRect();
        
        if (rect.top <= windowHeight * 0.3) {
          activeId = heading.id;
        } else {
          break;
        }
      }
    }

    this.setActiveHeading(activeId);
  }

  /**
   * Set the active heading in the TOC
   * @param {string|null} headingId - ID of the heading to mark as active
   * @public
   */
  setActiveHeading(headingId) {
    if (this.activeHeading === headingId) return;

    const prevActive = this.tocList.querySelector('.active');
    if (prevActive) {
      prevActive.classList.remove('active');
    }

    if (headingId) {
      const newActive = this.tocList.querySelector(`a[data-heading-id="${headingId}"]`);
      if (newActive) {
        newActive.classList.add('active');
      }
    }

    this.activeHeading = headingId;
  }

  /**
   * Update the headings array (useful when content changes)
   * @param {Element[]} headings - New array of heading elements
   * @public
   */
  updateHeadings(headings) {
    this.headings = headings;
  }
}

/**
 * Table of Contents Manager - Orchestrates TOC functionality
 * Coordinates between HeadingGenerator, ScrollTracker, and UI interactions
 */
class TOCManager {
  /**
   * Create a TOCManager instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.tocToggle = null;
    this.tocPanel = null;
    this.tocOverlay = null;
    this.tocList = null;
    this.tocHamburger = null;
    this.tocClose = null;
    this.isOpen = false;
    
    // Initialize helper classes with shared browser environment
    this.headingGenerator = new HeadingGenerator(browser);
    this.scrollTracker = null; // Will be initialized after headings are generated
    
    this.init();
  }

  init() {
    if (this.browser.getReadyState() === 'loading') {
      this.browser.addDocumentListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.tocToggle = this.browser.getElementById('toc-toggle');
    this.tocPanel = this.browser.getElementById('toc-panel');
    this.tocOverlay = this.browser.getElementById('toc-overlay');
    this.tocList = this.browser.getElementById('toc-list');
    this.tocHamburger = this.browser.getElementById('toc-hamburger');
    this.tocClose = this.browser.getElementById('toc-close');

    if (!this.tocToggle || !this.tocPanel) {
      console.log('TOC elements not found - likely not on a blog post page');
      return;
    }

    console.log('TOC Manager initializing...');
    this.generateTOC();
    this.setupEventListeners();
    this.initScrollTracking();
    this.setInitialState();
    console.log('TOC Manager initialized successfully');
  }

  /**
   * Generate table of contents using HeadingGenerator
   * @public
   */
  generateTOC() {
    const headings = this.headingGenerator.generateTOC(this.tocList);
    
    if (headings.length === 0) {
      this.tocToggle.style.display = 'none';
      return;
    }

    // Initialize scroll tracker with the generated headings and shared browser environment
    this.scrollTracker = new ScrollTracker(headings, this.tocList, this.browser);
  }

  setupEventListeners() {
    this.tocToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('TOC toggle clicked');
      this.toggleTOC();
    });

    if (this.tocOverlay) {
      this.tocOverlay.addEventListener('click', () => {
        this.closeTOC();
      });
    }

    this.tocList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const headingId = e.target.getAttribute('data-heading-id');
        this.scrollToHeading(headingId);
        
        if (this.browser.getWindowWidth() < 1024) {
          this.closeTOC();
        }
      }
    });

    this.browser.addDocumentListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeTOC();
      }
    });

    // Professional viewport management
    let resizeTimeout;
    let currentViewportState = this.isDesktop() ? 'desktop' : 'mobile';
    
    this.browser.addWindowListener('resize', () => {
      const newViewportState = this.browser.getWindowWidth() >= 1024 ? 'desktop' : 'mobile';
      
      // Only act if viewport actually changed
      if (currentViewportState !== newViewportState) {
        // Immediate state management - prevent flash by managing visibility
        if (newViewportState === 'mobile' && this.isOpen) {
          // Close TOC immediately when switching to mobile to prevent full-screen flash
          this.closeTOC();
        }
        
        if (newViewportState === 'desktop') {
          // Remove mobile overlay when switching to desktop
          this.tocOverlay.classList.remove('visible');
        }
        
        currentViewportState = newViewportState;
      }
      
      // Debounced cleanup and final state handling
      this.browser.clearTimeout(resizeTimeout);
      resizeTimeout = this.browser.setTimeout(() => {
        this.handleViewportChange();
      }, 50);
    });
  }

  /**
   * Toggle TOC open/closed state
   * @public
   */
  toggleTOC() {
    console.log('Toggling TOC, currently open:', this.isOpen);
    if (this.isOpen) {
      this.closeTOC();
    } else {
      this.openTOC();
    }
  }

  /**
   * Open the TOC panel and update UI state
   * Handles both desktop and mobile display modes
   * @public
   */
  openTOC() {
    console.log('Opening TOC');
    this.isOpen = true;
    this.tocPanel.classList.remove('hidden');
    this.tocPanel.classList.add('visible');
    
    this.tocHamburger.classList.add('hidden');
    this.tocClose.classList.remove('hidden');
    
    if (this.browser.getWindowWidth() < 1024) {
      this.tocOverlay.classList.remove('hidden');
      this.tocOverlay.classList.add('visible');
      // Focus first TOC link on mobile for better UX
      const firstLink = this.tocList.querySelector('a');
      if (firstLink) {
        this.browser.setTimeout(() => firstLink.focus(), 150);
      }
    }

    this.tocToggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close the TOC panel and update UI state
   * Returns focus to toggle button for accessibility
   * @public
   */
  closeTOC() {
    console.log('Closing TOC');
    this.isOpen = false;
    this.tocPanel.classList.remove('visible');
    
    this.tocHamburger.classList.remove('hidden');
    this.tocClose.classList.add('hidden');
    
    this.tocOverlay.classList.remove('visible');
    this.tocToggle.setAttribute('aria-expanded', 'false');

    // Return focus to toggle button when closing TOC for accessibility
    this.tocToggle.focus();

    // Clean timeout for hidden class
    this.browser.setTimeout(() => {
      if (!this.isOpen) {
        this.tocPanel.classList.add('hidden');
        this.tocOverlay.classList.add('hidden');
      }
    }, 150); // Shorter delay to match transition
  }

  /**
   * Scroll to a specific heading with smooth animation
   * @param {string} headingId - ID of the heading to scroll to
   * @public
   */
  scrollToHeading(headingId) {
    const heading = this.browser.getElementById(headingId);
    if (heading) {
      const yOffset = -20; // TODO: Use CSS variable --scroll-offset
      const y = heading.getBoundingClientRect().top + this.browser.getPageYOffset() + yOffset;
      
      this.browser.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Initialize scroll tracking using ScrollTracker
   * @public
   */
  initScrollTracking() {
    if (this.scrollTracker) {
      this.scrollTracker.initScrollTracking();
    }
  }

  /**
   * Check if current viewport is desktop size
   * @returns {boolean} True if desktop viewport
   * @public
   */
  isDesktop() {
    return this.browser.getWindowWidth() >= 1024;
  }

  /**
   * Set initial TOC state based on viewport size
   * Desktop: Open by default, Mobile: Closed by default
   * @public
   */
  setInitialState() {
    // Open TOC by default on desktop, closed on mobile/tablet
    if (this.isDesktop()) {
      console.log('Desktop detected - opening TOC by default');
      this.openTOC();
    } else {
      console.log('Mobile/tablet detected - keeping TOC closed by default');
      // TOC is already closed by default (this.isOpen = false in constructor)
    }
  }

  /**
   * Handle viewport changes and adjust TOC state accordingly
   * @public
   */
  handleViewportChange() {
    // Auto-open TOC when switching to desktop, auto-close when switching to mobile
    if (this.isDesktop() && !this.isOpen) {
      console.log('Switched to desktop viewport - opening TOC');
      this.openTOC();
    } else if (!this.isDesktop() && this.isOpen) {
      console.log('Switched to mobile/tablet viewport - closing TOC');
      this.closeTOC();
    }
  }
}

/**
 * Bio Collapse Manager - Handles mobile bio expand/collapse functionality
 * Manages the "read more" functionality for biography content on mobile devices
 */
class BioCollapseManager {
  /**
   * Create a BioCollapseManager instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.bioContent = null;
    this.expandButton = null;
    this.init();
  }

  init() {
    if (this.browser.getReadyState() === 'loading') {
      this.browser.addDocumentListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.bioContent = this.browser.querySelector('.bio-content');
    this.expandButton = this.browser.querySelector('.bio-expand-btn');

    if (!this.bioContent || !this.expandButton) {
      console.log('Bio collapse elements not found - bio collapse functionality disabled');
      return;
    }

    console.log('Bio Collapse Manager initializing...');
    this.setupEventListeners();
    console.log('Bio Collapse Manager initialized successfully');
  }

  setupEventListeners() {
    this.expandButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.expandBio();
    });

    // Optional: Handle window resize to reset state if needed
    this.browser.addWindowListener('resize', () => {
      this.handleViewportChange();
    });
  }

  /**
   * Expand the biography content to show full text
   * @public
   */
  expandBio() {
    if (this.bioContent) {
      this.bioContent.classList.add('expanded');
      console.log('Bio expanded');
    }
  }

  /**
   * Handle viewport changes and reset bio state on desktop
   * @public
   */
  handleViewportChange() {
    // Reset to collapsed state when switching to desktop
    if (this.browser.getWindowWidth() > 768 && this.bioContent) {
      this.bioContent.classList.remove('expanded');
    }
  }
}

/**
 * Initialize the application and all required managers
 * Uses requestAnimationFrame for optimal performance and conditionally
 * loads only the managers needed for the current page type
 * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
 * @function
 * @public
 */
function initializeApp(browser = new BrowserEnvironment()) {
  // Use requestAnimationFrame for better performance
  browser.requestAnimationFrame(() => {
    // Always initialize theme manager
    browser.window.themeManager = new ThemeManager(browser);
    
    // Only initialize TOC manager on blog post pages
    const hasTOC = browser.getElementById('toc-panel');
    if (hasTOC) {
      browser.window.tocManager = new TOCManager(browser);
    }
    
    // Only initialize bio collapse manager on homepage
    const hasBioContent = browser.querySelector('.bio-content');
    if (hasBioContent) {
      browser.window.bioCollapseManager = new BioCollapseManager(browser);
    }
    
    // Add loaded class for transition optimizations
    browser.getBody().classList.add('loaded');
    
    // Performance mark for debugging
    if ('performance' in browser.window && 'mark' in browser.window.performance) {
      browser.window.performance.mark('app-initialized');
    }
    
    console.log('Static website initialized successfully');
  });
}

// Initialize immediately if DOM is ready, otherwise wait
const browserEnv = new BrowserEnvironment();
if (browserEnv.getReadyState() === 'loading') {
  browserEnv.addDocumentListener('DOMContentLoaded', () => initializeApp(browserEnv));
} else {
  initializeApp(browserEnv);
}
