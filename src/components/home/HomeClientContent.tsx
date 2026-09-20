'use client';

import React, { useState } from 'react';
import { HeroSpotlight } from '@/components/hero/HeroSpotlight';
import { CategoryPills } from '@/components/home/CategoryPills';
import { TrendingSection } from '@/components/home/TrendingSection';
import { MediaRail } from '@/components/home/MediaRail';
import { ContinueWatchingRail } from '@/components/watchlist/ContinueWatchingRail';
import { Category, MediaItem, MediaCatalogResponse } from '@/types/media';
import { Flame } from 'lucide-react';
import { AdBanner300x250 } from '@/components/ads/AdBanner300x250';
import { AdBanner728x90 } from '@/components/ads/AdBanner728x90';
import { AdNativeBanner } from '@/components/ads/AdNativeBanner';

interface HomeClientContentProps {
  initialCatalog: MediaCatalogResponse;
}

export const HomeClientContent: React.FC<HomeClientContentProps> = ({ initialCatalog }) => {
  const [catalog] = useState<MediaCatalogResponse>(initialCatalog);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const spotlightItems =
    catalog.trendingDay && catalog.trendingDay.length > 0
      ? catalog.trendingDay
      : catalog.all;

  const latestReleases =
    catalog.nowPlaying && catalog.nowPlaying.length > 0
      ? catalog.nowPlaying
      : catalog.all.slice(0, 15);

  const movies =
    catalog.popularMovies && catalog.popularMovies.length > 0
      ? catalog.popularMovies
      : catalog.all.filter((m) => m.category === 'movie' || m.mediaType === 'movie');

  const tvSeries =
    catalog.popularTV && catalog.popularTV.length > 0
      ? catalog.popularTV
      : catalog.all.filter((m) => m.category === 'tv' || m.mediaType === 'tv');

  const anime =
    catalog.anime && catalog.anime.length > 0
      ? catalog.anime
      : catalog.all.filter((m) => m.category === 'anime');

  const asian =
    catalog.asian && catalog.asian.length > 0
      ? catalog.asian
      : catalog.all.filter((m) => m.category === 'asian');

  // Filtered list when user selects a specific category from pills
  const filteredList =
    activeCategory === 'all'
      ? catalog.all
      : activeCategory === 'movie'
      ? movies
      : activeCategory === 'tv'
      ? tvSeries
      : activeCategory === 'anime'
      ? anime
      : activeCategory === 'asian'
      ? asian
      : catalog.all.filter((m) => m.category === activeCategory);

  return (
    <div className="relative min-h-screen">
      {/* 1. High Impact Hero Spotlight Carousel with Real TMDb Day Trending */}
      <HeroSpotlight items={spotlightItems} />

      {/* 2. Category Filter Pills */}
      <div className="sticky top-16 sm:top-20 z-30 py-3 bg-[#0b0b0d]/85 backdrop-blur-md border-y border-white/5 shadow-md">
        <CategoryPills
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      <div className="mx-auto max-w-7xl px-0 py-6 space-y-8 sm:space-y-12">
        {/* 3. Continue Watching Rail */}
        <ContinueWatchingRail />

        {/* If a specific category filter is active, show the filtered grid */}
        {activeCategory !== 'all' ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <MediaRail
              title={`Explore: ${activeCategory.toUpperCase()}`}
              subtitle={`Showing newest titles in ${activeCategory}`}
              items={filteredList}
              variant="backdrop"
            />
          </div>
        ) : (
          <>
            {/* 4. Latest Theatrical / In-Theaters Releases */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 mb-[-12px]">
                <span className="flex items-center gap-1 rounded-md bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
                  In Theaters & Fresh Releases
                </span>
              </div>
              <MediaRail
                title="Latest Releases"
                subtitle="Newly arrived movies, seasons, and episodes currently playing"
                items={latestReleases}
                variant="backdrop"
                seeAllHref="/explore?sort=newest"
              />
            </div>

            {/* 5. Trending Section */}
            <TrendingSection
              initialItems={catalog.all}
              trendingDay={catalog.trendingDay}
              trendingWeek={catalog.trendingWeek}
              trendingMonth={catalog.popularMovies}
            />

            {/* Sponsored 300x250 Ad Banner */}
            <div className="my-6 flex justify-center">
              <AdBanner300x250 />
            </div>

            {/* 6. Blockbuster Movies Rail */}
            <MediaRail
              title="Blockbuster Movies"
              subtitle="The most popular cinema releases in 4K HDR"
              items={movies}
              variant="backdrop"
              seeAllHref="/explore?type=movie"
            />

            {/* 7. Trending TV Shows Rail */}
            <MediaRail
              title="Acclaimed Series"
              subtitle="Critically acclaimed drama, thrillers and mysteries"
              items={tvSeries}
              variant="backdrop"
              seeAllHref="/explore?type=tv"
            />

            {/* Sponsored Native Recommendations Banner */}
            <AdNativeBanner />

            {/* 8. Anime Spotlight */}
            <MediaRail
              title="Anime & Animation"
              subtitle="High-octane battles, legendary worlds, and breathtaking art"
              items={anime}
              variant="backdrop"
              seeAllHref="/explore?type=anime"
            />

            {/* 9. Asian Dramas */}
            <MediaRail
              title="Asian Dramas & K-Dramas"
              subtitle="Top-rated romance, historical epics, and crime sagas"
              items={asian}
              variant="backdrop"
              seeAllHref="/explore?type=asian"
            />

            {/* Sponsored 728x90 Leaderboard Banner */}
            <div className="my-10 flex justify-center">
              <AdBanner728x90 />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
