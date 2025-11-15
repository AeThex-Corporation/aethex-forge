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

    // Query the user_follows table for users this person is following
    const { data, error } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (error) {
      console.error("Error fetching following list:", error);
      return res.status(500).json({
        error: "Failed to fetch following list",
        details: (error as any).message,
      });
    }

    // Extract the IDs from the result
    const followingIds = (data || []).map((r: any) => r.following_id);

    return res.status(200).json({ data: followingIds });
  } catch (error) {
    console.error("Unexpected error in following endpoint:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: (error as any).message,
    });
  }
}
