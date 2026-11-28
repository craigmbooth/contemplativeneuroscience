// Contemplative Neuroscience: settings (see src/site-config.ts for what each one does).
import type { SiteConfig } from '../../src/site-config';

export default {
  title: 'Contemplative Neuroscience',
  description: 'Plain-English summaries of the science of meditation and the brain',
  url: 'https://contemplativeneuroscience.com',
  logo: '/assets/images/logo_sm.png',
  cover: '/assets/images/index_header.jpg',
  since: 2024,
  author: 'Craig Booth',
  authorImage: '/assets/images/logo_sm.png',
  authorProfiles: ['https://craigmbooth.me/', 'https://www.linkedin.com/in/craigmbooth/'],
  authorBio:
    'A lay meditation practitioner with a background in science who writes accessible summaries of peer-reviewed research on meditation and the brain.',
  authorKnowsAbout: ['Meditation', 'Mindfulness', 'Contemplative neuroscience'],
  startHere: [
    'wandering-mind-unhappy-mind',
    'mindfulness-cognitive-function-survey',
    'meditation-sleep-older-adults',
    'brain-and-immune-function',
  ],
  /** The brain (a parent theme with four topics), then headings: mind and emotion, the self, the body, then risks. */
  themeGroups: [
    { title: 'The Brain', parent: 'neurological-correlates', themes: ['brain-waves', 'brain-networks', 'brain-responses', 'brain-structure'] },
    { title: 'Mind and Emotion', themes: ['mind-wandering', 'mental-health', 'emotion', 'craving', 'compassion'] },
    { title: 'Self and Consciousness', themes: ['self', 'deep-states', 'death'] },
    { title: 'Body and Health', themes: ['biological-health', 'immunity', 'aging', 'pain', 'sleep'] },
    { title: 'Safety', themes: ['adverse-effects'] },
  ],
  analyticsId: 'G-XV8N5DDQYP',
  newsletter: {
    promise: 'One or two new paper summaries every couple of weeks, sent to your inbox when they go up.',
    mailerlite: { account: '864413', formId: '13082872', formKey: '115466837896987758' },
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
  colors: {
    primary: '#f62681',
    // At least 4.5:1 (WCAG AA) on white and the pink card backgrounds.
    'primary-text': '#ca085d',
    'primary-dark': '#d8517c',
    'primary-light': '#f9f0f5',
    'primary-lighter': '#f8e4ed',
    'primary-border': '#f1c4d6',
    'primary-border-hover': '#e4a1bc',
    accent: '#d8517c',
    'tooltip-bg': '#353d5a',
    // Deep indigo from the home page's starfield.
    'site-bar-bg': '#1d1b2e',
  },
  copy: {
    homeDescription:
      'Accessible summaries of peer-reviewed research on meditation and the brain, from jhana and gamma waves to sleep, immune function, and mind wandering.',
    homeLede:
      'Plain-English summaries of peer-reviewed studies on meditation and the brain. Each one explains what the researchers did, what they found, and how much weight the result can bear.',
    homeAuthor: 'a meditator with a background in science.',
    allPapersDescription:
      'Browse, search, and sort every research summary on the site: peer-reviewed studies on meditation, mindfulness, and the brain.',
    themesDescription:
      'Five questions about meditation, on the brain, focus, the body, sleep and safety, each with a short answer from the research and the papers behind it.',
    themesIntro:
      'The summaries on this site are grouped around five questions people ask about meditation. Below each question is the short answer from the papers covered so far. Each theme page goes further: what the research says, where the evidence is strong or thin, and every paper behind it. Some papers bear on more than one question, so they appear under each.',
    allPapersSearchPlaceholder: 'For example: sleep, gamma, Davidson, EEG',
    notFoundSearchPlaceholder: 'For example: sleep, gamma, telomeres',
    glossaryDescription:
      'Plain-language definitions of the technical terms in meditation and brain research, each linking to the paper summaries that use it.',
    glossaryTermTitleSuffix: 'in Meditation Research',
    subscribeDescription:
      'Get an email when new summaries of meditation and brain research go up: one or two peer-reviewed papers every couple of weeks.',
    subscribeLede:
      'Plain-English summaries of peer-reviewed research on meditation and the brain. Each one explains what the researchers did, what they found, and how much weight the result can bear.',
    llmsSummary:
      'Accessible summaries of peer-reviewed research on meditation and the brain, written by Craig Booth, a lay meditation practitioner with a background in science.',
  },
} satisfies SiteConfig;
