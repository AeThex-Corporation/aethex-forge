-- Add Spotify portfolio URL to aethex_creators
-- This field allows ALL creators (regardless of type) to link their Spotify profile
-- for social proof and portfolio display on their public profiles (/passport/:username, /creators/:username)
-- V1: Simple URL field. V2: Will integrate Spotify API for metadata/embed

ALTER TABLE public.aethex_creators
ADD COLUMN IF NOT EXISTS spotify_profile_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.aethex_creators.spotify_profile_url IS 'Spotify artist profile URL for universal portfolio/social proof. Supports all creator types. V1: URL link only. V2: Will support web player embed.';
