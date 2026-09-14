export type MediaType = 'movie' | 'tv';

export type Category = 'all' | 'movie' | 'tv' | 'anime' | 'asian';

export type TrendingWindow = 'day' | 'week' | 'month';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  stillPath?: string;
  airDate?: string;
  voteAverage?: number;
  durationMinutes?: number;
}

export interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  episodes?: Episode[];
}

export interface MediaItem {
  id: number;
  tmdbId: number;
  imdbId?: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  mediaType: MediaType;
  category: Category;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: string[];
  durationMinutes?: number;
  tagline?: string;
  status?: string;
  trailerYoutubeKey?: string;
  cast?: CastMember[];
  seasons?: Season[];
  totalSeasons?: number;
  totalEpisodes?: number;
}

export interface StreamServer {
  id: string;
  name: string;
  tag: string;
  speed: 'Ultra' | 'Fast' | 'Normal';
  quality: '4K HDR' | '1080p HD' | 'Auto';
  hasSubtitles: boolean;
  getUrl: (media: MediaItem, season?: number, episode?: number) => string;
}

export interface WatchProgress {
  mediaId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  backdropPath: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  percentageWatched: number;
  lastUpdated: number;
}

export interface MediaCatalogResponse {
  trendingDay: MediaItem[];
  trendingWeek: MediaItem[];
  nowPlaying: MediaItem[];
  popularMovies: MediaItem[];
  popularTV: MediaItem[];
  anime: MediaItem[];
  asian: MediaItem[];
  all: MediaItem[];
}
