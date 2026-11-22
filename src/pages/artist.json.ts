import type { APIRoute } from 'astro';
import { gallery, logos } from '../data/gallery';
import { music } from '../data/music';
import { profile } from '../data/profile';
import { rider } from '../data/rider';
import { videos, watchUrl } from '../data/videos';
import { absoluteUrl, t } from '../i18n/utils';
import { artistNode } from '../lib/jsonld';

// A machine-readable artist profile for booking agents and AI agents.
export const GET: APIRoute = () => {
  const d = t('en');
  const fmt = (i: (typeof rider.booth)[number] | (typeof rider.monitoring)[number]) =>
    'gear' in i ? `${i.gear} ${d.rider.orHigher}` : d.rider.items[i.item];
  const body = {
    '@context': 'https://schema.org',
    ...artistNode('en', absoluteUrl('/og/portrait.jpg')),
    bio: d.bio,
    booking: {
      whatsapp: profile.contact.whatsappUrl,
      instagramDm: profile.contact.instagramDmUrl,
      email: profile.contact.email,
    },
    music: {
      spotify: music.spotifyArtistUrl,
      appleMusic: music.appleMusicUrl,
      ...(music.tidalUrl ? { tidal: music.tidalUrl } : {}),
      youtube: music.youtubeChannel,
    },
    djSets: videos.map((v) => ({ title: v.title, url: watchUrl(v.id), uploadDate: v.uploadDate, durationSeconds: v.seconds })),
    technicalRider: {
      booth: rider.booth.map(fmt),
      monitoring: rider.monitoring.map(fmt),
      note: d.rider.note,
    },
    pressAssets: {
      logos: logos.map((l) => ({ name: d.assets[l.key], url: absoluteUrl(l.href) })),
      pressKit: absoluteUrl('/epk'),
      photos: absoluteUrl('/epk#gallery'),
      photoCount: gallery.filter((p) => p.downloadable).length,
    },
    gigs: absoluteUrl('/gigs.json'),
    calendar: absoluteUrl('/gigs.ics'),
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
