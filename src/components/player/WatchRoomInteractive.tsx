'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/types/media';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { EpisodePicker } from '@/components/player/EpisodePicker';
import { TrailerModal } from '@/components/media/TrailerModal';
import { WatchActionButtons } from '@/components/media/WatchActionButtons';

interface WatchRoomInteractiveProps {
  media: MediaItem;
  initialSeason: number;
  initialEpisode: number;
}

export const WatchRoomInteractive: React.FC<WatchRoomInteractiveProps> = ({
  media,
  initialSeason,
  initialEpisode,
}) => {
  const router = useRouter();
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const isTvShow = media.mediaType === 'tv';

  const handleEpisodeSelect = (s: number, e: number) => {
    setCurrentSeason(s);
    setCurrentEpisode(e);
    router.replace(`/watch/${media.mediaType}/${media.id}?season=${s}&episode=${e}`, {
      scroll: false,
    });
  };

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

      {/* Main Streaming Player Section */}
      <div className={`relative ${isLightsOut ? 'z-40' : 'z-10'}`}>
        <StreamPlayer
          media={media}
          season={currentSeason}
          episode={currentEpisode}
          isLightsOut={isLightsOut}
          onToggleLightsOut={() => setIsLightsOut((prev) => !prev)}
        />
      </div>

      {/* TV Show Episode Picker */}
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

      {/* Client actions slot (rendered in sidebar via component or exported hook) */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={media.trailerYoutubeKey}
        title={media.title}
      />
    </>
  );
};
