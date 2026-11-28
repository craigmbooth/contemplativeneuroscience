// Training Evidence: settings (see src/site-config.ts for what each one does).
// A skeleton: the author wording and themes are drafts to edit.
import type { SiteConfig } from '../../src/site-config';

export default {
  title: 'Training Evidence',
  description: 'Plain-English summaries of the science of exercise, strength, endurance and supplements',
  url: 'https://trainingevidence.com',
  logo: '/assets/images/logo_sm.png',
  cover: '/assets/images/index_header.jpg',
  since: 2026,
  author: 'Craig Booth',
  authorImage: '/assets/images/logo_sm.png',
  authorProfiles: ['https://craigmbooth.me/', 'https://www.linkedin.com/in/craigmbooth/'],
  authorBio:
    'Has a background in science and writes accessible summaries of peer-reviewed research on exercise, strength, endurance and supplements.',
  authorKnowsAbout: ['Exercise science', 'Strength training', 'Endurance training', 'Sports supplements'],
  // Add about four post slugs once there are summaries; empty hides Start Here.
  startHere: [],
  /** Lifting first, then cardio, then what supports training. */
  themeOrder: ['strength', 'muscle', 'endurance', 'supplements', 'recovery'],
  // No analyticsId or MailerLite form yet: set them up for this site and add them here.
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
  // Built around a vibrant sky blue. Text colours are at least 4.5:1 (WCAG AA) on white and the light blues.
  colors: {
    primary: '#0ea5e9',
    'primary-text': '#0369a1', // 5.9:1 on white
    'primary-dark': '#075985', // 7.1:1 on primary-light
    'primary-light': '#f0f9ff',
    'primary-lighter': '#e0f2fe',
    'primary-border': '#bae6fd',
    'primary-border-hover': '#7dd3fc',
    accent: '#0369a1', // 5.3:1 on the glossary's grey
    'tooltip-bg': '#0c4a6e',
    'site-bar-bg': '#082f49', // deep navy
  },
  copy: {
    homeDescription:
      'Accessible summaries of peer-reviewed research on exercise: strength training, muscle growth, cardio and endurance, supplements and recovery.',
    homeLede:
      'Plain-English summaries of peer-reviewed studies on exercise, strength, endurance and supplements. Each one explains what the researchers did, what they found, and how much weight the result can bear.',
    homeAuthor: 'who has a background in science.',
    allPapersDescription:
      'Browse, search, and sort every research summary on the site: peer-reviewed studies on strength, muscle, endurance, supplements and recovery.',
    themesDescription:
      'Questions about training, from strength and muscle to cardio, supplements and recovery, each with a short answer from the research and the papers behind it.',
    themesIntro:
      'The summaries on this site are grouped around questions people ask about training. Below each question is the short answer from the papers covered so far. Each theme page goes further: what the research says, where the evidence is strong or thin, and every paper behind it. Some papers bear on more than one question, so they appear under each.',
    allPapersSearchPlaceholder: 'For example: creatine, hypertrophy, VO2 max',
    notFoundSearchPlaceholder: 'For example: creatine, intervals, protein',
    glossaryDescription:
      'Plain-language definitions of the technical terms in exercise and training research, each linking to the paper summaries that use it.',
    glossaryTermTitleSuffix: 'in Exercise Research',
    subscribeDescription:
      'Get an email when new summaries of exercise and training research go up: one or two peer-reviewed papers every couple of weeks.',
    subscribeLede:
      'Plain-English summaries of peer-reviewed research on exercise, strength, endurance and supplements. Each one explains what the researchers did, what they found, and how much weight the result can bear.',
    llmsSummary:
      'Accessible summaries of peer-reviewed research on exercise, strength, endurance and supplements, written by Craig Booth, who has a background in science.',
  },
} satisfies SiteConfig;
