-- Add Spotify portfolio URL field to ethos_artist_profiles
-- This field allows artists to link their Spotify profile for social proof and portfolio display
-- V1: Simple URL field. V2: Will integrate Spotify API for metadata/embed

ALTER TABLE public.ethos_artist_profiles
ADD COLUMN IF NOT EXISTS spotify_profile_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.ethos_artist_profiles.spotify_profile_url IS 'Spotify artist profile URL for portfolio/social proof. V1: URL link only. V2: Will support web player embed.';
