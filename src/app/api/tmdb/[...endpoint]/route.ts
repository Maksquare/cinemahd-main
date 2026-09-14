import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/lib/tmdb-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ endpoint: string[] }> }
) {
  const { endpoint } = await params;
  const searchParams = req.nextUrl.searchParams;
  const action = endpoint[0];

  try {
    switch (action) {
      case 'trending': {
        const window = (searchParams.get('window') as 'day' | 'week') || 'day';
        const type = (searchParams.get('type') as 'all' | 'movie' | 'tv') || 'all';
        const data = await tmdb.getTrending(window, type);
        return NextResponse.json(data || { results: [] }, {
          headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
        });
      }

      case 'popular': {
        const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const data = await tmdb.getPopular(type, page);
        return NextResponse.json(data || { results: [] }, {
          headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
        });
      }

      case 'search': {
        const query = searchParams.get('query') || searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        if (!query.trim()) {
          return NextResponse.json({ results: [] });
        }
        const data = await tmdb.search(query, page);
        return NextResponse.json(data || { results: [] }, {
          headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' },
        });
      }

      case 'details': {
        const id = parseInt(searchParams.get('id') || '0', 10);
        const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const data = await tmdb.getDetails(id, type);
        return NextResponse.json(data || null, {
          headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
        });
      }

      case 'providers': {
        const id = parseInt(searchParams.get('id') || '0', 10);
        const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const data = await tmdb.getWatchProviders(id, type);
        return NextResponse.json(data || { results: {} }, {
          headers: { 'Cache-Control': 'public, s-maxage=86400' },
        });
      }

      case 'genres': {
        const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
        const data = await tmdb.getGenres(type);
        return NextResponse.json(data || { genres: [] }, {
          headers: { 'Cache-Control': 'public, s-maxage=86400' },
        });
      }

      case 'season': {
        const tvId = parseInt(searchParams.get('id') || searchParams.get('tvId') || '0', 10);
        const seasonNumber = parseInt(searchParams.get('season') || searchParams.get('seasonNumber') || '1', 10);
        if (!tvId) return NextResponse.json({ error: 'Missing id or tvId' }, { status: 400 });
        const data = await tmdb.getSeason(tvId, seasonNumber);
        return NextResponse.json(data || null, {
          headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800' },
        });
      }

      default:
        return NextResponse.json({ error: `Unknown endpoint: ${action}` }, { status: 404 });
    }
  } catch (err: any) {
    console.error(`API TMDb proxy error for ${action}:`, err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
