-- AI Value Sandbox — Workshop reservations table
-- Populated by the Paddle webhook (service role only) after a real payment.
-- Run this in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS workshop_reservations (
  id                       UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at               TIMESTAMPTZ  DEFAULT NOW() NOT NULL,

  -- Paddle
  paddle_transaction_id    TEXT         NOT NULL UNIQUE,
  paddle_customer_id       TEXT,

  -- Buyer
  buyer_name               TEXT,
  buyer_email              TEXT         NOT NULL,

  -- Order
  seats                    SMALLINT     NOT NULL CHECK (seats >= 1),
  unit_price_cents         INTEGER,
  total_price_cents        INTEGER      NOT NULL,
  currency                 TEXT         NOT NULL DEFAULT 'QAR',
  status                   TEXT         NOT NULL DEFAULT 'paid'
                            CHECK (status IN ('paid', 'refunded', 'disputed')),

  -- Confirmation
  confirmation_email_sent  BOOLEAN      NOT NULL DEFAULT FALSE,

  -- Full webhook payload, for audit/debugging
  raw_event                JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS reservations_email_idx   ON workshop_reservations (buyer_email);
CREATE INDEX IF NOT EXISTS reservations_created_idx ON workshop_reservations (created_at DESC);

-- Row Level Security — service role only (written by the webhook, never the browser)
ALTER TABLE workshop_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full" ON workshop_reservations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
