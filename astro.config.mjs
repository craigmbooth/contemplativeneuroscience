// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkGlossaryTerms, { SMARTYPANTS_OPTIONS } from './src/lib/remark-glossary-terms.js';
import rehypeImageDimensions from './src/lib/rehype-image-dimensions.js';
import rehypeFigures from './src/lib/rehype-figures.js';

export default defineConfig({
  site: 'https://contemplativeneuroscience.com',
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
