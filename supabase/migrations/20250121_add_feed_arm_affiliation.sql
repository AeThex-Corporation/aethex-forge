-- Add arm_affiliation column to community_posts
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS arm_affiliation TEXT DEFAULT 'labs' NOT NULL;

-- Create index on arm_affiliation for faster filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_arm_affiliation ON public.community_posts(arm_affiliation);

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
CREATE POLICY "user_followed_arms_read" ON public.user_followed_arms
  FOR SELECT TO authenticated USING (true);

-- Policy: Users can manage their own followed arms
CREATE POLICY "user_followed_arms_manage_self" ON public.user_followed_arms
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Update community_posts table constraints and indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON public.community_posts(author_id);

-- Add grant for service role (backend API access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_followed_arms TO service_role;
