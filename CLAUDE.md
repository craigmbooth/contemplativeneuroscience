# CLAUDE.md - AI Assistant Context

This document contains important context and learnings for AI assistants working on this Jekyll-based contemplative neuroscience website.

## Project Overview

This is a Jekyll 3.9.5 static site that collects accessible summaries of peer-reviewed research at the intersection of meditation and brain science.

## Key Technical Details

### Sass/CSS Architecture

1. **Sass files location**: This project uses a non-standard Sass setup:
   - Main Sass files are in `/css/` directory (not `/_sass/`)
   - Files have Jekyll front matter (`---`) which means Jekyll processes them directly
   - However, `@import` statements still look in `/_sass/` directory by default

2. **Important files**:
   - `/css/main.sass` - Main stylesheet
   - `/css/tooltip.sass` - Tooltip-specific styles
   - `/css/pages.sass` - Page-specific styles (imports from _sass/pages/)
   - `/css/components.sass` - Component styles (imports from _sass/components/)
   - `/_sass/_variables.sass` - Centralized variables (must be in _sass for imports to work)
   - `/_sass/pages/_home.sass` - Home page component styles
   - `/_sass/pages/_theme.sass` - Theme page component styles
   - `/_sass/pages/_all-papers.sass` - All papers page component styles
   - `/_sass/pages/_glossary.sass` - Glossary page component styles
   - `/_sass/pages/_themes-index.sass` - Themes index page component styles
   - `/_sass/components/_breadcrumbs.sass` - Breadcrumb navigation styles
   - `/_sass/components/_animations.sass` - Scroll animations and transitions
   - `/_sass/components/_dynamic-backgrounds.sass` - Dynamic background image handling
   - `/_sass/mixins/_background.sass` - Background image mixins
   - `/assets/js/dynamic-backgrounds.js` - JavaScript for setting background images from data attributes

3. **Build commands**: Always use `bundle exec jekyll build` to avoid gem version conflicts

### CSS Variable System

The project uses semantic color variables defined in `/_sass/_variables.sass`:
- Primary colors: `$color-primary`, `$color-primary-dark`, `$color-primary-light`
- Text colors: `$color-text-primary`, `$color-text-secondary`, `$color-text-muted`
- Typography: `$font-family-serif`, `$font-family-sans`
- Layout: `$content-max-width`, `$tooltip-width`
- Spacing: Based on `$base-unit` (16px) with multipliers

### Common Issues & Solutions

1. **Import errors**: If you see "File to import not found or unreadable", ensure imported files are in `/_sass/` directory
2. **Variable naming**: The project previously used inconsistent names (e.g., `$tool-tip-width` vs `$tooltip-width`). All are now standardized
3. **Color consistency**: Many slightly different color values (#333, #333332, #333333) have been consolidated

### SEO Considerations

- The site has good SEO foundations but needs image optimization (logo.png is 2.8MB!)
- All pages should have meta_description in front matter
- Posts use structured data (Article schema) 

### Testing & Validation

Before committing CSS changes:
```bash
cd /home/craig/projects/personal/contemplativeneuroscience
bundle exec jekyll build
```

Check for any Sass compilation errors in the output.

## Content Structure

- Research papers are in `/_posts/` with specific front matter including DOI, citations, and themes
- Themes are organized as separate pages in `/themes/`
- The glossary (`/glossary/`) contains definitions of key terms

## Development Guidelines

1. **DRY Principle**: Always check `/_sass/_variables.sass` before adding new colors or dimensions
2. **Component styles**: Consider extracting inline styles to separate component files
3. **Consistency**: Use semantic variable names rather than hardcoded values
4. **Mobile-first**: The site uses responsive design with breakpoints at 768px, 800px, and 1024px

## CSS Architecture Evolution

### Completed Refactoring (2025-05-25)
1. **Variable consolidation** - All colors, spacing, and typography now use semantic variables
2. **Inline style extraction** - Removed 900+ lines of inline CSS across templates:
   - Glossary page (120 lines)
   - Themes index (67 lines)
   - All-papers page (174 lines)
   - Dynamic backgrounds via data attributes
3. **Component-based architecture** - Styles organized into:
   - `/css/pages.sass` - Page-specific styles
   - `/css/components.sass` - Reusable components
   - `/_sass/pages/` - Individual page styles
   - `/_sass/components/` - Component styles
   - `/_sass/mixins/` - Shared mixins

### JavaScript Style Management
- Replaced direct style manipulation with CSS classes
- Use `.classList.add/remove()` instead of `.style.property`
- Dynamic backgrounds use `data-bg-image` attributes

## Future Improvements Identified

From the SEO and CSS audits, priority improvements include:
1. ✅ Variable consolidation (completed)
2. ✅ Extract inline styles from templates (completed)
3. Image optimization (especially logo.png - currently 2.8MB!)
4. Implement consistent mixins for common patterns
5. Add missing meta tags and schema markup
6. Page title truncation to 70 characters (partially implemented)

## Common Patterns & Best Practices

### CSS Refactoring Approach
1. **Extract inline styles to components** - Create semantic component files rather than utility classes
2. **Use data attributes for dynamic values** - Replace `style="background-image: url()"` with `data-bg-image`
3. **State classes over style manipulation** - Use `.visible`, `.expanded`, `.active` instead of display/transform styles
4. **Consistent variable usage** - Always check `_variables.sass` before adding new values

### File Organization
- Page-specific styles go in `/_sass/pages/`
- Reusable components go in `/_sass/components/`
- Mixins go in `/_sass/mixins/`
- Each major CSS file in `/css/` should only contain imports

### Common Pitfalls to Avoid
1. **Don't put variables in `/css/`** - They must be in `/_sass/` for imports to work
2. **Check for duplicate variable definitions** - Especially in tooltip.sass and main.sass
3. **Use exact string matching for edits** - Whitespace and newlines matter in multiline replacements
4. **Test builds frequently** - Sass compilation errors aren't always obvious

## Notes for AI Assistants

- When asked about CSS/Sass issues, always check the actual file structure first - don't assume standard Jekyll conventions
- The site uses Sass indented syntax (.sass) not SCSS (.scss)
- Be careful with variable replacements - use exact string matching or context-aware replacements
- Always test builds after CSS changes to catch compilation errors early
- When refactoring inline styles, check for JavaScript that may depend on them
- The subscribe.html file contains 590+ lines of third-party CSS - handle with care

Last updated: 2025-05-25