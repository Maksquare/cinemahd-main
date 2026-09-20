'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, LogOut, Bookmark, Smartphone, Sparkles, ChevronDown } from 'lucide-react';
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
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-sm"
      >
        <UserIcon className="h-3.5 w-3.5" />
        <span>Sign In</span>
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
    <div className="relative" ref={menuRef}>
      {/* Avatar Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-2.5 hover:border-amber-400/50 hover:bg-white/10 transition-all cursor-pointer"
        aria-label="User account menu"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-xs font-bold text-black shadow">
          {initials}
        </div>
        <span className="hidden sm:inline text-xs font-semibold text-white/90 max-w-[90px] truncate">
          {user.name}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-white/40" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#12131a]/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Header */}
          <div className="border-b border-white/8 px-3 py-2.5">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-white/50 truncate mt-0.5">{user.email}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              <Sparkles className="h-2.5 w-2.5" />
              <span>CinemaHD PRO</span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1 text-xs">
            <Link
              href="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bookmark className="h-4 w-4 text-amber-400" />
              <span>My Watchlist</span>
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
