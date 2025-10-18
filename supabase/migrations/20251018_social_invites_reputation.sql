-- Social + Invites + Reputation/Loyalty/XP schema additions

-- Add missing columns to user_profiles
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 0;

-- Invites table
CREATE TABLE IF NOT EXISTS public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  token text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  accepted_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz NULL,
  message text NULL
);

-- Connections (undirected; store both directions for simpler queries)
CREATE TABLE IF NOT EXISTS public.user_connections (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, connection_id)
);

-- Endorsements (skill-based reputation signals)
CREATE TABLE IF NOT EXISTS public.endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endorsed_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reward event ledger (audit for xp/loyalty/reputation changes)
CREATE TABLE IF NOT EXISTS public.reward_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,                 -- e.g. 'invite_sent', 'invite_accepted', 'post_created'
  points_kind text NOT NULL DEFAULT 'xp', -- 'xp' | 'loyalty' | 'reputation'
  amount integer NOT NULL DEFAULT 0,
  metadata jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS (service role bypasses; keep strict by default)
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_events ENABLE ROW LEVEL SECURITY;

-- Minimal readable policies for authenticated users (optional reads)
DO $$ BEGIN
  CREATE POLICY invites_read_own ON public.invites
    FOR SELECT TO authenticated
    USING (inviter_id = auth.uid() OR accepted_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY connections_read_own ON public.user_connections
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR connection_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY endorsements_read_public ON public.endorsements
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY reward_events_read_own ON public.reward_events
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
