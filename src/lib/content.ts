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

export const postUrl = (post: Post) => `/${post.id}/`;
export const themeUrl = (theme: Theme) => `/themes/${theme.data.theme_key}/`;
export const themeImage = (theme: Theme) =>
  `/assets/images/themes/${theme.data.theme_key}.${theme.data.image_format ?? 'png'}`;

/** The theme pages a post belongs to, in the order listed in its front matter. */
export async function themesForPost(post: Post): Promise<Theme[]> {
  const themes = await getThemes();
  return post.data.theme.flatMap((key) => themes.filter((t) => t.data.theme_key === key));
}

/** Posts in a theme, newest first. */
export async function postsForTheme(theme: Theme): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.data.theme.includes(theme.data.theme_key));
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
