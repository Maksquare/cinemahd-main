import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { StarfieldBackground } from '@/components/ui/StarfieldBackground';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CinemaHD — Ultimate Movie, Series & Anime Streaming',
  description:
    'Discover, track, and stream trending movies, TV shows, anime, and Asian dramas in 4K HDR with multi-server resilience and celestial aesthetics.',
  keywords: [
    'movies',
    'stream movies',
    'tv series',
    'anime',
    'asian drama',
    'cinemahd',
    'watch free',
    'phonofilm',
    'cinebloom',
  ],
  authors: [{ name: 'CinemaHD' }],
  openGraph: {
    title: 'CinemaHD — Ultimate Streaming Experience',
    description: 'Discover trending movies, TV series, anime, and Asian dramas with multi-server playback.',
    siteName: 'CinemaHD',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#0b0b0d] text-[#f4f4f6] flex flex-col antialiased selection:bg-amber-400 selection:text-black"
      >
        {/* Animated celestial background */}
        <StarfieldBackground />

        {/* Global sticky navbar */}
        <Navbar />

        {/* Main page content container */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>

        {/* Mobile bottom navigation dock */}
        <MobileNav />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
