'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, X, RotateCcw, CheckCircle2 } from 'lucide-react';
import { WatchProgress } from '@/types/media';
import {
  getContinueWatching,
  removeWatchProgress,
  saveWatchProgress,
  removeFromWatchlist,
} from '@/lib/storage';

export const ContinueWatchingRail: React.FC = () => {
  const [history, setHistory] = useState<WatchProgress[]>([]);
  const [recentlyRemoved, setRecentlyRemoved] = useState<WatchProgress | null>(null);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateHistory = () => {
      setHistory(getContinueWatching());
    };
    updateHistory();
    window.addEventListener('cinemahd_storage_change', updateHistory);
    return () => window.removeEventListener('cinemahd_storage_change', updateHistory);
  }, []);

  const handleRemove = (e: React.MouseEvent, item: WatchProgress) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Optimistically remove from state immediately
    setHistory((prev) =>
      prev.filter(
        (p) =>
          String(p.mediaId) !== String(item.mediaId) &&
          Number(p.mediaId) !== Number(item.mediaId)
      )
    );

    // 2. Remove from both playback progress and watchlist
    removeWatchProgress(item.mediaId);
    removeFromWatchlist(item.mediaId);

    // 3. Trigger smart Undo Toast
    if (toastTimer) clearTimeout(toastTimer);
    setRecentlyRemoved(item);

    const timer = setTimeout(() => {
      setRecentlyRemoved(null);
    }, 4500);
    setToastTimer(timer);
  };

  const handleUndo = () => {
    if (!recentlyRemoved) return;
    saveWatchProgress(recentlyRemoved);
    setHistory((prev) => [recentlyRemoved, ...prev]);
    setRecentlyRemoved(null);
    if (toastTimer) clearTimeout(toastTimer);
  };

  if (history.length === 0 && !recentlyRemoved) return null;

  return (
    <>
      <section className="relative w-full py-4 sm:py-6">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
              Continue Watching
            </h2>
            <span className="ml-1 rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
              {history.length}
            </span>
          </div>

          <Link
            href="/watchlist"
            className="text-xs font-semibold text-white/50 hover:text-amber-400 transition-colors"
          >
            Manage Library →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-2">
          <AnimatePresence mode="popLayout">
            {history.map((item) => {
              const watchUrl =
                item.mediaType === 'tv'
                  ? `/watch/tv/${item.mediaId}?season=${item.season || 1}&episode=${item.episode || 1}`
                  : `/watch/movie/${item.mediaId}`;

              const percent = Math.min(100, Math.max(10, Math.round(item.percentageWatched || 35)));

              return (
                <motion.div
                  key={`${item.mediaType}-${item.mediaId}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.2 } }}
                  className="group relative w-[240px] sm:w-[280px] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#141418] hover:border-amber-400/40 transition-all shadow-lg hover:shadow-2xl"
                >
                  {/* Clickable Card Link */}
                  <Link
                    href={watchUrl}
                    className="block relative aspect-[16/10] overflow-hidden"
                  >
                    <img
                      src={item.backdropPath || item.posterPath}
                      alt={item.title}
                      className="h-full w-full object-cover brightness-[0.88] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 pointer-events-none"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/40 to-transparent pointer-events-none" />

                    {/* Play Button Center Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      </div>
                    </div>

                    {/* Info & Progress bar */}
                    <div className="absolute inset-x-3.5 bottom-2.5 z-10 pointer-events-none">
                      <h4 className="truncate text-sm font-semibold text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      {item.season && item.episode && (
                        <p className="text-xs text-amber-300/90 font-medium truncate mt-0.5">
                          S{item.season}:E{item.episode} {item.episodeTitle ? `— ${item.episodeTitle}` : ''}
                        </p>
                      )}

                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Dedicated, Unblocked Top-Right Remove X Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item)}
                    className="absolute top-2.5 right-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white/80 border border-white/20 backdrop-blur-md hover:bg-rose-600 hover:text-white hover:border-rose-500 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
                    title={`Remove "${item.title}" from continue watching`}
                    aria-label={`Remove ${item.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Smart Floating Undo Toast */}
      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-white/15 bg-[#121216]/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-white/90 font-medium truncate max-w-[220px] sm:max-w-[320px]">
              Removed <strong className="text-white">&quot;{recentlyRemoved.title}&quot;</strong>
            </span>
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Undo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
