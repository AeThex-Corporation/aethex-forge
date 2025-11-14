-- Ensure community_posts has arm_affiliation if not already present
-- This migration adds the column and creates the arm_follows tracking table

-- Add arm_affiliation column to community_posts (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'arm_affiliation'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN arm_affiliation TEXT DEFAULT 'labs';
  END IF;
END $$;

-- Create arm_follows table for tracking which arms users follow
CREATE TABLE IF NOT EXISTS arm_follows (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  arm_affiliation TEXT NOT NULL,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, arm_affiliation)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_arm_follows_user_id ON arm_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_arm_follows_arm ON arm_follows(arm_affiliation);

-- Enable RLS on arm_follows
ALTER TABLE arm_follows ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own arm follows
CREATE POLICY "Users can view their own arm follows"
  ON arm_follows
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own arm follows"
  ON arm_follows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own arm follows"
  ON arm_follows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a view for the current user's followed arms
CREATE OR REPLACE VIEW user_followed_arms AS
SELECT 
  af.user_id,
  af.arm_affiliation,
  af.followed_at
FROM arm_follows af
WHERE af.user_id = auth.uid();

-- Ensure community_posts has proper arm_affiliation constraint
ALTER TABLE community_posts
DROP CONSTRAINT IF EXISTS community_posts_arm_affiliation_check,
ADD CONSTRAINT community_posts_arm_affiliation_check 
CHECK (arm_affiliation IN ('labs', 'gameforge', 'corp', 'foundation', 'devlink', 'nexus', 'staff'));

-- Add index for faster arm filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_arm_affiliation ON community_posts(arm_affiliation);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
