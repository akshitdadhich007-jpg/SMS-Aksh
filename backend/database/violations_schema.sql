-- ============================================================
-- CIVIORA: Violations Table for Auto Fine Generation System
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS violations (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resident_id     TEXT NOT NULL,
    resident_name   TEXT NOT NULL,
    violation_type  TEXT NOT NULL,
    evidence_image  TEXT,
    location        TEXT DEFAULT 'Society Premises',
    fine_amount     INTEGER NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Unpaid'
                    CHECK (status IN ('Unpaid', 'Paid', 'Disputed')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;

-- Admin can read/write all violations
CREATE POLICY "Admins can manage violations"
ON violations
FOR ALL
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Residents can only read their own violations
CREATE POLICY "Residents can view own violations"
ON violations
FOR SELECT
USING (
    resident_id = auth.uid()::TEXT
    OR
    resident_id IN (
        SELECT id::TEXT FROM profiles WHERE id = auth.uid()
    )
);

-- Residents can update status (pay fine)
CREATE POLICY "Residents can update own violation status"
ON violations
FOR UPDATE
USING (
    resident_id = auth.uid()::TEXT
    OR
    resident_id IN (
        SELECT id::TEXT FROM profiles WHERE id = auth.uid()
    )
)
WITH CHECK (status = 'Paid');

-- Enable Realtime for violations table
ALTER PUBLICATION supabase_realtime ADD TABLE violations;

-- Index for faster resident lookups
CREATE INDEX IF NOT EXISTS violations_resident_idx ON violations(resident_id);
CREATE INDEX IF NOT EXISTS violations_status_idx ON violations(status);
CREATE INDEX IF NOT EXISTS violations_created_idx ON violations(created_at DESC);
