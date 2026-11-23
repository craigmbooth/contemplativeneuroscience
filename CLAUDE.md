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

After each deploy, the workflow submits the pages whose HTML changed (plus any removed pages) to IndexNow (`scripts/indexnow.mjs`), which notifies Bing and other participating search engines. It finds them by comparing the new build with the live site before deploying. The key file `public/92733d5f979cf4080a9a770b5046e59f.txt` must stay published (the key is public by design). To resubmit every page, run the workflow manually with "Submit every page" ticked.

## Layout

```
src/
  content/posts/      Paper summaries: YYYY-MM-DD-slug.md -> /slug/ (files starting with _ are ignored)
  content/themes/     Research themes -> /themes/<theme_key>/
  content.config.ts   Front-matter schemas for posts and themes
  data/definitions.yaml  Glossary terms (tooltips + /glossary/)
  layouts/            BaseLayout (document shell), DefaultLayout, PageLayout, PostLayout, ThemeLayout
  components/         Head, Header, Footer, Breadcrumbs, PaperMeta, Subscribe (email sign-up box)
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
  pages/llms.txt.ts, llms-full.txt.ts  AI-facing index and full text of every summary (lib/llms.ts)
public/               Copied verbatim: images, favicons, CNAME, robots.txt, print/normalize CSS
```

## Writing Posts

Copy `src/content/posts/_template_post.md`. Glossary tooltips use markdown directives:

```md
:term{id="eeg"}                          EEG
:term{id="mindfulness" case="lower"}     mindfulness
:term{id="eeg" plural}                   EEGs
:term[inflammatory]{id="inflammation"}   custom link text
```

An unknown term id fails the build, and so does an unknown theme key or an image path that is not in `public/`. Link to other posts by URL, e.g. `[Lutz et al. 2004](/high-amplitude-gamma-synchrony/)`.

Front matter: `title` (a plain-language headline stating the finding, not the paper's title), `paper_title` (the paper's own title; used in structured data and All Papers search), `date`, `theme` (one key or a list), `doi`, `meta_description` (≤ 155 chars; over 160 fails the build), `snippet`, `citation` (markdown), optional `seo_title` (≤ 60 chars; used for `<title>` when the title is long), `last_modified_at` (drives `dateModified` and sitemap `lastmod`), `schema_image`.

`study.type` is a short listing label from the fixed `STUDY_TYPES` list in `src/content.config.ts` (e.g. "Randomized trial", "Meta-analysis", "Survey"); anything else fails the build. Themes need a `short_title` (listing label, e.g. "Sleep") and a `question` (the theme as a reader's question, shown on the home page).

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
- Breakpoints: 768px, 800px, 1024px; the slim bar's menu collapses into the hamburger below 960px (`$breakpoint-menu`).

## Gotchas

- Astro's HTML compression removes whitespace between elements. Where inline elements need a gap (nav links, "Themes:" label), emit `{' '}` explicitly.
- Image width/height come from the file at render time and are cached with the rendered markdown (`.astro/data-store.json` for dev, `node_modules/.astro/data-store.json` for builds). If you replace an image without editing its post, delete both files (and restart `npm run dev`) to pick up the new size. CI builds start clean.
- Smart typography matches kramdown: `--` → en dash, `---` → em dash (`SMARTYPANTS_OPTIONS`).
- Header: the home page keeps the full starfield banner; every other page gets the slim `.site-bar` (`Header.astro`, `styles/components/_site-bar.sass`) so content starts near the top. Both share the `.menu-toggle` / `.custom-links` hooks used by `scripts/bundle.js`.
- Social cards (og:title) use the headline (`title`); the browser/search `<title>` uses `seo_title` when set.
- Breadcrumbs: the visible trail is chosen client-side from `document.referrer` (`src/scripts/breadcrumbs.js`); the only structured breadcrumb data is the JSON-LD BreadcrumbList.
- Use state classes (`.visible`, `.expanded`, `.active`) rather than inline style manipulation in JS; dynamic backgrounds use `data-bg-image` attributes.
- `Subscribe.astro` is our own markup and styles (`components/_subscribe.sass`) around MailerLite's submit script, which finds the form by its ids and classes (listed in the component). Keep those hooks, and use the component at most once per page (fixed ids).

## Internal Links

- Posts and pages use the narrower reading column (`.content.reading`, `$content-reading-width`); the home page keeps the full width.
- Listings show a `PaperMeta` line (date, study type, theme links); All Papers can filter by study type.
- The home page has a hand-picked "Start Here" set (`site.startHere` in `src/site.ts`; an unknown slug fails the build), the themes as questions (order set in `pages/index.astro`, thumbnails in `public/assets/images/themes/thumbs/`, 240px WebP), and the 5 newest papers with date, study type and theme; every post ends with up to 4 Related Papers (`relatedPosts()`: papers sharing a theme, nearest in date first, so links spread across the archive) plus links to its theme pages.
- `<title>` gets the " | Contemplative Neuroscience" suffix only when the result is ≤ 60 characters.

## Email Sign-up

- The promise beside every sign-up form is `site.newsletter.promise` (one or two summaries every couple of weeks); change it there if the cadence changes.
- Forms appear at the end of every post (after the citation), on the home page, on About (`subscribe: true` front matter, via PageLayout) and on `/subscribe/`, which the menu's Subscribe button and the footer link to.

## AI Search (GEO)

- Each post opens with a byline (author, published/updated dates), an "In brief" box showing its `snippet`, and a "Study at a glance" box from the `study` front matter (design, participants, method, measures, limitations). Keep snippets self-contained (60–75 words: the question, what the researchers did, the finding with its numbers, and the main caveat when the design is weak), and keep `study` to facts stated in the post.
- Theme pages show a "What the Research Says" synthesis from the theme's `research_summary` (markdown); update it when a paper is added to the theme.
- Post template headings: Background Information, What They Did, `One Big Result: <the finding>`, Miscellaneous Interesting Takeaways. The One Big Result heading should state the result.
- `/llms.txt` and `/llms-full.txt` are generated from the collections at build time; don't hand-edit them.
- Structured data uses one author entity (`authorSchema()`, `@id` /about/#author) with `sameAs` links from `site.authorProfiles`; posts list the glossary terms they cover as `mentions`, and the glossary is a `DefinedTermSet` tied to Wikipedia.

## Share Cards and Images

- Posts use `og:type` article and their own image (`postImage()`: `schema_image`, else the first figure, else the logo); theme pages use the theme image. `twitterCard()` picks `summary_large_image` only for landscape images at least 600×315 — most figures are smaller and get the compact card.
- Keep images light: theme images are 800×800 WebP (q80), the header JPEG is progressive q78, the logo is 400×400.

## Known Improvement Opportunities

- Generated 1200×630 share images per post (most figures are too small for large cards).
