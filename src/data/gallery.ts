import type { ImageMetadata } from 'astro';
import avatar from '../assets/avatar.jpg';
import booth from '../assets/hero-booth.jpg';
import crowd from '../assets/hero-crowd.jpg';
import neonHall from '../assets/gallery/neon-hall.jpg';
import redDetail from '../assets/gallery/red-detail.jpg';

export type GalleryAltKey = 'portrait' | 'booth' | 'crowd' | 'neonHall' | 'redDetail';

export interface GalleryPhoto {
  image: ImageMetadata;
  altKey: GalleryAltKey;
  /** Offer the original file as a press download. */
  downloadable: boolean;
  /** Download file name. */
  fileName: string;
  /** Photographer credit, shown under the download link when set. */
  credit?: string;
}

// TODO(Ziv): add high-res press photos to src/assets/gallery/ and list them here (with credits).
export const gallery: GalleryPhoto[] = [
  { image: avatar, altKey: 'portrait', downloadable: true, fileName: 'dj-ziv-levy-portrait.jpg' },
  { image: booth, altKey: 'booth', downloadable: true, fileName: 'dj-ziv-levy-booth.jpg' },
  { image: neonHall, altKey: 'neonHall', downloadable: true, fileName: 'dj-ziv-levy-neon-hall.jpg' },
  { image: crowd, altKey: 'crowd', downloadable: true, fileName: 'dj-ziv-levy-crowd.jpg' },
  { image: redDetail, altKey: 'redDetail', downloadable: true, fileName: 'dj-ziv-levy-red.jpg' },
];

export const logos = [
  { key: 'logoBlack', href: '/press/logos/djzivlevy-logo-black.png', fileName: 'djzivlevy-logo-black.png', onDark: false },
  { key: 'logoWhite', href: '/press/logos/djzivlevy-logo-white.png', fileName: 'djzivlevy-logo-white.png', onDark: true },
] as const;
