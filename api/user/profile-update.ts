import { getAdminClient } from "../_supabase.js";

export default async (req: Request) => {
  if (req.method !== "PUT" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.slice(7);
    const supabase = getAdminClient();
    const { data: userData } = await supabase.auth.getUser(token);

    if (!userData.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as any;
    const userId = userData.user.id;

    // Sanitize and validate input
    const updates: any = {};

    // Profile fields
    if ("bio_detailed" in body)
      updates.bio_detailed = body.bio_detailed || null;
    if ("twitter_url" in body) updates.twitter_url = body.twitter_url || null;
    if ("linkedin_url" in body)
      updates.linkedin_url = body.linkedin_url || null;
    if ("github_url" in body) updates.github_url = body.github_url || null;
    if ("portfolio_url" in body)
      updates.portfolio_url = body.portfolio_url || null;
    if ("youtube_url" in body) updates.youtube_url = body.youtube_url || null;
    if ("twitch_url" in body) updates.twitch_url = body.twitch_url || null;

    // Professional info
    if ("hourly_rate" in body)
      updates.hourly_rate = body.hourly_rate
        ? parseFloat(body.hourly_rate)
        : null;
    if ("availability_status" in body)
      updates.availability_status = [
        "available",
        "limited",
        "unavailable",
      ].includes(body.availability_status)
        ? body.availability_status
        : "available";
    if ("timezone" in body) updates.timezone = body.timezone || null;
    if ("location" in body) updates.location = body.location || null;

    // Arrays
    if ("languages" in body) {
      updates.languages = Array.isArray(body.languages) ? body.languages : [];
    }
    if ("skills_detailed" in body) {
      updates.skills_detailed = Array.isArray(body.skills_detailed)
        ? body.skills_detailed
        : [];
    }
    if ("work_experience" in body) {
      updates.work_experience = Array.isArray(body.work_experience)
        ? body.work_experience
        : [];
    }
    if ("portfolio_items" in body) {
      updates.portfolio_items = Array.isArray(body.portfolio_items)
        ? body.portfolio_items
        : [];
    }
    if ("arm_affiliations" in body) {
      const validArms = ["foundation", "gameforge", "labs", "corp", "devlink"];
      updates.arm_affiliations = Array.isArray(body.arm_affiliations)
        ? body.arm_affiliations.filter((a: string) => validArms.includes(a))
        : [];
    }

    // Nexus specific
    if ("nexus_profile_complete" in body)
      updates.nexus_profile_complete = body.nexus_profile_complete === true;
    if ("nexus_headline" in body)
      updates.nexus_headline = body.nexus_headline || null;
    if ("nexus_categories" in body) {
      updates.nexus_categories = Array.isArray(body.nexus_categories)
        ? body.nexus_categories
        : [];
    }

    // Update the profile
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
