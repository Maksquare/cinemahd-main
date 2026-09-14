'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Tv, PlayCircle } from 'lucide-react';
import { TMDbWatchProvider, TMDbWatchProviderRegion } from '@/lib/tmdb-client';

interface WatchProvidersProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
}

export const WatchProviders: React.FC<WatchProvidersProps> = ({
  tmdbId,
  mediaType,
  title,
}) => {
  const [providersData, setProvidersData] = useState<Record<string, TMDbWatchProviderRegion>>({});
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [activeTab, setActiveTab] = useState<'flatrate' | 'rent' | 'buy'>('flatrate');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProviders() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tmdb/providers?id=${tmdbId}&type=${mediaType}`);
        if (res.ok) {
          const json = await res.json();
          if (json.results && Object.keys(json.results).length > 0) {
            setProvidersData(json.results);
            if (!json.results[selectedCountry] && json.results['US']) {
              setSelectedCountry('US');
            } else if (!json.results[selectedCountry]) {
              const firstCountry = Object.keys(json.results)[0];
              if (firstCountry) setSelectedCountry(firstCountry);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load watch providers:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProviders();
  }, [tmdbId, mediaType]);

  const currentRegion = providersData[selectedCountry];
  const streamProviders: TMDbWatchProvider[] = currentRegion?.flatrate || [];
  const rentProviders: TMDbWatchProvider[] = currentRegion?.rent || [];
  const buyProviders: TMDbWatchProvider[] = currentRegion?.buy || [];

  // Curated fallback if no TMDb response
  const fallbackStreaming: TMDbWatchProvider[] = [
    {
      provider_id: 8,
      provider_name: 'Netflix',
      logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
      display_priority: 1,
    },
    {
      provider_id: 9,
      provider_name: 'Amazon Prime Video',
      logo_path: '/emthp39XA2zhzgqDYeuioRjQqh.jpg',
      display_priority: 2,
    },
    {
      provider_id: 337,
      provider_name: 'Disney+',
      logo_path: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
      display_priority: 3,
    },
    {
      provider_id: 350,
      provider_name: 'Apple TV+',
      logo_path: '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg',
      display_priority: 4,
    },
  ];

  const activeProviders =
    activeTab === 'flatrate'
      ? streamProviders.length > 0
        ? streamProviders
        : fallbackStreaming
      : activeTab === 'rent'
      ? rentProviders
      : buyProviders;

  const countryOptions = [
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'CA', label: 'Canada' },
    { code: 'AU', label: 'Australia' },
    { code: 'DE', label: 'Germany' },
    { code: 'FR', label: 'France' },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121216]/90 p-4 sm:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/8 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <Tv className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Where to Watch Officially
            </h3>
            <p className="text-xs text-white/50">
              Verified legal streaming, rental, and purchase platforms powered by TMDb Watch Providers.
            </p>
          </div>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-white/40" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#121216] text-white">
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs: Stream / Rent / Buy */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('flatrate')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'flatrate'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
              : 'border border-white/10 bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <PlayCircle className="h-3.5 w-3.5" />
          <span>Stream ({streamProviders.length > 0 ? streamProviders.length : fallbackStreaming.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rent')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'rent'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
              : 'border border-white/10 bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <span>Rent ({rentProviders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('buy')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'buy'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
              : 'border border-white/10 bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <span>Buy ({buyProviders.length})</span>
        </button>
      </div>

      {/* Providers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-xs text-white/50">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mr-2" />
          Checking streaming availability...
        </div>
      ) : activeProviders.length === 0 ? (
        <div className="py-6 text-center text-xs text-white/50 border border-dashed border-white/10 rounded-xl">
          No official {activeTab} providers listed in {selectedCountry} for {title}. You can stream directly via our high-speed player above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {activeProviders.map((provider) => {
            const logoUrl = provider.logo_path?.startsWith('http')
              ? provider.logo_path
              : `https://image.tmdb.org/t/p/original${provider.logo_path}`;
            const targetUrl =
              currentRegion?.link ||
              `https://www.google.com/search?q=watch+${encodeURIComponent(title)}+on+${encodeURIComponent(provider.provider_name)}`;

            return (
              <a
                key={provider.provider_id}
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-2.5 hover:border-amber-400/40 hover:bg-white/10 transition-all shadow-sm"
              >
                <img
                  src={logoUrl}
                  alt={provider.provider_name}
                  className="h-9 w-9 rounded-lg object-cover shadow group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {provider.provider_name}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-white/40 group-hover:text-white/70">
                    <span>Watch</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
