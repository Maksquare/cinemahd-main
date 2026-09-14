/**
 * TMDb API Client — Implementation Spec Compliance
 * Base URL: https://api.themoviedb.org/3
 * Supports Bearer token (v4) and API Key (v3) authentication
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_TMDB_KEY = '2dca580c2a14b55200e784d157207b4d';

export interface TMDbWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface TMDbWatchProviderRegion {
  link: string;
  flatrate?: TMDbWatchProvider[];
  rent?: TMDbWatchProvider[];
  buy?: TMDbWatchProvider[];
}

export interface TMDbWatchProvidersResponse {
  id: number;
  results: Record<string, TMDbWatchProviderRegion>;
}

export interface TMDbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDbCredit {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface TMDbMovieItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type?: string;
  genre_ids?: number[];
  original_language?: string;
}

function getAuthHeaders(): HeadersInit {
  const token =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    DEFAULT_TMDB_KEY;

  if (!token) return {};

  // If token is a JWT Bearer token (v4)
  if (token.length > 50) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  return {
    'Content-Type': 'application/json',
  };
}

function getAuthUrl(endpoint: string, queryParams: Record<string, string | number> = {}): string {
  const token =
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    DEFAULT_TMDB_KEY;

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // If standard v3 API key, append to query param
  if (token && token.length <= 50) {
    url.searchParams.set('api_key', token);
  }

  Object.entries(queryParams).forEach(([key, val]) => {
    url.searchParams.set(key, String(val));
  });

  return url.toString();
}

/**
 * Fetch with exponential backoff retry and Next.js revalidation cache
 */
async function fetchWithRetry<T>(url: string, retries = 2): Promise<T | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: getAuthHeaders(),
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      if (res.status === 404) return null;
      if (res.status === 401) {
        console.warn(`TMDb 401 at ${url}, retrying with default key...`);
        if (!url.includes(DEFAULT_TMDB_KEY)) {
          const retryUrl = new URL(url);
          retryUrl.searchParams.set('api_key', DEFAULT_TMDB_KEY);
          const fallbackRes = await fetch(retryUrl.toString());
          if (fallbackRes.ok) return (await fallbackRes.json()) as T;
        }
        return null;
      }
    } catch (err) {
      if (i === retries) {
        console.error(`TMDb fetch failed for ${url}:`, err);
        return null;
      }
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, i)));
    }
  }
  return null;
}

export const tmdb = {
  // 1. Trending
  async getTrending(timeWindow: 'day' | 'week' = 'day', type: 'all' | 'movie' | 'tv' = 'all') {
    const url = getAuthUrl(`/trending/${type}/${timeWindow}`);
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 2. Popular
  async getPopular(type: 'movie' | 'tv' = 'movie', page = 1) {
    const url = getAuthUrl(`/${type}/popular`, { page });
    return fetchWithRetry<{ results: TMDbMovieItem[]; total_pages: number }>(url);
  },

  // 3. Now Playing Movies
  async getNowPlaying(page = 1) {
    const url = getAuthUrl('/movie/now_playing', { page });
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 4. Anime Discovery
  async getAnime(page = 1) {
    const url = getAuthUrl('/discover/tv', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page,
    });
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 5. Asian Drama Discovery
  async getAsianDrama(page = 1) {
    const url = getAuthUrl('/discover/tv', {
      with_original_language: 'ko',
      sort_by: 'popularity.desc',
      page,
    });
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 6. Search Movies & TV
  async search(query: string, page = 1) {
    const url = getAuthUrl('/search/multi', { query, page, include_adult: 'false' });
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 7. Details with Appended Extra Responses
  async getDetails(id: number, type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/${type}/${id}`, {
      append_to_response: 'credits,videos,similar,watch/providers',
    });
    return fetchWithRetry<any>(url);
  },

  // 8. TV Season & Episodes
  async getSeason(tvId: number, seasonNumber: number) {
    const url = getAuthUrl(`/tv/${tvId}/season/${seasonNumber}`);
    return fetchWithRetry<any>(url);
  },

  // 9. Watch Providers by Country
  async getWatchProviders(id: number, type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/${type}/${id}/watch/providers`);
    return fetchWithRetry<TMDbWatchProvidersResponse>(url);
  },

  // 10. Credits (Cast & Crew)
  async getCredits(id: number, type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/${type}/${id}/credits`);
    return fetchWithRetry<{ cast: TMDbCredit[]; crew: any[] }>(url);
  },

  // 11. Videos / Official Trailers
  async getVideos(id: number, type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/${type}/${id}/videos`);
    return fetchWithRetry<{ results: TMDbVideo[] }>(url);
  },

  // 12. Similar Titles
  async getSimilar(id: number, type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/${type}/${id}/similar`);
    return fetchWithRetry<{ results: TMDbMovieItem[] }>(url);
  },

  // 13. Genres List
  async getGenres(type: 'movie' | 'tv' = 'movie') {
    const url = getAuthUrl(`/genre/${type}/list`);
    return fetchWithRetry<{ genres: { id: number; name: string }[] }>(url);
  },
};
