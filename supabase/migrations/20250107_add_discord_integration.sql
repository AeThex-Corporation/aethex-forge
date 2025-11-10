-- Discord Links Table (Links Discord user ID to AeThex user)
CREATE TABLE IF NOT EXISTS discord_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  primary_arm TEXT DEFAULT 'labs' CHECK (primary_arm IN ('labs', 'gameforge', 'corp', 'foundation', 'devlink')),
  linked_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discord_links_discord_id ON discord_links(discord_id);
CREATE INDEX IF NOT EXISTS idx_discord_links_user_id ON discord_links(user_id);

-- Discord Verifications Table (Temporary verification codes)
CREATE TABLE IF NOT EXISTS discord_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT NOT NULL,
  verification_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discord_verifications_code ON discord_verifications(verification_code);
CREATE INDEX IF NOT EXISTS idx_discord_verifications_expires ON discord_verifications(expires_at);

-- Temporary linking sessions (for OAuth linking flow to avoid cookie loss during redirect)
CREATE TABLE IF NOT EXISTS discord_linking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discord_linking_sessions_token ON discord_linking_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_discord_linking_sessions_expires ON discord_linking_sessions(expires_at);

ALTER TABLE discord_linking_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_linking_sessions_service_role" ON discord_linking_sessions
  FOR ALL TO service_role USING (true);

-- Discord Role Mappings (Maps AeThex roles to Discord roles)
CREATE TABLE IF NOT EXISTS discord_role_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arm TEXT NOT NULL CHECK (arm IN ('labs', 'gameforge', 'corp', 'foundation', 'devlink')),
  user_type TEXT NOT NULL CHECK (user_type IN ('game_developer', 'community_member', 'pro_supporter', 'staff', 'creator')),
  discord_role_name TEXT NOT NULL,
  discord_role_id TEXT,
  server_id TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(arm, user_type, server_id)
);

CREATE INDEX IF NOT EXISTS idx_discord_role_mappings_arm ON discord_role_mappings(arm);
CREATE INDEX IF NOT EXISTS idx_discord_role_mappings_user_type ON discord_role_mappings(user_type);

-- Discord User Roles (Track assigned roles to users in servers)
CREATE TABLE IF NOT EXISTS discord_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT NOT NULL,
  server_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  role_name TEXT NOT NULL,
  assigned_at TIMESTAMP DEFAULT now(),
  last_verified TIMESTAMP,
  UNIQUE(discord_id, server_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_discord_user_roles_discord_id ON discord_user_roles(discord_id);
CREATE INDEX IF NOT EXISTS idx_discord_user_roles_server ON discord_user_roles(server_id);

-- RLS Policies

ALTER TABLE discord_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_links_users_select" ON discord_links
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "discord_links_service_role" ON discord_links
  FOR ALL TO service_role
  USING (true);

ALTER TABLE discord_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_verifications_service_role" ON discord_verifications
  FOR ALL TO service_role
  USING (true);

ALTER TABLE discord_role_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_role_mappings_public_read" ON discord_role_mappings
  FOR SELECT
  USING (true);

CREATE POLICY "discord_role_mappings_admin_write" ON discord_role_mappings
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "discord_role_mappings_admin_update" ON discord_role_mappings
  FOR UPDATE
  TO service_role
  USING (true);

ALTER TABLE discord_user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_user_roles_service_role" ON discord_user_roles
  FOR ALL TO service_role
  USING (true);

-- Initial Discord Role Mappings (These can be customized in the admin panel)
INSERT INTO discord_role_mappings (arm, user_type, discord_role_name) VALUES
  ('labs', 'game_developer', 'Labs Creator'),
  ('labs', 'pro_supporter', 'Labs Premium'),
  ('gameforge', 'game_developer', 'GameForge Creator'),
  ('gameforge', 'pro_supporter', 'GameForge Premium'),
  ('corp', 'game_developer', 'Corp Member'),
  ('corp', 'pro_supporter', 'Corp Premium'),
  ('foundation', 'game_developer', 'Foundation Member'),
  ('foundation', 'pro_supporter', 'Foundation Premium'),
  ('devlink', 'game_developer', 'Dev-Link Member'),
  ('devlink', 'pro_supporter', 'Dev-Link Premium')
ON CONFLICT DO NOTHING;
