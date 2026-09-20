import React from 'react';
import Link from 'next/link';
import { Film, Home, Compass, Search } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | CinemaHD',
  description: 'The requested page or movie title could not be found on CinemaHD.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-[#121216]/80 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto">
          <Film className="h-8 w-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Error 404
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">
            Title Not Found
          </h1>
          <p className="mt-2 text-sm text-white/60">
            The title or page you requested may have been removed, moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
