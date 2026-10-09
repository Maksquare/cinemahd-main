import { NextResponse } from 'next/server';
import { fetchLiveMediaCatalog } from '@/lib/tmdb';

export async function GET() {
  try {
    const catalog = await fetchLiveMediaCatalog();
    return NextResponse.json(
      {
        ...catalog,
        items: catalog.all,
        count: catalog.all.length,
        source: 'tmdb_live',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err: any) {
    console.error('Failed to serve /api/media:', err);
    return NextResponse.json(
      { items: [], count: 0, error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
