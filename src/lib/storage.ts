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

// Background push to Supabase if logged in
async function pushToCloud(): Promise<void> {
  if (typeof window === 'undefined') return;
  const userId = getActiveUserId();
  if (!userId || userId.startsWith('guest_') || !isSupabaseConfigured()) {
    return;
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

    // Asynchronously update Supabase if authenticated
    const userId = getActiveUserId();
    if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
      if (exists) {
        removeFromSupabaseWatchlist(userId, item.id).catch((e) =>
          console.error('Failed to remove from Supabase watchlist:', e)
        );
      } else {
        addToSupabaseWatchlist(userId, item).catch((e) =>
          console.error('Failed to add to Supabase watchlist:', e)
        );
      }
    }

    return !exists;
  } catch (err) {
    console.error('Failed to toggle watchlist item', err);
    return false;
  }
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

    // Remove from Supabase
    const userId = getActiveUserId();
    if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
      removeFromSupabaseWatchlist(userId, id).catch((e) =>
        console.error('Failed to remove from Supabase watchlist:', e)
      );
    }

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

    // Sync to Supabase
    const userId = getActiveUserId();
    if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
      toggleSupabaseWatched(userId, id, !exists, mediaItem).catch((e) =>
        console.error('Failed to toggle watched in Supabase:', e)
      );
    }

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

export function saveWatchProgress(progress: WatchProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getContinueWatching().filter((item) => item.mediaId !== progress.mediaId);
    const updated = [progress, ...current].slice(0, 15);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    // Debounce Supabase sync for playback updates
    if (progressSyncTimeout) clearTimeout(progressSyncTimeout);
    progressSyncTimeout = setTimeout(() => {
      const userId = getActiveUserId();
      if (userId && !userId.startsWith('guest_') && isSupabaseConfigured()) {
        saveSupabaseWatchProgress(userId, progress).catch((e) =>
          console.error('Failed to save progress to Supabase:', e)
        );
      }
    }, 2000);
  } catch (err) {
    console.error('Failed to save watch progress', err);
  }
}

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
  } catch (err) {
    console.error('Failed to remove watch progress', err);
  }
}

/**
 * Synchronizes local guest or cached data with Supabase user library.
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
    const [cloudWatchlist, cloudProgress, cloudWatched] = await Promise.all([
      fetchSupabaseWatchlist(userId),
      fetchSupabaseWatchProgress(userId),
      fetchSupabaseWatched(userId),
    ]);

    if (cloudWatchlist) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(cloudWatchlist));
    }
    if (cloudProgress) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(cloudProgress));
    }
    if (cloudWatched) {
      localStorage.setItem(WATCHED_KEY, JSON.stringify(cloudWatched));
    }

    window.dispatchEvent(new Event('cinemahd_storage_change'));

    return {
      synced: true,
      watchlistCount: cloudWatchlist.length,
      continueWatchingCount: cloudProgress.length,
    };
  } catch (error) {
    console.error('Failed to sync with Supabase cloud:', error);
    return {
      synced: false,
      watchlistCount: getWatchlist().length,
      continueWatchingCount: getContinueWatching().length,
    };
  }
}
