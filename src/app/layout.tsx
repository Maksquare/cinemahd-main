import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { StarfieldBackground } from '@/components/ui/StarfieldBackground';
import { AdsterraPopunder } from '@/components/ads/AdsterraPopunder';

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
    icon: [
      { url: '/new/favicon.svg', type: 'image/svg+xml' },
      { url: '/new/favcon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/new/favicon.svg',
    apple: '/new/favcon.png',
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

        {/* Adsterra Smartlink Popunder (Frequency-Capped) */}
        <AdsterraPopunder />

        {/* Adsterra SocialBar (Interactive in-page push ads) */}
        <Script
          id="adsterra-socialbar"
          src="https://pl31351453.profitableratecpmnetwork.com/36/c9/b5/36c9b5e460f29f3f7f058adf1dada9c9.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
