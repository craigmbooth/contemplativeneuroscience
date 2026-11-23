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

An unknown term id fails the build. Link to other posts by URL, e.g. `[Lutz et al. 2004](/high-amplitude-gamma-synchrony/)`.

Front matter: `title`, `date`, `theme` (one key or a list), `doi`, `meta_description` (≤ ~160 chars), `snippet`, `citation` (markdown), optional `seo_title` (≤ 60 chars; used for `<title>` when the title is long), `last_modified_at` (drives `dateModified` and sitemap `lastmod`), `schema_image`.

Front matter is parsed by a strict YAML parser: continuation lines of a multi-line quoted string must be indented.

## URL Stability

Every URL from the Jekyll site is preserved (pages, `/css/*.css`, `/assets/js/*.js` and `*.min.js`, `/feed.xml`, `/sitemap.xml`, all images). Keep it that way:
- `trailingSlash: 'always'` + `build.format: 'directory'` give `/slug/` URLs like Jekyll's `/:title/`.
- The sitemap is a single `/sitemap.xml` (robots.txt and Search Console point at it); do not swap in `@astrojs/sitemap`, which emits a sitemap index at a different URL.

## Styles

- Sass indented syntax (`.sass`), entry points `main`, `tooltip`, `pages`, `components` in `src/styles/`; partials in `src/styles/{components,pages,mixins}`.
- Semantic variables live in `src/styles/_variables.sass` — check there before adding colors or dimensions.
- Dart Sass deprecation warnings (`@import`, Bourbon's old syntax) are silenced in `pages/css/[name].css.ts`; Dart Sass 3 will require migrating to `@use` and dropping Bourbon.
- Breakpoints: 768px, 800px, 1024px.

## Gotchas

- Astro's HTML compression removes whitespace between elements. Where inline elements need a gap (nav links, "Themes:" label), emit `{' '}` explicitly.
- Smart typography matches kramdown: `--` → en dash, `---` → em dash (`SMARTYPANTS_OPTIONS`).
- Breadcrumbs: the visible trail is chosen client-side from `document.referrer` (`src/scripts/breadcrumbs.js`); the only structured breadcrumb data is the JSON-LD BreadcrumbList.
- Use state classes (`.visible`, `.expanded`, `.active`) rather than inline style manipulation in JS; dynamic backgrounds use `data-bg-image` attributes.
- `subscribe.html` is ~700 lines of third-party MailerLite CSS/markup — handle with care.

## Known Improvement Opportunities

- Theme images in `public/assets/images/themes/` are 1.2–1.7 MB each.
- Per-paper `og:image` / `summary_large_image` cards; `og:type` should be `article` on posts.
- Many `meta_description`s exceed ~160 characters.
