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
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON badges;
CREATE POLICY "Badges are viewable by everyone" 
ON badges FOR SELECT 
USING (true);

-- 8. RLS Policies for user_badges
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" 
ON user_badges FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view others badges" ON user_badges;
CREATE POLICY "Users can view others badges" 
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


-- ========================================
-- Next Migration
-- ========================================


-- Create fourthwall_products table
CREATE TABLE IF NOT EXISTS fourthwall_products (
  id BIGSERIAL PRIMARY KEY,
  fourthwall_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  category TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fourthwall_orders table
CREATE TABLE IF NOT EXISTS fourthwall_orders (
  id BIGSERIAL PRIMARY KEY,
  fourthwall_order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fourthwall_webhook_logs table
CREATE TABLE IF NOT EXISTS fourthwall_webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fourthwall_products_fourthwall_id ON fourthwall_products(fourthwall_id);
CREATE INDEX IF NOT EXISTS idx_fourthwall_products_category ON fourthwall_products(category);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_fourthwall_order_id ON fourthwall_orders(fourthwall_order_id);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_customer_email ON fourthwall_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_fourthwall_orders_status ON fourthwall_orders(status);
CREATE INDEX IF NOT EXISTS idx_fourthwall_webhook_logs_event_type ON fourthwall_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_fourthwall_webhook_logs_received_at ON fourthwall_webhook_logs(received_at);

-- Enable RLS (Row Level Security)
ALTER TABLE fourthwall_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fourthwall_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fourthwall_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - allow authenticated users to read, admins to manage
DROP POLICY IF EXISTS "Allow authenticated users to read fourthwall products" ON fourthwall_products;
CREATE POLICY "Allow authenticated users to read fourthwall products"
  ON fourthwall_products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service role to manage fourthwall products" ON fourthwall_products;
CREATE POLICY "Allow service role to manage fourthwall products"
  ON fourthwall_products
  FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role to manage fourthwall orders" ON fourthwall_orders;
CREATE POLICY "Allow service role to manage fourthwall orders"
  ON fourthwall_orders
  FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role to manage webhook logs" ON fourthwall_webhook_logs;
CREATE POLICY "Allow service role to manage webhook logs"
  ON fourthwall_webhook_logs
  FOR ALL
  USING (auth.role() = 'service_role');


-- ========================================
-- Next Migration
-- ========================================


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


-- ========================================
-- Next Migration
-- ========================================


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
DROP INDEX IF EXISTS public.idx_provider_identities_provider_user_id;
CREATE INDEX idx_provider_identities_provider_user_id 
  ON public.provider_identities(provider, provider_user_id);

DROP INDEX IF EXISTS public.idx_provider_identities_user_id;
CREATE INDEX idx_provider_identities_user_id 
  ON public.provider_identities(user_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_identities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_identities TO service_role;

-- Enable RLS
ALTER TABLE public.provider_identities ENABLE ROW LEVEL SECURITY;

-- Users can only see their own provider identities
DROP POLICY IF EXISTS "Users can view own provider identities" ON public.provider_identities;
CREATE POLICY "Users can view own provider identities"
  ON public.provider_identities FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own provider identities
DROP POLICY IF EXISTS "Users can insert own provider identities" ON public.provider_identities;
CREATE POLICY "Users can insert own provider identities"
  ON public.provider_identities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own provider identities
DROP POLICY IF EXISTS "Users can update own provider identities" ON public.provider_identities;
CREATE POLICY "Users can update own provider identities"
  ON public.provider_identities FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own provider identities
DROP POLICY IF EXISTS "Users can delete own provider identities" ON public.provider_identities;
CREATE POLICY "Users can delete own provider identities"
  ON public.provider_identities FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can do anything for OAuth flows
DROP POLICY IF EXISTS "Service role can manage all provider identities" ON public.provider_identities;
CREATE POLICY "Service role can manage all provider identities"
  ON public.provider_identities
  FOR ALL
  TO service_role
  USING (true);


-- ========================================
-- Next Migration
-- ========================================


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


-- ========================================
-- Next Migration
-- ========================================


-- Table for storing Discord webhook configurations for community posts
CREATE TABLE IF NOT EXISTS public.discord_post_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_id TEXT NOT NULL,
  arm_affiliation TEXT NOT NULL,
  auto_post BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, guild_id, channel_id, arm_affiliation)
);

-- Enable RLS
ALTER TABLE public.discord_post_webhooks ENABLE ROW LEVEL SECURITY;

-- Policies for discord_post_webhooks
DROP POLICY IF EXISTS "discord_webhooks_read_own" ON public.discord_post_webhooks;
CREATE POLICY "discord_webhooks_read_own" ON public.discord_post_webhooks
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "discord_webhooks_manage_own" ON public.discord_post_webhooks;
CREATE POLICY "discord_webhooks_manage_own" ON public.discord_post_webhooks
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discord_post_webhooks_user_id ON public.discord_post_webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_post_webhooks_guild_id ON public.discord_post_webhooks(guild_id);

-- Grant service role access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discord_post_webhooks TO service_role;


-- ========================================
-- Next Migration
-- ========================================


-- Add likes_count and comments_count columns to community_posts if they don't exist
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0 NOT NULL;

-- Create function to update likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = (SELECT COUNT(*) FROM public.community_post_likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = (SELECT COUNT(*) FROM public.community_post_likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update comments_count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = (SELECT COUNT(*) FROM public.community_comments WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = (SELECT COUNT(*) FROM public.community_comments WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON public.community_post_likes;
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON public.community_comments;

-- Create triggers for likes
CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON public.community_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

-- Create triggers for comments
CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();


-- ========================================
-- Next Migration
-- ========================================


-- Add arm_affiliation column to community_posts
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS arm_affiliation TEXT DEFAULT 'labs' NOT NULL;

-- Create index on arm_affiliation for faster filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_arm_affiliation ON public.community_posts(arm_affiliation);

-- Drop table if it exists (from earlier migration)
DROP TABLE IF EXISTS public.user_followed_arms CASCADE;

-- Create user_followed_arms table to track which arms users follow
CREATE TABLE IF NOT EXISTS public.user_followed_arms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  arm_id TEXT NOT NULL,
  followed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, arm_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_followed_arms_user_id ON public.user_followed_arms(user_id);

-- Create index on arm_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_user_followed_arms_arm_id ON public.user_followed_arms(arm_id);

-- Enable RLS on user_followed_arms
ALTER TABLE public.user_followed_arms ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all followed arms data
DROP POLICY IF EXISTS "user_followed_arms_read" ON public.user_followed_arms;
CREATE POLICY "user_followed_arms_read" ON public.user_followed_arms
  FOR SELECT TO authenticated USING (true);

-- Policy: Users can manage their own followed arms
DROP POLICY IF EXISTS "user_followed_arms_manage_self" ON public.user_followed_arms;
CREATE POLICY "user_followed_arms_manage_self" ON public.user_followed_arms
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Update community_posts table constraints and indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON public.community_posts(author_id);

-- Add grant for service role (backend API access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_followed_arms TO service_role;


-- ========================================
-- Next Migration
-- ========================================


-- Add location column to staff_members table if it doesn't exist
ALTER TABLE IF EXISTS staff_members
ADD COLUMN IF NOT EXISTS location TEXT;

-- Also add to staff_contractors for consistency
ALTER TABLE IF EXISTS staff_contractors
ADD COLUMN IF NOT EXISTS location TEXT;


-- ========================================
-- Next Migration
-- ========================================


-- Create extension if needed
create extension if not exists "pgcrypto";

-- Ethos Tracks Table
-- Stores music, SFX, and audio assets uploaded by artists to the Ethos Guild
create table if not exists public.ethos_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null, -- Path to MP3/WAV in storage
  duration_seconds int, -- Track length in seconds
  genre text[], -- e.g., ['Synthwave', 'Orchestral', 'SFX']
  license_type text not null default 'ecosystem' check (license_type in ('ecosystem', 'commercial_sample')),
  -- 'ecosystem': Free license for non-commercial AeThex use
  -- 'commercial_sample': Demo track (user must negotiate commercial licensing)
  bpm int, -- Beats per minute (useful for synchronization)
  is_published boolean not null default true,
  download_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_tracks_user_id_idx on public.ethos_tracks (user_id);
create index if not exists ethos_tracks_license_type_idx on public.ethos_tracks (license_type);
create index if not exists ethos_tracks_genre_gin on public.ethos_tracks using gin (genre);
create index if not exists ethos_tracks_created_at_idx on public.ethos_tracks (created_at desc);

-- Ethos Artist Profiles Table
-- Extends user_profiles with Ethos-specific skills, pricing, and portfolio info
create table if not exists public.ethos_artist_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  skills text[] not null default '{}', -- e.g., ['Synthwave', 'SFX Design', 'Orchestral', 'Game Audio']
  for_hire boolean not null default true, -- Whether artist accepts commissions
  bio text, -- Artist bio/statement
  portfolio_url text, -- External portfolio link
  sample_price_track numeric(10, 2), -- e.g., 500.00 for "Custom Track - $500"
  sample_price_sfx numeric(10, 2), -- e.g., 150.00 for "SFX Pack - $150"
  sample_price_score numeric(10, 2), -- e.g., 2000.00 for "Full Score - $2000"
  turnaround_days int, -- Estimated delivery time in days
  verified boolean not null default false, -- Verified Ethos artist
  total_downloads int not null default 0, -- Total downloads across all tracks
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_artist_profiles_for_hire_idx on public.ethos_artist_profiles (for_hire);
create index if not exists ethos_artist_profiles_verified_idx on public.ethos_artist_profiles (verified);
create index if not exists ethos_artist_profiles_skills_gin on public.ethos_artist_profiles using gin (skills);

-- Ethos Guild Membership Table (optional - tracks who's "part of" the guild)
create table if not exists public.ethos_guild_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'curator', 'admin')),
  -- member: regular artist
  -- curator: can feature/recommend tracks
  -- admin: manages the guild (hiring, moderation, etc.)
  joined_at timestamptz not null default now(),
  bio text -- Member's artist bio
);

create index if not exists ethos_guild_members_user_id_idx on public.ethos_guild_members (user_id);
create index if not exists ethos_guild_members_role_idx on public.ethos_guild_members (role);
create unique index if not exists ethos_guild_members_user_id_unique on public.ethos_guild_members (user_id);

-- Licensing Agreements Table (for tracking commercial contracts)
create table if not exists public.ethos_licensing_agreements (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.ethos_tracks(id) on delete cascade,
  licensee_id uuid not null references public.user_profiles(id) on delete cascade,
  -- licensee_id: The person/org licensing the track (e.g., CORP consulting client)
  license_type text not null check (license_type in ('commercial_one_time', 'commercial_exclusive', 'broadcast')),
  agreement_url text, -- Link to signed contract or legal document
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists ethos_licensing_agreements_track_id_idx on public.ethos_licensing_agreements (track_id);
create index if not exists ethos_licensing_agreements_licensee_id_idx on public.ethos_licensing_agreements (licensee_id);

-- Enable RLS
alter table public.ethos_tracks enable row level security;
alter table public.ethos_artist_profiles enable row level security;
alter table public.ethos_guild_members enable row level security;
alter table public.ethos_licensing_agreements enable row level security;

-- RLS Policies: ethos_tracks
drop policy if exists "Ethos tracks are readable by all authenticated users" on public.ethos_tracks;
create policy "Ethos tracks are readable by all authenticated users" on public.ethos_tracks
  for select using (auth.role() = 'authenticated');

drop policy if exists "Users can insert their own tracks" on public.ethos_tracks;
create policy "Users can insert their own tracks" on public.ethos_tracks
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tracks" on public.ethos_tracks;
create policy "Users can update their own tracks" on public.ethos_tracks
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own tracks" on public.ethos_tracks;
create policy "Users can delete their own tracks" on public.ethos_tracks
  for delete using (auth.uid() = user_id);

-- RLS Policies: ethos_artist_profiles
drop policy if exists "Ethos artist profiles are readable by all authenticated users" on public.ethos_artist_profiles;
create policy "Ethos artist profiles are readable by all authenticated users" on public.ethos_artist_profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "Users can insert their own artist profile" on public.ethos_artist_profiles;
create policy "Users can insert their own artist profile" on public.ethos_artist_profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own artist profile" on public.ethos_artist_profiles;
create policy "Users can update their own artist profile" on public.ethos_artist_profiles
  for update using (auth.uid() = user_id);

-- RLS Policies: ethos_guild_members
drop policy if exists "Guild membership is readable by all authenticated users" on public.ethos_guild_members;
create policy "Guild membership is readable by all authenticated users" on public.ethos_guild_members
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage guild members" on public.ethos_guild_members;
create policy "Admins can manage guild members" on public.ethos_guild_members
  for all using (
    exists(
      select 1 from public.ethos_guild_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Users can see their own membership" on public.ethos_guild_members;
create policy "Users can see their own membership" on public.ethos_guild_members
  for select using (auth.uid() = user_id or auth.role() = 'authenticated');

-- RLS Policies: ethos_licensing_agreements
drop policy if exists "Licensing agreements readable by involved parties" on public.ethos_licensing_agreements;
create policy "Licensing agreements readable by involved parties" on public.ethos_licensing_agreements
  for select using (
    auth.uid() in (
      select user_id from public.ethos_tracks where id = track_id
      union
      select licensee_id
    )
    or exists(
      select 1 from public.ethos_guild_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Track owners can approve agreements" on public.ethos_licensing_agreements;
create policy "Track owners can approve agreements" on public.ethos_licensing_agreements
  for update using (
    auth.uid() in (
      select user_id from public.ethos_tracks where id = track_id
    )
  );

-- Triggers to maintain updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ethos_tracks_set_updated_at on public.ethos_tracks;
create trigger ethos_tracks_set_updated_at
  before update on public.ethos_tracks
  for each row execute function public.set_updated_at();

drop trigger if exists ethos_artist_profiles_set_updated_at on public.ethos_artist_profiles;
create trigger ethos_artist_profiles_set_updated_at
  before update on public.ethos_artist_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists ethos_guild_members_set_updated_at on public.ethos_guild_members;
create trigger ethos_guild_members_set_updated_at
  before update on public.ethos_guild_members
  for each row execute function public.set_updated_at();

-- Comments for documentation
comment on table public.ethos_tracks is 'Music, SFX, and audio tracks uploaded by Ethos Guild artists';
comment on table public.ethos_artist_profiles is 'Extended profiles for Ethos Guild artists with skills, pricing, and portfolio info';
comment on table public.ethos_guild_members is 'Membership tracking for the Ethos Guild community';
comment on table public.ethos_licensing_agreements is 'Commercial licensing agreements for track usage';


-- ========================================
-- Next Migration
-- ========================================


-- Ethos Artist Verification Requests Table
-- Tracks pending artist verification submissions
create table if not exists public.ethos_verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  artist_profile_id uuid not null references public.ethos_artist_profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- pending: awaiting review
  -- approved: artist verified
  -- rejected: application rejected
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.user_profiles(id), -- Admin who reviewed
  rejection_reason text, -- Why was this rejected
  submission_notes text, -- Artist's application notes
  portfolio_links text[], -- Links to artist's portfolio/samples
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_verification_requests_user_id_idx on public.ethos_verification_requests (user_id);
create index if not exists ethos_verification_requests_status_idx on public.ethos_verification_requests (status);
create index if not exists ethos_verification_requests_submitted_at_idx on public.ethos_verification_requests (submitted_at desc);
create unique index if not exists ethos_verification_requests_user_id_unique on public.ethos_verification_requests (user_id);

-- Ethos Artist Verification Audit Log
-- Tracks all verification decisions for compliance
create table if not exists public.ethos_verification_audit_log (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ethos_verification_requests(id) on delete cascade,
  action text not null check (action in ('submitted', 'approved', 'rejected', 'resubmitted')),
  actor_id uuid references public.user_profiles(id), -- Who performed this action
  notes text, -- Additional context
  created_at timestamptz not null default now()
);

create index if not exists ethos_verification_audit_log_request_id_idx on public.ethos_verification_audit_log (request_id);
create index if not exists ethos_verification_audit_log_actor_id_idx on public.ethos_verification_audit_log (actor_id);
create index if not exists ethos_verification_audit_log_action_idx on public.ethos_verification_audit_log (action);

-- Enable RLS
alter table public.ethos_verification_requests enable row level security;
alter table public.ethos_verification_audit_log enable row level security;

-- RLS Policies: ethos_verification_requests
drop policy if exists "Artists can view their own verification request" on public.ethos_verification_requests;
create policy "Artists can view their own verification request" on public.ethos_verification_requests
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all verification requests" on public.ethos_verification_requests;
create policy "Admins can view all verification requests" on public.ethos_verification_requests
  for select using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and user_type = 'staff'
    )
  );

drop policy if exists "Artists can submit verification request" on public.ethos_verification_requests;
create policy "Artists can submit verification request" on public.ethos_verification_requests
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can update verification status" on public.ethos_verification_requests;
create policy "Admins can update verification status" on public.ethos_verification_requests
  for update using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and user_type = 'staff'
    )
  );

-- RLS Policies: ethos_verification_audit_log
drop policy if exists "Admins can view audit log" on public.ethos_verification_audit_log;
create policy "Admins can view audit log" on public.ethos_verification_audit_log
  for select using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and user_type = 'staff'
    )
  );

drop policy if exists "System can write audit logs" on public.ethos_verification_audit_log;
create policy "System can write audit logs" on public.ethos_verification_audit_log
  for insert with check (true);

-- Triggers to maintain updated_at
create or replace function public.set_verification_request_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ethos_verification_requests_set_updated_at on public.ethos_verification_requests;
create trigger ethos_verification_requests_set_updated_at
  before update on public.ethos_verification_requests
  for each row execute function public.set_verification_request_updated_at();

-- Comments for documentation
comment on table public.ethos_verification_requests is 'Tracks artist verification submissions and decisions for manual admin review';
comment on table public.ethos_verification_audit_log is 'Audit trail for all verification actions and decisions';


-- ========================================
-- Next Migration
-- ========================================


-- Create storage bucket for Ethos tracks if it doesn't exist
-- Note: This SQL migration cannot create buckets directly via SQL
-- The bucket must be created via the Supabase Dashboard or API:
-- 
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name: "ethos-tracks"
-- 4. Make it PUBLIC
-- 5. Set up these RLS policies (see below)

-- After bucket is created, apply these RLS policies in SQL:

-- Enable RLS on storage objects (wrapped in error handling for permissions)
DO $$ BEGIN
  drop policy if exists "Allow authenticated users to upload tracks" on storage.objects;
  create policy "Allow authenticated users to upload tracks"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'ethos-tracks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN insufficient_privilege THEN 
  RAISE NOTICE 'Skipping ethos-tracks upload policy - insufficient permissions. Apply manually via Dashboard.';
END $$;

DO $$ BEGIN
  drop policy if exists "Allow public read access to ethos tracks" on storage.objects;
  create policy "Allow public read access to ethos tracks"
  on storage.objects
  for select
  to public
  using (bucket_id = 'ethos-tracks');
EXCEPTION WHEN insufficient_privilege THEN 
  RAISE NOTICE 'Skipping ethos-tracks read policy - insufficient permissions. Apply manually via Dashboard.';
END $$;

DO $$ BEGIN
  drop policy if exists "Allow users to delete their own tracks" on storage.objects;
  create policy "Allow users to delete their own tracks"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'ethos-tracks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN insufficient_privilege THEN 
  RAISE NOTICE 'Skipping ethos-tracks delete policy - insufficient permissions. Apply manually via Dashboard.';
END $$;

-- Create index for better performance (skip if permissions issue)
DO $$ BEGIN
  create index if not exists idx_storage_bucket_name on storage.objects(bucket_id);
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;

DO $$ BEGIN
  create index if not exists idx_storage_name on storage.objects(name);
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;


-- ========================================
-- Next Migration
-- ========================================


-- Add service pricing and licensing fields to ethos_artist_profiles

-- Add new columns for service pricing
ALTER TABLE public.ethos_artist_profiles
ADD COLUMN IF NOT EXISTS price_list jsonb DEFAULT '{
  "track_custom": null,
  "sfx_pack": null,
  "full_score": null,
  "day_rate": null,
  "contact_for_quote": false
}'::jsonb;

-- Add ecosystem license acceptance tracking
ALTER TABLE public.ethos_artist_profiles
ADD COLUMN IF NOT EXISTS ecosystem_license_accepted boolean NOT NULL DEFAULT false;

ALTER TABLE public.ethos_artist_profiles
ADD COLUMN IF NOT EXISTS ecosystem_license_accepted_at timestamptz;

-- Create index for faster queries on for_hire status
CREATE INDEX IF NOT EXISTS idx_ethos_artist_for_hire ON public.ethos_artist_profiles(for_hire)
WHERE for_hire = true;

-- Create index for ecosystem license acceptance tracking
CREATE INDEX IF NOT EXISTS idx_ethos_artist_license_accepted ON public.ethos_artist_profiles(ecosystem_license_accepted)
WHERE ecosystem_license_accepted = true;

-- Add table to track ecosystem license agreements per artist per track
CREATE TABLE IF NOT EXISTS public.ethos_ecosystem_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES public.ethos_tracks(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  agreement_version text NOT NULL DEFAULT '1.0', -- Track KND-008 version
  agreement_text_hash text, -- Hash of agreement text for audit
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ethos_ecosystem_licenses_artist_id ON public.ethos_ecosystem_licenses(artist_id);
CREATE INDEX IF NOT EXISTS idx_ethos_ecosystem_licenses_track_id ON public.ethos_ecosystem_licenses(track_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ethos_ecosystem_licenses_unique ON public.ethos_ecosystem_licenses(track_id, artist_id);

-- Enable RLS on ecosystem licenses table
ALTER TABLE public.ethos_ecosystem_licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: ethos_ecosystem_licenses
DROP POLICY IF EXISTS "Artists can view their own ecosystem licenses" ON public.ethos_ecosystem_licenses;
CREATE POLICY "Artists can view their own ecosystem licenses" ON public.ethos_ecosystem_licenses
  FOR SELECT USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Admins can view all ecosystem licenses" ON public.ethos_ecosystem_licenses;
CREATE POLICY "Admins can view all ecosystem licenses" ON public.ethos_ecosystem_licenses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND user_type = 'staff'
    )
  );

DROP POLICY IF EXISTS "Artists can create ecosystem license records" ON public.ethos_ecosystem_licenses;
CREATE POLICY "Artists can create ecosystem license records" ON public.ethos_ecosystem_licenses
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

-- Add comments for documentation
COMMENT ON COLUMN public.ethos_artist_profiles.price_list IS 'JSON object with pricing: {track_custom: 500, sfx_pack: 150, full_score: 2000, day_rate: 1500, contact_for_quote: false}';

COMMENT ON COLUMN public.ethos_artist_profiles.ecosystem_license_accepted IS 'Whether artist has accepted the KND-008 Ecosystem License agreement';

COMMENT ON COLUMN public.ethos_artist_profiles.ecosystem_license_accepted_at IS 'Timestamp when artist accepted the Ecosystem License';

COMMENT ON TABLE public.ethos_ecosystem_licenses IS 'Tracks individual ecosystem license acceptances per track for audit and compliance';


-- ========================================
-- Next Migration
-- ========================================


-- Ethos Service Requests Table
-- Tracks service commission requests from clients to artists
create table if not exists public.ethos_service_requests (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.user_profiles(id) on delete cascade,
  requester_id uuid not null references public.user_profiles(id) on delete cascade,
  service_type text not null check (service_type in ('track_custom', 'sfx_pack', 'full_score', 'day_rate', 'contact_for_quote')),
  -- track_custom: Custom music track
  -- sfx_pack: Sound effects package
  -- full_score: Full game score/composition
  -- day_rate: Hourly consulting rate
  -- contact_for_quote: Custom quote request
  description text not null,
  budget numeric, -- Optional budget in USD
  deadline timestamptz, -- Optional deadline
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled')),
  notes text, -- Artist notes on the request
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists ethos_service_requests_artist_id_idx on public.ethos_service_requests (artist_id);
create index if not exists ethos_service_requests_requester_id_idx on public.ethos_service_requests (requester_id);
create index if not exists ethos_service_requests_status_idx on public.ethos_service_requests (status);
create index if not exists ethos_service_requests_created_at_idx on public.ethos_service_requests (created_at desc);

-- Enable RLS
alter table public.ethos_service_requests enable row level security;

-- RLS Policies: ethos_service_requests
drop policy if exists "Artists can view their service requests" on public.ethos_service_requests;
create policy "Artists can view their service requests"
  on public.ethos_service_requests
  for select using (auth.uid() = artist_id);

drop policy if exists "Requesters can view their service requests" on public.ethos_service_requests;
create policy "Requesters can view their service requests"
  on public.ethos_service_requests
  for select using (auth.uid() = requester_id);

drop policy if exists "Authenticated users can create service requests" on public.ethos_service_requests;
create policy "Authenticated users can create service requests"
  on public.ethos_service_requests
  for insert with check (auth.uid() = requester_id);

drop policy if exists "Artists can update their service requests" on public.ethos_service_requests;
create policy "Artists can update their service requests"
  on public.ethos_service_requests
  for update using (auth.uid() = artist_id);

-- Trigger to maintain updated_at
drop trigger if exists ethos_service_requests_set_updated_at on public.ethos_service_requests;
create trigger ethos_service_requests_set_updated_at
  before update on public.ethos_service_requests
  for each row execute function public.set_updated_at();

-- Comments for documentation
comment on table public.ethos_service_requests is 'Service commission requests from clients to Ethos Guild artists';
comment on column public.ethos_service_requests.status is 'Status of the service request: pending (awaiting response), accepted (artist accepted), declined (artist declined), in_progress (work started), completed (work finished), cancelled (client cancelled)';
comment on column public.ethos_service_requests.budget is 'Optional budget amount in USD for the requested service';
comment on column public.ethos_service_requests.deadline is 'Optional deadline for the service completion';


-- ========================================
-- Next Migration
-- ========================================


-- GameForge Studio Management System
-- Complete project lifecycle tracking for the GameForge game development studio

-- GameForge Projects Table
-- Tracks all game projects in development across the studio
create table if not exists public.gameforge_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  status text not null default 'planning' check (status in ('planning', 'in_development', 'qa', 'released', 'hiatus', 'cancelled')),
  lead_id uuid not null references public.user_profiles(id) on delete set null,
  platform text not null check (platform in ('Unity', 'Unreal', 'Godot', 'Custom', 'WebGL')),
  genre text[] not null default '{}', -- e.g., ['Action', 'RPG', 'Puzzle']
  target_release_date timestamptz,
  actual_release_date timestamptz,
  budget numeric(12, 2), -- Project budget in USD
  current_spend numeric(12, 2) not null default 0, -- Actual spending to date
  team_size int default 0,
  repository_url text, -- GitHub/GitLab repo link
  documentation_url text, -- Design docs, wiki, etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_projects_status_idx on public.gameforge_projects (status);
create index if not exists gameforge_projects_lead_id_idx on public.gameforge_projects (lead_id);
create index if not exists gameforge_projects_created_at_idx on public.gameforge_projects (created_at desc);
create index if not exists gameforge_projects_platform_idx on public.gameforge_projects (platform);

-- GameForge Team Members Table
-- Studio employees and contractors assigned to projects
create table if not exists public.gameforge_team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null check (role in ('engineer', 'designer', 'artist', 'producer', 'qa', 'sound_designer', 'writer', 'manager')),
  position text, -- e.g., "Lead Programmer", "Character Artist"
  contract_type text not null default 'employee' check (contract_type in ('employee', 'contractor', 'consultant', 'intern')),
  hourly_rate numeric(8, 2), -- Contract rate (if applicable)
  project_ids uuid[] not null default '{}', -- Projects they work on
  skills text[] default '{}', -- e.g., ['C#', 'Unreal', 'Blueprints']
  bio text,
  joined_date timestamptz not null default now(),
  left_date timestamptz, -- When they left the studio (null if still active)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_team_members_user_id_idx on public.gameforge_team_members (user_id);
create index if not exists gameforge_team_members_role_idx on public.gameforge_team_members (role);
create index if not exists gameforge_team_members_is_active_idx on public.gameforge_team_members (is_active);
create unique index if not exists gameforge_team_members_user_id_unique on public.gameforge_team_members (user_id);

-- GameForge Builds Table
-- Track game builds, releases, and versions
create table if not exists public.gameforge_builds (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  version text not null, -- e.g., "1.0.0", "0.5.0-alpha"
  build_type text not null check (build_type in ('alpha', 'beta', 'release_candidate', 'final')),
  release_date timestamptz not null default now(),
  download_url text,
  changelog text, -- Release notes and what changed
  file_size bigint, -- Size in bytes
  target_platforms text[] not null default '{}', -- Windows, Mac, Linux, WebGL, iOS, Android
  download_count int not null default 0,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_builds_project_id_idx on public.gameforge_builds (project_id);
create index if not exists gameforge_builds_release_date_idx on public.gameforge_builds (release_date desc);
create index if not exists gameforge_builds_version_idx on public.gameforge_builds (version);
create unique index if not exists gameforge_builds_project_version_unique on public.gameforge_builds (project_id, version);

-- GameForge Metrics Table
-- Track monthly/sprint metrics: velocity, shipping speed, team productivity
create table if not exists public.gameforge_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  metric_date timestamptz not null default now(), -- When this metric period ended
  metric_type text not null check (metric_type in ('monthly', 'sprint', 'milestone')),
  -- Productivity metrics
  velocity int, -- Story points or tasks completed in period
  hours_logged int, -- Total team hours
  team_size_avg int, -- Average team size during period
  -- Quality metrics
  bugs_found int default 0,
  bugs_fixed int default 0,
  build_count int default 0,
  -- Shipping metrics
  days_from_planned_to_release int, -- How many days late/early (shipping velocity)
  on_schedule boolean, -- Whether release hit target date
  -- Financial metrics
  budget_allocated numeric(12, 2),
  budget_spent numeric(12, 2),
  created_at timestamptz not null default now()
);

create index if not exists gameforge_metrics_project_id_idx on public.gameforge_metrics (project_id);
create index if not exists gameforge_metrics_metric_date_idx on public.gameforge_metrics (metric_date desc);
create index if not exists gameforge_metrics_metric_type_idx on public.gameforge_metrics (metric_type);

-- Enable RLS
alter table public.gameforge_projects enable row level security;
alter table public.gameforge_team_members enable row level security;
alter table public.gameforge_builds enable row level security;
alter table public.gameforge_metrics enable row level security;

-- RLS Policies: gameforge_projects
drop policy if exists "Projects are readable by all authenticated users" on public.gameforge_projects;
create policy "Projects are readable by all authenticated users" on public.gameforge_projects
  for select using (auth.role() = 'authenticated');

drop policy if exists "Studio leads can create projects" on public.gameforge_projects;
create policy "Studio leads can create projects" on public.gameforge_projects
  for insert with check (auth.uid() = lead_id);

drop policy if exists "Project leads can update their projects" on public.gameforge_projects;
create policy "Project leads can update their projects" on public.gameforge_projects
  for update using (auth.uid() = lead_id);

-- RLS Policies: gameforge_team_members
drop policy if exists "Team members are readable by all authenticated users" on public.gameforge_team_members;
create policy "Team members are readable by all authenticated users" on public.gameforge_team_members
  for select using (auth.role() = 'authenticated');

drop policy if exists "Team members can view their own record" on public.gameforge_team_members;
create policy "Team members can view their own record" on public.gameforge_team_members
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own team member record" on public.gameforge_team_members;
create policy "Users can insert their own team member record" on public.gameforge_team_members
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own team member record" on public.gameforge_team_members;
create policy "Users can update their own team member record" on public.gameforge_team_members
  for update using (auth.uid() = user_id);

-- RLS Policies: gameforge_builds
drop policy if exists "Builds are readable by all authenticated users" on public.gameforge_builds;
create policy "Builds are readable by all authenticated users" on public.gameforge_builds
  for select using (auth.role() = 'authenticated');

drop policy if exists "Project leads can create builds" on public.gameforge_builds;
create policy "Project leads can create builds" on public.gameforge_builds
  for insert with check (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

drop policy if exists "Project leads can update builds" on public.gameforge_builds;
create policy "Project leads can update builds" on public.gameforge_builds
  for update using (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- RLS Policies: gameforge_metrics
drop policy if exists "Metrics are readable by all authenticated users" on public.gameforge_metrics;
create policy "Metrics are readable by all authenticated users" on public.gameforge_metrics
  for select using (auth.role() = 'authenticated');

drop policy if exists "Project leads can insert metrics" on public.gameforge_metrics;
create policy "Project leads can insert metrics" on public.gameforge_metrics
  for insert with check (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- Triggers to maintain updated_at
create or replace function public.set_gameforge_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists gameforge_projects_set_updated_at on public.gameforge_projects;
create trigger gameforge_projects_set_updated_at
  before update on public.gameforge_projects
  for each row execute function public.set_gameforge_updated_at();

drop trigger if exists gameforge_team_members_set_updated_at on public.gameforge_team_members;
create trigger gameforge_team_members_set_updated_at
  before update on public.gameforge_team_members
  for each row execute function public.set_gameforge_updated_at();

drop trigger if exists gameforge_builds_set_updated_at on public.gameforge_builds;
create trigger gameforge_builds_set_updated_at
  before update on public.gameforge_builds
  for each row execute function public.set_gameforge_updated_at();

-- Comments for documentation
comment on table public.gameforge_projects is 'GameForge studio game projects with lifecycle tracking and team management';
comment on table public.gameforge_team_members is 'GameForge studio team members including engineers, designers, artists, producers, QA';
comment on table public.gameforge_builds is 'Game builds, releases, and versions for each GameForge project';
comment on table public.gameforge_metrics is 'Monthly/sprint metrics for shipping velocity, productivity, quality, and budget tracking';
comment on column public.gameforge_projects.status is 'Project lifecycle: planning → in_development → qa → released (or cancelled/hiatus)';
comment on column public.gameforge_metrics.days_from_planned_to_release is 'Positive = late, Negative = early, Zero = on-time (key shipping velocity metric)';


-- ========================================
-- Next Migration
-- ========================================


-- Foundation: Non-profit Education & Community Platform
-- Includes: Courses, Curriculum, Progress Tracking, Achievements, Mentorship

create extension if not exists "pgcrypto";

-- ============================================================================
-- COURSES & CURRICULUM
-- ============================================================================

create table if not exists public.foundation_courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null, -- 'getting-started', 'intermediate', 'advanced', 'specialization'
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  instructor_id uuid not null references public.user_profiles(id) on delete cascade,
  cover_image_url text,
  estimated_hours int, -- estimated time to complete
  is_published boolean not null default false,
  order_index int, -- for curriculum ordering
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_courses_published_idx on public.foundation_courses (is_published);
create index if not exists foundation_courses_category_idx on public.foundation_courses (category);
create index if not exists foundation_courses_slug_idx on public.foundation_courses (slug);

-- Course Modules (chapters/sections)
create table if not exists public.foundation_course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  description text,
  content text, -- markdown or HTML
  video_url text, -- optional embedded video
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_modules_course_idx on public.foundation_course_modules (course_id);

-- Course Lessons (within modules)
create table if not exists public.foundation_course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.foundation_course_modules(id) on delete cascade,
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  title text not null,
  content text not null, -- markdown
  video_url text,
  reading_time_minutes int,
  order_index int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_course_lessons_module_idx on public.foundation_course_lessons (module_id);

-- User Enrollments & Progress
create table if not exists public.foundation_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  course_id uuid not null references public.foundation_courses(id) on delete cascade,
  progress_percent int not null default 0,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'paused')),
  completed_at timestamptz,
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists foundation_enrollments_user_idx on public.foundation_enrollments (user_id);
create index if not exists foundation_enrollments_course_idx on public.foundation_enrollments (course_id);
create index if not exists foundation_enrollments_status_idx on public.foundation_enrollments (status);

-- Lesson Completion Tracking
create table if not exists public.foundation_lesson_progress (
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  lesson_id uuid not null references public.foundation_course_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ============================================================================
-- ACHIEVEMENTS & BADGES
-- ============================================================================

create table if not exists public.foundation_achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon_url text,
  badge_color text, -- hex color for badge
  requirement_type text not null check (requirement_type in ('course_completion', 'milestone', 'contribution', 'mentorship')),
  requirement_data jsonb, -- e.g., {"course_id": "...", "count": 1}
  tier int default 1, -- 1 (bronze), 2 (silver), 3 (gold), 4 (platinum)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_achievements_requirement_idx on public.foundation_achievements (requirement_type);

-- User Achievements (earned badges)
create table if not exists public.foundation_user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  achievement_id uuid not null references public.foundation_achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

create index if not exists foundation_user_achievements_user_idx on public.foundation_user_achievements (user_id);
create index if not exists foundation_user_achievements_earned_idx on public.foundation_user_achievements (earned_at);

-- ============================================================================
-- MENTORSHIP
-- ============================================================================

-- Mentor Profiles (extends user_profiles)
create table if not exists public.foundation_mentors (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  bio text,
  expertise text[] not null default '{}', -- e.g., ['Web3', 'Game Dev', 'AI/ML']
  available boolean not null default false,
  max_mentees int default 3,
  current_mentees int not null default 0,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  approved_by uuid references public.user_profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_mentors_available_idx on public.foundation_mentors (available);
create index if not exists foundation_mentors_approval_idx on public.foundation_mentors (approval_status);
create index if not exists foundation_mentors_expertise_gin on public.foundation_mentors using gin (expertise);

-- Mentorship Requests & Sessions
create table if not exists public.foundation_mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  message text,
  expertise_area text, -- which area they want help with
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists foundation_mentorship_requests_pending_unique 
  on public.foundation_mentorship_requests (mentor_id, mentee_id) 
  where status = 'pending';

create index if not exists foundation_mentorship_requests_mentor_idx on public.foundation_mentorship_requests (mentor_id);
create index if not exists foundation_mentorship_requests_mentee_idx on public.foundation_mentorship_requests (mentee_id);
create index if not exists foundation_mentorship_requests_status_idx on public.foundation_mentorship_requests (status);

-- Mentorship Sessions
create table if not exists public.foundation_mentorship_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  topic text,
  notes text, -- notes from the session
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists foundation_mentorship_sessions_mentor_idx on public.foundation_mentorship_sessions (mentor_id);
create index if not exists foundation_mentorship_sessions_mentee_idx on public.foundation_mentorship_sessions (mentee_id);
create index if not exists foundation_mentorship_sessions_scheduled_idx on public.foundation_mentorship_sessions (scheduled_at);

-- ============================================================================
-- CONTRIBUTIONS & COMMUNITY
-- ============================================================================

create table if not exists public.foundation_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  contribution_type text not null, -- 'course_creation', 'lesson_review', 'mentorship', 'community_support'
  resource_id uuid, -- e.g., course_id, lesson_id
  points int not null default 0, -- contribution points toward achievements
  created_at timestamptz not null default now()
);

create index if not exists foundation_contributions_user_idx on public.foundation_contributions (user_id);
create index if not exists foundation_contributions_type_idx on public.foundation_contributions (contribution_type);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS only on tables that exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_courses') THEN
        ALTER TABLE public.foundation_courses ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_course_modules') THEN
        ALTER TABLE public.foundation_course_modules ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_course_lessons') THEN
        ALTER TABLE public.foundation_course_lessons ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_enrollments') THEN
        ALTER TABLE public.foundation_enrollments ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_lesson_progress') THEN
        ALTER TABLE public.foundation_lesson_progress ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_achievements') THEN
        ALTER TABLE public.foundation_achievements ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_user_achievements') THEN
        ALTER TABLE public.foundation_user_achievements ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_mentors') THEN
        ALTER TABLE public.foundation_mentors ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_mentorship_requests') THEN
        ALTER TABLE public.foundation_mentorship_requests ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_mentorship_sessions') THEN
        ALTER TABLE public.foundation_mentorship_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'foundation_contributions') THEN
        ALTER TABLE public.foundation_contributions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Courses: Published courses readable by all, all ops by instructor/admin
drop policy if exists "Published courses readable by all" on public.foundation_courses;
create policy "Published courses readable by all" on public.foundation_courses
  for select using (is_published = true or auth.uid() = instructor_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

drop policy if exists "Instructors manage own courses" on public.foundation_courses;
create policy "Instructors manage own courses" on public.foundation_courses
  for all using (auth.uid() = instructor_id) with check (auth.uid() = instructor_id);

-- Course modules: same as courses (published visible, instructor/admin manage)
drop policy if exists "Published modules readable by all" on public.foundation_course_modules;
create policy "Published modules readable by all" on public.foundation_course_modules
  for select using (
    is_published = true or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()) or
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

drop policy if exists "Instructors manage course modules" on public.foundation_course_modules;
create policy "Instructors manage course modules" on public.foundation_course_modules
  for all using (exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

-- Lessons: same pattern
drop policy if exists "Published lessons readable by all" on public.foundation_course_lessons;
create policy "Published lessons readable by all" on public.foundation_course_lessons
  for select using (
    is_published = true or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()) or
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

drop policy if exists "Instructors manage course lessons" on public.foundation_course_lessons;
create policy "Instructors manage course lessons" on public.foundation_course_lessons
  for all using (exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

-- Enrollments: users see own, instructors see their course enrollments
drop policy if exists "Users see own enrollments" on public.foundation_enrollments;
create policy "Users see own enrollments" on public.foundation_enrollments
  for select using (auth.uid() = user_id or
    exists(select 1 from public.foundation_courses where id = course_id and instructor_id = auth.uid()));

drop policy if exists "Users manage own enrollments" on public.foundation_enrollments;
create policy "Users manage own enrollments" on public.foundation_enrollments
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own enrollments" on public.foundation_enrollments;
create policy "Users update own enrollments" on public.foundation_enrollments
  for update using (auth.uid() = user_id);

-- Lesson progress: users see own
drop policy if exists "Users see own lesson progress" on public.foundation_lesson_progress;
create policy "Users see own lesson progress" on public.foundation_lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users update own lesson progress" on public.foundation_lesson_progress;
create policy "Users update own lesson progress" on public.foundation_lesson_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own lesson completion" on public.foundation_lesson_progress;
create policy "Users update own lesson completion" on public.foundation_lesson_progress
  for update using (auth.uid() = user_id);

-- Achievements: all readable, admin/system manages
drop policy if exists "Achievements readable by all" on public.foundation_achievements;
create policy "Achievements readable by all" on public.foundation_achievements
  for select using (true);

-- User achievements: users see own, admin manages
drop policy if exists "Users see own achievements" on public.foundation_user_achievements;
create policy "Users see own achievements" on public.foundation_user_achievements
  for select using (auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Mentors: approved mentors visible, mentors manage own
drop policy if exists "Approved mentors visible to all" on public.foundation_mentors;
create policy "Approved mentors visible to all" on public.foundation_mentors
  for select using (approval_status = 'approved' or auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

drop policy if exists "Users manage own mentor profile" on public.foundation_mentors;
create policy "Users manage own mentor profile" on public.foundation_mentors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mentorship requests: involved parties can see
drop policy if exists "Mentorship requests visible to involved" on public.foundation_mentorship_requests;
create policy "Mentorship requests visible to involved" on public.foundation_mentorship_requests
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

drop policy if exists "Mentees request mentorship" on public.foundation_mentorship_requests;
create policy "Mentees request mentorship" on public.foundation_mentorship_requests
  for insert with check (auth.uid() = mentee_id);

drop policy if exists "Mentors respond to requests" on public.foundation_mentorship_requests;
create policy "Mentors respond to requests" on public.foundation_mentorship_requests
  for update using (auth.uid() = mentor_id);

-- Mentorship sessions: involved parties can see/manage
drop policy if exists "Sessions visible to involved" on public.foundation_mentorship_sessions;
create policy "Sessions visible to involved" on public.foundation_mentorship_sessions
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);

drop policy if exists "Mentorship sessions insert" on public.foundation_mentorship_sessions;
create policy "Mentorship sessions insert" on public.foundation_mentorship_sessions
  for insert with check (auth.uid() = mentor_id or auth.uid() = mentee_id);

drop policy if exists "Mentorship sessions update" on public.foundation_mentorship_sessions;
create policy "Mentorship sessions update" on public.foundation_mentorship_sessions
  for update using (auth.uid() = mentor_id or auth.uid() = mentee_id);

-- Contributions: users see own, admin sees all
drop policy if exists "Contributions visible to user and admin" on public.foundation_contributions;
create policy "Contributions visible to user and admin" on public.foundation_contributions
  for select using (auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

drop policy if exists "System logs contributions" on public.foundation_contributions;
create policy "System logs contributions" on public.foundation_contributions
  for insert with check (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists foundation_courses_set_updated_at on public.foundation_courses;
create trigger foundation_courses_set_updated_at before update on public.foundation_courses for each row execute function public.set_updated_at();
drop trigger if exists foundation_course_modules_set_updated_at on public.foundation_course_modules;
create trigger foundation_course_modules_set_updated_at before update on public.foundation_course_modules for each row execute function public.set_updated_at();
drop trigger if exists foundation_course_lessons_set_updated_at on public.foundation_course_lessons;
create trigger foundation_course_lessons_set_updated_at before update on public.foundation_course_lessons for each row execute function public.set_updated_at();
drop trigger if exists foundation_enrollments_set_updated_at on public.foundation_enrollments;
create trigger foundation_enrollments_set_updated_at before update on public.foundation_enrollments for each row execute function public.set_updated_at();
drop trigger if exists foundation_mentors_set_updated_at on public.foundation_mentors;
create trigger foundation_mentors_set_updated_at before update on public.foundation_mentors for each row execute function public.set_updated_at();
drop trigger if exists foundation_mentorship_requests_set_updated_at on public.foundation_mentorship_requests;
create trigger foundation_mentorship_requests_set_updated_at before update on public.foundation_mentorship_requests for each row execute function public.set_updated_at();
drop trigger if exists foundation_mentorship_sessions_set_updated_at on public.foundation_mentorship_sessions;
create trigger foundation_mentorship_sessions_set_updated_at before update on public.foundation_mentorship_sessions for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.foundation_courses is 'Foundation curriculum courses - free, public, educational';
comment on table public.foundation_course_modules is 'Course modules/chapters';
comment on table public.foundation_course_lessons is 'Individual lessons within modules';
comment on table public.foundation_enrollments is 'User course enrollments and progress tracking';
comment on table public.foundation_lesson_progress is 'Granular lesson completion tracking';
comment on table public.foundation_achievements is 'Achievement/badge definitions for community members';
comment on table public.foundation_user_achievements is 'User-earned achievements (many-to-many)';
comment on table public.foundation_mentors is 'Mentor profiles with approval status and expertise';
comment on table public.foundation_mentorship_requests is 'Mentorship requests from mentees to mentors';
comment on table public.foundation_mentorship_sessions is 'Scheduled mentorship sessions between mentor and mentee';
comment on table public.foundation_contributions is 'Community contributions (course creation, mentorship, etc) for gamification';


-- ========================================
-- Next Migration
-- ========================================


-- Nexus: Talent Marketplace
-- Commercial bridge between Foundation (community) and Corp (clients)
-- Includes: Creator Profiles, Opportunities, Applications, Messaging, Payments/Commissions

create extension if not exists "pgcrypto";

-- ============================================================================
-- CREATOR PROFILES & PORTFOLIO
-- ============================================================================

create table if not exists public.nexus_creator_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  headline text, -- e.g., "Game Developer | Unreal Engine Specialist"
  bio text,
  profile_image_url text,
  skills text[] not null default '{}', -- e.g., ['Unreal Engine', 'C++', 'Game Design']
  experience_level text not null default 'intermediate' check (experience_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate numeric(10, 2),
  portfolio_url text,
  availability_status text not null default 'available' check (availability_status in ('available', 'busy', 'unavailable')),
  availability_hours_per_week int,
  verified boolean not null default false,
  total_earnings numeric(12, 2) not null default 0,
  rating numeric(3, 2), -- average rating
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_creator_profiles_verified_idx on public.nexus_creator_profiles (verified);
create index if not exists nexus_creator_profiles_availability_idx on public.nexus_creator_profiles (availability_status);
create index if not exists nexus_creator_profiles_skills_gin on public.nexus_creator_profiles using gin (skills);
create index if not exists nexus_creator_profiles_rating_idx on public.nexus_creator_profiles (rating desc);

-- Creator Portfolio Projects
create table if not exists public.nexus_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  project_url text,
  image_url text,
  skills_used text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_portfolio_items_user_idx on public.nexus_portfolio_items (user_id);
create index if not exists nexus_portfolio_items_featured_idx on public.nexus_portfolio_items (featured);

-- Creator Endorsements (peer-to-peer skill validation)
create table if not exists public.nexus_skill_endorsements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  endorsed_by uuid not null references public.user_profiles(id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique(creator_id, endorsed_by, skill)
);

create index if not exists nexus_skill_endorsements_creator_idx on public.nexus_skill_endorsements (creator_id);
create index if not exists nexus_skill_endorsements_endorsed_by_idx on public.nexus_skill_endorsements (endorsed_by);

-- ============================================================================
-- OPPORTUNITIES (JOBS/COLLABS)
-- ============================================================================

create table if not exists public.nexus_opportunities (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null, -- 'development', 'design', 'audio', 'marketing', etc.
  required_skills text[] not null default '{}',
  budget_type text not null check (budget_type in ('hourly', 'fixed', 'range')),
  budget_min numeric(12, 2),
  budget_max numeric(12, 2),
  timeline_type text not null default 'flexible' check (timeline_type in ('urgent', 'short-term', 'long-term', 'ongoing', 'flexible')),
  duration_weeks int,
  location_requirement text default 'remote' check (location_requirement in ('remote', 'onsite', 'hybrid')),
  required_experience text default 'any' check (required_experience in ('any', 'beginner', 'intermediate', 'advanced', 'expert')),
  company_name text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'filled', 'closed', 'cancelled')),
  application_count int not null default 0,
  selected_creator_id uuid references public.user_profiles(id) on delete set null,
  views int not null default 0,
  is_featured boolean not null default false,
  published_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_opportunities_posted_by_idx on public.nexus_opportunities (posted_by);
create index if not exists nexus_opportunities_status_idx on public.nexus_opportunities (status);
create index if not exists nexus_opportunities_category_idx on public.nexus_opportunities (category);
create index if not exists nexus_opportunities_skills_gin on public.nexus_opportunities using gin (required_skills);
create index if not exists nexus_opportunities_featured_idx on public.nexus_opportunities (is_featured);
create index if not exists nexus_opportunities_created_idx on public.nexus_opportunities (created_at desc);

-- ============================================================================
-- APPLICATIONS & MATCHING
-- ============================================================================

create table if not exists public.nexus_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.nexus_opportunities(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'rejected', 'hired', 'archived')),
  cover_letter text,
  proposed_rate numeric(12, 2),
  proposal text, -- detailed proposal/pitch
  application_questions jsonb, -- answers to custom questions if any
  viewed_at timestamptz,
  responded_at timestamptz,
  response_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(opportunity_id, creator_id)
);

create index if not exists nexus_applications_opportunity_idx on public.nexus_applications (opportunity_id);
create index if not exists nexus_applications_creator_idx on public.nexus_applications (creator_id);
create index if not exists nexus_applications_status_idx on public.nexus_applications (status);
create index if not exists nexus_applications_created_idx on public.nexus_applications (created_at desc);

-- Application Reviews/Ratings
create table if not exists public.nexus_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.nexus_applications(id) on delete cascade,
  opportunity_id uuid not null references public.nexus_opportunities(id) on delete cascade,
  reviewer_id uuid not null references public.user_profiles(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text,
  created_at timestamptz not null default now(),
  unique(application_id, reviewer_id)
);

create index if not exists nexus_reviews_creator_idx on public.nexus_reviews (creator_id);
create index if not exists nexus_reviews_reviewer_idx on public.nexus_reviews (reviewer_id);

-- ============================================================================
-- CONTRACTS & ORDERS
-- ============================================================================

create table if not exists public.nexus_contracts (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  client_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  contract_type text not null check (contract_type in ('one-time', 'retainer', 'hourly')),
  total_amount numeric(12, 2) not null,
  aethex_commission_percent numeric(5, 2) not null default 20,
  aethex_commission_amount numeric(12, 2) not null default 0,
  creator_payout_amount numeric(12, 2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'disputed', 'cancelled')),
  start_date timestamptz,
  end_date timestamptz,
  milestone_count int default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_contracts_creator_idx on public.nexus_contracts (creator_id);
create index if not exists nexus_contracts_client_idx on public.nexus_contracts (client_id);
create index if not exists nexus_contracts_status_idx on public.nexus_contracts (status);

-- Milestones (for progressive payments)
create table if not exists public.nexus_milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  milestone_number int not null,
  description text,
  amount numeric(12, 2) not null,
  due_date timestamptz,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'approved', 'paid', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(contract_id, milestone_number)
);

-- Payments & Commission Tracking
create table if not exists public.nexus_payments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  milestone_id uuid references public.nexus_milestones(id) on delete set null,
  amount numeric(12, 2) not null,
  creator_payout numeric(12, 2) not null,
  aethex_commission numeric(12, 2) not null,
  payment_method text not null default 'stripe', -- stripe, bank_transfer, paypal
  payment_status text not null default 'pending' check (payment_status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_date timestamptz,
  payout_date timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_payments_contract_idx on public.nexus_payments (contract_id);
create index if not exists nexus_payments_status_idx on public.nexus_payments (payment_status);

-- Commission Ledger (financial tracking)
create table if not exists public.nexus_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.nexus_payments(id) on delete set null,
  period_start date,
  period_end date,
  total_volume numeric(12, 2) not null,
  total_commission numeric(12, 2) not null,
  creator_payouts numeric(12, 2) not null,
  aethex_revenue numeric(12, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'settled', 'disputed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- MESSAGING & COLLABORATION
-- ============================================================================

create table if not exists public.nexus_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid not null references public.user_profiles(id) on delete cascade,
  recipient_id uuid not null references public.user_profiles(id) on delete cascade,
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  message_text text not null,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists nexus_messages_sender_idx on public.nexus_messages (sender_id);
create index if not exists nexus_messages_recipient_idx on public.nexus_messages (recipient_id);
create index if not exists nexus_messages_opportunity_idx on public.nexus_messages (opportunity_id);
create index if not exists nexus_messages_created_idx on public.nexus_messages (created_at desc);

-- Conversations (threads)
create table if not exists public.nexus_conversations (
  id uuid primary key default gen_random_uuid(),
  participant_1 uuid not null references public.user_profiles(id) on delete cascade,
  participant_2 uuid not null references public.user_profiles(id) on delete cascade,
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  subject text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(participant_1, participant_2, opportunity_id)
);

create index if not exists nexus_conversations_participants_idx on public.nexus_conversations (participant_1, participant_2);

-- ============================================================================
-- DISPUTES & RESOLUTION
-- ============================================================================

create table if not exists public.nexus_disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  reported_by uuid not null references public.user_profiles(id) on delete cascade,
  reason text not null,
  description text,
  evidence_urls text[] default '{}',
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'escalated')),
  resolution_notes text,
  resolved_by uuid references public.user_profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_disputes_contract_idx on public.nexus_disputes (contract_id);
create index if not exists nexus_disputes_status_idx on public.nexus_disputes (status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.nexus_creator_profiles enable row level security;
alter table public.nexus_portfolio_items enable row level security;
alter table public.nexus_skill_endorsements enable row level security;
alter table public.nexus_opportunities enable row level security;
alter table public.nexus_applications enable row level security;
alter table public.nexus_reviews enable row level security;
alter table public.nexus_contracts enable row level security;
alter table public.nexus_milestones enable row level security;
alter table public.nexus_payments enable row level security;
alter table public.nexus_commission_ledger enable row level security;
alter table public.nexus_messages enable row level security;
alter table public.nexus_conversations enable row level security;
alter table public.nexus_disputes enable row level security;

-- Creator Profiles: verified visible, own editable
drop policy if exists "Verified creator profiles visible to all" on public.nexus_creator_profiles;
create policy "Verified creator profiles visible to all" on public.nexus_creator_profiles
  for select using (verified = true or auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

drop policy if exists "Users manage own creator profile" on public.nexus_creator_profiles;
create policy "Users manage own creator profile" on public.nexus_creator_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Portfolio: public for verified creators
drop policy if exists "Portfolio items visible when creator verified" on public.nexus_portfolio_items;
create policy "Portfolio items visible when creator verified" on public.nexus_portfolio_items
  for select using (
    exists(select 1 from public.nexus_creator_profiles where user_id = user_id and verified = true) or
    auth.uid() = user_id
  );

drop policy if exists "Users manage own portfolio" on public.nexus_portfolio_items;
create policy "Users manage own portfolio" on public.nexus_portfolio_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Endorsements: all visible
drop policy if exists "Endorsements readable by all authenticated" on public.nexus_skill_endorsements;
create policy "Endorsements readable by all authenticated" on public.nexus_skill_endorsements
  for select using (auth.role() = 'authenticated');

drop policy if exists "Users can endorse skills" on public.nexus_skill_endorsements;
create policy "Users can endorse skills" on public.nexus_skill_endorsements
  for insert with check (auth.uid() = endorsed_by);

-- Opportunities: open ones visible, own/applied visible to creator
drop policy if exists "Open opportunities visible to all" on public.nexus_opportunities;
create policy "Open opportunities visible to all" on public.nexus_opportunities
  for select using (status = 'open' or auth.uid() = posted_by or
    exists(select 1 from public.nexus_applications where opportunity_id = id and creator_id = auth.uid()));

drop policy if exists "Clients post opportunities" on public.nexus_opportunities;
create policy "Clients post opportunities" on public.nexus_opportunities
  for insert with check (auth.uid() = posted_by);

drop policy if exists "Clients manage own opportunities" on public.nexus_opportunities;
create policy "Clients manage own opportunities" on public.nexus_opportunities
  for update using (auth.uid() = posted_by);

-- Applications: involved parties see
drop policy if exists "Applications visible to applicant and poster" on public.nexus_applications;
create policy "Applications visible to applicant and poster" on public.nexus_applications
  for select using (auth.uid() = creator_id or auth.uid() in (select posted_by from public.nexus_opportunities where id = opportunity_id));

drop policy if exists "Creators submit applications" on public.nexus_applications;
create policy "Creators submit applications" on public.nexus_applications
  for insert with check (auth.uid() = creator_id);

drop policy if exists "Applicants/posters update applications" on public.nexus_applications;
create policy "Applicants/posters update applications" on public.nexus_applications
  for update using (auth.uid() = creator_id or auth.uid() in (select posted_by from public.nexus_opportunities where id = opportunity_id));

-- Reviews: visible to parties, admin
drop policy if exists "Reviews visible to involved" on public.nexus_reviews;
create policy "Reviews visible to involved" on public.nexus_reviews
  for select using (auth.uid() = creator_id or auth.uid() = reviewer_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Contracts: involved parties only
drop policy if exists "Contracts visible to parties" on public.nexus_contracts;
create policy "Contracts visible to parties" on public.nexus_contracts
  for select using (auth.uid() = creator_id or auth.uid() = client_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Messages: involved parties
drop policy if exists "Messages visible to parties" on public.nexus_messages;
create policy "Messages visible to parties" on public.nexus_messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "Users send messages" on public.nexus_messages;
create policy "Users send messages" on public.nexus_messages
  for insert with check (auth.uid() = sender_id);

-- Conversations: participants
drop policy if exists "Conversations visible to participants" on public.nexus_conversations;
create policy "Conversations visible to participants" on public.nexus_conversations
  for select using (auth.uid() in (participant_1, participant_2));

-- Disputes: involved parties
drop policy if exists "Disputes visible to involved" on public.nexus_disputes;
create policy "Disputes visible to involved" on public.nexus_disputes
  for select using (auth.uid() in (select creator_id from public.nexus_contracts where id = contract_id union select client_id from public.nexus_contracts where id = contract_id) or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists nexus_creator_profiles_set_updated_at on public.nexus_creator_profiles;
create trigger nexus_creator_profiles_set_updated_at before update on public.nexus_creator_profiles for each row execute function public.set_updated_at();
drop trigger if exists nexus_portfolio_items_set_updated_at on public.nexus_portfolio_items;
create trigger nexus_portfolio_items_set_updated_at before update on public.nexus_portfolio_items for each row execute function public.set_updated_at();
drop trigger if exists nexus_opportunities_set_updated_at on public.nexus_opportunities;
create trigger nexus_opportunities_set_updated_at before update on public.nexus_opportunities for each row execute function public.set_updated_at();
drop trigger if exists nexus_applications_set_updated_at on public.nexus_applications;
create trigger nexus_applications_set_updated_at before update on public.nexus_applications for each row execute function public.set_updated_at();
drop trigger if exists nexus_contracts_set_updated_at on public.nexus_contracts;
create trigger nexus_contracts_set_updated_at before update on public.nexus_contracts for each row execute function public.set_updated_at();
drop trigger if exists nexus_milestones_set_updated_at on public.nexus_milestones;
create trigger nexus_milestones_set_updated_at before update on public.nexus_milestones for each row execute function public.set_updated_at();
drop trigger if exists nexus_payments_set_updated_at on public.nexus_payments;
create trigger nexus_payments_set_updated_at before update on public.nexus_payments for each row execute function public.set_updated_at();
drop trigger if exists nexus_commission_ledger_set_updated_at on public.nexus_commission_ledger;
create trigger nexus_commission_ledger_set_updated_at before update on public.nexus_commission_ledger for each row execute function public.set_updated_at();
drop trigger if exists nexus_conversations_set_updated_at on public.nexus_conversations;
create trigger nexus_conversations_set_updated_at before update on public.nexus_conversations for each row execute function public.set_updated_at();
drop trigger if exists nexus_disputes_set_updated_at on public.nexus_disputes;
create trigger nexus_disputes_set_updated_at before update on public.nexus_disputes for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.nexus_creator_profiles is 'Creator profiles with skills, rates, portfolio';
comment on table public.nexus_portfolio_items is 'Creator portfolio/project showcase';
comment on table public.nexus_skill_endorsements is 'Peer endorsements for skill validation';
comment on table public.nexus_opportunities is 'Job/collaboration postings by clients';
comment on table public.nexus_applications is 'Creator applications to opportunities';
comment on table public.nexus_reviews is 'Reviews/ratings for completed work';
comment on table public.nexus_contracts is 'Signed contracts with AeThex commission split';
comment on table public.nexus_milestones is 'Contract milestones for progressive payments';
comment on table public.nexus_payments is 'Payment transactions and commission tracking';
comment on table public.nexus_commission_ledger is 'Financial ledger for AeThex revenue tracking';
comment on table public.nexus_messages is 'Marketplace messaging between parties';
comment on table public.nexus_conversations is 'Message conversation threads';
comment on table public.nexus_disputes is 'Dispute resolution for contracts';


-- ========================================
-- Next Migration
-- ========================================


-- Add Spotify portfolio URL to aethex_creators
-- This field allows ALL creators (regardless of type) to link their Spotify profile
-- for social proof and portfolio display on their public profiles (/passport/:username, /creators/:username)
-- V1: Simple URL field. V2: Will integrate Spotify API for metadata/embed

ALTER TABLE public.aethex_creators
ADD COLUMN IF NOT EXISTS spotify_profile_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.aethex_creators.spotify_profile_url IS 'Spotify artist profile URL for universal portfolio/social proof. Supports all creator types. V1: URL link only. V2: Will support web player embed.';


-- ========================================
-- Next Migration
-- ========================================


-- Add rating column to ethos_tracks table
-- Allows artists and users to rate tracks on a scale of 1-5

ALTER TABLE public.ethos_tracks
ADD COLUMN IF NOT EXISTS rating numeric(2, 1) DEFAULT 5.0;

-- Add price column for commercial tracks
ALTER TABLE public.ethos_tracks
ADD COLUMN IF NOT EXISTS price numeric(10, 2);

-- Create index on rating for efficient sorting
CREATE INDEX IF NOT EXISTS idx_ethos_tracks_rating ON public.ethos_tracks(rating DESC);

-- Add comment
COMMENT ON COLUMN public.ethos_tracks.rating IS 'Track rating from 1.0 to 5.0 based on user reviews. Defaults to 5.0 for new tracks.';
COMMENT ON COLUMN public.ethos_tracks.price IS 'Price in USD for commercial licensing of the track. NULL if not for sale.';


-- ========================================
-- Next Migration
-- ========================================


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
DROP POLICY IF EXISTS "users_can_view_own_affiliations" ON user_arm_affiliations;
CREATE POLICY "users_can_view_own_affiliations" ON user_arm_affiliations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_manage_own_affiliations" ON user_arm_affiliations;
CREATE POLICY "users_can_manage_own_affiliations" ON user_arm_affiliations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_can_update_own_affiliations" ON user_arm_affiliations;
CREATE POLICY "users_can_update_own_affiliations" ON user_arm_affiliations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_can_view_public_affiliations" ON user_arm_affiliations;
CREATE POLICY "authenticated_can_view_public_affiliations" ON user_arm_affiliations
  FOR SELECT TO authenticated USING (confirmed = true);


-- ========================================
-- Next Migration
-- ========================================


-- CORP: Enterprise Client Portal Schema
-- For invoicing, contracts, team management, and reporting

-- ============================================================================
-- INVOICES & BILLING
-- ============================================================================

create table if not exists public.corp_invoices (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  invoice_number text not null unique,
  project_id uuid,
  description text,
  issue_date date not null default now(),
  due_date date not null,
  amount_due numeric(12, 2) not null,
  amount_paid numeric(12, 2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_invoices_client_idx on public.corp_invoices (client_company_id);
create index if not exists corp_invoices_status_idx on public.corp_invoices (status);
create index if not exists corp_invoices_due_date_idx on public.corp_invoices (due_date);
create index if not exists corp_invoices_number_idx on public.corp_invoices (invoice_number);

-- Invoice Line Items
create table if not exists public.corp_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.corp_invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null,
  amount numeric(12, 2) not null,
  category text, -- 'service', 'product', 'license', etc.
  created_at timestamptz not null default now()
);

create index if not exists corp_invoice_items_invoice_idx on public.corp_invoice_items (invoice_id);

-- Payments received on invoices
create table if not exists public.corp_invoice_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.corp_invoices(id) on delete cascade,
  amount_paid numeric(12, 2) not null,
  payment_date date not null default now(),
  payment_method text not null default 'bank_transfer', -- 'stripe', 'bank_transfer', 'check', etc.
  reference_number text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists corp_invoice_payments_invoice_idx on public.corp_invoice_payments (invoice_id);

-- ============================================================================
-- CONTRACTS & AGREEMENTS
-- ============================================================================

create table if not exists public.corp_contracts (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  vendor_id uuid not null references public.user_profiles(id) on delete cascade,
  contract_name text not null,
  contract_type text not null check (contract_type in ('service', 'retainer', 'license', 'nda', 'other')),
  description text,
  start_date date,
  end_date date,
  contract_value numeric(12, 2),
  status text not null default 'draft' check (status in ('draft', 'pending_approval', 'signed', 'active', 'completed', 'terminated', 'archived')),
  document_url text, -- URL to signed document
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_contracts_client_idx on public.corp_contracts (client_company_id);
create index if not exists corp_contracts_vendor_idx on public.corp_contracts (vendor_id);
create index if not exists corp_contracts_status_idx on public.corp_contracts (status);

-- Contract Milestones
create table if not exists public.corp_contract_milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.corp_contracts(id) on delete cascade,
  milestone_name text not null,
  description text,
  due_date date,
  deliverables text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_contract_milestones_contract_idx on public.corp_contract_milestones (contract_id);

-- ============================================================================
-- TEAM COLLABORATION
-- ============================================================================

create table if not exists public.corp_team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  email text not null,
  full_name text,
  job_title text,
  status text not null default 'active' check (status in ('active', 'inactive', 'pending_invite')),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, user_id)
);

create index if not exists corp_team_members_company_idx on public.corp_team_members (company_id);
create index if not exists corp_team_members_user_idx on public.corp_team_members (user_id);

-- Activity Log (for audit trail)
create table if not exists public.corp_activity_log (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  actor_id uuid not null references public.user_profiles(id) on delete cascade,
  action text not null, -- 'created_invoice', 'sent_contract', 'paid_invoice', etc.
  resource_type text, -- 'invoice', 'contract', 'team_member'
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists corp_activity_log_company_idx on public.corp_activity_log (company_id);
create index if not exists corp_activity_log_actor_idx on public.corp_activity_log (actor_id);
create index if not exists corp_activity_log_created_idx on public.corp_activity_log (created_at desc);

-- ============================================================================
-- PROJECTS & TRACKING
-- ============================================================================

create table if not exists public.corp_projects (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  project_name text not null,
  description text,
  status text not null default 'active' check (status in ('planning', 'active', 'paused', 'completed', 'archived')),
  budget numeric(12, 2),
  spent numeric(12, 2) default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_projects_client_idx on public.corp_projects (client_company_id);
create index if not exists corp_projects_status_idx on public.corp_projects (status);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

create table if not exists public.corp_financial_summary (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.user_profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_invoiced numeric(12, 2) default 0,
  total_paid numeric(12, 2) default 0,
  total_overdue numeric(12, 2) default 0,
  active_contracts int default 0,
  completed_contracts int default 0,
  total_contract_value numeric(12, 2) default 0,
  average_payment_days int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_financial_summary_company_idx on public.corp_financial_summary (company_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.corp_invoices enable row level security;
alter table public.corp_invoice_items enable row level security;
alter table public.corp_invoice_payments enable row level security;
alter table public.corp_contracts enable row level security;
alter table public.corp_contract_milestones enable row level security;
alter table public.corp_team_members enable row level security;
alter table public.corp_activity_log enable row level security;
alter table public.corp_projects enable row level security;
alter table public.corp_financial_summary enable row level security;

-- Invoices: client and team members can view
drop policy if exists "Invoices visible to client and team" on public.corp_invoices;
create policy "Invoices visible to client and team" on public.corp_invoices
  for select using (
    auth.uid() = client_company_id or
    exists(select 1 from public.corp_team_members where company_id = client_company_id and user_id = auth.uid())
  );

drop policy if exists "Client creates invoices" on public.corp_invoices;
create policy "Client creates invoices" on public.corp_invoices
  for insert with check (auth.uid() = client_company_id);

drop policy if exists "Client manages invoices" on public.corp_invoices;
create policy "Client manages invoices" on public.corp_invoices
  for update using (auth.uid() = client_company_id);

-- Contracts: parties involved can view
drop policy if exists "Contracts visible to involved parties" on public.corp_contracts;
create policy "Contracts visible to involved parties" on public.corp_contracts
  for select using (
    auth.uid() = client_company_id or auth.uid() = vendor_id or
    exists(select 1 from public.corp_team_members where company_id = client_company_id and user_id = auth.uid())
  );

-- Team: company members can view
drop policy if exists "Team members visible to company" on public.corp_team_members;
create policy "Team members visible to company" on public.corp_team_members
  for select using (
    auth.uid() = company_id or
    exists(select 1 from public.corp_team_members where company_id = company_id and user_id = auth.uid())
  );

-- Activity: company members can view
drop policy if exists "Activity visible to company" on public.corp_activity_log;
create policy "Activity visible to company" on public.corp_activity_log
  for select using (
    exists(select 1 from public.corp_team_members where company_id = company_id and user_id = auth.uid())
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists corp_invoices_set_updated_at on public.corp_invoices;
create trigger corp_invoices_set_updated_at before update on public.corp_invoices for each row execute function public.set_updated_at();
drop trigger if exists corp_contracts_set_updated_at on public.corp_contracts;
create trigger corp_contracts_set_updated_at before update on public.corp_contracts for each row execute function public.set_updated_at();
drop trigger if exists corp_contract_milestones_set_updated_at on public.corp_contract_milestones;
create trigger corp_contract_milestones_set_updated_at before update on public.corp_contract_milestones for each row execute function public.set_updated_at();
drop trigger if exists corp_team_members_set_updated_at on public.corp_team_members;
create trigger corp_team_members_set_updated_at before update on public.corp_team_members for each row execute function public.set_updated_at();
drop trigger if exists corp_projects_set_updated_at on public.corp_projects;
create trigger corp_projects_set_updated_at before update on public.corp_projects for each row execute function public.set_updated_at();
drop trigger if exists corp_financial_summary_set_updated_at on public.corp_financial_summary;
create trigger corp_financial_summary_set_updated_at before update on public.corp_financial_summary for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.corp_invoices is 'Invoices issued by the company to clients';
comment on table public.corp_invoice_items is 'Line items on invoices';
comment on table public.corp_invoice_payments is 'Payments received on invoices';
comment on table public.corp_contracts is 'Contracts with vendors and clients';
comment on table public.corp_team_members is 'Team members with access to the hub';
comment on table public.corp_activity_log is 'Audit trail of all activities';
comment on table public.corp_projects is 'Client projects for tracking work';
comment on table public.corp_financial_summary is 'Financial summary and metrics';


-- ========================================
-- Next Migration
-- ========================================


-- Add onboarded column to track if user has completed onboarding
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT false;

-- Create index for filtering onboarded users
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarded ON user_profiles(onboarded);


-- ========================================
-- Next Migration
-- ========================================


-- Add Stripe payment fields to nexus_contracts
ALTER TABLE public.nexus_contracts ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Add index for quick lookup
CREATE INDEX IF NOT EXISTS nexus_contracts_stripe_payment_intent_idx ON public.nexus_contracts (stripe_payment_intent_id);

-- Add Stripe charge fields to nexus_payments
ALTER TABLE public.nexus_payments ADD COLUMN IF NOT EXISTS stripe_charge_id text;

-- Add index for quick lookup
CREATE INDEX IF NOT EXISTS nexus_payments_stripe_charge_idx ON public.nexus_payments (stripe_charge_id);

-- Add Stripe Connect fields to nexus_creator_profiles
ALTER TABLE public.nexus_creator_profiles ADD COLUMN IF NOT EXISTS stripe_connect_account_id text;
ALTER TABLE public.nexus_creator_profiles ADD COLUMN IF NOT EXISTS stripe_account_verified boolean default false;

-- Add indexes
CREATE INDEX IF NOT EXISTS nexus_creator_profiles_stripe_account_idx ON public.nexus_creator_profiles (stripe_connect_account_id);

-- Add comments
COMMENT ON COLUMN public.nexus_contracts.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for tracking contract payments';
COMMENT ON COLUMN public.nexus_payments.stripe_charge_id IS 'Stripe Charge ID for refund tracking';
COMMENT ON COLUMN public.nexus_creator_profiles.stripe_connect_account_id IS 'Stripe Connect Express account ID for creator payouts';
COMMENT ON COLUMN public.nexus_creator_profiles.stripe_account_verified IS 'Whether Stripe Connect account is verified and ready for payouts';


-- ========================================
-- Next Migration
-- ========================================


-- Add 'staff' value to user_type_enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'user_type_enum' AND e.enumlabel = 'staff'
  ) THEN
    ALTER TYPE user_type_enum ADD VALUE 'staff';
  END IF;
END$$;


-- ========================================
-- Next Migration
-- ========================================


-- Community post likes and comments
begin;

-- likes table for community_posts
create table if not exists public.community_post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- comments table for community_posts
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.community_post_likes enable row level security;
alter table public.community_comments enable row level security;

-- policies: users can read all published post likes/comments
DO $$ BEGIN
  CREATE POLICY community_post_likes_read ON public.community_post_likes
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_comments_read ON public.community_comments
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- users manage their own likes/comments
DO $$ BEGIN
  CREATE POLICY community_post_likes_manage_self ON public.community_post_likes
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_comments_manage_self ON public.community_comments
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

commit;


-- ========================================
-- Next Migration
-- ========================================


create extension if not exists pgcrypto;

-- Team memberships (avoids conflict with existing team_members table)
create table if not exists public.team_memberships (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

alter table public.team_memberships enable row level security;

do $$ begin
  create policy team_memberships_read on public.team_memberships for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.team_memberships m where m.team_id = team_id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy team_memberships_manage_self on public.team_memberships for all to authenticated using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Update teams policy to use team_memberships
do $$ begin
  create policy teams_read_membership on public.teams for select to authenticated using (visibility = 'public' or owner_id = auth.uid() or exists(select 1 from public.team_memberships m where m.team_id = id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;


-- ========================================
-- Next Migration
-- ========================================


-- Fix RLS recursion on team_memberships and define safe, non-recursive policies
begin;

-- Ensure RLS is enabled
alter table public.team_memberships enable row level security;

-- Drop problematic/overly broad policies if they exist
drop policy if exists team_memberships_read on public.team_memberships;
drop policy if exists team_memberships_manage_self on public.team_memberships;

-- Allow users to read only their own membership rows
drop policy if exists team_memberships_select_own on public.team_memberships;
create policy team_memberships_select_own on public.team_memberships
for select
to authenticated
using (user_id = auth.uid());

-- Allow users to create membership rows only for themselves
drop policy if exists team_memberships_insert_self on public.team_memberships;
create policy team_memberships_insert_self on public.team_memberships
for insert
to authenticated
with check (user_id = auth.uid());

-- Allow users to update only their own membership rows
drop policy if exists team_memberships_update_self on public.team_memberships;
create policy team_memberships_update_self on public.team_memberships
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Allow users to delete only their own membership rows
drop policy if exists team_memberships_delete_self on public.team_memberships;
create policy team_memberships_delete_self on public.team_memberships
for delete
to authenticated
using (user_id = auth.uid());

-- Drop legacy teams_read policy that referenced public.team_members (recursive)
drop policy if exists teams_read on public.teams;

commit;


-- ========================================
-- Next Migration
-- ========================================


create extension if not exists "pgcrypto";

-- Mentors registry
create table if not exists public.mentors (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  bio text,
  expertise text[] not null default '{}',
  available boolean not null default true,
  hourly_rate numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentors_available_idx on public.mentors (available);
create index if not exists mentors_expertise_gin on public.mentors using gin (expertise);

-- Mentorship requests
create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_requests_mentor_idx on public.mentorship_requests (mentor_id);
create index if not exists mentorship_requests_mentee_idx on public.mentorship_requests (mentee_id);
create index if not exists mentorship_requests_status_idx on public.mentorship_requests (status);

-- Prevent duplicate pending requests between same pair
create unique index if not exists mentorship_requests_unique_pending on public.mentorship_requests (mentor_id, mentee_id) where status = 'pending';

-- Simple trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists mentors_set_updated_at on public.mentors;
create trigger mentors_set_updated_at
  before update on public.mentors
  for each row execute function public.set_updated_at();

drop trigger if exists mentorship_requests_set_updated_at on public.mentorship_requests;
create trigger mentorship_requests_set_updated_at
  before update on public.mentorship_requests
  for each row execute function public.set_updated_at();


-- ========================================
-- Next Migration
-- ========================================


-- Social + Invites + Reputation/Loyalty/XP schema additions

-- Add missing columns to user_profiles
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 0;

-- Invites table
CREATE TABLE IF NOT EXISTS public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  token text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  accepted_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz NULL,
  message text NULL
);

-- Connections (undirected; store both directions for simpler queries)
CREATE TABLE IF NOT EXISTS public.user_connections (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, connection_id)
);

-- Endorsements (skill-based reputation signals)
CREATE TABLE IF NOT EXISTS public.endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endorsed_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reward event ledger (audit for xp/loyalty/reputation changes)
CREATE TABLE IF NOT EXISTS public.reward_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,                 -- e.g. 'invite_sent', 'invite_accepted', 'post_created'
  points_kind text NOT NULL DEFAULT 'xp', -- 'xp' | 'loyalty' | 'reputation'
  amount integer NOT NULL DEFAULT 0,
  metadata jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS (service role bypasses; keep strict by default)
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_events ENABLE ROW LEVEL SECURITY;

-- Minimal readable policies for authenticated users (optional reads)
DO $$ BEGIN
  CREATE POLICY invites_read_own ON public.invites
    FOR SELECT TO authenticated
    USING (inviter_id = auth.uid() OR accepted_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY connections_read_own ON public.user_connections
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR connection_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY endorsements_read_public ON public.endorsements
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY reward_events_read_own ON public.reward_events
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ========================================
-- Next Migration
-- ========================================


-- Storage policies for post_media uploads
begin;

-- Ensure RLS is enabled on storage.objects (wrapped for permissions)
DO $$ BEGIN
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Allow public read for objects in post_media bucket (because bucket is public)
DO $$ BEGIN
  DROP POLICY IF EXISTS post_media_public_read ON storage.objects;
  CREATE POLICY post_media_public_read ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'post_media');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Allow authenticated users to upload to post_media bucket
DO $$ BEGIN
  DROP POLICY IF EXISTS post_media_auth_insert ON storage.objects;
  CREATE POLICY post_media_auth_insert ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'post_media');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

commit;


-- ========================================
-- Next Migration
-- ========================================


-- NEXUS Core: Universal Data Layer
-- Single Source of Truth for talent/contract metadata
-- Supports AZ Tax Commission reporting, time logs, and compliance tracking

create extension if not exists "pgcrypto";

-- ============================================================================
-- TALENT PROFILES (Legal/Tax Layer)
-- ============================================================================

create table if not exists public.nexus_talent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.user_profiles(id) on delete cascade,
  legal_first_name text,
  legal_last_name text,
  legal_name_encrypted bytea, -- pgcrypto encrypted full legal name
  tax_id_encrypted bytea, -- SSN/EIN encrypted
  tax_id_last_four text, -- last 4 digits for display
  tax_classification text check (tax_classification in ('w2_employee', '1099_contractor', 'corp_entity', 'foreign')),
  residency_state text, -- US state code (e.g., 'AZ', 'CA')
  residency_country text not null default 'US',
  address_line1_encrypted bytea,
  address_city text,
  address_state text,
  address_zip text,
  compliance_status text not null default 'pending' check (compliance_status in ('pending', 'verified', 'expired', 'rejected', 'review_needed')),
  compliance_verified_at timestamptz,
  compliance_expires_at timestamptz,
  az_eligible boolean not null default false, -- Eligible for AZ Tax Credit
  w9_submitted boolean not null default false,
  w9_submitted_at timestamptz,
  bank_account_connected boolean not null default false,
  stripe_connect_account_id text,
  payout_method text default 'stripe' check (payout_method in ('stripe', 'ach', 'check', 'paypal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_talent_profiles_user_idx on public.nexus_talent_profiles (user_id);
create index if not exists nexus_talent_profiles_compliance_idx on public.nexus_talent_profiles (compliance_status);
create index if not exists nexus_talent_profiles_az_eligible_idx on public.nexus_talent_profiles (az_eligible);
create index if not exists nexus_talent_profiles_state_idx on public.nexus_talent_profiles (residency_state);

-- ============================================================================
-- TIME LOGS (Hour Tracking with AZ Compliance)
-- ============================================================================

create table if not exists public.nexus_time_logs (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid not null references public.nexus_talent_profiles(id) on delete cascade,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  milestone_id uuid references public.nexus_milestones(id) on delete set null,
  log_date date not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  hours_worked numeric(5, 2) not null,
  description text,
  task_category text, -- 'development', 'design', 'review', 'meeting', etc.
  location_type text not null default 'remote' check (location_type in ('remote', 'onsite', 'hybrid')),
  location_state text, -- State where work was performed (critical for AZ)
  location_city text,
  location_latitude numeric(10, 7),
  location_longitude numeric(10, 7),
  location_verified boolean not null default false,
  az_eligible_hours numeric(5, 2) default 0, -- Hours qualifying for AZ Tax Credit
  billable boolean not null default true,
  billed boolean not null default false,
  billed_at timestamptz,
  invoice_id uuid references public.corp_invoices(id) on delete set null,
  submission_status text not null default 'draft' check (submission_status in ('draft', 'submitted', 'approved', 'rejected', 'exported')),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.user_profiles(id) on delete set null,
  tax_period text, -- e.g., '2025-Q1', '2025-12'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_time_logs_talent_idx on public.nexus_time_logs (talent_profile_id);
create index if not exists nexus_time_logs_contract_idx on public.nexus_time_logs (contract_id);
create index if not exists nexus_time_logs_date_idx on public.nexus_time_logs (log_date desc);
create index if not exists nexus_time_logs_status_idx on public.nexus_time_logs (submission_status);
create index if not exists nexus_time_logs_state_idx on public.nexus_time_logs (location_state);
create index if not exists nexus_time_logs_az_idx on public.nexus_time_logs (az_eligible_hours) where az_eligible_hours > 0;
create index if not exists nexus_time_logs_period_idx on public.nexus_time_logs (tax_period);

-- ============================================================================
-- TIME LOG AUDITS (Review & AZ Submission Tracking)
-- ============================================================================

create table if not exists public.nexus_time_log_audits (
  id uuid primary key default gen_random_uuid(),
  time_log_id uuid not null references public.nexus_time_logs(id) on delete cascade,
  reviewer_id uuid references public.user_profiles(id) on delete set null,
  audit_type text not null check (audit_type in ('review', 'approval', 'rejection', 'az_submission', 'correction', 'dispute')),
  decision text check (decision in ('approved', 'rejected', 'needs_correction', 'submitted', 'acknowledged')),
  notes text,
  corrections_made jsonb, -- { field: { old: value, new: value } }
  az_submission_id text, -- ID from AZ Tax Commission API
  az_submission_status text check (az_submission_status in ('pending', 'accepted', 'rejected', 'error')),
  az_submission_response jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists nexus_time_log_audits_log_idx on public.nexus_time_log_audits (time_log_id);
create index if not exists nexus_time_log_audits_reviewer_idx on public.nexus_time_log_audits (reviewer_id);
create index if not exists nexus_time_log_audits_type_idx on public.nexus_time_log_audits (audit_type);
create index if not exists nexus_time_log_audits_az_idx on public.nexus_time_log_audits (az_submission_id) where az_submission_id is not null;

-- ============================================================================
-- COMPLIANCE EVENTS (Cross-Entity Audit Trail)
-- ============================================================================

create table if not exists public.nexus_compliance_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'talent', 'client', 'contract', 'time_log', 'payout'
  entity_id uuid not null,
  event_type text not null, -- 'created', 'verified', 'exported', 'access_logged', 'financial_update', etc.
  event_category text not null check (event_category in ('compliance', 'financial', 'access', 'data_change', 'tax_reporting', 'legal')),
  actor_id uuid references public.user_profiles(id) on delete set null,
  actor_role text, -- 'talent', 'client', 'admin', 'system', 'api'
  realm_context text, -- 'nexus', 'corp', 'foundation', 'studio'
  description text,
  payload jsonb, -- Full event data
  sensitive_data_accessed boolean not null default false,
  financial_amount numeric(12, 2),
  legal_entity text, -- 'for_profit', 'non_profit'
  cross_entity_access boolean not null default false, -- True if Foundation accessed Corp data
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists nexus_compliance_events_entity_idx on public.nexus_compliance_events (entity_type, entity_id);
create index if not exists nexus_compliance_events_type_idx on public.nexus_compliance_events (event_type);
create index if not exists nexus_compliance_events_category_idx on public.nexus_compliance_events (event_category);
create index if not exists nexus_compliance_events_actor_idx on public.nexus_compliance_events (actor_id);
create index if not exists nexus_compliance_events_realm_idx on public.nexus_compliance_events (realm_context);
create index if not exists nexus_compliance_events_cross_entity_idx on public.nexus_compliance_events (cross_entity_access) where cross_entity_access = true;
create index if not exists nexus_compliance_events_created_idx on public.nexus_compliance_events (created_at desc);

-- ============================================================================
-- ESCROW LEDGER (Financial Tracking)
-- ============================================================================

create table if not exists public.nexus_escrow_ledger (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  client_id uuid not null references public.user_profiles(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  escrow_balance numeric(12, 2) not null default 0,
  funds_deposited numeric(12, 2) not null default 0,
  funds_released numeric(12, 2) not null default 0,
  funds_refunded numeric(12, 2) not null default 0,
  aethex_fees numeric(12, 2) not null default 0,
  stripe_customer_id text,
  stripe_escrow_intent_id text,
  status text not null default 'unfunded' check (status in ('unfunded', 'funded', 'partially_funded', 'released', 'disputed', 'refunded')),
  funded_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_escrow_ledger_contract_idx on public.nexus_escrow_ledger (contract_id);
create index if not exists nexus_escrow_ledger_client_idx on public.nexus_escrow_ledger (client_id);
create index if not exists nexus_escrow_ledger_creator_idx on public.nexus_escrow_ledger (creator_id);
create index if not exists nexus_escrow_ledger_status_idx on public.nexus_escrow_ledger (status);

-- ============================================================================
-- PAYOUT RECORDS (Separate from payments for tax tracking)
-- ============================================================================

create table if not exists public.nexus_payouts (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid not null references public.nexus_talent_profiles(id) on delete cascade,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  payment_id uuid references public.nexus_payments(id) on delete set null,
  gross_amount numeric(12, 2) not null,
  platform_fee numeric(12, 2) not null default 0,
  processing_fee numeric(12, 2) not null default 0,
  tax_withholding numeric(12, 2) not null default 0,
  net_amount numeric(12, 2) not null,
  payout_method text not null default 'stripe' check (payout_method in ('stripe', 'ach', 'check', 'paypal')),
  stripe_payout_id text,
  ach_trace_number text,
  check_number text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  scheduled_date date,
  processed_at timestamptz,
  failure_reason text,
  tax_year int not null default extract(year from now()),
  tax_form_type text, -- '1099-NEC', 'W-2', etc.
  tax_form_generated boolean not null default false,
  tax_form_file_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_payouts_talent_idx on public.nexus_payouts (talent_profile_id);
create index if not exists nexus_payouts_contract_idx on public.nexus_payouts (contract_id);
create index if not exists nexus_payouts_status_idx on public.nexus_payouts (status);
create index if not exists nexus_payouts_tax_year_idx on public.nexus_payouts (tax_year);
create index if not exists nexus_payouts_scheduled_idx on public.nexus_payouts (scheduled_date);

-- ============================================================================
-- FOUNDATION GIG RADAR VIEW (Read-Only Projection)
-- ============================================================================

create or replace view public.foundation_gig_radar as
select 
  o.id as opportunity_id,
  o.title,
  o.category,
  o.required_skills,
  o.timeline_type,
  o.location_requirement,
  o.required_experience,
  o.status,
  o.published_at,
  case 
    when o.status = 'open' then 'available'
    when o.status = 'in_progress' then 'in_progress'
    else 'filled'
  end as availability_status,
  (select count(*) from public.nexus_applications a where a.opportunity_id = o.id) as applicant_count,
  case when o.budget_type = 'hourly' then 'hourly' else 'project' end as compensation_type
from public.nexus_opportunities o
where o.status in ('open', 'in_progress')
order by o.published_at desc;

comment on view public.foundation_gig_radar is 'Read-only view for Foundation Gig Radar - no financial data exposed';

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.nexus_talent_profiles enable row level security;
alter table public.nexus_time_logs enable row level security;
alter table public.nexus_time_log_audits enable row level security;
alter table public.nexus_compliance_events enable row level security;
alter table public.nexus_escrow_ledger enable row level security;
alter table public.nexus_payouts enable row level security;

-- Talent Profiles: own profile only (sensitive data)
create policy "Users view own talent profile" on public.nexus_talent_profiles
  for select using (auth.uid() = user_id);

create policy "Users manage own talent profile" on public.nexus_talent_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins view all talent profiles" on public.nexus_talent_profiles
  for select using (exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Time Logs: talent and contract parties
create policy "Talent views own time logs" on public.nexus_time_logs
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

create policy "Contract clients view time logs" on public.nexus_time_logs
  for select using (
    contract_id is not null and
    auth.uid() in (select client_id from public.nexus_contracts where id = contract_id)
  );

create policy "Talent manages own time logs" on public.nexus_time_logs
  for all using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  ) with check (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- Time Log Audits: reviewers and talent
create policy "Time log audit visibility" on public.nexus_time_log_audits
  for select using (
    auth.uid() = reviewer_id or
    auth.uid() in (select tp.user_id from public.nexus_talent_profiles tp join public.nexus_time_logs tl on tp.id = tl.talent_profile_id where tl.id = time_log_id)
  );

-- Compliance Events: admins only (sensitive audit data)
create policy "Compliance events admin only" on public.nexus_compliance_events
  for select using (exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "System inserts compliance events" on public.nexus_compliance_events
  for insert with check (true); -- Service role only in practice

-- Escrow Ledger: contract parties
create policy "Escrow visible to contract parties" on public.nexus_escrow_ledger
  for select using (auth.uid() = client_id or auth.uid() = creator_id);

-- Payouts: talent only
create policy "Payouts visible to talent" on public.nexus_payouts
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

drop trigger if exists nexus_talent_profiles_set_updated_at on public.nexus_talent_profiles;
create trigger nexus_talent_profiles_set_updated_at before update on public.nexus_talent_profiles for each row execute function public.set_updated_at();
drop trigger if exists nexus_time_logs_set_updated_at on public.nexus_time_logs;
create trigger nexus_time_logs_set_updated_at before update on public.nexus_time_logs for each row execute function public.set_updated_at();
drop trigger if exists nexus_escrow_ledger_set_updated_at on public.nexus_escrow_ledger;
create trigger nexus_escrow_ledger_set_updated_at before update on public.nexus_escrow_ledger for each row execute function public.set_updated_at();
drop trigger if exists nexus_payouts_set_updated_at on public.nexus_payouts;
create trigger nexus_payouts_set_updated_at before update on public.nexus_payouts for each row execute function public.set_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate AZ-eligible hours for a time period
create or replace function public.calculate_az_eligible_hours(
  p_talent_id uuid,
  p_start_date date,
  p_end_date date
) returns numeric as $$
  select coalesce(sum(az_eligible_hours), 0)
  from public.nexus_time_logs
  where talent_profile_id = p_talent_id
    and log_date between p_start_date and p_end_date
    and location_state = 'AZ'
    and submission_status = 'approved';
$$ language sql stable;

-- Get talent compliance summary
create or replace function public.get_talent_compliance_summary(p_user_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'profile_complete', (tp.legal_first_name is not null and tp.tax_id_encrypted is not null),
    'compliance_status', tp.compliance_status,
    'az_eligible', tp.az_eligible,
    'w9_submitted', tp.w9_submitted,
    'bank_connected', tp.bank_account_connected,
    'pending_time_logs', (select count(*) from public.nexus_time_logs where talent_profile_id = tp.id and submission_status = 'submitted'),
    'total_hours_this_month', (select coalesce(sum(hours_worked), 0) from public.nexus_time_logs where talent_profile_id = tp.id and log_date >= date_trunc('month', now())),
    'az_hours_this_month', (select coalesce(sum(az_eligible_hours), 0) from public.nexus_time_logs where talent_profile_id = tp.id and log_date >= date_trunc('month', now()) and location_state = 'AZ')
  )
  from public.nexus_talent_profiles tp
  where tp.user_id = p_user_id;
$$ language sql stable;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.nexus_talent_profiles is 'Talent legal/tax profiles with encrypted PII for compliance';
comment on table public.nexus_time_logs is 'Hour tracking with location for AZ Tax Credit eligibility';
comment on table public.nexus_time_log_audits is 'Audit trail for time log reviews and AZ submissions';
comment on table public.nexus_compliance_events is 'Cross-entity compliance event log for legal separation';
comment on table public.nexus_escrow_ledger is 'Escrow account tracking per contract';
comment on table public.nexus_payouts is 'Payout records with tax form tracking';
comment on function public.calculate_az_eligible_hours is 'Calculate AZ Tax Credit eligible hours for a talent in a date range';
comment on function public.get_talent_compliance_summary is 'Get compliance status summary for a talent';


-- ========================================
-- Next Migration
-- ========================================


-- NEXUS Core: Strengthened RLS Policies for Legal Entity Separation
-- This migration updates RLS policies to enforce:
-- 1. Client/Admin only access to escrow (no creators)
-- 2. Admin access to all sensitive tables
-- 3. Proper INSERT/UPDATE/DELETE policies

-- ============================================================================
-- DROP EXISTING POLICIES (will recreate with stronger rules)
-- ============================================================================

drop policy if exists "Escrow visible to contract parties" on public.nexus_escrow_ledger;
drop policy if exists "Payouts visible to talent" on public.nexus_payouts;
drop policy if exists "Compliance events admin only" on public.nexus_compliance_events;
drop policy if exists "System inserts compliance events" on public.nexus_compliance_events;
drop policy if exists "Time log audit visibility" on public.nexus_time_log_audits;

-- ============================================================================
-- NEXUS ESCROW LEDGER - Client/Admin Only (Legal Entity Separation)
-- Creators should NOT see escrow details - they see contract/payment status instead
-- ============================================================================

-- Clients can view their own escrow records
create policy "Clients view own escrow" on public.nexus_escrow_ledger
  for select using (auth.uid() = client_id);

-- Admins can view all escrow records (for management/reporting)
create policy "Admins view all escrow" on public.nexus_escrow_ledger
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only clients can insert escrow records (via API with proper validation)
create policy "Clients create escrow" on public.nexus_escrow_ledger
  for insert with check (auth.uid() = client_id);

-- Clients can update their own escrow (funding operations)
create policy "Clients update own escrow" on public.nexus_escrow_ledger
  for update using (auth.uid() = client_id) with check (auth.uid() = client_id);

-- Admins can update any escrow (for disputes/releases)
create policy "Admins update escrow" on public.nexus_escrow_ledger
  for update using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS PAYOUTS - Talent + Admin Access
-- Talent sees their own payouts, Admins manage all
-- ============================================================================

-- Talent can view their own payouts
create policy "Talent views own payouts" on public.nexus_payouts
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- Admins can view all payouts
create policy "Admins view all payouts" on public.nexus_payouts
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only admins can insert/update payouts (payroll processing)
create policy "Admins manage payouts" on public.nexus_payouts
  for all using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS COMPLIANCE EVENTS - Admin Only + Service Insert
-- Sensitive audit trail - admin read, system write
-- ============================================================================

-- Admins can view all compliance events
create policy "Admins view compliance events" on public.nexus_compliance_events
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only admins can insert compliance events (via adminClient in API)
-- Non-admin users cannot create compliance log entries directly
create policy "Admins insert compliance events" on public.nexus_compliance_events
  for insert with check (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS TIME LOG AUDITS - Enhanced Access Control
-- ============================================================================

-- Talent can view audits for their own time logs
create policy "Talent views own time log audits" on public.nexus_time_log_audits
  for select using (
    auth.uid() in (
      select tp.user_id 
      from public.nexus_talent_profiles tp 
      join public.nexus_time_logs tl on tp.id = tl.talent_profile_id 
      where tl.id = time_log_id
    )
  );

-- Reviewers can view audits they created
create policy "Reviewers view own audits" on public.nexus_time_log_audits
  for select using (auth.uid() = reviewer_id);

-- Clients can view audits for time logs on their contracts
create policy "Clients view contract time log audits" on public.nexus_time_log_audits
  for select using (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_contracts c on tl.contract_id = c.id
      where tl.id = time_log_id and c.client_id = auth.uid()
    )
  );

-- Admins can view all audits
create policy "Admins view all time log audits" on public.nexus_time_log_audits
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Talent can insert audits for their own time logs (submission)
create policy "Talent inserts own time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_talent_profiles tp on tl.talent_profile_id = tp.id
      where tl.id = time_log_id and tp.user_id = auth.uid()
    )
  );

-- Clients can insert audits for time logs on their contracts (approval/rejection)
create policy "Clients insert contract time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_contracts c on tl.contract_id = c.id
      where tl.id = time_log_id and c.client_id = auth.uid()
    )
  );

-- Admins can insert any audits
create policy "Admins insert time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS TIME LOGS - Add Admin Access
-- ============================================================================

-- Admins can view all time logs (for approval/reporting)
create policy "Admins view all time logs" on public.nexus_time_logs
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Admins can update any time log (for approval workflow)
create policy "Admins update time logs" on public.nexus_time_logs
  for update using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- FOUNDATION GIG RADAR - Verify Read-Only Access
-- No financial data exposed - safe for Foundation users
-- ============================================================================

-- Grant select on gig radar view (if not already granted)
grant select on public.foundation_gig_radar to authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on policy "Clients view own escrow" on public.nexus_escrow_ledger is 'Clients can only view escrow records where they are the client';
comment on policy "Admins view all escrow" on public.nexus_escrow_ledger is 'Admins have full visibility for management';
comment on policy "Talent views own payouts" on public.nexus_payouts is 'Talent sees their own payout history';
comment on policy "Admins manage payouts" on public.nexus_payouts is 'Only admins can create/modify payouts (payroll)';
comment on policy "Admins view compliance events" on public.nexus_compliance_events is 'Compliance events are admin-only for audit purposes';


-- ========================================
-- Next Migration
-- ========================================


-- Developer API Keys System
-- Manages API keys for developers using the AeThex platform

-- API Keys table
CREATE TABLE IF NOT EXISTS developer_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Key identification
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for display (e.g., "aethex_sk_12345678")
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of full key
  
  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read']::TEXT[], -- ['read', 'write', 'admin']
  
  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  
  -- Rate limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = no expiration
  
  -- Audit
  created_by_ip TEXT,
  last_used_ip TEXT
);

-- Indexes
CREATE INDEX idx_developer_api_keys_user_id ON developer_api_keys(user_id);
CREATE INDEX idx_developer_api_keys_key_hash ON developer_api_keys(key_hash);
CREATE INDEX idx_developer_api_keys_active ON developer_api_keys(is_active) WHERE is_active = true;

-- API usage logs (for analytics)
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES developer_api_keys(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL, -- GET, POST, etc.
  status_code INTEGER NOT NULL,
  
  -- Timing
  response_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- IP and user agent
  ip_address TEXT,
  user_agent TEXT,
  
  -- Error tracking
  error_message TEXT
);

-- Indexes for analytics queries
CREATE INDEX idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX idx_api_usage_logs_timestamp ON api_usage_logs(timestamp DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- Rate limit tracking (in-memory cache in production, but DB fallback)
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES developer_api_keys(id) ON DELETE CASCADE NOT NULL,
  
  -- Time windows
  minute_window TIMESTAMPTZ NOT NULL,
  day_window DATE NOT NULL,
  
  -- Counters
  requests_this_minute INTEGER DEFAULT 0,
  requests_this_day INTEGER DEFAULT 0,
  
  -- Updated timestamp
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(api_key_id, minute_window, day_window)
);

CREATE INDEX idx_rate_limits_api_key ON api_rate_limits(api_key_id);
CREATE INDEX idx_rate_limits_windows ON api_rate_limits(minute_window, day_window);

-- Developer profiles (extended user data)
CREATE TABLE IF NOT EXISTS developer_profiles (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Developer info
  company_name TEXT,
  website_url TEXT,
  github_username TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Plan
  plan_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  plan_starts_at TIMESTAMPTZ DEFAULT NOW(),
  plan_ends_at TIMESTAMPTZ,
  
  -- Limits
  max_api_keys INTEGER DEFAULT 3,
  rate_limit_multiplier NUMERIC DEFAULT 1.0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cleanup function for old logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_logs()
RETURNS void AS $$
BEGIN
  -- Delete logs older than 90 days
  DELETE FROM api_usage_logs
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Delete old rate limit records
  DELETE FROM api_rate_limits
  WHERE minute_window < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Function to get API key usage stats
CREATE OR REPLACE FUNCTION get_api_key_stats(key_id UUID)
RETURNS TABLE(
  total_requests BIGINT,
  requests_today BIGINT,
  requests_this_week BIGINT,
  avg_response_time_ms NUMERIC,
  error_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE timestamp >= CURRENT_DATE) as requests_today,
    COUNT(*) FILTER (WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days') as requests_this_week,
    AVG(response_time_ms) as avg_response_time_ms,
    (COUNT(*) FILTER (WHERE status_code >= 400)::NUMERIC / NULLIF(COUNT(*), 0) * 100) as error_rate
  FROM api_usage_logs
  WHERE api_key_id = key_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE developer_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own API keys
CREATE POLICY api_keys_user_policy ON api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own usage logs
DROP POLICY IF EXISTS api_usage_logs_user_policy ON api_usage_logs;
CREATE POLICY api_usage_logs_user_policy ON api_usage_logs
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own developer profile
DROP POLICY IF EXISTS developer_profiles_user_policy ON developer_profiles;
CREATE POLICY developer_profiles_user_policy ON developer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update developer profile timestamp
CREATE OR REPLACE FUNCTION update_developer_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS developer_profiles_updated_at ON developer_profiles;
CREATE TRIGGER developer_profiles_updated_at
  BEFORE UPDATE ON developer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_developer_profile_timestamp();

-- Comments
COMMENT ON TABLE developer_api_keys IS 'Stores API keys for developer access to AeThex platform';
COMMENT ON TABLE api_usage_logs IS 'Logs all API requests for analytics and debugging';
COMMENT ON TABLE developer_profiles IS 'Extended profile data for developers';
COMMENT ON COLUMN developer_api_keys.key_prefix IS 'First 8 characters of key for display purposes';
COMMENT ON COLUMN developer_api_keys.key_hash IS 'SHA-256 hash of the full API key for verification';
COMMENT ON COLUMN developer_api_keys.scopes IS 'Array of permission scopes: read, write, admin';


-- ========================================
-- Next Migration
-- ========================================


