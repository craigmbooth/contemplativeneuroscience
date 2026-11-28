// Pixel dimensions of images served from the site's public/ folder, read at build time.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { imageSize } from 'image-size';
import { PUBLIC_DIR, SITE } from './active-site.js';

/** @type {Map<string, { width: number, height: number }>} */
const cache = new Map();

/**
 * Size of a site-relative image such as "/assets/images/logo_sm.png".
 * Throws if the file is missing from public/, so broken image links fail the build.
 * @param {string} src
 * @param {string} [from] where the image is referenced, for the error message
 * @returns {{ width: number, height: number }}
 */
export function publicImageSize(src, from = 'site') {
  const path = decodeURI(src.split(/[?#]/)[0]);
  let size = cache.get(path);
  if (!size) {
    let bytes;
    try {
      bytes = readFileSync(join(PUBLIC_DIR, path));
    } catch {
      throw new Error(`Image "${src}" (referenced in ${from}) not found at sites/${SITE}/public${path}.`);
    }
    const { width, height } = imageSize(bytes);
    if (!width || !height) throw new Error(`Cannot read the dimensions of sites/${SITE}/public${path}.`);
    size = { width, height };
    cache.set(path, size);
  }
  return size;
}
