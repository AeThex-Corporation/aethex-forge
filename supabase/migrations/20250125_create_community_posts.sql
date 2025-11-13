-- Create community_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  arm_affiliation text DEFAULT 'labs' NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true NOT NULL,
  likes_count integer DEFAULT 0 NOT NULL,
  comments_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_published ON public.community_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_community_posts_arm_affiliation ON public.community_posts(arm_affiliation);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON public.community_posts USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies - only create if they don't exist
DO $$ BEGIN
  CREATE POLICY community_posts_read ON public.community_posts
    FOR SELECT TO authenticated USING (is_published = true OR author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_posts_create ON public.community_posts
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_posts_update_own ON public.community_posts
    FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_posts_delete_own ON public.community_posts
    FOR DELETE TO authenticated USING (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow service role to manage posts
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO service_role;
