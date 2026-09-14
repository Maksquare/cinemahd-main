'use client';

import React, { useState, useEffect } from 'react';
import { Play, Tv, Clock, Star, Sparkles } from 'lucide-react';
import { MediaItem, Season, Episode } from '@/types/media';
import { getSeasonEpisodes } from '@/lib/tmdb';

interface EpisodePickerProps {
  media: MediaItem;
  currentSeason: number;
  currentEpisode: number;
  onSelectEpisode: (season: number, episode: number) => void;
}

export const EpisodePicker: React.FC<EpisodePickerProps> = ({
  media,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
}) => {
  const seasons: Season[] = media.seasons && media.seasons.length > 0
    ? media.seasons
    : [
        {
          id: 1,
          seasonNumber: 1,
          name: 'Season 1',
          episodeCount: media.totalEpisodes || 10,
          episodes: Array.from({ length: media.totalEpisodes || 10 }).map((_, i) => ({
            id: i + 1,
            seasonNumber: 1,
            episodeNumber: i + 1,
            name: `Episode ${i + 1}`,
            overview: `Episode ${i + 1} of ${media.title}.`,
            durationMinutes: 45,
          })),
        },
      ];

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(currentSeason);
  const [episodesCache, setEpisodesCache] = useState<Record<number, Episode[]>>(() => {
    const initialMap: Record<number, Episode[]> = {};
    seasons.forEach((s) => {
      if (s.episodes && s.episodes.length > 0) {
        initialMap[s.seasonNumber] = s.episodes;
      }
    });
    return initialMap;
  });
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  const activeSeason = seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  // Fetch authentic episode titles and details from TMDb if not already cached
  useEffect(() => {
    let isMounted = true;
    async function loadEpisodes() {
      const cached = episodesCache[selectedSeasonNumber];
      const hasRealTitles = cached && cached.some((ep) => !ep.name.match(/^Episode \d+$/i));
      
      if (!cached || !hasRealTitles) {
        setIsLoadingEpisodes(true);
        try {
          const fresh = await getSeasonEpisodes(media.id, selectedSeasonNumber);
          if (isMounted && fresh && fresh.length > 0) {
            setEpisodesCache((prev) => ({
              ...prev,
              [selectedSeasonNumber]: fresh,
            }));
          }
        } catch (e) {
          console.error('Failed to load season episodes:', e);
        } finally {
          if (isMounted) setIsLoadingEpisodes(false);
        }
      }
    }

    loadEpisodes();
    return () => {
      isMounted = false;
    };
  }, [media.id, selectedSeasonNumber]);

  const episodes: Episode[] = episodesCache[selectedSeasonNumber] ||
    activeSeason.episodes ||
    Array.from({ length: activeSeason.episodeCount || 10 }).map((_, i) => ({
      id: i + 1,
      seasonNumber: activeSeason.seasonNumber,
      episodeNumber: i + 1,
      name: `Episode ${i + 1}`,
      overview: `Episode ${i + 1} of Season ${activeSeason.seasonNumber}.`,
      durationMinutes: 45,
    }));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121216]/90 p-4 sm:p-6 backdrop-blur-xl">
      {/* Header & Season Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/8 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Tv className="h-5 w-5 text-amber-400" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
            Episodes Guide
          </h3>
          <span className="text-xs text-white/50">
            ({media.totalSeasons || seasons.length} Seasons • {episodes.length} Episodes)
          </span>
          {isLoadingEpisodes && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400/80 animate-pulse ml-2">
              <Sparkles className="h-3 w-3" />
              Loading titles...
            </span>
          )}
        </div>

        {/* Season Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {seasons.map((s) => {
            const isSeasonSelected = s.seasonNumber === selectedSeasonNumber;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSeasonSelected
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {s.name || `Season ${s.seasonNumber}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {episodes.map((ep) => {
          const isPlaying =
            currentSeason === activeSeason.seasonNumber &&
            currentEpisode === ep.episodeNumber;

          return (
            <div
              key={ep.id || `${ep.seasonNumber}-${ep.episodeNumber}`}
              onClick={() => onSelectEpisode(activeSeason.seasonNumber, ep.episodeNumber)}
              className={`group flex flex-col sm:flex-row items-start gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                isPlaying
                  ? 'border-amber-400/80 bg-amber-400/10 shadow-lg shadow-amber-500/10'
                  : 'border-white/8 bg-white/5 hover:border-white/25 hover:bg-white/8'
              }`}
            >
              {/* Thumbnail or Badge */}
              {ep.stillPath ? (
                <div className="relative w-full sm:w-28 sm:h-20 aspect-video sm:aspect-auto rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/10">
                  <img
                    src={ep.stillPath}
                    alt={ep.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                    E{ep.episodeNumber}
                  </div>
                  {isPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-black">
                        <Play className="h-3.5 w-3.5 fill-black ml-0.5" />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                    isPlaying
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/10 text-white/80 group-hover:bg-amber-400/20 group-hover:text-amber-300'
                  }`}
                >
                  {isPlaying ? <Play className="h-4 w-4 fill-black ml-0.5" /> : `E${ep.episodeNumber}`}
                </div>
              )}

              {/* Title & Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <h4
                    className={`line-clamp-1 text-sm font-semibold ${
                      isPlaying ? 'text-amber-300' : 'text-white group-hover:text-amber-300 transition-colors'
                    }`}
                    title={ep.name}
                  >
                    {ep.name}
                  </h4>
                  {ep.durationMinutes && (
                    <span className="flex items-center gap-1 text-[10px] text-white/40 shrink-0">
                      <Clock className="h-2.5 w-2.5" />
                      {ep.durationMinutes}m
                    </span>
                  )}
                </div>

                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/40 font-medium">
                  <span className="text-amber-300/80 font-bold">Episode {ep.episodeNumber}</span>
                  {ep.voteAverage ? (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        {ep.voteAverage}
                      </span>
                    </>
                  ) : null}
                  {ep.airDate && (
                    <>
                      <span>•</span>
                      <span>{ep.airDate.split('-')[0]}</span>
                    </>
                  )}
                </div>

                {ep.overview && (
                  <p className="mt-1 line-clamp-2 text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                    {ep.overview}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
