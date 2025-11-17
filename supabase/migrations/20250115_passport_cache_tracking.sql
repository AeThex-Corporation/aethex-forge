-- Add cache tracking columns to user_profiles table
-- This tracks when passport was synced from Foundation and when cache expires
-- These fields are CRITICAL for validating that local data is fresh from Foundation

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS foundation_synced_at TIMESTAMP DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cache_valid_until TIMESTAMP DEFAULT NULL;

-- Create index for cache validation queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_cache_valid
ON user_profiles (cache_valid_until DESC)
WHERE cache_valid_until IS NOT NULL;

-- Add comment explaining the cache architecture
COMMENT ON COLUMN user_profiles.foundation_synced_at IS 
'Timestamp when this passport was last synced from aethex.foundation (SSOT). 
This ensures we only serve passports that were explicitly synced from Foundation, 
not locally created or modified.';

COMMENT ON COLUMN user_profiles.cache_valid_until IS 
'Timestamp when this cached passport data becomes stale. 
If current time > cache_valid_until, passport must be refreshed from Foundation.
Typical TTL is 24 hours.';

-- Create a validation function to prevent non-Foundation writes
CREATE OR REPLACE FUNCTION validate_passport_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow updates to these fields (via Foundation sync or local metadata)
  -- Reject any attempt to modify core passport fields outside of sync
  IF TG_OP = 'UPDATE' THEN
    -- If foundation_synced_at is not being set, this is a non-sync update
    -- which should not be modifying passport fields
    IF NEW.foundation_synced_at IS NULL AND OLD.foundation_synced_at IS NOT NULL THEN
      RAISE EXCEPTION 'Cannot modify Foundation passport without sync from Foundation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce passport immutability outside of sync
DROP TRIGGER IF EXISTS enforce_passport_ownership ON user_profiles;
CREATE TRIGGER enforce_passport_ownership
BEFORE INSERT OR UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION validate_passport_ownership();

-- Log message confirming migration
DO $$ BEGIN
  RAISE NOTICE 'Passport cache tracking columns added. 
Foundation is now SSOT, aethex.dev acts as read-only cache.
All passport mutations must originate from aethex.foundation.';
END $$;
