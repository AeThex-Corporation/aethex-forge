-- Create user_email_links table for linking multiple emails to single account
CREATE TABLE IF NOT EXISTS user_email_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookup
CREATE INDEX idx_user_email_links_user_id ON user_email_links(user_id);
CREATE INDEX idx_user_email_links_email ON user_email_links(email);
CREATE INDEX idx_user_email_links_primary ON user_email_links(user_id, is_primary);

-- Enable RLS
ALTER TABLE user_email_links ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own linked emails
CREATE POLICY "Users can view own email links"
  ON user_email_links
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.role() = 'authenticated' AND auth.jwt()->>'email' IN (
      SELECT email FROM user_email_links WHERE user_id = auth.uid()
    )
  );

-- RLS: Service role can do anything (for backend operations)
CREATE POLICY "Service role full access"
  ON user_email_links
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Create a function to resolve linked emails to primary user
CREATE OR REPLACE FUNCTION get_primary_user_by_email(email_input TEXT)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT user_id
    FROM user_email_links
    WHERE LOWER(email) = LOWER(email_input)
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_email_links_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_email_links_updated_at
  BEFORE UPDATE ON user_email_links
  FOR EACH ROW
  EXECUTE FUNCTION update_user_email_links_timestamp();

-- Add flag to user_profiles to mark dev accounts and track merged accounts
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_dev_account BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS primary_email TEXT,
ADD COLUMN IF NOT EXISTS merged_to_user_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL;

-- Create index for dev account lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_dev_account ON user_profiles(is_dev_account);
CREATE INDEX IF NOT EXISTS idx_user_profiles_primary_email ON user_profiles(primary_email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_merged_to ON user_profiles(merged_to_user_id);
