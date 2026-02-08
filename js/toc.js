/**
 * TABLE OF CONTENTS (TOC) FUNCTIONALITY
 * 
 * This module handles table of contents generation, scroll tracking,
 * and navigation for blog post pages.
 * 
 * Classes:
 * - HeadingGenerator: Generates heading IDs and creates TOC structure
 * - ScrollTracker: Tracks scroll position and highlights active sections
 * - TOCManager: Main manager that coordinates TOC functionality
 */

/**
 * Heading Generator - Creates unique IDs for headings and builds TOC structure
 */
class HeadingGenerator {
  /**
   * Create a HeadingGenerator instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.headingCounter = new Map();
    this.generatedIds = new Set();
  }

  /**
   * Generate a unique slug from heading text
   * @param {string} text - The heading text
   * @returns {string} URL-safe slug
   * @private
   */
  generateSlug(text) {
    // Remove HTML tags and convert to lowercase
    const cleanText = text.replace(/<[^>]*>/g, '').toLowerCase();
    
    // Replace spaces and special characters with hyphens
    let slug = cleanText
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
    
    // Handle edge cases
    if (!slug) slug = 'heading';
    
    // Ensure uniqueness
    const baseSlug = slug;
    let counter = 1;
    while (this.generatedIds.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.generatedIds.add(slug);
    return slug;
  }

  /**
   * Generate IDs for all headings in the content
   * @param {HTMLElement} contentElement - Element containing the headings
   * @returns {HTMLElement[]} Array of heading elements with IDs
   */
  generateHeadingIds(contentElement) {
    if (!contentElement) return [];
    
    const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingsArray = Array.from(headings);
    
    headingsArray.forEach(heading => {
      if (!heading.id) {
        const headingText = heading.textContent || heading.innerText || 'heading';
        heading.id = this.generateSlug(headingText);
      }
    });
    
    return headingsArray;
  }

  /**
   * Build hierarchical TOC structure from headings
   * @param {HTMLElement[]} headings - Array of heading elements
   * @returns {Object[]} Hierarchical TOC structure
   */
  buildTOCStructure(headings) {
    if (!headings || headings.length === 0) return [];
    
    const tocItems = [];
    const stack = [];
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const tocItem = {
        id: heading.id,
        text: heading.textContent || heading.innerText || '',
        level: level,
        element: heading,
        children: []
      };
      
      // Find the correct parent for this item
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      if (stack.length === 0) {
        // Top-level item
        tocItems.push(tocItem);
      } else {
        // Child item
        stack[stack.length - 1].children.push(tocItem);
      }
      
      stack.push(tocItem);
    });
    
    return tocItems;
  }
}

/**
 * Scroll Tracker - Handles scroll position tracking and active section highlighting
 */
class ScrollTracker {
  /**
   * Create a ScrollTracker instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.headings = [];
    this.activeHeadingId = null;
    this.scrollTimeout = null;
    this.isScrolling = false;
    this.observer = null;
    this.manualScrollInProgress = false;
    this.manualScrollTimeout = null;
    this.lastScrollTop = 0;
  }

  /**
   * Initialize scroll tracking with heading elements
   * @param {HTMLElement[]} headings - Array of heading elements to track
   */
  init(headings) {
    this.headings = headings || [];
    this.setupIntersectionObserver();
  }

  /**
   * Setup Intersection Observer for efficient scroll tracking
   * @private
   */
  setupIntersectionObserver() {
    if (!this.browser.supportsIntersectionObserver() || this.headings.length === 0) {
      // Fallback to scroll event listener
      this.setupScrollListener();
      return;
    }

    // Cleanup existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Use a simple scroll-based approach instead of Intersection Observer
    // This is more reliable for edge cases like slow scrolling
    const handleScroll = () => {
      if (this.manualScrollInProgress) return;
      
      const scrollTop = this.browser.getScrollTop();
      const windowHeight = this.browser.getWindowHeight();
      const documentHeight = this.browser.getDocumentHeight();
      
      // Check if we're near the bottom first
      const nearBottom = scrollTop + windowHeight >= documentHeight - 100;
      if (nearBottom && this.headings.length > 0) {
        const lastHeading = this.headings[this.headings.length - 1];
        if (lastHeading.id !== this.activeHeadingId) {
          this.setActiveHeading(lastHeading.id);
        }
        return;
      }
      
      // Find the heading that should be active based on scroll position
      // Use a more flexible approach that works with many headings and short sections
      
      let activeHeading = null;
      
      // Find heading closest to viewport center (50% mark)
      // This gives equal treatment to all sections regardless of length
      const viewportCenter = scrollTop + (windowHeight * 0.5);
      let minDistance = Infinity;
      
      this.headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        const headingTop = rect.top + scrollTop;
        const distance = Math.abs(headingTop - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          activeHeading = heading;
        }
      });
      
      // Note: viewport center approach should always find a heading
      // so no fallback logic needed
      
      if (activeHeading && activeHeading.id !== this.activeHeadingId) {
        this.setActiveHeading(activeHeading.id);
      }
    };
    
    // Use consistent throttling that provides good UX across all scroll speeds
    this.browser.addWindowListener('scroll', () => {
      if (this.scrollTimeout) {
        this.browser.clearTimeout(this.scrollTimeout);
      }
      
      // Consistent 16ms throttling (~60fps) for smooth visual feedback
      // This balances responsiveness with performance
      this.scrollTimeout = this.browser.setTimeout(() => {
        handleScroll();
      }, 16);
    }, { passive: true });
  }

  /**
   * Fallback scroll listener for browsers without Intersection Observer
   * @private
   */
  setupScrollListener() {
    const handleScroll = () => {
      if (this.scrollTimeout) {
        this.browser.clearTimeout(this.scrollTimeout);
      }
      
      this.isScrolling = true;
      
      this.scrollTimeout = this.browser.setTimeout(() => {
        this.updateActiveHeading();
        this.isScrolling = false;
      }, SITE_CONFIG.SCROLL_THROTTLE);
    };

    this.browser.addWindowListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Update active heading based on scroll position (fallback method)
   * @private
   */
  updateActiveHeading() {
    if (this.headings.length === 0 || this.manualScrollInProgress) return;

    const scrollTop = this.browser.getScrollTop();
    const windowHeight = this.browser.getWindowHeight();
    const documentHeight = this.browser.getDocumentHeight();
    const viewportCenter = scrollTop + (windowHeight * 0.3); // 30% from top

    let activeHeading = null;
    let minDistance = Infinity;

    // Check if we're near the bottom of the page (last 200px or 80% of viewport)
    const bottomThreshold = Math.max(200, windowHeight * 0.2);
    const nearBottom = scrollTop + windowHeight >= documentHeight - bottomThreshold;

    this.headings.forEach((heading, index) => {
      const rect = heading.getBoundingClientRect();
      const headingTop = rect.top + scrollTop;
      const distance = Math.abs(headingTop - viewportCenter);

      if (headingTop <= viewportCenter && distance < minDistance) {
        minDistance = distance;
        activeHeading = heading;
      }
    });

    // If we're near the bottom, always highlight the last heading
    if (nearBottom && this.headings.length > 0) {
      activeHeading = this.headings[this.headings.length - 1];
    }

    // If no heading is above the viewport center, use the first visible one
    if (!activeHeading && this.headings.length > 0) {
      activeHeading = this.headings.find(heading => {
        const rect = heading.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= windowHeight;
      });
    }

    if (activeHeading && activeHeading.id !== this.activeHeadingId) {
      this.setActiveHeading(activeHeading.id);
    }
  }

  /**
   * Set the active heading and update UI
   * @param {string} headingId - ID of the heading to mark as active
   */
  setActiveHeading(headingId) {
    if (this.activeHeadingId === headingId) return;

    // Remove previous active state
    if (this.activeHeadingId) {
      const prevActiveLink = this.browser.querySelector(`.toc-link[href="#${this.activeHeadingId}"]`);
      if (prevActiveLink) {
        prevActiveLink.classList.remove('is-active');
        prevActiveLink.setAttribute('aria-current', 'false');
      }
    }

    // Set new active state
    this.activeHeadingId = headingId;
    const activeLink = this.browser.querySelector(`.toc-link[href="#${headingId}"]`);
    if (activeLink) {
      activeLink.classList.add('is-active');
      activeLink.setAttribute('aria-current', 'true');
      
      // Scroll TOC to show active item if needed
      this.scrollTOCToActiveItem(activeLink);
    }
  }

  /**
   * Scroll TOC container to show the active item
   * @param {HTMLElement} activeLink - The active TOC link element
   * @private
   */
  scrollTOCToActiveItem(activeLink) {
    const tocContainer = activeLink.closest('.toc-container');
    if (!tocContainer) return;

    const containerRect = tocContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Check if the active link is outside the visible area
    if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
      // Calculate the scroll position to center the active item
      const scrollTop = activeLink.offsetTop - (tocContainer.clientHeight / 2) + (activeLink.clientHeight / 2);
      
      // Smooth scroll to the calculated position
      tocContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Get the currently active heading ID
   * @returns {string|null} ID of the active heading
   */
  getActiveHeadingId() {
    return this.activeHeadingId;
  }

  /**
   * Temporarily disable scroll tracking during manual scroll
   * @param {number} [duration=1000] - Duration to disable tracking in ms
   */
  pauseScrollTracking(duration = 1000) {
    this.manualScrollInProgress = true;
    
    // Clear any existing timeout to prevent overlapping pauses
    if (this.manualScrollTimeout) {
      this.browser.clearTimeout(this.manualScrollTimeout);
    }
    
    this.manualScrollTimeout = this.browser.setTimeout(() => {
      this.manualScrollInProgress = false;
      this.manualScrollTimeout = null;
    }, duration);
  }


  /**
   * Clean up scroll tracking resources
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.scrollTimeout) {
      this.browser.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    if (this.manualScrollTimeout) {
      this.browser.clearTimeout(this.manualScrollTimeout);
      this.manualScrollTimeout = null;
    }
    
    this.headings = [];
    this.activeHeadingId = null;
  }
}

/**
 * Table of Contents Manager - Main class for TOC functionality
 * Coordinates heading generation, TOC rendering, and scroll tracking
 */
class TOCManager {
  /**
   * Create a TOCManager instance
   * @param {BrowserEnvironment} [browser] - Browser environment for DOM/Window access
   * @constructor
   */
  constructor(browser = new BrowserEnvironment()) {
    this.browser = browser;
    this.headingGenerator = new HeadingGenerator(browser);
    this.scrollTracker = new ScrollTracker(browser);
    this.tocContainer = null;
    this.tocToggle = null;
    this.contentElement = null;
    this.isCollapsed = true;
    this.headings = [];
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
    this.tocContainer = this.browser.querySelector('.toc-panel') || this.browser.querySelector('.toc-container');
    this.tocToggle = this.browser.querySelector('.toc-toggle');
    this.tocOverlay = this.browser.querySelector('.toc-overlay');
    this.contentElement = this.browser.querySelector('.post-content');

    // TOC is optional - only initialize if elements are present
    if (!this.tocContainer || !this.contentElement) {
      return;
    }

    
    // Ensure icons are properly centered
    if (this.tocToggle) {
      const icons = this.tocToggle.querySelectorAll('.toc-icon');
      icons.forEach(icon => {
        icon.style.margin = '0 auto';
        icon.style.display = 'flex';
        icon.style.justifyContent = 'center';
        icon.style.alignItems = 'center';
      });
    }
    
    this.generateTOC();
    this.setupEventListeners();
    this.setupResponsiveBehavior();
  }

  /**
   * Generate the complete table of contents
   * @private
   */
  generateTOC() {
    // Generate IDs for all headings
    this.headings = this.headingGenerator.generateHeadingIds(this.contentElement);
    
    if (this.headings.length === 0) {
      this.hideTOC();
      return;
    }

    // Build hierarchical structure
    const tocStructure = this.headingGenerator.buildTOCStructure(this.headings);
    
    // Render TOC HTML
    this.renderTOC(tocStructure);
    
    // Initialize scroll tracking
    this.scrollTracker.init(this.headings);
    
    // Show TOC
    this.showTOC();
  }

  /**
   * Render the TOC HTML structure
   * @param {Object[]} tocStructure - Hierarchical TOC data
   * @private
   */
  renderTOC(tocStructure) {
    if (!this.tocContainer) return;

    // Check if there's an existing toc-list element to populate
    const existingTocList = this.tocContainer.querySelector('#toc-list, .toc-list');
    if (existingTocList) {
      // Clear and populate existing list with items
      existingTocList.innerHTML = '';
      tocStructure.forEach(item => {
        const listItem = this.createTOCItem(item, 0);
        existingTocList.appendChild(listItem);
      });
    } else {
      // Create and add new TOC list
      const tocList = this.createTOCList(tocStructure);
      this.tocContainer.innerHTML = '';
      this.tocContainer.appendChild(tocList);
    }
  }

  /**
   * Create a TOC list element from structure
   * @param {Object[]} items - TOC items to render
   * @param {number} [level=0] - Current nesting level
   * @returns {HTMLElement} The created list element
   * @private
   */
  createTOCList(items, level = 0) {
    const list = this.browser.createElement('ul');
    list.className = level === 0 ? 'toc-list' : `toc-list toc-list-level-${level}`;
    
    items.forEach(item => {
      const listItem = this.createTOCItem(item, level);
      list.appendChild(listItem);
    });
    
    return list;
  }

  /**
   * Create a single TOC item element
   * @param {Object} item - TOC item data
   * @param {number} level - Current nesting level
   * @returns {HTMLElement} The created list item element
   * @private
   */
  createTOCItem(item, level) {
    const listItem = this.browser.createElement('li');
    listItem.className = `toc-item toc-level-${item.level}`;
    
    // Create the link
    const link = this.browser.createElement('a');
    link.href = `#${item.id}`;
    link.className = 'toc-link';
    link.textContent = item.text;
    link.setAttribute('aria-current', 'false');
    
    listItem.appendChild(link);
    
    // Add children if they exist
    if (item.children && item.children.length > 0) {
      const childList = this.createTOCList(item.children, level + 1);
      listItem.appendChild(childList);
    }
    
    return listItem;
  }

  /**
   * Setup event listeners for TOC functionality
   * @private
   */
  setupEventListeners() {
    // Toggle button
    if (this.tocToggle) {
      this.tocToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTOC();
      });
    }

    // TOC link clicks
    this.browser.addDocumentListener('click', (e) => {
      if (e.target.classList.contains('toc-link')) {
        e.preventDefault();
        this.handleTOCClick(e.target);
      }
    });

    // Keyboard navigation
    this.browser.addDocumentListener('keydown', (e) => {
      if (e.target.classList.contains('toc-link')) {
        this.handleTOCKeydown(e);
      }
    });

    // Close TOC on outside click (mobile) or overlay click
    this.browser.addDocumentListener('click', (e) => {
      if (this.isCollapsed) return;
      
      // Don't close TOC when clicking inside TOC or TOC toggle
      if (this.tocContainer.contains(e.target) || this.tocToggle?.contains(e.target)) {
        return;
      }
      
      // Don't close TOC when clicking on interactive elements
      if (e.target.matches('button, a, input, select, textarea, [role="button"], [role="link"]') || 
          e.target.closest('button, a, input, select, textarea, [role="button"], [role="link"]')) {
        return;
      }
      
      // Close TOC if clicking on non-interactive content
      this.collapseTOC();
    });

    // Close TOC when clicking overlay
    if (this.tocOverlay) {
      this.tocOverlay.addEventListener('click', () => {
        this.collapseTOC();
      });
    }
  }

  /**
   * Handle TOC link clicks with smooth scrolling
   * @param {HTMLElement} link - The clicked TOC link
   * @private
   */
  handleTOCClick(link) {
    const targetId = link.getAttribute('href')?.substring(1);
    
    if (!targetId) {
      console.warn('No target ID found for TOC link');
      return;
    }

    const targetElement = this.browser.getElementById(targetId);
    
    if (!targetElement) {
      console.warn('Target element not found for ID:', targetId);
      return;
    }

    // Calculate scroll position with offset for fixed header
    const rect = targetElement.getBoundingClientRect();
    const offsetTop = rect.top + this.browser.getScrollTop() - (SITE_CONFIG.SCROLL_OFFSET || 80);
    

    // Pause scroll tracking to prevent interference from viewport center detection
    this.scrollTracker.pauseScrollTracking(3000);

    // Manually set active state for immediate feedback
    this.scrollTracker.setActiveHeading(targetId);

    // Smooth scroll to target
    this.browser.scrollToPosition(offsetTop);

    // Update URL hash without triggering scroll
    if (this.browser.supportsHistoryAPI()) {
      this.browser.window.history.replaceState(null, null, `#${targetId}`);
    }

    // Collapse TOC on mobile after navigation
    if (this.browser.isMobileDevice()) {
      this.browser.setTimeout(() => {
        this.collapseTOC();
      }, SITE_CONFIG.TOC_MOBILE_CLOSE_DELAY || 300);
    }
  }

  /**
   * Handle keyboard navigation in TOC
   * @param {KeyboardEvent} e - The keyboard event
   * @private
   */
  handleTOCKeydown(e) {
    const tocLinks = Array.from(this.tocContainer.querySelectorAll('.toc-link'));
    const currentIndex = tocLinks.indexOf(e.target);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < tocLinks.length - 1) {
          tocLinks[currentIndex + 1].focus();
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          tocLinks[currentIndex - 1].focus();
        }
        break;
      
      case 'Home':
        e.preventDefault();
        tocLinks[0]?.focus();
        break;
      
      case 'End':
        e.preventDefault();
        tocLinks[tocLinks.length - 1]?.focus();
        break;
      
      case 'Escape':
        e.preventDefault();
        this.collapseTOC();
        this.tocToggle?.focus();
        break;
    }
  }

  /**
   * Setup responsive behavior for different screen sizes
   * @private
   */
  setupResponsiveBehavior() {
    const handleResize = () => {
      const isMobile = this.browser.isMobileDevice();
      
      if (isMobile) {
        // On mobile, TOC should be collapsed by default
        this.collapseTOC();
      } else {
        // On desktop, TOC should be expanded by default
        this.expandTOC();
      }
    };

    // Initial setup
    handleResize();

    // Listen for resize events
    this.browser.addWindowListener('resize', () => {
      this.browser.debounce(handleResize, SITE_CONFIG.RESIZE_DEBOUNCE)();
    });
  }

  /**
   * Toggle TOC visibility
   */
  toggleTOC() {
    if (this.isCollapsed) {
      this.expandTOC();
    } else {
      this.collapseTOC();
    }
  }

  /**
   * Expand the TOC
   */
  expandTOC() {
    if (!this.tocContainer) return;

    this.isCollapsed = false;
    this.tocContainer.classList.add('is-visible');
    this.tocContainer.classList.remove('is-hidden');

    // Show overlay if it exists
    if (this.tocOverlay) {
      this.tocOverlay.classList.add('is-visible');
      this.tocOverlay.classList.remove('is-hidden');
    }

    if (this.tocToggle) {
      this.tocToggle.setAttribute('aria-expanded', 'true');
      
      // Handle icon toggle if icons exist
      const hamburgerIcon = this.tocToggle.querySelector('#toc-hamburger');
      const closeIcon = this.tocToggle.querySelector('#toc-close');
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.add('is-hidden');
        closeIcon.classList.remove('is-hidden');
      }
    }

    // Focus first link for keyboard users
    const firstLink = this.tocContainer.querySelector('.toc-link');
    if (firstLink && this.browser.getActiveElement() === this.tocToggle) {
      this.browser.setTimeout(() => {
        firstLink.focus();
      }, SITE_CONFIG.ANIMATION_DELAY);
    }
  }

  /**
   * Collapse the TOC
   */
  collapseTOC() {
    if (!this.tocContainer) return;

    this.isCollapsed = true;
    this.tocContainer.classList.add('is-hidden');
    this.tocContainer.classList.remove('is-visible');

    // Hide overlay if it exists
    if (this.tocOverlay) {
      this.tocOverlay.classList.add('is-hidden');
      this.tocOverlay.classList.remove('is-visible');
    }

    if (this.tocToggle) {
      this.tocToggle.setAttribute('aria-expanded', 'false');
      
      // Handle icon toggle if icons exist
      const hamburgerIcon = this.tocToggle.querySelector('#toc-hamburger');
      const closeIcon = this.tocToggle.querySelector('#toc-close');
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.remove('is-hidden');
        closeIcon.classList.add('is-hidden');
      }
    }
  }

  /**
   * Show the TOC (when headings are found)
   * @private
   */
  showTOC() {
    if (this.tocContainer) {
      this.tocContainer.style.display = 'block';
    }
    if (this.tocToggle) {
      this.tocToggle.style.display = 'inline-block';
    }
  }

  /**
   * Hide the TOC (when no headings are found)
   * @private
   */
  hideTOC() {
    if (this.tocContainer) {
      this.tocContainer.style.display = 'none';
    }
    if (this.tocToggle) {
      this.tocToggle.style.display = 'none';
    }
  }

  /**
   * Get TOC statistics for debugging
   * @returns {Object} Statistics about the TOC
   */
  getStats() {
    return {
      headingCount: this.headings.length,
      isCollapsed: this.isCollapsed,
      activeHeading: this.scrollTracker.getActiveHeadingId(),
      hasScrollTracker: !!this.scrollTracker
    };
  }

  /**
   * Clean up TOC resources
   */
  destroy() {
    this.scrollTracker.destroy();
    this.headings = [];
  }
}

// Export classes for potential external use (though not required for this setup)
if (typeof window !== 'undefined') {
  window.HeadingGenerator = HeadingGenerator;
  window.ScrollTracker = ScrollTracker;
  window.TOCManager = TOCManager;
  
  // Initialize TOC manager if we're on a page with TOC elements
  const hasTOC = document.getElementById('toc-panel');
  if (hasTOC) {
    // Use the same browser environment from core.js if available, or create new one
    const browserEnv = window.browserEnv || new BrowserEnvironment();
    
    // Initialize TOC manager using SafeInit if available
    if (typeof SafeInit !== 'undefined') {
      window.tocManager = SafeInit.initialize('TOCManager', () => new TOCManager(browserEnv));
    } else {
      // Fallback if SafeInit not available
      try {
        window.tocManager = new TOCManager(browserEnv);
      } catch (error) {
        console.warn('TOC Manager failed to initialize:', error);
      }
    }
  }
}