-- Create user_follows table for tracking followers/following relationships
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON public.user_follows(following_id);

-- Enable Row Level Security
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  CREATE POLICY user_follows_read ON public.user_follows
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_follows_create ON public.user_follows
    FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY user_follows_delete_own ON public.user_follows
    FOR DELETE TO authenticated USING (follower_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Grant permissions to service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_follows TO service_role;
