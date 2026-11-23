// Compiles the Sass entry points in src/styles/ to /css/<name>.css, keeping the
// stylesheet URLs the site has always used.
import type { APIRoute, GetStaticPaths } from 'astro';
import { resolve } from 'node:path';
import * as sass from 'sass';

const STYLES_DIR = resolve(process.cwd(), 'src/styles');
const ENTRY_POINTS = ['main', 'tooltip', 'pages', 'components'];

export const getStaticPaths: GetStaticPaths = () => ENTRY_POINTS.map((name) => ({ params: { name } }));

export const GET: APIRoute = ({ params }) => {
  const { css } = sass.compile(resolve(STYLES_DIR, `${params.name}.sass`), {
    style: 'compressed',
    loadPaths: [STYLES_DIR],
    // The vendored Bourbon library and the @import-based structure predate the
    // Sass module system. They still compile; silence the noise until migrated.
    silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'if-function', 'elseif'],
  });
  return new Response(css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
