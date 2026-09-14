import { NextResponse } from 'next/server';
import { tmdb, TMDbMovieItem } from '@/lib/tmdb-client';
import { Category, MediaItem, MediaCatalogResponse } from '@/types/media';

interface CacheData extends MediaCatalogResponse {
  items: MediaItem[];
}

let cachedCatalog: CacheData | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes cache

// Genre mapping dictionary
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

function formatItem(
  item: TMDbMovieItem,
  mediaType: 'movie' | 'tv',
  category: Category
): MediaItem {
  const title = item.title || item.name || 'Untitled';
  const releaseDate = item.release_date || item.first_air_date || '2026-01-01';
  const genres = (item.genre_ids || [])
    .map((id) => GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3);

  if (category === 'anime' && !genres.includes('Anime')) genres.unshift('Anime');
  if (category === 'asian' && !genres.includes('Asian Drama')) genres.unshift('Asian Drama');

  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

  const backdrop = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : poster;

  return {
    id: item.id,
    tmdbId: item.id,
    title,
    originalTitle: title,
    overview:
      item.overview ||
      `${title} is a ${category === 'tv' ? 'series' : 'movie'} released in ${
        releaseDate.split('-')[0]
      }. Stream in full 4K Ultra HD on CinemaHD.`,
    posterPath: poster,
    backdropPath: backdrop,
    mediaType,
    category,
    releaseDate,
    voteAverage: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.0,
    voteCount: item.vote_count || 500,
    genres: genres.length > 0 ? genres : [mediaType === 'tv' ? 'TV Series' : 'Action'],
    status: 'Released',
    durationMinutes: mediaType === 'movie' ? 120 : undefined,
  };
}

export async function GET() {
  const now = Date.now();
  if (cachedCatalog && now - cacheTime < CACHE_TTL_MS) {
    return NextResponse.json({
      ...cachedCatalog,
      source: 'cache',
    });
  }

  try {
    // Concurrently fetch authentic rails from TMDb in parallel
    const [
      trendingDayRes,
      trendingWeekRes,
      nowPlayingRes,
      popularMoviesRes,
      popularTVRes,
      animeRes,
      asianRes,
    ] = await Promise.all([
      tmdb.getTrending('day', 'all'),
      tmdb.getTrending('week', 'all'),
      tmdb.getNowPlaying(1),
      tmdb.getPopular('movie', 1),
      tmdb.getPopular('tv', 1),
      tmdb.getAnime(1),
      tmdb.getAsianDrama(1),
    ]);

    const trendingDay = (trendingDayRes?.results || []).map((m) =>
      formatItem(m, m.media_type === 'tv' ? 'tv' : 'movie', m.media_type === 'tv' ? 'tv' : 'movie')
    );

    const trendingWeek = (trendingWeekRes?.results || []).map((m) =>
      formatItem(m, m.media_type === 'tv' ? 'tv' : 'movie', m.media_type === 'tv' ? 'tv' : 'movie')
    );

    const nowPlaying = (nowPlayingRes?.results || []).map((m) =>
      formatItem(m, 'movie', 'movie')
    );

    const popularMovies = (popularMoviesRes?.results || []).map((m) =>
      formatItem(m, 'movie', 'movie')
    );

    const popularTV = (popularTVRes?.results || []).map((t) =>
      formatItem(t, 'tv', 'tv')
    );

    const anime = (animeRes?.results || []).map((a) =>
      formatItem(a, 'tv', 'anime')
    );

    const asian = (asianRes?.results || []).map((as) =>
      formatItem(as, 'tv', 'asian')
    );

    // Build unique complete catalog map preserving rank priority
    const allMap = new Map<number, MediaItem>();
    [
      ...trendingDay,
      ...nowPlaying,
      ...popularMovies,
      ...popularTV,
      ...trendingWeek,
      ...anime,
      ...asian,
    ].forEach((item) => {
      if (!allMap.has(item.id)) {
        allMap.set(item.id, item);
      }
    });

    const all = Array.from(allMap.values());

    const catalogData: CacheData = {
      trendingDay,
      trendingWeek,
      nowPlaying,
      popularMovies,
      popularTV,
      anime,
      asian,
      all,
      items: all,
    };

    cachedCatalog = catalogData;
    cacheTime = now;

    return NextResponse.json({
      ...catalogData,
      count: all.length,
      source: 'tmdb_live',
    });
  } catch (err: any) {
    console.error('Failed to fetch live media from TMDb:', err);
  }

  // Fallback to cache if available
  if (cachedCatalog) {
    return NextResponse.json({
      ...cachedCatalog,
      source: 'stale_cache',
    });
  }

  return NextResponse.json({ items: [], count: 0, error: 'Failed to fetch catalog' }, { status: 500 });
}
