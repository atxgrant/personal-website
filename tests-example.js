/**
 * Example Unit Tests - Demonstrating Improved Testability
 * 
 * These examples show how dependency injection makes testing much easier
 * by allowing us to mock DOM and Window APIs instead of relying on real browser environment.
 */

// Mock Browser Environment for Testing
class MockBrowserEnvironment {
  constructor() {
    this.mockDocument = {
      elements: new Map(),
      body: { classList: { add: jest.fn() } },
      documentElement: { 
        classList: { add: jest.fn(), remove: jest.fn() },
        scrollTop: 0,
        scrollHeight: 1000 
      },
      readyState: 'complete'
    };
    
    this.mockWindow = {
      innerWidth: 1024,
      innerHeight: 768,
      pageYOffset: 0,
      addEventListener: jest.fn(),
      requestAnimationFrame: jest.fn(cb => cb()),
      setTimeout: jest.fn(),
      clearTimeout: jest.fn(),
      scrollTo: jest.fn(),
      matchMedia: jest.fn(() => ({
        matches: false,
        addEventListener: jest.fn()
      })),
      performance: { mark: jest.fn() },
      themeManager: null,
      tocManager: null,
      bioCollapseManager: null
    };
  }

  getElementById(id) {
    return this.mockDocument.elements.get(id) || null;
  }

  querySelector(selector) {
    return this.mockDocument.elements.get(selector) || null;
  }

  querySelectorAll(selector) {
    const element = this.mockDocument.elements.get(selector);
    return element ? [element] : [];
  }

  createElement(tagName) {
    return {
      tagName: tagName.toUpperCase(),
      id: '',
      textContent: '',
      className: '',
      href: '',
      getAttribute: jest.fn(),
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
      addEventListener: jest.fn(),
      classList: { add: jest.fn(), remove: jest.fn() },
      getBoundingClientRect: jest.fn(() => ({ top: 100 })),
      focus: jest.fn()
    };
  }

  addDocumentListener(event, handler) {
    // Mock implementation
  }

  addWindowListener(event, handler) {
    this.mockWindow.addEventListener(event, handler);
  }

  getWindowWidth() { return this.mockWindow.innerWidth; }
  getWindowHeight() { return this.mockWindow.innerHeight; }
  getPageYOffset() { return this.mockWindow.pageYOffset; }
  getDocumentHeight() { return this.mockDocument.documentElement.scrollHeight; }
  scrollTo(options) { this.mockWindow.scrollTo(options); }
  matchMedia(query) { return this.mockWindow.matchMedia(query); }
  getReadyState() { return this.mockDocument.readyState; }
  getDocumentElement() { return this.mockDocument.documentElement; }
  getBody() { return this.mockDocument.body; }
  requestAnimationFrame(callback) { return this.mockWindow.requestAnimationFrame(callback); }
  setTimeout(callback, delay) { return this.mockWindow.setTimeout(callback, delay); }
  clearTimeout(id) { this.mockWindow.clearTimeout(id); }

  // Helper method to add mock elements
  addMockElement(idOrSelector, element) {
    this.mockDocument.elements.set(idOrSelector, element);
  }
}

// Example Test Suite for ThemeManager
describe('ThemeManager', () => {
  let themeManager;
  let mockBrowser;

  beforeEach(() => {
    mockBrowser = new MockBrowserEnvironment();
    
    // Mock theme toggle elements
    const mockToggle = mockBrowser.createElement('button');
    const mockSlider = mockBrowser.createElement('span');
    mockBrowser.addMockElement('theme-toggle', mockToggle);
    mockBrowser.addMockElement('toggle-slider', mockSlider);
    
    themeManager = new ThemeManager(mockBrowser);
  });

  test('should initialize with light theme by default', () => {
    expect(themeManager.currentTheme).toBe('light');
  });

  test('should toggle from light to dark theme', () => {
    themeManager.toggleTheme();
    expect(themeManager.currentTheme).toBe('dark');
    expect(mockBrowser.getDocumentElement().classList.add).toHaveBeenCalledWith('dark');
  });

  test('should apply dark theme to document element', () => {
    themeManager.applyTheme('dark');
    expect(mockBrowser.getDocumentElement().classList.add).toHaveBeenCalledWith('dark');
    expect(mockBrowser.getDocumentElement().classList.remove).not.toHaveBeenCalled();
  });

  test('should remove dark class when applying light theme', () => {
    themeManager.currentTheme = 'dark';
    themeManager.applyTheme('light');
    expect(mockBrowser.getDocumentElement().classList.remove).toHaveBeenCalledWith('dark');
  });
});

// Example Test Suite for HeadingGenerator
describe('HeadingGenerator', () => {
  let headingGenerator;
  let mockBrowser;

  beforeEach(() => {
    mockBrowser = new MockBrowserEnvironment();
    
    // Mock post content with headings
    const mockPostContent = {
      querySelectorAll: jest.fn(() => [
        { id: '', textContent: 'First Heading', tagName: 'H2' },
        { id: '', textContent: 'Second Heading', tagName: 'H2' }
      ])
    };
    mockBrowser.addMockElement('.post-content', mockPostContent);
    
    // Mock TOC list
    const mockTocList = { innerHTML: '', appendChild: jest.fn() };
    
    headingGenerator = new HeadingGenerator(mockBrowser);
  });

  test('should generate IDs for headings without IDs', () => {
    const mockTocList = { innerHTML: '', appendChild: jest.fn() };
    const headings = headingGenerator.generateTOC(mockTocList);
    
    expect(headings).toHaveLength(2);
    expect(mockBrowser.createElement).toHaveBeenCalledWith('li');
    expect(mockBrowser.createElement).toHaveBeenCalledWith('a');
  });

  test('should generate clean IDs from heading text', () => {
    const id = headingGenerator.generateHeadingId('Hello World!', 0);
    expect(id).toBe('hello-world');
  });

  test('should handle special characters in heading text', () => {
    const id = headingGenerator.generateHeadingId('API & REST Services', 0);
    expect(id).toBe('api--rest-services');
  });

  test('should fallback to index-based ID for empty text', () => {
    const id = headingGenerator.generateHeadingId('', 5);
    expect(id).toBe('heading-5');
  });
});

// Example Test Suite for ScrollTracker
describe('ScrollTracker', () => {
  let scrollTracker;
  let mockBrowser;
  let mockHeadings;
  let mockTocList;

  beforeEach(() => {
    mockBrowser = new MockBrowserEnvironment();
    
    mockHeadings = [
      { id: 'heading-1', getBoundingClientRect: jest.fn(() => ({ top: 50 })) },
      { id: 'heading-2', getBoundingClientRect: jest.fn(() => ({ top: 300 })) }
    ];
    
    mockTocList = {
      querySelector: jest.fn(() => ({ classList: { remove: jest.fn(), add: jest.fn() } }))
    };
    
    scrollTracker = new ScrollTracker(mockHeadings, mockTocList, mockBrowser);
  });

  test('should initialize with empty active heading', () => {
    expect(scrollTracker.activeHeading).toBeNull();
  });

  test('should set up scroll event listener', () => {
    scrollTracker.initScrollTracking();
    expect(mockBrowser.mockWindow.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  test('should detect active heading based on viewport position', () => {
    // Mock viewport dimensions and scroll position
    mockBrowser.mockWindow.innerHeight = 768;
    mockBrowser.mockWindow.pageYOffset = 100;
    
    scrollTracker.updateActiveHeading();
    
    // Should activate first heading since it's within viewport threshold
    expect(scrollTracker.activeHeading).toBe('heading-1');
  });

  test('should highlight last heading when near bottom of page', () => {
    // Mock near-bottom scroll position
    mockBrowser.mockWindow.pageYOffset = 850;
    mockBrowser.mockWindow.innerHeight = 768;
    mockBrowser.mockDocument.documentElement.scrollHeight = 1000;
    
    scrollTracker.updateActiveHeading();
    
    expect(scrollTracker.activeHeading).toBe('heading-2');
  });
});

// Example Test Suite for TOCManager
describe('TOCManager', () => {
  let tocManager;
  let mockBrowser;

  beforeEach(() => {
    mockBrowser = new MockBrowserEnvironment();
    
    // Mock all required TOC elements
    const mockElements = {
      'toc-toggle': mockBrowser.createElement('button'),
      'toc-panel': mockBrowser.createElement('nav'),
      'toc-overlay': mockBrowser.createElement('div'),
      'toc-list': mockBrowser.createElement('ul'),
      'toc-hamburger': mockBrowser.createElement('span'),
      'toc-close': mockBrowser.createElement('span')
    };
    
    Object.entries(mockElements).forEach(([id, element]) => {
      mockBrowser.addMockElement(id, element);
    });
    
    // Mock post content
    mockBrowser.addMockElement('.post-content', {
      querySelectorAll: jest.fn(() => [])
    });
    
    tocManager = new TOCManager(mockBrowser);
  });

  test('should initialize with closed state', () => {
    expect(tocManager.isOpen).toBe(false);
  });

  test('should detect desktop viewport correctly', () => {
    mockBrowser.mockWindow.innerWidth = 1200;
    expect(tocManager.isDesktop()).toBe(true);
    
    mockBrowser.mockWindow.innerWidth = 800;
    expect(tocManager.isDesktop()).toBe(false);
  });

  test('should open TOC and update UI state', () => {
    const mockToggle = mockBrowser.getElementById('toc-toggle');
    const mockPanel = mockBrowser.getElementById('toc-panel');
    
    tocManager.openTOC();
    
    expect(tocManager.isOpen).toBe(true);
    expect(mockPanel.classList.add).toHaveBeenCalledWith('visible');
    expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
  });

  test('should close TOC and return focus to toggle', () => {
    tocManager.isOpen = true;
    const mockToggle = mockBrowser.getElementById('toc-toggle');
    
    tocManager.closeTOC();
    
    expect(tocManager.isOpen).toBe(false);
    expect(mockToggle.focus).toHaveBeenCalled();
  });

  test('should handle viewport changes appropriately', () => {
    // Test mobile to desktop transition
    mockBrowser.mockWindow.innerWidth = 800;
    tocManager.isOpen = false;
    
    mockBrowser.mockWindow.innerWidth = 1200;
    tocManager.handleViewportChange();
    
    expect(tocManager.isOpen).toBe(true); // Should auto-open on desktop
  });
});

// Integration test example
describe('Application Integration', () => {
  test('should initialize all managers with shared browser environment', () => {
    const mockBrowser = new MockBrowserEnvironment();
    
    // Mock required elements
    mockBrowser.addMockElement('toc-panel', mockBrowser.createElement('nav'));
    mockBrowser.addMockElement('.bio-content', mockBrowser.createElement('div'));
    
    initializeApp(mockBrowser);
    
    expect(mockBrowser.mockWindow.requestAnimationFrame).toHaveBeenCalled();
    expect(mockBrowser.mockWindow.themeManager).toBeInstanceOf(ThemeManager);
    expect(mockBrowser.mockWindow.tocManager).toBeInstanceOf(TOCManager);
    expect(mockBrowser.mockWindow.bioCollapseManager).toBeInstanceOf(BioCollapseManager);
  });
});

/**
 * Key Benefits of This Dependency Injection Approach:
 * 
 * 1. **Complete Testability**: All browser APIs are mockable
 * 2. **Isolated Testing**: Each class can be tested independently
 * 3. **Predictable Behavior**: No reliance on real DOM state
 * 4. **Fast Tests**: No need for browser environment or DOM manipulation
 * 5. **Easy Debugging**: Clear dependency relationships
 * 6. **Maintainable**: Changes to browser interactions are centralized
 * 
 * Before: Direct window/document access made testing nearly impossible
 * After: Clean interfaces enable comprehensive unit and integration testing
 */