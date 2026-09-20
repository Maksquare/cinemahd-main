import { getSupabase } from './client';
import { MediaItem, WatchProgress } from '@/types/media';

/**
 * Fetch the authenticated user's private watchlist from Supabase.
 * RLS ensures only records where auth.uid() == user_id are returned.
 */
export async function fetchSupabaseWatchlist(userId: string): Promise<MediaItem[]> {
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_watchlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching Supabase watchlist:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: Number(row.media_id),
      tmdbId: Number(row.media_id),
      title: row.title,
      posterPath: row.poster_path || '',
      backdropPath: row.backdrop_path || '',
      mediaType: row.media_type,
      category: row.media_type === 'tv' ? 'tv' : 'movie',
      releaseDate: row.release_date || '',
      voteAverage: Number(row.vote_average || 0),
      voteCount: 0,
      genres: row.genres || [],
      overview: '',
    }));
  } catch (err) {
    console.error('Failed to query user_watchlists:', err);
    return [];
  }
}

/**
 * Add a title to the user's private watchlist in Supabase.
 */
export async function addToSupabaseWatchlist(
  userId: string,
  media: MediaItem
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase.from('user_watchlists').upsert(
      {
        user_id: userId,
        media_id: media.id,
        media_type: media.mediaType,
        title: media.title,
        poster_path: media.posterPath,
        backdrop_path: media.backdropPath,
        release_date: media.releaseDate,
        vote_average: media.voteAverage,
        genres: media.genres,
      },
      { onConflict: 'user_id,media_id' }
    );

    if (error) {
      console.error('Error adding to Supabase watchlist:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert into user_watchlists:', err);
    return false;
  }
}

/**
 * Remove a title from the user's private watchlist in Supabase.
 */
export async function removeFromSupabaseWatchlist(
  userId: string,
  mediaId: number | string
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase
      .from('user_watchlists')
      .delete()
      .eq('user_id', userId)
      .eq('media_id', Number(mediaId));

    if (error) {
      console.error('Error deleting from Supabase watchlist:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete from user_watchlists:', err);
    return false;
  }
}

/**
 * Fetch playback progress / continue watching history for the authenticated user.
 */
export async function fetchSupabaseWatchProgress(userId: string): Promise<WatchProgress[]> {
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_watch_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching Supabase watch progress:', error);
      return [];
    }

    return (data || []).map((row) => ({
      mediaId: Number(row.media_id),
      mediaType: row.media_type,
      title: row.title,
      posterPath: row.poster_path || '',
      backdropPath: row.backdrop_path || '',
      season: row.season || 1,
      episode: row.episode || 1,
      episodeTitle: row.episode_title || '',
      percentageWatched: Number(row.percentage_watched || 0),
      lastUpdated: new Date(row.last_updated).getTime(),
    }));
  } catch (err) {
    console.error('Failed to query user_watch_progress:', err);
    return [];
  }
}

/**
 * Save continuous playback position into Supabase.
 */
export async function saveSupabaseWatchProgress(
  userId: string,
  progress: WatchProgress
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  try {
    await supabase.from('user_watch_progress').upsert(
      {
        user_id: userId,
        media_id: progress.mediaId,
        media_type: progress.mediaType,
        title: progress.title,
        poster_path: progress.posterPath,
        backdrop_path: progress.backdropPath,
        season: progress.season || 1,
        episode: progress.episode || 1,
        episode_title: progress.episodeTitle || '',
        percentage_watched: progress.percentageWatched || 0,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id,media_id' }
    );
  } catch (err) {
    console.error('Failed to save to user_watch_progress:', err);
  }
}

/**
 * Fetch watched media IDs for the authenticated user.
 */
export async function fetchSupabaseWatched(userId: string): Promise<number[]> {
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_watch_progress')
      .select('media_id')
      .eq('user_id', userId)
      .eq('is_watched', true);

    if (error) {
      console.error('Error fetching Supabase watched list:', error);
      return [];
    }

    return (data || []).map((row) => Number(row.media_id));
  } catch (err) {
    console.error('Failed to query watched items in user_watch_progress:', err);
    return [];
  }
}

/**
 * Toggle the watched status of a title in Supabase.
 */
export async function toggleSupabaseWatched(
  userId: string,
  mediaId: number,
  isWatched: boolean,
  mediaItem?: MediaItem
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase.from('user_watch_progress').upsert(
      {
        user_id: userId,
        media_id: mediaId,
        media_type: mediaItem?.mediaType || 'movie',
        title: mediaItem?.title || `Title ${mediaId}`,
        poster_path: mediaItem?.posterPath || '',
        backdrop_path: mediaItem?.backdropPath || '',
        is_watched: isWatched,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id,media_id' }
    );

    if (error) {
      console.error('Error toggling watched in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to toggle watched in Supabase:', err);
    return false;
  }
}

/**
 * Migrate anonymous guest data from browser storage into Supabase upon login.
 * Ensures the user keeps all saved items when transitioning from guest to account holder.
 */
export async function migrateLocalToSupabase(
  userId: string,
  localWatchlist: MediaItem[],
  localProgress: WatchProgress[],
  localWatched: number[]
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  try {
    // 1. Batch upsert local watchlist items into Supabase
    if (localWatchlist.length > 0) {
      const watchlistRows = localWatchlist.map((m) => ({
        user_id: userId,
        media_id: m.id,
        media_type: m.mediaType,
        title: m.title,
        poster_path: m.posterPath,
        backdrop_path: m.backdropPath,
        release_date: m.releaseDate,
        vote_average: m.voteAverage,
        genres: m.genres,
      }));

      await supabase
        .from('user_watchlists')
        .upsert(watchlistRows, { onConflict: 'user_id,media_id', ignoreDuplicates: true });
    }

    // 2. Batch upsert continue watching items
    if (localProgress.length > 0) {
      const progressRows = localProgress.map((p) => ({
        user_id: userId,
        media_id: p.mediaId,
        media_type: p.mediaType,
        title: p.title,
        poster_path: p.posterPath,
        backdrop_path: p.backdropPath,
        season: p.season || 1,
        episode: p.episode || 1,
        episode_title: p.episodeTitle || '',
        percentage_watched: p.percentageWatched || 0,
        is_watched: localWatched.includes(p.mediaId),
        last_updated: new Date(p.lastUpdated || Date.now()).toISOString(),
      }));

      await supabase
        .from('user_watch_progress')
        .upsert(progressRows, { onConflict: 'user_id,media_id', ignoreDuplicates: true });
    }
  } catch (err) {
    console.error('Error migrating local guest data to Supabase:', err);
  }
}
