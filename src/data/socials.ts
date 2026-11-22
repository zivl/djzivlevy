import { music } from './music';
import { profile } from './profile';

export type SocialId = 'instagram' | 'youtube' | 'facebook' | 'whatsapp' | 'spotify' | 'appleMusic' | 'tidal';

export interface Social {
  id: SocialId;
  label: string;
  url: string;
}

/** Icons shown under the name on the link page, in this order. Empty URLs are skipped. */
export const socials: Social[] = (
  [
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/djzivlevy/' },
    { id: 'youtube', label: 'YouTube', url: music.youtubeChannel },
    { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/levi.ziv' },
    { id: 'whatsapp', label: 'WhatsApp', url: profile.contact.whatsappUrl },
    { id: 'spotify', label: 'Spotify', url: music.spotifyArtistUrl },
    { id: 'appleMusic', label: 'Apple Music', url: music.appleMusicUrl },
    { id: 'tidal', label: 'TIDAL', url: music.tidalUrl },
  ] satisfies Social[]
).filter((s) => s.url !== '');

/** Profiles that represent the same entity — used for JSON-LD `sameAs`. */
export const sameAs: string[] = socials.filter((s) => s.id !== 'whatsapp').map((s) => s.url);
