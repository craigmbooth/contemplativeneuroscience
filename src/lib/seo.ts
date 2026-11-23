// Page metadata and JSON-LD builders (formerly page-title.html, head.html and
// the *_schema.html includes).
import { site, absoluteUrl } from '../site';
import { definitionsByTerm } from './glossary';
import { postHtml, themesForPost, xmlSchemaDate, type Post, type Theme } from './content';

/** Liquid's `truncate`: at most `length` characters including the ellipsis. */
export const truncate = (s: string, length: number) =>
  s.length > length ? s.slice(0, length - 3) + '...' : s;
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');
const stripNewlines = (s: string) => s.replace(/\r?\n/g, '');

/**
 * <title> text. Uses seo_title when present, otherwise title. The site name is
 * appended only when the result stays within 65 characters, so long titles are
 * never cut mid-word. Long paper titles should set a concise seo_title.
 */
export function pageTitle(title?: string, seoTitle?: string): string {
  const base = seoTitle || title;
  if (!base) return site.title;
  const full = `${base} | ${site.title}`;
  return full.length <= 65 ? full : base;
}

/** Meta description, falling back to the snippet, theme description, then site description. */
export function metaDescription(opts: {
  metaDescription?: string;
  snippet?: string;
  themeDescription?: string;
}): string {
  if (opts.metaDescription) return stripNewlines(stripHtml(opts.metaDescription));
  const fallback = opts.snippet ?? opts.themeDescription;
  if (fallback) return truncate(stripNewlines(stripHtml(fallback)), 200);
  return site.description;
}

/** Serialize JSON-LD safely for inline <script> tags. */
export const jsonLd = (data: unknown) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

export function contactSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.author,
    url: site.url,
    sameAs: ['https://twitter.com/cmb'],
    jobTitle: 'Meditation Practitioner and Scientist',
    description:
      'A meditation practitioner and scientist who curates accessible summaries of peer-reviewed research at the intersection of meditation and brain science.',
    mainEntityOfPage: { '@type': 'WebPage', '@id': site.url },
    publisher: {
      '@type': 'Organization',
      name: site.title,
      url: site.url,
      logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo) },
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'author', availableLanguage: 'en' },
  };
}

type Crumb = { name: string; path: string };

/**
 * One canonical BreadcrumbList per page, mirroring the site hierarchy:
 *   post:  Home > Research Themes > [first theme] > Post  (or Home > All Papers > Post)
 *   theme: Home > Research Themes > Theme
 *   page:  Home > Page
 * The visible trail may differ (it reflects how the visitor arrived); this is
 * the only structured breadcrumb data on the page.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export async function postBreadcrumbs(post: Post, path: string): Promise<Crumb[]> {
  const [primaryTheme] = await themesForPost(post);
  const self = { name: post.data.title, path };
  return primaryTheme
    ? [
        { name: 'Research Themes', path: '/themes/' },
        { name: primaryTheme.data.title, path: `/themes/${primaryTheme.data.theme_key}/` },
        self,
      ]
    : [{ name: 'All Papers', path: '/all-papers/' }, self];
}

/**
 * The image that represents a post (structured data and share cards):
 * schema_image, else the first image in the post body, else the site logo.
 */
export function postImage(post: Post): { src: string; alt?: string } {
  if (post.data.schema_image) return { src: post.data.schema_image };
  const first = post.body?.match(/!\[([^\]]*)\]\(\s*([^)\s]+)/);
  if (first) return { src: first[2], alt: first[1].replace(/\s+/g, ' ').trim() || undefined };
  return { src: site.logo };
}

/**
 * Article structured data for a paper summary.
 * - headline: the title, or seo_title when the title exceeds Google's 110-char limit
 * - image: see postImage()
 * - dateModified: last_modified_at, else the post date
 * - keywords: glossary terms the post links to
 * - articleSection: display names of the post's themes
 */
export async function articleSchema(post: Post, path: string) {
  const { data } = post;
  const html = postHtml(post);

  let headline = data.title;
  if (headline.length > 110) headline = truncate(data.seo_title || data.title, 110);

  const image = absoluteUrl(postImage(post).src);

  const definitions = definitionsByTerm();
  const keywords = [
    ...new Set(
      [...html.matchAll(/href="\/glossary\/#([^"]+)"/g)]
        .map((m) => definitions.get(m[1])?.title)
        .filter((t): t is string => Boolean(t)),
    ),
  ];
  const sections = (await themesForPost(post)).map((t: Theme) => t.data.title);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(headline !== data.title && { alternativeHeadline: data.title }),
    image: [image],
    datePublished: xmlSchemaDate(data.date),
    dateModified: xmlSchemaDate(data.last_modified_at ?? data.date),
    author: { '@type': 'Person', name: site.author, url: absoluteUrl('/about/') },
    publisher: {
      '@type': 'Organization',
      name: site.title,
      url: absoluteUrl('/'),
      logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo) },
    },
    ...(data.meta_description && { description: stripNewlines(stripHtml(data.meta_description)) }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    ...(sections.length > 0 && { articleSection: sections }),
    ...(keywords.length > 0 && { keywords }),
    ...(data.doi && {
      citation: {
        '@type': 'ScholarlyArticle',
        name: data.title,
        identifier: data.doi,
        url: `https://doi.org/${data.doi}`,
      },
    }),
    ...(data.snippet && { abstract: stripNewlines(stripHtml(data.snippet)) }),
    isAccessibleForFree: true,
  };
}

/** Open Graph / Twitter card settings for a page. */
export interface ShareMeta {
  /** Site-relative image path; defaults to the site logo. */
  image?: string;
  imageAlt?: string;
  /** Set on paper summaries: og:type becomes "article". */
  article?: { published: Date; modified?: Date; sections: string[] };
}

/**
 * Twitter card type for an image. Large cards are cropped to roughly 1.91:1 and
 * shown wide, so only big landscape images get one; anything else (small figures,
 * square theme images, the logo) gets the compact "summary" card.
 */
export function twitterCard({ width, height }: { width: number; height: number }) {
  const ratio = width / height;
  return width >= 600 && height >= 315 && ratio >= 1.3 && ratio <= 2.5 ? 'summary_large_image' : 'summary';
}
