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
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0e0e12]/95 border-t border-white/10 backdrop-blur-2xl px-2 py-1 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex min-h-[44px] min-w-[48px] flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all touch-manipulation active:scale-95 ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : item.highlight
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`} />
                <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex min-h-[44px] min-w-[48px] flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl text-white/60 hover:text-white transition-all touch-manipulation active:scale-95 cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-tight">Search</span>
          </button>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
