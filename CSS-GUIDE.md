# CSS Architecture Guide

## Quick Start

**Adding a new feature?** Jump to the relevant section below:
- [Adding Components](#adding-components)
- [Common Patterns](#common-patterns)
- [What NOT to Touch](#what-not-to-touch)

## File Organization

The `style.css` file is organized in sections:

```css
/* 1. Documentation Header (lines 1-40) */
/* 2. Reset Styles (minified - don't touch) */
/* 3. Theme Variables (:root and .dark) */
/* 4. Utility Classes (minified but functional) */
/* 5. Components (organized by feature) */
```

### Component Sections

Each component has a clear section marker:

```css
/* ========================================================================== */
/* COMPONENT NAME - Brief description                                         */
/* ========================================================================== */
```

Current components:
- **POST CONTENT** - Blog post typography and layout
- **TABLE OF CONTENTS** - Navigation and scroll tracking  
- **FOOTER** - Vibe Check button and social links
- **VIBE CHECK** - Interactive theme cycling system
- **BIO COLLAPSE** - Mobile responsive bio expansion

## Adding Components

### 1. Find the Right Section
- **New component?** Add at the END of the file
- **Extending existing?** Find the component section using Cmd+F

### 2. Follow the Naming Convention
```css
/* Good Examples */
.newsletter-form { }          /* Main component */
.newsletter-form-input { }    /* Sub-element */
.newsletter-form-button { }   /* Sub-element */

/* Bad Examples */
.newsletterForm { }           /* camelCase - don't use */
.newsletter_form { }          /* underscores - don't use */
.form-newsletter { }          /* wrong order - don't use */
```

### 3. Add Section Comments
```css
/* ========================================================================== */
/* NEWSLETTER COMPONENT - Email subscription form                             */
/* ========================================================================== */

.newsletter-form {
  /* Your styles here */
}

.newsletter-form-input {
  /* Input specific styles */
}

.newsletter-form.is-submitting {
  /* Loading state */
}
```

## Common Patterns

### Dark Mode Support
Always add styles for both themes:

```css
.my-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

/* Colors automatically adapt - no need for .dark overrides */
```

### Responsive Design
Mobile-first approach:

```css
.my-component {
  /* Mobile styles (base) */
  padding: 1rem;
}

@media (min-width: 640px) {
  .my-component {
    /* Tablet styles */
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .my-component {
    /* Desktop styles */
    padding: 2rem;
  }
}
```

### State Management
Use descriptive state classes:

```css
.my-component {
  /* Default state */
}

.my-component.is-loading {
  /* Loading state */
}

.my-component.is-error {
  /* Error state */
}

.my-component.is-disabled {
  /* Disabled state */
}
```

### Accessibility
Always include focus states:

```css
.my-button {
  /* Default styles */
}

.my-button:hover {
  /* Hover styles */
}

.my-button:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.my-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## What NOT to Touch

### ❌ Minified Sections
These are performance-optimized and should not be edited:

```css
/* Lines 42-43: Reset Styles */
*,*:before,*:after{box-sizing:border-box...

/* Lines 111-112: Utility Classes */
.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}...
```

### ❌ Theme Variables Structure
Don't change the variable names or structure:

```css
:root {
  --background: 49 22% 93%;  /* Don't change variable names */
  --foreground: 20 5% 12%;   /* Don't change HSL format */
}
```

### ❌ Existing Component Structure
Don't rename existing classes - they're used in JavaScript:

```css
/* DON'T rename these - JavaScript depends on them */
.vibe-panel
.toc-toggle
.bio-content
.academic-link
```

## Testing Your Changes

### 1. Both Themes
```bash
# Test in both light and dark mode
# Toggle the theme switch in header
```

### 2. All Breakpoints
```bash
# Test mobile (< 640px)
# Test tablet (640px - 1023px)  
# Test desktop (>= 1024px)
```

### 3. Accessibility
```bash
# Test keyboard navigation (Tab key)
# Test focus states are visible
# Test screen reader announcements
```

### 4. All Pages
```bash
# Test homepage (index.html)
# Test blog posts (posts/*.html)
```

## Getting Help

1. **Read the documentation header** in style.css (lines 1-40)
2. **Look for similar components** - copy their pattern
3. **Ask questions** - better to ask than break something
4. **Test thoroughly** - responsive, accessible, both themes

## Examples

### Adding a Contact Form
```css
/* ========================================================================== */
/* CONTACT FORM COMPONENT - User inquiry form                                 */
/* ========================================================================== */

.contact-form {
  max-width: 32rem;
  margin: 0 auto;
  padding: 2rem;
  background: hsl(var(--card));
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
}

.contact-form-field {
  margin-bottom: 1.5rem;
}

.contact-form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.contact-form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.25rem;
  background: hsl(var(--input));
  color: hsl(var(--foreground));
}

.contact-form-input:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-color: hsl(var(--ring));
}

.contact-form-button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.contact-form-button:hover {
  opacity: 0.9;
}

.contact-form-button:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.contact-form-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-form.is-submitting .contact-form-button {
  opacity: 0.6;
}

.contact-form-error {
  color: hsl(var(--destructive));
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.contact-form-success {
  color: hsl(var(--accent));
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .contact-form {
    padding: 1rem;
  }
}
```

Happy coding! 🎨