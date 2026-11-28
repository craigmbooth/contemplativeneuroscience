// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkGlossaryTerms, { SMARTYPANTS_OPTIONS } from './src/lib/remark-glossary-terms.js';
import rehypeImageDimensions from './src/lib/rehype-image-dimensions.js';
import rehypeFigures from './src/lib/rehype-figures.js';
import { SITE, PUBLIC_DIR } from './src/lib/active-site.js';
import { site } from './src/site.ts';

export default defineConfig({
  site: site.url,
  // The active site's own public files (SITE env var; see src/lib/active-site.js).
  publicDir: PUBLIC_DIR,
  // A cache per site, so rendered markdown from one site never turns up in another's build.
  cacheDir: `./node_modules/.astro/${SITE}`,
  // Every page is served as /slug/ (directory index), matching the Jekyll permalinks.
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    // remark/rehype pipeline plus :term{id="..."} glossary tooltips, image
    // width/height, and captioned figures for images with alt text.
    // Typography matches kramdown: -- is an en dash, --- an em dash.
    processor: unified({
      remarkPlugins: [remarkDirective, remarkGlossaryTerms],
      rehypePlugins: [rehypeImageDimensions, rehypeFigures],
      smartypants: SMARTYPANTS_OPTIONS,
    }),
  },
});
