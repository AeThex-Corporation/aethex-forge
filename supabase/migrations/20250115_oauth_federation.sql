-- OAuth Federation: Link external OAuth providers to Foundation Passports
-- This allows users to login via GitHub, Discord, Google, Roblox, etc.
-- and all logins federate to a single Foundation Passport

CREATE TABLE IF NOT EXISTS public.provider_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to the Foundation Passport (user_profiles.id)
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- OAuth provider name (github, discord, google, roblox, ethereum, etc)
  provider TEXT NOT NULL,
  
  -- The unique ID from the OAuth provider
  provider_user_id TEXT NOT NULL,
  
  -- User's email from the provider (for identity verification)
  provider_email TEXT,
  
  -- Additional provider data (JSON: avatar, username, etc)
  provider_data JSONB,
  
  -- When this provider was linked
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one provider ID per provider
  UNIQUE(provider, provider_user_id),
  
  -- Ensure one user doesn't have duplicate providers
  UNIQUE(user_id, provider)
);

-- Indexes for fast OAuth callback lookups
CREATE INDEX idx_provider_identities_provider_user_id 
  ON public.provider_identities(provider, provider_user_id);

CREATE INDEX idx_provider_identities_user_id 
  ON public.provider_identities(user_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_identities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_identities TO service_role;

-- Enable RLS
ALTER TABLE public.provider_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own provider identities" ON public.provider_identities;
CREATE POLICY "Users can view own provider identities"
  ON public.provider_identities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own provider identities" ON public.provider_identities;
CREATE POLICY "Users can insert own provider identities"
  ON public.provider_identities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own provider identities" ON public.provider_identities;
CREATE POLICY "Users can update own provider identities"
  ON public.provider_identities FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own provider identities" ON public.provider_identities;
CREATE POLICY "Users can delete own provider identities"
  ON public.provider_identities FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all provider identities" ON public.provider_identities;
CREATE POLICY "Service role can manage all provider identities"
  ON public.provider_identities
  FOR ALL
  USING (current_user_id() = (SELECT id FROM auth.users WHERE id = auth.uid()));
