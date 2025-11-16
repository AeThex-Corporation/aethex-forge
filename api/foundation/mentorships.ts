import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  // Only authenticated requests
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    if (req.method === "GET") {
      // Get user's mentorships (as mentee or mentor)
      const role = req.query.role as string | undefined; // 'mentor' or 'mentee'

      let mentorships;
      if (role === "mentor") {
        const { data: m } = await admin
          .from("foundation_mentorships")
          .select(
            `
            *,
            mentee:user_profiles!mentee_id(id, full_name, avatar_url, email)
          `,
          )
          .eq("mentor_id", user.id)
          .order("created_at", { ascending: false });
        mentorships = m;
      } else if (role === "mentee") {
        const { data: m } = await admin
          .from("foundation_mentorships")
          .select(
            `
            *,
            mentor:user_profiles!mentor_id(id, full_name, avatar_url, email)
          `,
          )
          .eq("mentee_id", user.id)
          .order("created_at", { ascending: false });
        mentorships = m;
      } else {
        // Get both roles
        const { data: asMentor } = await admin
          .from("foundation_mentorships")
          .select(
            `*,
            mentee:user_profiles!mentee_id(id, full_name, avatar_url, email)`,
          )
          .eq("mentor_id", user.id);

        const { data: asMentee } = await admin
          .from("foundation_mentorships")
          .select(
            `*,
            mentor:user_profiles!mentor_id(id, full_name, avatar_url, email)`,
          )
          .eq("mentee_id", user.id);

        return res.status(200).json({
          as_mentor: asMentor || [],
          as_mentee: asMentee || [],
        });
      }

      return res.status(200).json({
        mentorships: mentorships || [],
      });
    }

    if (req.method === "POST") {
      // Request a mentor
      const { mentor_id } = req.body;

      if (!mentor_id) {
        return res.status(400).json({ error: "mentor_id required" });
      }

      const { data: mentorship, error: createError } = await admin
        .from("foundation_mentorships")
        .insert({
          mentor_id,
          mentee_id: user.id,
          status: "pending",
          requested_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === "23505") {
          return res.status(400).json({ error: "Mentorship already exists" });
        }
        return res.status(500).json({ error: createError.message });
      }

      return res.status(201).json(mentorship);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
