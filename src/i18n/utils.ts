import { DEFAULT_LOCALE, LOCALES, SITE_URL, profile, type Locale } from '../data/profile';
import { de } from './de';
import { en, type Dict } from './en';
import { es } from './es';
import { fr } from './fr';
import { pt } from './pt';

const dictionaries: Record<Locale, Dict> = { en, de, fr, es, pt };

export function t(lang: Locale): Dict {
  return dictionaries[lang];
}

/** Replace {email}, {platform}, {year}… placeholders. */
export function fill(text: string, vars: Record<string, string> = {}): string {
  const all: Record<string, string> = { email: profile.contact.email, year: String(new Date().getFullYear()), ...vars };
  return text.replace(/\{(\w+)\}/g, (m, key: string) => all[key] ?? m);
}

/** '/epk' + 'de' → '/de/epk'; '/' + 'de' → '/de'; English stays unprefixed. */
export function localizePath(path: string, lang: Locale): string {
  if (lang === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

/** '/' → 'https://djzivlevy.com/', '/de/epk' → 'https://djzivlevy.com/de/epk' (matches the sitemap). */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).href;

/** Markdown twin path for a page path: '/' → '/index.md', '/de' → '/de/index.md', '/de/epk' → '/de/epk.md'. */
export function markdownPath(path: string, lang: Locale): string {
  const localized = localizePath(path, lang);
  if (path === '/') return lang === DEFAULT_LOCALE ? '/index.md' : `/${lang}/index.md`;
  return `${localized}.md`;
}

/** getStaticPaths helper for src/pages/[...lang]/… routes. */
export function localeStaticPaths() {
  return LOCALES.map((lang) => ({
    params: { lang: lang === DEFAULT_LOCALE ? undefined : lang },
    props: { lang },
  }));
}

export function formatGigDate(date: string, lang: Locale): string {
  return new Intl.DateTimeFormat(t(lang).intl, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export { LOCALES, DEFAULT_LOCALE, type Locale };
