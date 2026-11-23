import { loadDefinitions } from './definitions.js';

export type Definition = ReturnType<typeof loadDefinitions>[number];

/** Definitions sorted by title, case-insensitively (Liquid's sort_natural). */
export function sortedDefinitions(): Definition[] {
  return [...loadDefinitions()].sort((a, b) => {
    const x = a.title.toLowerCase();
    const y = b.title.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

export function definitionsByTerm(): Map<string, Definition> {
  return new Map(loadDefinitions().map((d) => [d.term, d]));
}
