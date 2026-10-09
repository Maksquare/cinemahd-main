import { MediaItem, WatchProgress } from '@/types/media';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  addToSupabaseWatchlist,
  removeFromSupabaseWatchlist,
  saveSupabaseWatchProgress,
  toggleSupabaseWatched,
  fetchSupabaseWatchlist,
  fetchSupabaseWatchProgress,
  fetchSupabaseWatched,
  migrateLocalToSupabase,
} from '@/lib/supabase/user-store';

const WATCHLIST_KEY = 'cinemahd_watchlist';
const WATCHED_KEY = 'cinemahd_watched';
const HISTORY_KEY = 'cinemahd_continue_watching';
const AUTH_USER_KEY = 'cinemahd_auth_user';

// Debounce timer for saving watch progress to cloud
let progressSyncTimeout: NodeJS.Timeout | null = null;

function getActiveUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Background asynchronous push of all local data to Supabase database.
 * Non-blocking, automatic database sync.
 */
export async function pushToCloud(): Promise<void> {
  if (typeof window === 'undefined') return;
  const userId = getActiveUserId();
  if (!userId || userId.startsWith('guest_') || !isSupabaseConfigured()) {
    return;
  }

  try {
    const watchlist = getWatchlist();
    const progress = getContinueWatching();
    const watched = getWatchedList();
    await migrateLocalToSupabase(userId, watchlist, progress, watched);
  } catch (err) {
    console.warn('Asynchronous database push notice:', err);
  }
}

export function getWatchlist(): MediaItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to get watchlist from localStorage', err);
    return [];
  }
}

/**
 * Toggles a title in the user's watchlist.
 * Updates local state synchronously for instantaneous UI response,
 * and automatically dispatches asynchronous database updates in the background.
 */
export function toggleWatchlist(item: MediaItem): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWatchlist();
    const exists = list.some((m) => m.id === item.id);
    let updated: MediaItem[];
    if (exists) {
      updated = list.filter((m) => m.id !== item.id);
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Automatically and asynchronously update Supabase database in background
    (async () => {
      const userId = getActiveUserId();
      if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
        try {
          if (exists) {
            await removeFromSupabaseWatchlist(userId, item.id);
          } else {
            await addToSupabaseWatchlist(userId, item);
          }
        } catch (e) {
          console.warn('Async Supabase watchlist notice:', e);
        }
      }
    })();

    return !exists;
  } catch (err) {
    console.error('Failed to toggle watchlist item', err);
    return false;
  }
}

export async function toggleWatchlistAsync(item: MediaItem): Promise<boolean> {
  return toggleWatchlist(item);
}

export function isInWatchlist(id: number | string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getWatchlist();
  const targetStr = String(id).trim();
  const targetNum = Number(id);
  return list.some((m) => {
    const itemStr = String(m.id ?? m.tmdbId ?? '').trim();
    const itemNum = Number(m.id ?? m.tmdbId);
    return itemStr === targetStr || (!isNaN(itemNum) && !isNaN(targetNum) && itemNum === targetNum);
  });
}

/**
 * Removes a title from watchlist and automatically syncs database asynchronously
 */
export function removeFromWatchlist(id: number | string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWatchlist();
    const targetStr = String(id).trim();
    const targetNum = Number(id);
    const updated = list.filter((m) => {
      const itemStr = String(m.id ?? m.tmdbId ?? '').trim();
      const itemNum = Number(m.id ?? m.tmdbId);
      const isMatch = itemStr === targetStr || (!isNaN(itemNum) && !isNaN(targetNum) && itemNum === targetNum);
      return !isMatch;
    });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Automatically remove from Supabase database asynchronously
    (async () => {
      const userId = getActiveUserId();
      if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
        try {
          await removeFromSupabaseWatchlist(userId, id);
        } catch (e) {
          console.warn('Async remove from Supabase watchlist notice:', e);
        }
      }
    })();

    return true;
  } catch (err) {
    console.error('Failed to remove item from watchlist', err);
    return false;
  }
}

export function getWatchedList(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggles watched status and automatically syncs database asynchronously
 */
export function toggleWatched(id: number, mediaItem?: MediaItem): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWatchedList();
    const exists = list.includes(id);
    let updated: number[];
    if (exists) {
      updated = list.filter((itemId) => itemId !== id);
    } else {
      updated = [id, ...list];
    }
    localStorage.setItem(WATCHED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Automatically sync watched status to Supabase database asynchronously
    (async () => {
      const userId = getActiveUserId();
      if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
        try {
          await toggleSupabaseWatched(userId, id, !exists, mediaItem);
        } catch (e) {
          console.warn('Async toggle watched in Supabase notice:', e);
        }
      }
    })();

    return !exists;
  } catch (err) {
    console.error('Failed to toggle watched item', err);
    return false;
  }
}

export function isWatched(id: number): boolean {
  if (typeof window === 'undefined') return false;
  return getWatchedList().includes(id);
}

export function getContinueWatching(): WatchProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves playback watch progress and automatically syncs database asynchronously in background
 */
export function saveWatchProgress(progress: WatchProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getContinueWatching().filter((item) => item.mediaId !== progress.mediaId);
    const updated = [progress, ...current].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Debounce asynchronous Supabase database sync
    if (progressSyncTimeout) clearTimeout(progressSyncTimeout);
    progressSyncTimeout = setTimeout(() => {
      (async () => {
        const userId = getActiveUserId();
        if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
          try {
            await saveSupabaseWatchProgress(userId, progress);
          } catch (e) {
            console.warn('Async save watch progress to Supabase notice:', e);
          }
        }
      })();
    }, 1500);
  } catch (err) {
    console.error('Failed to save watch progress', err);
  }
}

/**
 * Removes a watch progress entry and automatically updates the database asynchronously
 */
export function removeWatchProgress(mediaId: number | string): void {
  if (typeof window === 'undefined') return;
  try {
    const targetStr = String(mediaId).trim();
    const targetNum = Number(mediaId);
    const current = getContinueWatching().filter((item) => {
      const itemStr = String(item.mediaId ?? (item as any).id ?? '').trim();
      const itemNum = Number(item.mediaId ?? (item as any).id);
      const isMatch = itemStr === targetStr || (!isNaN(itemNum) && !isNaN(targetNum) && itemNum === targetNum);
      return !isMatch;
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Automatically update database asynchronously
    (async () => {
      const userId = getActiveUserId();
      if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
        try {
          await saveSupabaseWatchProgress(userId, {
            mediaId: Number(mediaId),
            mediaType: 'movie',
            title: '',
            posterPath: '',
            backdropPath: '',
            percentageWatched: 0,
            lastUpdated: Date.now(),
          });
        } catch {
          // ignore
        }
      }
    })();
  } catch (err) {
    console.error('Failed to remove watch progress', err);
  }
}

/**
 * Fully synchronizes local and Supabase cloud user library asynchronously.
 * Automatically called on authentication changes, session loads, and library mounts.
 */
export async function syncWithCloud(): Promise<{
  synced: boolean;
  watchlistCount: number;
  continueWatchingCount: number;
}> {
  if (typeof window === 'undefined') {
    return { synced: false, watchlistCount: 0, continueWatchingCount: 0 };
  }

  const userId = getActiveUserId();
  if (!userId || userId.startsWith('guest_') || !isSupabaseConfigured()) {
    return {
      synced: false,
      watchlistCount: getWatchlist().length,
      continueWatchingCount: getContinueWatching().length,
    };
  }

  try {
    // 1. Asynchronously push any un-synced local data first
    const localWatchlist = getWatchlist();
    const localProgress = getContinueWatching();
    const localWatched = getWatchedList();
    if (localWatchlist.length > 0 || localProgress.length > 0) {
      await migrateLocalToSupabase(userId, localWatchlist, localProgress, localWatched);
    }

    // 2. Asynchronously pull remote data from database
    const [cloudWatchlist, cloudProgress, cloudWatched] = await Promise.all([
      fetchSupabaseWatchlist(userId),
      fetchSupabaseWatchProgress(userId),
      fetchSupabaseWatched(userId),
    ]);

    if (cloudWatchlist && cloudWatchlist.length > 0) {
      const mergedMap = new Map<number, MediaItem>();
      cloudWatchlist.forEach((m) => mergedMap.set(m.id, m));
      localWatchlist.forEach((m) => {
        if (!mergedMap.has(m.id)) mergedMap.set(m.id, m);
      });
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(Array.from(mergedMap.values())));
    }

    if (cloudProgress && cloudProgress.length > 0) {
      const mergedProgressMap = new Map<number, WatchProgress>();
      cloudProgress.forEach((p) => mergedProgressMap.set(p.mediaId, p));
      localProgress.forEach((p) => {
        if (!mergedProgressMap.has(p.mediaId)) mergedProgressMap.set(p.mediaId, p);
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(Array.from(mergedProgressMap.values())));
    }

    if (cloudWatched && cloudWatched.length > 0) {
      const uniqueWatched = Array.from(new Set([...cloudWatched, ...localWatched]));
      localStorage.setItem(WATCHED_KEY, JSON.stringify(uniqueWatched));
    }

    window.dispatchEvent(new Event('cinemahd_storage_change'));

    return {
      synced: true,
      watchlistCount: getWatchlist().length,
      continueWatchingCount: getContinueWatching().length,
    };
  } catch (error) {
    console.warn('Notice during cloud database synchronization:', error);
    return {
      synced: false,
      watchlistCount: getWatchlist().length,
      continueWatchingCount: getContinueWatching().length,
    };
  }
}
