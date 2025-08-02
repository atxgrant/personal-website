/**
 * Theme Manager - Handles dark/light mode toggle
 * Converted from React DarkModeToggle component to vanilla JavaScript
 */
class ThemeManager {
  constructor() {
    this.isDark = false;
    this.toggleBtn = null;
    this.slider = null;
    this.sunIcon = null;
    this.moonIcon = null;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Get DOM elements
    this.toggleBtn = document.getElementById('theme-toggle');
    this.slider = document.getElementById('toggle-slider');
    this.sunIcon = document.getElementById('sun-icon');
    this.moonIcon = document.getElementById('moon-icon');

    if (!this.toggleBtn) {
      console.error('Theme toggle button not found');
      return;
    }

    // Check for saved theme preference or detect system preference
    const savedTheme = localStorage.getItem('darkMode');
    let isDarkMode = false;

    if (savedTheme !== null) {
      // Use saved preference
      isDarkMode = savedTheme === 'true';
    } else {
      // Detect system preference
      isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Set initial theme
    this.setTheme(isDarkMode);

    // Add click event listener
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if no manual preference is saved
        if (localStorage.getItem('darkMode') === null) {
          this.setTheme(e.matches);
        }
      });
    }

    // Prevent flashing by removing any transition delays on initial load
    document.body.style.transition = 'none';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 100);
  }

  setTheme(isDark) {
    this.isDark = isDark;
    
    // Update DOM and localStorage
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }

    // Update toggle button appearance
    this.updateToggleButton();
  }

  toggleTheme() {
    this.setTheme(!this.isDark);
  }

  updateToggleButton() {
    if (!this.slider || !this.sunIcon || !this.moonIcon) return;

    if (this.isDark) {
      // Dark mode: slide right, show moon icon
      this.slider.classList.remove('translate-x-1');
      this.slider.classList.add('translate-x-6');
      this.sunIcon.classList.add('hidden');
      this.moonIcon.classList.remove('hidden');
      this.toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Light mode: slide left, show sun icon
      this.slider.classList.remove('translate-x-6');
      this.slider.classList.add('translate-x-1');
      this.sunIcon.classList.remove('hidden');
      this.moonIcon.classList.add('hidden');
      this.toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

/**
 * Smooth Scrolling for anchor links (if any are added later)
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Enhanced link interactions
 */
function initLinkInteractions() {
  // Add subtle hover effects to external links
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  
  externalLinks.forEach(link => {
    // Add external link indicator (optional)
    link.addEventListener('mouseenter', function() {
      // Could add hover effects here if desired
    });
  });
}

/**
 * Keyboard navigation support
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Support Escape key for any future modals/overlays
    if (e.key === 'Escape') {
      // Handle escape key if needed
    }
    
    // Support theme toggle with keyboard shortcut (Ctrl/Cmd + Shift + T)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      if (window.themeManager) {
        window.themeManager.toggleTheme();
      }
    }
  });
}

/**
 * Performance optimization: Reduce layout thrashing
 */
function initPerformanceOptimizations() {
  // Throttle scroll events if any scroll handlers are added later
  let scrollTimeout;
  
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(function() {
      // Handle scroll events here if needed
    }, 16); // ~60fps
  });
}

/**
 * Analytics/tracking (placeholder for future use)
 */
function initAnalytics() {
  // Placeholder for analytics initialization
  // Could track theme toggle usage, link clicks, etc.
}

/**
 * Initialize all functionality
 */
function initializeApp() {
  // Initialize theme manager (most important)
  window.themeManager = new ThemeManager();
  
  // Initialize other features
  initSmoothScrolling();
  initLinkInteractions();
  initKeyboardNavigation();
  initPerformanceOptimizations();
  initAnalytics();

  // Add loaded class to body for CSS animations
  document.body.classList.add('loaded');
  
  console.log('Static website initialized successfully');
}

// Start the app
initializeApp(); 