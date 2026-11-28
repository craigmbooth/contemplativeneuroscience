// Which site this build is for, and where its files live. Every site shares the
// code in src/; its own content, glossary, public files and settings live in
// sites/<name>/. Pick one with the SITE environment variable, e.g.
// `SITE=contemplative npm run build`; it defaults to contemplative.
// Plain JS + fs so the Astro config, the build and the scripts/ can all use it.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const SITE = process.env.SITE || 'contemplative';

/** Absolute path of the active site's folder (sites/<name>/). */
export const SITE_DIR = resolve(process.cwd(), 'sites', SITE);
if (!existsSync(SITE_DIR)) throw new Error(`SITE="${SITE}", but there is no sites/${SITE}/ folder.`);

/** A path inside the active site's folder, e.g. sitePath('public') or sitePath('posts'). */
export const sitePath = (/** @type {string[]} */ ...parts) => resolve(SITE_DIR, ...parts);

/** The site's public/ folder: copied verbatim into the build. */
export const PUBLIC_DIR = sitePath('public');
