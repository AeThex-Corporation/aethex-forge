import { VercelRequest, VercelResponse } from "@vercel/node";
import { createVerify } from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-signature-ed25519"] as string;
    const timestamp = req.headers["x-signature-timestamp"] as string;
    const publicKey = process.env.DISCORD_PUBLIC_KEY;

    if (!signature || !timestamp || !publicKey) {
      console.error("[Discord] Missing signature, timestamp, or public key");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Reconstruct raw body exactly as Discord sent it
    let rawBody: string;
    if (typeof req.body === "string") {
      rawBody = req.body;
    } else {
      rawBody = JSON.stringify(req.body);
    }

    // Create message for signature verification
    const message = `${timestamp}${rawBody}`;

    // Verify Discord's signature
    try {
      const signatureBuffer = Buffer.from(signature, "hex");
      const verifier = createVerify("ed25519");
      verifier.update(message);
      const isValid = verifier.verify(publicKey, signatureBuffer);

      if (!isValid) {
        console.error("[Discord] Signature verification failed");
        return res.status(401).json({ error: "Invalid signature" });
      }
    } catch (err: any) {
      console.error("[Discord] Signature verification error:", err.message);
      return res.status(401).json({ error: "Signature error" });
    }

    // Parse interaction
    const interaction = JSON.parse(rawBody);

    // Respond to PING with type 1
    if (interaction.type === 1) {
      console.log("[Discord] ✓ PING verified");
      return res.status(200).json({ type: 1 });
    }

    // Handle other interaction types
    console.log("[Discord] Interaction type:", interaction.type);
    return res.status(200).json({
      type: 4,
      data: { content: "Pong!" },
    });
  } catch (err: any) {
    console.error("[Discord] Error:", err?.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
