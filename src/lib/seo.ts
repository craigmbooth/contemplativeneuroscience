// Page metadata and JSON-LD builders (formerly page-title.html, head.html and
// the *_schema.html includes).
import { site, absoluteUrl } from '../site';
import { definitionsBySlug, termHeading, termPath, type Definition } from './glossary';
import { postHtml, themesForPost, xmlSchemaDate, type Post, type Theme } from './content';

/** Liquid's `truncate`: at most `length` characters including the ellipsis. */
export const truncate = (s: string, length: number) =>
  s.length > length ? s.slice(0, length - 3) + '...' : s;
/** Search results show about this many characters of a description. */
export const META_DESCRIPTION_MAX = 155;

/** Shorten to at most `length` characters at a word boundary, ending in an ellipsis. */
export function truncateWords(s: string, length: number): string {
  if (s.length <= length) return s;
  const cut = s.slice(0, length - 1);
  const space = cut.lastIndexOf(' ');
  return (space > length / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.\u2014\u2013-]+$/, '') + '\u2026';
}
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');
const stripNewlines = (s: string) => s.replace(/\r?\n/g, '');

/**
 * <title> text. Uses seo_title when present, otherwise title. The site name is
 * appended only when the result stays within 60 characters (about what search
 * results show), so long titles are
 * never cut mid-word. Long paper titles should set a concise seo_title.
 */
export function pageTitle(title?: string, seoTitle?: string): string {
  const base = seoTitle || title;
  if (!base) return site.title;
  const full = `${base} | ${site.title}`;
  return full.length <= 60 ? full : base;
}

/** Meta description, falling back to the snippet, theme description, then site description. */
export function metaDescription(opts: {
  metaDescription?: string;
  snippet?: string;
  themeDescription?: string;
}): string {
  if (opts.metaDescription) return stripNewlines(stripHtml(opts.metaDescription));
  const fallback = opts.snippet ?? opts.themeDescription;
  if (fallback) return truncateWords(stripNewlines(stripHtml(fallback)), META_DESCRIPTION_MAX);
  return site.description;
}

/** Serialize JSON-LD safely for inline <script> tags. */
export const jsonLd = (data: unknown) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

/**
 * The author, as one Person entity shared by every page (same @id), linked to
 * their other profiles so search and AI systems can tie the content to them.
 */
export function authorSchema() {
  return {
    '@type': 'Person',
    '@id': absoluteUrl('/about/#author'),
    name: site.author,
    url: absoluteUrl('/about/'),
    sameAs: [...site.authorProfiles],
    description: site.authorBio,
    knowsAbout: ['Meditation', 'Mindfulness', 'Contemplative neuroscience'],
  };
}

function publisherSchema() {
  return {
    '@type': 'Organization',
    '@id': absoluteUrl('/#publisher'),
    name: site.title,
    url: absoluteUrl('/'),
    logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo) },
  };
}

/** Home page: the site itself, its publisher and author. */
export function websiteSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: site.title,
    description,
    inLanguage: 'en',
    publisher: publisherSchema(),
    author: authorSchema(),
    // All Papers applies ?q= on load (scripts/all-papers.js).
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl('/all-papers/?q={search_term_string}') },
      'query-input': 'required name=search_term_string',
    },
  };
}

const websiteRef = () => ({ '@id': absoluteUrl('/#website') });

/**
 * A listing page (a theme, All Papers, Research Themes) as a CollectionPage
 * whose main entity is the ordered list of pages it links to.
 */
export function collectionPageSchema(opts: {
  path: string;
  name: string;
  description: string;
  /** Plain-text synthesis of the collection (a theme's "What the Research Says"). */
  abstract?: string;
  items: { name: string; path: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: opts.name,
    description: opts.description,
    ...(opts.abstract && { abstract: opts.abstract }),
    inLanguage: 'en',
    isPartOf: websiteRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/** Rendered HTML to one line of plain text (for abstracts). */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:!?)])/g, '$1')
    .replace(/([(]) /g, '$1')
    .trim();
}

/** About page: a profile page about the author. */
export function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl('/about/'),
    mainEntity: authorSchema(),
  };
}

const glossaryTermId = (d: Definition) => absoluteUrl(termPath(d));
const wikipediaUrl = (article: string) => `https://en.wikipedia.org/wiki/${article}`;

/** A glossary term as a schema.org DefinedTerm, tied to its Wikipedia article. */
function definedTerm(d: Definition, withDescription = false) {
  return {
    '@type': 'DefinedTerm',
    '@id': glossaryTermId(d),
    name: termHeading(d),
    ...(d.name && d.name !== d.title && { alternateName: d.title }),
    ...(withDescription && d.def && { description: stripNewlines(d.def) }),
    url: glossaryTermId(d),
    inDefinedTermSet: absoluteUrl('/glossary/'),
    ...(d.wiki && { sameAs: wikipediaUrl(d.wiki) }),
  };
}

/** Glossary page: every term with its definition. */
export function glossarySchema(definitions: Definition[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': absoluteUrl('/glossary/'),
    name: 'Glossary of Technical Terms',
    url: absoluteUrl('/glossary/'),
    hasDefinedTerm: definitions.map((d) => definedTerm(d, true)),
  };
}

/** A glossary term's own page: the term, as part of the glossary's DefinedTermSet. */
export function glossaryTermSchema(d: Definition) {
  return { '@context': 'https://schema.org', ...definedTerm(d, true) };
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

/** "Surname, I. I." (APA, as in front matter) as a schema.org Person. */
function paperAuthor(apa: string) {
  const [familyName, givenName] = apa.split(', ');
  return { '@type': 'Person', name: `${givenName} ${familyName}`, givenName, familyName };
}

/**
 * The summarized paper as a ScholarlyArticle, identified by its DOI URL, with
 * its authors and journal (Periodical > PublicationVolume > PublicationIssue).
 */
export function paperSchema(post: Post) {
  const { data } = post;
  const { paper } = data;
  const doiUrl = data.doi ? `https://doi.org/${data.doi}` : undefined;
  let container: Record<string, unknown> = { '@type': 'Periodical', name: paper.journal };
  if (paper.volume) container = { '@type': 'PublicationVolume', volumeNumber: paper.volume, isPartOf: container };
  if (paper.issue) container = { '@type': 'PublicationIssue', issueNumber: paper.issue, isPartOf: container };
  return {
    '@type': 'ScholarlyArticle',
    ...(doiUrl && { '@id': doiUrl }),
    headline: data.paper_title ?? data.title,
    name: data.paper_title ?? data.title,
    author: paper.authors.map(paperAuthor),
    datePublished: String(paper.year),
    isPartOf: container,
    ...(paper.pages && { pagination: paper.pages }),
    ...(data.doi && {
      identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: data.doi },
      url: doiUrl,
      sameAs: doiUrl,
    }),
  };
}

/** Glossary terms a post links to, in order of first mention. */
export function postGlossaryTerms(post: Post) {
  const definitions = definitionsBySlug();
  return [...new Set([...postHtml(post).matchAll(/href="\/glossary\/([^/"#]+)\/"/g)].map((m) => m[1]))]
    .map((slug) => definitions.get(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
}

/**
 * Article structured data for a paper summary.
 * - headline: the title, or seo_title when the title exceeds Google's 110-char limit
 * - image: see postImage()
 * - dateModified: last_modified_at, else the post date
 * - keywords / mentions: glossary terms the post links to (mentions as DefinedTerms)
 * - articleSection: display names of the post's themes
 * - isBasedOn: the paper (see paperSchema())
 */
export async function articleSchema(post: Post, path: string) {
  const { data } = post;
  let headline = data.title;
  if (headline.length > 110) headline = truncate(data.seo_title || data.title, 110);

  const image = absoluteUrl(postImage(post).src);
  const paper = paperSchema(post);

  const terms = postGlossaryTerms(post);
  const keywords = terms.map((d) => d.title);
  const sections = (await themesForPost(post)).map((t: Theme) => t.data.title);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(headline !== data.title && { alternativeHeadline: data.title }),
    image: [image],
    datePublished: xmlSchemaDate(data.date),
    dateModified: xmlSchemaDate(data.last_modified_at ?? data.date),
    author: authorSchema(),
    publisher: publisherSchema(),
    ...(data.meta_description && { description: stripNewlines(stripHtml(data.meta_description)) }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    ...(sections.length > 0 && { articleSection: sections }),
    ...(keywords.length > 0 && { keywords }),
    ...(terms.length > 0 && { mentions: terms.map((d) => definedTerm(d)) }),
    // The summary is based on (and cites) the paper; citation refers to it by @id.
    isBasedOn: paper,
    ...(data.doi && { citation: { '@id': `https://doi.org/${data.doi}` } }),
    ...(data.snippet && { abstract: stripNewlines(stripHtml(data.snippet)) }),
    inLanguage: 'en',
    isPartOf: websiteRef(),
    isAccessibleForFree: true,
  };
}

/** Open Graph / Twitter card settings for a page. */
export interface ShareMeta {
  /** og:title / twitter:title; defaults to the page's <title>. */
  title?: string;
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
