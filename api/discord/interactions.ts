import { VercelRequest, VercelResponse } from "@vercel/node";
import { createVerify } from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-signature-ed25519"] as string;
    const timestamp = req.headers["x-signature-timestamp"] as string;
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

    // Get raw body
    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    // Verify signature
    const message = `${timestamp}${rawBody}`;
    const signatureBuffer = Buffer.from(signature, "hex");
    const verifier = createVerify("ed25519");
    verifier.update(message);
    const isValid = verifier.verify(publicKey, signatureBuffer);

    if (!isValid) {
      console.error("[Discord] Signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const interaction =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    console.log("[Discord] Valid interaction type:", interaction.type);

    // Discord sends a PING to verify the endpoint
    if (interaction.type === 1) {
      console.log("[Discord] ✓ PING verified");
      return res.json({ type: 1 });
    }

    // For all other interactions, acknowledge them
    return res.json({
      type: 4,
      data: { content: "Interaction received" },
    });
  } catch (err: any) {
    console.error("[Discord] Error:", err?.message);
    return res.status(500).json({ error: "Server error" });
  }
}
