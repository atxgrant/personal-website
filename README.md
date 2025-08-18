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
- Three custom themes: Synthwave Sunset, Desert Pinon, Texas Wildflower
- Slide-up panel displaying theme images with smooth animations
- Professional backdrop and multiple close interactions (backdrop, × button, ESC key)
- Theme colors dynamically applied while maintaining functionality
- Optimized footer layout with Vibe Check button prioritized above LinkedIn logo

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
- **Performance** - Critical CSS inlining, resource preloading, deferred script loading
- **PWA Ready** - Web app manifest and favicons for all devices
- **Error Handling** - Custom 404 page with helpful navigation
- **Accessibility** - Skip links, ARIA attributes, keyboard navigation support
- **Contact Options** - Multiple ways to connect (email, LinkedIn)

### 👨‍💻 **Developer Experience**
- **Console ASCII Art** - Branded "GH" ASCII art greeting in browser console
- **Developer Easter Egg** - Contact invitation for curious developers who inspect the code
- **Clean Architecture** - Modular JavaScript classes with comprehensive documentation

## 🏗️ Project Structure

```
personal-website/
├── index.html              # Homepage with bio and post links
├── style.css               # Complete styling with theme variables
├── script.js               # JavaScript for all interactive features
├── 404.html                # Custom error page
├── favicon.svg             # SVG favicon
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for SEO
├── site.webmanifest        # PWA manifest
├── fonts/                  # Self-hosted typography
│   ├── newsreader-400.woff2
│   ├── newsreader-600.woff2
│   └── newsreader.css
├── posts/                  # Blog posts directory
│   └── hello-world.html    # Sample blog post
├── templates/              # Template files for creating new content
│   └── post-template.html  # Template for new blog posts
└── vibe-themes/            # Vibe Check theme system
    ├── theme-data.json     # Theme configuration and color palettes
    └── images/             # Theme preview images
        ├── synthwave-sunset.jpg
        ├── desert-pinon.jpg
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
- **Vanilla JavaScript** - Modular classes for feature management
- **No build process** - Direct file serving for simplicity

### JavaScript Architecture
- **BrowserEnvironment** - Abstracts DOM/Window APIs for testability and clean architecture
- **ThemeManager** - Handles dark/light mode functionality with system preference detection and vibe theme integration
- **VibeCheckManager** - Manages interactive theme cycling, slide-up panel, and theme image display
- **TOCManager** - Generates and manages table of contents with responsive behavior
- **HeadingGenerator** - Extracts and structures content headings for navigation
- **ScrollTracker** - Manages active section highlighting during scroll
- **BioCollapseManager** - Handles mobile bio expand/collapse functionality

### CSS Architecture
- CSS custom properties for consistent theming
- Mobile-first responsive design
- Utility classes for common patterns
- Modular component styles (TOC, bio, theme toggle)

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
- **Accessibility** - Proper semantic HTML, keyboard navigation, and screen reader support
- **Performance** - Minimal dependencies and optimized assets for fast loading

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Connect

- **LinkedIn**: [Grant Heimbach](https://www.linkedin.com/in/grantheimbach/)
- **Website**: [Live Site](https://atxgrant.github.io/personal-website/)

---

Built with ❤️ by Grant Heimbach - Product Manager exploring the intersection of AI and product management.