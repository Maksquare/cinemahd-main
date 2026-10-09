'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HeroSpotlight } from '@/components/hero/HeroSpotlight';
import { CategoryPills } from '@/components/home/CategoryPills';
import { TrendingSection } from '@/components/home/TrendingSection';
import { MediaRail } from '@/components/home/MediaRail';
import { MediaCard } from '@/components/media/MediaCard';
import { ContinueWatchingRail } from '@/components/watchlist/ContinueWatchingRail';
import { Category, MediaItem, MediaCatalogResponse } from '@/types/media';
import { sortMediaChronologically } from '@/lib/tmdb';
import { Flame, ArrowUpDown, Calendar, Grid3X3, Film, Tv, Globe, Sparkles, ExternalLink } from 'lucide-react';
import { AdBanner300x250 } from '@/components/ads/AdBanner300x250';
import { AdBanner728x90 } from '@/components/ads/AdBanner728x90';
import { AdNativeBanner } from '@/components/ads/AdNativeBanner';

interface HomeClientContentProps {
  initialCatalog: MediaCatalogResponse;
}

export const HomeClientContent: React.FC<HomeClientContentProps> = ({ initialCatalog }) => {
  const [catalog, setCatalog] = useState<MediaCatalogResponse>(initialCatalog);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [categorySortOrder, setCategorySortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'rail'>('grid');

  // Background hydration to ensure fresh live data if initial server render had partial data
  useEffect(() => {
    if (!catalog.all || catalog.all.length < 30) {
      fetch('/api/media')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.all && data.all.length > 0) {
            setCatalog(data);
          }
        })
        .catch((err) => console.error('Failed to sync live catalog:', err));
    }
  }, [catalog.all]);

  const spotlightItems = useMemo(() => {
    return catalog.trendingDay && catalog.trendingDay.length > 0
      ? catalog.trendingDay
      : catalog.all;
  }, [catalog]);

  const latestReleases = useMemo(() => {
    const list =
      catalog.nowPlaying && catalog.nowPlaying.length > 0
        ? catalog.nowPlaying
        : catalog.all.slice(0, 20);
    return sortMediaChronologically(list, 'desc');
  }, [catalog]);

  const movies = useMemo(() => {
    const list =
      catalog.popularMovies && catalog.popularMovies.length > 0
        ? catalog.popularMovies
        : catalog.all.filter((m) => m.category === 'movie' || m.mediaType === 'movie');
    return sortMediaChronologically(list, 'desc');
  }, [catalog]);

  const tvSeries = useMemo(() => {
    const list =
      catalog.popularTV && catalog.popularTV.length > 0
        ? catalog.popularTV
        : catalog.all.filter((m) => m.category === 'tv' || m.mediaType === 'tv');
    return sortMediaChronologically(list, 'desc');
  }, [catalog]);

  const anime = useMemo(() => {
    const list =
      catalog.anime && catalog.anime.length > 0
        ? catalog.anime
        : catalog.all.filter((m) => m.category === 'anime');
    return sortMediaChronologically(list, 'desc');
  }, [catalog]);

  const asian = useMemo(() => {
    const list =
      catalog.asian && catalog.asian.length > 0
        ? catalog.asian
        : catalog.all.filter((m) => m.category === 'asian');
    return sortMediaChronologically(list, 'desc');
  }, [catalog]);

  // Filtered and chronologically sorted list when a specific category is active
  const filteredCategoryItems = useMemo(() => {
    let rawList: MediaItem[] = [];
    if (activeCategory === 'movie') rawList = movies;
    else if (activeCategory === 'tv') rawList = tvSeries;
    else if (activeCategory === 'anime') rawList = anime;
    else if (activeCategory === 'asian') rawList = asian;
    else rawList = catalog.all || [];

    return sortMediaChronologically(rawList, categorySortOrder);
  }, [activeCategory, movies, tvSeries, anime, asian, catalog.all, categorySortOrder]);

  const getCategoryMeta = (cat: Category) => {
    switch (cat) {
      case 'movie':
        return {
          title: 'Movies in Chronological Order',
          subtitle: 'All feature films arranged by release date — stream in 4K HDR',
          icon: Film,
          exploreHref: '/explore?type=movie&sort=newest',
        };
      case 'tv':
        return {
          title: 'TV Series in Chronological Order',
          subtitle: 'All television series, seasons and episodes arranged by air date',
          icon: Tv,
          exploreHref: '/explore?type=tv&sort=newest',
        };
      case 'anime':
        return {
          title: 'Anime in Chronological Order',
          subtitle: 'All animation & battle shonen series arranged by release date',
          icon: Flame,
          exploreHref: '/explore?type=anime&sort=newest',
        };
      case 'asian':
        return {
          title: 'Asian Dramas in Chronological Order',
          subtitle: 'All K-dramas, romance and historical epics arranged chronologically',
          icon: Globe,
          exploreHref: '/explore?type=asian&sort=newest',
        };
      default:
        return {
          title: 'All Media in Chronological Order',
          subtitle: 'Complete library of movies and series arranged chronologically',
          icon: Sparkles,
          exploreHref: '/explore?sort=newest',
        };
    }
  };

  const currentMeta = getCategoryMeta(activeCategory);
  const MetaIcon = currentMeta.icon;

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

        {/* If a specific category filter is active, show ALL titles in chronological order */}
        {activeCategory !== 'all' ? (
          <div className="px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Category Header with Chronological Sort Controls */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
                      <MetaIcon className="h-4 w-4" />
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      {currentMeta.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60">
                    {currentMeta.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      <Calendar className="h-3 w-3" />
                      {categorySortOrder === 'desc'
                        ? 'Chronological: Newest First (2026 → Older)'
                        : 'Chronological: Oldest First (Classic → 2026)'}
                    </span>
                    <span className="text-xs text-white/40">
                      • {filteredCategoryItems.length} titles available
                    </span>
                  </div>
                </div>

                {/* Controls: Chronological Order Toggle & View Mode */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center rounded-full border border-white/12 bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => setCategorySortOrder('desc')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                        categorySortOrder === 'desc'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      Newest First
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategorySortOrder('asc')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                        categorySortOrder === 'asc'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      Oldest First
                    </button>
                  </div>

                  <div className="flex items-center rounded-full border border-white/12 bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white/20 text-white shadow'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Grid View (All Titles)"
                    >
                      <Grid3X3 className="h-3.5 w-3.5" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('rail')}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === 'rail'
                          ? 'bg-white/20 text-white shadow'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Horizontal Rail View"
                    >
                      Rail
                    </button>
                  </div>

                  <Link
                    href={currentMeta.exploreHref}
                    className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-all cursor-pointer"
                  >
                    <span>Advanced Filter</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Display View: Grid of ALL titles in chronological order */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
                {filteredCategoryItems.map((item) => (
                  <MediaCard
                    key={`${item.mediaType}-${item.id}`}
                    media={item}
                    variant="backdrop"
                  />
                ))}
              </div>
            ) : (
              <MediaRail
                title={currentMeta.title}
                subtitle={`Showing ${filteredCategoryItems.length} titles in chronological order`}
                items={filteredCategoryItems}
                variant="backdrop"
              />
            )}

            {/* Sponsored Native Banner */}
            <div className="my-8 flex justify-center">
              <AdBanner728x90 />
            </div>
          </div>
        ) : (
          <>
            {/* 4. Latest Theatrical / In-Theaters Releases (Chronological) */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 mb-[-12px]">
                <span className="flex items-center gap-1 rounded-md bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
                  In Theaters & Fresh Releases (Chronological)
                </span>
              </div>
              <MediaRail
                title="Latest Releases"
                subtitle="Newly arrived movies, seasons, and episodes in chronological release order"
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

            {/* 6. Blockbuster Movies Rail (All movies in chronological order) */}
            <MediaRail
              title="Movies (Chronological Order)"
              subtitle="All verified cinema releases arranged from latest 2026 hits to classic blockbusters"
              items={movies}
              variant="backdrop"
              seeAllHref="/explore?type=movie&sort=newest"
            />

            {/* 7. Trending TV Shows Rail (All TV series in chronological order) */}
            <MediaRail
              title="Series & Shows (Chronological Order)"
              subtitle="All acclaimed TV drama, thrillers and mysteries arranged by air date"
              items={tvSeries}
              variant="backdrop"
              seeAllHref="/explore?type=tv&sort=newest"
            />

            {/* Sponsored Native Recommendations Banner */}
            <AdNativeBanner />

            {/* 8. Anime Spotlight (All anime in chronological order) */}
            <MediaRail
              title="Anime (Chronological Order)"
              subtitle="All legendary anime battles, mythical worlds, and seasonal series in date order"
              items={anime}
              variant="backdrop"
              seeAllHref="/explore?type=anime&sort=newest"
            />

            {/* 9. Asian Dramas (All Asian dramas in chronological order) */}
            <MediaRail
              title="Asian Dramas & K-Dramas (Chronological Order)"
              subtitle="All top-rated romance, historical epics, and crime sagas arranged chronologically"
              items={asian}
              variant="backdrop"
              seeAllHref="/explore?type=asian&sort=newest"
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
