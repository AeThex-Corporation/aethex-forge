import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role
let supabase: any = null;

try {
  supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE || "",
  );
} catch (e) {
  console.error("Failed to initialize Supabase client:", e);
}

interface RoleMapping {
  id: string;
  arm: string;
  user_type: string;
  discord_role_name: string;
  discord_role_id?: string;
  server_id?: string;
  created_at: string;
  updated_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Validate Supabase is initialized
    if (!supabase) {
      console.error("Supabase client not initialized");
      return res.status(500).json({
        error: "Server configuration error: Missing Supabase credentials",
      });
    }

    // GET - Fetch all role mappings
    if (req.method === "GET") {
      try {
        const { data, error } = await supabase
          .from("discord_role_mappings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({
            error: `Failed to fetch role mappings: ${error.message}`,
          });
        }

        return res.status(200).json(data || []);
      } catch (queryErr: any) {
        console.error("Query error:", queryErr);
        return res.status(500).json({
          error: `Database query error: ${queryErr?.message || "Unknown error"}`,
        });
      }
    }

    // POST - Create new role mapping
    if (req.method === "POST") {
      try {
        const { arm, discord_role, discord_role_name, server_id, user_type } =
          req.body;

        // Support both discord_role and discord_role_name for compatibility
        const roleName = discord_role_name || discord_role;

        if (!arm || !roleName) {
          return res.status(400).json({
            error: "arm and discord_role (or discord_role_name) are required",
          });
        }

        const { data, error } = await supabase
          .from("discord_role_mappings")
          .insert({
            arm,
            user_type: user_type || "community_member",
            discord_role_name: roleName,
            server_id: server_id || null,
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({
            error: `Failed to create mapping: ${error.message}`,
          });
        }

        return res.status(201).json(data);
      } catch (insertErr: any) {
        console.error("Insert error:", insertErr);
        return res.status(500).json({
          error: `Insert error: ${insertErr?.message || "Unknown error"}`,
        });
      }
    }

    // PUT - Update role mapping
    if (req.method === "PUT") {
      try {
        const {
          id,
          arm,
          discord_role,
          discord_role_name,
          server_id,
          user_type,
        } = req.body;

        if (!id) {
          return res.status(400).json({ error: "id is required" });
        }

        const updateData: any = {};
        if (arm) updateData.arm = arm;
        const roleName = discord_role_name || discord_role;
        if (roleName) updateData.discord_role_name = roleName;
        if (server_id !== undefined) updateData.server_id = server_id;
        if (user_type) updateData.user_type = user_type;

        const { data, error } = await supabase
          .from("discord_role_mappings")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({
            error: `Failed to update mapping: ${error.message}`,
          });
        }

        return res.status(200).json(data);
      } catch (updateErr: any) {
        console.error("Update error:", updateErr);
        return res.status(500).json({
          error: `Update error: ${updateErr?.message || "Unknown error"}`,
        });
      }
    }

    // DELETE - Delete role mapping
    if (req.method === "DELETE") {
      try {
        const { id } = req.query;

        if (!id) {
          return res
            .status(400)
            .json({ error: "id query parameter is required" });
        }

        const { error } = await supabase
          .from("discord_role_mappings")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({
            error: `Failed to delete mapping: ${error.message}`,
          });
        }

        return res.status(200).json({ success: true });
      } catch (deleteErr: any) {
        console.error("Delete error:", deleteErr);
        return res.status(500).json({
          error: `Delete error: ${deleteErr?.message || "Unknown error"}`,
        });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("API error:", error);
    // Ensure we always return JSON, never HTML
    return res.status(500).json({
      error: error?.message || "Internal server error",
      type: "api_error",
    });
  }
}
