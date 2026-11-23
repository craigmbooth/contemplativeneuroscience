// Gives markdown images that point at files in public/ their intrinsic width and
// height (so the page doesn't shift as they load) and lazy-loads all but the first.
import { visit } from 'unist-util-visit';
import { publicImageSize } from './images.js';

export default function rehypeImageDimensions() {
  return (tree, file) => {
    let index = 0;
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const isFirst = index++ === 0;
      const src = String(node.properties.src ?? '');
      if (!src.startsWith('/') || src.startsWith('//')) return;
      const { width, height } = publicImageSize(src, file.path ?? 'markdown');
      node.properties.width ??= width;
      node.properties.height ??= height;
      node.properties.decoding ??= 'async';
      if (!isFirst) node.properties.loading ??= 'lazy';
    });
  };
}
