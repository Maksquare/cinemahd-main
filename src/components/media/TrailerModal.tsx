'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeKey?: string;
  title: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  youtubeKey,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-[#121216] shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <h3 className="text-base font-semibold text-white truncate pr-4">
              Official Trailer — <span className="text-amber-400">{title}</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* YouTube Video Embed */}
          <div className="relative aspect-video w-full bg-black">
            {youtubeKey ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&modestbranding=1&rel=0`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/50 text-sm">
                Trailer currently unavailable for this title.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
