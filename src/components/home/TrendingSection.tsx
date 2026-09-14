'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { MediaItem, TrendingWindow } from '@/types/media';
import { MediaRail } from '@/components/home/MediaRail';

interface TrendingSectionProps {
  initialItems?: MediaItem[];
  trendingDay?: MediaItem[];
  trendingWeek?: MediaItem[];
  trendingMonth?: MediaItem[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  initialItems = [],
  trendingDay = [],
  trendingWeek = [],
  trendingMonth = [],
}) => {
  const [windowState, setWindowState] = useState<TrendingWindow>('day');

  // Return true live TMDb ranked titles for each time window
  const getItemsForWindow = (win: TrendingWindow): MediaItem[] => {
    if (win === 'day') {
      return trendingDay.length > 0 ? trendingDay : initialItems;
    } else if (win === 'week') {
      return trendingWeek.length > 0 ? trendingWeek : initialItems;
    } else {
      return trendingMonth.length > 0 ? trendingMonth : initialItems;
    }
  };

  const currentItems = getItemsForWindow(windowState);

  const tabs: { id: TrendingWindow; label: string }[] = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  return (
    <div className="relative w-full py-4">
      {/* Trending Header with Time Window Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 mb-2">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-amber-400" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            Trending Now
          </h2>
        </div>

        {/* Day / Week / Month Switcher Pills */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {tabs.map((tab) => {
            const isActive = windowState === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setWindowState(tab.id)}
                className={`relative rounded-full px-3.5 py-1 text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="trendingWindowActive"
                    className="absolute inset-0 rounded-full bg-amber-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Rail with Phonofilm style ranking badges */}
      <AnimatePresence mode="wait">
        <motion.div
          key={windowState}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MediaRail
            title=""
            items={currentItems}
            showRanks={true}
            variant="backdrop"
            seeAllHref="/explore"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
