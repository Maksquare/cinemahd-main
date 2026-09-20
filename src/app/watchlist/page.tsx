'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Clock, Check, Film, Play, Trash2, X, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import {
  getWatchlist,
  getContinueWatching,
  getWatchedList,
  removeWatchProgress,
  removeFromWatchlist,
} from '@/lib/storage';
import { getMediaCatalog, LATEST_MEDIA } from '@/lib/tmdb';
import { MediaItem, WatchProgress } from '@/types/media';
import { MediaCard } from '@/components/media/MediaCard';
import { useAuth } from '@/context/AuthContext';

export default function WatchlistPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history' | 'watched'>('bookmarks');
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<WatchProgress[]>([]);
  const [watchedIds, setWatchedIds] = useState<number[]>([]);
  const [catalog, setCatalog] = useState<MediaItem[]>(LATEST_MEDIA);

  const loadData = () => {
    setWatchlist(getWatchlist());
    setHistory(getContinueWatching());
    setWatchedIds(getWatchedList());
  };

  useEffect(() => {
    loadData();
    getMediaCatalog().then((res) => {
      if (res?.all && res.all.length > 0) {
        setCatalog(res.all);
      }
    });
    window.addEventListener('cinemahd_storage_change', loadData);
    return () => window.removeEventListener('cinemahd_storage_change', loadData);
  }, []);

  const watchedItems = catalog.filter((m) => watchedIds.includes(m.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[80vh]">
      {/* Page Header */}
      <div className="border-b border-white/8 pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bookmark className="h-7 w-7 text-amber-400" />
              My Library
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Manage your saved bookmarks, playback progress, and completed titles.
            </p>
            <div className="flex items-center gap-2 mt-3">
              {isAuthenticated ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Private Library for {user?.email}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30 hover:bg-amber-400/25 transition-colors cursor-pointer"
                >
                  <Lock className="h-3 w-3 text-amber-400" />
                  <span>Guest Mode • Sign in to save your personal library</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Bookmarks ({watchlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Continue Watching ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('watched')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'watched'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Watched Titles ({watchedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Tab: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {watchlist.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <Bookmark className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">Your watchlist is empty</h3>
              <p className="mt-1 text-sm text-white/40 max-w-sm mx-auto">
                Explore movies and TV series, and tap the bookmark icon to save titles for later.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
              >
                <Film className="h-4 w-4" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {watchlist.map((item) => (
                <MediaCard key={item.id} media={item} variant="backdrop" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Continue Watching */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <Clock className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No active playback history</h3>
              <p className="mt-1 text-sm text-white/40 max-w-sm mx-auto">
                When you stream movies and episodes, your progress will automatically appear here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
              >
                <Play className="h-4 w-4 fill-black" />
                <span>Start Watching Now</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {history.map((item) => {
                const percent = Math.min(100, Math.round(item.percentageWatched || 0));
                const watchUrl =
                  item.mediaType === 'tv'
                    ? `/watch/tv/${item.mediaId}?season=${item.season || 1}&episode=${item.episode || 1}`
                    : `/watch/movie/${item.mediaId}`;

                return (
                  <div
                    key={`${item.mediaType}-${item.mediaId}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141418] transition-all hover:border-white/25 hover:shadow-xl"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                      <Link href={watchUrl} className="block w-full h-full">
                        <img
                          src={item.backdropPath || item.posterPath}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg">
                            <Play className="h-5 w-5 fill-black ml-0.5" />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 pointer-events-none">
                          <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
                        </div>
                      </Link>

                      {/* Top-Right Dedicated Remove X Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeWatchProgress(item.mediaId);
                          removeFromWatchlist(item.mediaId);
                          setHistory((prev) =>
                            prev.filter(
                              (p) =>
                                String(p.mediaId) !== String(item.mediaId) &&
                                Number(p.mediaId) !== Number(item.mediaId)
                            )
                          );
                        }}
                        className="absolute top-2.5 right-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white/80 border border-white/20 backdrop-blur-md hover:bg-rose-600 hover:text-white hover:border-rose-500 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
                        title="Remove from history"
                        aria-label="Remove from history"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="p-3.5 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link href={watchUrl}>
                          <h4 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h4>
                        </Link>
                        <p className="mt-0.5 text-xs text-white/50">
                          {item.mediaType === 'tv'
                            ? `S${item.season || 1} • E${item.episode || 1}${item.episodeTitle ? ` — ${item.episodeTitle}` : ''}`
                            : 'Movie'}{' '}
                          • {percent}% complete
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeWatchProgress(item.mediaId);
                          loadData();
                        }}
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from history"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Watched Titles */}
      {activeTab === 'watched' && (
        <div>
          {watchedItems.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <Check className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No watched titles marked yet</h3>
              <p className="mt-1 text-sm text-white/40 max-w-sm mx-auto">
                Mark movies and episodes as watched to keep track of what you&apos;ve completed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {watchedItems.map((item) => (
                <MediaCard key={item.id} media={item} variant="backdrop" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
