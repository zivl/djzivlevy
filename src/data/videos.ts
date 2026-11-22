import type { ImageMetadata } from 'astro';

export interface Video {
  id: string;
  title: string;
  /** ISO 8601 publish date (from YouTube) — used in VideoObject structured data. */
  uploadDate: string;
  /** Length in seconds. */
  seconds: number;
  /** Featured sets also appear in the press kit. */
  featured: boolean;
}

// Newest first. Thumbnails live in src/assets/videos/<id>.jpg
export const videos: Video[] = [
  { id: 'e4eWc-FKpYY', title: "DJ Ziv Levy - Dark Desires: Synthwave, Post Punk, EBM, and Dark 80's", uploadDate: '2026-03-14T14:20:31-07:00', seconds: 2186, featured: true },
  { id: 'RC89x5xi9eI', title: 'Dj Ziv Levy - Dark 80s / Dark Disco / Synthwave / Electronic / Goth', uploadDate: '2025-11-09T09:53:33-08:00', seconds: 2923, featured: true },
  { id: 'c6EbQqAUCdU', title: 'DJ Ziv Levy - Melodic Techno Live at Zeppelin Party', uploadDate: '2025-08-13T12:58:51-07:00', seconds: 3635, featured: true },
  { id: 'kGCewQeXh4E', title: 'DJ Ziv Levy - Dark 80s / Synth Pop / EBM / Dark Wave', uploadDate: '2024-01-11T23:51:11-08:00', seconds: 3143, featured: false },
  { id: 'o3m3ftzXN14', title: 'DJ Ziv Levy - Dark 80’s / EBM / Cold Wave / Dark Cave / Synth', uploadDate: '2023-08-17T11:57:16-07:00', seconds: 2798, featured: false },
  { id: 'jf7wzCPpRsQ', title: 'DJ Ziv Levy - Melodic Techno / Progressive House', uploadDate: '2023-03-23T11:45:31-07:00', seconds: 2990, featured: false },
  { id: '4BD_Js4jDI4', title: 'DJ Ziv Levy - Synth Pop / New Beat / Dark 80s', uploadDate: '2022-09-22T07:28:23-07:00', seconds: 2408, featured: false },
];

const thumbs = import.meta.glob<{ default: ImageMetadata }>('../assets/videos/*.jpg', { eager: true });

export function thumbnailFor(id: string): ImageMetadata {
  const mod = thumbs[`../assets/videos/${id}.jpg`];
  if (!mod) throw new Error(`Missing thumbnail src/assets/videos/${id}.jpg`);
  return mod.default;
}

export const watchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`;
export const embedUrl = (id: string): string => `https://www.youtube-nocookie.com/embed/${id}`;
export const publicThumbUrl = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** 2186 → "PT36M26S" */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
}

/** 2186 → "36:26", 3635 → "1:00:35" */
export function clockDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}
