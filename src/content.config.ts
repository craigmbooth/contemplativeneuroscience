import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SITE } from './lib/active-site.js';

// Front matter keys may be present but empty (e.g. `doi:`), as Jekyll allowed.
const optionalString = z.string().nullish().transform((v) => v || undefined);
// Search results show ~155 characters; longer descriptions get cut off.
const metaDescription = z
  .string()
  .max(160, 'meta_description should be at most ~155 characters (it is cut off in search results)')
  .nullish()
  .transform((v) => v || undefined);
const optionalDate = z.coerce.date().nullish().transform((v) => v ?? undefined);

/** Short study-type labels shown on post listings (a fixed set, so listings stay consistent). */
export const STUDY_TYPES = [
  'Randomized trial',
  'Controlled study',
  'Meta-analysis',
  'Comparison study',
  'Observational study',
  'Survey',
  'Interview study',
  'Case study',
  'Experiment',
  'Review',
] as const;

// Paper summaries. Files keep Jekyll's YYYY-MM-DD-slug.md naming; the URL is
// /slug/. Files starting with "_" (e.g. _template_post.md) are ignored.
const posts = defineCollection({
  loader: glob({
    pattern: '[^_]*.md',
    base: `./sites/${SITE}/posts`,
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
  }),
  schema: z.object({
    /** Plain-language headline stating the finding (shown on the page and in lists). */
    title: z.string(),
    /** The paper's own title, when the headline differs (structured data, search). */
    paper_title: optionalString,
    /** Concise title for search results (<= 60 chars); defaults to title. */
    seo_title: optionalString,
    date: z.coerce.date(),
    /** Date of the last substantive revision; used for dateModified and sitemap lastmod. */
    last_modified_at: optionalDate,
    /** One theme key or a list of them (see sites/<name>/themes/). */
    theme: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((t) => (t == null ? [] : Array.isArray(t) ? t : [t])),
    doi: optionalString,
    /** The summarized paper, field by field (structured data). Must agree with `citation`. */
    paper: z.object({
      /** APA style, "Surname, I. I.", every author in order. */
      authors: z.array(z.string().regex(/^[^,]+, [^,]+$/, 'write each author as "Surname, I. I."')).min(1),
      journal: z.string(),
      year: z.number().int(),
      volume: z.coerce.string().optional(),
      issue: z.coerce.string().optional(),
      /** Page range ("5–16") or article number ("e0176239"). */
      pages: z.coerce.string().optional(),
    }),
    meta_description: metaDescription,
    snippet: optionalString,
    /** Markdown citation shown at the end of the post. */
    citation: optionalString,
    /** Overrides the Article structured-data image (defaults to the first figure). */
    schema_image: optionalString,
    /** "Study at a glance" box shown under "In brief". */
    study: z
      .object({
        /** Short label for listings, e.g. "Randomized trial" (see STUDY_TYPES). */
        type: z.enum(STUDY_TYPES),
        design: z.string(),
        participants: z.string(),
        method: z.string().optional(),
        measures: z.string().optional(),
        /** Shown as "Keep in mind": what the design can and can't show. */
        limitations: z.string(),
      })
      .optional(),
  }).superRefine(checkPaperMatchesCitation),
});

/** Catch `paper` drifting from the human-readable citation (two copies of the same facts). */
function checkPaperMatchesCitation(
  data: { citation?: string; paper: { authors: string[]; journal: string; year: number; volume?: string; issue?: string; pages?: string } },
  ctx: z.RefinementCtx,
) {
  if (!data.citation) return;
  const cite = data.citation.replace(/&amp;/g, '&').toLowerCase();
  const { authors, journal, year, volume, pages } = data.paper;
  const expected = [...authors.map((a) => a.split(',')[0]), `(${year})`, journal, volume, pages];
  const missing = expected.filter((s): s is string => !!s && !cite.includes(s.toLowerCase()));
  if (missing.length > 0) {
    ctx.addIssue({ code: 'custom', path: ['paper'], message: `paper doesn't match citation; citation lacks: ${missing.join(', ')}` });
  }
}

// Research themes, served at /themes/<theme_key>/.
const themes = defineCollection({
  loader: glob({ pattern: '*.md', base: `./sites/${SITE}/themes` }),
  schema: z.object({
    title: z.string(),
    theme_key: z.string(),
    /** Short name for listings and labels, e.g. "Sleep". */
    short_title: z.string(),
    /** The theme as a reader's question, shown on the home page. */
    question: z.string(),
    image_format: optionalString,
    meta_description: metaDescription,
    theme_description: z.string(),
    /** Markdown "What the Research Says" synthesis, linking the theme's papers. */
    research_summary: optionalString,
  }),
});

export const collections = { posts, themes };
