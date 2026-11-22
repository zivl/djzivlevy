// Language-neutral facts about the artist. Translated copy lives in src/i18n/.
export const SITE_URL = 'https://djzivlevy.com';

export const profile = {
  name: 'DJ Ziv Levy',
  alternateName: ['djzivlevy', 'Ziv Levy'],
  givenName: 'Ziv',
  familyName: 'Levy',
  /** Genres as shown on the link page (order matters). */
  genres: ['Techno', 'Progressive', "Dark 80's", 'Synthwave', 'Gothic', 'Post Punk', "80's", 'EBM', 'Psy'],
  /** Shorter genre line used on the press kit. */
  epkGenres: ['EBM', 'Industrial', "Dark 80's", 'Synthwave', 'Techno', 'Progressive House'],
  location: { city: 'Tel Aviv', region: 'Tel Aviv District', country: 'Israel', countryCode: 'IL' },
  contact: {
    whatsappNumber: '972547442720',
    whatsappUrl: 'https://api.whatsapp.com/send?phone=972547442720',
    instagramHandle: 'djzivlevy',
    instagramDmUrl: 'https://ig.me/m/djzivlevy',
    email: 'levi.ziv@gmail.com',
  },
} as const;

export type Locale = 'en' | 'de' | 'fr' | 'es' | 'pt';
export const LOCALES: readonly Locale[] = ['en', 'de', 'fr', 'es', 'pt'];
export const DEFAULT_LOCALE: Locale = 'en';
