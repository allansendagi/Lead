-- AI Value Sandbox — capture interest for Cohort 2 (no date/price set yet)
-- Run this in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS cohort2_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  email TEXT NOT NULL,
  name TEXT,

  source TEXT,
  ip TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS cohort2_waitlist_created_at_idx ON cohort2_waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS cohort2_waitlist_email_idx ON cohort2_waitlist (email);

-- Row Level Security
ALTER TABLE cohort2_waitlist ENABLE ROW LEVEL SECURITY;

-- Anon (our API serverless function, if SUPABASE_SERVICE_KEY isn't set) can insert
CREATE POLICY "anon_insert" ON cohort2_waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Service role has full access (admin, reading leads)
CREATE POLICY "service_full" ON cohort2_waitlist
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
