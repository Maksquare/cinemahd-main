'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types/media';
import { STREAM_SERVERS, getEmbedUrl } from '@/lib/embeds';
import { ServerSwitcher } from '@/components/player/ServerSwitcher';
import { saveWatchProgress } from '@/lib/storage';
import { AlertCircle, ExternalLink, Zap, Play, Sparkles, ShieldCheck } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(false);
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
    if (!isPlaying) return;
    setIsLoading(true);
    setShowSlowHelper(false);
    const timer = setTimeout(() => {
      setShowSlowHelper(true);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeServerId, reloadKey, season, episode, isPlaying]);

  const embedUrl = getEmbedUrl(activeServerId, media, season, episode);

  const handleStartStream = () => {
    setIsPlaying(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setShowSlowHelper(false);
    setReloadKey((prev) => prev + 1);
  };

  const handleNextServer = () => {
    const currentIndex = STREAM_SERVERS.findIndex((s) => s.id === activeServerId);
    const nextServer = STREAM_SERVERS[(currentIndex + 1) % STREAM_SERVERS.length];
    setActiveServerId(nextServer.id);
    setIsPlaying(true);
  };

  const backdropImage =
    media.backdropPath ||
    media.posterPath ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative w-full space-y-3">
      {/* 16:9 Video Player Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
        {!isPlaying ? (
          /* High-Performance Video Player Facade (Click-to-Load) */
          <div
            onClick={handleStartStream}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStartStream();
              }
            }}
            aria-label={`Start streaming ${media.title}`}
            className="group relative h-full w-full cursor-pointer select-none overflow-hidden"
          >
            {/* Optimized Backdrop Poster */}
            <Image
              src={backdropImage}
              alt={`${media.title} video stream preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
              className="object-cover object-center filter brightness-[0.65] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/70" />

            {/* Facade Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                4K Ultra HD Stream
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Multi-Server Verified
              </span>
            </div>

            {/* Center Glowing Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <div className="relative flex items-center justify-center">
                {/* Outer animated pulse ring */}
                <span className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-amber-400/30 animate-ping duration-1000 opacity-75" />
                {/* Play Button Icon */}
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(245,158,11,0.9)]">
                  <Play className="h-7 w-7 sm:h-9 sm:w-9 fill-black translate-x-0.5" />
                </div>
              </div>

              <div className="text-center px-4">
                <p className="text-sm sm:text-base font-bold text-white tracking-wide drop-shadow-md">
                  Click to Stream Now
                </p>
                <p className="mt-0.5 text-xs text-amber-200/70 font-medium">
                  Instant fast connection • Fast servers for mobile & Ethiopia
                </p>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-white/70 z-10">
              <span className="font-semibold text-white/90 truncate max-w-[240px] sm:max-w-md">
                {media.title}{' '}
                {media.mediaType === 'tv' && `(Season ${season}, Episode ${episode})`}
              </span>
              <span className="text-amber-400 font-medium shrink-0">
                Server: {STREAM_SERVERS.find((s) => s.id === activeServerId)?.name}
              </span>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Server Switcher with Verified Streaming Mirrors */}
      <ServerSwitcher
        activeServerId={activeServerId}
        onSelectServer={(id) => {
          setActiveServerId(id);
          setIsPlaying(true);
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

