'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, Bookmark, Star, Calendar, Clock, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { TrailerModal } from '@/components/media/TrailerModal';
import { toggleWatchlist, isInWatchlist } from '@/lib/storage';

interface HeroSpotlightProps {
  items: MediaItem[];
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const featured = items.slice(0, 5);
  const current = featured[currentIndex] || items[0];

  // Auto-advance banner every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length]);

  // Update bookmark status when current changes
  useEffect(() => {
    if (current) {
      setIsBookmarked(isInWatchlist(current.id));
    }
  }, [current]);

  const handleWatchlistToggle = () => {
    if (!current) return;
    const added = toggleWatchlist(current);
    setIsBookmarked(added);
  };

  if (!current) return null;

  return (
    <>
      <div className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-end">
        {/* Animated Backdrop Image with Ken Burns effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0 select-none"
          >
            <Image
              src={current.backdropPath}
              alt={`${current.title} backdrop`}
              fill
              priority={currentIndex === 0}
              sizes="100vw"
              className="object-cover object-center filter brightness-[0.75] contrast-[1.08]"
            />
            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/80 to-transparent w-full md:w-3/4" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-24">
          <div className="max-w-2xl">
            {/* Badges & Meta */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`meta-${current.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-2.5 mb-3"
              >
                <span className="rounded-md border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                  Featured #{currentIndex + 1}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-black/50 border border-white/10 px-2 py-0.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  {current.voteAverage}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/70 font-medium">
                  <Calendar className="h-3 w-3 text-white/40" />
                  {current.releaseDate.split('-')[0]}
                </span>
                {current.durationMinutes && (
                  <span className="flex items-center gap-1 text-xs text-white/70 font-medium">
                    <Clock className="h-3 w-3 text-white/40" />
                    {Math.floor(current.durationMinutes / 60)}h {current.durationMinutes % 60}m
                  </span>
                )}
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white/80 uppercase">
                  4K Ultra HD
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${current.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45 }}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                {current.title}
              </motion.h2>
            </AnimatePresence>

            {/* Tagline / Genres */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-amber-200/90 font-medium">
              {current.genres.map((g) => (
                <span key={g} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5">
                  {g}
                </span>
              ))}
            </div>

            {/* Overview */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3.5 line-clamp-3 text-sm sm:text-base text-white/80 leading-relaxed drop-shadow"
              >
                {current.overview}
              </motion.p>
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/watch/${current.mediaType}/${current.id}`}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-3 text-sm sm:text-base font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40"
              >
                <Play className="h-4 w-4 fill-black" />
                <span>Watch Now</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {current.trailerYoutubeKey && (
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/15"
                >
                  <Film className="h-4 w-4 text-amber-400" />
                  <span>Trailer</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleWatchlistToggle}
                className={`inline-flex items-center justify-center h-12 w-12 rounded-full border backdrop-blur-md transition-all ${
                  isBookmarked
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                    : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label="Toggle Watchlist"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex items-center gap-2">
            {featured.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={current.trailerYoutubeKey}
        title={current.title}
      />
    </>
  );
};
