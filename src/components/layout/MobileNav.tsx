'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Bookmark } from 'lucide-react';
import { SearchModal } from '@/components/search/SearchModal';
import { AndroidLogo } from '@/components/icons/AndroidLogo';

export const MobileNav: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'App', href: '/download-apk', icon: AndroidLogo, highlight: true },
    { label: 'Watchlist', href: '/watchlist', icon: Bookmark },
  ];

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0e0e12]/95 border-t border-white/10 backdrop-blur-2xl px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : item.highlight
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 py-1 text-white/50 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="text-[11px] font-medium">Search</span>
          </button>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
