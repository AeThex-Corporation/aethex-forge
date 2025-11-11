-- Add location column to staff_members table if it doesn't exist
ALTER TABLE IF EXISTS staff_members
ADD COLUMN IF NOT EXISTS location TEXT;

-- Also add to staff_contractors for consistency
ALTER TABLE IF EXISTS staff_contractors
ADD COLUMN IF NOT EXISTS location TEXT;
