/**
 * CRITICAL: Profile Sync from Foundation (READ-ONLY)
 *
 * This endpoint syncs Foundation passport data to local cache.
 * It does NOT write arbitrary profile data.
 *
 * Architecture:
 * - aethex.foundation = SSOT (single source of truth)
 * - aethex.dev = Read-only cache of Foundation passports
 * - All profile mutations must go through Foundation APIs
 *
 * Accepted operations:
 * - POST to sync/validate passport on login
 *
 * Rejected operations:
 * - Direct writes to profile fields (username, email, etc.)
 * - Mutations that bypass Foundation
 * - Updates to cached data outside of Foundation sync
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

const FOUNDATION_URL =
  process.env.VITE_FOUNDATION_URL || "https://aethex.foundation";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { id, profile } = (req.body || {}) as { id?: string; profile?: any };
  if (!id) return res.status(400).json({ error: "missing id" });

  try {
    const admin = getAdminClient();

    // ============================================================
    // CRITICAL: REJECT DIRECT WRITES TO PROFILE
    // ============================================================
    // This endpoint now only validates/syncs passports from Foundation.
    // Do NOT write arbitrary profile data to local cache.
    //
    // If profile data needs to be updated:
    // 1. User updates on Foundation (aethex.foundation)
    // 2. Foundation validates and persists changes
    // 3. aethex.dev syncs on next login via auth/callback.ts
    // ============================================================

    // Check if this is an attempt to write profile fields
    if (profile && Object.keys(profile).length > 0) {
      // Only allowed field is to mark profile as "ensured" for onboarding
      const allowedFields = ["profile_completed", "onboarding_step"];
      const attemptedFields = Object.keys(profile);
      const forbiddenFields = attemptedFields.filter(
        (f) => !allowedFields.includes(f),
      );

      if (forbiddenFields.length > 0) {
        console.warn(
          "[Passport Security] Rejected attempt to write forbidden fields:",
          forbiddenFields,
          "for user:",
          id,
        );

        return res.status(403).json({
          error: `Cannot modify profile fields directly. All passport mutations must go through Foundation (${FOUNDATION_URL}).`,
          forbidden_fields: forbiddenFields,
          instruction:
            "To update your profile, log in to aethex.foundation and make changes there. Changes sync to aethex.dev on next login.",
        });
      }
    }

    // ============================================================
    // Only sync/validate existing passport from cache
    // ============================================================

    // Fetch user from cache to validate exists
    const { data: existingUser, error: fetchError } = await admin
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingUser) {
      console.error(
        "[Passport Ensure] User not found in cache (not synced from Foundation yet):",
        id,
      );
      return res.status(400).json({
        error:
          "User profile not found. Please sign out and sign back in to sync with Foundation.",
        user_id: id,
      });
    }

    // Validate passport was synced from Foundation
    if (!existingUser.foundation_synced_at) {
      console.warn(
        "[Passport Ensure] User exists but not synced from Foundation:",
        id,
      );
      return res.status(400).json({
        error:
          "Passport not synchronized from Foundation. Please sign out and sign back in.",
        user_id: id,
      });
    }

    // Validate cache is still fresh
    const cacheValidUntil = new Date(existingUser.cache_valid_until);
    if (new Date() > cacheValidUntil) {
      console.warn(
        "[Passport Ensure] Cache expired for user:",
        id,
        "| Need to refresh from Foundation",
      );

      // In production, would fetch fresh from Foundation API here
      // For now, return warning that cache is stale
      return res.status(400).json({
        error:
          "Passport cache expired. Please sign out and sign back in to refresh.",
        user_id: id,
        cache_expired_at: cacheValidUntil.toISOString(),
      });
    }

    console.log("[Passport Ensure] User passport validated:", id);

    // Return validated cached passport (read-only view)
    return res.json({
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      full_name: existingUser.full_name,
      avatar_url: existingUser.avatar_url,
      profile_completed: existingUser.profile_completed,
      synced_from_foundation: existingUser.foundation_synced_at,
      cache_valid_until: existingUser.cache_valid_until,
      // Never expose local write capability
      _note:
        "This is read-only cache from Foundation. To modify, update at: " +
        FOUNDATION_URL,
    });
  } catch (e: any) {
    if (/SUPABASE_/.test(String(e?.message || ""))) {
      return res
        .status(500)
        .json({ error: `Server misconfigured: ${e.message}` });
    }
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
