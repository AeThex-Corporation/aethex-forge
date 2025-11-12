import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface ServiceRequest {
  artist_id: string;
  requester_id: string;
  service_type: string; // track_custom, sfx_pack, full_score, day_rate
  description: string;
  budget?: number;
  deadline?: string;
  status?: "pending" | "accepted" | "in_progress" | "completed" | "declined";
}

export default async function handler(req: any, res: any) {
  const { method, body, query } = req;
  const requesterId = req.headers["x-user-id"];

  try {
    if (method === "POST") {
      if (!requesterId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { artist_id, service_type, description, budget, deadline } = body;

      if (!artist_id || !service_type || !description) {
        return res.status(400).json({
          error:
            "Missing required fields: artist_id, service_type, description",
        });
      }

      // Verify artist exists and is for_hire
      const { data: artist, error: artistError } = await supabase
        .from("ethos_artist_profiles")
        .select("user_id, for_hire, verified")
        .eq("user_id", artist_id)
        .single();

      if (artistError || !artist || !artist.for_hire) {
        return res
          .status(404)
          .json({ error: "Artist not found or not available for hire" });
      }

      // Create service request
      const { data, error } = await supabase
        .from("ethos_service_requests")
        .insert([
          {
            artist_id,
            requester_id: requesterId,
            service_type,
            description,
            budget: budget || null,
            deadline: deadline || null,
            status: "pending",
          },
        ])
        .select();

      if (error) throw error;

      // Send notification email to artist
      try {
        const requesterRes = await supabase
          .from("user_profiles")
          .select("full_name, email")
          .eq("id", requesterId)
          .single();

        const artistRes = await supabase
          .from("user_profiles")
          .select("email")
          .eq("id", artist_id)
          .single();

        if (requesterRes.data && artistRes.data) {
          // Notification would be sent here via email service
          console.log(
            `[Ethos] Service request notification would be sent to ${artistRes.data.email}`,
          );
        }
      } catch (emailErr) {
        console.error("[Ethos] Error sending notification:", emailErr);
      }

      return res.status(201).json(data[0]);
    } else if (method === "GET") {
      const { artist_id, requester_id, status } = query;

      let dbQuery = supabase.from("ethos_service_requests").select("*");

      if (artist_id) dbQuery = dbQuery.eq("artist_id", artist_id);
      if (requester_id) dbQuery = dbQuery.eq("requester_id", requester_id);
      if (status) dbQuery = dbQuery.eq("status", status);

      const { data, error } = await dbQuery.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return res.json({ data });
    } else if (method === "PUT") {
      if (!requesterId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = query;
      const { status, notes } = body;

      if (!id || !status) {
        return res
          .status(400)
          .json({ error: "Missing required fields: id, status" });
      }

      const { data, error } = await supabase
        .from("ethos_service_requests")
        .update({
          status,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Service request not found" });
      }

      return res.json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[Ethos Service Requests]", err);
    res.status(500).json({ error: err.message });
  }
}
