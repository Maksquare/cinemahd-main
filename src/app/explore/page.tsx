import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getMediaCatalog } from '@/lib/tmdb';
import { ExploreClient } from '@/components/explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Explore Movies, TV Shows, Anime & Asian Dramas',
  description:
    'Browse our comprehensive catalog of 4K HDR movies, television series, anime, and Asian dramas. Filter by genre, popularity, and release date on CinemaHD.',
  alternates: {
    canonical: '/explore',
  },
  openGraph: {
    title: 'Explore Movies, TV Shows, Anime & Asian Dramas | CinemaHD',
    description:
      'Browse our catalog of 4K HDR movies, series, anime, and Asian dramas on CinemaHD.',
    url: 'https://cinemahd.pro.et/explore',
    siteName: 'CinemaHD',
  },
};

export default async function ExplorePage() {
  const catalog = await getMediaCatalog();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CinemaHD Explore Catalog',
    description: 'Trending movies and TV shows available for streaming in full HD.',
    numberOfItems: catalog.all.length,
    itemListElement: catalog.all.slice(0, 30).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `https://cinemahd.pro.et/watch/${item.mediaType}/${item.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        }
      >
        <ExploreClient initialCatalog={catalog} />
      </Suspense>
    </>
  );
}
