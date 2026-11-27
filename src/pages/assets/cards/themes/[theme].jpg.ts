// Share-card image for each research theme at /assets/cards/themes/<theme_key>.jpg
// (see lib/share-card.ts): the theme's painting and its question.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getThemes, themeImage, type Theme } from '../../../../lib/content';
import { renderShareCard } from '../../../../lib/share-card';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getThemes()).map((theme) => ({ params: { theme: theme.data.theme_key }, props: { theme } }));

export const GET: APIRoute = async ({ props }) => {
  const { theme } = props as { theme: Theme };
  const jpeg = await renderShareCard({
    label: `Research theme · ${theme.data.short_title}`,
    headline: theme.data.question,
    painting: themeImage(theme),
  });
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
};
