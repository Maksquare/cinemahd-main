import { MediaItem, StreamServer } from '@/types/media';

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'vidsrc',
    name: 'Vidsrc VIP',
    tag: 'Primary Stream Server (Cinebloom Primary)',
    speed: 'Ultra',
    quality: '4K HDR',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrcme.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://vidsrcme.ru/embed/movie?tmdb=${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc.to',
    tag: 'VidSrc Direct HD',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    tag: 'MultiEmbed (10+ Built-in Mirrors)',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
    },
  },
  {
    id: 'videasy',
    name: 'Videasy',
    tag: 'Videasy Player CDN',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://player.videasy.to/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://player.videasy.to/movie/${tmdbId}`;
    },
  },
  {
    id: '2embed',
    name: '2Embed',
    tag: '2Embed High Speed',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
      }
      return `https://www.2embed.cc/embed/${tmdbId}`;
    },
  },
  {
    id: '111movies',
    name: '111movies',
    tag: '111movies Cloud',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://111movies.net/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://111movies.net/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidrock',
    name: 'Vidrock',
    tag: 'Vidrock HD Mirror',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidrock.net/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidrock.net/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidnest',
    name: 'Vidnest',
    tag: 'Vidnest Stream',
    speed: 'Normal',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidnest.fun/movie/${tmdbId}`;
    },
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    tag: 'SmashyStream Fast Cloud',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://player.smashystream.com/tv/${tmdbId}?s=${season}&e=${episode}`;
      }
      return `https://player.smashystream.com/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc.me',
    tag: 'VidSrc.me Mirror',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-in',
    name: 'VidSrc.in',
    tag: 'VidSrc.in Mirror',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.in/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://vidsrc.in/embed/movie?tmdb=${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-pm',
    name: 'VidSrc.pm',
    tag: 'VidSrc.pm Mirror',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.pm/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://vidsrc.pm/embed/movie?tmdb=${tmdbId}`;
    },
  },
];

export function getEmbedUrl(
  serverId: string,
  media: MediaItem,
  season = 1,
  episode = 1
): string {
  const server = STREAM_SERVERS.find((s) => s.id === serverId) || STREAM_SERVERS[0];
  return server.getUrl(media, season, episode);
}
