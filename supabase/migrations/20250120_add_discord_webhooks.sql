-- Table for storing Discord webhook configurations for community posts
CREATE TABLE IF NOT EXISTS public.discord_post_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_id TEXT NOT NULL,
  arm_affiliation TEXT NOT NULL,
  auto_post BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, guild_id, channel_id, arm_affiliation)
);

-- Enable RLS
ALTER TABLE public.discord_post_webhooks ENABLE ROW LEVEL SECURITY;

-- Policies for discord_post_webhooks
CREATE POLICY "discord_webhooks_read_own" ON public.discord_post_webhooks
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "discord_webhooks_manage_own" ON public.discord_post_webhooks
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discord_post_webhooks_user_id ON public.discord_post_webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_post_webhooks_guild_id ON public.discord_post_webhooks(guild_id);

-- Grant service role access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discord_post_webhooks TO service_role;
