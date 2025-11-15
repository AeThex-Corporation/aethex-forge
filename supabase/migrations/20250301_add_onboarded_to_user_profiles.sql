-- Add onboarded column to track if user has completed onboarding
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT false;

-- Create index for filtering onboarded users
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarded ON user_profiles(onboarded);
