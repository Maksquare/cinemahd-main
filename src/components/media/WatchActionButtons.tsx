'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Check, Film, Share2 } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { toggleWatchlist, isInWatchlist, toggleWatched, isWatched } from '@/lib/storage';

interface WatchActionButtonsProps {
  media: MediaItem;
  onOpenTrailer: () => void;
}

export const WatchActionButtons: React.FC<WatchActionButtonsProps> = ({
  media,
  onOpenTrailer,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsBookmarked(isInWatchlist(media.id));
    setHasWatched(isWatched(media.id));
  }, [media.id]);

  const handleWatchlistToggle = () => {
    const added = toggleWatchlist(media);
    setIsBookmarked(added);
  };

  const handleWatchedToggle = () => {
    const watchedNow = toggleWatched(media.id);
    setHasWatched(watchedNow);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mt-4 space-y-2.5">
      <button
        type="button"
        onClick={handleWatchlistToggle}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
          isBookmarked
            ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
            : 'border border-white/12 bg-white/5 text-white hover:bg-white/10'
        }`}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-black' : ''}`} />
        <span>{isBookmarked ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
      </button>

      <button
        type="button"
        onClick={handleWatchedToggle}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
          hasWatched
            ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
            : 'border border-white/12 bg-white/5 text-white hover:bg-white/10'
        }`}
      >
        <Check className="h-4 w-4" />
        <span>{hasWatched ? 'Marked as Watched' : 'Mark as Watched'}</span>
      </button>

      {media.trailerYoutubeKey && (
        <button
          type="button"
          onClick={onOpenTrailer}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Film className="h-4 w-4 text-amber-400" />
          <span>Watch Trailer</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/8 py-2 text-xs font-medium text-white/60 hover:text-white transition-all cursor-pointer"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>{copied ? 'Link Copied to Clipboard!' : 'Share Stream Link'}</span>
      </button>
    </div>
  );
};
