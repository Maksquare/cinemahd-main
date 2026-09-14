'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useCloudSync } from '@/hooks/useCloudSync';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  User,
  LogOut,
  Bookmark,
  Cloud,
  RefreshCw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { data: session, isPending } = useSession();
  const { isSyncing, triggerSync } = useCloudSync();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
    window.location.reload();
  };

  if (isPending) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-full bg-white/5 border border-white/10" />
    );
  }

  const user = session?.user;

  return (
    <div className="relative" ref={menuRef}>
      {user ? (
        /* Authenticated User Pill Button */
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="group flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-2 pr-3 text-xs font-semibold text-white hover:border-amber-400/40 hover:bg-white/10 transition-all cursor-pointer shadow-sm"
          aria-label="User profile menu"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User avatar'}
              className="h-6 w-6 rounded-full object-cover border border-amber-400/50"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-bold text-[10px]">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <span className="hidden sm:inline font-medium max-w-[100px] truncate">
            {user.name || user.email?.split('@')[0]}
          </span>

          <span className="flex items-center gap-1 text-[10px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/30">
            <Cloud className={`h-2.5 w-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Sync</span>
          </span>

          <ChevronDown
            className={`h-3 w-3 text-white/50 transition-transform ${
              isDropdownOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      ) : (
        /* Logged Out: Sign In Button with Google colors */
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="group flex h-10 items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-400/15 via-amber-400/5 to-white/5 px-3.5 sm:px-4 text-xs font-semibold text-white hover:border-amber-400 hover:from-amber-400/25 transition-all shadow-sm cursor-pointer"
        >
          {/* Mini Google G Logo */}
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="tracking-tight">Sign In</span>
        </button>
      )}

      {/* User Dropdown Menu */}
      {isDropdownOpen && user && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/15 bg-[#12141f]/95 p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
          {/* User Info Header */}
          <div className="border-b border-white/10 px-3 py-2.5">
            <p className="text-xs font-bold text-white truncate">
              {user.name || 'CinemaHD Member'}
            </p>
            <p className="text-[11px] text-white/50 truncate">
              {user.email}
            </p>
          </div>

          {/* Cloud Sync Status & Manual Refresh */}
          <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-white/5 my-1">
            <div className="flex items-center gap-1.5 text-white/70 text-[11px]">
              <Cloud className="h-3.5 w-3.5 text-amber-400" />
              <span>Cloud Sync Active</span>
            </div>
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => triggerSync()}
              className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Force sync now"
            >
              <RefreshCw className={`h-2.5 w-2.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/watchlist"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <Bookmark className="h-3.5 w-3.5 text-amber-400" />
              <span>My Watchlist</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="border-t border-white/10 pt-1 mt-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
