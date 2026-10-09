'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, LogOut, Bookmark, Smartphone, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  onOpenApkModal?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenApkModal }) => {
  const { user, isAuthenticated, openAuthModal, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className="group relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/35 bg-gradient-to-b from-amber-400/15 via-[#18181f]/80 to-[#0d0d12]/95 text-amber-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black hover:shadow-[0_0_22px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="Sign in to CinemaHD"
        title="Sign In / Account"
      >
        <UserIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-300 group-hover:scale-110" />
        
        {/* Elegant subtle status pulse */}
        <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="sr-only">Sign In</span>
      </button>
    );
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="relative shrink-0" ref={menuRef}>
      {/* Elegant Avatar Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-400/20 via-white/5 to-black/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="User account menu"
        title={user.name || 'Account Menu'}
      >
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-xs font-bold text-black shadow-md">
          {initials}
        </div>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0b0d]"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/15 bg-[#12131a]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Header */}
          <div className="border-b border-white/8 px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                <ShieldCheck className="h-3 w-3" />
              </span>
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
            </div>
            <p className="text-[11px] text-white/50 truncate">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              <Sparkles className="h-2.5 w-2.5" />
              <span>CinemaHD PRO Active</span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1.5 text-xs space-y-0.5">
            <Link
              href="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bookmark className="h-4 w-4 text-amber-400" />
              <span>My Watchlist & Library</span>
            </Link>

            <Link
              href="/download-apk"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Smartphone className="h-4 w-4 text-emerald-400" />
              <span>Download Android APK</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="border-t border-white/8 pt-1">
            <button
              type="button"
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
