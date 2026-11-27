// Site-wide settings (formerly Jekyll's _config.yml).
export const site = {
  title: 'Contemplative Neuroscience',
  description: 'Plain-English summaries of the science of meditation and the brain',
  url: 'https://contemplativeneuroscience.com',
  logo: '/assets/images/logo_sm.png',
  cover: '/assets/images/index_header.jpg',
  author: 'Craig Booth',
  authorImage: '/assets/images/logo_sm.png',
  /** The author's other profiles (schema.org sameAs). */
  authorProfiles: ['https://craigmbooth.me/', 'https://www.linkedin.com/in/craigmbooth/'],
  /** One-line author bio for structured data and llms.txt (matches the About page). */
  authorBio:
    'A lay meditation practitioner with a background in science who writes accessible summaries of peer-reviewed research on meditation and the brain.',
  /** "Start here" papers on the home page (post slugs); an unknown slug fails the build. */
  startHere: [
    'wandering-mind-unhappy-mind',
    'mindfulness-cognitive-function-survey',
    'meditation-sleep-older-adults',
    'brain-and-immune-function',
  ],
  /** Themes as questions, in reading order: brain and mind first, then mental health, the self, deep states and death, compassion, body, pain and sleep, then risks. */
  themeOrder: ['neurological-correlates', 'mind-wandering', 'mental-health', 'craving', 'self', 'deep-states', 'death', 'compassion', 'biological-health', 'immunity', 'aging', 'pain', 'sleep', 'adverse-effects'],
  /** Email list (MailerLite). The promise appears beside every sign-up form. */
  newsletter: {
    promise: 'One or two new paper summaries every couple of weeks, sent to your inbox when they go up.',
  },
  menuItems: [
    { title: 'Home', url: '/' },
    { title: 'Research Themes', url: '/themes/' },
    { title: 'All Papers', url: '/all-papers/' },
    { title: 'Glossary', url: '/glossary/' },
    { title: 'About', url: '/about/' },
    // Shown as a button (Header.astro).
    { title: 'Subscribe', url: '/subscribe/' },
  ],
} as const;

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path: string) => new URL(path, site.url).href;
