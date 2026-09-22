-- AI Value Sandbox — add PayPal as a payment method
-- Run this in: Supabase Dashboard → SQL Editor

-- Rename total_qar → total_amount (now used for both QAR and USD totals)
ALTER TABLE workshop_reservations RENAME COLUMN total_qar TO total_amount;
ALTER TABLE workshop_reservations ALTER COLUMN total_amount TYPE NUMERIC(10, 2);

-- Track which currency total_amount is in
ALTER TABLE workshop_reservations ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'QAR';

-- PayPal order ID — unique, so a retried capture never double-books
ALTER TABLE workshop_reservations ADD COLUMN IF NOT EXISTS paypal_order_id TEXT UNIQUE;

-- Allow 'paypal' as a payment method
ALTER TABLE workshop_reservations DROP CONSTRAINT IF EXISTS workshop_reservations_payment_method_check;
ALTER TABLE workshop_reservations ADD CONSTRAINT workshop_reservations_payment_method_check
  CHECK (payment_method IN ('bank_transfer', 'whatsapp', 'paypal'));
