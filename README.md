# Grant Heimbach - Personal Website

A clean, academic-style personal website and blog documenting AI tool experiments and their impact on product management work.

## 🎯 Purpose

This website serves as a digital space to share practical insights from experimenting with AI tools in product management scenarios. Rather than theoretical discussions, the focus is on honest, field-tested experiences with specific tools, techniques, and use cases.

## ✨ Features

### 🌓 **Dark/Light Mode**
- Automatic theme detection based on system preferences
- Manual toggle with smooth transitions
- Persistent theme selection stored in localStorage
- Academic color scheme optimized for readability

### 🎨 **Vibe Check Theme System**
- Interactive theme cycling with "Change Vibe" button
- Nine custom themes with rich visual aesthetics and screen reader descriptions
- Slide-up panel displaying theme images with smooth animations
- Professional backdrop and multiple close interactions (backdrop, × button, ESC key, swipe down on mobile)
- Theme colors dynamically applied while maintaining functionality
- Optimized footer layout with Vibe Check button prioritized above LinkedIn logo
- Full accessibility support with focus management and ARIA live announcements

#### Available Themes:
- **Desert Pinon**: Warm earthy tones inspired by the American Southwest, with soft beige backgrounds, brown text, and turquoise accent colors that capture the essence of desert landscapes
- **Synthwave Sunset**: A retro-futuristic 80s aesthetic with electric cyan text on deep purple backgrounds, featuring neon pink accents that evoke cyberpunk and synthwave vibes
- **Texas Wildflower**: Bright and cheerful with cream backgrounds and deep blue text, featuring golden yellow links that reflect the vibrant wildflower fields of Texas
- **Cher Orleans**: Bold Mardi Gras-inspired theme with deep purple backgrounds, golden text, and vibrant green accents that celebrate New Orleans culture
- **Falling Water**: Inspired by Frank Lloyd Wright's architectural masterpiece, with warm cream backgrounds, Cherokee red text, and golden accents that blend natural elements with modernist design
- **Star Stuff**: Cosmic theme with deep space blue backgrounds, cyan text, and purple-pink accents that evoke the wonder of the universe
- **Park Ranger**: Evokes WPA National Park poster art with warm beige backgrounds, dark brown text, and sky blue accents that capture the spirit of America's national parks
- **Reader Beware**: Goosebumps-inspired spooky theme with black backgrounds, lime green text, and orange-yellow accents for a fun horror aesthetic
- **Craftsman Comfort**: Celebrates Arts and Crafts architecture with warm cream backgrounds, rich brown text, and copper-bronze accents that embody handcrafted quality and natural materials

### 📑 **Table of Contents (TOC)**
- Auto-generating navigation for blog posts
- Desktop: Opens by default for easy navigation
- Mobile/Tablet: Collapsible overlay with smooth animations
- Active section highlighting while scrolling
- Keyboard navigation support (ESC to close)

### 📱 **Responsive Design**
- Mobile-first approach with progressive enhancement
- Bio content collapse on mobile to improve readability
- Adaptive TOC positioning across screen sizes
- Touch-friendly interface elements

### 🎨 **Academic Aesthetic**
- Newsreader serif typography with Georgia fallback for professional appearance
- Warm, sophisticated color palette
- Minimal design with focus on content readability
- Consistent spacing and typography hierarchy

### 🚀 **Professional Features**
- **SEO Optimized** - Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt
- **Performance** - Critical CSS inlining, resource preloading, deferred script loading, lazy image loading, conditional asset loading
- **PWA Ready** - Web app manifest and favicons for all devices
- **Error Handling** - Custom 404 page, comprehensive error boundaries, safe localStorage wrapper, graceful degradation
- **Accessibility** - Skip links, ARIA attributes, keyboard navigation, focus management, screen reader announcements, reduced motion support
- **Memory Management** - Comprehensive cleanup systems, event listener management, timeout tracking, automatic page unload cleanup
- **Code Quality** - Enterprise-level architecture, JSDoc documentation, modular components, comprehensive error handling
- **Contact Options** - Multiple ways to connect (email, LinkedIn)

### 👨‍💻 **Developer Experience**
- **Console ASCII Art** - Branded "GH" ASCII art greeting in browser console
- **Developer Easter Egg** - Contact invitation for curious developers who inspect the code
- **Clean Architecture** - Modular JavaScript classes with comprehensive documentation

## 🏗️ Project Structure

```
personal-website/
├── index.html              # Homepage with bio and post links
├── style.css               # Main styling with component organization
├── script.js               # Legacy script (maintained for compatibility)
├── 404.html                # Custom error page
├── favicon.svg             # SVG favicon
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for SEO
├── site.webmanifest        # PWA manifest
├── CSS-GUIDE.md            # Comprehensive CSS architecture documentation
├── css/                    # Modular CSS architecture
│   └── variables.css       # Centralized CSS custom properties and theme system
├── js/                     # Modular JavaScript architecture
│   ├── core.js            # Main application logic with enterprise-level error handling
│   └── toc.js             # Table of Contents functionality (conditionally loaded)
├── fonts/                  # Self-hosted typography with performance optimization
│   ├── newsreader-400.woff2
│   ├── newsreader-600.woff2
│   └── newsreader.css
├── posts/                  # Blog posts directory
│   └── hello-world.html    # Sample blog post with TOC integration
├── templates/              # Template files for creating new content
│   └── post-template.html  # Template for new blog posts with performance optimization
└── vibe-themes/            # Vibe Check theme system
    ├── theme-data.json     # Theme configuration and color palettes
    └── images/             # Theme preview images with lazy loading
        ├── cher-orleans.jpg
        ├── craftsman-comfort.jpg
        ├── desert-pinon.jpg
        ├── falling-water.jpg
        ├── park-ranger.jpg
        ├── reader-beware.jpg
        ├── star-stuff.jpg
        ├── synthwave-sunset.jpg
        └── texas-wildflower.jpg
```

## 🚀 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/atxgrant/personal-website.git
cd personal-website

# Start local development server
python3 -m http.server 8000

# Visit http://localhost:8000 in your browser
```

### Creating New Blog Posts
1. Copy `templates/post-template.html` to `posts/your-post-name.html`
2. Replace template variables:
   - `{{POST_TITLE}}` - Your post title
   - `{{POST_DESCRIPTION}}` - Meta description for SEO (150-160 chars)
   - `{{POST_DATE}}` - ISO date format (YYYY-MM-DD)
   - `{{POST_DATE_FORMATTED}}` - Human-readable date
   - `{{POST_SLUG}}` - URL-friendly version of title (e.g., "hello-world")
   - `{{POST_KEYWORDS}}` - Comma-separated keywords for structured data
   - `{{POST_CONTENT}}` - Your post content in HTML
3. Add link to new post in `index.html` under "Short posts" section
4. Update `sitemap.xml` with the new post URL and date
5. The TOC will automatically generate from `<h2>` headings in your content

### Customizing Vibe Themes
The Vibe Check system uses `vibe-themes/theme-data.json` to define themes:
```json
{
  "themes": [
    {
      "name": "Theme Name",
      "image": "theme-image.jpg",
      "colors": {
        "--background": "hsl values",
        "--foreground": "hsl values",
        // ... other CSS custom properties
      }
    }
  ]
}
```
Add theme images to `vibe-themes/images/` and update the JSON configuration to add new themes.

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties for theming, CSS Grid/Flexbox for layout
- **Vanilla JavaScript** - Modular classes with enterprise-level architecture
- **No build process** - Direct file serving for simplicity with performance optimization

### 🏗️ Architecture Highlights

This website implements **enterprise-level code quality** with a comprehensive 10-phase architecture overhaul:

#### **Phase 1-3: Foundation & Safety**
- Centralized configuration system (`SITE_CONFIG`)
- Safe localStorage wrapper preventing crashes
- Comprehensive error boundaries and graceful degradation
- User-friendly error messages with retry logic

#### **Phase 4-6: Modularity & Performance**  
- Code splitting with conditional loading (TOC only on blog posts)
- CSS variables extraction for maintainability
- Resource preloading and lazy loading optimizations
- Memory-efficient caching systems

#### **Phase 7-9: Quality & Sustainability**
- Comprehensive JSDoc documentation
- Strategic inline comments explaining complex logic
- Complete memory management with `destroy()` methods
- Event listener cleanup and timeout tracking

#### **Phase 10: Validation & Polish**
- Enterprise-level testing and validation
- Reduced console logging for production
- Performance monitoring and optimization
- Accessibility compliance verification

### JavaScript Architecture (Enterprise-Level)
- **SITE_CONFIG** - Centralized configuration for all magic numbers and constants
- **Safe Storage Wrapper** - Prevents localStorage crashes in private browsing mode
- **SafeInit Class** - Prevents cascading failures during component initialization
- **BrowserEnvironment** - Abstracts DOM/Window APIs for testability and clean architecture
- **ThemeManager** - Handles dark/light mode with system preference detection, vibe theme integration, and comprehensive cleanup
- **VibeCheckManager** - Manages interactive theme cycling, slide-up panel, image caching, and performance optimization
- **TOCManager** - Generates and manages table of contents with responsive behavior and scroll tracking
- **HeadingGenerator** - Extracts and structures content headings for navigation
- **ScrollTracker** - Manages active section highlighting with intersection observer and fallback support
- **BioCollapseManager** - Handles mobile bio expand/collapse with proper event cleanup
- **Memory Management** - All classes include `destroy()` methods with comprehensive resource cleanup
- **Error Boundaries** - System-wide error handling with graceful degradation and user-friendly messages

### CSS Architecture (Modular & Documented)
- **Centralized Variables** - `css/variables.css` with comprehensive theme system and documentation
- **Component Organization** - Clear section headers and modular styles with CSS-GUIDE.md documentation
- **Performance Optimized** - Critical CSS inlining, async loading, and reduced paint operations
- **Accessibility First** - Reduced motion support, focus management, and semantic styling
- **Mobile-first** - Progressive enhancement with touch-optimized interactions

### Browser Support
- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Touch-friendly for mobile devices

## 📝 Content Focus

The blog focuses on practical AI tool experimentation in product management:

- **Research and Analysis** - AI-assisted user feedback synthesis and market analysis
- **Content Creation** - Efficient PRD writing and presentation materials
- **Decision Support** - AI tools for complex product decisions
- **Process Optimization** - Automating repetitive PM tasks

Each post includes honest assessments of tools, covering both successes and limitations to provide realistic expectations for fellow product managers. Currently featuring one foundational post with more experimental content in development.

## 🎨 Design Philosophy

- **Content First** - Clean typography and layout prioritize readability
- **Academic Feel** - Professional aesthetic suitable for career-focused content
- **Inclusive Design** - Full accessibility with semantic HTML, keyboard navigation, focus management, and rich screen reader descriptions that make visual themes meaningful for all users
- **Performance** - Minimal dependencies and optimized assets for fast loading
- **Cultural Appreciation** - Theme designs that respectfully draw inspiration from architectural movements, geographic regions, and artistic periods

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Connect

- **LinkedIn**: [Grant Heimbach](https://www.linkedin.com/in/grantheimbach/)
- **Website**: [Live Site](https://atxgrant.github.io/personal-website/)

---

Built with ❤️ by Grant Heimbach - Product Manager exploring the intersection of AI and product management.