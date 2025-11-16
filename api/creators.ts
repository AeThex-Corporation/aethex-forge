import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export async function getCreators(req: Request) {
  const url = new URL(req.url);
  const arm = url.searchParams.get("arm");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search");

  try {
    let query = supabase
      .from("aethex_creators")
      .select(
        `
        id,
        username,
        bio,
        skills,
        avatar_url,
        experience_level,
        arm_affiliations,
        primary_arm,
        spotify_profile_url,
        created_at,
        aethex_projects(count)
      `,
        { count: "exact" },
      )
      .eq("is_discoverable", true)
      .order("created_at", { ascending: false });

    if (arm) {
      query = query.contains("arm_affiliations", [arm]);
    }

    if (search) {
      query = query.or(`username.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching creators:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch creators" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function getCreatorByUsername(username: string) {
  try {
    const { data: creator, error } = await supabase
      .from("aethex_creators")
      .select(
        `
        id,
        username,
        bio,
        skills,
        avatar_url,
        experience_level,
        arm_affiliations,
        primary_arm,
        spotify_profile_url,
        created_at,
        updated_at,
        aethex_projects(id, title, description, url, image_url, tags, is_featured),
        aethex_skill_endorsements(skill, count)
      `,
      )
      .eq("username", username)
      .eq("is_discoverable", true)
      .single();

    if (error) throw error;

    // Get DevConnect link if exists
    const { data: devConnectLink } = await supabase
      .from("aethex_devconnect_links")
      .select("devconnect_username, devconnect_profile_url")
      .eq("aethex_creator_id", creator.id)
      .single();

    return {
      ...creator,
      devconnect_link: devConnectLink,
    };
  } catch (error) {
    console.error("Error fetching creator:", error);
    return null;
  }
}

export async function createCreatorProfile(req: Request, userId: string) {
  try {
    const body = (await req.json()) as any;
    const {
      username,
      bio,
      skills,
      avatar_url,
      experience_level,
      primary_arm,
      arm_affiliations,
      spotify_profile_url,
    } = body;

    const { data, error } = await supabase
      .from("aethex_creators")
      .insert({
        user_id: userId,
        username,
        bio,
        skills: skills || [],
        avatar_url,
        experience_level,
        primary_arm,
        arm_affiliations: arm_affiliations || [],
        spotify_profile_url,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating creator profile:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create creator profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function updateCreatorProfile(req: Request, userId: string) {
  try {
    const body = (await req.json()) as any;
    const {
      username,
      bio,
      skills,
      avatar_url,
      experience_level,
      primary_arm,
      arm_affiliations,
      is_discoverable,
      allow_recommendations,
      spotify_profile_url,
    } = body;

    const { data, error } = await supabase
      .from("aethex_creators")
      .update({
        username,
        bio,
        skills,
        avatar_url,
        experience_level,
        primary_arm,
        arm_affiliations,
        is_discoverable,
        allow_recommendations,
        spotify_profile_url,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating creator profile:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update creator profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function addProjectToCreator(req: Request, creatorId: string) {
  try {
    const body = await req.json();
    const { title, description, url, image_url, tags, is_featured } = body;

    const { data, error } = await supabase
      .from("aethex_projects")
      .insert({
        creator_id: creatorId,
        title,
        description,
        url,
        image_url,
        tags: tags || [],
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return new Response(JSON.stringify({ error: "Failed to add project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function endorseSkill(
  req: Request,
  creatorId: string,
  endorsedByUserId: string,
) {
  try {
    const body = await req.json();
    const { skill } = body;

    // Get the endorsing user's creator ID
    const { data: endorsingCreator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", endorsedByUserId)
      .single();

    if (!endorsingCreator) {
      return new Response(
        JSON.stringify({ error: "Endorsing user not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const { data, error } = await supabase
      .from("aethex_skill_endorsements")
      .insert({
        creator_id: creatorId,
        endorsed_by_id: endorsingCreator.id,
        skill,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error endorsing skill:", error);
    return new Response(JSON.stringify({ error: "Failed to endorse skill" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
