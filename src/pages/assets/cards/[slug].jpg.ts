// Share-card image for each paper summary at /assets/cards/<slug>.jpg (see lib/share-card.ts):
// the painting of the post's first theme, its study type and theme, and its headline.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, themeImage, themesForPost, type Post } from '../../../lib/content';
import { renderShareCard } from '../../../lib/share-card';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }));

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const [theme] = await themesForPost(post);
  const label = [post.data.study?.type, theme.data.short_title].filter(Boolean).join(' · ');
  const jpeg = await renderShareCard({ label, headline: post.data.title, painting: themeImage(theme) });
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
};
