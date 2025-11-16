import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export async function getMyApplications(req: Request, userId: string) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const status = url.searchParams.get("status");

  try {
    // Get creator ID for this user
    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Creator profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    let query = supabase
      .from("aethex_applications")
      .select(
        `
        id,
        creator_id,
        opportunity_id,
        status,
        cover_letter,
        response_message,
        applied_at,
        updated_at,
        aethex_opportunities(id, title, arm_affiliation, job_type, posted_by_id, aethex_creators!aethex_opportunities_posted_by_id_fkey(username, avatar_url))
      `,
        { count: "exact" },
      )
      .eq("creator_id", creator.id);

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("applied_at", { ascending: false });

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
    console.error("Error fetching applications:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch applications" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function getApplicationsForOpportunity(
  opportunityId: string,
  userId: string,
) {
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
      .from("aethex_applications")
      .select(
        `
        id,
        creator_id,
        status,
        cover_letter,
        applied_at,
        aethex_creators(username, avatar_url, bio, skills)
      `,
      )
      .eq("opportunity_id", opportunityId)
      .order("applied_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching opportunity applications:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch applications" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function submitApplication(req: Request, userId: string) {
  try {
    const body = (await req.json()) as {
      opportunity_id?: string;
      cover_letter?: string;
    };
    const { opportunity_id, cover_letter } = body;

    // Get creator ID for this user
    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Creator profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check if opportunity exists and is open
    const { data: opportunity } = await supabase
      .from("aethex_opportunities")
      .select("id")
      .eq("id", opportunity_id)
      .eq("status", "open")
      .single();

    if (!opportunity) {
      return new Response(
        JSON.stringify({ error: "Opportunity not found or closed" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("aethex_applications")
      .select("id")
      .eq("creator_id", creator.id)
      .eq("opportunity_id", opportunity_id)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          error: "You have already applied to this opportunity",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { data, error } = await supabase
      .from("aethex_applications")
      .insert({
        creator_id: creator.id,
        opportunity_id,
        cover_letter,
        status: "submitted",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit application" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function updateApplicationStatus(
  req: Request,
  applicationId: string,
  userId: string,
) {
  try {
    const body = await req.json();
    const { status, response_message } = body;

    // Get the application and verify user owns the opportunity
    const { data: application } = await supabase
      .from("aethex_applications")
      .select(
        `
        id,
        opportunity_id,
        aethex_opportunities(posted_by_id)
      `,
      )
      .eq("id", applicationId)
      .single();

    if (!application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    const opportunityData = Array.isArray(application.aethex_opportunities)
      ? application.aethex_opportunities[0]
      : application.aethex_opportunities;

    if (creator?.id !== opportunityData?.posted_by_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("aethex_applications")
      .update({
        status,
        response_message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update application" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function withdrawApplication(
  applicationId: string,
  userId: string,
) {
  try {
    // Verify user owns this application
    const { data: application } = await supabase
      .from("aethex_applications")
      .select("creator_id")
      .eq("id", applicationId)
      .single();

    if (!application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: creator } = await supabase
      .from("aethex_creators")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (creator?.id !== application.creator_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase
      .from("aethex_applications")
      .delete()
      .eq("id", applicationId);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return new Response(
      JSON.stringify({ error: "Failed to withdraw application" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
