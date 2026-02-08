# Grant Heimbach - Personal Website

A clean, academic-style personal website and blog documenting AI tool experiments and their impact on product management work.

## Purpose

This website serves as a digital space to share practical insights from experimenting with AI tools in product management scenarios. Rather than theoretical discussions, the focus is on honest, field-tested experiences with specific tools, techniques, and use cases.

## Features

### Dark/Light Mode
- Automatic theme detection based on system preferences
- Manual toggle with smooth transitions
- Persistent theme selection stored in localStorage
- Academic color scheme optimized for readability

### Vibe Check Theme System
- Interactive theme cycling with "Change Vibe" button
- Nine custom themes with rich visual aesthetics and screen reader descriptions
- Slide-up panel displaying theme images with smooth animations
- Multiple close interactions (backdrop, x button, ESC key, swipe down on mobile)
- Theme colors dynamically applied via CSS custom properties
- Full accessibility support with focus management and ARIA live announcements

#### Available Themes:
- **Desert Pinon**: Warm earthy tones inspired by the American Southwest, with soft beige backgrounds, brown text, and turquoise accent colors
- **Synthwave Sunset**: A retro-futuristic 80s aesthetic with electric cyan text on deep purple backgrounds and neon pink accents
- **Texas Wildflower**: Bright and cheerful with cream backgrounds and deep blue text, featuring golden yellow links
- **Cher Orleans**: Bold Mardi Gras-inspired theme with deep purple backgrounds, golden text, and vibrant green accents
- **Falling Water**: Inspired by Frank Lloyd Wright's architectural masterpiece, with warm cream backgrounds and Cherokee red text
- **Star Stuff**: Cosmic theme with deep space blue backgrounds, cyan text, and purple-pink accents
- **Park Ranger**: Evokes WPA National Park poster art with warm beige backgrounds, dark brown text, and sky blue accents
- **Reader Beware**: Goosebumps-inspired spooky theme with black backgrounds, lime green text, and orange-yellow accents
- **Craftsman Comfort**: Celebrates Arts and Crafts architecture with warm cream backgrounds, rich brown text, and copper-bronze accents

### Table of Contents (TOC)
- Auto-generated navigation for blog posts based on `<h2>` headings
- Desktop: Opens by default for easy navigation
- Mobile/Tablet: Collapsible overlay with smooth animations
- Active section highlighting while scrolling
- Keyboard navigation support (ESC to close)

### Responsive Design
- Mobile-first approach with progressive enhancement
- Bio content collapse on mobile to improve readability
- Adaptive TOC positioning across screen sizes
- Touch-friendly interface elements

### Academic Aesthetic
- Newsreader serif typography (self-hosted WOFF2) with Georgia fallback
- Warm, sophisticated color palette
- Minimal design with focus on content readability
- Consistent spacing and typography hierarchy

### Additional Details
- **SEO** - Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt
- **Performance** - Critical CSS inlining, resource preloading, deferred script loading, lazy image loading, conditional asset loading (TOC only on blog posts)
- **PWA Ready** - Web app manifest and favicons
- **Error Handling** - Custom 404 page, safe localStorage wrapper, graceful degradation
- **Accessibility** - Skip links, ARIA attributes, keyboard navigation, focus management, screen reader announcements, reduced motion support

## Project Structure

```
personal-website/
├── index.html              # Homepage with bio and post links
├── style.css               # Main styling with component organization
├── 404.html                # Custom error page
├── favicon.svg             # SVG favicon
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for SEO
├── site.webmanifest        # PWA manifest
├── .htaccess               # Apache config for compression and caching
├── CNAME                   # GitHub Pages custom domain
├── CSS-GUIDE.md            # CSS architecture documentation
├── css/
│   └── variables.css       # Centralized CSS custom properties and theme system
├── js/
│   ├── core.js             # Main application logic (theme, vibe check, bio collapse)
│   └── toc.js              # Table of Contents (conditionally loaded on blog posts)
├── fonts/
│   ├── newsreader-400.woff2
│   ├── newsreader-600.woff2
│   └── newsreader.css
├── posts/
│   ├── hello-world.html
│   └── ai-navigation-vs-acceleration.html
├── templates/
│   └── post-template.html  # Template for new blog posts
└── vibe-themes/
    ├── theme-data.json     # Theme configuration and color palettes
    └── images/             # Theme preview images
```

## Development

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
        "--foreground": "hsl values"
      }
    }
  ]
}
```
Add theme images to `vibe-themes/images/` and update the JSON configuration to add new themes.

## Technologies Used
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties for theming, CSS Grid/Flexbox for layout
- **Vanilla JavaScript** - Modular classes, no frameworks or dependencies
- **No build process** - Direct file serving, nothing to compile or install

### Browser Support
- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Touch-friendly for mobile devices

## Content Focus

The blog focuses on practical AI tool experimentation in product management:

- **Research and Analysis** - AI-assisted user feedback synthesis and market analysis
- **Content Creation** - Efficient PRD writing and presentation materials
- **Decision Support** - AI tools for complex product decisions
- **Process Optimization** - Automating repetitive PM tasks

Each post includes honest assessments of tools, covering both successes and limitations to provide realistic expectations for fellow product managers.

## Design Philosophy

- **Content First** - Clean typography and layout prioritize readability
- **Academic Feel** - Professional aesthetic suitable for career-focused content
- **Inclusive Design** - Full accessibility with semantic HTML, keyboard navigation, and screen reader support
- **Performance** - No dependencies, optimized assets, fast loading
- **Cultural Appreciation** - Theme designs that draw inspiration from architectural movements, geographic regions, and artistic periods

## License

This project is open source and available under the [MIT License](LICENSE).

## Connect

- **LinkedIn**: [Grant Heimbach](https://www.linkedin.com/in/grantheimbach/)
- **Website**: [Live Site](https://grantheimbach.com/)
