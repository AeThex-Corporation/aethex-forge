-- Time Tracking Tables for Staff
-- Track work hours, projects, and generate timesheets

-- Time entries table
CREATE TABLE IF NOT EXISTS staff_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES staff_projects(id) ON DELETE SET NULL,
  task_id UUID REFERENCES staff_project_tasks(id) ON DELETE SET NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  is_billable BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheets (weekly/monthly summaries)
CREATE TABLE IF NOT EXISTS staff_timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_hours DECIMAL(10,2) DEFAULT 0,
  billable_hours DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start, period_end)
);

-- Enable RLS
ALTER TABLE staff_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_timesheets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for time_entries
CREATE POLICY "Users can view own time entries" ON staff_time_entries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create time entries" ON staff_time_entries
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own time entries" ON staff_time_entries
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'draft');

CREATE POLICY "Users can delete draft entries" ON staff_time_entries
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND status = 'draft');

-- RLS Policies for timesheets
CREATE POLICY "Users can view own timesheets" ON staff_timesheets
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create timesheets" ON staff_timesheets
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update draft timesheets" ON staff_timesheets
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'draft');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON staff_time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON staff_time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON staff_time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_user ON staff_timesheets(user_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_period ON staff_timesheets(period_start, period_end);

-- Function to update timesheet totals
CREATE OR REPLACE FUNCTION update_timesheet_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE staff_timesheets ts
  SET
    total_hours = (
      SELECT COALESCE(SUM(duration_minutes) / 60.0, 0)
      FROM staff_time_entries te
      WHERE te.user_id = ts.user_id
        AND te.date >= ts.period_start
        AND te.date <= ts.period_end
    ),
    billable_hours = (
      SELECT COALESCE(SUM(duration_minutes) / 60.0, 0)
      FROM staff_time_entries te
      WHERE te.user_id = ts.user_id
        AND te.date >= ts.period_start
        AND te.date <= ts.period_end
        AND te.is_billable = true
    ),
    updated_at = NOW()
  WHERE ts.user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND COALESCE(NEW.date, OLD.date) >= ts.period_start
    AND COALESCE(NEW.date, OLD.date) <= ts.period_end;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timesheet when time entries change
DROP TRIGGER IF EXISTS update_timesheet_on_entry_change ON staff_time_entries;
CREATE TRIGGER update_timesheet_on_entry_change
  AFTER INSERT OR UPDATE OR DELETE ON staff_time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_timesheet_totals();
