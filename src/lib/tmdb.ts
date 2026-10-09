import { Category, MediaItem, TrendingWindow, MediaCatalogResponse, Episode, Season } from '@/types/media';
import { tmdb, TMDbMovieItem } from './tmdb-client';
import { autoSyncMediaCatalogToDatabase } from './supabase/user-store';

// Genre mapping dictionary
export const GENRE_MAP: Record<number, string> = {
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

/**
 * Robust date parser for release dates (YYYY-MM-DD, YYYY, or ISO timestamps)
 */
export function parseReleaseDate(dateStr?: string): number {
  if (!dateStr) return 0;
  const timestamp = new Date(dateStr).getTime();
  if (!isNaN(timestamp)) return timestamp;
  const match = dateStr.match(/\b(\d{4})\b/);
  return match ? new Date(`${match[1]}-01-01`).getTime() : 0;
}

/**
 * Sorts any list of MediaItems chronologically
 * @param items Array of MediaItem
 * @param order 'desc' = Newest to oldest (default), 'asc' = Oldest to newest
 */
export function sortMediaChronologically(
  items: MediaItem[],
  order: 'desc' | 'asc' = 'desc'
): MediaItem[] {
  return [...items].sort((a, b) => {
    const timeA = parseReleaseDate(a.releaseDate);
    const timeB = parseReleaseDate(b.releaseDate);
    if (order === 'desc') {
      if (timeB !== timeA) return timeB - timeA;
      return (b.voteCount || 0) - (a.voteCount || 0);
    } else {
      if (timeA !== timeB) return timeA - timeB;
      return (b.voteCount || 0) - (a.voteCount || 0);
    }
  });
}

/**
 * Formats TMDb API raw items into standard application MediaItem
 */
export function formatTmdItem(
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
    voteCount: item.vote_count || 200,
    genres: genres.length > 0 ? genres : [mediaType === 'tv' ? 'TV Series' : 'Action'],
    status: 'Released',
    durationMinutes: mediaType === 'movie' ? 120 : undefined,
  };
}

// 2026/2025 Curated High-Quality Fallback catalog in chronological order
export const LATEST_MEDIA: MediaItem[] = [
  {
    id: 1599191,
    tmdbId: 1599191,
    title: 'Renegade Immortal: Battle of the Immortal Slayer',
    originalTitle: 'Renegade Immortal',
    overview:
      'Wang Lin embarks on his path of cultivation against all odds, defying heaven itself in a cosmic clash across worlds.',
    posterPath: 'https://image.tmdb.org/t/p/w500/y4XGzL8iCg8b2Z5L1zZ3e3J6jL7.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/c6BPbkO5Npt1OdwttAxCFo06wtH.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2026-10-01',
    voteAverage: 8.6,
    voteCount: 320,
    genres: ['Animation', 'Action', 'Fantasy'],
    durationMinutes: 110,
    status: 'Released',
  },
  {
    id: 1423191,
    tmdbId: 1423191,
    title: 'Resident Evil',
    originalTitle: 'Resident Evil',
    overview:
      'Special operative teams investigate horrific viral anomalies deep within covert laboratory complexes as contagion threatens humanity.',
    posterPath: 'https://image.tmdb.org/t/p/w500/gaet1xQ2nxrG0V1Ep9T20ZMNEIC.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2026-09-16',
    voteAverage: 7.9,
    voteCount: 890,
    genres: ['Action', 'Horror', 'Sci-Fi'],
    durationMinutes: 115,
    status: 'Released',
  },
  {
    id: 1377237,
    tmdbId: 1377237,
    title: 'Runner',
    originalTitle: 'Runner',
    overview:
      'A high-stakes courier must navigate urban terrain pursued by syndicates and federal units in a breathless race against the clock.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2026-09-07',
    voteAverage: 8.0,
    voteCount: 540,
    genres: ['Action', 'Thriller'],
    durationMinutes: 104,
    status: 'Released',
  },
  {
    id: 1108427,
    tmdbId: 1108427,
    title: 'Moana',
    originalTitle: 'Moana',
    overview:
      'Teenage Moana answers the Ocean’s call and voyages beyond the reef of her island of Motunui with demigod Maui on an unforgettable adventure.',
    posterPath: 'https://image.tmdb.org/t/p/w500/gaet1xQ2nxrG0V1Ep9T20ZMNEIC.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/c6BPbkO5Npt1OdwttAxCFo06wtH.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2026-07-08',
    voteAverage: 8.5,
    voteCount: 4280,
    genres: ['Animation', 'Adventure', 'Family'],
    durationMinutes: 107,
    status: 'Released',
  },
  {
    id: 1368337,
    tmdbId: 1368337,
    title: 'The Odyssey',
    originalTitle: 'The Odyssey',
    overview:
      'The timeless epic of Odysseus navigating mythical perils, wrathful deities, and uncharted waters on his journey home to Ithaca.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/c6BPbkO5Npt1OdwttAxCFo06wtH.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2026-07-15',
    voteAverage: 8.4,
    voteCount: 910,
    genres: ['Adventure', 'Drama', 'Fantasy'],
    durationMinutes: 142,
    status: 'Released',
  },
  {
    id: 108978,
    tmdbId: 108978,
    title: 'Reacher',
    originalTitle: 'Reacher',
    overview:
      'Jack Reacher, a veteran military police investigator, enters civilian life drifting across America unraveling deadly conspiracies.',
    posterPath: 'https://image.tmdb.org/t/p/w500/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/m5CggjJuFc08QCuKz54znHP6spJ.jpg',
    mediaType: 'tv',
    category: 'tv',
    releaseDate: '2025-01-15',
    voteAverage: 8.2,
    voteCount: 2450,
    genres: ['Action & Adventure', 'Crime', 'Drama'],
    status: 'Returning Series',
    totalSeasons: 4,
    totalEpisodes: 32,
  },
  {
    id: 93405,
    tmdbId: 93405,
    title: 'Squid Game',
    originalTitle: '오징어 게임',
    overview:
      'Hundreds of cash-strapped players accept an invitation to compete in children’s games for a massive cash prize with lethal stakes.',
    posterPath: 'https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWKmXhY.jpg',
    mediaType: 'tv',
    category: 'asian',
    releaseDate: '2024-12-26',
    voteAverage: 8.4,
    voteCount: 15200,
    genres: ['Asian Drama', 'Mystery', 'Action & Adventure'],
    status: 'Returning Series',
    totalSeasons: 3,
    totalEpisodes: 18,
  },
  {
    id: 94605,
    tmdbId: 94605,
    title: 'Arcane',
    originalTitle: 'Arcane',
    overview:
      'Amid the discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and convictions.',
    posterPath: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    mediaType: 'tv',
    category: 'anime',
    releaseDate: '2024-11-09',
    voteAverage: 8.8,
    voteCount: 4620,
    genres: ['Animation', 'Sci-Fi & Fantasy', 'Action & Adventure'],
    status: 'Ended',
    totalSeasons: 2,
    totalEpisodes: 18,
  },
  {
    id: 533535,
    tmdbId: 533535,
    title: 'Deadpool & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    overview:
      'A listless Wade Wilson must reluctantly suit up again alongside an even more reluctant Wolverine to defend their universe.',
    posterPath: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    mediaType: 'movie',
    category: 'movie',
    releaseDate: '2024-07-24',
    voteAverage: 7.7,
    voteCount: 6500,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    durationMinutes: 128,
    status: 'Released',
  },
  {
    id: 209867,
    tmdbId: 209867,
    title: "Frieren: Beyond Journey's End",
    originalTitle: '葬送のフリーレン',
    overview:
      'After defeating the Demon King, elven mage Frieren embarks on a journey reflecting on her past companions and humanity.',
    posterPath: 'https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg',
    mediaType: 'tv',
    category: 'anime',
    releaseDate: '2023-09-29',
    voteAverage: 8.9,
    voteCount: 890,
    genres: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    status: 'Returning Series',
    totalSeasons: 2,
    totalEpisodes: 28,
  },
  {
    id: 125988,
    tmdbId: 125988,
    title: 'Silo',
    originalTitle: 'Silo',
    overview:
      'In a ruined, toxic future, thousands live in a giant subterranean silo. Engineer Juliette starts to uncover its dark secrets.',
    posterPath: 'https://image.tmdb.org/t/p/w500/gMYZZvnkVNTqSVnVCphWbPXwWwb.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/uTWhbLc7Bj4qNSdW3ZvZKL8cOHv.jpg',
    mediaType: 'tv',
    category: 'tv',
    releaseDate: '2023-05-04',
    voteAverage: 8.2,
    voteCount: 1950,
    genres: ['Sci-Fi & Fantasy', 'Drama'],
    status: 'Returning Series',
    totalSeasons: 2,
    totalEpisodes: 20,
  },
];

export const CURATED_MEDIA = LATEST_MEDIA;

// Server-side cache
let cachedCatalog: MediaCatalogResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes TTL

/**
 * Directly fetches, compiles, and formats the live catalog from TMDb
 * Guarantees every category is populated with comprehensive titles sorted in strict chronological order.
 */
export async function fetchLiveMediaCatalog(): Promise<MediaCatalogResponse> {
  const now = Date.now();
  if (cachedCatalog && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedCatalog;
  }

  try {
    // Parallel fetch across extensive TMDb rails (multi-page)
    const [
      np1,
      np2,
      up1,
      up2,
      popM1,
      popM2,
      popM3,
      popT1,
      popT2,
      popT3,
      trMDay,
      trTDay,
      trMWk,
      trTWk,
      animePop1,
      animePop2,
      animeLatest1,
      animeLatest2,
      asianPop1,
      asianPop2,
      asianLatest1,
      asianLatest2,
    ] = await Promise.all([
      tmdb.getNowPlaying(1).catch(() => null),
      tmdb.getNowPlaying(2).catch(() => null),
      tmdb.getUpcoming(1).catch(() => null),
      tmdb.getUpcoming(2).catch(() => null),
      tmdb.getPopular('movie', 1).catch(() => null),
      tmdb.getPopular('movie', 2).catch(() => null),
      tmdb.getPopular('movie', 3).catch(() => null),
      tmdb.getPopular('tv', 1).catch(() => null),
      tmdb.getPopular('tv', 2).catch(() => null),
      tmdb.getPopular('tv', 3).catch(() => null),
      tmdb.getTrending('day', 'movie').catch(() => null),
      tmdb.getTrending('day', 'tv').catch(() => null),
      tmdb.getTrending('week', 'movie').catch(() => null),
      tmdb.getTrending('week', 'tv').catch(() => null),
      tmdb.getAnime(1).catch(() => null),
      tmdb.getAnime(2).catch(() => null),
      tmdb.getLatestAnime(1).catch(() => null),
      tmdb.getLatestAnime(2).catch(() => null),
      tmdb.getAsianDrama(1).catch(() => null),
      tmdb.getAsianDrama(2).catch(() => null),
      tmdb.getLatestAsianDrama(1).catch(() => null),
      tmdb.getLatestAsianDrama(2).catch(() => null),
    ]);

    // 1. Compile Movies (Now Playing, Upcoming, Popular, Trending)
    const movieMap = new Map<number, MediaItem>();
    const rawMovies = [
      ...(np1?.results || []),
      ...(np2?.results || []),
      ...(up1?.results || []),
      ...(up2?.results || []),
      ...(popM1?.results || []),
      ...(popM2?.results || []),
      ...(popM3?.results || []),
      ...(trMDay?.results || []),
      ...(trMWk?.results || []),
    ];

    rawMovies.forEach((m) => {
      if (m.id && m.poster_path && !movieMap.has(m.id)) {
        movieMap.set(m.id, formatTmdItem(m, 'movie', 'movie'));
      }
    });
    // Sort all movies chronologically: Latest releases to oldest
    const popularMovies = sortMediaChronologically(Array.from(movieMap.values()), 'desc');

    // 2. Compile TV Series (Popular, Trending)
    const tvMap = new Map<number, MediaItem>();
    const rawTV = [
      ...(popT1?.results || []),
      ...(popT2?.results || []),
      ...(popT3?.results || []),
      ...(trTDay?.results || []),
      ...(trTWk?.results || []),
    ];

    rawTV.forEach((t) => {
      if (t.id && t.poster_path && !tvMap.has(t.id)) {
        tvMap.set(t.id, formatTmdItem(t, 'tv', 'tv'));
      }
    });
    // Sort all TV series chronologically: Latest releases to oldest
    const popularTV = sortMediaChronologically(Array.from(tvMap.values()), 'desc');

    // 3. Compile Anime (Popular & Latest discoveries)
    const animeMap = new Map<number, MediaItem>();
    const rawAnime = [
      ...(animeLatest1?.results || []),
      ...(animeLatest2?.results || []),
      ...(animePop1?.results || []),
      ...(animePop2?.results || []),
    ];

    rawAnime.forEach((a) => {
      if (a.id && a.poster_path && !animeMap.has(a.id)) {
        animeMap.set(a.id, formatTmdItem(a, 'tv', 'anime'));
      }
    });
    // Sort all anime chronologically: Latest to oldest
    const anime = sortMediaChronologically(Array.from(animeMap.values()), 'desc');

    // 4. Compile Asian Dramas (Popular & Latest K-Dramas)
    const asianMap = new Map<number, MediaItem>();
    const rawAsian = [
      ...(asianLatest1?.results || []),
      ...(asianLatest2?.results || []),
      ...(asianPop1?.results || []),
      ...(asianPop2?.results || []),
    ];

    rawAsian.forEach((asItem) => {
      if (asItem.id && asItem.poster_path && !asianMap.has(asItem.id)) {
        asianMap.set(asItem.id, formatTmdItem(asItem, 'tv', 'asian'));
      }
    });
    // Sort all Asian dramas chronologically: Latest to oldest
    const asian = sortMediaChronologically(Array.from(asianMap.values()), 'desc');

    // 5. Now Playing / In-Theaters releases in chronological order
    const npMap = new Map<number, MediaItem>();
    [...(np1?.results || []), ...(np2?.results || [])].forEach((item) => {
      if (item.id && item.poster_path && !npMap.has(item.id)) {
        npMap.set(item.id, formatTmdItem(item, 'movie', 'movie'));
      }
    });
    const nowPlaying = sortMediaChronologically(Array.from(npMap.values()), 'desc');

    // 6. Trending Day and Week (Curated high-engagement mixes)
    const trendingDay: MediaItem[] = [
      ...((trMDay?.results || []).map((m) => formatTmdItem(m, 'movie', 'movie'))),
      ...((trTDay?.results || []).map((t) => formatTmdItem(t, 'tv', 'tv'))),
    ].filter((item) => item.posterPath);

    const trendingWeek: MediaItem[] = [
      ...((trMWk?.results || []).map((m) => formatTmdItem(m, 'movie', 'movie'))),
      ...((trTWk?.results || []).map((t) => formatTmdItem(t, 'tv', 'tv'))),
    ].filter((item) => item.posterPath);

    // 7. Master catalog: Combine ALL unique titles and sort chronologically
    const allMap = new Map<number, MediaItem>();
    [
      ...popularMovies,
      ...popularTV,
      ...anime,
      ...asian,
      ...nowPlaying,
      ...trendingDay,
    ].forEach((item) => {
      if (!allMap.has(item.id)) {
        allMap.set(item.id, item);
      }
    });

    const all = sortMediaChronologically(Array.from(allMap.values()), 'desc');

    const result: MediaCatalogResponse = {
      trendingDay: trendingDay.length > 0 ? trendingDay : all.slice(0, 20),
      trendingWeek: trendingWeek.length > 0 ? trendingWeek : all.slice(0, 20),
      nowPlaying: nowPlaying.length > 0 ? nowPlaying : popularMovies.slice(0, 20),
      popularMovies,
      popularTV,
      anime,
      asian,
      all,
    };

    if (all.length > 0) {
      cachedCatalog = result;
      cacheTimestamp = now;
      // Asynchronously sync live catalog to database automatically
      autoSyncMediaCatalogToDatabase(all).catch((e) => {
        console.warn('Async media catalog DB auto-sync notice:', e);
      });
      return result;
    }
  } catch (err) {
    console.error('Error fetching live TMDb catalog in fetchLiveMediaCatalog:', err);
  }

  // Graceful fallback if live TMDb fetch fails
  if (cachedCatalog) return cachedCatalog;

  return {
    trendingDay: LATEST_MEDIA,
    trendingWeek: LATEST_MEDIA,
    nowPlaying: LATEST_MEDIA.filter((m) => m.mediaType === 'movie'),
    popularMovies: LATEST_MEDIA.filter((m) => m.mediaType === 'movie'),
    popularTV: LATEST_MEDIA.filter((m) => m.mediaType === 'tv'),
    anime: LATEST_MEDIA.filter((m) => m.category === 'anime'),
    asian: LATEST_MEDIA.filter((m) => m.category === 'asian'),
    all: LATEST_MEDIA,
  };
}

/**
 * Universal media catalog getter that works seamlessly on both server and client
 */
export async function getMediaCatalog(): Promise<MediaCatalogResponse> {
  // If running on server (Next.js SSR / Server Components / Sitemaps), query directly
  if (typeof window === 'undefined') {
    return fetchLiveMediaCatalog();
  }

  // If running on client, fetch the cached API endpoint
  try {
    const res = await fetch('/api/media');
    if (res.ok) {
      const data = await res.json();
      if (data.all && data.all.length > 0) {
        return data as MediaCatalogResponse;
      }
    }
  } catch (err) {
    console.error('Client failed to fetch /api/media:', err);
  }

  // Client-side fallback if /api/media fails
  return fetchLiveMediaCatalog();
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const catalog = await getMediaCatalog();
  return catalog.all && catalog.all.length > 0 ? catalog.all : LATEST_MEDIA;
}

export async function getTrendingMedia(window: TrendingWindow = 'day'): Promise<MediaItem[]> {
  const catalog = await getMediaCatalog();
  if (window === 'day') return catalog.trendingDay;
  if (window === 'week') return catalog.trendingWeek;
  return catalog.popularMovies;
}

export async function getMediaByCategory(
  category: Category,
  sortOrder: 'desc' | 'asc' = 'desc'
): Promise<MediaItem[]> {
  const catalog = await getMediaCatalog();
  let items: MediaItem[] = [];

  if (category === 'all') items = catalog.all;
  else if (category === 'movie') items = catalog.popularMovies;
  else if (category === 'tv') items = catalog.popularTV;
  else if (category === 'anime') items = catalog.anime;
  else if (category === 'asian') items = catalog.asian;
  else items = catalog.all.filter((m) => m.category === category);

  return sortMediaChronologically(items, sortOrder);
}

export function parseMediaId(idOrSlug: string | number): number {
  if (typeof idOrSlug === 'number') return idOrSlug;
  const match = String(idOrSlug).match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : NaN;
}

export function createMediaSlug(media: { id: number | string; title: string }): string {
  const cleanTitle = (media.title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return cleanTitle ? `${media.id}-${cleanTitle}` : `${media.id}`;
}

export async function getMediaById(
  id: number | string,
  type?: 'movie' | 'tv'
): Promise<MediaItem | null> {
  const numericId = parseMediaId(id);
  if (isNaN(numericId) || numericId <= 0) {
    return null;
  }
  const catalog = await getMediaCatalog();
  const all = catalog.all;
  const found = all.find((m) => m.id === numericId || m.tmdbId === numericId);

  // If already found with full cast and seasons populated, return
  if (
    found &&
    found.cast &&
    found.cast.length > 0 &&
    (found.mediaType === 'movie' || (found.seasons && found.seasons.length > 0))
  ) {
    return found;
  }

  // Fetch full details directly from TMDb
  try {
    const determinedType = type || (found ? found.mediaType : 'movie');
    let details: any = null;

    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/tmdb/details?id=${numericId}&type=${determinedType}`);
      if (res.ok) {
        details = await res.json();
      }
    } else {
      details = await tmdb.getDetails(numericId, determinedType);
    }

    if (details && !details.error) {
      const isTv = determinedType === 'tv' || Boolean(details.number_of_seasons);
      const title = details.title || details.name || found?.title || 'Untitled';
      const releaseDate =
        details.release_date || details.first_air_date || found?.releaseDate || '2026-01-01';

      const poster = details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : found?.posterPath || '';

      const backdrop = details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : found?.backdropPath || poster;

      const genres = (details.genres || []).map((g: any) => g.name);
      const trailer = details.videos?.results?.find(
        (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );

      const cast = (details.credits?.cast || []).slice(0, 12).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined,
      }));

      // Fetch authentic Season 1 episodes with real titles and thumbnails
      let firstSeasonEpisodes: Episode[] = [];
      if (isTv) {
        try {
          if (typeof window !== 'undefined') {
            const sRes = await fetch(`/api/tmdb/season?id=${numericId}&season=1`);
            if (sRes.ok) {
              const sData = await sRes.json();
              if (sData?.episodes && Array.isArray(sData.episodes)) {
                firstSeasonEpisodes = sData.episodes.map((ep: any) => ({
                  id: ep.id,
                  episodeNumber: ep.episode_number,
                  seasonNumber: ep.season_number,
                  name: ep.name || `Episode ${ep.episode_number}`,
                  overview: ep.overview || `${title} Season 1 Episode ${ep.episode_number}.`,
                  stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : undefined,
                  airDate: ep.air_date,
                  voteAverage: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : undefined,
                  durationMinutes: ep.runtime || details.episode_run_time?.[0] || 45,
                }));
              }
            }
          } else {
            const sData = await tmdb.getSeason(numericId, 1);
            if (sData?.episodes && Array.isArray(sData.episodes)) {
              firstSeasonEpisodes = sData.episodes.map((ep: any) => ({
                id: ep.id,
                episodeNumber: ep.episode_number,
                seasonNumber: ep.season_number,
                name: ep.name || `Episode ${ep.episode_number}`,
                overview: ep.overview || `${title} Season 1 Episode ${ep.episode_number}.`,
                stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : undefined,
                airDate: ep.air_date,
                voteAverage: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : undefined,
                durationMinutes: ep.runtime || details.episode_run_time?.[0] || 45,
              }));
            }
          }
        } catch (e) {
          console.warn('Could not fetch season 1 episodes:', e);
        }
      }

      // Seasons mapping for TV series
      const seasons = (details.seasons || [])
        .filter((s: any) => s.season_number > 0)
        .map((s: any) => ({
          id: s.id,
          seasonNumber: s.season_number,
          name: s.name || `Season ${s.season_number}`,
          episodeCount: s.episode_count || 10,
          episodes:
            s.season_number === 1 && firstSeasonEpisodes.length > 0
              ? firstSeasonEpisodes
              : Array.from({ length: s.episode_count || 10 }).map((_, i) => ({
                  id: i + 1,
                  seasonNumber: s.season_number,
                  episodeNumber: i + 1,
                  name: `Episode ${i + 1}`,
                  overview: `${title} season ${s.season_number} episode ${i + 1}.`,
                  durationMinutes: details.episode_run_time?.[0] || 45,
                })),
        }));

      const fullItem: MediaItem = {
        id: details.id,
        tmdbId: details.id,
        title,
        originalTitle: details.original_title || details.original_name || title,
        overview: details.overview || found?.overview || '',
        posterPath: poster,
        backdropPath: backdrop,
        mediaType: isTv ? 'tv' : 'movie',
        category: isTv ? 'tv' : 'movie',
        releaseDate,
        voteAverage: details.vote_average ? Number(details.vote_average.toFixed(1)) : 8.0,
        voteCount: details.vote_count || 100,
        genres: genres.length > 0 ? genres : ['Action'],
        durationMinutes: details.runtime || details.episode_run_time?.[0],
        status: details.status || 'Released',
        tagline: details.tagline,
        cast,
        seasons: isTv && seasons.length > 0 ? seasons : undefined,
        totalSeasons: details.number_of_seasons,
        totalEpisodes: details.number_of_episodes,
        trailerYoutubeKey: trailer?.key || found?.trailerYoutubeKey || 'ib8ZqtBg0qU',
      };

      return fullItem;
    }
  } catch (err) {
    console.error('Failed to fetch TMDb details in getMediaById:', err);
  }

  if (found) return found;
  return null;
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  // Try live TMDb proxy search
  try {
    let results: any[] = [];
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        results = data.results || [];
      }
    } else {
      const data = await tmdb.search(trimmed, 1);
      results = data?.results || [];
    }

    if (results.length > 0) {
      return sortMediaChronologically(
        results
          .filter((r) => r.poster_path && (r.title || r.name))
          .map((r) => {
            const isTv = r.media_type === 'tv' || Boolean(r.first_air_date);
            const title = r.title || r.name || 'Untitled';
            return {
              id: r.id,
              tmdbId: r.id,
              title,
              originalTitle: title,
              overview: r.overview || '',
              posterPath: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
              backdropPath: r.backdrop_path
                ? `https://image.tmdb.org/t/p/original${r.backdrop_path}`
                : `https://image.tmdb.org/t/p/w500${r.poster_path}`,
              mediaType: isTv ? 'tv' : 'movie',
              category: isTv ? 'tv' : 'movie',
              releaseDate: r.release_date || r.first_air_date || '2026',
              voteAverage: r.vote_average ? Number(r.vote_average.toFixed(1)) : 8.0,
              voteCount: r.vote_count || 100,
              genres: ['Featured'],
            };
          }),
        'desc'
      );
    }
  } catch (e) {
    console.error('TMDb live search error:', e);
  }

  // Fallback to local catalog filtering
  const all = await getAllMedia();
  return sortMediaChronologically(
    all.filter(
      (m) =>
        m.title.toLowerCase().includes(trimmed) ||
        m.genres.some((g) => g.toLowerCase().includes(trimmed)) ||
        m.overview.toLowerCase().includes(trimmed)
    ),
    'desc'
  );
}

export async function getSimilarMedia(id: number): Promise<MediaItem[]> {
  try {
    let results: any[] = [];
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/tmdb/details?id=${id}&type=movie`);
      if (res.ok) {
        const data = await res.json();
        results = data?.similar?.results || [];
      }
    } else {
      const data = await tmdb.getSimilar(id, 'movie');
      results = data?.results || [];
    }

    if (results && results.length > 0) {
      return sortMediaChronologically(
        results.slice(0, 10).map((r) => ({
          id: r.id,
          tmdbId: r.id,
          title: r.title || r.name || 'Untitled',
          originalTitle: r.title || r.name || 'Untitled',
          overview: r.overview || '',
          posterPath: r.poster_path
            ? `https://image.tmdb.org/t/p/w500${r.poster_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
          backdropPath: r.backdrop_path
            ? `https://image.tmdb.org/t/p/original${r.backdrop_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          mediaType: r.title ? 'movie' : 'tv',
          category: r.title ? 'movie' : 'tv',
          releaseDate: r.release_date || r.first_air_date || '2026',
          voteAverage: r.vote_average ? Number(r.vote_average.toFixed(1)) : 7.8,
          voteCount: r.vote_count || 50,
          genres: ['Action'],
        })),
        'desc'
      );
    }
  } catch (e) {
    console.error('Failed to get similar media:', e);
  }

  const all = await getAllMedia();
  return all.filter((m) => m.id !== id).slice(0, 8);
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<Episode[]> {
  try {
    let data: any = null;
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/tmdb/season?id=${tvId}&season=${seasonNumber}`);
      if (res.ok) data = await res.json();
    } else {
      data = await tmdb.getSeason(tvId, seasonNumber);
    }

    if (data?.episodes && Array.isArray(data.episodes) && data.episodes.length > 0) {
      return data.episodes.map((ep: any) => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        name: ep.name || `Episode ${ep.episode_number}`,
        overview: ep.overview || `Episode ${ep.episode_number} of Season ${ep.season_number}.`,
        stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : undefined,
        airDate: ep.air_date,
        voteAverage: ep.vote_average ? Number(ep.vote_average.toFixed(1)) : undefined,
        durationMinutes: ep.runtime || undefined,
      }));
    }
  } catch (err) {
    console.error(`Failed to fetch season ${seasonNumber} for tv ${tvId}:`, err);
  }
  return [];
}
