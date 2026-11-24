// Serves each script in src/scripts/ at /assets/js/<name>.js and a minified
// copy at /assets/js/<name>.min.js (the URLs pages reference). Replaces the old
// manual uglifyjs step: minification now happens on every build.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { transform } from 'esbuild';

const SCRIPTS_DIR = resolve(process.cwd(), 'src/scripts');
const SCRIPTS = ['all-papers', 'breadcrumbs', 'bundle', 'figures', 'glossary'];

export const getStaticPaths: GetStaticPaths = () =>
  SCRIPTS.flatMap((script) => [{ params: { name: script } }, { params: { name: `${script}.min` } }]);

export const GET: APIRoute = async ({ params }) => {
  const name = params.name!;
  const minify = name.endsWith('.min');
  const source = await readFile(resolve(SCRIPTS_DIR, `${name.replace(/\.min$/, '')}.js`), 'utf8');
  // Plain scripts (not modules): keep top-level names such as toggleRelatedArticles
  // global, because markup calls them from inline handlers.
  const code = minify ? (await transform(source, { minify: true, target: 'es2018' })).code : source;
  return new Response(code, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
