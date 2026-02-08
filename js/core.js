// Site Configuration - All magic numbers in one place
const SITE_CONFIG = {
  // Scroll and viewport
  SCROLL_ACTIVE_ZONE: 0.3,        // 30% from top triggers active heading
  SCROLL_BOTTOM_THRESHOLD: 100,   // px from bottom to consider "at bottom"
  SCROLL_THROTTLE_MS: 16,          // ~60fps throttling for scroll events
  SCROLL_OFFSET: 80,               // px - Offset for fixed header when scrolling to headings
  
  // Breakpoints
  DESKTOP_BREAKPOINT: 1024,        // px - Desktop vs mobile/tablet
  BIO_MOBILE_BREAKPOINT: 768,      // px - Bio collapse breakpoint
  
  // Touch gestures
  SWIPE_THRESHOLD_PX: 100,         // Min swipe distance in pixels
  SWIPE_TIME_THRESHOLD: 800,       // Max time for valid swipe in ms
  SWIPE_VELOCITY_THRESHOLD: 0.2,   // Min velocity for swipe detection
  SWIPE_VISUAL_FEEDBACK: 0.3,      // Visual feedback multiplier
  SWIPE_MAX_VISUAL: 30,            // Max visual feedback in px
  
  // Animation timings
  ANIMATION_FAST: 150,              // ms - Fast transitions
  ANIMATION_NORMAL: 300,            // ms - Normal transitions
  ANIMATION_DEBOUNCE: 50,           // ms - Resize debounce
  ANIMATION_DELAY: 100,             // ms - Generic delay
  TOC_MOBILE_CLOSE_DELAY: 50,       // ms - Fast TOC close on mobile
  
  // Retry and loading
  IMAGE_RETRY_ATTEMPTS: 3,          // Max attempts to load theme image
  IMAGE_RETRY_BACKOFF: 1000,        // ms - Base backoff for retries
  
  // Other
  HEADING_EXCERPT_LENGTH: 50,       // Characters for heading ID generation
  IMAGE_BLUR_OPACITY: 0.5,          // Opacity when image is loading
};

// Safe localStorage wrapper - Prevents crashes in private browsing
const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Unable to access localStorage for key: ${key}`, error);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Unable to write to localStorage for key: ${key}`, error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Unable to remove from localStorage for key: ${key}`, error);
      return false;
    }
  }
};

// Safe initialization wrapper - Prevents one feature failure from breaking everything
class SafeInit {
  static initialize(className, setupFn) {
    try {
      const instance = setupFn();
      return instance;
    } catch (error) {
      console.error(`✗ ${className} failed to initialize:`, error);
      // Return null so code can check if feature is available
      return null;
    }
  }
}

// Console welcome message with ASCII art
console.log(`
 ██████╗ ██╗  ██╗
██╔════╝ ██║  ██║
██║  ███╗███████║
██║   ██║██╔══██║
╚██████╔╝██║  ██║
 ╚═════╝ ╚═╝  ╚═╝

Grant Heimbach

If you're curious about if we might enjoy interacting,
reach out.

it's just my full name at gmail
`);

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
   * Remove event listener from document
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @public
   */
  removeDocumentListener(event, handler) {
    this.document.removeEventListener(event, handler);
  }

  /**
   * Add event listener to window
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} [options] - Event listener options
   * @public
   */
  addWindowListener(event, handler, options) {
    this.window.addEventListener(event, handler, options);
  }

  /**
   * Remove event listener from window
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} [options] - Event listener options
   * @public
   */
  removeWindowListener(event, handler, options) {
    this.window.removeEventListener(event, handler, options);
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
   * Get window object
   * @returns {Window} Window object
   * @public
   */
  getWindow() {
    return this.window;
  }

  /**
   * Get document object
   * @returns {Document} Document object
   * @public
   */
  getDocument() {
    return this.document;
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

  /**
   * Check if Intersection Observer is supported
   * @returns {boolean} True if supported
   * @public
   */
  supportsIntersectionObserver() {
    return 'IntersectionObserver' in this.window;
  }

  /**
   * Check if History API is supported
   * @returns {boolean} True if supported
   * @public
   */
  supportsHistoryAPI() {
    return this.window.history && this.window.history.replaceState;
  }

  /**
   * Check if device is mobile based on viewport width
   * @returns {boolean} True if mobile device
   * @public
   */
  isMobileDevice() {
    return this.getWindowWidth() < 768;
  }

  /**
   * Get current scroll position
   * @returns {number} Scroll position from top
   * @public
   */
  getScrollTop() {
    return this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
  }

  /**
   * Scroll to specific position with smooth behavior
   * @param {number} position - Y position to scroll to
   * @public
   */
  scrollToPosition(position) {
    // Use faster scrolling on mobile for better responsiveness
    const isMobile = this.window.innerWidth < 1024;
    
    if (isMobile) {
      // Faster scroll for mobile - use requestAnimationFrame for smooth but quick scroll
      this.fastScrollTo(position);
    } else {
      // Standard smooth scroll for desktop
      this.window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  }
  
  fastScrollTo(targetPosition) {
    const startPosition = this.window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(600, Math.abs(distance) / 2); // Max 600ms, faster for short distances
    let startTime = null;
    
    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease-out function for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentPosition = startPosition + (distance * ease);
      
      this.window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }

  /**
   * Get currently focused element
   * @returns {Element|null} Active element
   * @public
   */
  getActiveElement() {
    return this.document.activeElement;
  }

  /**
   * Create a debounced function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   * @public
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

/**
 * Theme Manager - Handles dark/light mode toggle functionality and vibe themes
 * Provides automatic theme detection, manual toggle, persistent storage, and vibe check functionality
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
    this.isVibeMode = false;
    this.originalTheme = 'light'; // Store original theme when entering vibe mode
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
      return;
    }

    this.initializeTheme();
    this.setupEventListeners();
  }

  initializeTheme() {
    const savedTheme = storage.get('theme');
    const systemTheme = this.browser.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemTheme;
    this.applyTheme(this.currentTheme);
  }

  setupEventListeners() {
    // Store event handlers for proper cleanup
    this.themeToggleHandler = () => {
      this.toggleTheme();
    };
    
    this.systemThemeHandler = (e) => {
      if (!storage.get('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    };

    this.themeToggle.addEventListener('click', this.themeToggleHandler);

    this.systemThemeMediaQuery = this.browser.matchMedia('(prefers-color-scheme: dark)');
    this.systemThemeMediaQuery.addEventListener('change', this.systemThemeHandler);
  }

  /**
   * Toggle between light and dark themes
   * Saves preference to localStorage for persistence
   * Exits vibe mode if currently active
   * @public
   */
  toggleTheme() {
    // If in vibe mode, exit it first
    if (this.isVibeMode) {
      this.exitVibeMode();
      // Notify vibe check manager to reset UI
      if (this.browser.window.vibeCheckManager) {
        this.browser.window.vibeCheckManager.reset();
      }
    }
    
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    storage.set('theme', this.currentTheme);
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

  /**
   * Apply a vibe theme with custom color palette
   * @param {Object} themeColors - Object containing CSS custom property values
   * @public
   */
  applyVibeTheme(themeColors) {
    if (!this.isVibeMode) {
      // Store original theme before entering vibe mode
      this.originalTheme = this.currentTheme;
      this.isVibeMode = true;
    }

    const root = this.browser.getDocumentElement();
    
    // Apply vibe theme colors
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Exit vibe mode and return to original theme
   * @public
   */
  exitVibeMode() {
    if (!this.isVibeMode) return;

    const root = this.browser.getDocumentElement();
    
    // Clear all custom properties set by vibe themes
    const vibeProperties = [
      '--background', '--foreground', '--card', '--card-foreground',
      '--popover', '--popover-foreground', '--primary', '--primary-foreground',
      '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
      '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
      '--border', '--input', '--ring', '--link', '--link-hover'
    ];
    
    vibeProperties.forEach(property => {
      root.style.removeProperty(property);
    });

    // Restore original theme
    this.currentTheme = this.originalTheme;
    this.applyTheme(this.currentTheme);
    this.isVibeMode = false;
  }

  /**
   * Check if currently in vibe mode
   * @returns {boolean} True if in vibe mode
   * @public
   */
  getIsVibeMode() {
    return this.isVibeMode;
  }

  /**
   * Clean up theme manager resources and event listeners
   * @public
   */
  destroy() {
    // Remove event listeners to prevent memory leaks
    if (this.themeToggle && this.themeToggleHandler) {
      this.themeToggle.removeEventListener('click', this.themeToggleHandler);
    }
    
    if (this.systemThemeMediaQuery && this.systemThemeHandler) {
      this.systemThemeMediaQuery.removeEventListener('change', this.systemThemeHandler);
    }
    
    // Clear references
    this.themeToggle = null;
    this.toggleSlider = null;
    this.browser = null;
    this.themeToggleHandler = null;
    this.systemThemeHandler = null;
    this.systemThemeMediaQuery = null;
  }
}

// TOC classes are loaded from toc.js when needed

/**
 * Vibe Check Manager - Handles theme cycling easter egg functionality
 * Manages vibe theme switching, image display, and integration with ThemeManager
 */
class VibeCheckManager {
  /**
   * Create a VibeCheckManager instance
   * @param {ThemeManager} themeManager - Theme manager instance for theme control
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(themeManager, browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.themeManager = themeManager;
    this.vibeCheckBtn = null;
    this.vibeDisplay = null;
    this.vibeTitle = null;
    this.vibeImage = null;
    this.vibeError = null;
    this.linkedinIcon = null;
    
    this.themes = [];
    this.currentThemeIndex = 0;
    this.isLoaded = false;
    
    // Image optimization properties
    this.imageCache = new Map(); // Cache for loaded images
    this.preloadPromises = new Map(); // Track preloading promises
    this.imageLoadAttempts = new Map(); // Track retry attempts
    this.activeTimeouts = new Set(); // Track active timeouts for cleanup
    
    this.errorCount = 0; // Track error frequency
    this.lastErrorTime = null; // Prevent error spam
    this.isOperationInProgress = false; // Prevent concurrent operations
    
    // Setup error boundary
    this.setupErrorBoundary();
    
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
    this.vibeCheckBtn = this.browser.getElementById('vibe-check-btn');
    this.vibePanel = this.browser.getElementById('vibe-panel');
    this.vibeBackdrop = this.browser.getElementById('vibe-backdrop');
    this.vibePanelClose = this.browser.getElementById('vibe-panel-close');
    this.vibeTitle = this.browser.getElementById('vibe-title');
    this.vibeImage = this.browser.getElementById('vibe-image');
    this.vibeError = this.browser.getElementById('vibe-error');
    this.linkedinIcon = this.browser.getElementById('linkedin-icon');
    this.srAnnouncements = this.browser.getElementById('sr-announcements');
    this.globalLoading = this.browser.getElementById('global-loading');

    if (!this.vibeCheckBtn) {
      return;
    }

    this.setupEventListeners();
  }

    setupEventListeners() {
    // Store event handlers for proper cleanup
    this.vibeCheckHandler = () => {
      this.safeExecute(async () => {
        if (!this.isLoaded) {
          await this.loadThemes();
        } else {
          this.cycleToNextTheme();
        }
      }, 'theme-switch');
    };

    this.backdropClickHandler = () => {
      this.closePanel();
    };

    this.closeButtonHandler = () => {
      this.closePanel();
    };

    this.escapeKeyHandler = (e) => {
      if (e.key === 'Escape' && this.isPanelOpen()) {
        this.closePanel();
      }
    };

    // Add event listeners
    this.vibeCheckBtn.addEventListener('click', this.vibeCheckHandler);

    // Close panel when backdrop is clicked
    if (this.vibeBackdrop) {
      this.vibeBackdrop.addEventListener('click', this.backdropClickHandler);
    }

    // Close panel when close button is clicked
    if (this.vibePanelClose) {
      this.vibePanelClose.addEventListener('click', this.closeButtonHandler);
    }

    // Close panel when escape key is pressed
    this.browser.addDocumentListener('keydown', this.escapeKeyHandler);

    // Add touch swipe support for mobile/tablet
    this.setupTouchGestures();
  }

  /**
   * Load theme data from JSON file
   * @private
   */
  async loadThemes() {
    try {
      const response = await fetch('vibe-themes/theme-data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.themes = data.themes || [];
      
      if (this.themes.length === 0) {
        throw new Error('No themes found in data');
      }
      
      this.isLoaded = true;
      this.currentThemeIndex = 0;
      this.showVibeTheme();
      
    } catch (error) {
      console.error('Error loading vibe themes:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to load themes';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Connection failed - try using a local server';
      } else if (error.message.includes('HTTP')) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid theme data format';
      }
      
      this.showError(errorMessage);
    }
  }

  /**
   * Cycle to the next theme in the sequence
   * @private
   */
  cycleToNextTheme() {
    // Use modulo operator to wrap around to 0 when reaching end of array
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.showVibeTheme();
  }

  /**
   * Display the current vibe theme
   * @private
   */
  showVibeTheme() {
    if (!this.isLoaded || this.themes.length === 0) return;

    const currentTheme = this.themes[this.currentThemeIndex];
    
    // Hide error
    this.vibeError.classList.add('is-hidden');
    
    // Set theme title
    this.vibeTitle.textContent = currentTheme.name;

    // Load theme image with optimization
    this.loadThemeImage(currentTheme);
    
    // Show slide-up panel
    this.openPanel();
    
    // Apply theme colors
    this.themeManager.applyVibeTheme(currentTheme.colors);
    
    // Apply special theme styling based on theme name
    // First remove all existing theme classes to ensure clean state
    this.browser.getBody().classList.remove('synthwave-active', 'desert-pinon-active', 'texas-wildflower-active', 'falling-water-active', 'park-ranger-active', 'craftsman-comfort-active', 'cher-orleans-active', 'star-stuff-active', 'reader-beware-active');
    
    if (currentTheme.name === 'Synthwave Sunset') {
      this.browser.getBody().classList.add('synthwave-active');
    } else if (currentTheme.name === 'Desert Pinon') {
      this.browser.getBody().classList.add('desert-pinon-active');
    } else if (currentTheme.name === 'Texas Wildflower') {
      this.browser.getBody().classList.add('texas-wildflower-active');
    } else if (currentTheme.name === 'Falling Water') {
      this.browser.getBody().classList.add('falling-water-active');
    } else if (currentTheme.name === 'Park Ranger') {
      this.browser.getBody().classList.add('park-ranger-active');
    } else if (currentTheme.name === 'Craftsman Comfort') {
      this.browser.getBody().classList.add('craftsman-comfort-active');
    } else if (currentTheme.name === 'Cher Orleans') {
      this.browser.getBody().classList.add('cher-orleans-active');
    } else if (currentTheme.name === 'Star Stuff') {
      this.browser.getBody().classList.add('star-stuff-active');
    } else if (currentTheme.name === 'Reader Beware') {
      this.browser.getBody().classList.add('reader-beware-active');
    }
    
    // Announce theme change to screen readers with description and interaction help
    const themeDescription = this.getThemeDescription(currentTheme.name);
    const interactionInstructions = this.getInteractionInstructions();
    this.announceToScreenReader(`Applied ${currentTheme.name} theme: ${themeDescription}. Theme panel opened. ${interactionInstructions}`);
    
    
    // Preload next theme for smoother transitions
    this.preloadNextTheme();
  }

  /**
   * Load theme image with optimization and loading states
   * @param {Object} theme - Theme object with name and image properties
   * @private
   */
  async loadThemeImage(theme) {
    const imagePath = `vibe-themes/images/${theme.image}`;
    
    try {
      // Show loading state
      this.showImageLoading();
      
      // Try to load from cache or preload
      const img = await this.preloadImage(imagePath);
      
      // Update the display image
      this.vibeImage.src = img.src;
      this.vibeImage.alt = `${theme.name} theme`;
      
      // Hide loading state
      this.hideImageLoading();
      
    } catch (error) {
      // Hide loading state and show error
      this.hideImageLoading();
      console.error(`Failed to load image: ${theme.image}`, error);
      this.showError(`Failed to load image: ${theme.name}`);
    }
  }

  /**
   * Show error state
   * @param {string} [message] - Custom error message to display
   * @private
   */
  showError(message = 'Unable to load theme') {
    this.vibeError.textContent = message;
    this.vibeError.classList.remove('is-hidden');
    this.openPanel();
    
    // Announce error to screen readers with assertive priority
    this.announceToScreenReader(`Error: ${message}`, 'assertive');
  }

  /**
   * Open the slide-up panel
   * @private
   */
  openPanel() {
    if (this.vibePanel && this.vibeBackdrop) {
      this.vibePanel.classList.remove('is-hidden');
      this.vibeBackdrop.classList.remove('is-hidden');
      
      // Store the element that was focused before opening the panel
      this.lastFocusedElement = this.browser.getDocument().activeElement;
      
      // Use requestAnimationFrame to ensure smooth animation
      this.browser.requestAnimationFrame(() => {
        this.vibePanel.classList.add('is-visible');
        this.vibeBackdrop.classList.add('is-visible');
        
        // Move focus to the close button for keyboard accessibility
        this.createTrackedTimeout(() => {
          if (this.vibePanelClose) {
            this.vibePanelClose.focus();
          }
        }, SITE_CONFIG.ANIMATION_DELAY); // Small delay to ensure animation has started
      });
      
      // Add focus trap event listener
      this.setupFocusTrap();
    }
  }

  /**
   * Close the slide-up panel
   * @private
   */
  closePanel() {
    if (this.vibePanel && this.vibeBackdrop) {
      this.vibePanel.classList.remove('is-visible');
      this.vibeBackdrop.classList.remove('is-visible');
      
      // Remove focus trap
      this.removeFocusTrap();
      
      // Return focus to the element that was focused before opening the panel
      if (this.lastFocusedElement && this.lastFocusedElement.focus) {
        this.lastFocusedElement.focus();
      }
      
      // Announce panel closure to screen readers
      this.announceToScreenReader('Theme panel closed.');
      
      // Hide elements after animation completes
      this.createTrackedTimeout(() => {
        this.vibePanel.classList.add('is-hidden');
        this.vibeBackdrop.classList.add('is-hidden');
      }, SITE_CONFIG.ANIMATION_NORMAL); // Match CSS transition duration
    }
  }

  /**
   * Setup touch gesture support for mobile/tablet swipe-to-close
   * @private
   */
  setupTouchGestures() {
    if (!this.vibePanel) return;

    let startY = 0;
    let currentY = 0;
    let startTime = 0;
    let isDragging = false;
    const threshold = SITE_CONFIG.SWIPE_THRESHOLD_PX; // Minimum swipe distance in pixels
    const timeThreshold = SITE_CONFIG.SWIPE_TIME_THRESHOLD; // Maximum time for a valid swipe in ms
    const velocityThreshold = SITE_CONFIG.SWIPE_VELOCITY_THRESHOLD; // Minimum velocity for swipe detection

    // Touch start
    this.vibePanel.addEventListener('touchstart', (e) => {
      if (!this.isPanelOpen() || this.isMobileViewport() === false) return;
      
      // Don't interfere with button clicks
      if (e.target.closest('.vibe-panel-close')) {
        return;
      }
      
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = true;
      
      // Only prevent default for swipe gestures, not button clicks
      e.preventDefault();
    }, { passive: false });

    // Touch move
    this.vibePanel.addEventListener('touchmove', (e) => {
      if (!isDragging || !this.isPanelOpen()) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Only allow downward swipes (positive deltaY)
      if (deltaY > 0) {
        // Add subtle visual feedback by slightly moving the panel (unless reduced motion is preferred)
        if (!this.prefersReducedMotion()) {
          const translateY = Math.min(deltaY * SITE_CONFIG.SWIPE_VISUAL_FEEDBACK, SITE_CONFIG.SWIPE_MAX_VISUAL); // Cap visual feedback movement
          this.vibePanel.style.transform = `translateY(${translateY}px)`;
        }
        
        // Only prevent default when we're actually swiping
        e.preventDefault();
      }
    }, { passive: false });

    // Touch end
    this.vibePanel.addEventListener('touchend', (e) => {
      if (!isDragging || !this.isPanelOpen()) return;
      
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const velocity = Math.abs(deltaY) / deltaTime;
      
      // Reset panel position (only if we moved it due to motion preference)
      if (!this.prefersReducedMotion()) {
        this.vibePanel.style.transform = '';
      }
      
      // Check if swipe meets criteria for closing
      const isValidSwipe = deltaY > threshold && deltaTime < timeThreshold && velocity > velocityThreshold;
      const isDownwardSwipe = deltaY > 0;
      
      if (isValidSwipe && isDownwardSwipe) {
        this.closePanel();
      }
      
      // Reset tracking variables
      isDragging = false;
      startY = 0;
      currentY = 0;
      startTime = 0;
    });

    // Touch cancel (if touch is interrupted)
    this.vibePanel.addEventListener('touchcancel', () => {
      if (this.vibePanel && !this.prefersReducedMotion()) {
        this.vibePanel.style.transform = '';
      }
      isDragging = false;
      startY = 0;
      currentY = 0;
      startTime = 0;
    });
  }

  /**
   * Check if current viewport is mobile/tablet size (< 1024px)
   * @returns {boolean} True if mobile/tablet viewport
   * @private
   */
  isMobileViewport() {
    return this.browser.getWindowWidth() < SITE_CONFIG.DESKTOP_BREAKPOINT;
  }

  /**
   * Check if panel is currently open
   * @returns {boolean} True if panel is open
   * @private
   */
  isPanelOpen() {
    return this.vibePanel && this.vibePanel.classList.contains('is-visible');
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if reduced motion is preferred
   * @private
   */
  prefersReducedMotion() {
    return this.browser.window.matchMedia && 
           this.browser.window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Reset vibe check to initial state
   * Called when exiting vibe mode
   * @public
   */
  reset() {
    // Clear stored focus to prevent scroll jumping during theme toggle
    this.lastFocusedElement = null;
    
    this.closePanel();
    this.vibeError.classList.add('is-hidden');
    this.currentThemeIndex = 0;
    
    // Remove special theme styling
    this.browser.getBody().classList.remove('synthwave-active', 'desert-pinon-active', 'texas-wildflower-active', 'falling-water-active', 'park-ranger-active', 'craftsman-comfort-active', 'cher-orleans-active', 'star-stuff-active', 'reader-beware-active');
  }

  /**
   * Setup focus trap to keep focus within the panel
   * @private
   */
  setupFocusTrap() {
    // Remove any existing focus trap first
    this.removeFocusTrap();
    
    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab' && this.isPanelOpen()) {
        const focusableElements = this.getFocusableElements();
        
        // Only apply focus trap if we have focusable elements
        if (focusableElements.length === 0) {
          return;
        }
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = this.browser.getDocument().activeElement;

        // If shift+tab on first element, focus last element
        if (e.shiftKey && currentElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If tab on last element, focus first element  
        else if (!e.shiftKey && currentElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.browser.addDocumentListener('keydown', this.focusTrapHandler);
  }

  /**
   * Remove focus trap event listener
   * @private
   */
  removeFocusTrap() {
    if (this.focusTrapHandler) {
      this.browser.removeDocumentListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  /**
   * Get all focusable elements within the panel
   * @returns {Element[]} Array of focusable elements
   * @private
   */
  getFocusableElements() {
    if (!this.vibePanel || !this.isPanelOpen()) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])', 
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    try {
      const elements = this.vibePanel.querySelectorAll(focusableSelectors.join(','));
      return Array.from(elements).filter(el => {
        // Filter out hidden elements and ensure they're visible
        const style = this.browser.window.getComputedStyle(el);
        return el.offsetWidth > 0 && 
               el.offsetHeight > 0 && 
               style.visibility !== 'hidden' && 
               style.display !== 'none';
      });
    } catch (error) {
      console.warn('Error finding focusable elements:', error);
      return [];
    }
  }

  /**
   * Get descriptive information about a theme for screen readers
   * @param {string} themeName - Name of the theme
   * @returns {string} Descriptive text about the theme
   * @private
   */
  getThemeDescription(themeName) {
    const descriptions = {
      'Synthwave Sunset': 'a retro-futuristic 80s aesthetic with electric cyan text on deep purple backgrounds, featuring neon pink accents that evoke cyberpunk and synthwave vibes',
      'Desert Pinon': 'warm earthy tones inspired by the American Southwest, with soft beige backgrounds, brown text, and turquoise accent colors that capture the essence of desert landscapes',
      'Texas Wildflower': 'bright and cheerful with cream backgrounds and deep blue text, featuring golden yellow links that reflect the vibrant wildflower fields of Texas',
      'Falling Water': 'inspired by Frank Lloyd Wright\'s architectural masterpiece, with warm cream backgrounds, Cherokee red text, and golden accents that blend natural elements with modernist design',
      'Park Ranger': 'evokes WPA National Park poster art with warm beige backgrounds, dark brown text, and sky blue accents that capture the spirit of America\'s national parks',
      'Cher Orleans': 'channels the spirit of Mardi Gras with deep purple backgrounds, golden text, and rich green accents that capture the festive energy and mystery of New Orleans',
      'Star Stuff': 'a cosmic voyage through deep navy space with glowing cyan text, purple nebula highlights, and pink accents inspired by the wonder of the universe',
      'Reader Beware': 'a spooky Goosebumps-inspired palette with near-black backgrounds, eerie green text, and orange accents that evoke vintage horror paperback covers',
      'Craftsman Comfort': 'celebrates Arts and Crafts architecture with warm cream backgrounds, rich brown text, and copper-bronze accents that embody handcrafted quality and natural materials'
    };
    
    return descriptions[themeName] || 'a custom color scheme';
  }

  /**
   * Get interaction instructions based on current viewport
   * @returns {string} Instructions for closing the panel
   * @private
   */
  getInteractionInstructions() {
    const isMobile = this.isMobileViewport();
    if (isMobile) {
      return 'To close: swipe down, tap the close button, or tap outside the panel.';
    } else {
      return 'To close: press Escape, click the close button, or click outside the panel.';
    }
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} [priority='polite'] - Announcement priority ('polite' or 'assertive')
   * @private
   */
  announceToScreenReader(message, priority = 'polite') {
    if (!this.srAnnouncements || !message) return;

    // Set the priority
    this.srAnnouncements.setAttribute('aria-live', priority);
    
    // Clear previous message first to ensure new message is announced
    this.srAnnouncements.textContent = '';
    
    // Use setTimeout to ensure the clear happens before the new message
    this.createTrackedTimeout(() => {
      this.srAnnouncements.textContent = message;
    }, SITE_CONFIG.ANIMATION_DELAY);
  }

  /**
   * Preload an image with caching and retry logic
   * @param {string} imagePath - Path to the image
   * @param {number} [maxAttempts=3] - Maximum retry attempts
   * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
   * @private
   */
  async preloadImage(imagePath, maxAttempts = 3) {
    // Check if image is already cached
    if (this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath);
    }

    // Check if preloading is already in progress
    if (this.preloadPromises.has(imagePath)) {
      return this.preloadPromises.get(imagePath);
    }

    // Start preloading
    const preloadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      const currentAttempts = this.imageLoadAttempts.get(imagePath) || 0;

      img.onload = () => {
        // Cache the successful load
        this.imageCache.set(imagePath, img);
        this.imageLoadAttempts.delete(imagePath);
        this.preloadPromises.delete(imagePath);
        resolve(img);
      };

      img.onerror = () => {
        this.preloadPromises.delete(imagePath);
        
        if (currentAttempts < maxAttempts - 1) {
          // Retry after a delay
          this.imageLoadAttempts.set(imagePath, currentAttempts + 1);
          this.createTrackedTimeout(() => {
            this.preloadImage(imagePath, maxAttempts).then(resolve).catch(reject);
          }, SITE_CONFIG.IMAGE_RETRY_BACKOFF * (currentAttempts + 1)); // Exponential backoff
        } else {
          // Max attempts reached
          this.imageLoadAttempts.delete(imagePath);
          reject(new Error(`Failed to load image after ${maxAttempts} attempts: ${imagePath}`));
        }
      };

      img.src = imagePath;
    });

    this.preloadPromises.set(imagePath, preloadPromise);
    return preloadPromise;
  }

  /**
   * Preload the next theme image for smoother transitions
   * @private
   */
  preloadNextTheme() {
    if (!this.isLoaded || this.themes.length === 0) return;

    const nextIndex = (this.currentThemeIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    const imagePath = `vibe-themes/images/${nextTheme.image}`;

    // Preload in background without blocking
    this.preloadImage(imagePath).catch(error => {
      console.warn('Failed to preload next theme image:', error);
    });
  }

  /**
   * Show loading state on the image
   * @private
   */
  showImageLoading() {
    if (this.vibeImage) {
      this.vibeImage.style.opacity = SITE_CONFIG.IMAGE_BLUR_OPACITY;
      this.vibeImage.style.filter = 'blur(2px)';
    }
  }

  /**
   * Hide loading state on the image
   * @private
   */
  hideImageLoading() {
    if (this.vibeImage) {
      this.vibeImage.style.opacity = '1';
      this.vibeImage.style.filter = 'none';
    }
  }

  /**
   * Setup error boundary for the theme system
   * @private
   */
  setupErrorBoundary() {
    // Global error handler for unhandled promise rejections
    this.browser.addWindowListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection in theme system:', event.reason);
      this.handleSystemError(event.reason, 'Promise rejection');
    });

    // Global error handler for JavaScript errors
    this.browser.addWindowListener('error', (event) => {
      // Only handle errors related to our theme system
      if (event.filename && (event.filename.includes('core.js') ||
          event.message.toLowerCase().includes('theme') || 
          event.message.toLowerCase().includes('vibe'))) {
        console.error('JavaScript error in theme system:', event.error);
        this.handleSystemError(event.error, 'JavaScript error');
      }
    });
  }

  /**
   * Handle system-level errors gracefully
   * @param {Error} error - The error that occurred
   * @param {string} context - Context where the error occurred
   * @private
   */
  handleSystemError(error, context) {
    const now = Date.now();
    
    // Prevent error spam (max 1 error every 5 seconds)
    if (this.lastErrorTime && now - this.lastErrorTime < 5000) {
      return;
    }
    
    this.lastErrorTime = now;
    this.errorCount++;
    
    // Log performance metrics for debugging
    // Performance metrics available for debugging if needed
    
    // Show user-friendly error message
    const userMessage = this.errorCount > 3 
      ? 'Theme system experiencing issues. Please refresh the page.'
      : 'Temporary theme issue. Please try again.';
    
    this.showError(userMessage);
    
    // Reset operation state
    this.isOperationInProgress = false;
    this.hideImageLoading();
    
    // Announce error to screen readers
    this.announceToScreenReader(`Error in theme system: ${userMessage}`, 'assertive');
  }

  /**
   * Show global loading indicator
   * @param {string} [message='Loading theme...'] - Loading message to display
   * @private
   */
  showGlobalLoading(message = 'Loading theme...') {
    if (this.globalLoading) {
      const textElement = this.globalLoading.querySelector('.global-loading-text');
      if (textElement) {
        textElement.textContent = message;
      }
      this.globalLoading.classList.remove('is-hidden');
    }
  }

  /**
   * Hide global loading indicator
   * @private
   */
  hideGlobalLoading() {
    if (this.globalLoading) {
      this.globalLoading.classList.add('is-hidden');
    }
  }

  /**
   * Safely execute an operation with error boundary and loading states
   * @param {Function} operation - Function to execute
   * @param {string} operationName - Name for logging
   * @param {boolean} [showLoading=true] - Whether to show global loading indicator
   * @returns {Promise} Promise that resolves with operation result
   * @private
   */
  async safeExecute(operation, operationName, showLoading = true) {
    // Prevent concurrent operations
    if (this.isOperationInProgress) {
      console.warn(`Operation ${operationName} skipped - another operation in progress`);
      return;
    }
    
    try {
      this.isOperationInProgress = true;

      // Show loading only for user-initiated theme changes, not initial loading
      if (showLoading && (operationName.includes('changeTheme') || operationName.includes('cycleTheme'))) {
        this.showGlobalLoading();
      }
      
      const result = await operation();
      return result;

    } catch (error) {
      this.handleSystemError(error, operationName);
      throw error;
    } finally {
      this.isOperationInProgress = false;
      this.hideGlobalLoading();
    }
  }

  /**
   * Create a tracked timeout that can be cleaned up
   * @param {Function} callback - Function to execute after delay
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID
   * @private
   */
  createTrackedTimeout(callback, delay) {
    const timeoutId = this.browser.setTimeout(() => {
      this.activeTimeouts.delete(timeoutId);
      callback();
    }, delay);
    this.activeTimeouts.add(timeoutId);
    return timeoutId;
  }

  /**
   * Clean up vibe check manager resources and event listeners
   * @public
   */
  destroy() {
    // Remove all event listeners to prevent memory leaks
    if (this.vibeCheckBtn && this.vibeCheckHandler) {
      this.vibeCheckBtn.removeEventListener('click', this.vibeCheckHandler);
    }
    
    if (this.vibeBackdrop && this.backdropClickHandler) {
      this.vibeBackdrop.removeEventListener('click', this.backdropClickHandler);
    }
    
    if (this.vibePanelClose && this.closeButtonHandler) {
      this.vibePanelClose.removeEventListener('click', this.closeButtonHandler);
    }
    
    if (this.escapeKeyHandler) {
      this.browser.removeDocumentListener('keydown', this.escapeKeyHandler);
    }
    
    if (this.focusTrapHandler) {
      this.browser.removeDocumentListener('keydown', this.focusTrapHandler);
    }

    // Clear all active timeouts to prevent memory leaks
    this.activeTimeouts.forEach(timeoutId => {
      this.browser.clearTimeout(timeoutId);
    });
    this.activeTimeouts.clear();

    // Clear cached references to prevent memory leaks
    this.imageCache.clear();
    this.preloadPromises.clear();
    this.imageLoadAttempts.clear();

    // Note: Touch event listeners are added directly to DOM elements
    // They will be garbage collected when elements are dereferenced

    // Clear all DOM references
    this.vibeCheckBtn = null;
    this.vibePanel = null;
    this.vibeBackdrop = null;
    this.vibePanelClose = null;
    this.vibeTitle = null;
    this.vibeImage = null;
    this.vibeError = null;
    this.globalLoading = null;
    this.srAnnouncements = null;
    
    // Clear event handler references
    this.vibeCheckHandler = null;
    this.backdropClickHandler = null;
    this.closeButtonHandler = null;
    this.escapeKeyHandler = null;
    this.focusTrapHandler = null;
    
    // Clear manager references
    this.themeManager = null;
    this.browser = null;
    this.lastFocusedElement = null;

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
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Store event handlers for proper cleanup
    this.expandButtonHandler = (e) => {
      e.preventDefault();
      this.expandBio();
    };

    this.resizeHandler = () => {
      this.handleViewportChange();
    };

    this.expandButton.addEventListener('click', this.expandButtonHandler);
    this.browser.addWindowListener('resize', this.resizeHandler);
  }

  /**
   * Expand the biography content to show full text
   * @public
   */
  expandBio() {
    if (this.bioContent) {
      this.bioContent.classList.add('is-expanded');
    }
  }

  /**
   * Handle viewport changes and reset bio state on desktop
   * @public
   */
  handleViewportChange() {
    // Reset to collapsed state when switching to desktop
    if (this.browser.getWindowWidth() > SITE_CONFIG.BIO_MOBILE_BREAKPOINT && this.bioContent) {
      this.bioContent.classList.remove('is-expanded');
    }
  }

  /**
   * Clean up bio collapse manager resources and event listeners
   * @public
   */
  destroy() {
    // Remove event listeners to prevent memory leaks
    if (this.expandButton && this.expandButtonHandler) {
      this.expandButton.removeEventListener('click', this.expandButtonHandler);
    }
    
    if (this.resizeHandler) {
      this.browser.removeWindowListener('resize', this.resizeHandler);
    }
    
    // Clear references
    this.bioContent = null;
    this.expandButton = null;
    this.browser = null;
    this.expandButtonHandler = null;
    this.resizeHandler = null;
    
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
    browser.window.themeManager = SafeInit.initialize('ThemeManager', () => new ThemeManager(browser));

    // TOC manager is initialized in toc.js when that script loads

    // Only initialize bio collapse manager on homepage
    const hasBioContent = browser.querySelector('.bio-content');
    if (hasBioContent) {
      browser.window.bioCollapseManager = SafeInit.initialize('BioCollapseManager', () => new BioCollapseManager(browser));
    }

    // Only initialize vibe check manager on homepage (where button exists)
    const hasVibeCheck = browser.getElementById('vibe-check-btn');
    if (hasVibeCheck && browser.window.themeManager) {
      browser.window.vibeCheckManager = SafeInit.initialize('VibeCheckManager', () => new VibeCheckManager(browser.window.themeManager, browser));
    }

    // Add loaded class for transition optimizations
    browser.getBody().classList.add('loaded');
  });
}

/**
 * Global cleanup function to destroy all managers and prevent memory leaks
 * Call this before page unload or when reinitializing the application
 * @public
 */
function cleanupApp() {
  
  try {
    // Destroy all managers if they exist
    if (window.themeManager && typeof window.themeManager.destroy === 'function') {
      window.themeManager.destroy();
      window.themeManager = null;
    }
    
    if (window.vibeCheckManager && typeof window.vibeCheckManager.destroy === 'function') {
      window.vibeCheckManager.destroy();
      window.vibeCheckManager = null;
    }
    
    if (window.bioCollapseManager && typeof window.bioCollapseManager.destroy === 'function') {
      window.bioCollapseManager.destroy();
      window.bioCollapseManager = null;
    }
    
    if (window.tocManager && typeof window.tocManager.destroy === 'function') {
      window.tocManager.destroy();
      window.tocManager = null;
    }
    
  } catch (error) {
    console.error('Error during application cleanup:', error);
  }
}

// Automatically cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', cleanupApp);

// Initialize immediately if DOM is ready, otherwise wait
const browserEnv = new BrowserEnvironment();
if (browserEnv.getReadyState() === 'loading') {
  browserEnv.addDocumentListener('DOMContentLoaded', () => initializeApp(browserEnv));
} else {
  initializeApp(browserEnv);
}
