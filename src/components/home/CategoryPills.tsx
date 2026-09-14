'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film, Tv, Flame, Globe } from 'lucide-react';
import { Category } from '@/types/media';

interface CategoryPillsProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'anime', label: 'Anime', icon: Flame },
    { id: 'asian', label: 'Asian Dramas', icon: Globe },
  ];

  return (
    <div className="relative z-10 w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 min-w-max px-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-black shadow-lg shadow-amber-500/20'
                  : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
