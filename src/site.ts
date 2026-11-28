// The active site's settings (see src/lib/active-site.js for how a build picks a site).
import type { SiteConfig } from './site-config';
import { SITE } from './lib/active-site.js';
import contemplative from '../sites/contemplative/site';

/** Every site, by its folder name under sites/. Add new sites here. */
const SITES: Record<string, SiteConfig> = { contemplative };

const config = SITES[SITE];
if (!config) throw new Error(`sites/${SITE}/site.ts is not registered in src/site.ts.`);

export const site: SiteConfig = config;

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) => new URL(path, site.url).href;
