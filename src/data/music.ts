// Ziv's own releases. Leave a URL empty ('') to hide that platform everywhere.
const spotifyArtistId = '25vfaDRLUEWdx6UAiLm8wy';

export interface Music {
  readonly spotifyArtistId: string;
  readonly spotifyArtistUrl: string;
  readonly spotifyEmbedUrl: string;
  readonly appleMusicUrl: string;
  readonly tidalUrl: string;
  readonly youtubeChannel: string;
}

export const music: Music = {
  spotifyArtistId,
  spotifyArtistUrl: `https://open.spotify.com/artist/${spotifyArtistId}`,
  spotifyEmbedUrl: `https://open.spotify.com/embed/artist/${spotifyArtistId}?theme=0`,
  appleMusicUrl: 'https://music.apple.com/il/artist/ziv-levy/6831382158',
  tidalUrl: 'https://tidal.com/@djzivlevy',
  youtubeChannel: 'https://www.youtube.com/@djzivlevy',
};
