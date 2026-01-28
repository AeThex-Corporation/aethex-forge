-- Developer API Keys System
-- Manages API keys for developers using the AeThex platform

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Key identification
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for display (e.g., "aethex_sk_12345678")
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of full key
  
  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read']::TEXT[], -- ['read', 'write', 'admin']
  
  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  
  -- Rate limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = no expiration
  
  -- Audit
  created_by_ip TEXT,
  last_used_ip TEXT
);

-- Indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- API usage logs (for analytics)
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL, -- GET, POST, etc.
  status_code INTEGER NOT NULL,
  
  -- Timing
  response_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- IP and user agent
  ip_address TEXT,
  user_agent TEXT,
  
  -- Error tracking
  error_message TEXT
);

-- Indexes for analytics queries
CREATE INDEX idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX idx_api_usage_logs_timestamp ON api_usage_logs(timestamp DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- Rate limit tracking (in-memory cache in production, but DB fallback)
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
  
  -- Time windows
  minute_window TIMESTAMPTZ NOT NULL,
  day_window DATE NOT NULL,
  
  -- Counters
  requests_this_minute INTEGER DEFAULT 0,
  requests_this_day INTEGER DEFAULT 0,
  
  -- Updated timestamp
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(api_key_id, minute_window, day_window)
);

CREATE INDEX idx_rate_limits_api_key ON api_rate_limits(api_key_id);
CREATE INDEX idx_rate_limits_windows ON api_rate_limits(minute_window, day_window);

-- Developer profiles (extended user data)
CREATE TABLE IF NOT EXISTS developer_profiles (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Developer info
  company_name TEXT,
  website_url TEXT,
  github_username TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Plan
  plan_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  plan_starts_at TIMESTAMPTZ DEFAULT NOW(),
  plan_ends_at TIMESTAMPTZ,
  
  -- Limits
  max_api_keys INTEGER DEFAULT 3,
  rate_limit_multiplier NUMERIC DEFAULT 1.0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cleanup function for old logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_logs()
RETURNS void AS $$
BEGIN
  -- Delete logs older than 90 days
  DELETE FROM api_usage_logs
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Delete old rate limit records
  DELETE FROM api_rate_limits
  WHERE minute_window < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Function to get API key usage stats
CREATE OR REPLACE FUNCTION get_api_key_stats(key_id UUID)
RETURNS TABLE(
  total_requests BIGINT,
  requests_today BIGINT,
  requests_this_week BIGINT,
  avg_response_time_ms NUMERIC,
  error_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE timestamp >= CURRENT_DATE) as requests_today,
    COUNT(*) FILTER (WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days') as requests_this_week,
    AVG(response_time_ms) as avg_response_time_ms,
    (COUNT(*) FILTER (WHERE status_code >= 400)::NUMERIC / NULLIF(COUNT(*), 0) * 100) as error_rate
  FROM api_usage_logs
  WHERE api_key_id = key_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS api_keys_user_policy ON api_keys;
CREATE POLICY api_keys_user_policy ON api_keys
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS api_usage_logs_user_policy ON api_usage_logs;
CREATE POLICY api_usage_logs_user_policy ON api_usage_logs
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS developer_profiles_user_policy ON developer_profiles;
CREATE POLICY developer_profiles_user_policy ON developer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update developer profile timestamp
CREATE OR REPLACE FUNCTION update_developer_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER developer_profiles_updated_at
  BEFORE UPDATE ON developer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_developer_profile_timestamp();

-- Comments
COMMENT ON TABLE api_keys IS 'Stores API keys for developer access to AeThex platform';
COMMENT ON TABLE api_usage_logs IS 'Logs all API requests for analytics and debugging';
COMMENT ON TABLE developer_profiles IS 'Extended profile data for developers';
COMMENT ON COLUMN api_keys.key_prefix IS 'First 8 characters of key for display purposes';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the full API key for verification';
COMMENT ON COLUMN api_keys.scopes IS 'Array of permission scopes: read, write, admin';
