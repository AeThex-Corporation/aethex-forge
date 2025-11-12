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
CREATE POLICY "Artists can view their own ecosystem licenses" ON public.ethos_ecosystem_licenses
  FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Admins can view all ecosystem licenses" ON public.ethos_ecosystem_licenses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Artists can create ecosystem license records" ON public.ethos_ecosystem_licenses
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

-- Add comments for documentation
COMMENT ON COLUMN public.ethos_artist_profiles.price_list IS 'JSON object with pricing: {track_custom: 500, sfx_pack: 150, full_score: 2000, day_rate: 1500, contact_for_quote: false}';

COMMENT ON COLUMN public.ethos_artist_profiles.ecosystem_license_accepted IS 'Whether artist has accepted the KND-008 Ecosystem License agreement';

COMMENT ON COLUMN public.ethos_artist_profiles.ecosystem_license_accepted_at IS 'Timestamp when artist accepted the Ecosystem License';

COMMENT ON TABLE public.ethos_ecosystem_licenses IS 'Tracks individual ecosystem license acceptances per track for audit and compliance';
