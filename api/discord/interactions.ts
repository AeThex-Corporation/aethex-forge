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

      return res.status(200).json({
        type: 4,
        data: {
          content: `✨ AeThex - Advanced Development Platform\n\n**Available Commands:**\n• \`/creators [arm]\` - Browse creators across AeThex arms\n• \`/opportunities [arm]\` - Find job opportunities and collaborations\n• \`/nexus\` - Explore the Talent Marketplace`,
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
