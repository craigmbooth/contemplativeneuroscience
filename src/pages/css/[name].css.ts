// Compiles the Sass entry points in src/styles/ to /css/<name>.css, keeping the
// stylesheet URLs the site has always used. Plain stylesheets in src/styles/static/
// (normalize, print) are served at /css/<name>.css unchanged.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as sass from 'sass';
import { site } from '../../site';

const STYLES_DIR = resolve(process.cwd(), 'src/styles');
const STATIC_DIR = resolve(STYLES_DIR, 'static');
const ENTRY_POINTS = ['main', 'tooltip', 'pages', 'components'];
const STATIC = ['normalize', 'print'];

/** `@import "skin"`: the active site's brand colours (site.colors) as $color-<key> variables. */
const skin = Object.entries(site.colors)
  .map(([key, value]) => `$color-${key}: ${value}`)
  .join('\n');
const SKIN_URL = new URL('site:skin');
const skinImporter: sass.Importer<'sync'> = {
  canonicalize: (url) => (url === 'skin' ? SKIN_URL : null),
  load: () => ({ contents: skin, syntax: 'indented' }),
};

export const getStaticPaths: GetStaticPaths = () => [...ENTRY_POINTS, ...STATIC].map((name) => ({ params: { name } }));

export const GET: APIRoute = async ({ params }) => {
  const name = params.name!;
  const css = STATIC.includes(name)
    ? await readFile(resolve(STATIC_DIR, `${name}.css`), 'utf8')
    : sass.compile(resolve(STYLES_DIR, `${name}.sass`), {
        style: 'compressed',
        loadPaths: [STYLES_DIR],
        importers: [skinImporter],
        // The vendored Bourbon library and the @import-based structure predate the
        // Sass module system. They still compile; silence the noise until migrated.
        silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'if-function', 'elseif'],
      }).css;
  return new Response(css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
