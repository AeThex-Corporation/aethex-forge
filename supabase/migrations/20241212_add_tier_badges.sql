-- Migration: Add tier and badges system for AI persona access
-- Run this migration in your Supabase SQL Editor

-- 1. Create subscription tier enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
        CREATE TYPE subscription_tier_enum AS ENUM ('free', 'pro', 'council');
    END IF;
END $$;

-- 2. Add tier and Stripe columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS tier subscription_tier_enum DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- 3. Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    unlock_criteria TEXT,
    unlocks_persona TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create user_badges junction table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);

-- 6. Enable RLS on new tables
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for badges (read-only for authenticated users)
CREATE POLICY IF NOT EXISTS "Badges are viewable by everyone" 
ON badges FOR SELECT 
USING (true);

-- 8. RLS Policies for user_badges
CREATE POLICY IF NOT EXISTS "Users can view their own badges" 
ON user_badges FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view others badges" 
ON user_badges FOR SELECT 
USING (true);

-- 9. Seed initial badges that unlock AI personas
INSERT INTO badges (name, slug, description, icon, unlock_criteria, unlocks_persona) VALUES
    ('Forge Apprentice', 'forge_apprentice', 'Complete 3 game design reviews with Forge Master', 'hammer', 'Complete 3 game design reviews', 'forge_master'),
    ('SBS Scholar', 'sbs_scholar', 'Create 5 business profiles with SBS Architect', 'building', 'Create 5 business profiles', 'sbs_architect'),
    ('Curriculum Creator', 'curriculum_creator', 'Generate 10 lesson plans with Curriculum Weaver', 'book', 'Generate 10 lesson plans', 'curriculum_weaver'),
    ('Data Pioneer', 'data_pioneer', 'Analyze 20 datasets with QuantumLeap', 'chart', 'Analyze 20 datasets', 'quantum_leap'),
    ('Synthwave Artist', 'synthwave_artist', 'Write 15 song lyrics with Vapor', 'wave', 'Write 15 song lyrics', 'vapor'),
    ('Pitch Survivor', 'pitch_survivor', 'Receive 10 critiques from Apex VC', 'money', 'Receive 10 critiques', 'apex'),
    ('Sound Designer', 'sound_designer', 'Generate 25 audio briefs with Ethos Producer', 'music', 'Generate 25 audio briefs', 'ethos_producer'),
    ('Lore Master', 'lore_master', 'Create 50 lore entries with AeThex Archivist', 'scroll', 'Create 50 lore entries', 'aethex_archivist')
ON CONFLICT (slug) DO NOTHING;

-- 10. Grant permissions
GRANT SELECT ON badges TO authenticated;
GRANT SELECT ON user_badges TO authenticated;
GRANT INSERT, DELETE ON user_badges TO authenticated;
