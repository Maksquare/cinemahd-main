'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Film, Bookmark, Sparkles, Tv, Compass, Heart } from 'lucide-react';
import { SearchModal } from '@/components/search/SearchModal';
import { getWatchlist } from '@/lib/storage';
import { openCryptoSupportModal, openDownloadApkModal } from '@/components/layout/AppModals';
import { UserMenu } from '@/components/auth/UserMenu';
import { AndroidLogo } from '@/components/icons/AndroidLogo';

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update watchlist badge count
  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };
    updateCount();
    window.addEventListener('cinemahd_storage_change', updateCount);
    return () => window.removeEventListener('cinemahd_storage_change', updateCount);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Movies', href: '/explore?type=movie', icon: Film },
    { label: 'Series', href: '/explore?type=tv', icon: Tv },
    { label: 'Anime', href: '/explore?type=anime' },
    { label: 'Asian', href: '/explore?type=asian' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full pt-safe transition-all duration-300 ${
          scrolled
            ? 'bg-[#0b0b0d]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-b from-[#0b0b0d]/90 via-[#0b0b0d]/40 to-transparent backdrop-blur-[2px]'
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative h-7 sm:h-8 md:h-9 w-28 sm:w-36">
                <Image
                  src="/new/white.png"
                  alt="CinemaHD Logo"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  priority
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                <Sparkles className="h-2.5 w-2.5" />
                PRO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/12 text-white font-semibold shadow-inner'
                        : 'text-white/70 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: APK Download, Crypto Support, Search, Watchlist, User Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Download APK Trigger */}
            <button
              type="button"
              onClick={openDownloadApkModal}
              className="group inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 sm:px-3.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm"
              title="CinemaHD Android & Firestick App - Coming Soon"
            >
              <AndroidLogo className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">App</span>
              <span className="hidden md:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-500/40">
                Soon
              </span>
            </button>

            {/* Crypto Support Trigger */}
            <button
              type="button"
              onClick={openCryptoSupportModal}
              className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 sm:px-3.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all cursor-pointer shadow-sm"
              title="Support CinemaHD with Crypto"
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400/40 text-amber-400" />
              <span className="hidden sm:inline">Support</span>
            </button>

            {/* Search Pill Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="group flex h-9 sm:h-10 items-center gap-2 sm:gap-3 rounded-full border border-white/12 bg-white/5 px-3 sm:px-3.5 text-sm text-white/60 hover:border-amber-400/40 hover:bg-white/10 hover:text-white transition-all shadow-sm cursor-pointer"
              aria-label="Search titles"
            >
              <Search className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-xs font-medium tracking-tight">Search...</span>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/60">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Watchlist Link */}
            <Link
              href="/watchlist"
              className="relative flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 text-sm font-medium text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white transition-all"
              aria-label="Watchlist"
            >
              <Bookmark className="h-4 w-4 text-amber-400" />
              <span className="hidden md:inline text-xs font-semibold">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] sm:text-[11px] font-bold text-black shadow">
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Sign In */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Global Search Command Palette Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
