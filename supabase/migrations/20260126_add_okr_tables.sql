-- OKR (Objectives and Key Results) Management Tables
-- Allows staff to set and track quarterly goals

-- Staff OKRs table
CREATE TABLE IF NOT EXISTS staff_okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  year INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  team TEXT,
  owner_type TEXT DEFAULT 'individual' CHECK (owner_type IN ('individual', 'team', 'company')),
  parent_okr_id UUID REFERENCES staff_okrs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Results table (linked to OKRs)
CREATE TABLE IF NOT EXISTS staff_key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES staff_okrs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  metric_type TEXT DEFAULT 'percentage' CHECK (metric_type IN ('percentage', 'number', 'currency', 'boolean')),
  start_value DECIMAL DEFAULT 0,
  current_value DECIMAL DEFAULT 0,
  target_value DECIMAL NOT NULL,
  unit TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'behind', 'completed')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table for tracking OKR updates over time
CREATE TABLE IF NOT EXISTS staff_okr_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES staff_okrs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  progress_snapshot INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE staff_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_okr_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_okrs
CREATE POLICY "Users can view own OKRs" ON staff_okrs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR owner_type IN ('team', 'company'));

CREATE POLICY "Users can create OKRs" ON staff_okrs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own OKRs" ON staff_okrs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own OKRs" ON staff_okrs
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for key_results
CREATE POLICY "Users can view key results" ON staff_key_results
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_okrs
      WHERE staff_okrs.id = staff_key_results.okr_id
      AND (staff_okrs.user_id = auth.uid() OR staff_okrs.owner_type IN ('team', 'company'))
    )
  );

CREATE POLICY "Users can manage own key results" ON staff_key_results
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_okrs
      WHERE staff_okrs.id = staff_key_results.okr_id
      AND staff_okrs.user_id = auth.uid()
    )
  );

-- RLS Policies for checkins
CREATE POLICY "Users can view checkins" ON staff_okr_checkins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create checkins" ON staff_okr_checkins
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_okrs_user ON staff_okrs(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_okrs_quarter ON staff_okrs(year, quarter);
CREATE INDEX IF NOT EXISTS idx_staff_okrs_status ON staff_okrs(status);
CREATE INDEX IF NOT EXISTS idx_staff_key_results_okr ON staff_key_results(okr_id);
CREATE INDEX IF NOT EXISTS idx_staff_okr_checkins_okr ON staff_okr_checkins(okr_id);

-- Function to calculate OKR progress based on key results
CREATE OR REPLACE FUNCTION calculate_okr_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE staff_okrs
  SET progress = (
    SELECT COALESCE(AVG(progress), 0)::INTEGER
    FROM staff_key_results
    WHERE okr_id = NEW.okr_id
  ),
  updated_at = NOW()
  WHERE id = NEW.okr_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update OKR progress when key results change
DROP TRIGGER IF EXISTS update_okr_progress ON staff_key_results;
CREATE TRIGGER update_okr_progress
  AFTER INSERT OR UPDATE OR DELETE ON staff_key_results
  FOR EACH ROW
  EXECUTE FUNCTION calculate_okr_progress();
