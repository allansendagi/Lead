-- AI Navigator Lead Magnet — Leads table
-- Run this in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ  DEFAULT NOW() NOT NULL,

  -- Contact
  name         TEXT         NOT NULL,
  company      TEXT,
  phone        TEXT,
  email        TEXT,
  contact_mode TEXT         NOT NULL DEFAULT 'wa'
               CHECK (contact_mode IN ('wa', 'email', 'both')),

  -- Assessment (Chapter 2 scoring: each answer 1-3, total 5-15)
  score        SMALLINT     NOT NULL CHECK (score >= 5 AND score <= 15),
  band         TEXT         NOT NULL
               CHECK (band IN ('foundation', 'getting', 'good', 'ready')),
  answers      JSONB        NOT NULL, -- [q1,q2,q3,q4,q5] each 1|2|3

  -- Dimensions (human-readable labels stored for easy reporting)
  dim_starting     TEXT,
  dim_complexity   TEXT,
  dim_data         TEXT,
  dim_volume       TEXT,
  dim_team         TEXT,

  -- Request metadata
  user_agent   TEXT,
  referrer     TEXT,
  ip_address   TEXT,
  is_honeypot  BOOLEAN      NOT NULL DEFAULT FALSE,

  -- Engagement
  wa_opened         BOOLEAN NOT NULL DEFAULT FALSE,
  linkedin_shared   BOOLEAN NOT NULL DEFAULT FALSE,

  -- CRM notes (manual)
  notes        TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS leads_band_idx       ON leads (band)        WHERE NOT is_honeypot;
CREATE INDEX IF NOT EXISTS leads_score_idx      ON leads (score)       WHERE NOT is_honeypot;
CREATE INDEX IF NOT EXISTS leads_created_idx    ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_ip_idx         ON leads (ip_address, created_at);
CREATE INDEX IF NOT EXISTS leads_email_idx      ON leads (email)       WHERE email IS NOT NULL;

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anon (our API serverless function) can insert
CREATE POLICY "anon_insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Service role has full access (admin, analytics)
CREATE POLICY "service_full" ON leads
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read real leads (for future dashboard)
CREATE POLICY "auth_read_real" ON leads
  FOR SELECT TO authenticated
  USING (NOT is_honeypot);
