-- Migration: Add wallet verification support
-- This adds a wallet_address field to user_profiles to support the Bridge UI
-- for Phase 2 (Unified Identity: .aethex TLD verification)

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255) UNIQUE NULL DEFAULT NULL;

-- Create an index for faster wallet lookups during verification
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address 
ON user_profiles(wallet_address) 
WHERE wallet_address IS NOT NULL;

-- Add a comment explaining the field
COMMENT ON COLUMN user_profiles.wallet_address IS 'Connected wallet address (e.g., 0x123...). Used for Phase 2 verification and .aethex TLD checks.';
