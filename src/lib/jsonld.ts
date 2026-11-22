// schema.org JSON-LD builders. Every page emits one @graph whose nodes reference
// each other by @id, so search engines and AI crawlers see a single connected entity.
import { gigStartIso, type Gig } from '../data/gigs';
import { SITE_URL, profile, type Locale } from '../data/profile';
import { sameAs } from '../data/socials';
import { embedUrl, isoDuration, publicThumbUrl, watchUrl, type Video } from '../data/videos';
import { absoluteUrl, fill, localizePath, t } from '../i18n/utils';

type Node = Record<string, unknown>;

export const ids = {
  artist: `${SITE_URL}/#artist`,
  website: `${SITE_URL}/#website`,
};

export function artistNode(lang: Locale, imageUrl: string): Node {
  const d = t(lang);
  return {
    '@type': ['MusicGroup', 'Person'],
    '@id': ids.artist,
    name: profile.name,
    alternateName: profile.alternateName,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: 'DJ',
    description: d.summary,
    url: SITE_URL,
    image: imageUrl,
    genre: [...new Set([...profile.genres, ...profile.epkGenres])],
    homeLocation: {
      '@type': 'Place',
      name: `${profile.location.city}, ${profile.location.country}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.location.city,
        addressCountry: profile.location.countryCode,
      },
    },
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'booking',
        email: profile.contact.email,
        telephone: `+${profile.contact.whatsappNumber}`,
        url: profile.contact.whatsappUrl,
        availableLanguage: ['English', 'Hebrew'],
      },
    ],
  };
}

export function websiteNode(lang: Locale): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: SITE_URL,
    name: profile.name,
    inLanguage: ['en', 'de', 'fr', 'es', 'pt'],
    publisher: { '@id': ids.artist },
    description: t(lang).summary,
  };
}

export function webPageNode(opts: { lang: Locale; path: string; title: string; description: string; type?: string; breadcrumb?: boolean }): Node {
  const url = absoluteUrl(localizePath(opts.path, opts.lang));
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.artist },
    ...(opts.type === 'ProfilePage' ? { mainEntity: { '@id': ids.artist } } : {}),
    ...(opts.breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

export function breadcrumbNode(lang: Locale, path: string, name: string): Node {
  const url = absoluteUrl(localizePath(path, lang));
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t(lang).nav.home, item: absoluteUrl(localizePath('/', lang)) },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
}

export function videoNode(v: Video): Node {
  return {
    '@type': 'VideoObject',
    '@id': `${watchUrl(v.id)}#video`,
    name: v.title,
    description: `${v.title} – DJ set by ${profile.name}.`,
    thumbnailUrl: [publicThumbUrl(v.id)],
    uploadDate: v.uploadDate,
    duration: isoDuration(v.seconds),
    embedUrl: embedUrl(v.id).replace('youtube-nocookie.com', 'youtube.com'),
    url: watchUrl(v.id),
    author: { '@id': ids.artist },
  };
}

export function eventNode(g: Gig, imageUrl: string): Node {
  return {
    '@type': 'MusicEvent',
    name: g.eventName ? `${g.eventName} – ${profile.name}` : `${profile.name} at ${g.venue}`,
    startDate: gigStartIso(g),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [imageUrl],
    location: {
      '@type': 'Place',
      name: g.venue,
      address: {
        '@type': 'PostalAddress',
        ...(g.address ? { streetAddress: g.address } : {}),
        addressLocality: g.city,
        addressCountry: g.country,
      },
    },
    performer: { '@id': ids.artist },
    organizer: { '@type': 'Organization', name: g.venue },
    ...(g.ticketUrl ? { offers: { '@type': 'Offer', url: g.ticketUrl, availability: 'https://schema.org/InStock' } } : {}),
  };
}

export function faqNode(lang: Locale, path: string): Node {
  const url = absoluteUrl(localizePath(path, lang));
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: lang,
    mainEntity: t(lang).faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: fill(a) },
    })),
  };
}

export function graph(nodes: Node[]): string {
  // `<` is escaped so a value can never close the <script> tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
