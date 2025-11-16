import "dotenv/config";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminSupabase } from "./supabase";
import { emailService } from "./email";
import { randomUUID, createHash, createVerify, randomBytes } from "crypto";
import blogIndexHandler from "../api/blog/index";
import blogSlugHandler from "../api/blog/[slug]";

// Discord Interactions Handler
const handleDiscordInteractions = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const signature = req.get("x-signature-ed25519");
    const timestamp = req.get("x-signature-timestamp");
    const rawBody =
      req.body instanceof Buffer
        ? req.body
        : Buffer.from(JSON.stringify(req.body), "utf8");
    const bodyString = rawBody.toString("utf8");

    const publicKey = process.env.DISCORD_PUBLIC_KEY;

    console.log("[Discord] Interaction received at", new Date().toISOString());

    if (!publicKey) {
      console.error("[Discord] DISCORD_PUBLIC_KEY not set");
      return res.status(401).json({ error: "Server not configured" });
    }

    if (!signature || !timestamp) {
      console.error(
        "[Discord] Missing headers - signature:",
        !!signature,
        "timestamp:",
        !!timestamp,
      );
      return res.status(401).json({ error: "Invalid request" });
    }

    // Verify signature
    const message = `${timestamp}${bodyString}`;
    const signatureBuffer = Buffer.from(signature, "hex");
    const verifier = createVerify("ed25519");
    verifier.update(message);
    const isValid = verifier.verify(publicKey, signatureBuffer);

    if (!isValid) {
      console.error("[Discord] Signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const interaction = JSON.parse(bodyString);
    console.log("[Discord] Valid interaction type:", interaction.type);

    // Discord sends a PING to verify the endpoint
    if (interaction.type === 1) {
      console.log("[Discord] ✓ PING verified");
      return res.json({ type: 1 });
    }

    // Handle APPLICATION_COMMAND (slash commands)
    if (interaction.type === 2) {
      const commandName = interaction.data.name;
      console.log("[Discord] Slash command received:", commandName);

      // /creators command
      if (commandName === "creators") {
        const arm = interaction.data.options?.[0]?.value;
        const armFilter = arm ? ` (${arm})` : " (all arms)";

        return res.json({
          type: 4,
          data: {
            content: `🔍 Browse AeThex Creators${armFilter}\n\n👉 [Open Creator Directory](https://aethex.dev/creators${arm ? `?arm=${arm}` : ""})`,
            flags: 0,
          },
        });
      }

      // /opportunities command
      if (commandName === "opportunities") {
        const arm = interaction.data.options?.[0]?.value;
        const armFilter = arm ? ` (${arm})` : " (all arms)";

        return res.json({
          type: 4,
          data: {
            content: `💼 Find Opportunities on Nexus${armFilter}\n\n👉 [Browse Opportunities](https://aethex.dev/opportunities${arm ? `?arm=${arm}` : ""})`,
            flags: 0,
          },
        });
      }

      // /nexus command
      if (commandName === "nexus") {
        return res.json({
          type: 4,
          data: {
            content: `✨ **AeThex Nexus** - The Talent Marketplace\n\n🔗 [Open Nexus](https://aethex.dev/nexus)\n\n**Quick Links:**\n• 🔍 [Browse Creators](https://aethex.dev/creators)\n• 💼 [Find Opportunities](https://aethex.dev/opportunities)\n• 📊 [View Metrics](https://aethex.dev/admin)`,
            flags: 0,
          },
        });
      }

      // /verify command - Generate verification code and link
      if (commandName === "verify") {
        try {
          const discordId = interaction.member?.user?.id;

          if (!discordId) {
            return res.json({
              type: 4,
              data: {
                content: "❌ Could not get your Discord ID",
                flags: 64,
              },
            });
          }

          // Generate verification code (random 6-digit)
          const verificationCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

          // Store verification code in Supabase
          const { error } = await adminSupabase
            .from("discord_verifications")
            .insert([
              {
                discord_id: discordId,
                verification_code: verificationCode,
                expires_at: expiresAt,
              },
            ]);

          if (error) {
            console.error("Error storing verification code:", error);
            return res.json({
              type: 4,
              data: {
                content:
                  "❌ Error generating verification code. Please try again.",
                flags: 64,
              },
            });
          }

          const verifyUrl = `https://aethex.dev/discord-verify?code=${verificationCode}`;

          return res.json({
            type: 4,
            data: {
              content: `✅ **Verification Code: \`${verificationCode}\`**\n\n��� [Click here to verify your account](${verifyUrl})\n\n⏱️ This code expires in 15 minutes.`,
              flags: 0,
            },
          });
        } catch (error) {
          console.error("Error in /verify command:", error);
          return res.json({
            type: 4,
            data: {
              content: "�� An error occurred. Please try again later.",
              flags: 64,
            },
          });
        }
      }

      // /set-realm command - Choose primary arm
      if (commandName === "set-realm") {
        const realmChoice = interaction.data.options?.[0]?.value;

        if (!realmChoice) {
          return res.json({
            type: 4,
            data: {
              content: "❌ Please select a realm",
              flags: 64,
            },
          });
        }

        const realmMap: any = {
          labs: "🔬 Labs",
          gameforge: "🎮 GameForge",
          corp: "💼 Corp",
          foundation: "🤝 Foundation",
          devlink: "🔗 Dev-Link",
        };

        return res.json({
          type: 4,
          data: {
            content: `✅ You've selected **${realmMap[realmChoice] || realmChoice}** as your primary realm!\n\n📝 Your role will be assigned based on your selection.`,
            flags: 0,
          },
        });
      }

      // /profile command - Show user profile
      if (commandName === "profile") {
        const discordId = interaction.member?.user?.id;
        const username = interaction.member?.user?.username;

        return res.json({
          type: 4,
          data: {
            content: `👤 **Your AeThex Profile**\n\n**Discord:** ${username} (\`${discordId}\`)\n\n🔗 [View Full Profile](https://aethex.dev/profile)\n\n**Quick Actions:**\n• \`/set-realm\` - Choose your primary arm\n• \`/verify\` - Link your account\n• \`/verify-role\` - Check your assigned roles`,
            flags: 0,
          },
        });
      }

      // /unlink command - Disconnect Discord
      if (commandName === "unlink") {
        const discordId = interaction.member?.user?.id;

        return res.json({
          type: 4,
          data: {
            content: `��� **Account Unlinked**\n\nYour Discord account (\`${discordId}\`) has been disconnected from AeThex.\n\nTo link again, use \`/verify\``,
            flags: 0,
          },
        });
      }

      // /verify-role command - Check assigned roles
      if (commandName === "verify-role") {
        return res.json({
          type: 4,
          data: {
            content: `✅ **Discord Roles**\n\nYour assigned AeThex roles are shown below.\n\n���� [View Full Profile](https://aethex.dev/profile)`,
            flags: 0,
          },
        });
      }

      // Default command response
      return res.json({
        type: 4,
        data: {
          content: `✨ AeThex - Advanced Development Platform\n\n**Available Commands:**\n• \`/creators [arm]\` - Browse creators across AeThex arms\n• \`/opportunities [arm]\` - Find job opportunities and collaborations\n• \`/nexus\` - Explore the Talent Marketplace\n• \`/verify\` - Link your Discord account\n• \`/set-realm\` - Choose your primary realm\n• \`/profile\` - View your AeThex profile\n• \`/unlink\` - Disconnect your account\n• \`/verify-role\` - Check your assigned Discord roles`,
          flags: 0,
        },
      });
    }

    // For MESSAGE_COMPONENT interactions (buttons, etc.)
    if (interaction.type === 3) {
      console.log(
        "[Discord] Message component interaction:",
        interaction.data.custom_id,
      );

      return res.json({
        type: 4,
        data: { content: "Button clicked - feature coming soon!" },
      });
    }

    // Acknowledge all other interactions
    return res.json({
      type: 4,
      data: { content: "Interaction acknowledged" },
    });
  } catch (err: any) {
    console.error("[Discord] Error:", err?.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export function createServer() {
  const app = express();

  // Discord endpoint MUST be defined BEFORE any body parsing middleware
  // and needs raw body for signature verification
  app.post(
    "/api/discord/interactions",
    express.raw({ type: "application/json" }),
    handleDiscordInteractions,
  );

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Allow Discord to embed the activity in iframes
  app.use((req, res, next) => {
    // Allow embedding in iframes (Discord Activities need this)
    res.setHeader("X-Frame-Options", "ALLOWALL");
    // Allow Discord to access the iframe
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-signature-ed25519, x-signature-timestamp",
    );
    next();
  });

  // Subdomain detection middleware for aethex.me and aethex.space
  app.use((req, res, next) => {
    const host = (req.headers.host || "").toLowerCase();
    const forwarded = (
      (req.headers["x-forwarded-host"] as string) || ""
    ).toLowerCase();
    const hostname = forwarded || host;

    // Parse subdomain
    let subdomain = "";
    let domain = "";

    if (hostname.includes("aethex.me")) {
      const parts = hostname.split(".");
      if (parts.length > 2) {
        subdomain = parts[0];
        domain = "aethex.me";
      }
    } else if (hostname.includes("aethex.space")) {
      const parts = hostname.split(".");
      if (parts.length > 2) {
        subdomain = parts[0];
        domain = "aethex.space";
      }
    }

    // Attach subdomain info to request
    (req as any).subdomainInfo = {
      subdomain,
      domain,
      isCreatorPassport: domain === "aethex.me",
      isProjectPassport: domain === "aethex.space",
    };

    console.log("[Subdomain] Detected:", {
      hostname,
      subdomain,
      domain,
      isCreatorPassport: domain === "aethex.me",
      isProjectPassport: domain === "aethex.space",
    });

    next();
  });

  // Subdomain Passport Data API - returns JSON for the React component to use
  app.get("/api/passport/subdomain-data/:username", async (req, res) => {
    try {
      const username = String(req.params.username || "")
        .toLowerCase()
        .trim();

      if (!username) {
        return res.status(400).json({ error: "username required" });
      }

      console.log("[Passport Data API] Fetching creator:", username);

      const { data: user, error } = await adminSupabase
        .from("user_profiles")
        .select(
          "id, username, full_name, bio, avatar_url, banner_url, location, website_url, github_url, linkedin_url, twitter_url, role, level, total_xp, user_type, experience_level, current_streak, longest_streak, created_at, updated_at",
        )
        .eq("username", username)
        .single();

      if (error || !user) {
        console.log("[Passport Data API] Creator not found:", username);
        return res.status(404).json({ error: "Creator not found", username });
      }

      // Fetch achievements
      const { data: achievements = [] } = await adminSupabase
        .from("user_achievements")
        .select(
          `
          achievement_id,
          achievements(
            id,
            name,
            description,
            icon,
            category,
            badge_color
          )
        `,
        )
        .eq("user_id", user.id);

      return res.json({
        type: "creator",
        user,
        achievements: achievements
          .map((a: any) => a.achievements)
          .filter(Boolean),
        domain: "aethex.me",
      });
    } catch (e: any) {
      console.error("[Passport Data API] Error:", e?.message);
      return res.status(500).json({
        error: e?.message || "Failed to fetch creator passport",
      });
    }
  });

  app.get("/api/passport/project-data/:projectSlug", async (req, res) => {
    try {
      const projectSlug = String(req.params.projectSlug || "")
        .toLowerCase()
        .trim();

      if (!projectSlug) {
        return res.status(400).json({ error: "projectSlug required" });
      }

      console.log("[Passport Data API] Fetching project:", projectSlug);

      const { data: project, error } = await adminSupabase
        .from("projects")
        .select(
          "id, slug, name, description, logo_url, banner_url, website_url, github_url, team_size, created_at, updated_at",
        )
        .eq("slug", projectSlug)
        .single();

      if (error || !project) {
        console.log("[Passport Data API] Project not found:", projectSlug);
        return res.status(404).json({ error: "Project not found", projectSlug });
      }

      return res.json({
        type: "group",
        group: project,
        domain: "aethex.space",
      });
    } catch (e: any) {
      console.error("[Passport Data API] Error:", e?.message);
      return res.status(500).json({
        error: e?.message || "Failed to fetch project passport",
      });
    }
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // API: Creator passport lookup by subdomain (aethex.me)
  app.get("/api/passport/subdomain/:username", async (req, res) => {
    try {
      const username = String(req.params.username || "")
        .toLowerCase()
        .trim();
      if (!username) {
        return res.status(400).json({ error: "username required" });
      }

      const { data, error } = await adminSupabase
        .from("user_profiles")
        .select(
          "id, username, full_name, avatar_url, user_type, bio, created_at",
        )
        .eq("username", username)
        .single();

      if (error || !data) {
        return res.status(404).json({
          error: "Creator not found",
          username,
        });
      }

      return res.json({
        type: "creator",
        user: data,
        domain: "aethex.me",
      });
    } catch (e: any) {
      console.error("[Passport Subdomain] Error:", e?.message);
      return res.status(500).json({
        error: e?.message || "Failed to fetch creator passport",
      });
    }
  });

  // API: Project passport lookup by subdomain (aethex.space)
  app.get("/api/passport/project/:projectname", async (req, res) => {
    try {
      const projectname = String(req.params.projectname || "")
        .toLowerCase()
        .trim();
      if (!projectname) {
        return res.status(400).json({ error: "projectname required" });
      }

      // First try exact match by name
      let query = adminSupabase
        .from("projects")
        .select(
          "id, title, slug, description, user_id, created_at, updated_at, status, image_url, website",
        )
        .eq("slug", projectname);

      let { data, error } = await query.single();

      // If not found by slug, try by title (case-insensitive)
      if (error && error.code === "PGRST116") {
        query = adminSupabase
          .from("projects")
          .select(
            "id, title, slug, description, user_id, created_at, updated_at, status, image_url, website",
          )
          .ilike("title", projectname);

        const response = await query;
        if (response.data && response.data.length > 0) {
          data = response.data[0];
          error = null;
        }
      }

      if (error || !data) {
        return res.status(404).json({
          error: "Project not found",
          projectname,
        });
      }

      // Fetch project owner info
      const { data: owner } = await adminSupabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", (data as any).user_id)
        .maybeSingle();

      return res.json({
        type: "project",
        project: data,
        owner,
        domain: "aethex.space",
      });
    } catch (e: any) {
      console.error("[Project Subdomain] Error:", e?.message);
      return res.status(500).json({
        error: e?.message || "Failed to fetch project passport",
      });
    }
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

    // Discord OAuth: start authorization flow
    app.get("/api/discord/oauth/start", (req, res) => {
      try {
        const clientId = process.env.DISCORD_CLIENT_ID;
        if (!clientId) {
          return res
            .status(500)
            .json({ error: "Discord client ID not configured" });
        }

        // Use the API base URL (should match Discord Dev Portal redirect URI)
        let apiBase =
          process.env.VITE_API_BASE ||
          process.env.API_BASE ||
          process.env.PUBLIC_BASE_URL ||
          process.env.SITE_URL;

        if (!apiBase) {
          // Fallback to request origin if no env var is set
          const protocol =
            req.headers["x-forwarded-proto"] || req.protocol || "https";
          const host =
            req.headers["x-forwarded-host"] || req.hostname || req.get("host");
          apiBase = `${protocol}://${host}`;
        }

        const redirectUri = `${apiBase}/api/discord/oauth/callback`;
        console.log(
          "[Discord OAuth Start] Using redirect URI:",
          redirectUri,
          "from API base:",
          apiBase,
        );

        // Get the state from query params (can be a JSON string with action and redirectTo)
        let state = req.query.state || "/dashboard";
        if (typeof state !== "string") {
          state = "/dashboard";
        }

        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "identify email",
          state: state,
        });

        const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
        console.log("[Discord OAuth Start] Redirecting to:", discordOAuthUrl);
        return res.redirect(302, discordOAuthUrl);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Discord OAuth: callback handler
    app.get("/api/discord/oauth/callback", async (req, res) => {
      const code = req.query.code as string;
      const state = req.query.state as string;
      const error = req.query.error as string;

      if (error) {
        return res.redirect(`/login?error=${error}`);
      }

      if (!code) {
        return res.redirect("/login?error=no_code");
      }

      // Parse state to determine if this is a linking or login flow
      let isLinkingFlow = false;
      let redirectTo = "/dashboard";
      let authenticatedUserId: string | null = null;

      if (state) {
        try {
          const stateData = JSON.parse(decodeURIComponent(state));
          isLinkingFlow = stateData.action === "link";
          redirectTo = stateData.redirectTo || redirectTo;

          if (isLinkingFlow && stateData.sessionToken) {
            // Look up the linking session to get the user ID
            const { data: session, error: sessionError } = await adminSupabase
              .from("discord_linking_sessions")
              .select("user_id")
              .eq("session_token", stateData.sessionToken)
              .gt("expires_at", new Date().toISOString())
              .single();

            if (sessionError || !session) {
              console.error(
                "[Discord OAuth] Linking session not found or expired",
              );
              return res.redirect(
                "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Discord%20again.",
              );
            }

            authenticatedUserId = session.user_id;
            console.log(
              "[Discord OAuth] Linking session found, user_id:",
              authenticatedUserId,
            );

            // Clean up the temporary session
            await adminSupabase
              .from("discord_linking_sessions")
              .delete()
              .eq("session_token", stateData.sessionToken);
          }
        } catch (e) {
          console.log("[Discord OAuth] Could not parse state:", e);
        }
      }

      try {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;

        // Use the same redirect URI as the start endpoint
        let apiBase =
          process.env.VITE_API_BASE ||
          process.env.API_BASE ||
          process.env.PUBLIC_BASE_URL ||
          process.env.SITE_URL;

        if (!apiBase) {
          // Fallback to request origin if no env var is set
          const protocol =
            req.headers["x-forwarded-proto"] || req.protocol || "https";
          const host =
            req.headers["x-forwarded-host"] || req.hostname || req.get("host");
          apiBase = `${protocol}://${host}`;
        }

        const redirectUri = `${apiBase}/api/discord/oauth/callback`;
        console.log(
          "[Discord OAuth Callback] Received callback, redirect URI:",
          redirectUri,
        );

        if (!clientId || !clientSecret) {
          console.error("[Discord OAuth] Missing client credentials");
          return res.redirect("/login?error=config");
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch(
          "https://discord.com/api/oauth2/token",
          {
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
            }).toString(),
          },
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error("[Discord OAuth] Token exchange failed:", errorData);
          return res.redirect("/login?error=token_exchange");
        }

        const tokenData = await tokenResponse.json();

        // Get Discord user information
        const userResponse = await fetch(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          },
        );

        if (!userResponse.ok) {
          console.error(
            "[Discord OAuth] User fetch failed:",
            userResponse.status,
          );
          return res.redirect("/login?error=user_fetch");
        }

        const discordUser = await userResponse.json();

        if (!discordUser.email) {
          console.error("[Discord OAuth] Discord user has no email");
          return res.redirect(
            "/login?error=no_email&message=Please+enable+email+on+your+Discord+account",
          );
        }

        // LINKING FLOW: Link Discord to authenticated user
        if (isLinkingFlow && authenticatedUserId) {
          console.log(
            "[Discord OAuth] Linking Discord to user:",
            authenticatedUserId,
          );

          // Check if Discord ID is already linked to someone else
          const { data: existingLink } = await adminSupabase
            .from("discord_links")
            .select("user_id")
            .eq("discord_id", discordUser.id)
            .single();

          if (existingLink && existingLink.user_id !== authenticatedUserId) {
            console.error(
              "[Discord OAuth] Discord ID already linked to different user",
            );
            return res.redirect(
              `/dashboard?error=already_linked&message=${encodeURIComponent("This Discord account is already linked to another AeThex account")}`,
            );
          }

          // Create or update Discord link
          const { error: linkError } = await adminSupabase
            .from("discord_links")
            .upsert({
              discord_id: discordUser.id,
              user_id: authenticatedUserId,
              linked_at: new Date().toISOString(),
            });

          if (linkError) {
            console.error("[Discord OAuth] Link creation failed:", linkError);
            return res.redirect(
              `/dashboard?error=link_failed&message=${encodeURIComponent("Failed to link Discord account")}`,
            );
          }

          console.log(
            "[Discord OAuth] Successfully linked Discord:",
            discordUser.id,
          );
          return res.redirect(redirectTo);
        }

        // LOGIN FLOW: Check if Discord user already exists
        const { data: existingLink } = await adminSupabase
          .from("discord_links")
          .select("user_id")
          .eq("discord_id", discordUser.id)
          .single();

        let userId: string;

        if (existingLink) {
          // Discord ID already linked - use existing user
          userId = existingLink.user_id;
          console.log(
            "[Discord OAuth] Discord ID already linked to user:",
            userId,
          );
        } else {
          // Check if email matches existing account
          const { data: existingUserProfile } = await adminSupabase
            .from("user_profiles")
            .select("id")
            .eq("email", discordUser.email)
            .single();

          if (existingUserProfile) {
            // Discord email matches existing user profile - link it
            userId = existingUserProfile.id;
            console.log(
              "[Discord OAuth] Discord email matches existing user profile, linking Discord",
            );
          } else {
            // Discord email doesn't match any existing account
            // Don't auto-create - ask user to sign in with email first
            console.log(
              "[Discord OAuth] Discord email not found in existing accounts, redirecting to sign in",
            );
            return res.redirect(
              `/login?error=discord_no_match&message=${encodeURIComponent(`Discord email (${discordUser.email}) not found. Please sign in with your email account first, then link Discord from settings.`)}`,
            );
          }
        }

        // Create Discord link
        const { error: linkError } = await adminSupabase
          .from("discord_links")
          .upsert({
            discord_id: discordUser.id,
            user_id: userId,
            linked_at: new Date().toISOString(),
          });

        if (linkError) {
          console.error("[Discord OAuth] Link creation failed:", linkError);
          return res.redirect("/login?error=link_create");
        }

        // Discord is now linked! Redirect to login for user to sign in
        console.log(
          "[Discord OAuth] Discord linked successfully, redirecting to login",
        );
        return res.redirect(
          `/login?discord_linked=true&email=${encodeURIComponent(discordUser.email)}`,
        );
      } catch (e: any) {
        console.error("[Discord OAuth] Callback error:", e);
        return res.redirect("/login?error=unknown");
      }
    });

    // Discord Create Linking Session: Creates temporary session for OAuth linking
    app.post("/api/discord/create-linking-session", async (req, res) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
          error,
        } = await adminSupabase.auth.getUser(token);

        if (error || !user) {
          return res.status(401).json({ error: "Invalid auth token" });
        }

        const sessionToken = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const { error: insertError } = await adminSupabase
          .from("discord_linking_sessions")
          .insert({
            user_id: user.id,
            session_token: sessionToken,
            expires_at: expiresAt,
          });

        if (insertError) {
          console.error("[Discord] Session insert error:", {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
          });
          return res.status(500).json({
            error: insertError.message,
            details: insertError.details,
          });
        }

        res.json({ token: sessionToken });
      } catch (error: any) {
        console.error("[Discord] Create session error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Discord Verify Code: Link account using verification code
    app.post("/api/discord/verify-code", async (req, res) => {
      const { verification_code, user_id } = req.body || {};

      console.log("[Discord Verify] Request received:", {
        verification_code: verification_code ? "***" : "missing",
        user_id: user_id || "missing",
      });

      if (!verification_code || !user_id) {
        console.error("[Discord Verify] Missing params:", {
          hasCode: !!verification_code,
          hasUserId: !!user_id,
        });
        return res.status(400).json({
          message: "Missing verification code or user ID",
        });
      }

      try {
        // Find valid verification code
        const { data: verification, error: verifyError } = await adminSupabase
          .from("discord_verifications")
          .select("*")
          .eq("verification_code", verification_code.trim())
          .gt("expires_at", new Date().toISOString())
          .single();

        if (verifyError) {
          console.error(
            "[Discord Verify] Error querying verification code:",
            verifyError,
          );
          return res.status(400).json({
            message:
              "Invalid or expired verification code. Please try /verify again.",
          });
        }

        if (!verification) {
          console.warn(
            "[Discord Verify] Verification code not found or expired:",
            verification_code,
          );
          return res.status(400).json({
            message:
              "Invalid or expired verification code. Please try /verify again.",
          });
        }

        const discordId = verification.discord_id;
        console.log(
          "[Discord Verify] Found verification code for Discord ID:",
          {
            discordId,
            userId: user_id,
          },
        );

        // Check if already linked
        const { data: existingLink, error: linkCheckError } =
          await adminSupabase
            .from("discord_links")
            .select("*")
            .eq("discord_id", discordId)
            .single();

        if (linkCheckError && linkCheckError.code !== "PGRST116") {
          console.error(
            "[Discord Verify] Error checking existing link:",
            linkCheckError,
          );
        }

        if (existingLink && existingLink.user_id !== user_id) {
          console.warn(
            "[Discord Verify] Discord ID already linked to different user:",
            {
              discordId,
              existingUserId: existingLink.user_id,
              newUserId: user_id,
            },
          );
          return res.status(400).json({
            message:
              "This Discord account is already linked to another AeThex account.",
          });
        }

        // Create or update link
        const { error: linkError } = await adminSupabase
          .from("discord_links")
          .upsert({
            discord_id: discordId,
            user_id: user_id,
            linked_at: new Date().toISOString(),
          });

        if (linkError) {
          console.error("[Discord Verify] Link creation failed:", linkError);
          return res.status(500).json({
            message: "Failed to link Discord account: " + linkError.message,
          });
        }

        console.log("[Discord Verify] Link created successfully:", {
          discordId,
          userId: user_id,
        });

        // Delete used verification code
        await adminSupabase
          .from("discord_verifications")
          .delete()
          .eq("verification_code", verification_code.trim());

        res.status(200).json({
          success: true,
          message: "Discord account linked successfully!",
          discord_user: {
            id: discordId,
            username: verification.username || "Discord User",
          },
        });
      } catch (error: any) {
        console.error("[Discord Verify] Unexpected error:", error);
        res.status(500).json({
          message: "An error occurred. Please try again: " + error?.message,
        });
      }
    });

    // Discord Role Mappings CRUD
    app.get("/api/discord/role-mappings", async (req, res) => {
      try {
        const { data, error } = await adminSupabase
          .from("discord_role_mappings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[Discord] Error fetching role mappings:", error);
          return res.status(500).json({
            error: `Failed to fetch role mappings: ${error.message}`,
          });
        }

        res.setHeader("Content-Type", "application/json");
        return res.json(data || []);
      } catch (e: any) {
        console.error("[Discord] Exception fetching role mappings:", e);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: e?.message || "Failed to fetch role mappings",
        });
      }
    });

    // Discord Activity Token Exchange Endpoint
    app.post("/api/discord/token", async (req, res) => {
      try {
        const { code } = req.body;

        if (!code) {
          return res.status(400).json({ error: "Missing authorization code" });
        }

        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          console.error("[Discord Token] Missing CLIENT_ID or CLIENT_SECRET");
          return res.status(500).json({ error: "Server not configured" });
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch(
          "https://discord.com/api/v10/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: "authorization_code",
              code,
              redirect_uri:
                process.env.DISCORD_ACTIVITY_REDIRECT_URI ||
                "https://aethex.dev/activity",
            }).toString(),
          },
        );

        if (!tokenResponse.ok) {
          const error = await tokenResponse.json();
          console.error("[Discord Token] Token exchange failed:", error);
          return res.status(400).json({
            error: "Failed to exchange code for token",
            details: error,
          });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
          console.error("[Discord Token] No access token in response");
          return res
            .status(500)
            .json({ error: "Failed to obtain access token" });
        }

        // Fetch Discord user info to ensure token is valid
        const userResponse = await fetch(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!userResponse.ok) {
          console.error("[Discord Token] Failed to fetch user info");
          return res.status(401).json({ error: "Invalid token" });
        }

        const discordUser = await userResponse.json();
        console.log(
          "[Discord Token] Token exchange successful for user:",
          discordUser.id,
        );

        // Return access token to Activity
        return res.status(200).json({
          access_token: accessToken,
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          user_id: discordUser.id,
          username: discordUser.username,
        });
      } catch (error) {
        console.error("[Discord Token] Error:", error);
        return res.status(500).json({
          error: "Internal server error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });

    app.post("/api/discord/role-mappings", async (req, res) => {
      try {
        const { arm, discord_role, discord_role_name, server_id, user_type } =
          req.body;

        const roleName = discord_role_name || discord_role;
        if (!arm || !roleName) {
          return res.status(400).json({
            error: "arm and discord_role (or discord_role_name) are required",
          });
        }

        const { data, error } = await adminSupabase
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
          console.error("[Discord] Error creating role mapping:", error);
          return res.status(500).json({
            error: `Failed to create mapping: ${error.message}`,
          });
        }

        res.setHeader("Content-Type", "application/json");
        return res.status(201).json(data);
      } catch (e: any) {
        console.error("[Discord] Exception creating role mapping:", e);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: e?.message || "Failed to create mapping",
        });
      }
    });

    app.put("/api/discord/role-mappings", async (req, res) => {
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

        const { data, error } = await adminSupabase
          .from("discord_role_mappings")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("[Discord] Error updating role mapping:", error);
          return res.status(500).json({
            error: `Failed to update mapping: ${error.message}`,
          });
        }

        res.setHeader("Content-Type", "application/json");
        return res.json(data);
      } catch (e: any) {
        console.error("[Discord] Exception updating role mapping:", e);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: e?.message || "Failed to update mapping",
        });
      }
    });

    app.delete("/api/discord/role-mappings", async (req, res) => {
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            error: "id query parameter is required",
          });
        }

        const { error } = await adminSupabase
          .from("discord_role_mappings")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("[Discord] Error deleting role mapping:", error);
          return res.status(500).json({
            error: `Failed to delete mapping: ${error.message}`,
          });
        }

        res.setHeader("Content-Type", "application/json");
        return res.json({ success: true });
      } catch (e: any) {
        console.error("[Discord] Exception deleting role mapping:", e);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: e?.message || "Failed to delete mapping",
        });
      }
    });

    // Discord Admin Register Commands
    app.get("/api/discord/admin-register-commands", async (req, res) => {
      // GET: Show HTML form for browser access
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Register Discord Commands</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
              width: 90%;
            }
            h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
            p { color: #666; margin-bottom: 30px; line-height: 1.6; }
            .input-group {
              margin-bottom: 20px;
              text-align: left;
            }
            label {
              display: block;
              color: #333;
              font-weight: bold;
              margin-bottom: 8px;
              font-size: 14px;
            }
            input {
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              transition: border-color 0.3s;
            }
            input:focus {
              outline: none;
              border-color: #667eea;
            }
            button {
              background: #667eea;
              color: white;
              border: none;
              padding: 14px 40px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              transition: all 0.3s;
              width: 100%;
            }
            button:hover {
              background: #764ba2;
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            button:disabled {
              background: #ccc;
              cursor: not-allowed;
              transform: none;
            }
            #result {
              margin-top: 30px;
              padding: 20px;
              border-radius: 6px;
              display: none;
              font-size: 14px;
              word-break: break-all;
            }
            #result.success {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
              display: block;
            }
            #result.error {
              background: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
              display: block;
            }
            #loading {
              display: none;
              color: #667eea;
              font-weight: bold;
              margin-top: 20px;
            }
            .commands-list {
              background: #f0f0f0;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              font-size: 13px;
              text-align: left;
              color: #333;
            }
            .commands-list li { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🤖 Discord Commands Registration</h1>
            <p>Register all Discord slash commands for AeThex</p>

            <div class="commands-list">
              <strong>Commands to be registered:</strong>
              <ul>
                <li>✅ /verify - Link your Discord account</li>
                <li>✅ /set-realm - Choose your primary arm</li>
                <li>✅ /profile - View your AeThex profile</li>
                <li>✅ /unlink - Disconnect your account</li>
                <li>✅ /verify-role - Check your Discord roles</li>
              </ul>
            </div>

            <div class="input-group">
              <label for="token">Admin Token:</label>
              <input type="password" id="token" placeholder="Enter admin token" value="aethex-link" />
            </div>

            <button id="registerBtn" onclick="registerCommands()">🚀 Register Commands Now</button>

            <div id="loading">⏳ Registering commands... please wait...</div>
            <div id="result"></div>
          </div>

          <script>
            async function registerCommands() {
              const btn = document.getElementById('registerBtn');
              const loading = document.getElementById('loading');
              const result = document.getElementById('result');
              const token = document.getElementById('token').value.trim();

              console.log('[Form] Token length:', token.length);
              console.log('[Form] Token value:', 'Bearer ' + token);

              if (!token) {
                result.className = 'error';
                result.innerHTML = '<h3>�� Error</h3><p>Please enter the admin token</p>';
                result.style.display = 'block';
                return;
              }

              btn.disabled = true;
              loading.style.display = 'block';
              result.style.display = 'none';

              try {
                const authHeader = 'Bearer ' + token;
                console.log('[Form] Sending auth header:', authHeader);

                const response = await fetch('/api/discord/admin-register-commands', {
                  method: 'POST',
                  headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ token: token })
                });

                let data;
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                  data = await response.json();
                } else {
                  const text = await response.text();
                  data = { error: text };
                }

                loading.style.display = 'none';
                result.style.display = 'block';

                if (response.ok && data.ok) {
                  result.className = 'success';
                  result.innerHTML = \`
                    <h3>✅ Success!</h3>
                    <p><strong>Registered \${data.commands.length} commands:</strong></p>
                    <ul style="text-align: left;">
                      \${data.commands.map(cmd => \`<li>✓ /\${cmd.name}</li>\`).join('')}
                    </ul>
                    <p style="margin-top: 15px; color: #155724;">You can now use these commands in Discord!</p>
                  \`;
                } else {
                  result.className = 'error';
                  result.innerHTML = \`
                    <h3>❌ Registration Failed (\${response.status})</h3>
                    <p><strong>Error:</strong> \${data.error || 'Unknown error'}</p>
                    \${data.details ? \`<p><strong>Details:</strong> \${data.details}</p>\` : ''}
                  \`;
                }
              } catch (error) {
                loading.style.display = 'none';
                result.style.display = 'block';
                result.className = 'error';
                result.innerHTML = \`
                  <h3>❌ Request Failed</h3>
                  <p>\${error.message}</p>
                \`;
              } finally {
                btn.disabled = false;
              }
            }

            // Auto-focus token field on page load
            window.addEventListener('load', () => {
              document.getElementById('token').focus();
            });
          </script>
        </body>
        </html>
      `);
    });

    app.post("/api/discord/admin-register-commands", async (req, res) => {
      try {
        // Skip auth for localhost/development
        const isLocalhost =
          req.hostname === "localhost" || req.hostname === "127.0.0.1";

        if (!isLocalhost) {
          const authHeader = req.headers.authorization;
          const tokenFromBody = req.body?.token as string;

          // Extract token from Bearer header
          let token = null;
          if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
          } else if (tokenFromBody) {
            token = tokenFromBody;
          }

          const adminToken = process.env.DISCORD_ADMIN_REGISTER_TOKEN;

          if (!adminToken || !token || token !== adminToken) {
            console.error(
              "[Discord] Authorization failed - token mismatch or missing",
            );
            return res.status(401).json({
              error: "Unauthorized - invalid or missing admin token",
            });
          }
        }

        const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
        const clientId = process.env.DISCORD_CLIENT_ID?.trim();

        console.log(
          "[Discord] Config check - botToken set:",
          !!botToken,
          "clientId set:",
          !!clientId,
          "botToken length:",
          botToken?.length,
        );

        // Log first and last few chars of token for debugging (safe logging)
        if (botToken) {
          const first = botToken.substring(0, 5);
          const last = botToken.substring(botToken.length - 5);
          console.log(
            "[Discord] Token preview: " + first + "..." + last,
            "Total length:",
            botToken.length,
          );
        }

        if (!botToken || !clientId) {
          return res.status(500).json({
            error: "Discord bot token or client ID not configured",
          });
        }

        // Validate token format
        if (botToken.length < 20) {
          console.warn(
            "[Discord] Bot token appears invalid - length:",
            botToken.length,
          );
          return res.status(500).json({
            error:
              "Discord bot token appears invalid (check DISCORD_BOT_TOKEN in environment)",
            tokenLength: botToken.length,
          });
        }

        // Register slash commands
        const commands = [
          {
            name: "verify",
            description: "Link your Discord account to AeThex",
            type: 1,
          },
          {
            name: "set-realm",
            description: "Choose your primary arm/realm",
            type: 1,
            options: [
              {
                name: "realm",
                description: "Select your primary realm",
                type: 3,
                required: true,
                choices: [
                  { name: "Labs", value: "labs" },
                  { name: "GameForge", value: "gameforge" },
                  { name: "Corp", value: "corp" },
                  { name: "Foundation", value: "foundation" },
                  { name: "Nexus", value: "nexus" },
                ],
              },
            ],
          },
          {
            name: "profile",
            description: "View your AeThex profile",
            type: 1,
          },
          {
            name: "unlink",
            description: "Disconnect your Discord account from AeThex",
            type: 1,
          },
          {
            name: "verify-role",
            description: "Check your assigned Discord roles",
            type: 1,
          },
        ];

        const registerUrl = `https://discord.com/api/v10/applications/${clientId}/commands`;
        console.log("[Discord] Calling Discord API:", registerUrl);
        console.log("[Discord] Bot token length:", botToken.length);
        console.log("[Discord] Sending", commands.length, "commands");

        const response = await fetch(registerUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commands),
        });

        console.log("[Discord] Discord API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.text();
          let errorJson = {};
          try {
            errorJson = JSON.parse(errorData);
          } catch {}

          console.error(
            "[Discord] Command registration failed:",
            response.status,
            errorData,
          );

          return res.status(500).json({
            error: `Discord API error (${response.status}): ${errorData}`,
            discordError: errorJson,
          });
        }

        const result = await response.json();
        console.log(
          "[Discord] Commands registered successfully:",
          result.length,
        );
        res.setHeader("Content-Type", "application/json");
        return res.json({
          ok: true,
          message: `Registered ${result.length} commands`,
          commands: result,
        });
      } catch (e: any) {
        console.error(
          "[Discord] Exception registering commands:",
          e.message,
          e.stack,
        );
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: e?.message || "Failed to register commands",
          details:
            process.env.NODE_ENV === "development" ? e?.stack : undefined,
        });
      }
    });

    // Discord Bot Health Check (proxy to avoid CSP issues)
    // Set DISCORD_BOT_HEALTH_URL env var to bot's actual health endpoint
    // Examples:
    //   - Railway internal: http://aethex.railway.internal:8044/health
    //   - External URL: https://bot.example.com/health
    //   - Local: http://localhost:3000/health
    app.get("/api/discord/bot-health", async (req, res) => {
      try {
        // Try multiple bot health URLs in order of preference
        const botHealthUrls = [
          process.env.DISCORD_BOT_HEALTH_URL,
          "http://aethex.railway.internal:8044/health", // Railway internal network
          "http://localhost:8044/health", // Local fallback
        ].filter(Boolean) as string[];

        let lastError: Error | null = null;
        let response: Response | null = null;

        for (const url of botHealthUrls) {
          try {
            console.log(`[Discord Bot Health] Attempting to reach: ${url}`);
            // Create AbortController with 5 second timeout for internal Railway, 3 seconds for localhost
            const isInternal = url.includes("railway.internal");
            const timeoutMs = isInternal ? 5000 : 3000;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            try {
              response = await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
              });
            } finally {
              clearTimeout(timeoutId);
            }

            const contentType = response.headers.get("content-type") || "";
            const responseBody = await response.text();

            console.log(
              `[Discord Bot Health] Response from ${url}: Status ${response.status}, Content-Type: ${contentType}, Body: ${responseBody.substring(0, 200)}`,
            );

            if (response.ok && contentType.includes("application/json")) {
              console.log(`[Discord Bot Health] Success from ${url}`);
              const data = JSON.parse(responseBody);
              res.setHeader("Content-Type", "application/json");
              return res.json({
                status: data.status || "online",
                guilds: data.guilds || 0,
                commands: data.commands || 0,
                uptime: data.uptime || 0,
                timestamp: data.timestamp || new Date().toISOString(),
              });
            }

            if (response.ok && !contentType.includes("application/json")) {
              lastError = new Error(
                `Got non-JSON response (${contentType}): ${responseBody.substring(0, 100)}`,
              );
              continue;
            }
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            console.warn(
              `[Discord Bot Health] Failed to reach ${url}: ${lastError.message}`,
            );
            continue;
          }
        }

        // Could not reach any health endpoint
        res.setHeader("Content-Type", "application/json");
        return res.status(503).json({
          status: "offline",
          error: `Could not reach bot health endpoint. Last error: ${lastError?.message || "Unknown error"}`,
        });
      } catch (error: any) {
        console.error("[Discord Bot Health] Error:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          status: "offline",
          error:
            error instanceof Error
              ? error.message
              : "Failed to reach bot health endpoint",
        });
      }
    });

    // Discord Token Diagnostic Endpoint
    app.get("/api/discord/diagnostic", async (req, res) => {
      try {
        const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
        const clientId = process.env.DISCORD_CLIENT_ID?.trim();
        const publicKey = process.env.DISCORD_PUBLIC_KEY?.trim();

        const diagnostics = {
          timestamp: new Date().toISOString(),
          environment: {
            botTokenSet: !!botToken,
            clientIdSet: !!clientId,
            publicKeySet: !!publicKey,
          },
          tokenValidation: {
            length: botToken?.length || 0,
            format: botToken ? "valid_format" : "missing",
            preview: botToken
              ? `${botToken.substring(0, 15)}...${botToken.substring(botToken.length - 10)}`
              : null,
            minLengthMet: (botToken?.length || 0) >= 20,
          },
          clientIdValidation: {
            value: clientId || null,
            isNumeric: /^\d+$/.test(clientId || ""),
          },
          testRequest: {
            url: `https://discord.com/api/v10/applications/${clientId}/commands`,
            method: "PUT",
            headerFormat: "Bot {token}",
            status: "ready_to_test",
          },
          recommendations: [] as string[],
        };

        // Add recommendations based on validation
        if (!botToken) {
          diagnostics.recommendations.push(
            "❌ DISCORD_BOT_TOKEN not set. Set it in environment variables.",
          );
        } else if ((botToken?.length || 0) < 20) {
          diagnostics.recommendations.push(
            `❌ DISCORD_BOT_TOKEN appears invalid (length: ${botToken?.length}). Should be 60+ characters.`,
          );
        } else {
          diagnostics.recommendations.push(
            "✅ DISCORD_BOT_TOKEN format looks valid",
          );
        }

        if (!clientId) {
          diagnostics.recommendations.push(
            "�� DISCORD_CLIENT_ID not set. Set it to your application's ID.",
          );
        } else {
          diagnostics.recommendations.push("�� DISCORD_CLIENT_ID is set");
        }

        if (!publicKey) {
          diagnostics.recommendations.push(
            "��� DISCORD_PUBLIC_KEY not set. Needed for signature verification.",
          );
        } else {
          diagnostics.recommendations.push("✅ DISCORD_PUBLIC_KEY is set");
        }

        // Test if token works with Discord API
        if (botToken && clientId) {
          try {
            const testResponse = await fetch(
              `https://discord.com/api/v10/applications/${clientId}`,
              {
                headers: {
                  Authorization: `Bot ${botToken}`,
                },
              },
            );

            diagnostics.testRequest = {
              ...diagnostics.testRequest,
              status:
                testResponse.status === 200
                  ? "✅ Success"
                  : `❌ Failed (${testResponse.status})`,
              responseCode: testResponse.status,
            };

            if (testResponse.status === 401) {
              diagnostics.recommendations.push(
                "❌ Token authentication failed (401). The token may be invalid or revoked.",
              );
            } else if (testResponse.status === 200) {
              diagnostics.recommendations.push(
                "✅ Token authentication successful with Discord API!",
              );
            }
          } catch (error) {
            diagnostics.testRequest = {
              ...diagnostics.testRequest,
              status: "⚠️ Network Error",
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        }

        res.setHeader("Content-Type", "application/json");
        return res.json(diagnostics);
      } catch (error: any) {
        console.error("[Discord Diagnostic] Error:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: error instanceof Error ? error.message : "Diagnostic failed",
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

    // Wallet verification endpoint for Phase 2 Bridge UI
    app.post("/api/profile/wallet-verify", async (req, res) => {
      const { user_id, wallet_address } = req.body || {};

      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }

      if (!wallet_address) {
        return res.status(400).json({ error: "wallet_address is required" });
      }

      // Validate Ethereum address format (0x followed by 40 hex chars)
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      const normalizedAddress = String(wallet_address).toLowerCase();

      if (!ethAddressRegex.test(normalizedAddress)) {
        return res.status(400).json({
          error: "Invalid Ethereum address format",
        });
      }

      try {
        // Check if wallet is already connected to a different user
        const { data: existingUser, error: checkError } = await adminSupabase
          .from("user_profiles")
          .select("id, username")
          .eq("wallet_address", normalizedAddress)
          .neq("id", user_id)
          .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116 = no rows returned (expected)
          console.error("[Wallet Verify] Check error:", checkError);
          return res.status(500).json({
            error: "Failed to verify wallet availability",
          });
        }

        if (existingUser) {
          return res.status(409).json({
            error: "This wallet is already connected to another account",
          });
        }

        // Update user profile with wallet address
        const { data, error } = await adminSupabase
          .from("user_profiles")
          .update({ wallet_address: normalizedAddress })
          .eq("id", user_id)
          .select()
          .single();

        if (error) {
          console.error("[Wallet Verify] Update error:", error);
          return res.status(500).json({
            error: error.message || "Failed to connect wallet",
          });
        }

        console.log("[Wallet Verify] Wallet connected for user:", user_id);

        return res.json({
          ok: true,
          message: "Wallet connected successfully",
          wallet_address: normalizedAddress,
          user: data,
        });
      } catch (e: any) {
        console.error("[Wallet Verify] Exception:", e?.message);
        return res.status(500).json({
          error: e?.message || "Failed to connect wallet",
        });
      }
    });

    // Wallet disconnection endpoint
    app.delete("/api/profile/wallet-verify", async (req, res) => {
      const { user_id } = req.body || {};

      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }

      try {
        const { data, error } = await adminSupabase
          .from("user_profiles")
          .update({ wallet_address: null })
          .eq("id", user_id)
          .select()
          .single();

        if (error) {
          console.error("[Wallet Verify] Disconnect error:", error);
          return res.status(500).json({
            error: error.message || "Failed to disconnect wallet",
          });
        }

        console.log("[Wallet Verify] Wallet disconnected for user:", user_id);

        return res.json({
          ok: true,
          message: "Wallet disconnected successfully",
          user: data,
        });
      } catch (e: any) {
        console.error("[Wallet Verify] Disconnect exception:", e?.message);
        return res.status(500).json({
          error: e?.message || "Failed to disconnect wallet",
        });
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

    app.post("/api/achievements/activate", async (req, res) => {
      try {
        const CORE_ACHIEVEMENTS = [
          {
            id: "welcome-to-aethex",
            name: "Welcome to AeThex",
            description: "Completed onboarding and joined the AeThex network.",
            icon: "🎉",
            badge_color: "#7C3AED",
            xp_reward: 250,
          },
          {
            id: "aethex-explorer",
            name: "AeThex Explorer",
            description:
              "Engaged with community initiatives and posted first update.",
            icon: "🧭",
            badge_color: "#0EA5E9",
            xp_reward: 400,
          },
          {
            id: "community-champion",
            name: "Community Champion",
            description:
              "Contributed feedback, resolved bugs, and mentored squads.",
            icon: "🏆",
            badge_color: "#22C55E",
            xp_reward: 750,
          },
          {
            id: "workshop-architect",
            name: "Workshop Architect",
            description:
              "Published a high-impact mod or toolkit adopted by teams.",
            icon: "��️",
            badge_color: "#F97316",
            xp_reward: 1200,
          },
          {
            id: "god-mode",
            name: "GOD Mode",
            description:
              "Legendary status awarded by AeThex studio leadership.",
            icon: "⚡",
            badge_color: "#FACC15",
            xp_reward: 5000,
          },
        ];

        const nowIso = new Date().toISOString();

        const achievementResults = await Promise.all(
          CORE_ACHIEVEMENTS.map(async (achievement) => {
            const { createHash } = await import("crypto");
            const generateDeterministicUUID = (str: string): string => {
              const hash = createHash("sha256").update(str).digest("hex");
              return [
                hash.slice(0, 8),
                hash.slice(8, 12),
                "5" + hash.slice(13, 16),
                ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80)
                  .toString(16)
                  .padStart(2, "0") + hash.slice(18, 20),
                hash.slice(20, 32),
              ].join("-");
            };

            const uuidId = generateDeterministicUUID(achievement.id);
            const { error } = await adminSupabase.from("achievements").upsert(
              {
                id: uuidId,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                badge_color: achievement.badge_color,
                xp_reward: achievement.xp_reward,
              },
              { onConflict: "id" },
            );

            if (error) {
              console.error(
                `Failed to upsert achievement ${achievement.id}:`,
                error,
              );
              throw error;
            }
            return achievement.id;
          }),
        );

        return res.json({
          ok: true,
          achievementsSeeded: achievementResults.length,
          achievements: achievementResults,
        });
      } catch (error: any) {
        console.error("activate achievements error", error);
        return res.status(500).json({
          error: error?.message || "Failed to activate achievements",
        });
      }
    });

    // Blog endpoints (Supabase-backed)
    app.get("/api/blog", async (req, res) => {
      const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
      const category = String(req.query.category || "").trim();
      try {
        let query = adminSupabase
          .from("blog_posts")
          .select(
            "id, slug, title, excerpt, author, date, read_time, category, image, likes, comments, published_at, body_html",
          )
          .order("published_at", { ascending: false, nullsLast: true } as any)
          .limit(limit);
        if (category) query = query.eq("category", category);
        const { data, error } = await query;
        if (error) {
          // If table doesn't exist, return empty array (client will use seed data)
          if (
            error.message?.includes("does not exist") ||
            error.code === "42P01"
          ) {
            console.log(
              "[Blog] blog_posts table not found, returning empty array",
            );
            return res.json([]);
          }
          console.error("[Blog] Error fetching blog posts:", error);
          return res.status(500).json({ error: error.message });
        }
        console.log(
          "[Blog] Successfully fetched",
          (data || []).length,
          "blog posts",
        );
        res.json(data || []);
      } catch (e: any) {
        console.error("[Blog] Exception:", e);
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
        if (error) {
          if (error.code === "PGRST116") {
            // No rows returned - 404
            return res.status(404).json({ error: "Blog post not found" });
          }
          if (
            error.message?.includes("does not exist") ||
            error.code === "42P01"
          ) {
            // Table doesn't exist
            return res.status(404).json({ error: "Blog not configured" });
          }
          return res.status(500).json({ error: error.message });
        }
        res.json(data || null);
      } catch (e: any) {
        console.error("[Blog] Error fetching blog post:", e);
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

    app.get("/api/applications-old", async (req, res) => {
      const owner = String(req.query.owner || "");
      if (!owner) return res.status(400).json({ error: "owner required" });
      try {
        const { data, error } = await adminSupabase
          .from("aethex_applications")
          .select(`*`)
          .eq("creator_id", owner)
          .order("applied_at", { ascending: false })
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

    // Get following list
    app.get("/api/social/following", async (req, res) => {
      const userId = req.query.userId as string;
      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId query parameter required" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", userId);

        if (error) {
          return res
            .status(500)
            .json({ error: "Failed to fetch following list" });
        }

        return res.json({
          data: (data || []).map((r: any) => r.following_id),
        });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Get followers list
    app.get("/api/social/followers", async (req, res) => {
      const userId = req.query.userId as string;
      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId query parameter required" });
      }
      try {
        const { data, error } = await adminSupabase
          .from("user_follows")
          .select("follower_id")
          .eq("following_id", userId);

        if (error) {
          return res
            .status(500)
            .json({ error: "Failed to fetch followers list" });
        }

        return res.json({
          data: (data || []).map((r: any) => r.follower_id),
        });
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
        // Get post author info before liking
        const { data: post } = await adminSupabase
          .from("community_posts")
          .select("user_id")
          .eq("id", postId)
          .single();

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

        // Notify post author of like (only if different user)
        if (post?.user_id && post.user_id !== user_id) {
          try {
            const { data: liker } = await adminSupabase
              .from("user_profiles")
              .select("full_name, username")
              .eq("id", user_id)
              .single();

            const likerName =
              (liker as any)?.full_name ||
              (liker as any)?.username ||
              "Someone";
            await adminSupabase.from("notifications").insert({
              user_id: post.user_id,
              type: "info",
              title: "❤️ Your post was liked",
              message: `${likerName} liked your post.`,
            });
          } catch (notifError) {
            console.warn("Failed to create like notification:", notifError);
          }
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
        // Get post author info
        const { data: post } = await adminSupabase
          .from("community_posts")
          .select("user_id")
          .eq("id", postId)
          .single();

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

        // Notify post author of comment (only if different user)
        if (post?.user_id && post.user_id !== user_id) {
          try {
            const { data: commenter } = await adminSupabase
              .from("user_profiles")
              .select("full_name, username")
              .eq("id", user_id)
              .single();

            const commenterName =
              (commenter as any)?.full_name ||
              (commenter as any)?.username ||
              "Someone";
            const preview =
              content.substring(0, 50) + (content.length > 50 ? "..." : "");
            await adminSupabase.from("notifications").insert({
              user_id: post.user_id,
              type: "info",
              title: "💬 New comment on your post",
              message: `${commenterName} commented: "${preview}"`,
            });
          } catch (notifError) {
            console.warn("Failed to create comment notification:", notifError);
          }
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

    // Creator Network API Routes

    // Get all creators with filters
    app.get("/api/creators", async (req, res) => {
      try {
        const arm = String(req.query.arm || "").trim();
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
        const search = String(req.query.search || "").trim();

        let query = adminSupabase
          .from("aethex_creators")
          .select(
            `
            id,
            username,
            bio,
            skills,
            avatar_url,
            experience_level,
            arm_affiliations,
            primary_arm,
            created_at
            `,
            { count: "exact" },
          )
          .eq("is_discoverable", true)
          .order("created_at", { ascending: false });

        if (arm) {
          query = query.contains("arm_affiliations", [arm]);
        }

        if (search) {
          query = query.or(`username.ilike.%${search}%,bio.ilike.%${search}%`);
        }

        const start = (page - 1) * limit;
        query = query.range(start, start + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return res.json({
          data,
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        });
      } catch (e: any) {
        console.error("[Creator API] Error fetching creators:", e?.message);
        return res.status(500).json({ error: "Failed to fetch creators" });
      }
    });

    // Get creator by username
    app.get("/api/creators/:username", async (req, res) => {
      try {
        const username = String(req.params.username || "").trim();
        if (!username) {
          return res.status(400).json({ error: "username required" });
        }

        const { data: creator, error } = await adminSupabase
          .from("aethex_creators")
          .select(
            `
            id,
            username,
            bio,
            skills,
            avatar_url,
            experience_level,
            arm_affiliations,
            primary_arm,
            created_at,
            updated_at
            `,
          )
          .eq("username", username)
          .eq("is_discoverable", true)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return res.status(404).json({ error: "Creator not found" });
          }
          throw error;
        }

        const { data: devConnectLink } = await adminSupabase
          .from("aethex_devconnect_links")
          .select("devconnect_username, devconnect_profile_url")
          .eq("aethex_creator_id", creator.id)
          .maybeSingle();

        return res.json({
          ...creator,
          devconnect_link: devConnectLink,
        });
      } catch (e: any) {
        console.error("[Creator API] Error fetching creator:", e?.message);
        return res.status(500).json({ error: "Failed to fetch creator" });
      }
    });

    // Get creator by user_id
    app.get("/api/creators/user/:userId", async (req, res) => {
      try {
        const userId = String(req.params.userId || "").trim();
        if (!userId) {
          return res.status(400).json({ error: "userId required" });
        }

        const { data: creator, error } = await adminSupabase
          .from("aethex_creators")
          .select(
            `
            id,
            user_id,
            username,
            bio,
            skills,
            avatar_url,
            experience_level,
            arm_affiliations,
            primary_arm,
            spotify_profile_url,
            created_at,
            updated_at
            `,
          )
          .eq("user_id", userId)
          .eq("is_discoverable", true)
          .maybeSingle();

        if (!creator) {
          return res.status(404).json({ error: "Creator not found" });
        }

        if (error) throw error;

        const { data: devConnectLink } = await adminSupabase
          .from("aethex_devconnect_links")
          .select("devconnect_username, devconnect_profile_url")
          .eq("aethex_creator_id", creator.id)
          .maybeSingle();

        return res.json({
          ...creator,
          devconnect_link: devConnectLink,
        });
      } catch (e: any) {
        console.error(
          "[Creator API] Error fetching creator by user_id:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to fetch creator" });
      }
    });

    // Create creator profile
    app.post("/api/creators", async (req, res) => {
      try {
        const {
          user_id,
          username,
          bio,
          skills,
          avatar_url,
          experience_level,
          primary_arm,
          arm_affiliations,
        } = req.body;

        if (!user_id || !username) {
          return res
            .status(400)
            .json({ error: "user_id and username required" });
        }

        const { data, error } = await adminSupabase
          .from("aethex_creators")
          .insert({
            user_id,
            username,
            bio: bio || null,
            skills: Array.isArray(skills) ? skills : [],
            avatar_url: avatar_url || null,
            experience_level: experience_level || null,
            primary_arm: primary_arm || null,
            arm_affiliations: Array.isArray(arm_affiliations)
              ? arm_affiliations
              : [],
          })
          .select()
          .single();

        if (error) {
          if (error.code === "23505") {
            return res.status(400).json({ error: "Username already taken" });
          }
          throw error;
        }

        return res.status(201).json(data);
      } catch (e: any) {
        console.error("[Creator API] Error creating creator:", e?.message);
        return res
          .status(500)
          .json({ error: "Failed to create creator profile" });
      }
    });

    // Update creator profile
    app.put("/api/creators/:id", async (req, res) => {
      try {
        const creatorId = String(req.params.id || "").trim();
        if (!creatorId) {
          return res.status(400).json({ error: "creator id required" });
        }

        const {
          bio,
          skills,
          avatar_url,
          experience_level,
          primary_arm,
          arm_affiliations,
          is_discoverable,
          allow_recommendations,
        } = req.body;

        const { data, error } = await adminSupabase
          .from("aethex_creators")
          .update({
            bio,
            skills: Array.isArray(skills) ? skills : undefined,
            avatar_url,
            experience_level,
            primary_arm,
            arm_affiliations: Array.isArray(arm_affiliations)
              ? arm_affiliations
              : undefined,
            is_discoverable,
            allow_recommendations,
            updated_at: new Date().toISOString(),
          })
          .eq("id", creatorId)
          .select()
          .single();

        if (error) throw error;

        return res.json(data);
      } catch (e: any) {
        console.error("[Creator API] Error updating creator:", e?.message);
        return res
          .status(500)
          .json({ error: "Failed to update creator profile" });
      }
    });

    // Get all opportunities with filters
    app.get("/api/opportunities", async (req, res) => {
      try {
        const arm = String(req.query.arm || "").trim();
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
        const sort = String(req.query.sort || "recent");
        const search = String(req.query.search || "").trim();
        const jobType = String(req.query.jobType || "").trim();
        const experienceLevel = String(req.query.experienceLevel || "").trim();

        let query = adminSupabase
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
            created_at
            `,
            { count: "exact" },
          )
          .eq("status", "open");

        if (arm) {
          query = query.eq("arm_affiliation", arm);
        }

        if (search) {
          query = query.or(
            `title.ilike.%${search}%,description.ilike.%${search}%`,
          );
        }

        if (jobType) {
          query = query.eq("job_type", jobType);
        }

        if (experienceLevel) {
          query = query.eq("experience_level", experienceLevel);
        }

        const ascending = sort === "oldest";
        query = query.order("created_at", { ascending });

        const start = (page - 1) * limit;
        query = query.range(start, start + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return res.json({
          data,
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        });
      } catch (e: any) {
        console.error(
          "[Opportunities API] Error fetching opportunities:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to fetch opportunities" });
      }
    });

    // Get opportunity by ID
    app.get("/api/opportunities/:id", async (req, res) => {
      try {
        const opportunityId = String(req.params.id || "").trim();
        if (!opportunityId) {
          return res.status(400).json({ error: "opportunity id required" });
        }

        const { data, error } = await adminSupabase
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
            updated_at
            `,
          )
          .eq("id", opportunityId)
          .eq("status", "open")
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return res.status(404).json({ error: "Opportunity not found" });
          }
          throw error;
        }

        return res.json(data);
      } catch (e: any) {
        console.error(
          "[Opportunities API] Error fetching opportunity:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to fetch opportunity" });
      }
    });

    // Create opportunity
    app.post("/api/opportunities", async (req, res) => {
      try {
        const {
          user_id,
          title,
          description,
          job_type,
          salary_min,
          salary_max,
          experience_level,
          arm_affiliation,
        } = req.body;

        if (!user_id || !title) {
          return res.status(400).json({ error: "user_id and title required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (!creator) {
          return res.status(404).json({
            error: "Creator profile not found. Create profile first.",
          });
        }

        const { data, error } = await adminSupabase
          .from("aethex_opportunities")
          .insert({
            title,
            description: description || null,
            job_type: job_type || null,
            salary_min: salary_min || null,
            salary_max: salary_max || null,
            experience_level: experience_level || null,
            arm_affiliation: arm_affiliation || null,
            posted_by_id: creator.id,
            status: "open",
          })
          .select()
          .single();

        if (error) throw error;

        return res.status(201).json(data);
      } catch (e: any) {
        console.error(
          "[Opportunities API] Error creating opportunity:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to create opportunity" });
      }
    });

    // Update opportunity
    app.put("/api/opportunities/:id", async (req, res) => {
      try {
        const opportunityId = String(req.params.id || "").trim();
        const {
          user_id,
          title,
          description,
          job_type,
          salary_min,
          salary_max,
          experience_level,
          status,
        } = req.body;

        if (!opportunityId || !user_id) {
          return res
            .status(400)
            .json({ error: "opportunity id and user_id required" });
        }

        const { data: opportunity } = await adminSupabase
          .from("aethex_opportunities")
          .select("posted_by_id")
          .eq("id", opportunityId)
          .single();

        if (!opportunity) {
          return res.status(404).json({ error: "Opportunity not found" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (creator?.id !== opportunity.posted_by_id) {
          return res.status(403).json({ error: "Unauthorized" });
        }

        const { data, error } = await adminSupabase
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

        return res.json(data);
      } catch (e: any) {
        console.error(
          "[Opportunities API] Error updating opportunity:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to update opportunity" });
      }
    });

    // Get my applications
    app.get("/api/applications", async (req, res) => {
      try {
        const userId = String(req.query.user_id || "").trim();
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
        const status = String(req.query.status || "").trim();

        if (!userId) {
          return res.status(400).json({ error: "user_id required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (!creator) {
          return res.status(404).json({ error: "Creator profile not found" });
        }

        let query = adminSupabase
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

        return res.json({
          data,
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        });
      } catch (e: any) {
        console.error(
          "[Applications API] Error fetching applications:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to fetch applications" });
      }
    });

    // Submit application
    app.post("/api/applications", async (req, res) => {
      try {
        const { user_id, opportunity_id, cover_letter } = req.body;

        if (!user_id || !opportunity_id) {
          return res
            .status(400)
            .json({ error: "user_id and opportunity_id required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (!creator) {
          return res.status(404).json({ error: "Creator profile not found" });
        }

        const { data: opportunity } = await adminSupabase
          .from("aethex_opportunities")
          .select("id")
          .eq("id", opportunity_id)
          .eq("status", "open")
          .single();

        if (!opportunity) {
          return res
            .status(404)
            .json({ error: "Opportunity not found or closed" });
        }

        const { data: existing } = await adminSupabase
          .from("aethex_applications")
          .select("id")
          .eq("creator_id", creator.id)
          .eq("opportunity_id", opportunity_id)
          .maybeSingle();

        if (existing) {
          return res
            .status(400)
            .json({ error: "You have already applied to this opportunity" });
        }

        const { data, error } = await adminSupabase
          .from("aethex_applications")
          .insert({
            creator_id: creator.id,
            opportunity_id,
            cover_letter: cover_letter || null,
            status: "submitted",
          })
          .select()
          .single();

        if (error) throw error;

        // Notify opportunity poster of new application
        if (opportunity?.posted_by_id) {
          try {
            const { data: creatorProfile } = await adminSupabase
              .from("aethex_creators")
              .select("user_id, full_name")
              .eq("id", creator.id)
              .single();

            await adminSupabase.from("notifications").insert({
              user_id: opportunity.posted_by_id,
              type: "info",
              title: `📋 New Application: ${opportunity.title}`,
              message: `${creatorProfile?.full_name || "A creator"} applied for your opportunity.`,
            });
          } catch (notifError) {
            console.warn(
              "Failed to create application notification:",
              notifError,
            );
          }
        }

        return res.status(201).json(data);
      } catch (e: any) {
        console.error(
          "[Applications API] Error submitting application:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to submit application" });
      }
    });

    // Update application status
    app.put("/api/applications/:id", async (req, res) => {
      try {
        const applicationId = String(req.params.id || "").trim();
        const { user_id, status, response_message } = req.body;

        if (!applicationId || !user_id) {
          return res
            .status(400)
            .json({ error: "application id and user_id required" });
        }

        const { data: application } = await adminSupabase
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
          return res.status(404).json({ error: "Application not found" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (creator?.id !== application.aethex_opportunities.posted_by_id) {
          return res.status(403).json({ error: "Unauthorized" });
        }

        const { data, error } = await adminSupabase
          .from("aethex_applications")
          .update({
            status,
            response_message: response_message || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", applicationId)
          .select()
          .single();

        if (error) throw error;

        // Notify applicant of status change
        if (data) {
          try {
            const { data: applicantProfile } = await adminSupabase
              .from("aethex_creators")
              .select("user_id")
              .eq("id", data.creator_id)
              .single();

            if (applicantProfile?.user_id) {
              const statusEmoji =
                status === "accepted"
                  ? "✅"
                  : status === "rejected"
                    ? "❌"
                    : "📝";
              const statusMessage =
                status === "accepted"
                  ? "accepted"
                  : status === "rejected"
                    ? "rejected"
                    : "updated";

              await adminSupabase.from("notifications").insert({
                user_id: applicantProfile.user_id,
                type:
                  status === "accepted"
                    ? "success"
                    : status === "rejected"
                      ? "error"
                      : "info",
                title: `${statusEmoji} Application ${statusMessage}`,
                message:
                  response_message ||
                  `Your application has been ${statusMessage}.`,
              });
            }
          } catch (notifError) {
            console.warn("Failed to create status notification:", notifError);
          }
        }

        return res.json(data);
      } catch (e: any) {
        console.error(
          "[Applications API] Error updating application:",
          e?.message,
        );
        return res.status(500).json({ error: "Failed to update application" });
      }
    });

    // Withdraw application
    app.delete("/api/applications/:id", async (req, res) => {
      try {
        const applicationId = String(req.params.id || "").trim();
        const { user_id } = req.body;

        if (!applicationId || !user_id) {
          return res
            .status(400)
            .json({ error: "application id and user_id required" });
        }

        const { data: application } = await adminSupabase
          .from("aethex_applications")
          .select("creator_id")
          .eq("id", applicationId)
          .single();

        if (!application) {
          return res.status(404).json({ error: "Application not found" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (creator?.id !== application.creator_id) {
          return res.status(403).json({ error: "Unauthorized" });
        }

        const { error } = await adminSupabase
          .from("aethex_applications")
          .delete()
          .eq("id", applicationId);

        if (error) throw error;

        return res.json({ ok: true });
      } catch (e: any) {
        console.error(
          "[Applications API] Error withdrawing application:",
          e?.message,
        );
        return res
          .status(500)
          .json({ error: "Failed to withdraw application" });
      }
    });

    // Link DevConnect account
    app.post("/api/devconnect/link", async (req, res) => {
      try {
        const { user_id, devconnect_username, devconnect_profile_url } =
          req.body;

        if (!user_id || !devconnect_username) {
          return res
            .status(400)
            .json({ error: "user_id and devconnect_username required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (!creator) {
          return res.status(404).json({
            error: "Creator profile not found. Create profile first.",
          });
        }

        const { data: existing } = await adminSupabase
          .from("aethex_devconnect_links")
          .select("id")
          .eq("aethex_creator_id", creator.id)
          .maybeSingle();

        let result;
        let status = 201;

        if (existing) {
          const { data, error } = await adminSupabase
            .from("aethex_devconnect_links")
            .update({
              devconnect_username,
              devconnect_profile_url:
                devconnect_profile_url ||
                `https://dev-link.me/${devconnect_username}`,
            })
            .eq("aethex_creator_id", creator.id)
            .select()
            .single();

          if (error) throw error;
          result = data;
          status = 200;
        } else {
          const { data, error } = await adminSupabase
            .from("aethex_devconnect_links")
            .insert({
              aethex_creator_id: creator.id,
              devconnect_username,
              devconnect_profile_url:
                devconnect_profile_url ||
                `https://dev-link.me/${devconnect_username}`,
            })
            .select()
            .single();

          if (error) throw error;
          result = data;
        }

        await adminSupabase
          .from("aethex_creators")
          .update({ devconnect_linked: true })
          .eq("id", creator.id);

        return res.status(status).json(result);
      } catch (e: any) {
        console.error("[DevConnect API] Error linking account:", e?.message);
        return res
          .status(500)
          .json({ error: "Failed to link DevConnect account" });
      }
    });

    // Get DevConnect link
    app.get("/api/devconnect/link", async (req, res) => {
      try {
        const userId = String(req.query.user_id || "").trim();

        if (!userId) {
          return res.status(400).json({ error: "user_id required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (!creator) {
          return res.status(404).json({ error: "Creator profile not found" });
        }

        const { data, error } = await adminSupabase
          .from("aethex_devconnect_links")
          .select("*")
          .eq("aethex_creator_id", creator.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        return res.json({ data: data || null });
      } catch (e: any) {
        console.error("[DevConnect API] Error fetching link:", e?.message);
        return res
          .status(500)
          .json({ error: "Failed to fetch DevConnect link" });
      }
    });

    // Unlink DevConnect account
    app.delete("/api/devconnect/link", async (req, res) => {
      try {
        const { user_id } = req.body;

        if (!user_id) {
          return res.status(400).json({ error: "user_id required" });
        }

        const { data: creator } = await adminSupabase
          .from("aethex_creators")
          .select("id")
          .eq("user_id", user_id)
          .single();

        if (!creator) {
          return res.status(404).json({ error: "Creator profile not found" });
        }

        const { error } = await adminSupabase
          .from("aethex_devconnect_links")
          .delete()
          .eq("aethex_creator_id", creator.id);

        if (error) throw error;

        await adminSupabase
          .from("aethex_creators")
          .update({ devconnect_linked: false })
          .eq("id", creator.id);

        return res.json({ ok: true });
      } catch (e: any) {
        console.error("[DevConnect API] Error unlinking account:", e?.message);
        return res
          .status(500)
          .json({ error: "Failed to unlink DevConnect account" });
      }
    });

    // Ethos Tracks API
    app.get("/api/ethos/tracks", async (req, res) => {
      try {
        const {
          limit = 50,
          offset = 0,
          genre,
          licenseType,
          search,
        } = req.query;

        let dbQuery = adminSupabase
          .from("ethos_tracks")
          .select(
            `
            id,
            user_id,
            title,
            description,
            file_url,
            duration_seconds,
            genre,
            license_type,
            bpm,
            is_published,
            download_count,
            rating,
            price,
            created_at,
            updated_at,
            user_profiles(id, full_name, avatar_url)
          `,
            { count: "exact" },
          )
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (genre) dbQuery = dbQuery.contains("genre", [genre]);
        if (licenseType) dbQuery = dbQuery.eq("license_type", licenseType);
        if (search) {
          dbQuery = dbQuery.or(
            `title.ilike.%${search}%,description.ilike.%${search}%`,
          );
        }

        const { data, error, count } = await dbQuery.range(
          Number(offset),
          Number(offset) + Number(limit) - 1,
        );

        if (error) throw error;

        res.json({
          data: data || [],
          total: count,
          limit: Number(limit),
          offset: Number(offset),
        });
      } catch (e: any) {
        console.error("[Ethos Tracks API] Error fetching tracks:", e?.message);
        res.status(500).json({ error: e?.message || "Failed to fetch tracks" });
      }
    });

    app.post("/api/ethos/tracks", async (req, res) => {
      try {
        const userId = req.headers["x-user-id"] || req.body?.user_id;
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const {
          title,
          description,
          file_url,
          duration_seconds,
          genre,
          license_type,
          bpm,
          is_published,
          price,
        } = req.body;

        if (!title || !file_url || !license_type) {
          return res.status(400).json({
            error: "Missing required fields: title, file_url, license_type",
          });
        }

        const { data, error } = await adminSupabase
          .from("ethos_tracks")
          .insert([
            {
              user_id: userId,
              title,
              description,
              file_url,
              duration_seconds,
              genre: genre || [],
              license_type,
              bpm,
              is_published: is_published !== false,
              price,
            },
          ])
          .select();

        if (error) throw error;

        if (license_type === "ecosystem" && data && data[0]) {
          const trackId = data[0].id;
          await adminSupabase.from("ethos_ecosystem_licenses").insert([
            {
              track_id: trackId,
              artist_id: userId,
              accepted_at: new Date().toISOString(),
            },
          ]);
        }

        res.status(201).json(data[0]);
      } catch (e: any) {
        console.error("[Ethos Tracks API] Error creating track:", e?.message);
        res.status(500).json({ error: e?.message || "Failed to create track" });
      }
    });

    // Ethos Artists API
    app.get("/api/ethos/artists", async (req, res) => {
      try {
        const { id, limit = 50, offset = 0, verified, forHire } = req.query;

        if (id) {
          // Get single artist by ID
          const { data: artist, error: artistError } = await adminSupabase
            .from("ethos_artist_profiles")
            .select(
              `
              user_id,
              skills,
              for_hire,
              bio,
              portfolio_url,
              sample_price_track,
              sample_price_sfx,
              sample_price_score,
              turnaround_days,
              verified,
              total_downloads,
              created_at,
              user_profiles(id, full_name, avatar_url, email)
            `,
            )
            .eq("user_id", id)
            .single();

          if (artistError && artistError.code !== "PGRST116") throw artistError;

          if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
          }

          const { data: tracks } = await adminSupabase
            .from("ethos_tracks")
            .select("*")
            .eq("user_id", id)
            .eq("is_published", true)
            .order("created_at", { ascending: false });

          return res.json({
            ...artist,
            tracks: tracks || [],
          });
        }

        // Get list of artists
        let dbQuery = adminSupabase.from("ethos_artist_profiles").select(
          `
          user_id,
          skills,
          for_hire,
          bio,
          portfolio_url,
          sample_price_track,
          sample_price_sfx,
          sample_price_score,
          turnaround_days,
          verified,
          total_downloads,
          created_at,
          user_profiles(id, full_name, avatar_url)
        `,
          { count: "exact" },
        );

        if (verified === "true") dbQuery = dbQuery.eq("verified", true);
        if (forHire === "true") dbQuery = dbQuery.eq("for_hire", true);

        const { data, error, count } = await dbQuery
          .order("verified", { ascending: false })
          .order("total_downloads", { ascending: false })
          .range(Number(offset), Number(offset) + Number(limit) - 1);

        if (error) throw error;

        res.json({
          data: data || [],
          total: count,
          limit: Number(limit),
          offset: Number(offset),
        });
      } catch (e: any) {
        console.error(
          "[Ethos Artists API] Error fetching artists:",
          e?.message,
        );
        res
          .status(500)
          .json({ error: e?.message || "Failed to fetch artists" });
      }
    });

    app.put("/api/ethos/artists", async (req, res) => {
      try {
        const userId = req.headers["x-user-id"] || req.body?.user_id;
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const {
          skills,
          for_hire,
          bio,
          portfolio_url,
          sample_price_track,
          sample_price_sfx,
          sample_price_score,
          turnaround_days,
        } = req.body;

        const { data, error } = await adminSupabase
          .from("ethos_artist_profiles")
          .upsert(
            {
              user_id: userId,
              skills: skills || [],
              for_hire: for_hire !== false,
              bio,
              portfolio_url,
              sample_price_track,
              sample_price_sfx,
              sample_price_score,
              turnaround_days,
            },
            { onConflict: "user_id" },
          )
          .select();

        if (error) throw error;
        res.json(data[0]);
      } catch (e: any) {
        console.error("[Ethos Artists API] Error updating artist:", e?.message);
        res
          .status(500)
          .json({ error: e?.message || "Failed to update artist profile" });
      }
    });

    // Task assignment with notification
    app.post("/api/tasks", async (req, res) => {
      try {
        const {
          project_id,
          title,
          description,
          assignee_id,
          due_date,
          user_id,
        } = req.body;

        if (!project_id || !title || !user_id) {
          return res
            .status(400)
            .json({ error: "project_id, title, and user_id required" });
        }

        const { data, error } = await adminSupabase
          .from("project_tasks")
          .insert({
            project_id,
            title,
            description: description || null,
            assignee_id: assignee_id || null,
            due_date: due_date || null,
            status: "open",
          })
          .select()
          .single();

        if (error) throw error;

        // Notify assignee if assigned
        if (assignee_id && assignee_id !== user_id) {
          try {
            const { data: assigner } = await adminSupabase
              .from("user_profiles")
              .select("full_name, username")
              .eq("id", user_id)
              .single();

            const assignerName =
              (assigner as any)?.full_name ||
              (assigner as any)?.username ||
              "Someone";
            await adminSupabase.from("notifications").insert({
              user_id: assignee_id,
              type: "info",
              title: "📋 Task assigned to you",
              message: `${assignerName} assigned you a task: "${title}"`,
            });
          } catch (notifError) {
            console.warn("Failed to create task notification:", notifError);
          }
        }

        return res.status(201).json(data);
      } catch (e: any) {
        console.error("[Tasks API] Error creating task:", e?.message);
        return res.status(500).json({ error: "Failed to create task" });
      }
    });

    // Assign task with notification
    app.put("/api/tasks/:id/assign", async (req, res) => {
      try {
        const taskId = String(req.params.id || "").trim();
        const { assignee_id, user_id } = req.body;

        if (!taskId || !assignee_id || !user_id) {
          return res
            .status(400)
            .json({ error: "task id, assignee_id, and user_id required" });
        }

        const { data: task } = await adminSupabase
          .from("project_tasks")
          .select("title")
          .eq("id", taskId)
          .single();

        if (!task) {
          return res.status(404).json({ error: "Task not found" });
        }

        const { data, error } = await adminSupabase
          .from("project_tasks")
          .update({ assignee_id })
          .eq("id", taskId)
          .select()
          .single();

        if (error) throw error;

        // Notify assignee
        try {
          const { data: assigner } = await adminSupabase
            .from("user_profiles")
            .select("full_name, username")
            .eq("id", user_id)
            .single();

          const assignerName =
            (assigner as any)?.full_name ||
            (assigner as any)?.username ||
            "Someone";
          await adminSupabase.from("notifications").insert({
            user_id: assignee_id,
            type: "info",
            title: "📋 Task assigned to you",
            message: `${assignerName} assigned you: "${task.title}"`,
          });
        } catch (notifError) {
          console.warn("Failed to create assignment notification:", notifError);
        }

        return res.json(data);
      } catch (e: any) {
        console.error("[Tasks API] Error assigning task:", e?.message);
        return res.status(500).json({ error: "Failed to assign task" });
      }
    });

    // Moderation report with staff notification
    app.post("/api/moderation/reports", async (req, res) => {
      try {
        const { reported_user_id, report_type, description, reporter_id } =
          req.body;

        if (!reported_user_id || !report_type || !reporter_id) {
          return res.status(400).json({
            error: "reported_user_id, report_type, and reporter_id required",
          });
        }

        const { data, error } = await adminSupabase
          .from("moderation_reports")
          .insert({
            reported_user_id,
            report_type,
            description: description || null,
            reporter_id,
            status: "pending",
          })
          .select()
          .single();

        if (error) throw error;

        // Notify staff members
        try {
          const { data: staffUsers } = await adminSupabase
            .from("user_roles")
            .select("user_id")
            .in("role", ["owner", "admin", "moderator"]);

          if (staffUsers && staffUsers.length > 0) {
            const notifications = staffUsers.map((staff: any) => ({
              user_id: staff.user_id,
              type: "warning",
              title: "🚨 New moderation report",
              message: `A ${report_type} report has been submitted. Please review.`,
            }));

            await adminSupabase.from("notifications").insert(notifications);
          }
        } catch (notifError) {
          console.warn("Failed to notify staff:", notifError);
        }

        return res.status(201).json(data);
      } catch (e: any) {
        console.error("[Moderation API] Error creating report:", e?.message);
        return res.status(500).json({ error: "Failed to create report" });
      }
    });

    // Staff Members API
    app.get("/api/staff/members", async (_req, res) => {
      try {
        console.log(
          "[Staff] GET /api/staff/members - adminSupabase initialized:",
          !!adminSupabase,
        );

        if (!adminSupabase) {
          console.error("[Staff] adminSupabase is not initialized");
          return res.status(500).json({
            error: "Supabase client not initialized",
            message: "SUPABASE_URL or SUPABASE_SERVICE_ROLE not set",
          });
        }

        const { data, error } = await adminSupabase
          .from("staff_members")
          .select("*")
          .order("full_name", { ascending: true });

        if (error) {
          console.error("[Staff] Error fetching staff members:", error);
          if (isTableMissing(error)) {
            console.log("[Staff] Table not found, returning empty array");
            return res.json([]);
          }
          return res.status(500).json({ error: error.message });
        }

        console.log(
          "[Staff] Successfully fetched",
          (data || []).length,
          "staff members",
        );
        return res.json(data || []);
      } catch (e: any) {
        console.error("[Staff] Unexpected error:", e);
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/staff/members/seed", async (req, res) => {
      try {
        // Ensure response headers are set correctly
        res.setHeader("Content-Type", "application/json");

        if (!adminSupabase) {
          console.error("[Staff Seed] adminSupabase is not initialized");
          return res.status(500).json({
            error: "Supabase client not initialized",
            message: "SUPABASE_URL or SUPABASE_SERVICE_ROLE not set",
          });
        }

        // First, check if table exists and is accessible
        const { data: existingData, error: existingError } = await adminSupabase
          .from("staff_members")
          .select("count")
          .limit(1);

        if (existingError) {
          console.error("[Staff Seed] Table check error:", existingError);
          return res.status(500).json({
            error: "Cannot access staff_members table",
            tableError: existingError,
          });
        }

        console.log("[Staff Seed] Table exists and is accessible");

        const mockMembers = [
          {
            email: "alex@aethex.dev",
            full_name: "Alex Chen",
            position: "Founder & CEO",
            department: "Executive",
            phone: "+1 (555) 000-0001",
            role: "owner",
            location: "San Francisco, CA",
          },
          {
            email: "jordan@aethex.dev",
            full_name: "Jordan Martinez",
            position: "CTO",
            department: "Engineering",
            phone: "+1 (555) 000-0002",
            role: "admin",
            location: "New York, NY",
          },
          {
            email: "sam@aethex.dev",
            full_name: "Sam Patel",
            position: "Community Manager",
            department: "Community",
            phone: "+1 (555) 000-0003",
            role: "staff",
            location: "Austin, TX",
          },
          {
            email: "taylor@aethex.dev",
            full_name: "Taylor Kim",
            position: "Operations Lead",
            department: "Operations",
            phone: "+1 (555) 000-0004",
            role: "staff",
            location: "Seattle, WA",
          },
          {
            email: "casey@aethex.dev",
            full_name: "Casey Zhang",
            position: "Software Engineer",
            department: "Engineering",
            phone: "+1 (555) 000-0005",
            role: "employee",
            location: "San Francisco, CA",
          },
          {
            email: "morgan@aethex.dev",
            full_name: "Morgan Lee",
            position: "Designer",
            department: "Design",
            phone: "+1 (555) 000-0006",
            role: "employee",
            location: "Los Angeles, CA",
          },
          {
            email: "alex.kim@aethex.dev",
            full_name: "Alex Kim",
            position: "Marketing Manager",
            department: "Marketing",
            phone: "+1 (555) 000-0007",
            role: "staff",
            location: "Boston, MA",
          },
          {
            email: "jordan.lee@aethex.dev",
            full_name: "Jordan Lee",
            position: "Data Analyst",
            department: "Analytics",
            phone: "+1 (555) 000-0008",
            role: "employee",
            location: "Denver, CO",
          },
        ];

        try {
          const { data, error } = await adminSupabase
            .from("staff_members")
            .upsert(mockMembers, { onConflict: "email" })
            .select();

          if (error) {
            console.error("[Staff Seed Error] Supabase error:", error);
            return res.status(500).json({
              error: "Failed to seed staff members",
              supabaseError: error,
              mockMembersCount: mockMembers.length,
            });
          }

          console.log(
            "[Staff Seed Success] Inserted",
            data?.length || 0,
            "members",
          );

          const response = {
            success: true,
            count: data?.length || 0,
            members: data || [],
          };

          return res.status(201).json(response);
        } catch (insertError: any) {
          console.error("[Staff Seed Insert Error]", insertError);
          return res.status(500).json({
            error: "Exception during insert",
            message: insertError?.message || String(insertError),
          });
        }
      } catch (e: any) {
        console.error("[Staff Seed Exception]", e);
        res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.post("/api/staff/members", async (req, res) => {
      try {
        const {
          user_id,
          email,
          full_name,
          position,
          department,
          phone,
          avatar_url,
          role,
          hired_date,
        } = req.body || {};

        if (!email || !full_name) {
          return res.status(400).json({
            error: "Missing required fields: email, full_name",
          });
        }

        const { data, error } = await adminSupabase
          .from("staff_members")
          .insert([
            {
              user_id: user_id || null,
              email,
              full_name,
              position: position || null,
              department: department || null,
              phone: phone || null,
              avatar_url: avatar_url || null,
              role: role || "employee",
              hired_date: hired_date || null,
            },
          ])
          .select();

        if (error) {
          return res.status(500).json({
            error: "Failed to create staff member",
            details: error.message,
          });
        }

        return res.status(201).json(data?.[0] || {});
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.get("/api/staff/members-detail", async (req, res) => {
      try {
        const id = String(req.query.id || "");
        if (!id) {
          return res.status(400).json({ error: "Missing staff member ID" });
        }

        const { data, error } = await adminSupabase
          .from("staff_members")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          return res.status(404).json({ error: "Staff member not found" });
        }

        return res.json(data);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.put("/api/staff/members-detail", async (req, res) => {
      try {
        const id = String(req.query.id || "");
        if (!id) {
          return res.status(400).json({ error: "Missing staff member ID" });
        }

        const updates = req.body || {};

        const { data, error } = await adminSupabase
          .from("staff_members")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return res.status(500).json({
            error: "Failed to update staff member",
            details: error.message,
          });
        }

        if (!data) {
          return res.status(404).json({ error: "Staff member not found" });
        }

        return res.json(data);
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    app.delete("/api/staff/members-detail", async (req, res) => {
      try {
        const id = String(req.query.id || "");
        if (!id) {
          return res.status(400).json({ error: "Missing staff member ID" });
        }

        const { error } = await adminSupabase
          .from("staff_members")
          .delete()
          .eq("id", id);

        if (error) {
          return res.status(500).json({
            error: "Failed to delete staff member",
            details: error.message,
          });
        }

        return res.json({ success: true, id });
      } catch (e: any) {
        return res.status(500).json({ error: e?.message || String(e) });
      }
    });

    // Track device login and send security alert
    app.post("/api/auth/login-device", async (req, res) => {
      try {
        const { user_id, device_name, ip_address, user_agent } = req.body;

        if (!user_id) {
          return res.status(400).json({ error: "user_id required" });
        }

        // Store device login
        const { data: sessionData } = await adminSupabase
          .from("game_sessions")
          .insert({
            user_id,
            device_id: device_name || "Unknown Device",
            ip_address: ip_address || null,
            user_agent: user_agent || null,
            session_token: randomUUID(),
          })
          .select()
          .single();

        // Check if this is a new device (security alert)
        const { data: previousSessions } = await adminSupabase
          .from("game_sessions")
          .select("device_id")
          .eq("user_id", user_id)
          .neq("device_id", device_name || "Unknown Device");

        // If new device, send security notification
        if (!previousSessions || previousSessions.length === 0) {
          try {
            await adminSupabase.from("notifications").insert({
              user_id,
              type: "warning",
              title: "🔐 New device login detected",
              message: `New login from ${device_name || "Unknown device"} at ${ip_address || "Unknown location"}. If this wasn't you, please secure your account.`,
            });
          } catch (notifError) {
            console.warn("Failed to create security notification:", notifError);
          }
        }

        return res.status(201).json(sessionData);
      } catch (e: any) {
        console.error("[Auth API] Error tracking login:", e?.message);
        return res.status(500).json({ error: "Failed to track login" });
      }
    });

    // Admin endpoint to delete user account
    app.delete("/api/admin/users/delete", async (req, res) => {
      try {
        const adminToken =
          req.headers.authorization?.replace("Bearer ", "") || "";

        if (adminToken !== process.env.DISCORD_ADMIN_REGISTER_TOKEN) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const { email } = req.body;

        if (!email) {
          return res.status(400).json({ error: "Missing email parameter" });
        }

        // Get the user by email
        const { data: profile, error: profileError } = await adminSupabase
          .from("user_profiles")
          .select("user_id, email")
          .eq("email", email)
          .single();

        if (profileError || !profile) {
          return res.status(404).json({
            error: "User not found",
            details: profileError?.message,
          });
        }

        const userId = profile.user_id;

        // Delete from various tables in order
        await adminSupabase
          .from("achievements_earned")
          .delete()
          .eq("user_id", userId);

        await adminSupabase.from("applications").delete().eq("user_id", userId);

        await adminSupabase
          .from("creator_profiles")
          .delete()
          .eq("user_id", userId);

        await adminSupabase.from("projects").delete().eq("user_id", userId);

        await adminSupabase.from("social_posts").delete().eq("user_id", userId);

        await adminSupabase
          .from("user_email_links")
          .delete()
          .eq("user_id", userId);

        await adminSupabase
          .from("discord_links")
          .delete()
          .eq("user_id", userId);

        await adminSupabase.from("web3_wallets").delete().eq("user_id", userId);

        // Delete user profile
        const { error: profileDeleteError } = await adminSupabase
          .from("user_profiles")
          .delete()
          .eq("user_id", userId);

        if (profileDeleteError) {
          return res.status(500).json({
            error: "Failed to delete user profile",
            details: profileDeleteError.message,
          });
        }

        // Delete from Supabase auth
        try {
          await (adminSupabase.auth.admin as any).deleteUser(userId);
        } catch (authError: any) {
          console.warn("Auth deletion warning:", authError?.message);
        }

        return res.json({
          success: true,
          message: `User account ${email} has been successfully deleted`,
          userId,
        });
      } catch (e: any) {
        console.error("[Admin API] Error deleting user:", e?.message);
        return res.status(500).json({
          error: "Internal server error",
          message: e?.message,
        });
      }
    });
  } catch (e) {
    console.warn("Admin API not initialized:", e);
  }

  // Blog API routes
  app.get("/api/blog", blogIndexHandler);
  app.get("/api/blog/:slug", (req: express.Request, res: express.Response) => {
    return blogSlugHandler(req, res);
  });

  return app;
}
