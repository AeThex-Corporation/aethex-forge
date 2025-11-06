import { VercelRequest, VercelResponse } from "@vercel/node";
import { createVerify } from "crypto";

export const config = {
  api: {
    bodyParser: {
      raw: {
        type: "application/json",
      },
    },
  },
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for Discord
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-signature-ed25519, x-signature-timestamp"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-signature-ed25519"] as string;
    const timestamp = req.headers["x-signature-timestamp"] as string;
    const publicKey = process.env.DISCORD_PUBLIC_KEY;

    console.log("[Discord] Interaction received");
    console.log("[Discord] Has signature:", !!signature);
    console.log("[Discord] Has timestamp:", !!timestamp);
    console.log("[Discord] Has public key:", !!publicKey);

    if (!publicKey) {
      console.error("[Discord] DISCORD_PUBLIC_KEY not set");
      return res.status(500).json({ error: "Server not configured" });
    }

    if (!signature || !timestamp) {
      console.error("[Discord] Missing required headers");
      return res.status(401).json({ error: "Invalid request" });
    }

    // Get raw body - Vercel sends it as Buffer with raw: true config
    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString("utf8")
        : typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body);

    // Verify signature
    const message = `${timestamp}${rawBody}`;
    console.log("[Discord] Verifying signature for message length:", message.length);

    const signatureBuffer = Buffer.from(signature, "hex");
    const verifier = createVerify("ed25519");
    verifier.update(message);
    const isValid = verifier.verify(publicKey, signatureBuffer);

    if (!isValid) {
      console.error("[Discord] Signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }

    console.log("[Discord] Signature verified successfully");

    let interaction;
    try {
      interaction = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
    } catch {
      console.error("[Discord] Failed to parse JSON body");
      return res.status(400).json({ error: "Invalid JSON" });
    }

    console.log("[Discord] Interaction type:", interaction?.type);

    // Discord sends a PING to verify the endpoint
    if (interaction?.type === 1) {
      console.log("[Discord] ✓ PING verified");
      return res.status(200).json({ type: 1 });
    }

    // For all other interactions, acknowledge them
    return res.status(200).json({
      type: 4,
      data: { content: "Interaction received" },
    });
  } catch (err: any) {
    console.error("[Discord] Error:", err?.message, err?.stack);
    return res.status(500).json({ error: "Server error" });
  }
}
