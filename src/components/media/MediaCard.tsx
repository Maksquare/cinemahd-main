'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Bookmark, Check, Play, Film } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { toggleWatchlist, isInWatchlist, toggleWatched, isWatched } from '@/lib/storage';
import { TrailerModal } from '@/components/media/TrailerModal';

interface MediaCardProps {
  media: MediaItem;
  rank?: number;
  variant?: 'backdrop' | 'poster';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  rank,
  variant = 'backdrop',
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [watched, setWatched] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    setBookmarked(isInWatchlist(media.id));
    setWatched(isWatched(media.id));
  }, [media.id]);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWatchlist(media);
    setBookmarked(updated);
  };

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWatched(media.id);
    setWatched(updated);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTrailerOpen(true);
  };

  const isPoster = variant === 'poster';
  const initialImg = isPoster
    ? (media.posterPath || media.backdropPath)
    : (media.backdropPath || media.posterPath);
  const fallbackCinemaImg = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

  const [imgSrc, setImgSrc] = useState<string>(initialImg || fallbackCinemaImg);

  useEffect(() => {
    const nextImg = isPoster
      ? (media.posterPath || media.backdropPath)
      : (media.backdropPath || media.posterPath);
    setImgSrc(nextImg || fallbackCinemaImg);
  }, [media.posterPath, media.backdropPath, isPoster]);

  const handleImageError = () => {
    if (!isPoster && media.posterPath && imgSrc !== media.posterPath && imgSrc !== fallbackCinemaImg) {
      setImgSrc(media.posterPath);
    } else if (imgSrc !== fallbackCinemaImg) {
      setImgSrc(fallbackCinemaImg);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col shrink-0">
        <Link
          href={`/watch/${media.mediaType}/${media.id}`}
          className="block relative overflow-hidden rounded-2xl border border-white/10 bg-[#141418] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
        >
          {/* Card Media Image */}
          <div
            className={`relative overflow-hidden w-full bg-[#16161c] ${
              isPoster ? 'aspect-[2/3]' : 'aspect-[16/10] sm:aspect-[1.45/1]'
            }`}
          >
            <img
              src={imgSrc}
              alt={media.title}
              loading="lazy"
              onError={handleImageError}
              className="h-full w-full object-cover brightness-[1.02] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/30 to-black/5 opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top Right Floating Action Buttons */}
            <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={handleWatchlistClick}
                className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all shadow-md ${
                  bookmarked
                    ? 'border-amber-400 bg-amber-400 text-black'
                    : 'border-white/15 bg-black/60 text-white/80 hover:border-amber-400/50 hover:bg-amber-400/20 hover:text-amber-300'
                }`}
                title={bookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                aria-label="Add to Watchlist"
              >
                <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-black' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleWatchedClick}
                className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all shadow-md ${
                  watched
                    ? 'border-emerald-400 bg-emerald-400 text-black'
                    : 'border-white/15 bg-black/60 text-white/80 hover:border-emerald-400/50 hover:bg-emerald-400/20 hover:text-emerald-300'
                }`}
                title={watched ? 'Watched' : 'Mark as Watched'}
                aria-label="Mark as Watched"
              >
                <Check className="h-3.5 w-3.5" />
              </button>

              {media.trailerYoutubeKey && (
                <button
                  type="button"
                  onClick={handleTrailerClick}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 hover:text-white shadow-md"
                  title="Watch Trailer"
                  aria-label="Watch Trailer"
                >
                  <Film className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Hover Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/90 text-black shadow-xl backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform">
                <Play className="h-5 w-5 fill-black ml-0.5" />
              </div>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute inset-x-3 bottom-2.5 flex items-end gap-2.5 z-10">
              {rank !== undefined && (
                <span className="rank-numeral shrink-0 select-none">
                  {rank}
                </span>
              )}

              <div className="min-w-0 flex-1 pb-0.5">
                <h3 className="line-clamp-1 text-sm sm:text-base font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] group-hover:text-amber-300 transition-colors">
                  {media.title}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-white/75">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                    {media.voteAverage}
                  </span>
                  <span>•</span>
                  <span>{media.releaseDate.split('-')[0]}</span>
                  <span>•</span>
                  <span className="truncate">{media.genres[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={media.trailerYoutubeKey}
        title={media.title}
      />
    </>
  );
};
