-- ###########################################################
-- DATABASE SCHEMA: Task Manager Pro v1.0 (Live Verified)
-- ###########################################################

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Todos Table (Matches your live production columns)
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,                -- Support for detailed notes
  is_completed BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_recovered BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active'::text,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  deleted_at TIMESTAMP WITH TIME ZONE, -- Used for the 3-day purge
  due_date TIMESTAMP WITH TIME ZONE
);

-- 3. AI Cache Table
CREATE TABLE IF NOT EXISTS ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ###########################################################
-- AUTOMATION: 3-Day Rolling Purge Logic
-- ###########################################################

-- The function that powers your automated cleanup
CREATE OR REPLACE FUNCTION purge_old_trash()
RETURNS void AS $$
BEGIN
  DELETE FROM todos
  WHERE status = 'deleted'
  AND deleted_at < NOW() - INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql;

-- CRON Job Registration (Idempotent)
-- Run this once in SQL Editor to ensure the job is active
SELECT cron.unschedule('purge-trash-daily');
SELECT cron.schedule(
  'purge-trash-daily',
  '0 0 * * *',
  'SELECT purge_old_trash();'
);