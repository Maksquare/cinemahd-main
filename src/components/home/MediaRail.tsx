'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { MediaCard } from '@/components/media/MediaCard';

interface MediaRailProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  variant?: 'backdrop' | 'poster';
  showRanks?: boolean;
  seeAllHref?: string;
}

export const MediaRail: React.FC<MediaRailProps> = ({
  title,
  subtitle,
  items,
  variant = 'backdrop',
  showRanks = false,
  seeAllHref,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full py-4 sm:py-6">
      {/* Rail Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-white/50 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 mr-2 transition-colors"
            >
              See All
            </Link>
          )}

          {/* Navigation Scroll Chevrons */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/15 hover:text-white transition-all shadow"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/15 hover:text-white transition-all shadow"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rail Slider Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-2"
      >
        {items.map((media, index) => (
          <div
            key={media.id}
            className={
              variant === 'poster'
                ? 'w-[140px] sm:w-[170px] md:w-[190px] shrink-0'
                : 'w-[260px] sm:w-[300px] md:w-[340px] shrink-0'
            }
          >
            <MediaCard
              media={media}
              rank={showRanks ? index + 1 : undefined}
              variant={variant}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
