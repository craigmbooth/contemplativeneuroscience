// Glossary definitions, shared by the remark plugin (build-time markdown
// rendering) and the glossary pages. Plain JS + fs so it works in both contexts.
import { readFileSync } from 'node:fs';
import { load as parseYaml } from 'js-yaml';
import { sitePath } from './active-site.js';

const DEFINITIONS_PATH = sitePath('definitions.yaml');

/**
 * A glossary term.
 * - term: the id used in :term{id="..."} directives
 * - title: what the term looks like in running text (often an abbreviation, e.g. "DMN")
 * - name: optional full name for the term's own page, e.g. "Default Mode Network (DMN)";
 *   set it when the title alone is an abbreviation or too terse to head a page
 * - def: the definition; wiki: optional Wikipedia article name
 * @typedef {{ term: string, title: string, name?: string, def: string, wiki?: string }} Definition
 * @returns {Definition[]} definitions in file order
 */
export function loadDefinitions() {
  const definitions = /** @type {Definition[]} */ (parseYaml(readFileSync(DEFINITIONS_PATH, 'utf8')) ?? []);
  // Each term gets its own page, so two terms must never share a URL.
  const seen = new Map();
  for (const d of definitions) {
    const slug = termSlug(d);
    if (seen.has(slug)) {
      throw new Error(`Glossary terms "${seen.get(slug)}" and "${d.term}" would share the URL /glossary/${slug}/.`);
    }
    seen.set(slug, d.term);
  }
  return definitions;
}

/** Heading for a term's own page: its full name, else its title. */
export const termHeading = (/** @type {Definition} */ d) => d.name ?? d.title;

/**
 * URL slug for a term's page, from its heading without any parenthetical
 * ("Default Mode Network (DMN)" -> "default-mode-network", "Brahmavihārās" -> "brahmaviharas").
 */
export function termSlug(/** @type {Definition} */ d) {
  return termHeading(d)
    .replace(/\s*\([^)]*\)/g, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/α/g, 'alpha')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Path of a term's own page, e.g. /glossary/default-mode-network/. */
export const termPath = (/** @type {Definition} */ d) => `/glossary/${termSlug(d)}/`;
