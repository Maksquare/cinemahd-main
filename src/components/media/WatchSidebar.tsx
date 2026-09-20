'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types/media';
import { WatchActionButtons } from '@/components/media/WatchActionButtons';
import { TrailerModal } from '@/components/media/TrailerModal';
import { AdBanner300x250 } from '@/components/ads/AdBanner300x250';

interface WatchSidebarProps {
  media: MediaItem;
}

export const WatchSidebar: React.FC<WatchSidebarProps> = ({ media }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const posterImage =
    media.posterPath ||
    media.backdropPath ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-4 shadow-xl">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg bg-[#16161c]">
          <Image
            src={posterImage}
            alt={`${media.title} poster cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
            className="object-cover"
            priority
          />
        </div>

        <WatchActionButtons
          media={media}
          onOpenTrailer={() => setIsTrailerOpen(true)}
        />
      </div>

      {/* Sponsored 300x250 High-Viewability Banner in Stream Room Sidebar */}
      <AdBanner300x250 className="w-full" />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={media.trailerYoutubeKey}
        title={media.title}
      />
    </div>
  );
};
