-- Add staff management tables for the Staff Arm

-- Staff members table
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('owner', 'admin', 'founder', 'staff', 'employee')),
  is_active BOOLEAN DEFAULT true,
  hired_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Staff contractors table
CREATE TABLE IF NOT EXISTS staff_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  contract_type TEXT DEFAULT 'contractor' CHECK (contract_type IN ('contractor', 'consultant', 'partner')),
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_staff_members_email ON staff_members(email);
CREATE INDEX idx_staff_members_user_id ON staff_members(user_id);
CREATE INDEX idx_staff_members_role ON staff_members(role);
CREATE INDEX idx_staff_members_is_active ON staff_members(is_active);

CREATE INDEX idx_staff_contractors_email ON staff_contractors(email);
CREATE INDEX idx_staff_contractors_user_id ON staff_contractors(user_id);
CREATE INDEX idx_staff_contractors_is_active ON staff_contractors(is_active);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_contractors ENABLE ROW LEVEL SECURITY;

-- Staff members policies

-- Allow authenticated users to read all staff members (directory)
CREATE POLICY "staff_members_select_authenticated" ON staff_members
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow staff members to update their own record
CREATE POLICY "staff_members_update_own" ON staff_members
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Allow admins to do anything
CREATE POLICY "staff_members_admin_all" ON staff_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      WHERE sm.user_id = auth.uid()
      AND sm.role IN ('owner', 'admin', 'founder')
    )
    OR auth.role() = 'service_role'
  );

-- Staff contractors policies

-- Allow authenticated users to read all contractors (directory)
CREATE POLICY "staff_contractors_select_authenticated" ON staff_contractors
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow contractors to update their own record
CREATE POLICY "staff_contractors_update_own" ON staff_contractors
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Allow admins to do anything
CREATE POLICY "staff_contractors_admin_all" ON staff_contractors
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff_members sm
      WHERE sm.user_id = auth.uid()
      AND sm.role IN ('owner', 'admin', 'founder')
    )
    OR auth.role() = 'service_role'
  );

-- Helper function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff_member(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_members
    WHERE staff_members.user_id = $1 AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM staff_contractors
    WHERE staff_contractors.user_id = $1 AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is staff admin
CREATE OR REPLACE FUNCTION is_staff_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_members
    WHERE staff_members.user_id = $1
    AND role IN ('owner', 'admin', 'founder')
    AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get user's staff role
CREATE OR REPLACE FUNCTION get_staff_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM staff_members WHERE staff_members.user_id = $1 AND is_active = true LIMIT 1),
    (SELECT contract_type FROM staff_contractors WHERE staff_contractors.user_id = $1 AND is_active = true LIMIT 1),
    'public'::TEXT
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Create view for staff directory (combines members and contractors)
CREATE OR REPLACE VIEW staff_directory AS
  SELECT 
    'member'::TEXT as type,
    id,
    user_id,
    email,
    full_name,
    position,
    department,
    phone,
    avatar_url,
    role,
    is_active,
    created_at
  FROM staff_members
  UNION ALL
  SELECT 
    'contractor'::TEXT as type,
    id,
    user_id,
    email,
    full_name,
    position,
    company as department,
    phone,
    avatar_url,
    contract_type as role,
    is_active,
    created_at
  FROM staff_contractors;
