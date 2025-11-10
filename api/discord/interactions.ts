import { VercelRequest, VercelResponse } from "@vercel/node";
import { webcrypto } from "crypto";

const crypto = webcrypto as any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-signature-ed25519, x-signature-timestamp",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-signature-ed25519"] as string;
    const timestamp = req.headers["x-signature-timestamp"] as string;
    const rawPublicKey = process.env.DISCORD_PUBLIC_KEY;

    if (!signature || !timestamp || !rawPublicKey) {
      console.error("[Discord] Missing required headers or public key", {
        hasSignature: !!signature,
        hasTimestamp: !!timestamp,
        hasPublicKey: !!rawPublicKey,
      });
      return res
        .status(401)
        .json({ error: "Missing required headers or public key" });
    }

    // Reconstruct the raw body
    let rawBody: string;
    if (typeof req.body === "string") {
      rawBody = req.body;
    } else if (req.body instanceof Buffer) {
      rawBody = req.body.toString("utf8");
    } else {
      rawBody = JSON.stringify(req.body);
    }

    // Create the message that was signed
    const message = `${timestamp}${rawBody}`;

    // Convert Discord's public key (hex string) to buffer
    const publicKeyBuffer = Buffer.from(rawPublicKey, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    const messageBuffer = Buffer.from(message);

    // Use WebCrypto API for Ed25519 verification (works in Vercel)
    try {
      const publicKey = await crypto.subtle.importKey(
        "raw",
        publicKeyBuffer,
        {
          name: "Ed25519",
          namedCurve: "Ed25519",
        },
        false,
        ["verify"],
      );

      const isValid = await crypto.subtle.verify(
        "Ed25519",
        publicKey,
        signatureBuffer,
        messageBuffer,
      );

      if (!isValid) {
        console.error("[Discord] Signature verification failed");
        return res.status(401).json({ error: "Invalid signature" });
      }
    } catch (err: any) {
      console.error("[Discord] Verification error:", err?.message);
      return res.status(401).json({ error: "Signature verification failed" });
    }

    console.log("[Discord] Signature verified successfully");

    // Parse and handle the interaction
    const interaction = JSON.parse(rawBody);
    console.log("[Discord] Interaction type:", interaction.type);

    // Response to PING with type 1
    if (interaction.type === 1) {
      console.log("[Discord] PING received - responding with type 1");
      return res.status(200).json({ type: 1 });
    }

    // Handle APPLICATION_COMMAND (slash commands)
    if (interaction.type === 2) {
      const commandName = interaction.data.name;
      console.log("[Discord] Slash command received:", commandName);

      if (commandName === "creators") {
        const arm = interaction.data.options?.[0]?.value;
        const armFilter = arm ? ` (${arm})` : " (all arms)";
        return res.status(200).json({
          type: 4,
          data: {
            content: `🔍 Browse AeThex Creators${armFilter}\n\n👉 [Open Creator Directory](https://aethex.dev/creators${arm ? `?arm=${arm}` : ""})`,
            flags: 0,
          },
        });
      }

      if (commandName === "opportunities") {
        const arm = interaction.data.options?.[0]?.value;
        const armFilter = arm ? ` (${arm})` : " (all arms)";
        return res.status(200).json({
          type: 4,
          data: {
            content: `💼 Find Opportunities on Nexus${armFilter}\n\n👉 [Browse Opportunities](https://aethex.dev/opportunities${arm ? `?arm=${arm}` : ""})`,
            flags: 0,
          },
        });
      }

      if (commandName === "nexus") {
        return res.status(200).json({
          type: 4,
          data: {
            content: `✨ **AeThex Nexus** - The Talent Marketplace\n\n🔗 [Open Nexus](https://aethex.dev/nexus)\n\n**Quick Links:**\n• 🔍 [Browse Creators](https://aethex.dev/creators)\n• 💼 [Find Opportunities](https://aethex.dev/opportunities)\n• 📊 [View Metrics](https://aethex.dev/admin)`,
            flags: 0,
          },
        });
      }

      if (commandName === "verify") {
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
            process.env.SUPABASE_SERVICE_ROLE || "",
          );

          const discordId =
            interaction.user?.id || interaction.member?.user?.id;

          if (!discordId) {
            return res.status(200).json({
              type: 4,
              data: {
                content: "❌ Could not get your Discord ID. Please try again.",
                flags: 64,
              },
            });
          }

          // Generate verification code (random 6 characters)
          const verificationCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

          // Store verification code
          const { error } = await supabase
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
            return res.status(200).json({
              type: 4,
              data: {
                content:
                  "❌ Error generating verification code. Please try again.",
                flags: 64,
              },
            });
          }

          const verifyUrl = `https://aethex.dev/discord-verify?code=${verificationCode}`;

          return res.status(200).json({
            type: 4,
            data: {
              content: `✅ **Verification Code: \`${verificationCode}\`**\n\n🔗 [Click here to verify your account](${verifyUrl})\n\n⏱️ This code expires in 15 minutes.`,
              flags: 0,
            },
          });
        } catch (error: any) {
          console.error("Error in /verify command:", error);
          return res.status(200).json({
            type: 4,
            data: {
              content: "❌ An error occurred. Please try again later.",
              flags: 64,
            },
          });
        }
      }

      if (commandName === "set-realm") {
        const realmChoice = interaction.data.options?.[0]?.value;

        if (!realmChoice) {
          return res.status(200).json({
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

        return res.status(200).json({
          type: 4,
          data: {
            content: `✅ You've selected **${realmMap[realmChoice] || realmChoice}** as your primary realm!\n\n📝 Your role will be assigned based on your selection.`,
            flags: 0,
          },
        });
      }

      if (commandName === "profile") {
        const username =
          interaction.user?.username ||
          interaction.member?.user?.username ||
          "Unknown";
        const discordId =
          interaction.user?.id || interaction.member?.user?.id || "Unknown";

        return res.status(200).json({
          type: 4,
          data: {
            content: `👤 **Your AeThex Profile**\n\n**Discord:** ${username} (\`${discordId}\`)\n\n🔗 [View Full Profile](https://aethex.dev/profile)\n\n**Quick Actions:**\n• \`/set-realm\` - Choose your primary arm\n• \`/verify\` - Link your account\n• \`/verify-role\` - Check your assigned roles`,
            flags: 0,
          },
        });
      }

      if (commandName === "unlink") {
        const discordId =
          interaction.user?.id || interaction.member?.user?.id || "Unknown";

        return res.status(200).json({
          type: 4,
          data: {
            content: `🔓 **Account Unlinked**\n\nYour Discord account (\`${discordId}\`) has been disconnected from AeThex.\n\nTo link again, use \`/verify\``,
            flags: 0,
          },
        });
      }

      if (commandName === "verify-role") {
        return res.status(200).json({
          type: 4,
          data: {
            content: `✅ **Discord Roles**\n\nYour assigned AeThex roles are shown below.\n\n📊 [View Full Profile](https://aethex.dev/profile)`,
            flags: 0,
          },
        });
      }

      if (commandName === "help") {
        return res.status(200).json({
          type: 4,
          data: {
            content: `**🎯 AeThex Discord Bot Help**\n\n**Available Commands:**\n\n• \`/creators [arm]\` - Browse creators across AeThex arms\n  - Filter by: labs, gameforge, corp, foundation, nexus\n\n• \`/opportunities [arm]\` - Find job opportunities and collaborations\n  - Filter by: labs, gameforge, corp, foundation, nexus\n\n• \`/nexus\` - Explore the Talent Marketplace\n\n• \`/verify\` - Link your Discord account to AeThex\n\n• \`/set-realm\` - Choose your primary realm\n\n• \`/profile\` - View your AeThex profile\n\n• \`/unlink\` - Disconnect your Discord account\n\n• \`/verify-role\` - Check your assigned Discord roles\n\n**Learn More:**\n• 🌐 [Visit AeThex](https://aethex.dev)\n• 👥 [Join Community](https://aethex.dev/community)\n• 📚 [Documentation](https://docs.aethex.tech)`,
            flags: 0,
          },
        });
      }

      return res.status(200).json({
        type: 4,
        data: {
          content: `✨ AeThex - Advanced Development Platform\n\n**Available Commands:**\n• \`/creators [arm]\` - Browse creators across AeThex arms\n• \`/opportunities [arm]\` - Find job opportunities and collaborations\n• \`/nexus\` - Explore the Talent Marketplace\n• \`/verify\` - Link your Discord account\n• \`/set-realm\` - Choose your primary realm\n• \`/profile\` - View your AeThex profile\n• \`/unlink\` - Disconnect account\n• \`/verify-role\` - Check your Discord roles\n• \`/help\` - Show this help message`,
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
      return res.status(200).json({
        type: 4,
        data: { content: "Button clicked - feature coming soon!" },
      });
    }

    // Acknowledge all other interactions
    return res.status(200).json({
      type: 4,
      data: { content: "Interaction acknowledged" },
    });
  } catch (err: any) {
    console.error("[Discord] Error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
