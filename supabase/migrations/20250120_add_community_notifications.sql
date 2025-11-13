-- Notifications table for community activity
CREATE TABLE IF NOT EXISTS public.community_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  collaboration_post_id uuid REFERENCES public.collaboration_posts(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'new_post', 'post_liked', 'post_commented', 'post_shared'
  title TEXT NOT NULL,
  description TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (post_id IS NOT NULL OR collaboration_post_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "community_notifications_read_own" ON public.community_notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "community_notifications_manage_own" ON public.community_notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "community_notifications_delete_own" ON public.community_notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_notifications_user_id ON public.community_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_actor_id ON public.community_notifications(actor_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_post_id ON public.community_notifications(post_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_collaboration_post_id ON public.community_notifications(collaboration_post_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_read ON public.community_notifications(read);
CREATE INDEX IF NOT EXISTS idx_community_notifications_created_at ON public.community_notifications(created_at DESC);

-- Grant service role access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_notifications TO service_role;
