// 1200×630 share-card images (og:image / twitter:image), rendered at build time:
// the theme painting on the left, a rule in the brand colour, then a small label, the headline
// and the site name. Satori lays the card out as SVG; sharp rasterizes it to JPEG.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../site';
import { PUBLIC_DIR } from './active-site.js';

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;
const PAINTING_WIDTH = 500;

const require = createRequire(import.meta.url);
const fontFile = (pkg: string, file: string) => readFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`));
const fonts = [
  { name: 'Merriweather', data: fontFile('merriweather', 'merriweather-latin-700-normal.woff'), weight: 700 as const },
  { name: 'Jost', data: fontFile('jost', 'jost-latin-500-normal.woff'), weight: 500 as const },
  { name: 'Jost', data: fontFile('jost', 'jost-latin-600-normal.woff'), weight: 600 as const },
];

const publicFile = (src: string) => join(PUBLIC_DIR, decodeURI(src));
const dataUri = (mime: string, bytes: Buffer) => `data:${mime};base64,${bytes.toString('base64')}`;
const logo = dataUri('image/png', await sharp(publicFile(site.logo)).resize(88, 88).png().toBuffer());

/** Satori element (it takes React-shaped objects, so no JSX runtime is needed). */
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...props },
});

/** Headline size steps down with length so the longest headlines (~160 chars) still fit. */
function headlineSize(text: string) {
  const n = text.length;
  return n <= 45 ? 66 : n <= 80 ? 54 : n <= 115 ? 46 : n <= 165 ? 40 : 34;
}

/**
 * Keep hyphenated words and ranges ("Non-REM", "6–14%") on one line: word
 * joiners on both sides of the dash forbid a line break there.
 */
const keepDashedWords = (text: string) => text.replace(/(?<=[\p{L}\p{N}%])([-–])(?=[\p{L}\p{N}])/gu, '⁠$1⁠');

/**
 * The card as a progressive JPEG.
 * @param label small capitals line above the headline, e.g. "Randomized trial · Sleep"
 * @param headline the post's title (or a theme's question)
 * @param painting site-relative path of the theme image shown on the left
 */
export async function renderShareCard({ label, headline, painting }: { label: string; headline: string; painting: string }) {
  const picture = await sharp(publicFile(painting)).resize(PAINTING_WIDTH, CARD_HEIGHT, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer();
  const card = h('div', { display: 'flex', width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: '#fff' }, [
    h('img', { width: PAINTING_WIDTH, height: CARD_HEIGHT }, undefined, { src: dataUri('image/jpeg', picture), width: PAINTING_WIDTH, height: CARD_HEIGHT }),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 60px 48px 56px', borderLeft: `8px solid ${site.colors.primary}` },
      [
        h('div', { fontFamily: 'Jost', fontWeight: 600, fontSize: 22, letterSpacing: 1.8, textTransform: 'uppercase', color: site.colors['primary-text'] }, label),
        h(
          'div',
          { fontFamily: 'Merriweather', fontWeight: 700, fontSize: headlineSize(headline), lineHeight: 1.22, color: '#333332', marginTop: 26 },
          keepDashedWords(headline),
        ),
        h('div', { display: 'flex', alignItems: 'center', marginTop: 'auto', fontFamily: 'Jost', fontWeight: 500, fontSize: 24, color: '#666665' }, [
          h('img', { width: 44, height: 44, marginRight: 14 }, undefined, { src: logo, width: 44, height: 44 }),
          site.title,
        ]),
      ],
    ),
  ]);
  const svg = await satori(card as never, { width: CARD_WIDTH, height: CARD_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
}
