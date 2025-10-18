import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";
import { randomUUID } from "crypto";

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
          message: error?.message || String(error),
          status: (error as any)?.status || null,
          code: (error as any)?.code || null,
          details: (error as any)?.details || null,
        });
        const errMsg =
          typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error);
        return res
          .status((error as any)?.status ?? 500)
          .json({ error: errMsg });
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

  app.post("/api/auth/check-verification", async (req, res) => {
    const { email } = (req.body || {}) as { email?: string };

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    if (!adminSupabase) {
      return res
        .status(500)
        .json({ error: "Supabase admin client unavailable" });
    }

    try {
      const targetEmail = String(email).trim().toLowerCase();

      // Prefer GoTrue Admin listUsers; fall back to pagination if email filter unsupported
      const admin = (adminSupabase as any)?.auth?.admin;
      if (!admin) {
        return res.status(500).json({ error: "Auth admin unavailable" });
      }

      let user: any = null;
      let listResp: any = null;
      try {
        listResp = await admin.listUsers({
          page: 1,
          perPage: 200,
          email: targetEmail,
        } as any);
      } catch (e) {
        listResp = null;
      }

      const initialUsers: any[] = (listResp?.data?.users as any[]) || [];
      user =
        initialUsers.find(
          (u: any) => String(u?.email || "").toLowerCase() === targetEmail,
        ) || null;

      if (!user) {
        // Pagination fallback (limited scan)
        for (let page = 1; page <= 5 && !user; page++) {
          const resp = await admin
            .listUsers({ page, perPage: 200 } as any)
            .catch(() => null);
          const users = (resp?.data?.users as any[]) || [];
          user =
            users.find(
              (u: any) => String(u?.email || "").toLowerCase() === targetEmail,
            ) || null;
        }
      }

      if (!user) {
        return res.json({ verified: false, user: null, reason: "not_found" });
      }

      const verified = Boolean(user?.email_confirmed_at || user?.confirmed_at);

      if (verified) {
        try {
          const { data: ach, error: aErr } = await adminSupabase
            .from("achievements")
            .select("id")
            .eq("name", "Founding Member")
            .maybeSingle();

          if (!aErr && ach?.id) {
            const { error: uaErr } = await adminSupabase
              .from("user_achievements")
              .upsert(
                { user_id: user.id, achievement_id: ach.id },
                { onConflict: "user_id,achievement_id" as any },
              );
            if (uaErr) {
              console.warn("Failed to award Founding Member:", uaErr);
            }
          }
        } catch (awardErr) {
          console.warn("Awarding achievement on verification failed", awardErr);
        }
      }

      return res.json({ verified, user });
    } catch (e: any) {
      console.error("[API] check verification exception", e);
      return res.status(500).json({ error: e?.message || String(e) });
    }
  });

  // Storage administration endpoints (service role)
  app.post("/api/storage/ensure-buckets", async (_req, res) => {
    if (!adminSupabase) {
      return res
        .status(500)
        .json({ error: "Supabase admin client unavailable" });
    }
    try {
      const targets = [
        { name: "avatars", public: true },
        { name: "banners", public: true },
        { name: "post_media", public: true },
      ];
      const { data: buckets } = await (
        adminSupabase as any
      ).storage.listBuckets();
      const existing = new Set((buckets || []).map((b: any) => b.name));
      const created: string[] = [];
      for (const t of targets) {
        if (!existing.has(t.name)) {
          const { error } = await (adminSupabase as any).storage.createBucket(
            t.name,
            { public: t.public },
          );
          if (error) {
            console.warn("Failed to create bucket", t.name, error);
          } else {
            created.push(t.name);
          }
        }
      }
      return res.json({ ok: true, created });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || String(e) });
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

    // Invites API
    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      process.env.SITE_URL ||
      "https://aethex.biz";

    const safeEmail = (v?: string | null) => (v || "").trim().toLowerCase();

    const accrue = async (
      userId: string,
      kind: "xp" | "loyalty" | "reputation",
      amount: number,
      type: string,
      meta?: any,
    ) => {
      const amt = Math.max(0, Math.floor(amount));
      try {
        await adminSupabase.from("reward_events").insert({
          user_id: userId,
          type,
          points_kind: kind,
          amount: amt,
          metadata: meta || null,
        });
      } catch {}

      const col =
        kind === "xp"
          ? "total_xp"
          : kind === "loyalty"
            ? "loyalty_points"
            : "reputation_score";
      const { data: row } = await adminSupabase
        .from("user_profiles")
        .select(`id, ${col}, level`)
        .eq("id", userId)
        .maybeSingle();
      const current = Number((row as any)?.[col] || 0);
      const updates: any = { [col]: current + amt };
      if (col === "total_xp") {
        const total = current + amt;
        updates.level = Math.max(1, Math.floor(total / 1000) + 1);
      }
      await adminSupabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId);
    };

    app.post("/api/invites", async (req, res) => {
      const { inviter_id, invitee_email, message } = (req.body || {}) as {
        inviter_id?: string;
        invitee_email?: string;
        message?: string | null;
      };
      if (!inviter_id || !invitee_email) {
        return res
          .status(400)
          .json({ error: "inviter_id and invitee_email are required" });
      }
      const email = safeEmail(invitee_email);
      const token = randomUUID();
      try {
        const { data: inviterProfile } = await adminSupabase
          .from("user_profiles")
          .select("full_name, username")
          .eq("id", inviter_id)
          .maybeSingle();
        const inviterName =
          (inviterProfile as any)?.full_name ||
          (inviterProfile as any)?.username ||
          "An AeThex member";

        const { data, error } = await adminSupabase
          .from("invites")
          .insert({
            inviter_id,
            invitee_email: email,
            token,
            message: message || null,
            status: "pending",
          })
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });

        const inviteUrl = `${baseUrl}/login?invite=${encodeURIComponent(token)}`;

        if (emailService.isConfigured) {
          try {
            await emailService.sendInviteEmail({
              to: email,
              inviteUrl,
              inviterName,
              message: message || null,
            });
          } catch (e: any) {
            console.warn("Failed to send invite email", e?.message || e);
          }
        }

        await accrue(inviter_id, "loyalty", 5, "invite_sent", {
          invitee: email,
        });
        try {
          await adminSupabase.from("notifications").insert({
            user_id: inviter_id,
            type: "info",
            title: "Invite sent",
            message: `Invitation sent to ${email}`,
          });
        } catch {}

        return res.json({ ok: true, invite: data, inviteUrl, token });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/invites", async (req, res) => {
      const inviter = String(req.query.inviter_id || "");
      if (!inviter)
        return res.status(400).json({ error: "inviter_id required" });
      try {
        const { data, error } = await adminSupabase
          .from("invites")
          .select("*")
          .eq("inviter_id", inviter)
          .order("created_at", { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data || []);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/invites/accept", async (req, res) => {
      const { token, acceptor_id } = (req.body || {}) as {
        token?: string;
        acceptor_id?: string;
      };
      if (!token || !acceptor_id) {
        return res
          .status(400)
          .json({ error: "token and acceptor_id required" });
      }
      try {
        const { data: invite, error } = await adminSupabase
          .from("invites")
          .select("*")
          .eq("token", token)
          .eq("status", "pending")
          .maybeSingle();
        if (error) return res.status(500).json({ error: error.message });
        if (!invite) return res.status(404).json({ error: "invalid_invite" });

        const now = new Date().toISOString();
        const { error: upErr } = await adminSupabase
          .from("invites")
          .update({
            status: "accepted",
            accepted_by: acceptor_id,
            accepted_at: now,
          })
          .eq("id", (invite as any).id);
        if (upErr) return res.status(500).json({ error: upErr.message });

        const inviterId = (invite as any).inviter_id as string;
        if (inviterId && inviterId !== acceptor_id) {
          await adminSupabase
            .from("user_connections")
            .upsert({ user_id: inviterId, connection_id: acceptor_id } as any)
            .catch(() => undefined);
          await adminSupabase
            .from("user_connections")
            .upsert({ user_id: acceptor_id, connection_id: inviterId } as any)
            .catch(() => undefined);
        }

        if (inviterId) {
          await accrue(inviterId, "xp", 100, "invite_accepted", { token });
          await accrue(inviterId, "loyalty", 50, "invite_accepted", { token });
          await accrue(inviterId, "reputation", 2, "invite_accepted", {
            token,
          });
          try {
            await adminSupabase.from("notifications").insert({
              user_id: inviterId,
              type: "success",
              title: "Invite accepted",
              message: "Your invitation was accepted. You're now connected.",
            });
          } catch {}
        }
        await accrue(acceptor_id, "xp", 50, "invite_accepted", { token });
        await accrue(acceptor_id, "reputation", 1, "invite_accepted", {
          token,
        });
        try {
          await adminSupabase.from("notifications").insert({
            user_id: acceptor_id,
            type: "success",
            title: "Connected",
            message: "Connection established via invitation.",
          });
        } catch {}

        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Follow/unfollow with notifications
    app.post("/api/social/follow", async (req, res) => {
      const { follower_id, following_id } = (req.body || {}) as {
        follower_id?: string;
        following_id?: string;
      };
      if (!follower_id || !following_id)
        return res
          .status(400)
          .json({ error: "follower_id and following_id required" });
      try {
        await adminSupabase
          .from("user_follows")
          .upsert({ follower_id, following_id } as any, {
            onConflict: "follower_id,following_id" as any,
          });
        await accrue(follower_id, "loyalty", 5, "follow_user", {
          following_id,
        });
        const { data: follower } = await adminSupabase
          .from("user_profiles")
          .select("full_name, username")
          .eq("id", follower_id)
          .maybeSingle();
        const followerName =
          (follower as any)?.full_name ||
          (follower as any)?.username ||
          "Someone";
        await adminSupabase.from("notifications").insert({
          user_id: following_id,
          type: "info",
          title: "New follower",
          message: `${followerName} started following you`,
        });
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/social/unfollow", async (req, res) => {
      const { follower_id, following_id } = (req.body || {}) as {
        follower_id?: string;
        following_id?: string;
      };
      if (!follower_id || !following_id)
        return res
          .status(400)
          .json({ error: "follower_id and following_id required" });
      try {
        await adminSupabase
          .from("user_follows")
          .delete()
          .eq("follower_id", follower_id)
          .eq("following_id", following_id);
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Community post likes
    app.post("/api/community/posts/:id/like", async (req, res) => {
      const postId = req.params.id;
      const { user_id } = (req.body || {}) as { user_id?: string };
      if (!postId || !user_id)
        return res.status(400).json({ error: "post id and user_id required" });
      try {
        const { error: likeErr } = await adminSupabase
          .from("community_post_likes")
          .upsert({ post_id: postId, user_id } as any, {
            onConflict: "post_id,user_id" as any,
          });
        if (likeErr) return res.status(500).json({ error: likeErr.message });
        const { data: c } = await adminSupabase
          .from("community_post_likes")
          .select("post_id", { count: "exact", head: true })
          .eq("post_id", postId);
        const count = (c as any)?.length
          ? (c as any).length
          : (c as any)?.count || null;
        if (typeof count === "number") {
          await adminSupabase
            .from("community_posts")
            .update({ likes_count: count })
            .eq("id", postId);
        }
        return res.json({
          ok: true,
          likes: typeof count === "number" ? count : undefined,
        });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/community/posts/:id/unlike", async (req, res) => {
      const postId = req.params.id;
      const { user_id } = (req.body || {}) as { user_id?: string };
      if (!postId || !user_id)
        return res.status(400).json({ error: "post id and user_id required" });
      try {
        await adminSupabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user_id);
        const { data: c } = await adminSupabase
          .from("community_post_likes")
          .select("post_id", { count: "exact", head: true })
          .eq("post_id", postId);
        const count = (c as any)?.length
          ? (c as any).length
          : (c as any)?.count || null;
        if (typeof count === "number") {
          await adminSupabase
            .from("community_posts")
            .update({ likes_count: count })
            .eq("id", postId);
        }
        return res.json({
          ok: true,
          likes: typeof count === "number" ? count : undefined,
        });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Community post comments
    app.get("/api/community/posts/:id/comments", async (req, res) => {
      const postId = req.params.id;
      try {
        const { data, error } = await adminSupabase
          .from("community_comments")
          .select(
            "*, user_profiles:user_id ( id, full_name, username, avatar_url )",
          )
          .eq("post_id", postId)
          .order("created_at", { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/community/posts/:id/comments", async (req, res) => {
      const postId = req.params.id;
      const { user_id, content } = (req.body || {}) as {
        user_id?: string;
        content?: string;
      };
      if (!user_id || !content)
        return res.status(400).json({ error: "user_id and content required" });
      try {
        const { data, error } = await adminSupabase
          .from("community_comments")
          .insert({ post_id: postId, user_id, content } as any)
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });
        const { data: agg } = await adminSupabase
          .from("community_comments")
          .select("post_id", { count: "exact", head: true })
          .eq("post_id", postId);
        const count = (agg as any)?.count || null;
        if (typeof count === "number") {
          await adminSupabase
            .from("community_posts")
            .update({ comments_count: count })
            .eq("id", postId);
        }
        res.json(data);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Endorse with notification
    app.post("/api/social/endorse", async (req, res) => {
      const { endorser_id, endorsed_id, skill } = (req.body || {}) as {
        endorser_id?: string;
        endorsed_id?: string;
        skill?: string;
      };
      if (!endorser_id || !endorsed_id || !skill)
        return res
          .status(400)
          .json({ error: "endorser_id, endorsed_id, skill required" });
      try {
        await adminSupabase
          .from("endorsements")
          .insert({ endorser_id, endorsed_id, skill } as any);
        await accrue(endorsed_id, "reputation", 2, "endorsement_received", {
          skill,
          from: endorser_id,
        });
        const { data: endorser } = await adminSupabase
          .from("user_profiles")
          .select("full_name, username")
          .eq("id", endorser_id)
          .maybeSingle();
        const endorserName =
          (endorser as any)?.full_name ||
          (endorser as any)?.username ||
          "Someone";
        await adminSupabase.from("notifications").insert({
          user_id: endorsed_id,
          type: "success",
          title: "New endorsement",
          message: `${endorserName} endorsed you for ${skill}`,
        });
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Activity bus: publish event and fanout notifications
    app.post("/api/activity/publish", async (req, res) => {
      const {
        actor_id,
        verb,
        object_type,
        object_id,
        target_user_ids,
        target_team_id,
        target_project_id,
        metadata,
      } = (req.body || {}) as any;
      if (!actor_id || !verb || !object_type) {
        return res
          .status(400)
          .json({ error: "actor_id, verb, object_type required" });
      }
      try {
        const { data: eventRow, error: evErr } = await adminSupabase
          .from("activity_events")
          .insert({
            actor_id,
            verb,
            object_type,
            object_id: object_id || null,
            target_id: target_team_id || target_project_id || null,
            metadata: metadata || null,
          } as any)
          .select()
          .single();
        if (evErr) return res.status(500).json({ error: evErr.message });

        const notify = async (
          userId: string,
          title: string,
          message?: string,
        ) => {
          await adminSupabase.from("notifications").insert({
            user_id: userId,
            type: "info",
            title,
            message: message || null,
          });
        };

        // Notify explicit targets
        if (Array.isArray(target_user_ids) && target_user_ids.length) {
          for (const uid of target_user_ids) {
            await notify(
              uid,
              `${verb} · ${object_type}`,
              (metadata && metadata.summary) || null,
            );
          }
        }

        // Notify team members if provided
        if (target_team_id) {
          const { data: members } = await adminSupabase
            .from("team_memberships")
            .select("user_id")
            .eq("team_id", target_team_id);
          for (const m of members || []) {
            await notify(
              (m as any).user_id,
              `${verb} · ${object_type}`,
              (metadata && metadata.summary) || null,
            );
          }
        }

        // Notify project members if provided
        if (target_project_id) {
          const { data: members } = await adminSupabase
            .from("project_members")
            .select("user_id")
            .eq("project_id", target_project_id);
          for (const m of members || []) {
            await notify(
              (m as any).user_id,
              `${verb} · ${object_type}`,
              (metadata && metadata.summary) || null,
            );
          }
        }

        return res.json({ ok: true, event: eventRow });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/rewards/apply", async (req, res) => {
      const { user_id, action, amount } = (req.body || {}) as {
        user_id?: string;
        action?: string;
        amount?: number | null;
      };
      if (!user_id || !action) {
        return res.status(400).json({ error: "user_id and action required" });
      }
      try {
        const actionKey = String(action);
        switch (actionKey) {
          case "post_created":
            await accrue(user_id, "xp", amount ?? 25, actionKey);
            await accrue(user_id, "loyalty", 5, actionKey);
            break;
          case "follow_user":
            await accrue(user_id, "loyalty", 5, actionKey);
            break;
          case "endorsement_received":
            await accrue(user_id, "reputation", amount ?? 2, actionKey);
            break;
          case "daily_login":
            await accrue(user_id, "xp", amount ?? 10, actionKey);
            await accrue(user_id, "loyalty", 2, actionKey);
            break;
          default:
            await accrue(user_id, "xp", Math.max(0, amount ?? 0), actionKey);
            break;
        }
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });
  } catch (e) {
    console.warn("Admin API not initialized:", e);
  }

  return app;
}
