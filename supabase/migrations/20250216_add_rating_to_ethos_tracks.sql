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
