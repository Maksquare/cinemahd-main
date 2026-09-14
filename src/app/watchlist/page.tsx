'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Clock, Check, Film, Play, Trash2, Cloud, RefreshCw, Sparkles } from 'lucide-react';
import { getWatchlist, getContinueWatching, getWatchedList, removeWatchProgress } from '@/lib/storage';
import { getMediaCatalog, LATEST_MEDIA } from '@/lib/tmdb';
import { MediaItem, WatchProgress } from '@/types/media';
import { MediaCard } from '@/components/media/MediaCard';
import { useSession } from '@/lib/auth-client';
import { useCloudSync } from '@/hooks/useCloudSync';
import { AuthModal } from '@/components/auth/AuthModal';

export default function WatchlistPage() {
  const { data: session } = useSession();
  const { isSyncing, triggerSync } = useCloudSync();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
          </div>

          {/* Cloud Sync Status Indicator / Login Prompt */}
          {session?.user ? (
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <Cloud className={`h-4 w-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <span>Cloud Sync Active</span>
                  <span className="text-[10px] text-white/50">({session.user.name || session.user.email?.split('@')[0]})</span>
                </p>
                <p className="text-[11px] text-white/40">Synced across all your devices</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSync()}
                disabled={isSyncing}
                className="ml-2 rounded-lg bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                title="Sync now"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-400/15 via-amber-400/5 to-white/5 px-4 py-2 text-xs font-semibold text-white hover:border-amber-400 hover:from-amber-400/25 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <div className="text-left">
                <span className="block font-bold text-amber-300">Sync Across Devices</span>
                <span className="block text-[10px] text-white/60">Sign in with Google to save library</span>
              </div>
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Watchlist ({watchlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
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
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Watched History ({watchedItems.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Bookmarked Watchlist */}
      {activeTab === 'bookmarks' && (
        <div>
          {watchlist.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <Film className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">Your watchlist is empty</h3>
              <p className="mt-1 text-sm text-white/40 max-w-sm mx-auto">
                Explore our catalog and click the bookmark button on any movie or series to save it for later.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-lg"
              >
                Browse Titles
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

      {/* Tab 2: Continue Watching History */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-white/8 bg-white/[0.02]">
              <Clock className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No playback history yet</h3>
              <p className="mt-1 text-sm text-white/40 max-w-sm mx-auto">
                Whenever you stream a movie or episode, your progress will automatically appear here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors shadow-lg"
              >
                Start Watching
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {history.map((item) => (
                <div
                  key={item.mediaId}
                  className="group relative rounded-2xl border border-white/10 bg-[#141418] overflow-hidden shadow-lg hover:border-white/25 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.backdropPath || item.posterPath}
                      alt={item.title}
                      className="h-full w-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <button
                      type="button"
                      onClick={() => removeWatchProgress(item.mediaId)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 hover:bg-red-500/80 hover:text-white transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <Link
                      href={`/watch/${item.mediaType}/${item.mediaId}?season=${item.season || 1}&episode=${item.episode || 1}`}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-black shadow-xl">
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      </div>
                    </Link>

                    <div className="absolute inset-x-4 bottom-3 z-10">
                      <h4 className="truncate text-base font-semibold text-white drop-shadow">
                        {item.title}
                      </h4>
                      {item.season && item.episode && (
                        <p className="text-xs text-amber-300 font-medium mt-0.5">
                          Season {item.season} • Episode {item.episode} {item.episodeTitle ? `— ${item.episodeTitle}` : ''}
                        </p>
                      )}

                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${item.percentageWatched || 30}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Watched Completed */}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
