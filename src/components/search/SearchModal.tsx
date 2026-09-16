'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, Tv, Star, Play, ArrowRight } from 'lucide-react';
import { searchMedia } from '@/lib/tmdb';
import { MediaItem } from '@/types/media';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const hits = await searchMedia(query);
      setResults(hits);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: MediaItem) => {
    onClose();
    router.push(`/watch/${item.mediaType}/${item.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/12 bg-[#121216]/95 shadow-2xl backdrop-blur-2xl z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-6">
              <Search className="h-5 w-5 text-amber-400/80 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows, anime, Asian dramas..."
                className="w-full bg-transparent text-base text-white placeholder-white/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/50">
                <span>ESC</span>
              </div>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
              {isSearching && (
                <div className="flex items-center justify-center py-10 text-sm text-white/50">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mr-3" />
                  Searching CinemaHD library...
                </div>
              )}

              {!isSearching && query.trim() && results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-base text-white/70 font-medium">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-xs text-white/40">Try searching for &ldquo;Lioness&rdquo;, &ldquo;Arcane&rdquo;, or &ldquo;Shogun&rdquo;</p>
                </div>
              )}

              {!isSearching && results.length > 0 && (
                <div className="space-y-2">
                  <p className="px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                    Results ({results.length})
                  </p>
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-transparent p-2.5 transition-all hover:border-white/10 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={item.posterPath}
                          alt={item.title}
                          className="h-16 w-11 shrink-0 rounded-lg object-cover shadow"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate font-semibold text-white group-hover:text-amber-400 transition-colors">
                              {item.title}
                            </h4>
                            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                              {item.mediaType === 'movie' ? <Film className="h-2.5 w-2.5" /> : <Tv className="h-2.5 w-2.5" />}
                              {item.mediaType}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
                            <span className="flex items-center gap-1 text-amber-300 font-medium">
                              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                              {item.voteAverage}
                            </span>
                            <span>{item.releaseDate.split('-')[0]}</span>
                            <span className="truncate">{item.genres.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pr-2">
                        <button
                          type="button"
                          className="flex h-8 items-center gap-1.5 rounded-full bg-amber-400 px-3 text-xs font-semibold text-black transition-transform group-hover:scale-105"
                        >
                          <Play className="h-3 w-3 fill-black" />
                          <span className="hidden sm:inline">Watch</span>
                        </button>
                        <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="py-6 px-2 text-center">
                  <div className="flex justify-center mb-4">
                    <img src="/new/white.png" alt="CinemaHD" className="h-7 w-auto opacity-75" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-3">Popular Searches</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Deadpool & Wolverine', 'Lioness', 'Arcane', 'Shōgun', 'Solo Leveling', 'Queen of Tears', 'Interstellar'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setQuery(tag)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300 transition-all"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
