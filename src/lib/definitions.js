// Glossary definitions, shared by the remark plugin (build-time markdown
// rendering) and the glossary page. Plain JS + fs so it works in both contexts.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load as parseYaml } from 'js-yaml';

const DEFINITIONS_PATH = resolve(process.cwd(), 'src/data/definitions.yaml');

/**
 * @typedef {{ term: string, title: string, def: string, wiki?: string }} Definition
 * @returns {Definition[]} definitions in file order
 */
export function loadDefinitions() {
  return /** @type {Definition[]} */ (parseYaml(readFileSync(DEFINITIONS_PATH, 'utf8')));
}
