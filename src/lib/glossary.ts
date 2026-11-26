import { loadDefinitions, termHeading, termPath, termSlug } from './definitions.js';

export { loadDefinitions, termHeading, termPath, termSlug };

export type Definition = ReturnType<typeof loadDefinitions>[number];

/** Definitions sorted by page heading (full name, else title), case-insensitively. */
export function sortedDefinitions(): Definition[] {
  return [...loadDefinitions()].sort((a, b) => {
    const x = termHeading(a).toLowerCase();
    const y = termHeading(b).toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

export function definitionsByTerm(): Map<string, Definition> {
  return new Map(loadDefinitions().map((d) => [d.term, d]));
}

/** Definitions keyed by the slug of their page (/glossary/<slug>/). */
export function definitionsBySlug(): Map<string, Definition> {
  return new Map(loadDefinitions().map((d) => [termSlug(d), d]));
}

/** Glossary term ids a markdown body uses in :term directives, in order of first use. */
export function termIdsInMarkdown(body: string): string[] {
  const ids = [...body.matchAll(/:term(?:\[[^\]]*\])?\{[^}]*\bid="([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

/** First sentence of a definition, for the glossary index. */
export function firstSentence(def: string): string {
  const m = def.match(/^(.+?[.!?])(?=\s+[A-Z]|\s*$)/s);
  return (m ? m[1] : def).trim();
}
