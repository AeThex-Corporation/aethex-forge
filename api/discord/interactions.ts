import { VercelRequest, VercelResponse } from "@vercel/node";
import { createVerify } from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-signature-ed25519, x-signature-timestamp");

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
      return res.status(401).json({ error: "Missing required headers or public key" });
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

    // Convert Discord's public key (hex string) to PEM format for Ed25519
    const publicKeyBuffer = Buffer.from(rawPublicKey, "hex");
    const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${publicKeyBuffer.toString("base64")}\n-----END PUBLIC KEY-----`;

    try {
      // Verify the signature
      const signatureBuffer = Buffer.from(signature, "hex");
      const verifier = createVerify("Ed25519");
      verifier.update(message);
      const isValid = verifier.verify(publicKeyPEM, signatureBuffer);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    } catch (err) {
      // If Ed25519 fails, try with the raw key (some versions support this)
      try {
        const signatureBuffer = Buffer.from(signature, "hex");
        const verifier = createVerify("Ed25519");
        verifier.update(message);
        const isValid = verifier.verify(publicKeyBuffer, signatureBuffer);
        if (!isValid) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      } catch {
        return res.status(401).json({ error: "Signature verification failed" });
      }
    }

    // Parse and handle the interaction
    const interaction = JSON.parse(rawBody);

    // Response to PING with type 1
    if (interaction.type === 1) {
      return res.status(200).json({ type: 1 });
    }

    // Handle other interactions
    return res.status(200).json({
      type: 4,
      data: { content: "Interaction received" },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error" });
  }
}
