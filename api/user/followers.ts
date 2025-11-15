export const config = {
  runtime: "nodejs",
};

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req: any, res: any) {
  try {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    // Query the user_follows table for users following this person
    const { data, error } = await supabase
      .from("user_follows")
      .select("follower_id")
      .eq("following_id", userId);

    if (error) {
      console.error("Error fetching followers list:", error);
      return res.status(500).json({
        error: "Failed to fetch followers list",
        details: (error as any).message,
      });
    }

    // Extract the IDs from the result
    const followerIds = (data || []).map((r: any) => r.follower_id);

    return res.status(200).json({ data: followerIds });
  } catch (error) {
    console.error("Unexpected error in followers endpoint:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: (error as any).message,
    });
  }
}
