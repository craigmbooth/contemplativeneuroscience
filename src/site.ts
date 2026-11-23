// Site-wide settings (formerly Jekyll's _config.yml).
export const site = {
  title: 'Contemplative Neuroscience',
  description: 'Reviewing Papers on Meditative States and Their Neurological Signatures',
  url: 'https://contemplativeneuroscience.com',
  logo: '/assets/images/logo_sm.png',
  cover: '/assets/images/index_header.jpg',
  author: 'Craig Booth',
  authorImage: '/assets/images/logo_sm.png',
  twitterHandle: '@cmb',
  menuItems: [
    { title: 'Home', url: '/' },
    { title: 'Research Themes', url: '/themes/' },
    { title: 'All Papers', url: '/all-papers/' },
    { title: 'Glossary', url: '/glossary/' },
    { title: 'About', url: '/about/' },
  ],
} as const;

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) => new URL(path, site.url).href;
