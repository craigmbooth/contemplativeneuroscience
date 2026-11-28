# CLAUDE.md - AI Assistant Context

This document contains important context for AI assistants working on this website.

## Project Overview

An [Astro](https://astro.build) static site (migrated from Jekyll in November 2026) that collects accessible summaries of peer-reviewed research at the intersection of meditation and brain science. It is deployed to GitHub Pages at https://contemplativeneuroscience.com.

The code can serve more than one site. Everything specific to a site lives in its own folder, `sites/<name>/`: its settings (`site.ts`: title, URL, author, brand colours, wording, analytics and MailerLite ids), posts, themes, glossary, About page and `public/` files. All the code in `src/` is shared. A build picks a site with the `SITE` environment variable, which defaults to `contemplative` (`src/lib/active-site.js`). Anything that names a site's subject belongs in its `site.ts` (`copy`), not in `src/`.

Sites: `contemplative` (live) and `training` (Training Evidence, trainingevidence.com: exercise, strength, endurance and supplements; a skeleton with draft themes and placeholder art, not deployed yet). CI builds every site on each push, so a change to shared code must keep both building. A site without `analyticsId` or `newsletter.mailerlite` simply leaves those out; empty `startHere` hides Start Here.

## Commands

Requires Node >= 22.23.4 (see `.nvmrc` / `package.json` engines).

```bash
npm install
npm run dev      # dev server (Astro 7 runs it in the background; stop with `npx astro dev stop`)
npm run build    # static build into dist/, then checks its structured data (fails on gaps)
npm run preview  # serve dist/
npm run check    # type-check .astro/.ts files
SITE=<name> npm run build   # any command, for another site under sites/
```

To add a site: copy `sites/contemplative/` to `sites/<name>/`, edit its `site.ts` and content, and register it in `src/site.ts`.

Always run `npm run check` and `npm run build` before committing.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `master` (GitHub Pages source: "GitHub Actions"). Nothing generated is committed: CSS and minified JS are produced by the build.

After each deploy, the workflow submits the pages whose HTML changed (plus any removed pages) to IndexNow (`scripts/indexnow.mjs`), which notifies Bing and other participating search engines. It finds them by comparing the new build with the live site before deploying. The key file `sites/contemplative/public/92733d5f979cf4080a9a770b5046e59f.txt` must stay published (the key is public by design). To resubmit every page, run the workflow manually with "Submit every page" ticked.

## Layout

```
sites/<name>/          One folder per site (see Project Overview)
  site.ts             Settings: title, URL, author, startHere, themeGroups, colors, copy, analytics, MailerLite
  posts/              Paper summaries: YYYY-MM-DD-slug.md -> /slug/ (files starting with _ are ignored)
  themes/             Research themes -> /themes/<theme_key>/
  definitions.yaml    Glossary terms (tooltips, /glossary/ index and a page per term)
  pages/about.md      The About page (served by src/pages/about.astro)
  public/             Copied verbatim: images, favicons, CNAME, robots.txt, IndexNow key
src/
  site.ts             The active site's settings (register each site here); site-config.ts is their type
  lib/active-site.js  SITE env var -> sites/<name>/ paths (used by the config, build and scripts/)
  content.config.ts   Front-matter schemas for posts and themes
  layouts/            BaseLayout (document shell), DefaultLayout, PageLayout, PostLayout, ThemeLayout
  components/         Head, Header, Footer, Breadcrumbs, PaperMeta, Subscribe (email sign-up box)
  lib/content.ts      Collection helpers (sorting, URLs, theme lookups, markdownify)
  lib/seo.ts          <title> logic, meta descriptions, JSON-LD (Article, BreadcrumbList, Person)
  lib/remark-glossary-terms.js  Renders :term{...} directives as glossary tooltips
  lib/rehype-image-dimensions.js  Adds width/height (+ lazy loading) to markdown images
  lib/rehype-figures.js  Wraps images with alt text in <figure> with the alt as <figcaption>
  lib/images.js       publicImageSize(): pixel size of a file in the site's public/
  pages/              Routes; [slug].astro = posts, themes/[theme].astro = themes, glossary/[term].astro = glossary terms
  pages/css/[name].css.ts       Compiles src/styles/<name>.sass -> /css/<name>.css; serves styles/static/ (normalize, print) as is
  pages/assets/js/[name].js.ts  Serves src/scripts/<name>.js -> /assets/js/<name>.js and <name>.min.js
  pages/feed.xml.ts, sitemap.xml.ts
  styles/             Sass (indented syntax), incl. vendored Bourbon
  scripts/            Browser JS (plain scripts, not modules)
  pages/llms.txt.ts, llms-full.txt.ts  AI-facing index and full text of every summary (lib/llms.ts)
```

## Writing Posts

**Read `STYLE.md` before writing or editing a summary or a theme's research summary.** It is the style guide for both sites: voice, what goes in each section and in the front matter, numbers and statistics, causal language and caveats, conflicts of interest, quotes, figure captions, glossary use, and checking against the full text. This section covers the mechanics.

Copy `sites/contemplative/posts/_template_post.md`. Glossary tooltips use markdown directives:

```md
:term{id="eeg"}                          EEG
:term{id="mindfulness" case="lower"}     mindfulness
:term{id="eeg" plural}                   EEGs
:term[inflammatory]{id="inflammation"}   custom link text
```

An unknown term id fails the build, and so does an unknown theme key or an image path that is not in the site's `public/`. An image alone in its paragraph becomes a figure whose caption is its alt text (built into the HTML); on posts, `scripts/figures.js` adds "Enlarge figure" to figures shown smaller than their real size, opening a full-screen viewer. Link to other posts by URL, e.g. `[Lutz et al. 2004](/high-amplitude-gamma-synchrony/)`.

Front matter: `title` (a plain-language headline stating the finding, not the paper's title), `paper_title` (the paper's own title; used in structured data and All Papers search), `date`, `theme` (one key or a list), `doi`, `paper` (the paper field by field: `authors` as APA "Surname, I. I." strings, `journal`, `year`, optional `volume`, `issue`, `pages`; the build fails if these don't all appear in `citation`), `meta_description` (≤ 155 chars; over 160 fails the build), `snippet`, `citation` (markdown), optional `seo_title` (≤ 60 chars; used for `<title>` when the title is long), `last_modified_at` (drives `dateModified` and sitemap `lastmod`), `schema_image`.

`study.type` is a short listing label from the fixed `STUDY_TYPES` list in `src/content.config.ts` (e.g. "Randomized trial", "Meta-analysis", "Survey"); anything else fails the build. Themes need a `short_title` (listing label, e.g. "Sleep") and a `question` (the theme as a reader's question, shown on the home page).

Front matter is parsed by a strict YAML parser: continuation lines of a multi-line quoted string must be indented.

## Glossary

- `/glossary/` is an A–Z index (first sentence of each definition, paper count); every term also has its own page at `/glossary/<slug>/` with the full definition, the summaries that use it (posts whose markdown has a `:term{id="..."}` for it) and related terms (those used in the same papers). Tooltips link to the term's page.
- The slug comes from the term's heading: its optional `name` (full name, e.g. `name: "Default Mode Network (DMN)"`), else its `title`, without any parenthetical (`/glossary/default-mode-network/`). Give a term a `name` when its `title` is an abbreviation or too terse to head a page. Two terms with the same slug fail the build. Changing a `name` or `title` changes the term's URL, so avoid renaming published terms.
- Index entries keep the term id as their anchor, so old `/glossary/#term` links still land on the right entry.

## URL Stability

Every URL from the Jekyll site is preserved (pages, `/css/*.css`, `/assets/js/*.js` and `*.min.js`, `/feed.xml`, `/sitemap.xml`, all images). Keep it that way:
- `trailingSlash: 'always'` + `build.format: 'directory'` give `/slug/` URLs like Jekyll's `/:title/`.
- The sitemap is a single `/sitemap.xml` (robots.txt and Search Console point at it); do not swap in `@astrojs/sitemap`, which emits a sitemap index at a different URL.

## Styles

- Sass indented syntax (`.sass`), entry points `main`, `tooltip`, `pages`, `components` in `src/styles/`; partials in `src/styles/{components,pages,mixins}`.
- Semantic variables live in `src/styles/_variables.sass` — check there before adding colors or dimensions. Brand colours (pinks, tooltip, slim bar) come from `colors` in the site's `site.ts`, which the stylesheet build turns into `$color-<key>` (the `skin` import); the share cards use them too. Everything else in the styles is shared.
- Text must meet WCAG AA contrast (4.5:1). Use `$color-primary-text` (not `$color-primary`) for pink text and `$color-text-muted` (#767676) as the lightest grey for text; `$color-primary` is for borders and backgrounds.
- Dart Sass deprecation warnings (`@import`, Bourbon's old syntax) are silenced in `pages/css/[name].css.ts`; Dart Sass 3 will require migrating to `@use` and dropping Bourbon.
- Fonts: Google Fonts loads only Jost 400–700 (with italics) and Merriweather 400/700 (`Head.astro`). Using another weight or Merriweather italic means adding it to that URL, or the browser fakes it.
- Font fallbacks: `styles/_fonts.sass` defines size-matched stand-ins ("Jost Fallback", "Merriweather Fallback" and Android versions over Arial, Times New Roman, Roboto and Noto Serif) that sit second in the font stacks, so text doesn't reflow when the web fonts arrive. Re-measure them if the fonts change (the file says how).
- No icon font: icons are small inline SVGs (footer RSS).
- Breakpoints: 768px, 800px, 1024px; the slim bar's menu collapses into the hamburger below 960px (`$breakpoint-menu`).

## Gotchas

- Astro's HTML compression removes whitespace between elements. Where inline elements need a gap (nav links, "Themes:" label), emit `{' '}` explicitly.
- Image width/height come from the file at render time and are cached with the rendered markdown (`.astro/data-store.json` for dev, `node_modules/.astro/<site>/data-store.json` for builds). If you replace an image without editing its post, delete both files (and restart `npm run dev`) to pick up the new size. CI builds start clean.
- Smart typography matches kramdown: `--` → en dash, `---` → em dash (`SMARTYPANTS_OPTIONS`).
- Header: the home page keeps the full starfield banner; every other page gets the slim `.site-bar` (`Header.astro`, `styles/components/_site-bar.sass`) so content starts near the top. Both share the `.menu-toggle` / `.custom-links` hooks used by `scripts/bundle.js`.
- Social cards (og:title) use the headline (`title`); the browser/search `<title>` uses `seo_title` when set.
- Breadcrumbs: the visible trail is chosen client-side from `document.referrer` (`src/scripts/breadcrumbs.js`); the only structured breadcrumb data is the JSON-LD BreadcrumbList.
- Use state classes (`.visible`, `.expanded`, `.active`) rather than inline style manipulation in JS; dynamic backgrounds use `data-bg-image` attributes.
- `Subscribe.astro` is our own markup and styles (`components/_subscribe.sass`) around MailerLite's submit script, which finds the form by its ids and classes (listed in the component). Keep those hooks, and use the component at most once per page (fixed ids).

## Internal Links

- Posts and pages use the narrower reading column (`.content.reading`, `$content-reading-width`); the home page keeps the full width.
- Listings show a `PaperMeta` line (date, study type, theme links).
- All Papers (`pages/all-papers.astro`, `scripts/all-papers.js`) lists newest summaries first. Search matches every word typed across the headline, snippet, citation, themes and the glossary terms the summary links to (including the term's Wikipedia name, so "default mode network" finds DMN), highlights matches, and names a matched term that isn't visible ("Covers: DMN"). Sort and study type are selects; all three controls are mirrored in the URL (`?q=`, `?type=`, `?sort=`).
- Theme groups (`site.themeGroups`, resolved by `themeGroups()` in `lib/content.ts`): every theme sits in exactly one group, in reading order; a missing, unknown or repeated key fails the build. A group is either a heading (`title`, as on Contemplative Neuroscience: The Brain, Mind and Emotion, ...) or a parent theme (`parent`, as on Training Evidence: Strength, Cardio, Supplements). A parent is an ordinary theme file whose page lists its sub-themes ("Topics in this Theme") and every paper in them (`postsForTheme()` includes sub-themes' papers); sub-themes' breadcrumbs pass through the parent. Posts are tagged with the narrowest theme that fits. Theme URLs stay `/themes/<theme_key>/` for parents and sub-themes alike. Keep groups to five themes or fewer: the home page shows five across.
- Research Themes (`pages/themes/index.astro`) shows each theme as its question, with its short answer (the bold opening sentence of `research_summary`, via `themeShortAnswer()`; keep it there) and its papers.
- The home page has a hand-picked "Start Here" set (`site.startHere` in `sites/<name>/site.ts`; an unknown slug fails the build), the themes as questions under their group headings (`site.themeGroups`, shared with Research Themes and the 404 page; thumbnails in `sites/<name>/public/assets/images/themes/thumbs/`, 240px WebP), and the 5 newest papers with date, study type and theme; every post ends with up to 4 Related Papers (`relatedPosts()`: papers sharing a theme, nearest in date first, so links spread across the archive) plus links to its theme pages.
- The 404 page (`pages/404.astro`, noindex) offers a search that opens All Papers with `?q=`, which All Papers applies on load, plus the Start Here papers and the theme questions (`site.themeGroups`, shared with the home page).
- `<title>` gets the " | Contemplative Neuroscience" suffix only when the result is ≤ 60 characters.

## Email Sign-up

- The promise beside every sign-up form is `site.newsletter.promise` (one or two summaries every couple of weeks); change it there if the cadence changes.
- Forms appear at the end of every post (after the citation), on the home page, on About (`subscribe: true` front matter, via PageLayout) and on `/subscribe/`, which the menu's Subscribe button and the footer link to.

## AI Search (GEO)

- Each post opens with a byline (author, published/updated dates), an "In brief" box showing its `snippet`, and a "Study at a glance" box from the `study` front matter (design, participants, method, measures, limitations). Keep snippets self-contained (60–75 words: the question, what the researchers did, the finding with its numbers, and the main caveat when the design is weak), and keep `study` to facts stated in the post.
- Theme pages show a "What the Research Says" synthesis from the theme's `research_summary` (markdown); update it when a paper is added to the theme.
- Post template headings: Background Information, What They Did, `One Big Result: <the finding>`, Miscellaneous Interesting Takeaways, Final Reflection. The One Big Result heading should state the result (see `STYLE.md`).
- `/llms.txt` and `/llms-full.txt` are generated from the collections at build time; don't hand-edit them.
- Each post's Article says it `isBasedOn` the paper: a ScholarlyArticle identified by its DOI URL, with authors, journal, volume, issue and pages from the `paper` front matter (`paperSchema()`).
- Theme pages, All Papers and Research Themes are `CollectionPage`s whose `mainEntity` is an `ItemList` of the pages they list; a theme's `abstract` is its "What the Research Says" text. The home page's WebSite has a `SearchAction` pointing at `/all-papers/?q=`.
- Structured data is JSON-LD only (no microdata). Check changes with https://validator.schema.org/ and Google's Rich Results Test.
- `npm run build` ends with `scripts/check-structured-data.mjs`, which fails the build (and so the deploy) unless every post has an Article that `isBasedOn` a ScholarlyArticle with the paper's DOI and a BreadcrumbList ending at the post, every theme page has a CollectionPage listing all its papers, and every indexable page has valid JSON-LD. Extend it when adding new page types or required fields.
- Structured data uses one author entity (`authorSchema()`, `@id` /about/#author) with `sameAs` links from `site.authorProfiles`; posts list the glossary terms they cover as `mentions`, the glossary index is a `DefinedTermSet`, and each term page is a `DefinedTerm` (`@id` = its page) tied to Wikipedia.

## Share Cards and Images

- **Read `IMAGES.md` before writing a Midjourney (or other image-generator) prompt, or adding artwork.** It describes each site's visual style (Contemplative Neuroscience's textured oil paintings; Training Evidence's mid-century modern prints), the sizes and crops the art must survive, and a prompt recipe with examples.
- Every post and theme page shares a generated 1200×630 card (`lib/share-card.ts`): the theme painting on the left (a post's first theme), then the study type and theme, the headline (a theme's `question`) and the site name. Satori lays it out with the Jost and Merriweather files from `@fontsource`, and sharp writes a progressive JPEG. The build serves them at `/assets/cards/<slug>.jpg` and `/assets/cards/themes/<theme_key>.jpg` (`pages/assets/cards/`), so they're never committed and update whenever a headline changes. The headline size steps down with length (`headlineSize()`); check the card of any headline over ~165 characters.
- Posts use `og:type` article. A post's Article JSON-LD lists its card first, then its own image (`postImage()`: `schema_image`, else the first figure; never the logo). `twitterCard()` picks `summary_large_image` for landscape images at least 600×315, so the cards get large cards; pages without a card (home, About, glossary) share the logo as a compact card.
- Keep images light: theme images are 800×800 WebP (q80), the header JPEG is progressive q78, the logo is 400×400.
