import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";

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

  app.post("/api/auth/send-verification-email", async (req, res) => {
    const { email, redirectTo, fullName } = (req.body || {}) as {
      email?: string;
      redirectTo?: string;
      fullName?: string | null;
    };

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    if (!adminSupabase?.auth?.admin) {
      return res
        .status(500)
        .json({ error: "Supabase admin client unavailable" });
    }

    try {
      const fallbackRedirect =
        process.env.EMAIL_VERIFY_REDIRECT ??
        process.env.PUBLIC_BASE_URL ??
        process.env.SITE_URL ??
        "https://aethex.biz/login";

      const redirectUrl =
        typeof redirectTo === "string" && redirectTo.startsWith("http")
          ? redirectTo
          : fallbackRedirect;

      const { data, error } = await adminSupabase.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: redirectUrl,
        },
      } as any);

      if (error) {
        console.error("[API] generateLink error:", {
          message: error.message,
          status: error.status,
          code: (error as any)?.code || null,
          details: (error as any)?.details || null,
        });
        return res.status(error.status ?? 500).json({ error: error.message });
      }

      const actionLink =
        (data as any)?.properties?.action_link ??
        (data as any)?.properties?.verification_link ??
        null;

      if (!actionLink) {
        return res
          .status(500)
          .json({ error: "Failed to generate verification link" });
      }

      const displayName =
        (data as any)?.user?.user_metadata?.full_name ?? fullName ?? null;

      if (!emailService.isConfigured) {
        return res.json({
          sent: false,
          verificationUrl: actionLink,
          message:
            "Email service not configured. Provide RESEND_API_KEY to enable outbound email.",
        });
      }

      await emailService.sendVerificationEmail({
        to: email,
        verificationUrl: actionLink,
        fullName: displayName,
      });

      return res.json({ sent: true, verificationUrl: actionLink });
    } catch (error: any) {
      console.error("[API] send verification email failed", error);
      return res
        .status(500)
        .json({ error: error?.message || "Unexpected error" });
    }
  });

  // Admin-backed API (service role)
  try {
    const ownerEmail = (
      process.env.AETHEX_OWNER_EMAIL || "mrpiglr@gmail.com"
    ).toLowerCase();
    const isTableMissing = (err: any) => {
      const code = err?.code;
      const message = String(err?.message || err?.hint || err?.details || "");
      return (
        code === "42P01" ||
        message.includes("relation") ||
        message.includes("does not exist")
      );
    };

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

    // Blog endpoints (Supabase-backed)
    app.get("/api/blog", async (req, res) => {
      const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 12));
      const category = String(req.query.category || "").trim();
      try {
        let query = adminSupabase
          .from("blog_posts")
          .select(
            "id, slug, title, excerpt, author, date, read_time, category, image, likes, comments, published_at",
          )
          .order("published_at", { ascending: false, nullsLast: true } as any)
          .limit(limit);
        if (category) query = query.eq("category", category);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/blog/:slug", async (req, res) => {
      const slug = String(req.params.slug || "");
      if (!slug) return res.status(400).json({ error: "missing slug" });
      try {
        const { data, error } = await adminSupabase
          .from("blog_posts")
          .select(
            "id, slug, title, excerpt, author, date, read_time, category, image, body_html, published_at",
          )
          .eq("slug", slug)
          .single();
        if (error) return res.status(404).json({ error: error.message });
        res.json(data || null);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/blog", async (req, res) => {
      const p = req.body || {};
      const row = {
        slug: String(p.slug || "").trim(),
        title: String(p.title || "").trim(),
        excerpt: p.excerpt || null,
        author: p.author || null,
        date: p.date || null,
        read_time: p.read_time || null,
        category: p.category || null,
        image: p.image || null,
        likes: Number.isFinite(p.likes) ? p.likes : 0,
        comments: Number.isFinite(p.comments) ? p.comments : 0,
        body_html: p.body_html || null,
        published_at: p.published_at || new Date().toISOString(),
      } as any;
      if (!row.slug || !row.title)
        return res.status(400).json({ error: "slug and title required" });
      try {
        const { data, error } = await adminSupabase
          .from("blog_posts")
          .upsert(row, { onConflict: "slug" as any })
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || row);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.delete("/api/blog/:slug", async (req, res) => {
      const slug = String(req.params.slug || "");
      if (!slug) return res.status(400).json({ error: "missing slug" });
      try {
        const { error } = await adminSupabase
          .from("blog_posts")
          .delete()
          .eq("slug", slug);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ ok: true });
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
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

    app.get("/api/opportunities/applications", async (req, res) => {
      const requester = String(req.query.email || "").toLowerCase();
      if (!requester || requester !== ownerEmail) {
        return res.status(403).json({ error: "forbidden" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("applications")
          .select("*")
          .order("submitted_at", { ascending: false })
          .limit(200);
        if (error) {
          if (isTableMissing(error)) {
            return res.json([]);
          }
          return res.status(500).json({ error: error.message });
        }
        return res.json(data || []);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });
  } catch (e) {
    console.warn("Admin API not initialized:", e);
  }

  return app;
}
