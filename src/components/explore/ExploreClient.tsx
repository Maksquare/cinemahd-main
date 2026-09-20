'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Sparkles, Film, Tv, Flame, Globe, RotateCcw } from 'lucide-react';
import { MediaCard } from '@/components/media/MediaCard';
import { Category, MediaItem, MediaCatalogResponse } from '@/types/media';
import { AdBanner300x250 } from '@/components/ads/AdBanner300x250';
import { AdBanner728x90 } from '@/components/ads/AdBanner728x90';

interface ExploreClientProps {
  initialCatalog?: MediaCatalogResponse;
}

export function ExploreClient({ initialCatalog }: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlType = (searchParams.get('type') as Category) || 'all';

  const [selectedCategory, setSelectedCategory] = useState<Category>(urlType);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popularity' | 'rating'>('newest');
  const [catalog] = useState<MediaCatalogResponse | null>(initialCatalog || null);

  // Parse release date reliably into milliseconds
  const getReleaseTime = (dateStr?: string) => {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    if (!isNaN(t)) return t;
    const yr = parseInt(dateStr, 10);
    if (!isNaN(yr)) return new Date(yr, 0, 1).getTime();
    return 0;
  };

  // Sync state if URL query param changes
  useEffect(() => {
    if (urlType) {
      setSelectedCategory(urlType);
      setSelectedGenre('All');
    }
  }, [urlType]);

  // Base items for the currently selected category
  const baseCategoryItems = useMemo<MediaItem[]>(() => {
    if (!catalog) return [];

    let items: MediaItem[] = [];
    if (selectedCategory === 'movie') {
      items =
        catalog.popularMovies && catalog.popularMovies.length > 0
          ? catalog.popularMovies
          : catalog.all.filter((m) => m.mediaType === 'movie' || m.category === 'movie');
    } else if (selectedCategory === 'tv') {
      items =
        catalog.popularTV && catalog.popularTV.length > 0
          ? catalog.popularTV
          : catalog.all.filter((m) => m.mediaType === 'tv' || m.category === 'tv');
    } else if (selectedCategory === 'anime') {
      items =
        catalog.anime && catalog.anime.length > 0
          ? catalog.anime
          : catalog.all.filter((m) => m.category === 'anime');
    } else if (selectedCategory === 'asian') {
      items =
        catalog.asian && catalog.asian.length > 0
          ? catalog.asian
          : catalog.all.filter((m) => m.category === 'asian');
    } else {
      items = catalog.all || [];
    }

    return [...items].sort((a, b) => getReleaseTime(b.releaseDate) - getReleaseTime(a.releaseDate));
  }, [catalog, selectedCategory]);

  // Extract all unique genres for the selected category
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    baseCategoryItems.forEach((item) => {
      (item.genres || []).forEach((g) => genresSet.add(g));
    });
    return ['All', ...Array.from(genresSet).sort()];
  }, [baseCategoryItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...baseCategoryItems];

    if (selectedGenre !== 'All') {
      result = result.filter((item) => item.genres?.includes(selectedGenre));
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => getReleaseTime(b.releaseDate) - getReleaseTime(a.releaseDate));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => getReleaseTime(a.releaseDate) - getReleaseTime(b.releaseDate));
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
    }

    return result;
  }, [baseCategoryItems, selectedGenre, sortBy]);

  const handleCategorySelect = (catId: Category) => {
    setSelectedCategory(catId);
    setSelectedGenre('All');
    router.replace(catId === 'all' ? '/explore' : `/explore?type=${catId}`, { scroll: false });
  };

  const categories: {
    id: Category;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'all', label: 'All Titles', icon: Sparkles },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'anime', label: 'Anime', icon: Flame },
    { id: 'asian', label: 'Asian Dramas', icon: Globe },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Filter className="h-7 w-7 text-amber-400" />
            Explore Movie & Series Database
          </h1>
          <p className="mt-1 text-sm text-white/50 max-w-2xl">
            Stream from hundreds of verified 4K movies, television series, anime, and international dramas.
            Optimized for fast playback on mobile and home connections across Ethiopia and worldwide.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-white/12 bg-[#121216] px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            <option value="newest">Release Date: Latest to Oldest</option>
            <option value="oldest">Release Date: Oldest to Latest</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                  : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mr-1 shrink-0">
          Genre:
        </span>
        {allGenres.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white/20 text-white border border-white/30 shadow'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Sponsored 728x90 Leaderboard Unit */}
      <div className="mb-6 flex justify-center">
        <AdBanner728x90 />
      </div>

      {/* Results Count & Reset Filter */}
      <div className="mb-4 flex items-center justify-between text-xs text-white/50">
        <span>{`Showing ${filteredItems.length} titles`}</span>
        {(selectedCategory !== 'all' || selectedGenre !== 'All') && (
          <button
            type="button"
            onClick={() => {
              handleCategorySelect('all');
              setSelectedGenre('All');
            }}
            className="flex items-center gap-1.5 text-amber-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Media Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
          <p className="text-lg font-semibold text-white">No titles match the chosen filters.</p>
          <p className="mt-1 text-sm text-white/40">Try resetting the genre or category filter.</p>
          <button
            type="button"
            onClick={() => {
              handleCategorySelect('all');
              setSelectedGenre('All');
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MediaCard key={`${item.mediaType}-${item.id}`} media={item} variant="backdrop" />
          ))}
        </div>
      )}

      {/* Sponsored 300x250 Ad Unit */}
      <div className="mt-12 flex justify-center border-t border-white/8 pt-8">
        <AdBanner300x250 />
      </div>
    </div>
  );
}
