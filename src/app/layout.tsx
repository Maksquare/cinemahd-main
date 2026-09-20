import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { StarfieldBackground } from '@/components/ui/StarfieldBackground';
import { AdsterraPopunder } from '@/components/ads/AdsterraPopunder';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AppModals } from '@/components/layout/AppModals';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0d' },
    { media: '(prefers-color-scheme: light)', color: '#0b0b0d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: '--font-noto-ethiopic',
  subsets: ['ethiopic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cinemahd.pro.et'),
  applicationName: 'CinemaHD',
  manifest: '/manifest.webmanifest',
  title: {
    default: 'CinemaHD — Watch Movies & TV Series Online in HD',
    template: '%s | CinemaHD',
  },
  description:
    'Discover, track, and stream trending movies, TV shows, anime, and Asian dramas in 4K HDR with multi-server resilience on CinemaHD.',
  keywords: [
    'watch movies online Ethiopia',
    'HD movies',
    'Amharic movies',
    'CinemaHD',
    'TV series online',
    'stream movies free',
    'Ethiopian movie streaming',
    'watch anime online',
    'Asian drama streaming',
    '4K movies',
  ],
  authors: [{ name: 'CinemaHD', url: 'https://cinemahd.pro.et' }],
  creator: 'CinemaHD',
  publisher: 'CinemaHD',
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CinemaHD',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'CinemaHD — Watch Movies & TV Series Online in HD',
    description:
      'Discover and stream trending movies, TV shows, anime, and Asian dramas in 4K HDR with multi-server resilience.',
    url: 'https://cinemahd.pro.et',
    siteName: 'CinemaHD',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/new/main.png',
        width: 1200,
        height: 630,
        alt: 'CinemaHD — Ultimate Streaming Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CinemaHD — Watch Movies & TV Series Online in HD',
    description:
      'Stream trending movies, TV shows, anime, and Asian dramas in 4K HDR on CinemaHD.',
    images: ['/new/main.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/new/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/new/favicon.svg',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansEthiopic.variable} dark scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#0b0b0d] text-[#f4f4f6] flex flex-col antialiased selection:bg-amber-400 selection:text-black font-sans"
      >
        <AuthProvider>
          {/* PWA Service Worker Registration & Update Notification */}
          <PwaRegister />

          {/* Animated celestial background */}
          <StarfieldBackground />

          {/* Global sticky navbar */}
          <Navbar />

          {/* Main page content container with safe area bottom padding when mobile nav is visible */}
          <main className="flex-1 pb-20 md:pb-0">{children}</main>

          {/* Mobile bottom navigation dock */}
          <MobileNav />

          {/* Standalone/PWA In-App Install Prompt Banner */}
          <PwaInstallPrompt />

          {/* Footer */}
          <Footer />

          {/* Global Authentication Modal */}
          <AuthModal />

          {/* Global Crypto Support & Download APK Modals */}
          <AppModals />

          {/* Adsterra Smartlink Popunder (Frequency-Capped) */}
          <AdsterraPopunder />

          {/* Adsterra SocialBar (Interactive in-page push ads deferred for Core Web Vitals) */}
          <Script
            id="adsterra-socialbar"
            src="https://pl31351453.profitableratecpmnetwork.com/36/c9/b5/36c9b5e460f29f3f7f058adf1dada9c9.js"
            strategy="lazyOnload"
          />
        </AuthProvider>
      </body>
    </html>
  );
}


