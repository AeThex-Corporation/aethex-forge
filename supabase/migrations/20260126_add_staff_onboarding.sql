-- Staff Onboarding Progress Table
-- Tracks individual checklist item completion for new staff members

CREATE TABLE IF NOT EXISTS staff_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_item TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('day1', 'week1', 'month1')),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checklist_item)
);

-- Create index for faster lookups
CREATE INDEX idx_staff_onboarding_user_id ON staff_onboarding_progress(user_id);
CREATE INDEX idx_staff_onboarding_phase ON staff_onboarding_progress(phase);

-- Enable RLS
ALTER TABLE staff_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Staff can view and update their own onboarding progress
CREATE POLICY "Staff can view own onboarding progress"
  ON staff_onboarding_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can update own onboarding progress"
  ON staff_onboarding_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can insert own onboarding progress"
  ON staff_onboarding_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Managers can view team onboarding progress (staff members table has manager info)
CREATE POLICY "Managers can view team onboarding progress"
  ON staff_onboarding_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      WHERE sm.user_id = staff_onboarding_progress.user_id
      AND sm.manager_id = auth.uid()
    )
  );

-- Staff onboarding metadata for start date and manager assignment
CREATE TABLE IF NOT EXISTS staff_onboarding_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  manager_id UUID REFERENCES auth.users(id),
  department TEXT,
  role_title TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for metadata
ALTER TABLE staff_onboarding_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own metadata"
  ON staff_onboarding_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team metadata"
  ON staff_onboarding_metadata
  FOR SELECT
  USING (auth.uid() = manager_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_staff_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER staff_onboarding_progress_updated_at
  BEFORE UPDATE ON staff_onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_onboarding_updated_at();

CREATE TRIGGER staff_onboarding_metadata_updated_at
  BEFORE UPDATE ON staff_onboarding_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_onboarding_updated_at();
