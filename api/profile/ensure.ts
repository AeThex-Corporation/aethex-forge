import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { id, profile } = (req.body || {}) as { id?: string; profile?: any };
  if (!id) return res.status(400).json({ error: "missing id" });

  try {
    const admin = getAdminClient();

    const tryUpsert = async (payload: any) => {
      const resp = await admin
        .from("user_profiles")
        .upsert(payload, { onConflict: "id" as any })
        .select()
        .single();
      return resp as any;
    };

    let username = profile?.username;
    let attempt = await tryUpsert({ id, ...profile, username });

    const normalizeError = (err: any) => {
      if (!err) return null;
      if (typeof err === "string") return { message: err };
      if (typeof err === "object" && Object.keys(err).length === 0) return null;
      return err;
    };

    let error = normalizeError(attempt.error);
    if (error) {
      const message: string = (error as any).message || "";
      const code: string = (error as any).code || "";

      if (
        code === "23505" ||
        message.includes("duplicate key") ||
        message.includes("username")
      ) {
        const suffix = Math.random().toString(36).slice(2, 6);
        const newUsername = `${String(username || "user").slice(0, 20)}_${suffix}`;
        attempt = await tryUpsert({ id, ...profile, username: newUsername });
        error = normalizeError(attempt.error);
      }
    }

    if (error) {
      if (
        (error as any).code === "23503" ||
        (error as any).message?.includes("foreign key")
      ) {
        return res.status(400).json({
          error:
            "User does not exist in authentication system. Please sign out and sign back in, then retry onboarding.",
        });
      }
      return res
        .status(500)
        .json({ error: (error as any).message || "Unknown error" });
    }

    return res.json(attempt.data || {});
  } catch (e: any) {
    if (/SUPABASE_/.test(String(e?.message || ""))) {
      return res
        .status(500)
        .json({ error: `Server misconfigured: ${e.message}` });
    }
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
