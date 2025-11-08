-- Web3 nonce table for signature verification
CREATE TABLE IF NOT EXISTS web3_nonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  nonce TEXT NOT NULL,
  used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT valid_wallet CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

CREATE INDEX IF NOT EXISTS idx_web3_nonces_wallet ON web3_nonces(wallet_address);
CREATE INDEX IF NOT EXISTS idx_web3_nonces_expires ON web3_nonces(expires_at);

-- Add Web3 columns to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS roblox_user_id TEXT UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS roblox_username TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS unity_player_id TEXT UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS unreal_player_id TEXT UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS godot_player_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_roblox ON user_profiles(roblox_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unity ON user_profiles(unity_player_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_unreal ON user_profiles(unreal_player_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_godot ON user_profiles(godot_player_id);

-- Game authentication tokens table
CREATE TABLE IF NOT EXISTS game_auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  game TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  player_token TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  last_used TIMESTAMP NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_game_auth_tokens_user ON game_auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_game_auth_tokens_game ON game_auth_tokens(game);
CREATE INDEX IF NOT EXISTS idx_game_auth_tokens_expires ON game_auth_tokens(expires_at);

-- Game sessions table for active game connections
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  game TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_id TEXT,
  platform TEXT,
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game ON game_sessions(game);
CREATE INDEX IF NOT EXISTS idx_game_sessions_expires ON game_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_token ON game_sessions(session_token);

-- Roblox user linking table (alternative to columns)
CREATE TABLE IF NOT EXISTS roblox_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  roblox_user_id TEXT NOT NULL UNIQUE,
  roblox_username TEXT NOT NULL,
  linked_at TIMESTAMP DEFAULT now(),
  last_verified TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_roblox_links_user ON roblox_links(user_id);
CREATE INDEX IF NOT EXISTS idx_roblox_links_roblox_id ON roblox_links(roblox_user_id);

-- Web3 wallet linking table (alternative to columns)
CREATE TABLE IF NOT EXISTS web3_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL UNIQUE,
  chain_id INTEGER DEFAULT 1,
  linked_at TIMESTAMP DEFAULT now(),
  last_verified TIMESTAMP NULL,
  CONSTRAINT valid_eth_address CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

CREATE INDEX IF NOT EXISTS idx_web3_wallets_user ON web3_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_web3_wallets_address ON web3_wallets(wallet_address);

-- RLS policies for game data
ALTER TABLE game_auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roblox_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE web3_wallets ENABLE ROW LEVEL SECURITY;

-- Public tables for game auth (service role only for inserts)
CREATE POLICY "game_auth_tokens_service_insert" ON game_auth_tokens
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "game_sessions_service_insert" ON game_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

-- Allow authenticated users to view their own game data
CREATE POLICY "game_auth_tokens_user_select" ON game_auth_tokens
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "game_sessions_user_select" ON game_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "roblox_links_user_select" ON roblox_links
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "web3_wallets_user_select" ON web3_wallets
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
