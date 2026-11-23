// RSS feed of the 10 most recent paper summaries (full rendered content).
import type { APIRoute } from 'astro';
import { site, absoluteUrl } from '../site';
import { getPosts, postHtml, postUrl } from '../lib/content';

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** RFC 822 date, e.g. "Fri, 08 Mar 2024 00:00:00 +0000". */
const rfc822 = (date: Date) => date.toUTCString().replace('GMT', '+0000');

export const GET: APIRoute = async () => {
  const now = rfc822(new Date());
  const posts = (await getPosts()).slice(0, 10);
  const items = posts
    .map((post) => {
      const url = absoluteUrl(postUrl(post));
      return `
      <item>
        <title>${xmlEscape(post.data.title)}</title>
        <description>${xmlEscape(postHtml(post))}</description>
        <pubDate>${rfc822(post.data.date)}</pubDate>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(site.title)}</title>
    <description>${xmlEscape(site.description)}</description>
    <link>${site.url}/</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <pubDate>${now}</pubDate>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Astro</generator>${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
