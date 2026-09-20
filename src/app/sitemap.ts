import type { MetadataRoute } from 'next';
import { getMediaCatalog, createMediaSlug } from '@/lib/tmdb';

const BASE_URL = 'https://cinemahd.pro.et';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/download-apk`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/dmca`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  try {
    const catalog = await getMediaCatalog();
    const mediaItems = catalog.all || [];

    const movieRoutes: MetadataRoute.Sitemap = mediaItems
      .filter((m) => m.mediaType === 'movie')
      .map((movie) => ({
        url: `${BASE_URL}/watch/movie/${createMediaSlug(movie)}`,
        lastModified: movie.releaseDate ? new Date(movie.releaseDate) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    const tvRoutes: MetadataRoute.Sitemap = mediaItems
      .filter((m) => m.mediaType === 'tv')
      .map((series) => ({
        url: `${BASE_URL}/watch/tv/${createMediaSlug(series)}`,
        lastModified: series.releaseDate ? new Date(series.releaseDate) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    return [...staticRoutes, ...movieRoutes, ...tvRoutes];
  } catch (err) {
    console.error('Error generating media sitemap:', err);
    return staticRoutes;
  }
}
