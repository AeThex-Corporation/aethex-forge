-- Expand user_profiles table with additional profile fields
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS twitch_url TEXT;

-- Skills and expertise
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS skills_detailed JSONB DEFAULT '[]'::jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'intermediate'::text;

-- Professional information
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio_detailed TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available'::text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;

-- Arm affiliations (which arms user is part of)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS arm_affiliations JSONB DEFAULT '[]'::jsonb;

-- Work experience
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb;

-- Verification badges
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS verified_badges JSONB DEFAULT '[]'::jsonb;

-- Nexus profile data
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nexus_profile_complete BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nexus_headline TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nexus_categories JSONB DEFAULT '[]'::jsonb;

-- Portfolio items
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS portfolio_items JSONB DEFAULT '[]'::jsonb;

-- Create indexes for searchability
CREATE INDEX IF NOT EXISTS idx_user_profiles_skills ON user_profiles USING GIN(skills_detailed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_arms ON user_profiles USING GIN(arm_affiliations);
CREATE INDEX IF NOT EXISTS idx_user_profiles_availability ON user_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_nexus_complete ON user_profiles(nexus_profile_complete);

-- Create arm_affiliations table for tracking which activities count toward each arm
CREATE TABLE IF NOT EXISTS user_arm_affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  arm TEXT NOT NULL CHECK (arm IN ('foundation', 'gameforge', 'labs', 'corp', 'devlink')),
  affiliation_type TEXT NOT NULL CHECK (affiliation_type IN ('courses', 'projects', 'research', 'opportunities', 'manual')),
  affiliation_data JSONB DEFAULT '{}'::jsonb,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, arm, affiliation_type)
);

CREATE INDEX IF NOT EXISTS idx_user_arm_affiliations_user ON user_arm_affiliations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_arm_affiliations_arm ON user_arm_affiliations(arm);
CREATE INDEX IF NOT EXISTS idx_user_arm_affiliations_confirmed ON user_arm_affiliations(confirmed);

-- Enable RLS
ALTER TABLE user_arm_affiliations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_arm_affiliations
CREATE POLICY "users_can_view_own_affiliations" ON user_arm_affiliations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_manage_own_affiliations" ON user_arm_affiliations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_affiliations" ON user_arm_affiliations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "authenticated_can_view_public_affiliations" ON user_arm_affiliations
  FOR SELECT TO authenticated USING (confirmed = true);
