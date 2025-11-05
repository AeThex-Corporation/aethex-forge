import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";
import { randomUUID, createHash, createVerify } from "crypto";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Capture raw body for Discord signature verification
  app.use((req, res, next) => {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk.toString('utf8');
    });
    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Discord Interactions Endpoint (for Activity verification)
  app.post("/api/discord/interactions", (req, res) => {
    const signature = req.get("x-signature-ed25519");
    const timestamp = req.get("x-signature-timestamp");
    const body = req.rawBody || JSON.stringify(req.body);

    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("[Discord] DISCORD_PUBLIC_KEY not configured");
      return res.status(401).json({ error: "Public key not configured" });
    }

    if (!signature || !timestamp) {
      return res.status(401).json({ error: "Missing signature or timestamp" });
    }

    // Verify request signature
    try {
      const verifier = createVerify("ed25519");
      verifier.update(`${timestamp}${body}`);
      const isValid = verifier.verify(publicKey, Buffer.from(signature, "hex"));

      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    } catch (e: any) {
      console.error("[Discord] Signature verification failed:", e?.message);
      return res.status(401).json({ error: "Signature verification failed" });
    }

    const interaction = req.body;

    // Handle PING interaction (Discord Activity verification)
    if (interaction.type === 1) {
      return res.json({ type: 1 });
    }

    // Handle other interaction types
    if (interaction.type === 2 || interaction.type === 3 || interaction.type === 4 || interaction.type === 5) {
      // For now, acknowledge other interactions
      return res.json({ type: 4, data: { content: "Activity received your interaction" } });
    }

    return res.status(400).json({ error: "Unknown interaction type" });
  });

  // DevConnect REST proxy (GET only)
  app.get("/api/devconnect/rest/:table", async (req, res) => {
    try {
      const base = process.env.DEVCONNECT_URL;
      const key = process.env.DEVCONNECT_ANON_KEY;
      if (!base || !key)
        return res.status(500).json({ error: "DevConnect env not set" });
      const table = String(req.params.table || "").replace(
        /[^a-zA-Z0-9_]/g,
        "",
      );
      const qs = req.url.includes("?")
        ? req.url.substring(req.url.indexOf("?"))
        : "";
      const url = `${base}/rest/v1/${table}${qs}`;
      const r = await fetch(url, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      });
      const text = await r.text();
      if (!r.ok) return res.status(r.status).send(text);
      res.setHeader(
        "content-type",
        r.headers.get("content-type") || "application/json",
      );
      return res.status(200).send(text);
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || String(e) });
    }
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
        console.warn(
          "[API] Email service not configured. SMTP env vars missing:",
          {
            hasHost: Boolean(process.env.SMTP_HOST),
            hasUser: Boolean(process.env.SMTP_USER),
            hasPassword: Boolean(process.env.SMTP_PASSWORD),
          },
        );
        return res.json({
          sent: false,
          verificationUrl: actionLink,
          message:
            "Email service not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD to enable email sending.",
        });
      }

      try {
        await emailService.sendVerificationEmail({
          to: email,
          verificationUrl: actionLink,
          fullName: displayName,
        });
        console.log("[API] Verification email sent successfully to:", email);
        return res.json({ sent: true, verificationUrl: actionLink });
      } catch (emailError: any) {
        console.error("[API] sendVerificationEmail threw error:", {
          message: emailError?.message || String(emailError),
          code: emailError?.code || null,
          response: emailError?.response || null,
        });
        // Return with manual link as fallback even if email fails
        return res.status(200).json({
          sent: false,
          verificationUrl: actionLink,
          message: `Email delivery failed: ${emailError?.message || "SMTP error"}. Use manual link to verify.`,
        });
      }
    } catch (error: any) {
      console.error("[API] send verification email failed", error);
      return res
        .status(500)
        .json({ error: error?.message || "Unexpected error" });
    }
  });

  // Org domain magic-link sender (Aethex)
  app.post("/api/auth/send-org-link", async (req, res) => {
    try {
      const { email, redirectTo } = (req.body || {}) as {
        email?: string;
        redirectTo?: string;
      };
      const target = String(email || "")
        .trim()
        .toLowerCase();
      if (!target) return res.status(400).json({ error: "email is required" });
      const allowed = /@aethex\.dev$/i.test(target);
      if (!allowed)
        return res.status(403).json({ error: "domain not allowed" });

      if (!adminSupabase?.auth?.admin) {
        return res.status(500).json({ error: "Supabase admin unavailable" });
      }

      const fallbackRedirect =
        process.env.EMAIL_VERIFY_REDIRECT ??
        process.env.PUBLIC_BASE_URL ??
        process.env.SITE_URL ??
        "https://aethex.dev";

      const toUrl =
        typeof redirectTo === "string" && redirectTo.startsWith("http")
          ? redirectTo
          : fallbackRedirect;

      const { data, error } = await adminSupabase.auth.admin.generateLink({
        type: "magiclink" as any,
        email: target,
        options: { redirectTo: toUrl },
      } as any);

      if (error) {
        return res.status(500).json({ error: error.message || String(error) });
      }

      const actionLink =
        (data as any)?.properties?.action_link ??
        (data as any)?.properties?.verification_link ??
        null;

      if (!actionLink) {
        return res.status(500).json({ error: "Failed to generate magic link" });
      }

      if (!emailService.isConfigured) {
        return res.json({ sent: false, verificationUrl: actionLink });
      }

      await emailService.sendVerificationEmail({
        to: target,
        verificationUrl: actionLink,
        fullName: null,
      });

      return res.json({ sent: true });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || String(e) });
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

    // Roblox OAuth: start (build authorize URL with PKCE and redirect)
    app.get("/api/roblox/oauth/start", (req, res) => {
      try {
        const clientId = process.env.ROBLOX_OAUTH_CLIENT_ID;
        if (!clientId)
          return res.status(500).json({ error: "Roblox OAuth not configured" });

        const baseSite =
          process.env.PUBLIC_BASE_URL ||
          process.env.SITE_URL ||
          "https://aethex.dev";
        const redirectUri =
          typeof req.query.redirect_uri === "string" &&
          req.query.redirect_uri.startsWith("http")
            ? String(req.query.redirect_uri)
            : process.env.ROBLOX_OAUTH_REDIRECT_URI ||
              `${baseSite}/roblox-callback`;

        const scope = String(
          req.query.scope || process.env.ROBLOX_OAUTH_SCOPE || "openid",
        );
        const state = String(req.query.state || randomUUID());

        // PKCE
        const codeVerifier = Buffer.from(randomUUID() + randomUUID())
          .toString("base64url")
          .slice(0, 64);
        const codeChallenge = createHash("sha256")
          .update(codeVerifier)
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/g, "");

        const params = new URLSearchParams({
          client_id: clientId,
          response_type: "code",
          redirect_uri: redirectUri,
          scope,
          state,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        });
        const authorizeUrl = `https://apis.roblox.com/oauth/authorize?${params.toString()}`;

        // set short-lived cookies for verifier/state (for callback validation)
        const secure =
          req.secure ||
          req.get("x-forwarded-proto") === "https" ||
          process.env.NODE_ENV === "production";
        res.cookie("roblox_oauth_state", state, {
          httpOnly: true,
          sameSite: "lax",
          secure,
          maxAge: 10 * 60 * 1000,
          path: "/",
        });
        res.cookie("roblox_oauth_code_verifier", codeVerifier, {
          httpOnly: true,
          sameSite: "lax",
          secure,
          maxAge: 10 * 60 * 1000,
          path: "/",
        });

        if (String(req.query.json || "").toLowerCase() === "true") {
          return res.json({ authorizeUrl, state });
        }
        return res.redirect(302, authorizeUrl);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Discord OAuth: callback handler
    app.post("/api/discord/oauth/callback", async (req, res) => {
      const { code, state } = (req.body || {}) as {
        code?: string;
        state?: string;
      };

      if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
      }

      try {
        const clientId = process.env.VITE_DISCORD_CLIENT_ID || "578971245454950421";
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const redirectUri =
          process.env.DISCORD_REDIRECT_URI ||
          `${process.env.PUBLIC_BASE_URL || process.env.SITE_URL || "http://localhost:5173"}/discord/callback`;

        if (!clientSecret) {
          console.warn(
            "[Discord OAuth] DISCORD_CLIENT_SECRET not configured, skipping token exchange",
          );
          return res.json({
            ok: true,
            access_token: null,
            message: "Discord auth configured for Activity context only",
          });
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.text();
          console.error("[Discord OAuth] Token exchange failed:", {
            status: tokenResponse.status,
            error: errorData,
          });
          return res.status(400).json({
            error: "Failed to exchange authorization code",
          });
        }

        const tokenData = await tokenResponse.json();

        // Get Discord user information
        const userResponse = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userResponse.ok) {
          return res.status(400).json({
            error: "Failed to retrieve Discord user information",
          });
        }

        const discordUser = await userResponse.json();

        // Optionally: create or update Supabase user linked to Discord account
        if (adminSupabase && discordUser.id) {
          try {
            // Check if user with Discord ID exists
            const { data: existingUser } = await adminSupabase
              .from("user_profiles")
              .select("id")
              .eq("discord_id", discordUser.id)
              .maybeSingle();

            if (!existingUser && discordUser.email) {
              // Attempt to find by email
              const { data: userByEmail } = await adminSupabase
                .from("user_profiles")
                .select("id")
                .eq("email", discordUser.email)
                .maybeSingle();

              if (userByEmail) {
                // Update existing user with Discord ID
                await adminSupabase
                  .from("user_profiles")
                  .update({ discord_id: discordUser.id })
                  .eq("id", userByEmail.id);
              }
            }
          } catch (err) {
            console.warn("[Discord OAuth] Failed to link Discord ID:", err);
          }
        }

        return res.json({
          ok: true,
          access_token: tokenData.access_token,
          discord_user: {
            id: discordUser.id,
            username: discordUser.username,
            avatar: discordUser.avatar,
            email: discordUser.email,
          },
        });
      } catch (e: any) {
        console.error("[Discord OAuth] Error:", e);
        return res.status(500).json({
          error: e?.message || "Internal server error during Discord OAuth",
        });
      }
    });

    // Site settings (admin-managed)
    app.get("/api/site-settings", async (req, res) => {
      try {
        const key = String(req.query.key || "").trim();
        if (key) {
          try {
            const { data, error } = await adminSupabase
              .from("site_settings")
              .select("value")
              .eq("key", key)
              .maybeSingle();
            if (error) {
              if (isTableMissing(error)) return res.json({});
              return res.status(500).json({ error: error.message });
            }
            return res.json((data as any)?.value || {});
          } catch (e: any) {
            return res.status(500).json({ error: e?.message || String(e) });
          }
        }
        const { data, error } = await adminSupabase
          .from("site_settings")
          .select("key, value");
        if (error) {
          if (isTableMissing(error)) return res.json({});
          return res.status(500).json({ error: error.message });
        }
        const map: Record<string, any> = {};
        for (const row of data || [])
          map[(row as any).key] = (row as any).value;
        return res.json(map);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/site-settings", async (req, res) => {
      try {
        const { key, value } = (req.body || {}) as {
          key?: string;
          value?: any;
        };
        if (!key || typeof key !== "string") {
          return res.status(400).json({ error: "key required" });
        }
        const payload = { key, value: value ?? {} } as any;
        const { error } = await adminSupabase
          .from("site_settings")
          .upsert(payload, { onConflict: "key" as any });
        if (error) {
          if (isTableMissing(error))
            return res
              .status(400)
              .json({ error: "site_settings table missing" });
          return res.status(500).json({ error: error.message });
        }
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

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

      // Validation
      if (!payload.author_id) {
        return res.status(400).json({ error: "author_id is required" });
      }
      if (
        !payload.title ||
        typeof payload.title !== "string" ||
        !payload.title.trim()
      ) {
        return res
          .status(400)
          .json({ error: "title is required and must be a non-empty string" });
      }
      if (
        !payload.content ||
        typeof payload.content !== "string" ||
        !payload.content.trim()
      ) {
        return res.status(400).json({
          error: "content is required and must be a non-empty string",
        });
      }

      // Validate author_id is a valid UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(String(payload.author_id))) {
        return res
          .status(400)
          .json({ error: "author_id must be a valid UUID" });
      }

      try {
        // Verify author exists
        const { data: author, error: authorError } = await adminSupabase
          .from("user_profiles")
          .select("id")
          .eq("id", payload.author_id)
          .single();

        if (authorError || !author) {
          return res.status(404).json({ error: "Author not found" });
        }

        const { data, error } = await adminSupabase
          .from("community_posts")
          .insert({
            author_id: payload.author_id,
            title: String(payload.title).trim(),
            content: String(payload.content).trim(),
            category: payload.category ? String(payload.category).trim() : null,
            tags: Array.isArray(payload.tags)
              ? payload.tags.map((t: any) => String(t).trim())
              : [],
            is_published: payload.is_published ?? true,
          })
          .select()
          .single();

        if (error) {
          console.error("[API] /api/posts insert error:", {
            code: error.code,
            message: error.message,
            details: (error as any).details,
          });
          return res
            .status(500)
            .json({ error: error.message || "Failed to create post" });
        }

        res.json(data);
      } catch (e: any) {
        console.error("[API] /api/posts exception:", e?.message || String(e));
        res.status(500).json({ error: e?.message || "Failed to create post" });
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

    // Investors: capture interest
    app.post("/api/investors/interest", async (req, res) => {
      const { name, email, amount, accredited, message } = (req.body || {}) as {
        name?: string;
        email?: string;
        amount?: string;
        accredited?: boolean;
        message?: string;
      };
      if (!email) return res.status(400).json({ error: "email required" });
      try {
        const subject = `Investor interest: ${name || email}`;
        const body = [
          `Name: ${name || "N/A"}`,
          `Email: ${email}`,
          `Amount: ${amount || "N/A"}`,
          `Accredited: ${accredited ? "Yes" : "No / Unknown"}`,
          message ? `\nMessage:\n${message}` : "",
        ].join("\n");
        try {
          const { emailService } = await import("./email");
          if (emailService.isConfigured) {
            await (emailService as any).sendInviteEmail({
              to: process.env.VERIFY_SUPPORT_EMAIL || "support@aethex.biz",
              inviteUrl: "https://aethex.dev/investors",
              inviterName: name || email,
              message: body,
            });
          }
        } catch (e) {
          /* ignore email errors to not block */
        }
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Leads: capture website leads (Wix microsite and others)
    app.post("/api/leads", async (req, res) => {
      const {
        name,
        email,
        company,
        website,
        budget,
        timeline,
        message,
        source,
      } = (req.body || {}) as {
        name?: string;
        email?: string;
        company?: string;
        website?: string;
        budget?: string;
        timeline?: string;
        message?: string;
        source?: string;
      };
      if (!email) return res.status(400).json({ error: "email required" });
      try {
        const lines = [
          `Source: ${source || "web"}`,
          `Name: ${name || "N/A"}`,
          `Email: ${email}`,
          `Company: ${company || "N/A"}`,
          `Website: ${website || "N/A"}`,
          `Budget: ${budget || "N/A"}`,
          `Timeline: ${timeline || "N/A"}`,
          message ? `\nMessage:\n${message}` : "",
        ].join("\n");

        try {
          if (emailService.isConfigured) {
            const base =
              process.env.PUBLIC_BASE_URL ||
              process.env.SITE_URL ||
              "https://aethex.dev";
            await (emailService as any).sendInviteEmail({
              to: process.env.VERIFY_SUPPORT_EMAIL || "support@aethex.biz",
              inviteUrl: `${base}/wix`,
              inviterName: name || email,
              message: lines,
            });
          }
        } catch (e) {
          // continue even if email fails
        }

        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Roblox inbound callback (from HttpService or external automation)
    app.get("/roblox-callback", (_req, res) => res.json({ ok: true }));
    app.post("/roblox-callback", async (req, res) => {
      const shared =
        process.env.ROBLOX_SHARED_SECRET ||
        process.env.ROBLOX_WEBHOOK_SECRET ||
        "";
      const sig = String(
        req.get("x-shared-secret") || req.get("x-roblox-signature") || "",
      );
      if (shared && sig !== shared)
        return res.status(401).json({ error: "unauthorized" });
      try {
        const payload = {
          ...((req.body as any) || {}),
          ip: (req.headers["x-forwarded-for"] as string) || req.ip,
          ua: req.get("user-agent") || null,
          received_at: new Date().toISOString(),
        };
        // Best-effort persist if table exists
        try {
          await adminSupabase.from("roblox_events").insert({
            event_type: (payload as any).event || null,
            payload,
          } as any);
        } catch (e: any) {
          // ignore if table missing or RLS blocks
        }
        return res.json({ ok: true });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Staff: users search/listing
    app.get("/api/staff/users", async (req, res) => {
      const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 20));
      const q = String(req.query.q || "")
        .trim()
        .toLowerCase();
      try {
        const { data, error } = await adminSupabase
          .from("user_profiles")
          .select(
            "id, username, full_name, avatar_url, user_type, created_at, updated_at",
          )
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) return res.status(500).json({ error: error.message });
        let rows = (data || []) as any[];
        if (q) {
          rows = rows.filter((r) => {
            const name = String(r.full_name || r.username || "").toLowerCase();
            return name.includes(q);
          });
        }
        return res.json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Mentorship API
    app.get("/api/mentors", async (req, res) => {
      const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 20));
      const available =
        String(req.query.available || "true").toLowerCase() !== "false";
      const expertise = String(req.query.expertise || "").trim();
      const q = String(req.query.q || "")
        .trim()
        .toLowerCase();
      try {
        const { data, error } = await adminSupabase
          .from("mentors")
          .select(
            `user_id, bio, expertise, available, hourly_rate, created_at, updated_at, user_profiles:user_id ( id, username, full_name, avatar_url, bio )`,
          )
          .eq("available", available)
          .order("updated_at", { ascending: false })
          .limit(limit);
        if (error) {
          if (isTableMissing(error)) return res.json([]);
          return res.status(500).json({ error: error.message });
        }
        let rows = (data || []) as any[];
        if (expertise) {
          const terms = expertise
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
          if (terms.length) {
            rows = rows.filter(
              (r: any) =>
                Array.isArray(r.expertise) &&
                r.expertise.some((e: string) =>
                  terms.includes(String(e).toLowerCase()),
                ),
            );
          }
        }
        if (q) {
          rows = rows.filter((r: any) => {
            const up = (r as any).user_profiles || {};
            const name = String(
              up.full_name || up.username || "",
            ).toLowerCase();
            const bio = String(r.bio || up.bio || "").toLowerCase();
            return name.includes(q) || bio.includes(q);
          });
        }
        return res.json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // System Status
    app.get("/api/status", async (req, res) => {
      const startedAt = Date.now();
      const host = `${req.protocol}://${req.get("host")}`;

      const time = async (fn: () => Promise<any>) => {
        const t0 = Date.now();
        try {
          await fn();
          return { ok: true, ms: Date.now() - t0 };
        } catch (e) {
          return {
            ok: false,
            ms: Date.now() - t0,
            error: (e as any)?.message || String(e),
          };
        }
      };

      // Database check (user_profiles)
      const dbCheck = await time(async () => {
        await adminSupabase
          .from("user_profiles")
          .select("id", { head: true, count: "exact" })
          .limit(1);
      });

      // API/Core check (community_posts)
      const apiCheck = await time(async () => {
        await adminSupabase
          .from("community_posts")
          .select("id", { head: true, count: "exact" })
          .limit(1);
      });

      // Auth check
      const authCheck = await time(async () => {
        const admin = (adminSupabase as any)?.auth?.admin;
        if (!admin) throw new Error("auth admin unavailable");
        await admin.listUsers({ page: 1, perPage: 1 } as any);
      });

      // CDN/static
      const cdnCheck = await time(async () => {
        const resp = await fetch(`${host}/robots.txt`).catch(() => null);
        if (!resp || !resp.ok) throw new Error("robots not reachable");
      });

      const statusFrom = (c: { ok: boolean; ms: number }) =>
        !c.ok ? "outage" : c.ms > 800 ? "degraded" : "operational";

      const nowIso = new Date().toISOString();
      const services = [
        {
          name: "AeThex Core API",
          status: statusFrom(apiCheck) as any,
          responseTime: apiCheck.ms,
          uptime: apiCheck.ok ? "99.99%" : "--",
          lastCheck: nowIso,
          description: "Main application API and endpoints",
        },
        {
          name: "Database Services",
          status: statusFrom(dbCheck) as any,
          responseTime: dbCheck.ms,
          uptime: dbCheck.ok ? "99.99%" : "--",
          lastCheck: nowIso,
          description: "Supabase Postgres and Storage",
        },
        {
          name: "CDN & Assets",
          status: statusFrom(cdnCheck) as any,
          responseTime: cdnCheck.ms,
          uptime: cdnCheck.ok ? "99.95%" : "--",
          lastCheck: nowIso,
          description: "Static and media delivery",
        },
        {
          name: "Authentication",
          status: statusFrom(authCheck) as any,
          responseTime: authCheck.ms,
          uptime: authCheck.ok ? "99.97%" : "--",
          lastCheck: nowIso,
          description: "OAuth and email auth (Supabase)",
        },
      ];

      const avgRt = Math.round(
        services.reduce((a, s) => a + (Number(s.responseTime) || 0), 0) /
          services.length,
      );
      const errCount = services.filter((s) => s.status === "outage").length;
      const warnCount = services.filter((s) => s.status === "degraded").length;

      // Active users (best effort)
      let activeUsers = "--";
      try {
        const { count } = await adminSupabase
          .from("user_profiles")
          .select("id", { head: true, count: "exact" });
        if (typeof count === "number") activeUsers = count.toLocaleString();
      } catch {}

      const metrics = [
        {
          name: "Global Uptime",
          value: errCount ? "99.5" : warnCount ? "99.9" : "99.99",
          unit: "%",
          status: errCount ? "critical" : warnCount ? "warning" : "good",
          icon: "Activity",
        },
        {
          name: "Response Time",
          value: String(avgRt),
          unit: "ms",
          status: avgRt > 800 ? "critical" : avgRt > 400 ? "warning" : "good",
          icon: "Zap",
        },
        {
          name: "Active Users",
          value: activeUsers,
          unit: "",
          status: "good",
          icon: "Globe",
        },
        {
          name: "Error Rate",
          value: String(errCount),
          unit: " outages",
          status: errCount ? "critical" : warnCount ? "warning" : "good",
          icon: "Shield",
        },
      ];

      res.json({
        updatedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        services,
        metrics,
        incidents: [],
      });
    });

    app.post("/api/mentors/apply", async (req, res) => {
      const { user_id, bio, expertise, hourly_rate, available } = (req.body ||
        {}) as {
        user_id?: string;
        bio?: string | null;
        expertise?: string[];
        hourly_rate?: number | null;
        available?: boolean | null;
      };
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      try {
        const payload: any = {
          user_id,
          bio: bio ?? null,
          expertise: Array.isArray(expertise) ? expertise : [],
          available: available ?? true,
          hourly_rate: typeof hourly_rate === "number" ? hourly_rate : null,
        };
        const { data, error } = await adminSupabase
          .from("mentors")
          .upsert(payload, { onConflict: "user_id" as any })
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });

        try {
          await adminSupabase.from("notifications").insert({
            user_id,
            type: "success",
            title: "Mentor profile updated",
            message: "Your mentor availability and expertise are saved.",
          });
        } catch {}

        return res.json(data || payload);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/mentorship/request", async (req, res) => {
      const { mentee_id, mentor_id, message } = (req.body || {}) as {
        mentee_id?: string;
        mentor_id?: string;
        message?: string | null;
      };
      if (!mentee_id || !mentor_id) {
        return res
          .status(400)
          .json({ error: "mentee_id and mentor_id required" });
      }
      if (mentee_id === mentor_id) {
        return res.status(400).json({ error: "cannot request yourself" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("mentorship_requests")
          .insert({ mentee_id, mentor_id, message: message || null } as any)
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });

        try {
          const { data: mentee } = await adminSupabase
            .from("user_profiles")
            .select("full_name, username")
            .eq("id", mentee_id)
            .maybeSingle();
          const menteeName =
            (mentee as any)?.full_name ||
            (mentee as any)?.username ||
            "Someone";
          await adminSupabase.from("notifications").insert({
            user_id: mentor_id,
            type: "info",
            title: "Mentorship request",
            message: `${menteeName} requested mentorship.`,
          });
        } catch {}

        return res.json({ ok: true, request: data });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/mentorship/requests/:id/status", async (req, res) => {
      const id = String(req.params.id || "");
      const { actor_id, status } = (req.body || {}) as {
        actor_id?: string;
        status?: string;
      };
      if (!id || !actor_id || !status) {
        return res.status(400).json({ error: "id, actor_id, status required" });
      }
      const allowed = ["accepted", "rejected", "cancelled"];
      if (!allowed.includes(String(status))) {
        return res.status(400).json({ error: "invalid status" });
      }
      try {
        const { data: reqRow, error } = await adminSupabase
          .from("mentorship_requests")
          .select("id, mentor_id, mentee_id, status")
          .eq("id", id)
          .maybeSingle();
        if (error) return res.status(500).json({ error: error.message });
        if (!reqRow) return res.status(404).json({ error: "not_found" });

        const isMentor = (reqRow as any).mentor_id === actor_id;
        const isMentee = (reqRow as any).mentee_id === actor_id;
        if ((status === "accepted" || status === "rejected") && !isMentor) {
          return res.status(403).json({ error: "forbidden" });
        }
        if (status === "cancelled" && !isMentee) {
          return res.status(403).json({ error: "forbidden" });
        }

        const { data, error: upErr } = await adminSupabase
          .from("mentorship_requests")
          .update({ status })
          .eq("id", id)
          .select()
          .single();
        if (upErr) return res.status(500).json({ error: upErr.message });

        try {
          const target =
            status === "cancelled"
              ? (reqRow as any).mentor_id
              : (reqRow as any).mentee_id;
          const title =
            status === "accepted"
              ? "Mentorship accepted"
              : status === "rejected"
                ? "Mentorship rejected"
                : "Mentorship cancelled";
          await adminSupabase.from("notifications").insert({
            user_id: target,
            type: "info",
            title,
            message: null,
          });
        } catch {}

        return res.json({ ok: true, request: data });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/mentorship/requests", async (req, res) => {
      const userId = String(req.query.user_id || "");
      const role = String(req.query.role || "").toLowerCase();
      if (!userId) return res.status(400).json({ error: "user_id required" });
      try {
        let query = adminSupabase
          .from("mentorship_requests")
          .select(
            `*, mentor:user_profiles!mentorship_requests_mentor_id_fkey ( id, full_name, username, avatar_url ), mentee:user_profiles!mentorship_requests_mentee_id_fkey ( id, full_name, username, avatar_url )`,
          )
          .order("created_at", { ascending: false });
        if (role === "mentor") query = query.eq("mentor_id", userId);
        else if (role === "mentee") query = query.eq("mentee_id", userId);
        else query = query.or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`);
        const { data, error } = await query;
        if (error) {
          if (isTableMissing(error)) return res.json([]);
          return res.status(500).json({ error: error.message });
        }
        return res.json(data || []);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Staff: list all mentorship requests (limited)
    app.get("/api/mentorship/requests/all", async (req, res) => {
      const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
      const status = String(req.query.status || "").toLowerCase();
      try {
        let query = adminSupabase
          .from("mentorship_requests")
          .select(
            `*, mentor:user_profiles!mentorship_requests_mentor_id_fkey ( id, full_name, username, avatar_url ), mentee:user_profiles!mentorship_requests_mentee_id_fkey ( id, full_name, username, avatar_url )`,
          )
          .order("created_at", { ascending: false })
          .limit(limit);
        if (status) query = query.eq("status", status);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data || []);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Moderation API
    app.post("/api/moderation/reports", async (req, res) => {
      const { reporter_id, target_type, target_id, reason, details } =
        (req.body || {}) as any;
      if (!target_type || !reason) {
        return res
          .status(400)
          .json({ error: "target_type and reason required" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("moderation_reports")
          .insert({
            reporter_id: reporter_id || null,
            target_type,
            target_id: target_id || null,
            reason,
            details: details || null,
          } as any)
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/moderation/reports", async (req, res) => {
      const status = String(req.query.status || "open").toLowerCase();
      const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
      try {
        const { data, error } = await adminSupabase
          .from("moderation_reports")
          .select(
            `*, reporter:user_profiles!moderation_reports_reporter_id_fkey ( id, full_name, username, avatar_url )`,
          )
          .eq("status", status)
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data || []);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/moderation/reports/:id/status", async (req, res) => {
      const id = String(req.params.id || "");
      const { status } = (req.body || {}) as { status?: string };
      const allowed = ["open", "resolved", "ignored"];
      if (!id || !status || !allowed.includes(String(status))) {
        return res.status(400).json({ error: "invalid input" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("moderation_reports")
          .update({ status })
          .eq("id", id)
          .select()
          .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });
  } catch (e) {
    console.warn("Admin API not initialized:", e);
  }

  return app;
}
