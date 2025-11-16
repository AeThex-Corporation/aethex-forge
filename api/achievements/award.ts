import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { user_id, achievement_names } = (req.body || {}) as {
    user_id?: string;
    achievement_names?: string[];
  };
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  const names =
    Array.isArray(achievement_names) && achievement_names.length
      ? achievement_names
      : ["Welcome to AeThex"];

  try {
    const admin = getAdminClient();
    const { data: achievements, error: aErr } = await admin
      .from("achievements")
      .select("id, name")
      .in("name", names);
    if (aErr) return res.status(500).json({ error: aErr.message });

    const rows = (achievements || []).map((a: any) => ({
      user_id,
      achievement_id: a.id,
    }));
    if (!rows.length) return res.json({ ok: true, awarded: [] });

    const { error: iErr } = await admin
      .from("user_achievements")
      .upsert(rows as any, { onConflict: "user_id,achievement_id" as any });
    if (iErr && iErr.code !== "23505")
      return res.status(500).json({ error: iErr.message });

    return res.json({ ok: true, awarded: rows.length });
  } catch (e: any) {
    if (/SUPABASE_/.test(String(e?.message || ""))) {
      return res
        .status(500)
        .json({ error: `Server misconfigured: ${e.message}` });
    }
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
