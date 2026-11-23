import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Front matter keys may be present but empty (e.g. `doi:`), as Jekyll allowed.
const optionalString = z.string().nullish().transform((v) => v || undefined);
// Search results show ~155 characters; longer descriptions get cut off.
const metaDescription = z
  .string()
  .max(160, 'meta_description should be at most ~155 characters (it is cut off in search results)')
  .nullish()
  .transform((v) => v || undefined);
const optionalDate = z.coerce.date().nullish().transform((v) => v ?? undefined);

// Paper summaries. Files keep Jekyll's YYYY-MM-DD-slug.md naming; the URL is
// /slug/. Files starting with "_" (e.g. _template_post.md) are ignored.
const posts = defineCollection({
  loader: glob({
    pattern: '[^_]*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
  }),
  schema: z.object({
    title: z.string(),
    /** Concise title for search results (<= 60 chars); defaults to title. */
    seo_title: optionalString,
    date: z.coerce.date(),
    /** Date of the last substantive revision; used for dateModified and sitemap lastmod. */
    last_modified_at: optionalDate,
    /** One theme key or a list of them (see src/content/themes/). */
    theme: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((t) => (t == null ? [] : Array.isArray(t) ? t : [t])),
    doi: optionalString,
    meta_description: metaDescription,
    snippet: optionalString,
    /** Markdown citation shown at the end of the post. */
    citation: optionalString,
    /** Overrides the Article structured-data image (defaults to the first figure). */
    schema_image: optionalString,
  }),
});

// Research themes, served at /themes/<theme_key>/.
const themes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/themes' }),
  schema: z.object({
    title: z.string(),
    theme_key: z.string(),
    image_format: optionalString,
    meta_description: metaDescription,
    theme_description: z.string(),
  }),
});

export const collections = { posts, themes };
