import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: any, res: any) {
  const { method, query, body, headers } = req;
  const userId = headers["x-user-id"];

  try {
    if (method === "GET") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { trackId, status = "pending" } = query;

      let dbQuery = supabase
        .from("ethos_licensing_agreements")
        .select(
          `
          id,
          track_id,
          licensee_id,
          license_type,
          agreement_url,
          approved,
          created_at,
          expires_at,
          ethos_tracks(title, user_id),
          user_profiles(full_name, avatar_url)
        `,
          { count: "exact" },
        );

      if (trackId) {
        dbQuery = dbQuery.eq("track_id", trackId);
      }

      if (status === "pending") {
        dbQuery = dbQuery.eq("approved", false);
      } else if (status === "approved") {
        dbQuery = dbQuery.eq("approved", true);
      }

      const { data, error, count } = await dbQuery.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      res.json({
        data,
        total: count,
      });
    } else if (method === "POST") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { track_id, license_type, agreement_url, expires_at } = body;

      if (!track_id || !license_type) {
        return res.status(400).json({
          error: "Missing required fields: track_id, license_type",
        });
      }

      const { data, error } = await supabase
        .from("ethos_licensing_agreements")
        .insert([
          {
            track_id,
            licensee_id: userId,
            license_type,
            agreement_url,
            expires_at,
            approved: false,
          },
        ])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } else if (method === "PUT") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = query;
      const { approved } = body;

      const { data, error } = await supabase
        .from("ethos_licensing_agreements")
        .update({ approved })
        .eq("id", id)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } else if (method === "DELETE") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = query;

      const { error } = await supabase
        .from("ethos_licensing_agreements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.json({ ok: true });
    }
  } catch (err: any) {
    console.error("[Ethos Licensing]", err);
    res.status(500).json({ error: err.message });
  }
}
