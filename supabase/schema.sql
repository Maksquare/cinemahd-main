-- ==============================================================================
-- CinemaHD Supabase Database Schema & Row-Level Security (RLS) Setup
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase project dashboard (https://supabase.com/dashboard)
-- 2. Go to the "SQL Editor" in the left menu.
-- 3. Paste this entire script into a new query and click "Run".
-- ==============================================================================

-- 1. Table: user_watchlists
-- Stores individual user saved movie and TV series bookmarks.
CREATE TABLE IF NOT EXISTS public.user_watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id BIGINT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    release_date TEXT,
    vote_average NUMERIC,
    genres TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_media_watchlist UNIQUE(user_id, media_id)
);

-- 2. Table: user_watch_progress
-- Stores continuous playback progress, episode positions, and watched status per user.
CREATE TABLE IF NOT EXISTS public.user_watch_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id BIGINT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    season INTEGER DEFAULT 1,
    episode INTEGER DEFAULT 1,
    episode_title TEXT,
    percentage_watched NUMERIC DEFAULT 0,
    is_watched BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_media_progress UNIQUE(user_id, media_id)
);

-- 3. Table: media_catalog
-- Stores automatically synced live TMDb movie and TV series catalog data
CREATE TABLE IF NOT EXISTS public.media_catalog (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    category TEXT NOT NULL CHECK (category IN ('movie', 'tv', 'anime', 'asian', 'all')),
    release_date TEXT,
    vote_average NUMERIC DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    genres TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Released',
    duration_minutes INTEGER,
    trailer_youtube_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON public.user_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_created_at ON public.user_watchlists(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_watch_progress_user_id ON public.user_watch_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watch_progress_last_updated ON public.user_watch_progress(user_id, last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_media_catalog_release_date ON public.media_catalog(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_media_catalog_category ON public.media_catalog(category);
CREATE INDEX IF NOT EXISTS idx_media_catalog_media_type ON public.media_catalog(media_type);

-- ==============================================================================
-- 5. Enable Row Level Security (RLS)
-- Crucial: This guarantees NO user can ever read, update, or delete anyone else's data.
-- ==============================================================================
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_catalog ENABLE ROW LEVEL SECURITY;

-- 6. Strict RLS Policies for user_watchlists
DROP POLICY IF EXISTS "Users can read own watchlist" ON public.user_watchlists;
CREATE POLICY "Users can read own watchlist"
ON public.user_watchlists
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own watchlist items" ON public.user_watchlists;
CREATE POLICY "Users can insert own watchlist items"
ON public.user_watchlists
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own watchlist items" ON public.user_watchlists;
CREATE POLICY "Users can update own watchlist items"
ON public.user_watchlists
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own watchlist items" ON public.user_watchlists;
CREATE POLICY "Users can delete own watchlist items"
ON public.user_watchlists
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. Strict RLS Policies for user_watch_progress
DROP POLICY IF EXISTS "Users can read own watch progress" ON public.user_watch_progress;
CREATE POLICY "Users can read own watch progress"
ON public.user_watch_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own watch progress" ON public.user_watch_progress;
CREATE POLICY "Users can insert own watch progress"
ON public.user_watch_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own watch progress" ON public.user_watch_progress;
CREATE POLICY "Users can update own watch progress"
ON public.user_watch_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own watch progress" ON public.user_watch_progress;
CREATE POLICY "Users can delete own watch progress"
ON public.user_watch_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 8. RLS Policies for media_catalog
DROP POLICY IF EXISTS "Public can view media catalog" ON public.media_catalog;
CREATE POLICY "Public can view media catalog"
ON public.media_catalog
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public and anon can upsert media catalog" ON public.media_catalog;
CREATE POLICY "Public and anon can upsert media catalog"
ON public.media_catalog
FOR ALL
TO public
USING (true)
WITH CHECK (true);
