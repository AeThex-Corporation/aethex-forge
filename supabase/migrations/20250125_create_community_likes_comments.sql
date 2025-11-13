-- Create community_post_likes table
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create community_comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user_id ON public.community_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON public.community_comments(author_id);

-- Enable Row Level Security
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes
DO $$ BEGIN
  CREATE POLICY community_post_likes_read ON public.community_post_likes
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_post_likes_manage_self ON public.community_post_likes
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS Policies for comments
DO $$ BEGIN
  CREATE POLICY community_comments_read ON public.community_comments
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_comments_create ON public.community_comments
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_comments_update_own ON public.community_comments
    FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY community_comments_delete_own ON public.community_comments
    FOR DELETE TO authenticated USING (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Grant permissions to service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_post_likes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_comments TO service_role;
