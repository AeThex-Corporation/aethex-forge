import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "./_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { user_id, interests } = (req.body || {}) as {
    user_id?: string;
    interests?: string[];
  };
  if (!user_id || !Array.isArray(interests))
    return res.status(400).json({ error: "invalid payload" });

  try {
    const admin = getAdminClient();
    const { error: delErr } = await admin
      .from("user_interests")
      .delete()
      .eq("user_id", user_id);
    if (delErr) return res.status(500).json({ error: delErr.message });

    if (interests.length) {
      const rows = interests.map((interest) => ({ user_id, interest }));
      const { error } = await admin.from("user_interests").insert(rows);
      if (error) return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (e: any) {
    if (/SUPABASE_/.test(String(e?.message || ""))) {
      return res
        .status(500)
        .json({ error: `Server misconfigured: ${e.message}` });
    }
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
