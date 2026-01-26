import { supabase } from "../_supabase.js";

interface ProfileData {
  headline?: string;
  bio?: string;
  resume_url?: string;
  portfolio_urls?: string[];
  work_history?: WorkHistory[];
  education?: Education[];
  skills?: string[];
  availability?: string;
  desired_rate?: number;
  rate_type?: string;
  location?: string;
  remote_preference?: string;
  is_public?: boolean;
}

interface WorkHistory {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year?: number;
  current: boolean;
}

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = userData.user.id;

  try {
    // GET - Fetch candidate profile
    if (req.method === "GET") {
      const { data: profile, error } = await supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get user info for basic profile
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, email")
        .eq("id", userId)
        .single();

      // Get application stats
      const { data: applications } = await supabase
        .from("aethex_applications")
        .select("id, status")
        .eq("applicant_id", userId);

      const stats = {
        total_applications: applications?.length || 0,
        pending: applications?.filter((a) => a.status === "pending").length || 0,
        reviewed: applications?.filter((a) => a.status === "reviewed").length || 0,
        accepted: applications?.filter((a) => a.status === "accepted").length || 0,
        rejected: applications?.filter((a) => a.status === "rejected").length || 0,
      };

      return new Response(
        JSON.stringify({
          profile: profile || null,
          user: userProfile,
          stats,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // POST - Create or update profile
    if (req.method === "POST") {
      const body: ProfileData = await req.json();

      // Check if profile exists
      const { data: existing } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        // Update existing profile
        const { data, error } = await supabase
          .from("candidate_profiles")
          .update({
            ...body,
            portfolio_urls: body.portfolio_urls
              ? JSON.stringify(body.portfolio_urls)
              : undefined,
            work_history: body.work_history
              ? JSON.stringify(body.work_history)
              : undefined,
            education: body.education
              ? JSON.stringify(body.education)
              : undefined,
          })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ profile: data }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from("candidate_profiles")
          .insert({
            user_id: userId,
            ...body,
            portfolio_urls: body.portfolio_urls
              ? JSON.stringify(body.portfolio_urls)
              : "[]",
            work_history: body.work_history
              ? JSON.stringify(body.work_history)
              : "[]",
            education: body.education
              ? JSON.stringify(body.education)
              : "[]",
          })
          .select()
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ profile: data }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Candidate profile API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
