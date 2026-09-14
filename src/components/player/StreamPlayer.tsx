'use client';

import React, { useState, useEffect } from 'react';
import { MediaItem } from '@/types/media';
import { STREAM_SERVERS, getEmbedUrl } from '@/lib/embeds';
import { ServerSwitcher } from '@/components/player/ServerSwitcher';
import { saveWatchProgress } from '@/lib/storage';
import { AlertCircle, ExternalLink, Zap } from 'lucide-react';

interface StreamPlayerProps {
  media: MediaItem;
  season?: number;
  episode?: number;
  isLightsOut: boolean;
  onToggleLightsOut: () => void;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  media,
  season = 1,
  episode = 1,
  isLightsOut,
  onToggleLightsOut,
}) => {
  const [activeServerId, setActiveServerId] = useState<string>(STREAM_SERVERS[0].id);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSlowHelper, setShowSlowHelper] = useState(false);

  // Track watch progress in storage / cloud
  useEffect(() => {
    saveWatchProgress({
      mediaId: media.id,
      mediaType: media.mediaType,
      title: media.title,
      posterPath: media.posterPath,
      backdropPath: media.backdropPath,
      season: media.mediaType === 'tv' ? season : undefined,
      episode: media.mediaType === 'tv' ? episode : undefined,
      episodeTitle:
        media.seasons?.[season - 1]?.episodes?.[episode - 1]?.name || `Episode ${episode}`,
      percentageWatched: 15,
      lastUpdated: Date.now(),
    });
  }, [media, season, episode]);

  // Buffering timeout helper
  useEffect(() => {
    setIsLoading(true);
    setShowSlowHelper(false);
    const timer = setTimeout(() => {
      setShowSlowHelper(true);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeServerId, reloadKey, season, episode]);

  const embedUrl = getEmbedUrl(activeServerId, media, season, episode);

  const handleRefresh = () => {
    setIsLoading(true);
    setShowSlowHelper(false);
    setReloadKey((prev) => prev + 1);
  };

  const handleNextServer = () => {
    const currentIndex = STREAM_SERVERS.findIndex((s) => s.id === activeServerId);
    const nextServer = STREAM_SERVERS[(currentIndex + 1) % STREAM_SERVERS.length];
    setActiveServerId(nextServer.id);
  };

  return (
    <div className="relative w-full space-y-3">
      {/* 16:9 Video Player Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm gap-3 select-none pointer-events-none">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-amber-400 border-t-transparent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Connecting to {STREAM_SERVERS.find((s) => s.id === activeServerId)?.name}...
            </p>
          </div>
        )}

        {/* Embedded Player Iframe with proper origin referrer and permissions */}
        <iframe
          id="main-player"
          key={`${embedUrl}-${reloadKey}`}
          src={embedUrl}
          title={`${media.title} Stream Player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="origin"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          className="h-full w-full border-0"
        />

        {/* Floating Quick Helper Bar if slow/blocked */}
        {showSlowHelper && (
          <div className="absolute top-3 inset-x-3 sm:inset-x-auto sm:right-3 z-20 flex items-center justify-between gap-3 rounded-xl border border-amber-400/40 bg-[#0e0e12]/95 px-3 py-2 text-xs backdrop-blur-md shadow-2xl animate-fade-in">
            <div className="flex items-center gap-1.5 text-white/80">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Stream buffering?</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleNextServer}
                className="flex items-center gap-1 rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Zap className="h-3 w-3 fill-black" />
                <span>Try Next Server</span>
              </button>
              <a
                href={embedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Popout ↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Server Switcher with 12 Verified Streaming Mirrors */}
      <ServerSwitcher
        activeServerId={activeServerId}
        onSelectServer={(id) => {
          setActiveServerId(id);
          setIsLoading(true);
        }}
        onRefresh={handleRefresh}
        isLightsOut={isLightsOut}
        onToggleLightsOut={onToggleLightsOut}
        currentEmbedUrl={embedUrl}
      />
    </div>
  );
};
