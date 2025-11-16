import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export async function linkDevConnectAccount(req: Request, userId: string) {
  try {
    const body = (await req.json()) as {
      devconnect_username?: string;
      devconnect_profile_url?: string;
    };
    const { devconnect_username, devconnect_profile_url } = body;

    if (!devconnect_username) {
      return new Response(
        JSON.stringify({ error: "DevConnect username is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get creator ID for this user
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

    // Check if link already exists
    const { data: existing } = await supabase
      .from("aethex_devconnect_links")
      .select("id")
      .eq("aethex_creator_id", creator.id)
      .single();

    let result;
    let status = 201;

    if (existing) {
      // Update existing link
      const { data, error } = await supabase
        .from("aethex_devconnect_links")
        .update({
          devconnect_username,
          devconnect_profile_url:
            devconnect_profile_url ||
            `https://devconnect.com/${devconnect_username}`,
        })
        .eq("aethex_creator_id", creator.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
      status = 200;
    } else {
      // Create new link
      const { data, error } = await supabase
        .from("aethex_devconnect_links")
        .insert({
          aethex_creator_id: creator.id,
          devconnect_username,
          devconnect_profile_url:
            devconnect_profile_url ||
            `https://devconnect.com/${devconnect_username}`,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Update creator's devconnect_linked flag
    await supabase
      .from("aethex_creators")
      .update({ devconnect_linked: true })
      .eq("id", creator.id);

    return new Response(JSON.stringify(result), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error linking DevConnect account:", error);
    return new Response(
      JSON.stringify({ error: "Failed to link DevConnect account" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function getDevConnectLink(userId: string) {
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

    const { data, error } = await supabase
      .from("aethex_devconnect_links")
      .select("*")
      .eq("aethex_creator_id", creator.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return new Response(JSON.stringify({ data: data || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching DevConnect link:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch DevConnect link" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function unlinkDevConnectAccount(userId: string) {
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

    const { error } = await supabase
      .from("aethex_devconnect_links")
      .delete()
      .eq("aethex_creator_id", creator.id);

    if (error) throw error;

    // Update creator's devconnect_linked flag
    await supabase
      .from("aethex_creators")
      .update({ devconnect_linked: false })
      .eq("id", creator.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error unlinking DevConnect account:", error);
    return new Response(
      JSON.stringify({ error: "Failed to unlink DevConnect account" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function verifyDevConnectLink(req: Request, userId: string) {
  try {
    const body = await req.json();
    const { verification_code } = body;

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

    // In a real implementation, you would verify the code with DevConnect
    // For now, we'll just mark it as verified
    const { data, error } = await supabase
      .from("aethex_devconnect_links")
      .update({ verified: true })
      .eq("aethex_creator_id", creator.id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verifying DevConnect link:", error);
    return new Response(
      JSON.stringify({ error: "Failed to verify DevConnect link" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
