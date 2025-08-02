/**
 * Theme Manager - Handles dark/light mode toggle
 */
class ThemeManager {
  constructor() {
    this.themeToggle = null;
    this.toggleSlider = null;
    this.sunIcon = null;
    this.moonIcon = null;
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
    this.sunIcon = document.getElementById('sun-icon');
    this.moonIcon = document.getElementById('moon-icon');

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
  }

  updateToggleUI(isDark) {
    if (!this.toggleSlider || !this.sunIcon || !this.moonIcon) return;

    if (isDark) {
      this.toggleSlider.classList.remove('translate-x-1');
      this.toggleSlider.classList.add('translate-x-6');
      this.sunIcon.classList.add('hidden');
      this.moonIcon.classList.remove('hidden');
    } else {
      this.toggleSlider.classList.remove('translate-x-6');
      this.toggleSlider.classList.add('translate-x-1');
      this.sunIcon.classList.remove('hidden');
      this.moonIcon.classList.add('hidden');
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

    this.headings = postContent.querySelectorAll('h2, h3, h4, h5, h6');
    
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

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.tocOverlay.classList.remove('visible');
      }
      
      // Handle default state changes when transitioning between viewport sizes
      this.handleViewportChange();
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

    setTimeout(() => {
      if (!this.isOpen) {
        this.tocPanel.classList.add('hidden');
        this.tocOverlay.classList.add('hidden');
      }
    }, 300);
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
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.updateActiveHeading();
      }, 50);
    });

    this.updateActiveHeading();
  }

  updateActiveHeading() {
    if (this.headings.length === 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    let activeId = null;

    for (let i = 0; i < this.headings.length; i++) {
      const heading = this.headings[i];
      const rect = heading.getBoundingClientRect();
      
      if (rect.top <= windowHeight * 0.3) {
        activeId = heading.id;
      } else {
        break;
      }
    }

    if (!activeId && scrollTop < 200 && this.headings.length > 0) {
      activeId = this.headings[0].id;
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

function initializeApp() {
  window.themeManager = new ThemeManager();
  window.tocManager = new TOCManager();
  
  document.body.classList.add('loaded');
  console.log('Static website initialized successfully');
}

initializeApp();
