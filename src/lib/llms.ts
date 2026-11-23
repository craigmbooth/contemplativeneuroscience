// Builds /llms.txt (an index of the site for AI systems, see https://llmstxt.org)
// and /llms-full.txt (every summary as plain Markdown in one file).
import { site, absoluteUrl } from '../site';
import { loadDefinitions } from './definitions.js';
import { getPosts, getThemes, postUrl, themesForPost, themeUrl, type Post } from './content';

const definitions = new Map(loadDefinitions().map((d) => [d.term, d]));
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Display text of a :term directive, as remark-glossary-terms renders it. */
function termText(label: string | undefined, attrs: string): string {
  if (label) return label;
  const attr = Object.fromEntries(
    [...attrs.matchAll(/(\w+)(?:="([^"]*)")?/g)].map((m) => [m[1], m[2] ?? '']),
  );
  const definition = definitions.get(attr.id);
  if (!definition) throw new Error(`Unknown glossary term "${attr.id}" in llms-full.txt.`);
  let text = definition.title;
  if ('plural' in attr) text += 's';
  if (attr.case === 'lower') text = text.toLowerCase();
  return text;
}

/** A post body as plain Markdown: glossary directives become words, site links become absolute. */
function plainMarkdown(body: string): string {
  return body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/:term(?:\[([^\]]*)\])?\{([^}]*)\}/g, (_, label, attrs) => termText(label, attrs))
    .replace(/\]\((\/[^)\s]*)\)/g, (_, path) => `](${absoluteUrl(path)})`)
    .replace(/^(#{1,5}) /gm, '#$1 ') // nest the post's headings under its title
    .trim();
}

const doiUrl = (doi: string) => `https://doi.org/${doi}`;

export async function llmsTxt(): Promise<string> {
  const posts = await getPosts();
  const themes = await getThemes();
  const counts = new Map(themes.map((t) => [t.data.theme_key, 0]));
  for (const p of posts) for (const key of p.data.theme) counts.set(key, (counts.get(key) ?? 0) + 1);

  const paper = (p: Post) =>
    `- [${oneLine(p.data.title)}](${absoluteUrl(postUrl(p))}): ${oneLine(p.data.meta_description ?? p.data.snippet ?? '')}` +
    (p.data.doi ? ` Paper: ${doiUrl(p.data.doi)}` : '');

  return `# ${site.title}

> Accessible summaries of peer-reviewed research on meditation and the brain, written by ${site.author}, a lay meditation practitioner with a background in science.

Each summary explains one published paper: the background, what the researchers did, the main result, other takeaways, and the full citation with its DOI. The summaries describe research findings; they are not medical advice.

Author: [${site.author}](${absoluteUrl('/about/')}) (${site.authorProfiles.join(', ')})

## Paper summaries

${posts.map(paper).join('\n')}

## Research themes

${themes
  .map(
    (t) =>
      `- [${t.data.title}](${absoluteUrl(themeUrl(t))}): ${oneLine(t.data.meta_description ?? '')} (${counts.get(t.data.theme_key)} papers)`,
  )
  .join('\n')}

## Reference

- [Glossary](${absoluteUrl('/glossary/')}): Definitions of ${definitions.size} technical terms used in the summaries, each linked to Wikipedia.
- [All papers](${absoluteUrl('/all-papers/')}): Every summary with its citation, searchable and sortable.
- [About](${absoluteUrl('/about/')}): Who writes this site and why.

## Optional

- [Full text of every summary](${absoluteUrl('/llms-full.txt')}): All ${posts.length} summaries as Markdown in one file.
`;
}

export async function llmsFullTxt(): Promise<string> {
  const posts = await getPosts();
  const sections = await Promise.all(
    posts.map(async (p) => {
      const { data } = p;
      const themes = (await themesForPost(p)).map((t) => t.data.title);
      const meta = [
        `URL: ${absoluteUrl(postUrl(p))}`,
        `Published: ${isoDate(data.date)}` + (data.last_modified_at ? ` (updated ${isoDate(data.last_modified_at)})` : ''),
        `Author: ${site.author}`,
        themes.length > 0 && `Themes: ${themes.join(', ')}`,
        data.citation && `Paper: ${oneLine(data.citation)}`,
        data.doi && `DOI: ${doiUrl(data.doi)}`,
        data.study && `Study type: ${data.study.design}`,
        data.study && `Participants: ${data.study.participants}`,
        data.study?.method && `Method: ${data.study.method}`,
        data.study?.measures && `Measured: ${data.study.measures}`,
        data.study && `Keep in mind: ${data.study.limitations}`,
      ].filter(Boolean);
      return [
        `## ${oneLine(data.title)}`,
        meta.join('\n'),
        data.snippet && `In brief: ${oneLine(data.snippet)}`,
        plainMarkdown(p.body ?? ''),
      ]
        .filter(Boolean)
        .join('\n\n');
    }),
  );

  const themeSections = (await getThemes())
    .filter((t) => t.data.research_summary)
    .map(
      (t) =>
        `## ${t.data.title}: what the research says\n\nURL: ${absoluteUrl(themeUrl(t))}\n\n${plainMarkdown(t.data.research_summary ?? '')}`,
    );

  return `# ${site.title}: all paper summaries

> The full text of every summary on ${site.url}, newest first, written by ${site.author}, followed by a synthesis for each research theme. The index is at ${absoluteUrl('/llms.txt')}.

${sections.join('\n\n---\n\n')}

---

${themeSections.join('\n\n---\n\n')}
`;
}
