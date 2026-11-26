// Renders glossary tooltips from markdown text directives (needs remark-directive):
//
//   :term{id="eeg"}                    -> "EEG" with a tooltip
//   :term{id="mindfulness" case="lower"} -> "mindfulness"
//   :term{id="telomeres" plural}       -> title + "s"
//   :term[inflammatory]{id="inflammation"} -> custom link text
//
// Unknown glossary terms fail the build rather than rendering placeholder text.
import { visit } from 'unist-util-visit';
import remarkSmartypants from 'remark-smartypants';
import { loadDefinitions, termPath } from './definitions.js';

/**
 * Smart-typography settings shared with astro.config.mjs (kramdown-style dashes).
 * @type {{ dashes: 'oldschool' }}
 */
export const SMARTYPANTS_OPTIONS = { dashes: 'oldschool' };

const el = (tagName, properties, children = []) => ({
  type: 'glossaryElement',
  data: { hName: tagName, hProperties: properties },
  children,
});
const text = (value) => ({ type: 'text', value });

export default function remarkGlossaryTerms() {
  const definitions = loadDefinitions();
  // Astro applies smartypants before user plugins, so typeset generated text here.
  const smarten = remarkSmartypants(SMARTYPANTS_OPTIONS);

  return (tree, file) => {
    visit(tree, (node, index, parent) => {
      if (!['textDirective', 'leafDirective', 'containerDirective'].includes(node.type)) return;
      const where = `${file.path ?? 'markdown'}:${node.position?.start.line ?? '?'}`;
      if (node.type !== 'textDirective' || node.name !== 'term') {
        // remark-directive also matches ordinary text such as the ":1" in "2:1".
        // Put anything that is not a :term directive back exactly as written.
        const { start, end } = node.position ?? {};
        if (start?.offset === undefined || end?.offset === undefined) {
          throw new Error(`Cannot restore directive "${node.name}" at ${where}.`);
        }
        const literal = text(String(file.value).slice(start.offset, end.offset));
        parent.children[index] = node.type === 'textDirective' ? literal : { type: 'paragraph', children: [literal] };
        return 'skip';
      }

      const attrs = node.attributes ?? {};
      const position = definitions.findIndex((d) => d.term === attrs.id);
      if (position === -1) {
        throw new Error(`Unknown glossary term "${attrs.id}" at ${where}. Add it to src/data/definitions.yaml.`);
      }
      const definition = definitions[position];

      let title = definition.title;
      if (attrs.plural !== undefined) title += 's';
      if (attrs.case === 'lower') title = title.toLowerCase();

      const tooltipId = `definition-${definition.term}-${attrs.id}-${position + 1}`;
      const glossaryHref = termPath(definition);
      const linkChildren = node.children.length > 0 ? node.children : [text(title)];

      const body = el('span', { className: ['tooltiptext'], id: tooltipId, role: 'tooltip' }, [
        text(`\n        ${definition.def}`),
      ]);
      smarten(body);
      if (definition.wiki) {
        body.children.push(
          el('br', {}),
          el('br', {}),
          el(
            'a',
            {
              href: `https://en.wikipedia.org/wiki/${definition.wiki}`,
              target: '_blank',
              ariaLabel: `Learn more about ${title} on Wikipedia (opens in new tab)`,
            },
            [text('More on Wikipedia')],
          ),
        );
      }
      body.children.push(
        el('br', {}),
        el('br', {}),
        el('a', { href: glossaryHref }, [text('Read more in the glossary')]),
        text('\n      '),
      );

      parent.children[index] = el(
        'span',
        { className: ['tooltip'], tabIndex: 0, role: 'button', ariaDescribedBy: tooltipId },
        [
          text('\n      '),
          el('a', { href: glossaryHref, className: ['glossary-term-link'] }, linkChildren),
          text('\n      '),
          body,
          text('\n    '),
        ],
      );
    });
  };
}
