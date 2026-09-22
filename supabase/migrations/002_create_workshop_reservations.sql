-- AI Value Sandbox — Workshop reservations table
-- Populated by /api/reserve when someone reserves a seat (bank transfer or WhatsApp).
-- Run this in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS workshop_reservations (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMPTZ  DEFAULT NOW() NOT NULL,

  -- Buyer
  name             TEXT         NOT NULL,
  email            TEXT         NOT NULL,

  -- Order
  seats            SMALLINT     NOT NULL CHECK (seats >= 1 AND seats <= 10),
  total_qar        INTEGER      NOT NULL,
  payment_method   TEXT         NOT NULL DEFAULT 'bank_transfer'
                   CHECK (payment_method IN ('bank_transfer', 'whatsapp')),

  -- Status — this business has no payment gateway, so payment is confirmed
  -- manually by Allan (over WhatsApp) once proof of transfer is received.
  status           TEXT         NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'cancelled')),

  -- Request metadata
  user_agent       TEXT,
  ip_address       TEXT,

  -- Confirmation
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT FALSE,

  -- CRM notes (manual)
  notes            TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS reservations_email_idx   ON workshop_reservations (email);
CREATE INDEX IF NOT EXISTS reservations_status_idx  ON workshop_reservations (status);
CREATE INDEX IF NOT EXISTS reservations_created_idx ON workshop_reservations (created_at DESC);

-- Row Level Security
ALTER TABLE workshop_reservations ENABLE ROW LEVEL SECURITY;

-- Anon (our API serverless function) can insert
CREATE POLICY "anon_insert" ON workshop_reservations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Service role has full access (admin, marking payments confirmed)
CREATE POLICY "service_full" ON workshop_reservations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
