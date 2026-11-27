import { site } from '../site';
import { getCollection, type CollectionEntry } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { SMARTYPANTS_OPTIONS } from './remark-glossary-terms.js';

export type Post = CollectionEntry<'posts'>;
export type Theme = CollectionEntry<'themes'>;

/** Posts, newest first (Jekyll's site.posts order). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Themes in file-name order (Jekyll's site.pages order). */
export async function getThemes(): Promise<Theme[]> {
  const themes = await getCollection('themes');
  return themes.sort((a, b) => a.id.localeCompare(b.id));
}

/** Themes in the order the home page asks them as questions (site.themeOrder). */
export async function themesInOrder(): Promise<Theme[]> {
  const order: readonly string[] = site.themeOrder;
  const rank = (key: string) => order.indexOf(key) + 1 || order.length + 1;
  return [...(await getThemes())].sort((a, b) => rank(a.data.theme_key) - rank(b.data.theme_key));
}

export const postUrl = (post: Post) => `/${post.id}/`;
export const themeUrl = (theme: Theme) => `/themes/${theme.data.theme_key}/`;
export const themeImage = (theme: Theme) =>
  `/assets/images/themes/${theme.data.theme_key}.${theme.data.image_format ?? 'png'}`;
/** 240px WebP version of the theme image, for small cards. */
/**
 * A theme's short answer to its question: the bold sentence that opens its
 * research_summary ("**Yes: meditation can bring difficult experiences...**").
 */
export const themeShortAnswer = (theme: Theme): string | undefined =>
  theme.data.research_summary?.match(/^\s*\*\*(.+?)\*\*/)?.[1];

export const themeThumb = (theme: Theme) => `/assets/images/themes/thumbs/${theme.data.theme_key}.webp`;

/** 1200×630 share-card images, generated at build time (src/pages/assets/cards/). */
export const postCard = (post: Post) => `/assets/cards/${post.id}.jpg`;
export const themeCard = (theme: Theme) => `/assets/cards/themes/${theme.data.theme_key}.jpg`;

/** "November 23, 2026" (dates are stored as UTC midnight). */
export const displayDate = (d: Date) =>
  d.toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });

/** Look up posts by slug, failing the build on an unknown one. */
export async function postsBySlug(slugs: readonly string[]): Promise<Post[]> {
  const posts = await getPosts();
  return slugs.map((slug) => {
    const post = posts.find((p) => p.id === slug);
    if (!post) throw new Error(`Unknown post slug "${slug}".`);
    return post;
  });
}

/**
 * The theme pages a post belongs to, in the order listed in its front matter.
 * An unknown theme key fails the build.
 */
export async function themesForPost(post: Post): Promise<Theme[]> {
  const themes = await getThemes();
  return post.data.theme.map((key) => {
    const theme = themes.find((t) => t.data.theme_key === key);
    if (!theme) {
      const known = themes.map((t) => t.data.theme_key).join(', ');
      throw new Error(`Post "${post.id}" has unknown theme "${key}" (known themes: ${known}).`);
    }
    return theme;
  });
}

/** Posts in a theme, newest first. */
export async function postsForTheme(theme: Theme): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.data.theme.includes(theme.data.theme_key));
}

/**
 * Other themes that share papers with this one, most shared papers first
 * (site.themeOrder breaks ties), for the "Related Themes" list on theme pages.
 */
export async function relatedThemes(theme: Theme, limit = 4): Promise<{ theme: Theme; shared: number }[]> {
  const posts = await postsForTheme(theme);
  return (await themesInOrder())
    .filter((t) => t.id !== theme.id)
    .map((t) => ({ theme: t, shared: posts.filter((p) => p.data.theme.includes(t.data.theme_key)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit);
}

/**
 * Other papers to link from a post: those sharing one of its themes (any paper
 * if it has no theme), taking the ones closest in date first (newest first on a tie). Linking neighbours rather
 * than simply the newest papers spreads internal links evenly across the archive.
 * Returned newest first.
 */
export async function relatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const sharing = (await getPosts()).filter(
    (p) =>
      p.id === post.id ||
      post.data.theme.length === 0 ||
      p.data.theme.some((t) => post.data.theme.includes(t)),
  );
  const at = sharing.findIndex((p) => p.id === post.id);
  return sharing
    .map((p, i) => ({ p, i, distance: Math.abs(i - at) }))
    .filter(({ i }) => i !== at)
    .sort((a, b) => a.distance - b.distance || a.i - b.i)
    .slice(0, limit)
    .sort((a, b) => a.i - b.i)
    .map(({ p }) => p);
}

/** Rendered HTML of a post body (Jekyll's post.content). */
export const postHtml = (post: Post) => post.rendered?.html ?? '';

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | undefined;
/** Render a markdown string, e.g. a citation from front matter (Jekyll's markdownify). */
export async function markdownify(source: string | undefined): Promise<string> {
  if (!source) return '';
  processor ??= await createMarkdownProcessor({ smartypants: SMARTYPANTS_OPTIONS });
  return (await processor.render(source)).code;
}

/** "2024-03-08T00:00:00+00:00", matching Jekyll's date_to_xmlschema for UTC builds. */
export const xmlSchemaDate = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
