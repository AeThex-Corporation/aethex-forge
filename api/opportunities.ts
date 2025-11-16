import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export async function getOpportunities(req: Request) {
  const url = new URL(req.url);
  const arm = url.searchParams.get("arm");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const sort = url.searchParams.get("sort") || "recent";
  const search = url.searchParams.get("search");
  const jobType = url.searchParams.get("jobType");
  const experienceLevel = url.searchParams.get("experienceLevel");

  try {
    let query = supabase
      .from("aethex_opportunities")
      .select(
        `
        id,
        title,
        description,
        job_type,
        salary_min,
        salary_max,
        experience_level,
        arm_affiliation,
        posted_by_id,
        aethex_creators!aethex_opportunities_posted_by_id_fkey(username, avatar_url),
        status,
        created_at,
        aethex_applications(count)
      `,
        { count: "exact" },
      )
      .eq("status", "open");

    if (arm) {
      query = query.eq("arm_affiliation", arm);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (jobType) {
      query = query.eq("job_type", jobType);
    }

    if (experienceLevel) {
      query = query.eq("experience_level", experienceLevel);
    }

    // Sort by parameter
    const ascending = sort === "oldest";
    query = query.order("created_at", { ascending });

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
    console.error("Error fetching opportunities:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch opportunities" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function getOpportunityById(opportunityId: string) {
  try {
    const { data, error } = await supabase
      .from("aethex_opportunities")
      .select(
        `
        id,
        title,
        description,
        job_type,
        salary_min,
        salary_max,
        experience_level,
        arm_affiliation,
        posted_by_id,
        aethex_creators!aethex_opportunities_posted_by_id_fkey(id, username, bio, avatar_url),
        status,
        created_at,
        updated_at,
        aethex_applications(count)
      `,
      )
      .eq("id", opportunityId)
      .eq("status", "open")
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return null;
  }
}

export async function createOpportunity(req: Request, userId: string) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      job_type,
      salary_min,
      salary_max,
      experience_level,
      arm_affiliation,
    } = body;

    // Get the creator ID for this user
    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!creator) {
      return new Response(
        JSON.stringify({
          error: "Creator profile not found. Create profile first.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const { data, error } = await supabase
      .from("aethex_opportunities")
      .insert({
        title,
        description,
        job_type,
        salary_min,
        salary_max,
        experience_level,
        arm_affiliation,
        posted_by_id: creator.id,
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create opportunity" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function updateOpportunity(
  req: Request,
  opportunityId: string,
  userId: string,
) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      job_type,
      salary_min,
      salary_max,
      experience_level,
      status,
    } = body;

    // Verify user owns this opportunity
    const { data: opportunity } = await supabase
      .from("aethex_opportunities")
      .select("posted_by_id")
      .eq("id", opportunityId)
      .single();

    if (!opportunity) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (creator?.id !== opportunity.posted_by_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("aethex_opportunities")
      .update({
        title,
        description,
        job_type,
        salary_min,
        salary_max,
        experience_level,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", opportunityId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update opportunity" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function closeOpportunity(opportunityId: string, userId: string) {
  try {
    // Verify user owns this opportunity
    const { data: opportunity } = await supabase
      .from("aethex_opportunities")
      .select("posted_by_id")
      .eq("id", opportunityId)
      .single();

    if (!opportunity) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (creator?.id !== opportunity.posted_by_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("aethex_opportunities")
      .update({
        status: "closed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", opportunityId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error closing opportunity:", error);
    return new Response(
      JSON.stringify({ error: "Failed to close opportunity" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Dummy default export for Vercel (this file is a utility, not a handler)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(501).json({ error: "Not a handler" });
}
