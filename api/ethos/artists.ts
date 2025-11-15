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
      const artistId = query.id;

      if (artistId) {
        const { data: artist, error: artistError } = await supabase
          .from("ethos_artist_profiles")
          .select(
            `
            user_id,
            skills,
            for_hire,
            bio,
            portfolio_url,
            sample_price_track,
            sample_price_sfx,
            sample_price_score,
            turnaround_days,
            verified,
            total_downloads,
            created_at,
            user_profiles(id, full_name, avatar_url)
          `,
          )
          .eq("user_id", artistId)
          .single();

        if (artistError && artistError.code !== "PGRST116") throw artistError;

        if (!artist) {
          return res.status(404).json({ error: "Artist not found" });
        }

        const { data: tracks } = await supabase
          .from("ethos_tracks")
          .select("*")
          .eq("user_id", artistId)
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        res.json({
          ...artist,
          tracks: tracks || [],
        });
      } else {
        const { limit = 50, offset = 0, verified, forHire } = query;

        let dbQuery = supabase.from("ethos_artist_profiles").select(
          `
          user_id,
          skills,
          for_hire,
          bio,
          portfolio_url,
          sample_price_track,
          sample_price_sfx,
          sample_price_score,
          turnaround_days,
          verified,
          total_downloads,
          created_at,
          user_profiles(id, full_name, avatar_url)
        `,
          { count: "exact" },
        );

        if (verified === "true") dbQuery = dbQuery.eq("verified", true);
        if (forHire === "true") dbQuery = dbQuery.eq("for_hire", true);

        const { data, error, count } = await dbQuery
          .order("verified", { ascending: false })
          .order("total_downloads", { ascending: false })
          .range(Number(offset), Number(offset) + Number(limit) - 1);

        if (error) throw error;

        res.json({
          data,
          total: count,
          limit: Number(limit),
          offset: Number(offset),
        });
      }
    } else if (method === "PUT") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        skills,
        for_hire,
        bio,
        portfolio_url,
        sample_price_track,
        sample_price_sfx,
        sample_price_score,
        turnaround_days,
      } = body;

      const { data, error } = await supabase
        .from("ethos_artist_profiles")
        .upsert(
          {
            user_id: userId,
            skills: skills || [],
            for_hire: for_hire !== false,
            bio,
            portfolio_url,
            sample_price_track,
            sample_price_sfx,
            sample_price_score,
            turnaround_days,
          },
          { onConflict: "user_id" },
        )
        .select();

      if (error) throw error;
      res.json(data[0]);
    }
  } catch (err: any) {
    console.error("[Ethos Artists]", err);
    res.status(500).json({ error: err.message });
  }
}
