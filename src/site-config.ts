// The settings every site defines in sites/<name>/site.ts (formerly Jekyll's _config.yml).

/**
 * A group of research themes. Either a heading over related themes (give it a `title`),
 * or a parent theme with its own page (give it a `parent`): the parent's page lists its
 * sub-themes and every paper in them, and the sub-themes' breadcrumbs pass through it.
 */
export interface ThemeGroup {
  /** The group's heading, e.g. "Body and Health". Optional with a parent, whose title is the default. */
  title?: string;
  /** theme_key of the parent theme (a file in themes/), whose page heads the group. */
  parent?: string;
  /** theme_keys of the group's themes (sub-themes, for a parent), in reading order. */
  themes: readonly string[];
}

export interface SiteConfig {
  title: string;
  /** Tagline: the home page banner, the feed and the WebSite structured data. */
  description: string;
  /** Canonical origin, no trailing slash, e.g. 'https://contemplativeneuroscience.com'. */
  url: string;
  /** Logo (in the site's public/), used in structured data, share cards and as the compact social card. */
  logo: string;
  /** The home page banner image. */
  cover: string;
  /** The year the site started, for the footer's copyright line. */
  since: number;
  author: string;
  authorImage: string;
  /** The author's other profiles (schema.org sameAs). */
  authorProfiles: readonly string[];
  /** One-line author bio for structured data (matches the About page). */
  authorBio: string;
  /** Topics the author writes about (schema.org knowsAbout). */
  authorKnowsAbout: readonly string[];
  /** "Start here" papers on the home and 404 pages (post slugs; about four); an unknown slug fails the build. Empty hides them. */
  startHere: readonly string[];
  /**
   * Every theme, grouped, in reading order (home page, Research Themes, 404 page). Each theme
   * appears exactly once, as a parent or in a group's `themes`; anything else fails the build.
   */
  themeGroups: readonly ThemeGroup[];
  /** Google Analytics measurement ID (gtag.js); without one the pages carry no analytics. */
  analyticsId?: string;
  /** Email list (MailerLite). */
  newsletter: {
    /** Appears beside every sign-up form. */
    promise: string;
    /**
     * From MailerLite's embed code: the account number, the form's numeric id and its long key.
     * Without it the sign-up boxes are left out (the /subscribe/ page and its links stay).
     */
    mailerlite?: { account: string; formId: string; formKey: string };
  };
  menuItems: readonly { title: string; url: string }[];
  /**
   * Brand colours, compiled into the stylesheets as $color-<key> (src/styles/_variables.sass)
   * and used on the share cards. Text colours must meet WCAG AA (4.5:1) on white.
   */
  colors: {
    /** Borders, backgrounds and buttons. */
    primary: string;
    /** `primary` darkened for text. */
    'primary-text': string;
    'primary-dark': string;
    /** Card and hover backgrounds. */
    'primary-light': string;
    'primary-lighter': string;
    'primary-border': string;
    /** Hover border on glossary entries. */
    'primary-border-hover': string;
    accent: string;
    /** Glossary tooltip background. */
    'tooltip-bg': string;
    /** The slim bar at the top of every page but the home page. */
    'site-bar-bg': string;
  };
  /** Wording that names the site's subject, page by page. */
  copy: {
    /** Home page meta description. */
    homeDescription: string;
    /** Home page opening paragraph. */
    homeLede: string;
    /** Follows "Written by <author>, " on the home page. */
    homeAuthor: string;
    allPapersDescription: string;
    themesDescription: string;
    /** Opening paragraph of Research Themes. */
    themesIntro: string;
    /** Search box placeholders: All Papers and the 404 page. */
    allPapersSearchPlaceholder: string;
    notFoundSearchPlaceholder: string;
    glossaryDescription: string;
    /** Appended to a glossary term's name for its <title>, e.g. "in Meditation Research". */
    glossaryTermTitleSuffix: string;
    subscribeDescription: string;
    /** Opening paragraph of the /subscribe/ page. */
    subscribeLede: string;
    /** The summary line under the title in /llms.txt. */
    llmsSummary: string;
  };
}
