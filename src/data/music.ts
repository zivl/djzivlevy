// Ziv's own releases. Leave a URL empty ('') to hide that platform everywhere.
const spotifyArtistId = '25vfaDRLUEWdx6UAiLm8wy';

export const music = {
  spotifyArtistId,
  spotifyArtistUrl: `https://open.spotify.com/artist/${spotifyArtistId}`,
  spotifyEmbedUrl: `https://open.spotify.com/embed/artist/${spotifyArtistId}?theme=0`,
  appleMusicUrl: 'https://music.apple.com/il/artist/ziv-levy/6831382158',
  // TODO(Ziv): paste your TIDAL artist URL here, e.g. 'https://tidal.com/artist/12345678'
  tidalUrl: '',
  youtubeChannel: 'https://www.youtube.com/@djzivlevy',
} as const;
