import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface TrackFilters {
  genre?: string;
  licenseType?: string;
  artist?: string;
  search?: string;
  published?: boolean;
}

export default async function handler(req: any, res: any) {
  const { method, query, body } = req;

  try {
    if (method === "GET") {
      const {
        limit = 50,
        offset = 0,
        genre,
        licenseType,
        artist,
        search,
      } = query;

      let dbQuery = supabase
        .from("ethos_tracks")
        .select(
          `
          id,
          user_id,
          title,
          description,
          file_url,
          duration_seconds,
          genre,
          license_type,
          bpm,
          is_published,
          download_count,
          created_at,
          updated_at,
          user_profiles(id, full_name, avatar_url)
        `,
          { count: "exact" },
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (genre) dbQuery = dbQuery.contains("genre", [genre]);
      if (licenseType) dbQuery = dbQuery.eq("license_type", licenseType);
      if (search)
        dbQuery = dbQuery.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`,
        );

      const { data, error, count } = await dbQuery.range(
        Number(offset),
        Number(offset) + Number(limit) - 1,
      );

      if (error) throw error;

      res.json({
        data,
        total: count,
        limit: Number(limit),
        offset: Number(offset),
      });
    } else if (method === "POST") {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        title,
        description,
        file_url,
        duration_seconds,
        genre,
        license_type,
        bpm,
        is_published,
      } = body;

      if (!title || !file_url || !license_type) {
        return res.status(400).json({
          error: "Missing required fields: title, file_url, license_type",
        });
      }

      const { data, error } = await supabase
        .from("ethos_tracks")
        .insert([
          {
            user_id: userId,
            title,
            description,
            file_url,
            duration_seconds,
            genre: genre || [],
            license_type,
            bpm,
            is_published: is_published !== false,
          },
        ])
        .select();

      if (error) throw error;

      // If ecosystem license type, create ecosystem license record
      if (license_type === "ecosystem" && data && data[0]) {
        const trackId = data[0].id;

        await supabase.from("ethos_ecosystem_licenses").insert([
          {
            track_id: trackId,
            artist_id: userId,
            accepted_at: new Date().toISOString(),
          },
        ]);
      }

      res.status(201).json(data[0]);
    }
  } catch (err: any) {
    console.error("[Ethos Tracks]", err);
    res.status(500).json({ error: err.message });
  }
}
