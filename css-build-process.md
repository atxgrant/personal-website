# CSS Build Process for Better Readability

## Problem
Complex media queries become unreadable when minified:
```css
/* Before minification - readable */
@media (max-width: 768px) {
  .bio-content:not(.expanded) .bio-expanded {
    display: none;
  }
  
  .bio-content:not(.expanded) .bio-expand-btn {
    display: inline-block;
    background: none;
    border: none;
    color: var(--link);
    cursor: pointer;
    /* ... more properties */
  }
}

/* After minification - unreadable */
@media (max-width:768px){.bio-content:not(.expanded) .bio-expanded{display:none}.bio-content:not(.expanded) .bio-expand-btn{display:inline-block;background:none;border:none;color:var(--link);cursor:pointer;...}}
```

## Solution Options

### Option 1: Selective Minification (Current Implementation)
- Keep complex responsive sections readable
- Minify simple utility classes
- Best balance of performance and maintainability

**Files:**
- `style-readable.css` - New readable version
- `style.css` - Current minified version (for production)
- `style-original.css` - Full readable backup

### Option 2: Source Maps Development
```bash
# Install CSS build tools
npm install -g postcss postcss-cli autoprefixer cssnano

# Create readable source
# style.source.css (readable)
# ↓ build process
# style.css (minified) + style.css.map

# Development: Use readable source
# Production: Use minified with source maps
```

### Option 3: CSS-in-JS Approach
```javascript
// Readable CSS-in-JS with automatic optimization
const mediaQueries = {
  mobile: '@media (max-width: 768px)',
  desktop: '@media (min-width: 1024px)'
};

const bioCollapse = css`
  ${mediaQueries.mobile} {
    .bio-content:not(.expanded) {
      .bio-expanded { display: none; }
      .bio-expand-btn {
        display: inline-block;
        background: none;
        border: none;
        color: var(--link);
        /* ... readable structure */
      }
    }
  }
`;
```

## Recommended Approach

**Use Option 1 (Selective Minification)** because:
1. No build process required
2. Complex sections stay readable
3. Performance benefits maintained
4. Easy to maintain and debug
5. Works with existing setup

## Implementation

Replace current `style.css` with `style-readable.css` for better maintainability:

```bash
# Backup current minified version
mv style.css style-minified.css

# Use readable version
mv style-readable.css style.css

# Keep original for reference
# style-original.css (full readable backup)
```

## Benefits
- ✅ Complex media queries are readable
- ✅ Critical sections still optimized for performance
- ✅ CSS variables clearly documented
- ✅ Easy to maintain and modify
- ✅ No build process complexity
- ✅ Preserves performance benefits