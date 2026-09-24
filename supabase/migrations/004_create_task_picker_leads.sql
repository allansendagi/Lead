-- AI Value Sandbox — capture leads from /pick-your-task
-- Run this in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS task_picker_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  email TEXT NOT NULL,
  name TEXT,

  workflow TEXT NOT NULL,
  task_text TEXT NOT NULL,

  predictability INT NOT NULL CHECK (predictability BETWEEN 1 AND 5),
  data_availability INT NOT NULL CHECK (data_availability BETWEEN 1 AND 5),
  complexity INT NOT NULL CHECK (complexity BETWEEN 1 AND 5),
  frequency INT NOT NULL CHECK (frequency BETWEEN 1 AND 5),

  classification TEXT NOT NULL CHECK (classification IN ('fixed', 'estimate')),
  automation_fit TEXT NOT NULL CHECK (automation_fit IN ('Low', 'Medium', 'High')),
  ai_potential TEXT NOT NULL CHECK (ai_potential IN ('Low', 'Medium', 'High')),

  ip TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS task_picker_leads_created_at_idx ON task_picker_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS task_picker_leads_email_idx ON task_picker_leads (email);
