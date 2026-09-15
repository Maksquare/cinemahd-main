'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Star,
  Calendar,
  Clock,
  Bookmark,
  Check,
  Film,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getMediaById, getSimilarMedia } from '@/lib/tmdb';
import { MediaItem } from '@/types/media';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { EpisodePicker } from '@/components/player/EpisodePicker';
import { WatchProviders } from '@/components/media/WatchProviders';
import { MediaRail } from '@/components/home/MediaRail';
import { TrailerModal } from '@/components/media/TrailerModal';
import { toggleWatchlist, isInWatchlist, toggleWatched, isWatched } from '@/lib/storage';
import { AdBanner300x250 } from '@/components/ads/AdBanner300x250';
import { AdBanner728x90 } from '@/components/ads/AdBanner728x90';
import { AdNativeBanner } from '@/components/ads/AdNativeBanner';

interface WatchPageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export default function WatchPage({ params }: WatchPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [similar, setSimilar] = useState<MediaItem[]>([]);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [copied, setCopied] = useState(false);

  // URL query params for season and episode
  const seasonParam = parseInt(searchParams.get('season') || '1', 10);
  const episodeParam = parseInt(searchParams.get('episode') || '1', 10);

  const [currentSeason, setCurrentSeason] = useState(seasonParam);
  const [currentEpisode, setCurrentEpisode] = useState(episodeParam);

  // Load media item details
  useEffect(() => {
    async function loadData() {
      const item = await getMediaById(
        resolvedParams.id,
        resolvedParams.type as 'movie' | 'tv'
      );
      if (item) {
        setMedia(item);
        setIsBookmarked(isInWatchlist(item.id));
        setHasWatched(isWatched(item.id));
        const sim = await getSimilarMedia(item.id);
        setSimilar(sim);
      }
    }
    loadData();
  }, [resolvedParams.id, resolvedParams.type]);

  const handleEpisodeSelect = (s: number, e: number) => {
    setCurrentSeason(s);
    setCurrentEpisode(e);
    router.replace(`/watch/${resolvedParams.type}/${resolvedParams.id}?season=${s}&episode=${e}`);
  };

  const handleWatchlistToggle = () => {
    if (!media) return;
    const added = toggleWatchlist(media);
    setIsBookmarked(added);
  };

  const handleWatchedToggle = () => {
    if (!media) return;
    const watchedNow = toggleWatched(media.id);
    setHasWatched(watchedNow);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!media) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-400 border-t-transparent" />
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Loading CinemaHD Stream Room...
          </p>
        </div>
      </div>
    );
  }

  const isTvShow = media.mediaType === 'tv';

  return (
    <>
      {/* Cinema Lights-Out Ambient Overlay */}
      {isLightsOut && (
        <div
          onClick={() => setIsLightsOut(false)}
          className="fixed inset-0 z-30 bg-black/95 transition-opacity duration-500 cursor-pointer"
          title="Click to turn lights back on"
        />
      )}

      <div className="relative min-h-screen py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation & Back button */}
          <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>Back to Browse</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="capitalize">{media.category}</span>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-[200px]">{media.title}</span>
            </div>
          </div>

          {/* 1. Main Streaming Player Section */}
          <div className={`relative ${isLightsOut ? 'z-40' : 'z-10'}`}>
            <StreamPlayer
              media={media}
              season={currentSeason}
              episode={currentEpisode}
              isLightsOut={isLightsOut}
              onToggleLightsOut={() => setIsLightsOut((prev) => !prev)}
            />
          </div>

          {/* 2. TV Show Episode Picker (if series) */}
          {isTvShow && (
            <div className="mt-6 z-10 relative">
              <EpisodePicker
                media={media}
                currentSeason={currentSeason}
                currentEpisode={currentEpisode}
                onSelectEpisode={handleEpisodeSelect}
              />
            </div>
          )}

          {/* 3. TMDb Official Watch Providers (Where to Stream officially) */}
          <div className="mt-6 z-10 relative">
            <WatchProviders
              tmdbId={media.tmdbId}
              mediaType={media.mediaType}
              title={media.title}
            />
          </div>

          {/* Sponsored 728x90 Leaderboard Banner directly below Player & Tools */}
          <div className="mt-6 z-10 relative flex justify-center">
            <AdBanner728x90 />
          </div>

          {/* 4. Media Metadata & Quick Actions */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
            {/* Left 2 Cols: Title, Overview, Cast */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="rounded bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-xs font-bold text-amber-300 uppercase">
                    {media.mediaType === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-black/40 border border-white/10 px-2 py-0.5 text-xs font-semibold text-white">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                    {media.voteAverage} ({media.voteCount.toLocaleString()} votes)
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/60">
                    <Calendar className="h-3 w-3 text-white/40" />
                    {media.releaseDate}
                  </span>
                  {media.durationMinutes && (
                    <span className="flex items-center gap-1 text-xs text-white/60">
                      <Clock className="h-3 w-3 text-white/40" />
                      {Math.floor(media.durationMinutes / 60)}h {media.durationMinutes % 60}m
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  {media.title}
                </h1>

                {media.tagline && (
                  <p className="mt-1 text-sm italic text-amber-300/80 font-medium">
                    &ldquo;{media.tagline}&rdquo;
                  </p>
                )}

                {/* Genres */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {media.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/80"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Storyline
                </h3>
                <p className="text-base text-white/85 leading-relaxed">
                  {media.overview}
                </p>
              </div>

              {/* Cast List */}
              {media.cast && media.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {media.cast.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-white/8 bg-white/5 p-3 flex flex-col"
                      >
                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                        <p className="text-xs text-white/50 truncate mt-0.5">{c.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Poster, Action Tools */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-4 shadow-xl">
                <img
                  src={media.posterPath}
                  alt={media.title}
                  className="aspect-[2/3] w-full rounded-xl object-cover shadow-lg"
                />

                <div className="mt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleWatchlistToggle}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                        : 'border border-white/12 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-black' : ''}`} />
                    <span>{isBookmarked ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWatchedToggle}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                      hasWatched
                        ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                        : 'border border-white/12 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>{hasWatched ? 'Marked as Watched' : 'Mark as Watched'}</span>
                  </button>

                  {media.trailerYoutubeKey && (
                    <button
                      type="button"
                      onClick={() => setIsTrailerOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Film className="h-4 w-4 text-amber-400" />
                      <span>Watch Trailer</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/8 py-2 text-xs font-medium text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copied ? 'Link Copied to Clipboard!' : 'Share Stream Link'}</span>
                  </button>
                </div>
              </div>

              {/* Sponsored 300x250 High-Viewability Banner in Stream Room Sidebar */}
              <AdBanner300x250 className="w-full" />
            </div>
          </div>

          {/* Sponsored Mid-Page 300x250 Ad Unit */}
          <div className="mt-12 flex justify-center border-t border-white/8 pt-6">
            <AdBanner300x250 />
          </div>

          {/* 5. More Like This Recommendation Rail */}
          {similar.length > 0 && (
            <div className="mt-8 border-t border-white/8 pt-8">
              <MediaRail
                title="More Like This"
                subtitle="Titles you might also enjoy streaming"
                items={similar}
                variant="backdrop"
              />
            </div>
          )}

          {/* Sponsored Native Recommendations Banner */}
          <div className="mt-10 border-t border-white/8 pt-6">
            <AdNativeBanner />
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={media.trailerYoutubeKey}
        title={media.title}
      />
    </>
  );
}
