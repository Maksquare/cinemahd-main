import { MediaItem, WatchProgress } from '@/types/media';

const WATCHLIST_KEY = 'cinemahd_watchlist';
const WATCHED_KEY = 'cinemahd_watched';
const HISTORY_KEY = 'cinemahd_continue_watching';

// Debounce timer for saving watch progress to cloud
let progressSyncTimeout: NodeJS.Timeout | null = null;

// Background push to cloud if logged in
async function pushToCloud(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const watchlist = getWatchlist();
    const watched = getWatchedList();
    const continueWatching = getContinueWatching();

    await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watchlist, watched, continueWatching }),
    });
  } catch {
    // Gracefully ignore if offline or not logged in (401)
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

    // Trigger cloud sync in background
    pushToCloud();

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
    pushToCloud();
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

export function toggleWatched(id: number): boolean {
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

    // Trigger cloud sync in background
    pushToCloud();

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

    // Debounce cloud sync for playback updates
    if (progressSyncTimeout) clearTimeout(progressSyncTimeout);
    progressSyncTimeout = setTimeout(() => {
      pushToCloud();
    }, 3000);
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

    pushToCloud();
  } catch (err) {
    console.error('Failed to remove watch progress', err);
  }
}

/**
 * Syncs local guest data with the user's remote cloud database upon login.
 * Merges watchlists, watched marks, and continue watching history.
 */
export async function syncWithCloud(): Promise<{
  synced: boolean;
  watchlistCount: number;
  continueWatchingCount: number;
}> {
  if (typeof window === 'undefined') {
    return { synced: false, watchlistCount: 0, continueWatchingCount: 0 };
  }

  try {
    const localWatchlist = getWatchlist();
    const localWatched = getWatchedList();
    const localContinue = getContinueWatching();

    // 1. Fetch remote cloud data
    const res = await fetch('/api/user/sync');
    if (!res.ok) {
      return {
        synced: false,
        watchlistCount: localWatchlist.length,
        continueWatchingCount: localContinue.length,
      };
    }

    const { data: cloudData } = await res.json();
    if (!cloudData) {
      return {
        synced: false,
        watchlistCount: localWatchlist.length,
        continueWatchingCount: localContinue.length,
      };
    }

    // 2. Merge local and cloud watchlists uniquely
    const watchlistMap = new Map<number, MediaItem>();
    (cloudData.watchlist || []).forEach((m: MediaItem) => watchlistMap.set(m.id, m));
    localWatchlist.forEach((m: MediaItem) => {
      if (!watchlistMap.has(m.id)) {
        watchlistMap.set(m.id, m);
      }
    });
    const mergedWatchlist = Array.from(watchlistMap.values());

    // 3. Merge watched IDs
    const watchedSet = new Set<number>([
      ...(cloudData.watched || []),
      ...localWatched,
    ]);
    const mergedWatched = Array.from(watchedSet);

    // 4. Merge continue watching items
    const continueMap = new Map<number, WatchProgress>();
    [...(cloudData.continueWatching || []), ...localContinue].forEach((p: WatchProgress) => {
      const existing = continueMap.get(p.mediaId);
      if (!existing || (p.lastUpdated && p.lastUpdated > (existing.lastUpdated || 0))) {
        continueMap.set(p.mediaId, p);
      }
    });
    const mergedContinue = Array.from(continueMap.values()).slice(0, 15);

    // 5. Save merged data locally
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(mergedWatchlist));
    localStorage.setItem(WATCHED_KEY, JSON.stringify(mergedWatched));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(mergedContinue));

    // 6. Push merged data back to cloud to ensure all devices have the latest state
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        watchlist: mergedWatchlist,
        watched: mergedWatched,
        continueWatching: mergedContinue,
      }),
    });

    // Notify all components on this device of updated data
    window.dispatchEvent(new Event('cinemahd_storage_change'));

    return {
      synced: true,
      watchlistCount: mergedWatchlist.length,
      continueWatchingCount: mergedContinue.length,
    };
  } catch (error) {
    console.error('Failed to sync with cloud:', error);
    return {
      synced: false,
      watchlistCount: getWatchlist().length,
      continueWatchingCount: getContinueWatching().length,
    };
  }
}
