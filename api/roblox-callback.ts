import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "./_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const shared =
      process.env.ROBLOX_SHARED_SECRET ||
      process.env.ROBLOX_WEBHOOK_SECRET ||
      "";
    const sig =
      (req.headers["x-shared-secret"] as string) ||
      (req.headers["x-roblox-signature"] as string) ||
      "";

    if (shared && sig !== shared) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const payload: Record<string, any> = {
      ...(typeof req.body === "object" && req.body ? req.body : {}),
      ip:
        ((req.headers["x-forwarded-for"] as string) || "").split(",")[0] ||
        null,
      ua: (req.headers["user-agent"] as string) || null,
      received_at: new Date().toISOString(),
    };

    try {
      const admin = getAdminClient();
      await admin.from("roblox_events").insert({
        event_type: (payload as any).event || null,
        payload,
      } as any);
    } catch (e) {
      // ignore persistence errors to avoid 5xx back to Roblox
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
