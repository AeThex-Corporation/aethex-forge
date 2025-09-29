import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Admin-backed API (service role)
  try {
    app.get("/api/health", async (_req, res) => {
      try {
        const { error } = await adminSupabase
          .from("user_profiles")
          .select("count", { count: "exact", head: true });
        if (error)
          return res.status(500).json({ ok: false, error: error.message });
        return res.json({ ok: true });
      } catch (e: any) {
        return res
          .status(500)
          .json({ ok: false, error: e?.message || String(e) });
      }
    });

    app.get("/api/posts", async (req, res) => {
      const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
      try {
        const { data, error } = await adminSupabase
          .from("community_posts")
          .select(`*, user_profiles ( username, full_name, avatar_url )`)
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/user/:id/posts", async (req, res) => {
      const userId = req.params.id;
      try {
        const { data, error } = await adminSupabase
          .from("community_posts")
          .select("*")
          .eq("author_id", userId)
          .order("created_at", { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/posts", async (req, res) => {
      const payload = req.body || {};
      try {
        const { data, error } = await adminSupabase
          .from("community_posts")
          .insert({
            author_id: payload.author_id,
            title: payload.title,
            content: payload.content,
            category: payload.category,
            tags: payload.tags,
            is_published: payload.is_published ?? true,
          })
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/profile/ensure", async (req, res) => {
      const { id, profile } = req.body || {};
      console.log("[API] /api/profile/ensure called", { id, profile });
      if (!id) return res.status(400).json({ error: "missing id" });

      const tryUpsert = async (payload: any) => {
        const resp = await adminSupabase
          .from("user_profiles")
          .upsert(payload, { onConflict: "id" })
          .select()
          .single();
        return resp as any;
      };

      try {
        let username = profile?.username;
        let attempt = await tryUpsert({ id, ...profile, username });

        const normalizeError = (err: any) => {
          if (!err) return null;
          if (typeof err === "string") return { message: err };
          if (typeof err === "object" && Object.keys(err).length === 0)
            return null; // treat empty object as no error
          return err;
        };

        let error = normalizeError(attempt.error);
        if (error) {
          console.error("[API] ensure upsert error:", {
            message: (error as any).message,
            code: (error as any).code,
            details: (error as any).details,
            hint: (error as any).hint,
          });

          const message: string = (error as any).message || "";
          const code: string = (error as any).code || "";

          // Handle duplicate username
          if (
            code === "23505" ||
            message.includes("duplicate key") ||
            message.includes("username")
          ) {
            const suffix = Math.random().toString(36).slice(2, 6);
            const newUsername = `${String(username || "user").slice(0, 20)}_${suffix}`;
            console.log("[API] retrying with unique username", newUsername);
            attempt = await tryUpsert({
              id,
              ...profile,
              username: newUsername,
            });
            error = normalizeError(attempt.error);
          }
        }

        if (error) {
          // Possible foreign key violation: auth.users missing
          if (
            (error as any).code === "23503" ||
            (error as any).message?.includes("foreign key")
          ) {
            return res.status(400).json({
              error:
                "User does not exist in authentication system. Please sign out and sign back in, then retry onboarding.",
            });
          }
          return res.status(500).json({
            error:
              (error as any).message ||
              JSON.stringify(error) ||
              "Unknown error",
          });
        }

        return res.json(attempt.data || {});
      } catch (e: any) {
        console.error("[API] /api/profile/ensure exception:", e);
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/interests", async (req, res) => {
      const { user_id, interests } = req.body || {};
      if (!user_id || !Array.isArray(interests))
        return res.status(400).json({ error: "invalid payload" });
      try {
        await adminSupabase
          .from("user_interests")
          .delete()
          .eq("user_id", user_id);
        if (interests.length) {
          const rows = interests.map((interest: string) => ({
            user_id,
            interest,
          }));
          const { error } = await adminSupabase
            .from("user_interests")
            .insert(rows);
          if (error) return res.status(500).json({ error: error.message });
        }
        res.json({ ok: true });
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/featured-studios", async (_req, res) => {
      try {
        const { data, error } = await adminSupabase
          .from("featured_studios")
          .select("*")
          .order("rank", { ascending: true, nullsFirst: true } as any)
          .order("name", { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/featured-studios", async (req, res) => {
      const studios = (req.body?.studios || []) as any[];
      if (!Array.isArray(studios))
        return res.status(400).json({ error: "studios must be an array" });
      try {
        const rows = studios.map((s: any, idx: number) => ({
          id: s.id,
          name: String(s.name || "").trim(),
          tagline: s.tagline || null,
          metrics: s.metrics || null,
          specialties: Array.isArray(s.specialties) ? s.specialties : null,
          rank: Number.isFinite(s.rank) ? s.rank : idx,
        }));
        const { error } = await adminSupabase
          .from("featured_studios")
          .upsert(rows as any, { onConflict: "name" as any });
        if (error) return res.status(500).json({ error: error.message });
        res.json({ ok: true, count: rows.length });
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/achievements/award", async (req, res) => {
      const { user_id, achievement_names } = req.body || {};
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      const names: string[] =
        Array.isArray(achievement_names) && achievement_names.length
          ? achievement_names
          : ["Welcome to AeThex"];
      try {
        const { data: achievements, error: aErr } = await adminSupabase
          .from("achievements")
          .select("id, name")
          .in("name", names);
        if (aErr) return res.status(500).json({ error: aErr.message });
        const rows = (achievements || []).map((a: any) => ({
          user_id,
          achievement_id: a.id,
        }));
        if (!rows.length) return res.json({ ok: true, awarded: [] });
        const { error: iErr } = await adminSupabase
          .from("user_achievements")
          .upsert(rows, { onConflict: "user_id,achievement_id" as any });
        if (iErr && iErr.code !== "23505")
          return res.status(500).json({ error: iErr.message });
        return res.json({ ok: true, awarded: rows.length });
      } catch (e: any) {
        console.error("[API] achievements/award exception", e);
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/applications", async (req, res) => {
      const owner = String(req.query.owner || "");
      if (!owner) return res.status(400).json({ error: "owner required" });
      try {
        const { data, error } = await adminSupabase
          .from("project_applications")
          .select(`*, projects!inner(id, title, user_id)`)
          .eq("projects.user_id", owner)
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });
  } catch (e) {
    console.warn("Admin API not initialized:", e);
  }

  return app;
}
