import { getDb } from './db';
import { MediaItem, WatchProgress } from '@/types/media';

export interface UserCloudData {
  watchlist: MediaItem[];
  watched: number[];
  continueWatching: WatchProgress[];
  updatedAt: number;
}

export function getUserCloudData(userId: string): UserCloudData {
  try {
    const db = getDb();
    const row: any = db
      .prepare(
        'SELECT watchlist, watched, continueWatching, updatedAt FROM user_sync_data WHERE userId = ?'
      )
      .get(userId);

    if (!row) {
      return {
        watchlist: [],
        watched: [],
        continueWatching: [],
        updatedAt: Date.now(),
      };
    }

    return {
      watchlist: row.watchlist ? JSON.parse(row.watchlist) : [],
      watched: row.watched ? JSON.parse(row.watched) : [],
      continueWatching: row.continueWatching ? JSON.parse(row.continueWatching) : [],
      updatedAt: row.updatedAt || Date.now(),
    };
  } catch (error) {
    console.error('Failed to get user cloud data:', error);
    return {
      watchlist: [],
      watched: [],
      continueWatching: [],
      updatedAt: Date.now(),
    };
  }
}

export function saveUserCloudData(
  userId: string,
  data: Partial<UserCloudData>
): UserCloudData {
  try {
    const db = getDb();
    const existing = getUserCloudData(userId);

    const merged = mergeCloudData(existing, data);
    const now = Date.now();

    db.prepare(`
      INSERT INTO user_sync_data (userId, watchlist, watched, continueWatching, updatedAt)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(userId) DO UPDATE SET
        watchlist = excluded.watchlist,
        watched = excluded.watched,
        continueWatching = excluded.continueWatching,
        updatedAt = excluded.updatedAt
    `).run(
      userId,
      JSON.stringify(merged.watchlist),
      JSON.stringify(merged.watched),
      JSON.stringify(merged.continueWatching),
      now
    );

    return { ...merged, updatedAt: now };
  } catch (error) {
    console.error('Failed to save user cloud data:', error);
    return {
      watchlist: data.watchlist || [],
      watched: data.watched || [],
      continueWatching: data.continueWatching || [],
      updatedAt: Date.now(),
    };
  }
}

export function mergeCloudData(
  a: Partial<UserCloudData>,
  b: Partial<UserCloudData>
): UserCloudData {
  // Merge watchlists uniquely by item ID
  const watchlistMap = new Map<number, MediaItem>();
  (b.watchlist || []).forEach((m) => watchlistMap.set(m.id, m));
  (a.watchlist || []).forEach((m) => {
    if (!watchlistMap.has(m.id)) {
      watchlistMap.set(m.id, m);
    }
  });

  // Merge watched numbers uniquely
  const watchedSet = new Set<number>([
    ...(a.watched || []),
    ...(b.watched || []),
  ]);

  // Merge continue watching by mediaId, keeping higher timestamp/percentage
  const continueMap = new Map<number, WatchProgress>();
  [...(a.continueWatching || []), ...(b.continueWatching || [])].forEach((p) => {
    const existing = continueMap.get(p.mediaId);
    if (!existing || (p.lastUpdated && p.lastUpdated > (existing.lastUpdated || 0))) {
      continueMap.set(p.mediaId, p);
    }
  });

  return {
    watchlist: Array.from(watchlistMap.values()),
    watched: Array.from(watchedSet),
    continueWatching: Array.from(continueMap.values()),
    updatedAt: Date.now(),
  };
}
