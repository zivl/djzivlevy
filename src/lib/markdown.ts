// Markdown renderings of the site for AI agents: per-page twins (/epk.md …),
// /llms.txt and /llms-full.txt. Built from the same data + i18n as the HTML.
import { gallery, logos } from '../data/gallery';
import { pastGigs, upcomingGigs, type Gig } from '../data/gigs';
import { music } from '../data/music';
import { LOCALES, SITE_URL, profile, type Locale } from '../data/profile';
import { rider } from '../data/rider';
import { socials } from '../data/socials';
import { clockDuration, videos, watchUrl } from '../data/videos';
import { absoluteUrl, fill, formatGigDate, localizePath, markdownPath, t } from '../i18n/utils';

const lines = (...parts: (string | false | undefined)[]): string => parts.filter((p) => p !== false && p !== undefined).join('\n');

function gigLine(g: Gig, lang: Locale): string {
  const d = t(lang);
  const when = `${formatGigDate(g.date, lang)}${g.time ? ` ${g.time}` : ''}`;
  const what = [g.eventName, g.venue, `${g.city}, ${g.country}`].filter(Boolean).join(' – ');
  return `- ${when}: ${what}${g.ticketUrl ? ` ([${d.gigs.tickets}](${g.ticketUrl}))` : ''}`;
}

function musicSection(lang: Locale): string {
  const d = t(lang);
  return lines(
    `## ${d.sections.music}`,
    '',
    d.sections.musicLead,
    '',
    `- [Spotify](${music.spotifyArtistUrl})`,
    `- [Apple Music](${music.appleMusicUrl})`,
    music.tidalUrl !== '' && `- [TIDAL](${music.tidalUrl})`,
    `- [YouTube](${music.youtubeChannel})`,
  );
}

function setsSection(lang: Locale, onlyFeatured: boolean): string {
  const d = t(lang);
  const list = videos.filter((v) => !onlyFeatured || v.featured);
  return lines(
    `## ${onlyFeatured ? d.sections.featured : d.sections.sets}`,
    '',
    ...list.map((v) => `- [${v.title}](${watchUrl(v.id)}) (${clockDuration(v.seconds)}, ${v.uploadDate.slice(0, 10)})`),
  );
}

function gigsSection(lang: Locale, includePast: boolean): string {
  const d = t(lang);
  const up = upcomingGigs();
  const past = includePast ? pastGigs() : [];
  return lines(
    `## ${d.sections.gigs}`,
    '',
    up.length ? up.map((g) => gigLine(g, lang)).join('\n') : d.sections.noGigs,
    '',
    `Calendar feed (iCal): ${SITE_URL}/gigs.ics`,
    past.length > 0 && `\n### ${d.sections.pastGigs}\n\n${past.map((g) => gigLine(g, lang)).join('\n')}`,
  );
}

function bookingSection(lang: Locale): string {
  const d = t(lang);
  return lines(
    `## ${d.sections.booking}`,
    '',
    d.booking.lead,
    '',
    `- WhatsApp: [+${profile.contact.whatsappNumber}](${profile.contact.whatsappUrl})`,
    `- Instagram DM: [@${profile.contact.instagramHandle}](${profile.contact.instagramDmUrl})`,
    `- ${d.booking.email}: ${profile.contact.email}`,
  );
}

function riderSection(lang: Locale): string {
  const d = t(lang);
  const fmt = (i: (typeof rider.booth)[number] | (typeof rider.monitoring)[number]) =>
    'gear' in i ? `- ${i.gear} ${d.rider.orHigher}` : `- ${d.rider.items[i.item]}`;
  return lines(
    `## ${d.sections.rider}`,
    '',
    `### ${d.rider.booth}`,
    ...rider.booth.map(fmt),
    '',
    `### ${d.rider.monitoring}`,
    ...rider.monitoring.map(fmt),
    '',
    `_${d.rider.note}_`,
  );
}

function assetsSection(lang: Locale, epkHtmlUrl: string): string {
  const d = t(lang);
  return lines(
    `## ${d.sections.assets}`,
    '',
    ...logos.map((l) => `- [${d.assets[l.key]}](${absoluteUrl(l.href)})`),
    `- ${d.sections.gallery}: ${gallery.filter((p) => p.downloadable).length} photos at ${epkHtmlUrl}#gallery`,
  );
}

function faqSection(lang: Locale): string {
  const d = t(lang);
  return lines(`## ${d.sections.faq}`, '', ...d.faq.flatMap(({ q, a }) => [`### ${q}`, '', fill(a), '']));
}

function languagesLine(path: string, current: Locale): string {
  return LOCALES.filter((l) => l !== current)
    .map((l) => `[${t(l).langName}](${absoluteUrl(markdownPath(path, l))})`)
    .join(' · ');
}

export function homeMarkdown(lang: Locale): string {
  const d = t(lang);
  return lines(
    `# ${profile.name}`,
    '',
    `> ${d.summary}`,
    '',
    d.intro,
    '',
    `**${d.specializing}:** ${profile.genres.join(', ')}`,
    '',
    '## Links',
    '',
    ...socials.map((s) => `- [${s.label}](${s.url})`),
    `- [${d.cta.pressKit}](${absoluteUrl(localizePath('/epk', lang))}) ([Markdown](${absoluteUrl(markdownPath('/epk', lang))}))`,
    '',
    gigsSection(lang, false),
    '',
    musicSection(lang),
    '',
    setsSection(lang, false),
    '',
    bookingSection(lang),
    '',
    '---',
    `HTML: ${absoluteUrl(localizePath('/', lang))} · ${languagesLine('/', lang)}`,
    '',
  );
}

export function epkMarkdown(lang: Locale): string {
  const d = t(lang);
  const html = absoluteUrl(localizePath('/epk', lang));
  return lines(
    `# ${profile.name} – ${d.cta.pressKit}`,
    '',
    `> ${d.summary}`,
    '',
    `**Genres:** ${profile.epkGenres.join(' / ')}`,
    `**Based in:** ${profile.location.city}, ${profile.location.country}`,
    '',
    `## ${d.sections.vibe}`,
    '',
    d.bio,
    '',
    setsSection(lang, true),
    '',
    musicSection(lang),
    '',
    gigsSection(lang, true),
    '',
    riderSection(lang),
    '',
    assetsSection(lang, html),
    '',
    faqSection(lang),
    bookingSection(lang),
    '',
    '---',
    `HTML: ${html} · ${languagesLine('/epk', lang)}`,
    '',
  );
}

export function llmsTxt(): string {
  const d = t('en');
  return lines(
    `# ${profile.name}`,
    '',
    `> ${d.summary} Book him via WhatsApp (+${profile.contact.whatsappNumber}), Instagram DM (@${profile.contact.instagramHandle}) or email (${profile.contact.email}).`,
    '',
    `${profile.name} (Ziv Levy) blends techno, melodic techno and progressive house with a deep dark-80s side – synthwave, EBM, post-punk, cold wave and gothic. This site is his official link page and electronic press kit, available in English, German, French, Spanish and Portuguese.`,
    '',
    '## Pages',
    '',
    `- [Links page](${absoluteUrl('/index.md')}): bio summary, social profiles, DJ sets, music and booking contacts`,
    `- [Press kit](${absoluteUrl('/epk.md')}): bio, featured mixes, technical rider, press assets, FAQ`,
    `- [Full site content](${absoluteUrl('/llms-full.txt')}): everything above in a single Markdown file`,
    '',
    '## Data',
    '',
    `- [Artist profile (JSON)](${absoluteUrl('/artist.json')}): schema.org-shaped profile with genres, links, contacts and rider`,
    `- [Gigs (JSON)](${absoluteUrl('/gigs.json')}): upcoming and recent gigs`,
    `- [Gigs calendar (iCal)](${absoluteUrl('/gigs.ics')}): subscribable feed of upcoming gigs`,
    '',
    '## Music',
    '',
    `- [Spotify](${music.spotifyArtistUrl}): original releases`,
    `- [Apple Music](${music.appleMusicUrl}): original releases`,
    music.tidalUrl !== '' && `- [TIDAL](${music.tidalUrl}): original releases`,
    `- [YouTube](${music.youtubeChannel}): full-length DJ sets`,
    '',
    '## Languages',
    '',
    ...LOCALES.filter((l) => l !== 'en').map(
      (l) => `- ${t(l).langName}: [links](${absoluteUrl(markdownPath('/', l))}), [press kit](${absoluteUrl(markdownPath('/epk', l))})`,
    ),
    '',
    '## Optional',
    '',
    `- [Terms of Use](${absoluteUrl('/terms.md')})`,
    `- [Privacy Policy](${absoluteUrl('/privacy.md')})`,
    `- [Accessibility Statement](${absoluteUrl('/accessibility.md')})`,
    `- [Accessibility Test Results](${absoluteUrl('/accessibility-test-results.md')})`,
    '',
  );
}

export function llmsFullTxt(): string {
  const d = t('en');
  return lines(
    `# ${profile.name}`,
    '',
    `> ${d.summary}`,
    '',
    `Official website: ${absoluteUrl('/')} · Press kit: ${absoluteUrl('/epk')}`,
    '',
    `**Genres:** ${[...new Set([...profile.genres, ...profile.epkGenres])].join(', ')}`,
    `**Based in:** ${profile.location.city}, ${profile.location.country}`,
    '',
    `## ${d.sections.vibe}`,
    '',
    d.bio,
    '',
    d.intro,
    '',
    '## Profiles',
    '',
    ...socials.map((s) => `- [${s.label}](${s.url})`),
    '',
    setsSection('en', false),
    '',
    musicSection('en'),
    '',
    gigsSection('en', true),
    '',
    riderSection('en'),
    '',
    assetsSection('en', absoluteUrl('/epk')),
    '',
    faqSection('en'),
    bookingSection('en'),
    '',
  );
}
