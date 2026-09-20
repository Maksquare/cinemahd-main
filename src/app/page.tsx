import React from 'react';
import type { Metadata } from 'next';
import { getMediaCatalog } from '@/lib/tmdb';
import { HomeClientContent } from '@/components/home/HomeClientContent';

export const metadata: Metadata = {
  title: 'CinemaHD — Watch Movies, TV Series & Anime Online in HD',
  description:
    'Stream trending movies, TV shows, anime, and Asian dramas in 4K HDR with multi-server playback on CinemaHD. Fast streaming for viewers in Ethiopia and worldwide.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CinemaHD — Watch Movies, TV Series & Anime Online in HD',
    description:
      'Stream trending movies, TV shows, anime, and Asian dramas in 4K HDR with multi-server playback on CinemaHD.',
    url: 'https://cinemahd.pro.et',
    siteName: 'CinemaHD',
  },
};

export default async function HomePage() {
  const catalog = await getMediaCatalog();

  // Structured Data (JSON-LD) for WebSite and Organization
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CinemaHD',
    alternateName: ['Cinema HD', 'CinemaHD Pro', 'CinemaHD Ethiopia'],
    url: 'https://cinemahd.pro.et',
    description:
      'Discover, track, and stream trending movies, TV series, anime, and Asian dramas in 4K HDR.',
    inLanguage: ['en', 'am'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cinemahd.pro.et/explore?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CinemaHD',
    url: 'https://cinemahd.pro.et',
    logo: 'https://cinemahd.pro.et/new/white.png',
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Semantic H1 for SEO (visually integrated or accessible) */}
      <h1 className="sr-only">
        Watch Movies, TV Series & Anime Online in HD — CinemaHD Ethiopia
      </h1>

      <HomeClientContent initialCatalog={catalog} />
    </>
  );
}
