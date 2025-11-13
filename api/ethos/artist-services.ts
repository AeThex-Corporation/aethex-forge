import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: any, res: any) {
  const { method, query } = req;

  try {
    if (method === "GET") {
      const artistId = query.artist_id;

      if (!artistId) {
        return res
          .status(400)
          .json({ error: "artist_id query parameter is required" });
      }

      const { data: artist, error: artistError } = await supabase
        .from("ethos_artist_profiles")
        .select(
          `
          user_id,
          for_hire,
          verified,
          skills,
          bio,
          turnaround_days,
          price_list,
          sample_price_track,
          sample_price_sfx,
          sample_price_score,
          user_profiles(id, full_name, avatar_url, email)
        `,
        )
        .eq("user_id", artistId)
        .single();

      if (artistError && artistError.code !== "PGRST116") throw artistError;

      if (!artist || !artist.for_hire) {
        return res
          .status(404)
          .json({ error: "Artist not found or not available for hire" });
      }

      return res.json({
        user_id: artist.user_id,
        name: artist.user_profiles?.[0]?.full_name,
        avatar_url: artist.user_profiles?.[0]?.avatar_url,
        email: artist.user_profiles?.[0]?.email,
        bio: artist.bio,
        verified: artist.verified,
        skills: artist.skills,
        turnaround_days: artist.turnaround_days,
        services: {
          price_list: artist.price_list || {
            track_custom: artist.sample_price_track,
            sfx_pack: artist.sample_price_sfx,
            full_score: artist.sample_price_score,
          },
        },
      });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[Ethos Artist Services]", err);
    res.status(500).json({ error: err.message });
  }
}
