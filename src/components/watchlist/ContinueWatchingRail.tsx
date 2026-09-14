'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Clock, X } from 'lucide-react';
import { WatchProgress } from '@/types/media';
import { getContinueWatching, removeWatchProgress } from '@/lib/storage';

export const ContinueWatchingRail: React.FC = () => {
  const [history, setHistory] = useState<WatchProgress[]>([]);

  useEffect(() => {
    const updateHistory = () => {
      setHistory(getContinueWatching());
    };
    updateHistory();
    window.addEventListener('cinemahd_storage_change', updateHistory);
    return () => window.removeEventListener('cinemahd_storage_change', updateHistory);
  }, []);

  const handleRemove = (e: React.MouseEvent, mediaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeWatchProgress(mediaId);
  };

  if (history.length === 0) return null;

  return (
    <section className="relative w-full py-4 sm:py-6">
      <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 mb-3">
        <Clock className="h-5 w-5 text-amber-400" />
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
          Continue Watching
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-2">
        {history.map((item) => (
          <div
            key={item.mediaId}
            className="group relative w-[240px] sm:w-[280px] shrink-0 rounded-xl overflow-hidden border border-white/10 bg-[#141418] hover:border-white/25 transition-all shadow-md"
          >
            <Link
              href={`/watch/${item.mediaType}/${item.mediaId}?season=${item.season || 1}&episode=${item.episode || 1}`}
              className="block relative aspect-[16/10] overflow-hidden"
            >
              <img
                src={item.backdropPath || item.posterPath}
                alt={item.title}
                className="h-full w-full object-cover brightness-[0.9] group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => handleRemove(e, item.mediaId)}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/70 hover:bg-red-500/80 hover:text-white transition-colors"
                title="Remove from history"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg">
                  <Play className="h-4 w-4 fill-black ml-0.5" />
                </div>
              </div>

              {/* Info & Progress bar */}
              <div className="absolute inset-x-3 bottom-2 z-10">
                <h4 className="truncate text-sm font-semibold text-white drop-shadow">
                  {item.title}
                </h4>
                {item.season && item.episode && (
                  <p className="text-xs text-amber-300 font-medium">
                    S{item.season}:E{item.episode} {item.episodeTitle ? `— ${item.episodeTitle}` : ''}
                  </p>
                )}

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentageWatched || 35}%` }}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
