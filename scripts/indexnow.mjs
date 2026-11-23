#!/usr/bin/env node
// IndexNow (https://www.indexnow.org): tells Bing and the other participating
// search engines which pages changed in a deploy. Used by .github/workflows/deploy.yml.
//
//   node scripts/indexnow.mjs changed   Compare the built site (dist/) with the live site
//                                       and print the URLs that changed, as JSON.
//                                       INDEXNOW_ALL=true prints every page instead.
//   node scripts/indexnow.mjs submit    Submit the JSON URL list in INDEXNOW_URLS.
//
// The key is public by design: public/<key>.txt lets search engines verify that
// submissions come from the site owner. The host comes from public/CNAME.
// Run `changed` after building and before deploying, so "live" is the old site.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const host = readFileSync('public/CNAME', 'utf8').trim();
const origin = `https://${host}`;
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (public/<32 hex chars>.txt) found.');
const key = keyFile.slice(0, -4);
if (readFileSync(join('public', keyFile), 'utf8').trim() !== key) {
  throw new Error(`public/${keyFile} must contain its own name (the key).`);
}

const sitemapUrls = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

async function fetchLive(url) {
  // A unique query string skips the CDN cache, so this sees what is deployed now.
  const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}indexnow=${Date.now()}`, {
    redirect: 'manual',
    headers: { 'User-Agent': 'contemplativeneuroscience-indexnow' },
  });
  return { status: res.status, body: Buffer.from(await res.arrayBuffer()) };
}

async function changed() {
  const built = sitemapUrls(readFileSync('dist/sitemap.xml', 'utf8'));
  if (process.env.INDEXNOW_ALL === 'true') return built;

  const urls = [];
  for (const url of built) {
    const path = new URL(url).pathname;
    const local = readFileSync(join('dist', path.endsWith('/') ? `${path}index.html` : path));
    try {
      const live = await fetchLive(url);
      if (live.status !== 200 || !live.body.equals(local)) urls.push(url); // new or changed
    } catch {
      urls.push(url); // can't tell, so submit it
    }
  }
  // Pages that were live but are no longer built: IndexNow is also told about removals.
  try {
    const live = await fetchLive(`${origin}/sitemap.xml`);
    if (live.status === 200) {
      const current = new Set(built);
      urls.push(...sitemapUrls(live.body.toString('utf8')).filter((u) => !current.has(u)));
    }
  } catch {
    // No live sitemap to compare with; nothing more to add.
  }
  return urls;
}

async function submit() {
  const urls = JSON.parse(process.env.INDEXNOW_URLS || '[]');
  if (urls.length === 0) {
    console.log('IndexNow: no changed pages to submit.');
    return;
  }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `${origin}/${keyFile}`, urlList: urls }),
  });
  // 200: accepted. 202: accepted, key verification pending (normal on first use).
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow rejected the submission: HTTP ${res.status} ${await res.text()}`);
  }
  console.log(`IndexNow: submitted ${urls.length} URL(s) (HTTP ${res.status}):\n${urls.join('\n')}`);
}

const command = process.argv[2];
if (command === 'changed') console.log(JSON.stringify(await changed()));
else if (command === 'submit') await submit();
else {
  console.error('Usage: node scripts/indexnow.mjs changed|submit');
  process.exit(2);
}
