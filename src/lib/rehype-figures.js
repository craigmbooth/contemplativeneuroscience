// Turns a paragraph holding nothing but an image with alt text into
//   <figure class="image"><img …><figcaption>alt text</figcaption></figure>
// so captions are in the HTML from the start (no reflow when a script adds them,
// and readers and crawlers without JavaScript see them too).
// scripts/figures.js adds tap-to-enlarge on top.

const isBlank = (node) => node.type === 'text' && !node.value.trim();

export default function rehypeFigures() {
  return (tree) => {
    const visit = (parent) => {
      parent.children?.forEach((node, index) => {
        if (node.type !== 'element') return;
        if (node.tagName === 'p') {
          const content = node.children.filter((child) => !isBlank(child));
          const [img] = content;
          const alt = img?.type === 'element' && img.tagName === 'img' ? String(img.properties.alt ?? '').trim() : '';
          if (content.length === 1 && alt) {
            parent.children[index] = {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['image'] },
              children: [
                img,
                { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: alt }] },
              ],
            };
          }
          return;
        }
        visit(node);
      });
    };
    visit(tree);
  };
}
