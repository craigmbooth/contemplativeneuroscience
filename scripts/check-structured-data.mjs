#!/usr/bin/env node
// Checks the JSON-LD structured data in the built site (dist/) and exits non-zero
// if anything required is missing or malformed, so a deploy can't go out without it.
// Runs as part of `npm run build` (see package.json), which the deploy workflow uses.
//
// Every post must have:
//   - an Article (headline, description, image, dates, author, publisher,
//     mainEntityOfPage = the post's URL) that isBasedOn a ScholarlyArticle whose
//     @id is the paper's DOI URL, with a name, authors and a publication date;
//   - a BreadcrumbList starting at Home and ending at the post.
// Every theme page must have a CollectionPage listing all of the theme's posts,
// and a BreadcrumbList ending at the theme.
// Every indexable page must have at least one JSON-LD block, and every block must
// parse and carry @context https://schema.org and an @type.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const origin = `https://${readFileSync('public/CNAME', 'utf8').trim()}`;
const errors = [];
const checked = new Set(); // pages already checked in full
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

const frontMatter = (file) => readFileSync(file, 'utf8').split(/^---$/m)[1] ?? '';
const field = (fm, name) => fm.match(new RegExp(`^${name}:\\s*"?([^"\\n]*?)"?\\s*$`, 'm'))?.[1];
const themesOf = (fm) => {
  const raw = field(fm, 'theme') ?? '';
  return raw.replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean);
};

function jsonLd(page, html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const items = [];
  for (const [, text] of blocks) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      fail(page, `JSON-LD block doesn't parse (${e.message})`);
      continue;
    }
    for (const item of Array.isArray(data) ? data : data['@graph'] ?? [data]) {
      if (!item['@type']) fail(page, 'JSON-LD item without @type');
      if ((item['@context'] ?? data['@context']) !== 'https://schema.org') {
        fail(page, `JSON-LD ${item['@type']} without @context https://schema.org`);
      }
      items.push(item);
    }
  }
  return items;
}

const ofType = (items, type) => items.filter((i) => [i['@type']].flat().includes(type));
const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : v != null);

function checkBreadcrumbs(page, items, url) {
  const lists = ofType(items, 'BreadcrumbList');
  if (lists.length !== 1) return fail(page, `expected 1 BreadcrumbList, found ${lists.length}`);
  const els = lists[0].itemListElement ?? [];
  if (els.length < 2) return fail(page, 'BreadcrumbList has fewer than 2 items');
  els.forEach((el, i) => {
    if (el.position !== i + 1) fail(page, `BreadcrumbList item ${i + 1} has position ${el.position}`);
    if (!nonEmpty(el.name) || !nonEmpty(el.item)) fail(page, `BreadcrumbList item ${i + 1} lacks name or item`);
  });
  if (els[0].item !== `${origin}/`) fail(page, 'BreadcrumbList does not start at Home');
  if (els.at(-1).item !== url) fail(page, `BreadcrumbList ends at ${els.at(-1).item}, not ${url}`);
}

function checkCanonical(page, html, url) {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== url) fail(page, `canonical is ${canonical}, expected ${url}`);
}

const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

// Posts
const postsDir = 'src/content/posts';
const posts = readdirSync(postsDir)
  .filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f))
  .map((f) => ({ file: f, slug: f.slice(11, -3), fm: frontMatter(join(postsDir, f)) }));

for (const { file, slug, fm } of posts) {
  const page = `/${slug}/`;
  checked.add(page);
  const url = `${origin}${page}`;
  const html = read(join(DIST, slug, 'index.html'));
  if (!html) {
    fail(page, `not built (from ${file})`);
    continue;
  }
  checkCanonical(page, html, url);
  const items = jsonLd(page, html);

  const articles = ofType(items, 'Article');
  if (articles.length !== 1) {
    fail(page, `expected 1 Article, found ${articles.length}`);
  } else {
    const a = articles[0];
    for (const key of ['headline', 'description', 'image', 'datePublished', 'dateModified']) {
      if (!nonEmpty(a[key])) fail(page, `Article lacks ${key}`);
    }
    const date = field(fm, 'date');
    if (date && !String(a.datePublished).startsWith(date)) {
      fail(page, `Article datePublished ${a.datePublished} doesn't match front matter date ${date}`);
    }
    if (!nonEmpty(a.author?.name)) fail(page, 'Article lacks author.name');
    if (!nonEmpty(a.publisher?.name) || !nonEmpty(a.publisher?.logo?.url)) fail(page, 'Article lacks publisher name or logo');
    if (a.mainEntityOfPage?.['@id'] !== url) fail(page, `Article mainEntityOfPage is ${a.mainEntityOfPage?.['@id']}, expected ${url}`);

    const paper = a.isBasedOn;
    const doi = field(fm, 'doi');
    if (!paper || paper['@type'] !== 'ScholarlyArticle') {
      fail(page, 'Article is not isBasedOn a ScholarlyArticle');
    } else {
      if (doi && String(paper['@id']).toLowerCase() !== `https://doi.org/${doi}`.toLowerCase()) {
        fail(page, `ScholarlyArticle @id is ${paper['@id']}, expected https://doi.org/${doi}`);
      }
      if (!nonEmpty(paper.name)) fail(page, 'ScholarlyArticle lacks name');
      if (!nonEmpty(paper.author)) fail(page, 'ScholarlyArticle lacks authors');
      if (!nonEmpty(paper.datePublished)) fail(page, 'ScholarlyArticle lacks datePublished');
    }
  }
  checkBreadcrumbs(page, items, url);
}

// Theme pages
const themesDir = 'src/content/themes';
for (const f of readdirSync(themesDir).filter((f) => f.endsWith('.md'))) {
  const key = field(frontMatter(join(themesDir, f)), 'theme_key');
  const page = `/themes/${key}/`;
  checked.add(page);
  const url = `${origin}${page}`;
  const html = read(join(DIST, 'themes', key, 'index.html'));
  if (!html) {
    fail(page, `not built (from ${f})`);
    continue;
  }
  checkCanonical(page, html, url);
  const items = jsonLd(page, html);
  const pages = ofType(items, 'CollectionPage');
  if (pages.length !== 1) {
    fail(page, `expected 1 CollectionPage, found ${pages.length}`);
  } else {
    const listed = pages[0].mainEntity?.itemListElement ?? [];
    const expected = posts.filter((p) => themesOf(p.fm).includes(key)).length;
    if (listed.length !== expected) fail(page, `CollectionPage lists ${listed.length} papers, theme has ${expected}`);
  }
  checkBreadcrumbs(page, items, url);
}

// Every indexable page has some valid structured data
function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith('.html')) yield path;
  }
}
for (const path of htmlFiles(DIST)) {
  const html = readFileSync(path, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const page = `/${path.slice(DIST.length + 1).replace(/index\.html$/, '')}`;
  if (checked.has(page)) continue;
  if (jsonLd(page, html).length === 0) fail(page, 'no JSON-LD structured data');
}

if (errors.length) {
  console.error(`Structured data check failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`Structured data OK: ${posts.length} posts, all theme pages and every indexable page.`);
