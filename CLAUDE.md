# CLAUDE.md - AI Assistant Context

This document contains important context for AI assistants working on this website.

## Project Overview

An [Astro](https://astro.build) static site (migrated from Jekyll in November 2026) that collects accessible summaries of peer-reviewed research at the intersection of meditation and brain science. It is deployed to GitHub Pages at https://contemplativeneuroscience.com.

## Commands

Requires Node >= 22.23.4 (see `.nvmrc` / `package.json` engines).

```bash
npm install
npm run dev      # dev server (Astro 7 runs it in the background; stop with `npx astro dev stop`)
npm run build    # static build into dist/
npm run preview  # serve dist/
npm run check    # type-check .astro/.ts files
```

Always run `npm run check` and `npm run build` before committing.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `master` (GitHub Pages source: "GitHub Actions"). Nothing generated is committed: CSS and minified JS are produced by the build.

## Layout

```
src/
  content/posts/      Paper summaries: YYYY-MM-DD-slug.md -> /slug/ (files starting with _ are ignored)
  content/themes/     Research themes -> /themes/<theme_key>/
  content.config.ts   Front-matter schemas for posts and themes
  data/definitions.yaml  Glossary terms (tooltips + /glossary/)
  layouts/            BaseLayout (document shell), DefaultLayout, PageLayout, PostLayout, ThemeLayout
  components/         Head, Header, Footer, Breadcrumbs, Subscribe (+ subscribe.html, third-party MailerLite markup)
  lib/content.ts      Collection helpers (sorting, URLs, theme lookups, markdownify)
  lib/seo.ts          <title> logic, meta descriptions, JSON-LD (Article, BreadcrumbList, Person)
  lib/remark-glossary-terms.js  Renders :term{...} directives as glossary tooltips
  lib/rehype-image-dimensions.js  Adds width/height (+ lazy loading) to markdown images
  lib/images.js       publicImageSize(): pixel size of a file in public/
  pages/              Routes; [slug].astro = posts, themes/[theme].astro = themes
  pages/css/[name].css.ts       Compiles src/styles/<name>.sass -> /css/<name>.css
  pages/assets/js/[name].js.ts  Serves src/scripts/<name>.js -> /assets/js/<name>.js and <name>.min.js
  pages/feed.xml.ts, sitemap.xml.ts
  styles/             Sass (indented syntax), incl. vendored Bourbon
  scripts/            Browser JS (plain scripts, not modules)
public/               Copied verbatim: images, favicons, CNAME, robots.txt, llms.txt, print/normalize CSS
```

## Writing Posts

Copy `src/content/posts/_template_post.md`. Glossary tooltips use markdown directives:

```md
:term{id="eeg"}                          EEG
:term{id="mindfulness" case="lower"}     mindfulness
:term{id="eeg" plural}                   EEGs
:term[inflammatory]{id="inflammation"}   custom link text
```

An unknown term id fails the build, and so does an image path that is not in `public/`. Link to other posts by URL, e.g. `[Lutz et al. 2004](/high-amplitude-gamma-synchrony/)`.

Front matter: `title`, `date`, `theme` (one key or a list), `doi`, `meta_description` (≤ 155 chars; over 160 fails the build), `snippet`, `citation` (markdown), optional `seo_title` (≤ 60 chars; used for `<title>` when the title is long), `last_modified_at` (drives `dateModified` and sitemap `lastmod`), `schema_image`.

Front matter is parsed by a strict YAML parser: continuation lines of a multi-line quoted string must be indented.

## URL Stability

Every URL from the Jekyll site is preserved (pages, `/css/*.css`, `/assets/js/*.js` and `*.min.js`, `/feed.xml`, `/sitemap.xml`, all images). Keep it that way:
- `trailingSlash: 'always'` + `build.format: 'directory'` give `/slug/` URLs like Jekyll's `/:title/`.
- The sitemap is a single `/sitemap.xml` (robots.txt and Search Console point at it); do not swap in `@astrojs/sitemap`, which emits a sitemap index at a different URL.

## Styles

- Sass indented syntax (`.sass`), entry points `main`, `tooltip`, `pages`, `components` in `src/styles/`; partials in `src/styles/{components,pages,mixins}`.
- Semantic variables live in `src/styles/_variables.sass` — check there before adding colors or dimensions.
- Text must meet WCAG AA contrast (4.5:1). Use `$color-primary-text` (not `$color-primary`) for pink text and `$color-text-muted` (#767676) as the lightest grey for text; `$color-primary` is for borders and backgrounds.
- Dart Sass deprecation warnings (`@import`, Bourbon's old syntax) are silenced in `pages/css/[name].css.ts`; Dart Sass 3 will require migrating to `@use` and dropping Bourbon.
- Breakpoints: 768px, 800px, 1024px.

## Gotchas

- Astro's HTML compression removes whitespace between elements. Where inline elements need a gap (nav links, "Themes:" label), emit `{' '}` explicitly.
- Smart typography matches kramdown: `--` → en dash, `---` → em dash (`SMARTYPANTS_OPTIONS`).
- Breadcrumbs: the visible trail is chosen client-side from `document.referrer` (`src/scripts/breadcrumbs.js`); the only structured breadcrumb data is the JSON-LD BreadcrumbList.
- Use state classes (`.visible`, `.expanded`, `.active`) rather than inline style manipulation in JS; dynamic backgrounds use `data-bg-image` attributes.
- `subscribe.html` is ~700 lines of third-party MailerLite CSS/markup — handle with care.

## Internal Links

- The home page lists the 5 newest papers; every post ends with up to 4 Related Papers (`relatedPosts()`: papers sharing a theme, nearest in date first, so links spread across the archive) plus links to its theme pages.
- `<title>` gets the " | Contemplative Neuroscience" suffix only when the result is ≤ 60 characters.

## Share Cards and Images

- Posts use `og:type` article and their own image (`postImage()`: `schema_image`, else the first figure, else the logo); theme pages use the theme image. `twitterCard()` picks `summary_large_image` only for landscape images at least 600×315 — most figures are smaller and get the compact card.
- Keep images light: theme images are 800×800 WebP (q80), the header JPEG is progressive q78, the logo is 400×400.

## Known Improvement Opportunities

- Generated 1200×630 share images per post (most figures are too small for large cards).
- Heading levels skip on All Papers (h1 → h3), the glossary and the MailerLite form (h4).
- `compassion-alters-altruism` has no theme (so it is on no theme page and its Related Papers fall back to papers nearest in date), and `ecstatic-meditation-reward-system` lists an unknown theme key, `meditation-states`.
