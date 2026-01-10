import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

// Generate a secure API key
function generateApiKey(): { fullKey: string; prefix: string; hash: string } {
  // Format: aethex_sk_<32 random bytes as hex>
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const fullKey = `aethex_sk_${randomBytes}`;
  const prefix = fullKey.substring(0, 16); // "aethex_sk_12345678"
  const hash = crypto.createHash("sha256").update(fullKey).digest("hex");

  return { fullKey, prefix, hash };
}

// Verify API key from request
export async function verifyApiKey(key: string) {
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  const { data: apiKey, error } = await supabase
    .from("api_keys")
    .select("*, developer_profiles!inner(*)")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .single();

  if (error || !apiKey) {
    return null;
  }

  // Check if expired
  if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
    return null;
  }

  return apiKey;
}

// GET /api/developer/keys - List all API keys for user
export const listKeys: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data: keys, error } = await supabase
      .from("api_keys")
      .select("id, name, key_prefix, scopes, last_used_at, usage_count, is_active, created_at, expires_at, rate_limit_per_minute, rate_limit_per_day")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching API keys:", error);
      return res.status(500).json({ error: "Failed to fetch API keys" });
    }

    res.json({ keys });
  } catch (error) {
    console.error("Error in listKeys:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/developer/keys - Create new API key
export const createKey: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, scopes = ["read"], expiresInDays } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (name.length > 50) {
      return res.status(400).json({ error: "Name must be 50 characters or less" });
    }

    // Check developer profile limits
    const { data: profile } = await supabase
      .from("developer_profiles")
      .select("max_api_keys")
      .eq("user_id", userId)
      .single();

    const maxKeys = profile?.max_api_keys || 3;

    // Count existing keys
    const { count } = await supabase
      .from("api_keys")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);

    if (count && count >= maxKeys) {
      return res.status(403).json({
        error: `Maximum of ${maxKeys} API keys reached. Delete an existing key first.`,
      });
    }

    // Validate scopes
    const validScopes = ["read", "write", "admin"];
    const invalidScopes = scopes.filter((s: string) => !validScopes.includes(s));
    if (invalidScopes.length > 0) {
      return res.status(400).json({
        error: `Invalid scopes: ${invalidScopes.join(", ")}`,
      });
    }

    // Generate key
    const { fullKey, prefix, hash } = generateApiKey();

    // Calculate expiration
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Insert into database
    const { data: newKey, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: userId,
        name: name.trim(),
        key_prefix: prefix,
        key_hash: hash,
        scopes,
        expires_at: expiresAt,
        created_by_ip: req.ip,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating API key:", error);
      return res.status(500).json({ error: "Failed to create API key" });
    }

    // Return the full key ONLY on creation (never stored or shown again)
    res.json({
      message: "API key created successfully",
      key: {
        ...newKey,
        full_key: fullKey, // Only returned once
      },
      warning: "Save this key securely. It will not be shown again.",
    });
  } catch (error) {
    console.error("Error in createKey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/developer/keys/:id - Delete (revoke) an API key
export const deleteKey: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify ownership and delete
    const { data, error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "API key not found" });
    }

    res.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error in deleteKey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/developer/keys/:id - Update API key (name, scopes, active status)
export const updateKey: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, scopes, is_active } = req.body;

    const updates: any = {};

    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      if (name.length > 50) {
        return res.status(400).json({ error: "Name must be 50 characters or less" });
      }
      updates.name = name.trim();
    }

    if (scopes !== undefined) {
      const validScopes = ["read", "write", "admin"];
      const invalidScopes = scopes.filter((s: string) => !validScopes.includes(s));
      if (invalidScopes.length > 0) {
        return res.status(400).json({
          error: `Invalid scopes: ${invalidScopes.join(", ")}`,
        });
      }
      updates.scopes = scopes;
    }

    if (is_active !== undefined) {
      updates.is_active = Boolean(is_active);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    // Update
    const { data, error } = await supabase
      .from("api_keys")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "API key not found" });
    }

    res.json({
      message: "API key updated successfully",
      key: data,
    });
  } catch (error) {
    console.error("Error in updateKey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/developer/keys/:id/stats - Get usage statistics for a key
export const getKeyStats: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify ownership
    const { data: key, error: keyError } = await supabase
      .from("api_keys")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (keyError || !key) {
      return res.status(404).json({ error: "API key not found" });
    }

    // Get stats using the database function
    const { data: stats, error: statsError } = await supabase.rpc(
      "get_api_key_stats",
      { key_id: id }
    );

    if (statsError) {
      console.error("Error fetching key stats:", statsError);
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }

    // Get recent usage logs
    const { data: recentLogs, error: logsError } = await supabase
      .from("api_usage_logs")
      .select("endpoint, method, status_code, timestamp, response_time_ms")
      .eq("api_key_id", id)
      .order("timestamp", { ascending: false })
      .limit(100);

    if (logsError) {
      console.error("Error fetching recent logs:", logsError);
    }

    // Get usage by day (last 30 days)
    const { data: dailyUsage, error: dailyError } = await supabase
      .from("api_usage_logs")
      .select("timestamp")
      .eq("api_key_id", id)
      .gte("timestamp", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("timestamp", { ascending: true });

    if (dailyError) {
      console.error("Error fetching daily usage:", dailyError);
    }

    // Group by day
    const usageByDay: Record<string, number> = {};
    if (dailyUsage) {
      dailyUsage.forEach((log) => {
        const day = new Date(log.timestamp).toISOString().split("T")[0];
        usageByDay[day] = (usageByDay[day] || 0) + 1;
      });
    }

    res.json({
      stats: stats?.[0] || {
        total_requests: 0,
        requests_today: 0,
        requests_this_week: 0,
        avg_response_time_ms: 0,
        error_rate: 0,
      },
      recentLogs: recentLogs || [],
      usageByDay,
    });
  } catch (error) {
    console.error("Error in getKeyStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/developer/profile - Get developer profile
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let { data: profile, error } = await supabase
      .from("developer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Create profile if doesn't exist
    if (error && error.code === "PGRST116") {
      const { data: newProfile, error: createError } = await supabase
        .from("developer_profiles")
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) {
        console.error("Error creating developer profile:", createError);
        return res.status(500).json({ error: "Failed to create profile" });
      }

      profile = newProfile;
    } else if (error) {
      console.error("Error fetching developer profile:", error);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }

    res.json({ profile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/developer/profile - Update developer profile
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { company_name, website_url, github_username } = req.body;

    const updates: any = {};

    if (company_name !== undefined) {
      updates.company_name = company_name?.trim() || null;
    }
    if (website_url !== undefined) {
      updates.website_url = website_url?.trim() || null;
    }
    if (github_username !== undefined) {
      updates.github_username = github_username?.trim() || null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const { data: profile, error } = await supabase
      .from("developer_profiles")
      .upsert({ user_id: userId, ...updates })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating developer profile:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
