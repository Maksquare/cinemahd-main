import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Film,
} from 'lucide-react';
import { getMediaById, getSimilarMedia, createMediaSlug, parseMediaId } from '@/lib/tmdb';
import { WatchRoomInteractive } from '@/components/player/WatchRoomInteractive';
import { WatchProviders } from '@/components/media/WatchProviders';
import { WatchSidebar } from '@/components/media/WatchSidebar';
import { MediaRail } from '@/components/home/MediaRail';
import { AdBanner728x90 } from '@/components/ads/AdBanner728x90';
import { AdNativeBanner } from '@/components/ads/AdNativeBanner';

interface WatchPageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
  searchParams: Promise<{
    season?: string;
    episode?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const { type, id } = await params;
  const sParams = await searchParams;
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const media = await getMediaById(id, mediaType);

  if (!media) {
    return {
      title: 'Title Not Found',
      description: 'The requested movie or TV show could not be found on CinemaHD.',
      robots: { index: false, follow: false },
    };
  }

  const year = media.releaseDate ? media.releaseDate.split('-')[0] : '';
  const isTv = media.mediaType === 'tv';
  const seasonNum = sParams.season ? parseInt(sParams.season, 10) : 1;
  const episodeNum = sParams.episode ? parseInt(sParams.episode, 10) : 1;

  const episodeContext = isTv && sParams.season && sParams.episode
    ? ` S${seasonNum} E${episodeNum}`
    : '';

  const titleText = `Watch ${media.title}${episodeContext} ${year ? `(${year}) ` : ''}Online in HD`;
  const cleanDesc = media.overview
    ? media.overview.length > 155
      ? `${media.overview.slice(0, 152)}...`
      : media.overview
    : `Stream ${media.title} in 4K HDR with multi-server playback on CinemaHD.`;

  const canonicalSlug = createMediaSlug(media);
  const canonicalUrl = `/watch/${media.mediaType}/${canonicalSlug}`;

  return {
    title: titleText,
    description: cleanDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${titleText} | CinemaHD`,
      description: cleanDesc,
      url: canonicalUrl,
      type: isTv ? 'video.tv_show' : 'video.movie',
      siteName: 'CinemaHD',
      images: [
        {
          url: media.backdropPath || media.posterPath,
          width: 1200,
          height: 630,
          alt: `${media.title} backdrop`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titleText} | CinemaHD`,
      description: cleanDesc,
      images: [media.backdropPath || media.posterPath],
    },
  };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { type, id } = await params;
  const sParams = await searchParams;
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const media = await getMediaById(id, mediaType);

  if (!media) {
    notFound();
  }

  const seasonParam = parseInt(sParams.season || '1', 10);
  const episodeParam = parseInt(sParams.episode || '1', 10);

  const similar = await getSimilarMedia(media.id);
  const canonicalSlug = createMediaSlug(media);
  const canonicalUrl = `https://cinemahd.pro.et/watch/${media.mediaType}/${canonicalSlug}`;

  // Structured Data (JSON-LD)
  const isTv = media.mediaType === 'tv';

  const mediaSchema = {
    '@context': 'https://schema.org',
    '@type': isTv ? 'TVSeries' : 'Movie',
    name: media.title,
    description: media.overview,
    image: media.posterPath || media.backdropPath,
    datePublished: media.releaseDate,
    genre: media.genres,
    inLanguage: 'en',
    url: canonicalUrl,
    ...(media.durationMinutes && !isTv ? { duration: `PT${media.durationMinutes}M` } : {}),
    ...(media.cast && media.cast.length > 0
      ? {
          actor: media.cast.slice(0, 8).map((c) => ({
            '@type': 'Person',
            name: c.name,
          })),
        }
      : {}),
  };

  const videoObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${media.title} Online Stream`,
    description: media.overview,
    thumbnailUrl: [media.backdropPath || media.posterPath],
    uploadDate: media.releaseDate ? `${media.releaseDate}T00:00:00+00:00` : '2026-01-01T00:00:00+00:00',
    ...(media.durationMinutes ? { duration: `PT${media.durationMinutes}M` } : {}),
    embedUrl: canonicalUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cinemahd.pro.et',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isTv ? 'TV Series' : 'Movies',
        item: `https://cinemahd.pro.et/explore?type=${media.mediaType}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: media.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative min-h-screen py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>Back to Browse</span>
            </Link>

            <ol className="flex items-center gap-2 text-xs text-white/50">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3 w-3 text-white/30" />
              </li>
              <li>
                <Link
                  href={`/explore?type=${media.mediaType}`}
                  className="hover:text-white capitalize transition-colors"
                >
                  {media.category}
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3 w-3 text-white/30" />
              </li>
              <li aria-current="page" className="text-white font-medium truncate max-w-[180px] sm:max-w-[280px]">
                {media.title}
              </li>
            </ol>
          </nav>

          {/* 1. Main Streaming Player Section with Facade */}
          <WatchRoomInteractive
            media={media}
            initialSeason={seasonParam}
            initialEpisode={episodeParam}
          />

          {/* 2. TMDb Official Watch Providers */}
          <div className="mt-6 z-10 relative">
            <WatchProviders
              tmdbId={media.tmdbId}
              mediaType={media.mediaType}
              title={media.title}
            />
          </div>

          {/* Sponsored 728x90 Leaderboard Banner */}
          <div className="mt-6 z-10 relative flex justify-center">
            <AdBanner728x90 />
          </div>

          {/* 3. Media Metadata, Synopsis, Cast, and Sidebar */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
            {/* Left 2 Cols: Title, Storyline, Cast */}
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

                {/* Genres with crawlable internal links */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {media.genres.map((g) => (
                    <Link
                      key={g}
                      href={`/explore?type=${media.mediaType}`}
                      className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Synopsis / Storyline */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Storyline & Overview
                </h2>
                <p className="text-base text-white/85 leading-relaxed">
                  {media.overview}
                </p>
              </div>

              {/* Cast List */}
              {media.cast && media.cast.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
                    Top Cast & Characters
                  </h2>
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

            {/* Right Col: Poster, Action Tools, Sidebar Ad */}
            <WatchSidebar media={media} />
          </div>

          {/* Sponsored Mid-Page 300x250 Ad Unit */}
          <div className="mt-12 flex justify-center border-t border-white/8 pt-6">
            <AdBanner728x90 />
          </div>

          {/* 4. More Like This Recommendation Rail */}
          {similar.length > 0 && (
            <div className="mt-8 border-t border-white/8 pt-8">
              <MediaRail
                title="More Like This"
                subtitle={`Titles related to ${media.title}`}
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
    </>
  );
}
