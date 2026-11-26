// /sitemap.xml in the same single-file format jekyll-sitemap produced (robots.txt
// and Search Console point at this URL, so it must not become a sitemap index).
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../site';
import { getPosts, getThemes, postUrl, themeUrl, xmlSchemaDate } from '../lib/content';
import { loadDefinitions, termPath } from '../lib/glossary';

// Static pages are discovered from src/pages so new pages are included automatically.
// Dynamic routes ([param]), endpoints (*.ts) and the 404 page are excluded.
const pageFiles = Object.keys(import.meta.glob('/src/pages/**/*.{astro,md}'));
const staticPaths = pageFiles
  .filter((file) => !file.includes('[') && !/\/404\.(astro|md)$/.test(file))
  .map((file) =>
    file
      .replace(/^\/src\/pages/, '')
      .replace(/(index)?\.(astro|md)$/, '')
      .replace(/([^/])$/, '$1/'),
  );

type Entry = { path: string; lastmod?: Date };

export const GET: APIRoute = async () => {
  const posts = [...(await getPosts())].reverse();
  const themes = await getThemes();

  const postEntries: Entry[] = posts.map((post) => ({
    path: postUrl(post),
    lastmod: post.data.last_modified_at ?? post.data.date,
  }));
  const pageEntries: Entry[] = [...staticPaths, ...themes.map(themeUrl), ...loadDefinitions().map(termPath)]
    .sort((a, b) => a.localeCompare(b))
    .map((path) => ({ path }));

  const urls = [...postEntries, ...pageEntries]
    .map(
      ({ path, lastmod }) =>
        `<url>\n<loc>${absoluteUrl(path)}</loc>\n${lastmod ? `<lastmod>${xmlSchemaDate(lastmod)}</lastmod>\n` : ''}</url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
