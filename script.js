// Console welcome message
console.log("If you're curious about if we might enjoy interacting,\nreach out.\n\nit's just my full name at gmail");

/**
 * Theme Manager - Handles dark/light mode toggle
 */
class ThemeManager {
  constructor() {
    this.themeToggle = null;
    this.toggleSlider = null;
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.toggleSlider = document.getElementById('toggle-slider');

    if (!this.themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    this.initializeTheme();
    this.setupEventListeners();
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemTheme;
    this.applyTheme(this.currentTheme);
  }

  setupEventListeners() {
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      this.updateToggleUI(true);
    } else {
      html.classList.remove('dark');
      this.updateToggleUI(false);
    }
    
    this.currentTheme = theme;
    
    // Update aria-pressed for accessibility
    if (this.themeToggle) {
      this.themeToggle.setAttribute('aria-pressed', theme === 'dark');
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
 * Table of Contents Manager - Handles TOC generation and navigation
 */
class TOCManager {
  constructor() {
    this.tocToggle = null;
    this.tocPanel = null;
    this.tocOverlay = null;
    this.tocList = null;
    this.tocHamburger = null;
    this.tocClose = null;
    this.isOpen = false;
    this.headings = [];
    this.activeHeading = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.tocToggle = document.getElementById('toc-toggle');
    this.tocPanel = document.getElementById('toc-panel');
    this.tocOverlay = document.getElementById('toc-overlay');
    this.tocList = document.getElementById('toc-list');
    this.tocHamburger = document.getElementById('toc-hamburger');
    this.tocClose = document.getElementById('toc-close');

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

  generateTOC() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) {
      console.warn('Post content not found');
      return;
    }

    this.headings = postContent.querySelectorAll('h2');
    
    if (this.headings.length === 0) {
      this.tocToggle.style.display = 'none';
      console.log('No headings found for TOC');
      return;
    }

    console.log(`Found ${this.headings.length} headings for TOC`);
    this.tocList.innerHTML = '';

    this.headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = this.generateHeadingId(heading.textContent, index);
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.setAttribute('data-heading-id', heading.id);
      a.className = `toc-${heading.tagName.toLowerCase()}`;
      
      li.appendChild(a);
      this.tocList.appendChild(li);
    });
  }

  generateHeadingId(text, index) {
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .substring(0, 50);

    if (!id || document.getElementById(id)) {
      id = `heading-${index}`;
    }
    
    return id;
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
        
        if (window.innerWidth < 1024) {
          this.closeTOC();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeTOC();
      }
    });

    // Professional viewport management inspired by sites like Dario's
    let resizeTimeout;
    let currentViewportState = this.isDesktop() ? 'desktop' : 'mobile';
    
    window.addEventListener('resize', () => {
      const newViewportState = window.innerWidth >= 1024 ? 'desktop' : 'mobile';
      
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
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleViewportChange();
      }, 50);
    });
  }

  toggleTOC() {
    console.log('Toggling TOC, currently open:', this.isOpen);
    if (this.isOpen) {
      this.closeTOC();
    } else {
      this.openTOC();
    }
  }

  openTOC() {
    console.log('Opening TOC');
    this.isOpen = true;
    this.tocPanel.classList.remove('hidden');
    this.tocPanel.classList.add('visible');
    
    this.tocHamburger.classList.add('hidden');
    this.tocClose.classList.remove('hidden');
    
    if (window.innerWidth < 1024) {
      this.tocOverlay.classList.remove('hidden');
      this.tocOverlay.classList.add('visible');
      // Focus first TOC link on mobile for better UX
      const firstLink = this.tocList.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 150);
      }
    }

    this.tocToggle.setAttribute('aria-expanded', 'true');
  }

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
    setTimeout(() => {
      if (!this.isOpen) {
        this.tocPanel.classList.add('hidden');
        this.tocOverlay.classList.add('hidden');
      }
    }, 150); // Shorter delay to match transition
  }

  scrollToHeading(headingId) {
    const heading = document.getElementById(headingId);
    if (heading) {
      const yOffset = -20;
      const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }

  initScrollTracking() {
    let isThrottled = false;
    
    window.addEventListener('scroll', () => {
      if (!isThrottled) {
        this.updateActiveHeading();
        isThrottled = true;
        
        setTimeout(() => {
          isThrottled = false;
          // Update one more time in case we missed the final position
          this.updateActiveHeading();
        }, 16); // ~60fps for smooth tracking
      }
    });

    this.updateActiveHeading();
  }

  updateActiveHeading() {
    if (this.headings.length === 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
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

      // Fallback for top of page
      if (!activeId && scrollTop < 200 && this.headings.length > 0) {
        activeId = this.headings[0].id;
      }
    }

    this.setActiveHeading(activeId);
  }

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

  isDesktop() {
    return window.innerWidth >= 1024;
  }

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
 */
class BioCollapseManager {
  constructor() {
    this.bioContent = null;
    this.expandButton = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.bioContent = document.querySelector('.bio-content');
    this.expandButton = document.querySelector('.bio-expand-btn');

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
    window.addEventListener('resize', () => {
      this.handleViewportChange();
    });
  }

  expandBio() {
    if (this.bioContent) {
      this.bioContent.classList.add('expanded');
      console.log('Bio expanded');
    }
  }

  handleViewportChange() {
    // Reset to collapsed state when switching to desktop
    if (window.innerWidth > 768 && this.bioContent) {
      this.bioContent.classList.remove('expanded');
    }
  }
}

function initializeApp() {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    window.themeManager = new ThemeManager();
    window.tocManager = new TOCManager();
    window.bioCollapseManager = new BioCollapseManager();
    
    // Add loaded class for transition optimizations
    document.body.classList.add('loaded');
    
    // Performance mark for debugging
    if ('performance' in window && 'mark' in performance) {
      performance.mark('app-initialized');
    }
    
    console.log('Static website initialized successfully');
  });
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
