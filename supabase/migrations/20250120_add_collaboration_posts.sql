-- Collaboration posts table for multi-author posts
CREATE TABLE IF NOT EXISTS public.collaboration_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  arm_affiliation TEXT NOT NULL DEFAULT 'labs',
  created_by uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT
);

-- Junction table for collaboration post authors
CREATE TABLE IF NOT EXISTS public.collaboration_posts_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_post_id uuid NOT NULL REFERENCES public.collaboration_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'contributor', -- 'creator' or 'contributor'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(collaboration_post_id, user_id)
);

-- Likes table for collaboration posts
CREATE TABLE IF NOT EXISTS public.collaboration_post_likes (
  post_id uuid NOT NULL REFERENCES public.collaboration_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- Comments table for collaboration posts
CREATE TABLE IF NOT EXISTS public.collaboration_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.collaboration_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaboration_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_posts_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_comments ENABLE ROW LEVEL SECURITY;

-- Policies for collaboration_posts
CREATE POLICY "collaboration_posts_read" ON public.collaboration_posts
  FOR SELECT TO authenticated USING (is_published = true);

CREATE POLICY "collaboration_posts_manage_own" ON public.collaboration_posts
  FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Policies for collaboration_posts_authors
CREATE POLICY "collaboration_posts_authors_read" ON public.collaboration_posts_authors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "collaboration_posts_authors_manage" ON public.collaboration_posts_authors
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.collaboration_posts
      WHERE id = collaboration_post_id AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.collaboration_posts
      WHERE id = collaboration_post_id AND created_by = auth.uid()
    )
  );

-- Policies for collaboration_post_likes
CREATE POLICY "collaboration_post_likes_read" ON public.collaboration_post_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "collaboration_post_likes_manage_self" ON public.collaboration_post_likes
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies for collaboration_comments
CREATE POLICY "collaboration_comments_read" ON public.collaboration_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "collaboration_comments_manage_self" ON public.collaboration_comments
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_collaboration_posts_arm_affiliation ON public.collaboration_posts(arm_affiliation);
CREATE INDEX IF NOT EXISTS idx_collaboration_posts_created_by ON public.collaboration_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_collaboration_posts_created_at ON public.collaboration_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collaboration_posts_authors_post_id ON public.collaboration_posts_authors(collaboration_post_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_posts_authors_user_id ON public.collaboration_posts_authors(user_id);

-- Create triggers for updating likes and comments counts
CREATE OR REPLACE FUNCTION update_collaboration_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collaboration_posts
    SET likes_count = (SELECT COUNT(*) FROM public.collaboration_post_likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collaboration_posts
    SET likes_count = (SELECT COUNT(*) FROM public.collaboration_post_likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_collaboration_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collaboration_posts
    SET comments_count = (SELECT COUNT(*) FROM public.collaboration_comments WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collaboration_posts
    SET comments_count = (SELECT COUNT(*) FROM public.collaboration_comments WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_collaboration_post_likes_count ON public.collaboration_post_likes;
DROP TRIGGER IF EXISTS trigger_update_collaboration_post_comments_count ON public.collaboration_comments;

CREATE TRIGGER trigger_update_collaboration_post_likes_count
AFTER INSERT OR DELETE ON public.collaboration_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_collaboration_post_likes_count();

CREATE TRIGGER trigger_update_collaboration_post_comments_count
AFTER INSERT OR DELETE ON public.collaboration_comments
FOR EACH ROW
EXECUTE FUNCTION update_collaboration_post_comments_count();

-- Grant service role access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_posts_authors TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_post_likes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_comments TO service_role;
